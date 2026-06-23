import { Types } from 'mongoose';
import { USER_ROLES } from './user.constant';

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface IAuthProvider {
  provider: 'google' | 'Credentials'; //"Google" , "Credentials"
  providerId: string;
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  photoUrl?: string;
  auths: IAuthProvider[];
  role: Role;
  userStatus?: 'ACTIVE' | 'INACTIVE';
  cart?: Types.ObjectId[]; // ref Cart
  orderHistory?: Types.ObjectId[];
}
export type TUserRoles = (typeof USER_ROLES)[keyof typeof USER_ROLES];
