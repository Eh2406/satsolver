import { init } from 'z3-solver';

const useSolver = async (numberOfResults) => {
  const z3 = await init();
  const {Context} = z3;
  const context = new Context('main');
  const solver = new context.Solver();

  const x = context.Int.const('x');
  const y = context.Int.const('y');

  solver.add(x.add(y).eq(10));
  solver.add(x.gt(0));
  solver.add(y.gt(0));

  const result = await solver.check();

  if(!numberOfResults) {
    return result === 'sat';
  }

  return solver.model().toString();
}

useSolver(5).then(result => {
  console.log(result);
});
