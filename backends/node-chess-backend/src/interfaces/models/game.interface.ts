import { Types } from "mongoose";
import { IBase } from "./base.interface";

export interface IGame extends IBase {
    name: string;
    whitePlayerId: Types.ObjectId | undefined;
    blackPlayerId: Types.ObjectId | undefined;
}
