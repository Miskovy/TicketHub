import { Request } from "express";

export interface AppUser {
  id: number;
  roles?: string[];
}

// Extend Express Request with your custom user type
export interface AuthenticatedRequest extends Request {
  user?: AppUser; // Make user required
}

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends AppUser { }

    interface Request {
      user?: User;
    }
  }
}
