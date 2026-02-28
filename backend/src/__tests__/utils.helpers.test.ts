import { buildSearchRegex, normalizeText, readCsvFile, toPagination } from "../utils/helpers";

jest.mock("fs/promises", () => ({
  readFile: jest.fn(async (_path: string) => "name,age\nalice,21")
}));

describe("utils/helpers", () => {
  test("normalizeText trims and lowercases", () => {
    expect(normalizeText("  Hello World ")).toBe("hello world");
  });

  test("toPagination clamps page and limit", () => {
    const result = toPagination(-2, 1000);
    expect(result).toEqual({ page: 1, limit: 100, skip: 0 });
  });

  test("toPagination computes skip correctly", () => {
    const result = toPagination(3, 10);
    expect(result.skip).toBe(20);
  });

  test("buildSearchRegex returns null for empty", () => {
    expect(buildSearchRegex("   ")).toBeNull();
  });

  test("buildSearchRegex escapes special characters", () => {
    const regex = buildSearchRegex("uni.*(test)");
    expect(regex).toBeInstanceOf(RegExp);
    expect(regex!.source).toBe("uni\\.\\*\\(test\\)");
  });

  test("buildSearchRegex is case-insensitive", () => {
    const regex = buildSearchRegex("Harvard");
    expect(regex!.test("harvard university")).toBe(true);
  });

  test("readCsvFile returns file content", async () => {
    const data = await readCsvFile("dummy.csv");
    expect(data).toContain("alice");
  });

  test("normalizeText handles empty string", () => {
    expect(normalizeText("")).toBe("");
  });

  test("toPagination defaults when inputs undefined", () => {
    const result = toPagination(undefined, undefined);
    expect(result).toEqual({ page: 1, limit: 10, skip: 0 });
  });

  test("buildSearchRegex matches substring", () => {
    const regex = buildSearchRegex("king");
    expect(regex!.test("viking saga")).toBe(true);
  });
});
