import { describe,test, expect } from 'vitest';
import useSolver from './custody.js';

describe('useSolver signature', () => {
  test('useSolver should be a function', () => {
    expect(useSolver).toBeInstanceOf(Function);
  });

  test('useSolver should return a promise', () => {
    expect(useSolver()).toBeInstanceOf(Promise);
  });

  test('useSolver should return an array of results', async () => {
    expect(await useSolver()).toBeInstanceOf(Array);
  });
});

describe('useSolver validate results', () => {
  test('useSolver should return an array of results', async () => {
    const result = await useSolver();
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBe(1);
    const solution = result[0];
    expect(solution).toHaveProperty('custody');
    expect(solution).toHaveProperty('work');
    expect(solution.custody.length).toBe(42);
    expect(solution.work.length).toBe(42);
    expect(Math.max(...solution.custody)).toBe(1);
    expect(Math.min(...solution.custody)).toBe(0);
  });

  test('useSolver results should have equal days for Shaon and Chaim', { timeout: 60000 }, async () => {
    const results = await useSolver(500);
    expect(results.length).toBe(28);
  });

});
