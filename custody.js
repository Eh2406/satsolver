import { init } from 'z3-solver';

const NON_WORKING_WEEKEND_DAYS = [0, 13, 14, 20, 21, 34, 35, 41];
const WORKING_WEEKEND_DAYS = [6, 7, 27, 28];

const useSolver = async (numberOfResults = 1) => {
  const z3 = await init();
  const {Context} = z3;
  const context = new Context('main');
  const solver = new context.Solver();

  const custody = [];
  const work = [];

  for(let index = 0; index < 42; index++) {
    custody.push(context.Int.const(`custody_${index}`));
    work.push(context.Int.const(`work_${index}`));
  }

  // add constraints

  // custody either be Shanon or Chaim
  custody.forEach((day) => {
    solver.add(day.ge(0));
    solver.add(day.le(1));
  });

  // work either be not working or working
  work.forEach((day) => {
    solver.add(day.ge(0));
    solver.add(day.le(1));
  });

  // chaim and shanon should have equal days (21 days each)
  const custodySum = custody.reduce((acc, day) => acc.add(day), context.Int.val(0));
  solver.add(custodySum.eq(21));

  // chaim and shanon should have equal weekend days (6 days each)
  const weekendCustody = (NON_WORKING_WEEKEND_DAYS.concat(WORKING_WEEKEND_DAYS)).reduce((acc, day) => acc.add(custody[day]), context.Int.val(0));
  solver.add(weekendCustody.eq(6));

  // each 7 days chaim and shanon should have at least 1 day of custody
  for(let day = 0; day < 42; day++) {
    const custodyWeek = [];
    for(let i = 0; i < 7; i++) {
      const dayIndex = (day + i) % 42; // Wrap around
      custodyWeek.push(custody[dayIndex]);
    }
    const weekSum = custodyWeek.reduce((acc, day) => acc.add(day), context.Int.val(0));
    solver.add(weekSum.ge(1));
    solver.add(weekSum.le(6));
  }
  
  // no single day of custody
  for(let day = 0; day < 42; day++) {
    solver.add(
      context.Or(
        custody[day].eq(custody[(day + 1) % 42]),
        custody[day].eq(custody[(day + 41) % 42])
      )
    );
  }

  // each week shanon should work 2 day
  for(let day = 0; day < 42; day += 7) {
    const workWeek = work.slice(day, day + 7).reduce((acc, day) => acc.add(day), context.Int.val(0));
    solver.add(workWeek.ge(2));
  }

  // shanon can't work on the 1 and 4 day of the week
  for(let day = 1; day < 42; day += 7) {
    solver.add(work[day].eq(0));
    solver.add(work[day + 3].eq(0));
  }

  // shanon works on the 6, 7, 27,28
  WORKING_WEEKEND_DAYS.forEach(day => {
    solver.add(work[day].eq(1));
  });
  NON_WORKING_WEEKEND_DAYS.forEach(day => {
    solver.add(work[day].eq(0));
  });

  // shanon cant have custody if she is working
  for(let day = 0; day < 42; day++) {
    solver.add(custody[day].eq(1).implies(work[day].eq(0)));
    solver.add(custody[day].eq(1).implies(work[(day + 1) % 42].eq(0)));
  }
  
  const results = [];
  
  // Find multiple solutions
  for (let i = 0; i < numberOfResults; i++) {
    const checkResult = await solver.check();
    
    if (checkResult !== 'sat') {
      break; // No more solutions
    }
    
    const model = solver.model();
    
    // Extract current solution
    const currentSolution = {
      custody: custody.map(day => model.eval(day).toString()),
      work: work.map(day => model.eval(day).toString())
    };
    
    results.push(currentSolution);
    
    // Exclude this solution: at least one variable must be different
    // Create: OR(custody[0] != value0, custody[1] != value1, ..., work[0] != value0, ...)
    const exclusionConstraints = [];
    
    // Add constraints for all custody variables
    custody.forEach((day, index) => {
      const value = model.eval(day);
      exclusionConstraints.push(day.neq(value));
    });
    
    // Add constraints for all work variables
    work.forEach((day, index) => {
      const value = model.eval(day);
      exclusionConstraints.push(day.neq(value));
    });
    
    // At least one must be different
    solver.add(context.Or(...exclusionConstraints));
  }
  
  return results;
}


useSolver(500).then(result => {
  console.log(result.length);
});

export default useSolver;
