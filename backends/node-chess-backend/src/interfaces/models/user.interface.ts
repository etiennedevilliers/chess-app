import { IBase } from "./base.interface";

export interface IUser extends IBase {
    unique: string;
    passwordHash: string;
}
