/**
 * Manual Jest mock for src/lib/supabase.ts
 *
 * Provides a chainable query builder that mirrors the Supabase JS client.
 * Tests control results via __setNextResult() or __setResultQueue().
 */

type MockResult = { data: unknown; error: unknown };

let _resultQueue: MockResult[] = [];
const _defaultResult: MockResult = { data: null, error: null };

/** Set a single result for the next query. */
export function __setNextResult(result: MockResult): void {
  _resultQueue = [result];
}

/** Set multiple results consumed in order (for functions that make sequential queries). */
export function __setResultQueue(results: MockResult[]): void {
  _resultQueue = [...results];
}

/** Reset all state between tests. */
export function __resetMock(): void {
  _resultQueue = [];
  mockFrom.mockClear();
}

function createQueryBuilder(): Record<string, jest.Mock> {
  const builder: Record<string, jest.Mock> = {};

  const methods = [
    "select", "insert", "update", "delete", "upsert",
    "eq", "neq", "in", "gt", "gte", "lt", "lte",
    "like", "ilike", "is", "filter", "not", "or", "overlaps", "contains",
    "order", "limit", "range", "single", "maybeSingle",
  ];

  for (const m of methods) {
    builder[m] = jest.fn(() => builder);
  }

  // PromiseLike — `await supabase.from(...).select(...)` triggers this
  builder.then = jest.fn((onfulfilled?: (value: MockResult) => unknown) => {
    const result = _resultQueue.length > 0 ? _resultQueue.shift()! : _defaultResult;
    return Promise.resolve(result).then(onfulfilled);
  });

  return builder;
}

const mockFrom = jest.fn((_table: string) => createQueryBuilder());

export const supabase = {
  from: mockFrom,
};
