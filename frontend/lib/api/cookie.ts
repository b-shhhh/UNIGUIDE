"use server"
import { cookies } from "next/headers"

const isProd = process.env.NODE_ENV === "production";

const baseCookieOptions = {
    httpOnly: true as const,
    sameSite: "lax" as const,
    secure: isProd,
    path: "/",
};

export const setAuthToken = async (token: string) => {
    const cookieStore = await cookies();
    cookieStore.set({ name: "auth_token", value: token, ...baseCookieOptions })
}
export const getAuthToken = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    return token || null;
}
export const setUserData = async (userData: unknown) => {
    const cookieStore = await cookies();
    cookieStore.set({ name: "user_data", value: JSON.stringify(userData), ...baseCookieOptions })
}
export const getUserData = async <T = unknown>() => {
    const cookieStore = await cookies();
    const userData = cookieStore.get("user_data")?.value;
    if (userData) {
        return JSON.parse(userData) as T;
    }
    return null;
}
export const clearAuthCookies = async () => {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
    cookieStore.delete("user_data");
}
