export interface UserPayload {
  id: number;
  email?: string;
  phone_number?: string;
  full_name: string;
  avatar_url?: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
