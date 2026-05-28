export interface UpdateProfileDto {
  full_name?: string;
  avatar_url?: string;
  phone_number?: string;
  dob?: string | Date;
  height?: number;
  weight?: number;
  workout_goal?: string;
  medical_history?: string;
  gender?: string;
  age?: number;
}

export interface CreateUserDto {
  name: string;
}
