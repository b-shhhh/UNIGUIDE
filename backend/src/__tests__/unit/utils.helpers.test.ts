import { buildSearchRegex, normalizeText, toPagination } from "../../utils/helpers";

describe("utils/helpers", () => {
  test("normalizeText trims and lowercases", () => {
    expect(normalizeText("  Hello  ")).toBe("hello");
  });

  test("toPagination clamps values", () => {
    expect(toPagination(-1, 500)).toEqual({ page: 1, limit: 100, skip: 0 });
  });

  test("buildSearchRegex escapes special chars", () => {
    const regex = buildSearchRegex("uni.*");
    expect(regex!.test("UNI.*")).toBe(true);
  });
});
