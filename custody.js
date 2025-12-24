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

  // sum of custody should be 21
  const custodySum = custody.reduce((acc, day) => acc.add(day), context.Int.val(0));
  solver.add(custodySum.eq(21));

  // each 7 days chaim and shanon should have at least 1 day of custody
  for(let day = 0; day < 42; day += 7) {
    const custodyWeek = custody.slice(day, day + 7).reduce((acc, day) => acc.add(day), context.Int.val(0));
    solver.add(custodyWeek.ge(1));
    solver.add(custodyWeek.le(6));
  }

  // chaim and shanon should have equal weekend days
  
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

  if(await solver.check() !== 'sat'){ return solver.check(); }

  const model = solver.model();

  const results = {};

  results.custody = custody.map(day => model.eval(day).toString());
  results.work = work.map(day => model.eval(day).toString());

  return results;
}

useSolver(5).then(result => {
  console.log(result);
});
