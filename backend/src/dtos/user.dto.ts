export interface RegisterDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNo: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface UpdateProfileDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNo?: string;
  profile_pic?: string;
}
