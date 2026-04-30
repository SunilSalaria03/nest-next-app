import { User } from 'src/modules/users/schemas/user.schema';

export interface AuthData {
  user: User;
  token: string;
}

export interface AuthResponse {
  message: string;
  data: AuthData;
}
