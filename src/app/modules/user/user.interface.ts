/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import USER_ROLE from './user.constant';

export interface TUser {
  // As we are extending it, it is declared as interface instead of type
  id: string;
  email: string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  role: 'superAdmin' | 'admin' | 'student' | 'faculty';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
}

export interface UserModel extends Model<TUser> {
  isUserExistsByCustomId(id: string): Promise<TUser>;
  isPasswordMatched(plainTextPass: string, hashPass: string): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    JWTIssuedTimestamp: number,
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;

/*
Here, typeof USER_ROLE = data type of USER_ROLE =
      {
        student: 'student';
        faculty: 'faculty';
        admin: 'admin';
      }
So, keyof typeof USER_ROLE = 'student' | 'faculty' | 'admin'
*/
