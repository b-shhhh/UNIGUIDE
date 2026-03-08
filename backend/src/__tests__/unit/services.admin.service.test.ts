import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { adminLoginService, adminProfileService } from "../../services/admin/admin.service";
import {
  createAdminUniversityService,
  deleteAdminUniversityService,
  getAdminUniversityByIdService,
  listAdminUniversitiesService,
  updateAdminUniversityService
} from "../../services/admin/university.service";
import {
  deleteAdminUserByIdService,
  getAdminUserByIdService,
  listAdminUsersService,
  updateAdminUserByIdService
} from "../../services/admin/user.service";

jest.mock("../../models/user.model", () => ({
  User: {
    findOne: jest.fn(),
    findById: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn()
  }
}));

jest.mock("../../models/university.model", () => ({
  University: {
    find: jest.fn(),
    countDocuments: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn()
  }
}));

jest.mock("bcrypt", () => ({
  compare: jest.fn(),
  hash: jest.fn(async (value: string) => `hashed-${value}`)
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "admin-jwt")
}));

const { User } = require("../../models/user.model");
const { University } = require("../../models/university.model");

describe("services/admin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("adminLoginService validates admin credentials and returns a token", async () => {
    User.findOne.mockResolvedValue({
      _id: "admin-id",
      fullName: "Admin",
      email: "admin@gmail.com",
      role: "admin",
      password: "hashed",
      phone: "123",
      country: "NP",
      bio: "bio",
      profilePic: "pic"
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await adminLoginService(" Admin@Gmail.com ", "secret");

    expect(User.findOne).toHaveBeenCalledWith({ email: "admin@gmail.com" });
    expect(jwt.sign).toHaveBeenCalled();
    expect(result).toEqual(
      expect.objectContaining({
        token: "admin-jwt",
        user: expect.objectContaining({ id: "admin-id", role: "admin" })
      })
    );
  });

  test("adminLoginService rejects invalid users and bad passwords", async () => {
    User.findOne.mockResolvedValueOnce(null);
    await expect(adminLoginService("missing@test.com", "secret")).rejects.toThrow("Invalid email or password");

    User.findOne.mockResolvedValueOnce({ email: "user@test.com", role: "user", password: "hashed" });
    await expect(adminLoginService("user@test.com", "secret")).rejects.toThrow("Admin access required");

    User.findOne.mockResolvedValueOnce({ _id: "1", email: "admin@gmail.com", role: "admin", password: "hashed" });
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);
    await expect(adminLoginService("admin@gmail.com", "wrong")).rejects.toThrow("Invalid email or password");
  });

  test("adminProfileService returns admin profile and rejects invalid roles", async () => {
    User.findById.mockReturnValueOnce({
      select: jest.fn().mockResolvedValue({ _id: "1", role: "admin" })
    });
    await expect(adminProfileService("1")).resolves.toEqual({ _id: "1", role: "admin" });

    User.findById.mockReturnValueOnce({
      select: jest.fn().mockResolvedValue(null)
    });
    await expect(adminProfileService("1")).rejects.toThrow("Admin not found");

    User.findById.mockReturnValueOnce({
      select: jest.fn().mockResolvedValue({ _id: "1", role: "user" })
    });
    await expect(adminProfileService("1")).rejects.toThrow("Admin access required");
  });

  test("listAdminUsersService builds filters and pagination", async () => {
    const limitChain = jest.fn().mockResolvedValue([{ _id: "1" }]);
    const skipChain = jest.fn(() => ({ limit: limitChain }));
    const sortChain = jest.fn(() => ({ skip: skipChain }));
    const selectChain = jest.fn(() => ({ sort: sortChain }));
    User.find.mockReturnValue({ select: selectChain });
    User.countDocuments.mockResolvedValue(3);

    const result = await listAdminUsersService({ page: "2", limit: "2", search: " jane ", role: "admin" });

    expect(User.find).toHaveBeenCalledWith({
      role: "admin",
      $or: [{ fullName: / jane /i }, { email: / jane /i }, { phone: / jane /i }]
    });
    expect(result.pagination).toEqual({ page: 2, limit: 2, total: 3, totalPages: 2 });
  });

  test("admin user services fetch, update, and delete users", async () => {
    User.findById.mockReturnValueOnce({
      select: jest.fn().mockResolvedValue({ _id: "1" })
    });
    await expect(getAdminUserByIdService("1")).resolves.toEqual({ _id: "1" });

    User.findById.mockReturnValueOnce({
      select: jest.fn().mockResolvedValue(null)
    });
    await expect(getAdminUserByIdService("1")).rejects.toThrow("User not found");

    User.findByIdAndUpdate.mockReturnValueOnce({
      select: jest.fn().mockResolvedValue({ _id: "1", email: "admin@test.com" })
    });
    await expect(
      updateAdminUserByIdService("1", {
        fullName: " Admin ",
        email: " ADMIN@Test.com ",
        phone: " 123 ",
        role: "admin",
        country: " NP ",
        bio: " bio ",
        password: " secret "
      })
    ).resolves.toEqual({ _id: "1", email: "admin@test.com" });
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      "1",
      expect.objectContaining({
        fullName: "Admin",
        email: "admin@test.com",
        phone: "123",
        role: "admin",
        country: "NP",
        bio: "bio",
        password: "hashed-secret"
      }),
      { returnDocument: "after" }
    );

    User.findByIdAndUpdate.mockReturnValueOnce({
      select: jest.fn().mockResolvedValue(null)
    });
    await expect(updateAdminUserByIdService("1", {})).rejects.toThrow("User not found");

    User.findByIdAndDelete.mockResolvedValueOnce({ _id: "1" });
    await expect(deleteAdminUserByIdService("1")).resolves.toEqual({ _id: "1" });

    User.findByIdAndDelete.mockResolvedValueOnce(null);
    await expect(deleteAdminUserByIdService("1")).rejects.toThrow("User not found");
  });

  test("admin university services list, fetch, create, update, and delete items", async () => {
    const limitChain = jest.fn().mockResolvedValue([{ _id: "u1" }]);
    const skipChain = jest.fn(() => ({ limit: limitChain }));
    const sortChain = jest.fn(() => ({ skip: skipChain }));
    University.find.mockReturnValueOnce({ sort: sortChain });
    University.countDocuments.mockResolvedValueOnce(4);

    const listResult = await listAdminUniversitiesService({ page: "2", limit: "3", search: " uni ", country: "Nepal" });
    expect(University.find).toHaveBeenCalledWith({
      country: "Nepal",
      $or: [
        { name: / uni /i },
        { country: / uni /i },
        { state: / uni /i },
        { city: / uni /i },
        { courses: / uni /i },
        { courseCategories: / uni /i }
      ]
    });
    expect(listResult.pagination).toEqual({ page: 2, limit: 3, total: 4, totalPages: 2 });

    University.findById.mockResolvedValueOnce({ _id: "u1" });
    await expect(getAdminUniversityByIdService("u1")).resolves.toEqual({ _id: "u1" });

    University.findById.mockResolvedValueOnce(null);
    await expect(getAdminUniversityByIdService("u1")).rejects.toThrow("University not found");

    University.create.mockResolvedValueOnce({ _id: "u2", courses: ["CS", "Math"] });
    await expect(
      createAdminUniversityService({
        name: " Uni ",
        country: " Nepal ",
        courses: "CS, Math",
        description: " Test "
      })
    ).resolves.toEqual({ _id: "u2", courses: ["CS", "Math"] });

    University.findByIdAndUpdate.mockResolvedValueOnce({ _id: "u3" });
    await expect(
      updateAdminUniversityService("u3", {
        name: " Uni ",
        country: " Nepal ",
        courses: [" CS ", "Math"],
        description: " Desc "
      })
    ).resolves.toEqual({ _id: "u3" });
    expect(University.findByIdAndUpdate).toHaveBeenCalledWith(
      "u3",
      {
        name: "Uni",
        country: "Nepal",
        description: "Desc",
        courses: ["CS", "Math"]
      },
      { returnDocument: "after" }
    );

    University.findByIdAndUpdate.mockResolvedValueOnce(null);
    await expect(updateAdminUniversityService("u3", {})).rejects.toThrow("University not found");

    University.findByIdAndDelete.mockResolvedValueOnce({ _id: "u4" });
    await expect(deleteAdminUniversityService("u4")).resolves.toEqual({ _id: "u4" });

    University.findByIdAndDelete.mockResolvedValueOnce(null);
    await expect(deleteAdminUniversityService("u4")).rejects.toThrow("University not found");
  });
});
