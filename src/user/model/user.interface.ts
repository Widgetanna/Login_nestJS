export interface IUser {
  id?: number;
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  role?: string;
}
export enum UserRole {
  ADMIN = 'admin',
  CHIEFEDITOR = 'chiefeditor',
  USER = 'user',
  EDITOR = 'editor',
}
