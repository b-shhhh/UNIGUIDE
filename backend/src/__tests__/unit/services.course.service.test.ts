import {
  getAllCourses,
  getCourseById,
  getCountriesForCourse,
  getCoursesByCountry
} from "../../services/course.service";

jest.mock("../../models/university.model", () => ({
  University: {
    find: jest.fn()
  }
}));

const { University } = require("../../models/university.model");

describe("services/course.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getAllCourses returns unique sorted course names", async () => {
    University.find.mockReturnValue({
      lean: jest.fn().mockResolvedValue([
        { courses: ["CS", " Math ", "", "CS"] },
        { courses: ["Biology"] }
      ])
    });

    await expect(getAllCourses()).resolves.toEqual(["Biology", "CS", "Math"]);
  });

  test("getCoursesByCountry matches either country name or alpha2", async () => {
    University.find.mockReturnValue({
      lean: jest.fn().mockResolvedValue([{ courses: ["Engineering", "Arts"] }])
    });

    const result = await getCoursesByCountry("np");

    expect(University.find).toHaveBeenCalledWith(
      { $or: [{ country: /^np$/i }, { alpha2: "NP" }] },
      { courses: 1 }
    );
    expect(result).toEqual(["Arts", "Engineering"]);
  });

  test("getCourseById returns matching course and throws when missing", async () => {
    University.find.mockReturnValue({
      lean: jest.fn().mockResolvedValue([{ courses: ["Data Science", "Design"] }])
    });

    await expect(getCourseById("data science")).resolves.toBe("Data Science");
    await expect(getCourseById("law")).rejects.toThrow("Course not found");
  });

  test("getCountriesForCourse returns unique countries and throws when missing", async () => {
    University.find.mockReturnValue({
      select: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue([
          { country: "Nepal", courses: ["CS", "Math"] },
          { country: "Australia", courses: ["cs"] },
          { country: "Nepal", courses: ["CS"] }
        ])
      })
    });

    await expect(getCountriesForCourse("CS")).resolves.toEqual(["Australia", "Nepal"]);
    await expect(getCountriesForCourse("History")).rejects.toThrow("Course not found in any country");
  });
});
