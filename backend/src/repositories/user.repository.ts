// src/repositories/user.repository.ts
import { User, IUser } from "../models/user.model";
import mongoose from "mongoose";

export class UserRepository {
    async createUser(data: Partial<IUser>): Promise<IUser> {
        const user = new User(data);
        return user.save();
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return User.findOne({ email });
    }

    async findById(id: string): Promise<IUser | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) return null;
        return User.findById(id).populate("savedUniversities");
    }

    async updateProfile(id: string, data: Partial<IUser>): Promise<IUser | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) return null;
        return User.findByIdAndUpdate(id, data, { new: true });
    }

    async addSavedUniversity(userId: string, universityId: string) {
        return User.findByIdAndUpdate(
            userId,
            { $addToSet: { savedUniversities: universityId } },
            { new: true }
        ).populate("savedUniversities");
    }

    async removeSavedUniversity(userId: string, universityId: string) {
        return User.findByIdAndUpdate(
            userId,
            { $pull: { savedUniversities: universityId } },
            { new: true }
        ).populate("savedUniversities");
    }
}
