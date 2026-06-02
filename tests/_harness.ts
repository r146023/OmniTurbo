import { expect, test as vitestTest } from "vitest";

export type TestFn = () => void | Promise<void>;

/**
 * Thin compatibility layer for the generated Omni tests.
 *
 * The first version of this suite used a custom runner. In real projects, Vitest
 * discovers suites by calls to Vitest's own `test()` function, so this harness
 * now re-exports Vitest's test function while preserving the small assertion
 * helpers used throughout the generated files.
 */
export const test = vitestTest;

export function assert(condition: unknown, message = "Assertion failed"): asserts condition {
  expect(condition, message).toBeTruthy();
}

export function assertEquals<T>(actual: T, expected: T, message?: string): void {
  expect(actual, message).toBe(expected);
}

export function assertDeepEquals(actual: unknown, expected: unknown, message?: string): void {
  expect(actual, message).toEqual(expected);
}

export function assertThrows(fn: () => unknown, message?: string): void {
  expect(fn, message).toThrow();
}

/**
 * Kept only so older package scripts that import `tests/run_all_tests.ts` do not
 * fail. Vitest is now the canonical runner, so this function intentionally does
 * nothing.
 */
export async function run(): Promise<void> {
  // no-op: Vitest collects and runs each test as the files are imported.
}
