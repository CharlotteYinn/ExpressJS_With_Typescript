import { User } from '../models/user'; // Adjust the path to your user model if necessary

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
