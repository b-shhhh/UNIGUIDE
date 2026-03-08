import { getRecommendationsService } from "../../services/recommendation.service";

jest.mock("../../services/university.service", () => ({
  getAllUniversitiesService: jest.fn()
}));

const { getAllUniversitiesService } = require("../../services/university.service");

describe("services/recommendation.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("builds recommendation stats, items, and deadlines", async () => {
    getAllUniversitiesService.mockResolvedValue([
      {
        id: "uni-1",
        name: "Alpha University",
        courses: ["Computer Science"],
        country: "Nepal",
        flag_url: "flag-1",
        logo_url: "logo-1",
        web_pages: "https://alpha.test"
      },
      {
        id: "uni-2",
        name: "Beta University",
        courses: [],
        country: "Australia",
        flag_url: "",
        logo_url: "",
        web_pages: ""
      }
    ]);

    const result = await getRecommendationsService();

    expect(result.stats).toEqual([
      { label: "Matches", value: "2" },
      { label: "Countries", value: "2" },
      { label: "Courses", value: "2" },
      { label: "Top Fit", value: expect.stringMatching(/^\d+%$/) }
    ]);
    expect(result.recommendations[0]).toEqual(
      expect.objectContaining({
        id: "uni-1",
        program: "Computer Science",
        country: "Nepal",
        website: "https://alpha.test",
        description: "Alpha University offers Computer Science in Nepal."
      })
    );
    expect(result.recommendations[1]).toEqual(
      expect.objectContaining({
        program: "General Studies",
        duration: "1.5 years",
        intake: "January"
      })
    );
    expect(result.deadlines).toHaveLength(3);
  });
});
