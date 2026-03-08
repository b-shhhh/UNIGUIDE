import {
  getAllUniversitiesService,
  getCountriesService,
  getCoursesService,
  getUniversityDetailService,
  getUniversitiesByIdsService,
  getUniversitiesService
} from "../../services/university.service";

jest.mock("../../models/university.model", () => ({
  University: {
    find: jest.fn(),
    distinct: jest.fn(),
    findOne: jest.fn()
  }
}));

jest.mock("mongoose", () => ({
  Types: {
    ObjectId: {
      isValid: jest.fn((value: string) => value === "507f1f77bcf86cd799439011")
    }
  }
}));

const { University } = require("../../models/university.model");

describe("services/university.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("maps universities into API shape", async () => {
    University.find.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue([
          {
            _id: "db-1",
            sourceId: "src-1",
            alpha2: "np",
            country: "Nepal",
            name: "Uni One",
            courses: ["CS"],
            ieltsMin: "7",
            satRequired: true,
            satMin: 1200
          }
        ])
      })
    });

    await expect(getAllUniversitiesService()).resolves.toEqual([
      expect.objectContaining({
        id: "src-1",
        dbId: "db-1",
        alpha2: "NP",
        country: "Nepal",
        name: "Uni One",
        courses: ["CS"],
        ieltsMin: null,
        satRequired: true,
        satMin: 1200
      })
    ]);
  });

  test("returns sorted country names", async () => {
    University.distinct.mockResolvedValue(["Nepal", "", "Australia"]);
    await expect(getCountriesService()).resolves.toEqual(["Australia", "Nepal"]);
  });

  test("filters universities by country or alpha2", async () => {
    University.find.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue([{ _id: "db-2", country: "Nepal", name: "Uni Two", courses: [] }])
      })
    });

    await expect(getUniversitiesService("np")).resolves.toEqual([
      expect.objectContaining({ id: "db-2", country: "Nepal", name: "Uni Two" })
    ]);
    expect(University.find).toHaveBeenCalledWith({ $or: [{ country: /^np$/i }, { alpha2: "NP" }] });
  });

  test("finds university detail by source id or object id", async () => {
    University.findOne.mockReturnValue({
      lean: jest.fn().mockResolvedValue({
        _id: "507f1f77bcf86cd799439011",
        sourceId: "src-3",
        country: "Australia",
        name: "Uni Three",
        courses: ["IT"]
      })
    });

    await expect(getUniversityDetailService("507f1f77bcf86cd799439011")).resolves.toEqual(
      expect.objectContaining({ id: "src-3", dbId: "507f1f77bcf86cd799439011" })
    );
    expect(University.findOne).toHaveBeenCalledWith({
      $or: [{ sourceId: "507f1f77bcf86cd799439011" }, { _id: "507f1f77bcf86cd799439011" }]
    });
  });

  test("throws when university detail is missing", async () => {
    University.findOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });
    await expect(getUniversityDetailService("missing")).rejects.toThrow("University not found");
  });

  test("returns universities for valid ids and short-circuits empty lookups", async () => {
    University.find.mockReturnValue({
      lean: jest.fn().mockResolvedValue([{ _id: "db-4", sourceId: "src-4", country: "Nepal", name: "Uni Four", courses: [] }])
    });

    await expect(getUniversitiesByIdsService(["src-4", "507f1f77bcf86cd799439011"])).resolves.toEqual([
      expect.objectContaining({ id: "src-4" })
    ]);
    await expect(getUniversitiesByIdsService([])).resolves.toEqual([]);
  });

  test("returns all courses or a specific course", async () => {
    University.find.mockReturnValue({
      lean: jest.fn().mockResolvedValue([{ courses: ["CS", " Math "] }, { courses: ["Design"] }])
    });

    await expect(getCoursesService()).resolves.toEqual(["CS", "Design", "Math"]);
    await expect(getCoursesService("math")).resolves.toBe("Math");
    await expect(getCoursesService("law")).rejects.toThrow("Course not found");
  });
});
