// backend route paths
export const API = {
    AUTH:{
        REGISTER : '/api/auth/register',  // backend to route path
        LOGIN : '/api/auth/login',
        WHOAMI: "/api/auth/whoami",
        UPDATEPROFILE: "/api/auth/update-profile",
        CHANGEPASSWORD: "/api/auth/change-password",
        DELETE_ACCOUNT: "/api/auth/delete-account",
        REQUEST_PASSWORD_RESET: '/api/auth/request-password-reset',
        RESET_PASSWORD: (token: string) => `/api/auth/reset-password/${token}`,
    },
    ADMIN: {
        PROFILE: "/api/admin/profile",
        USERS: "/api/admin/users",
        USER: (id: string) => `/api/admin/users/${id}`,
    },
    RECOMMENDATION: {
        LIST: "/api/recommendations",
    },
    SAVED_UNIVERSITY: {
        LIST: "/api/saved-universities",
        ITEM: (id: string) => `/api/saved-universities/${id}`,
    }
}
