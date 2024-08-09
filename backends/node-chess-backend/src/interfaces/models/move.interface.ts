import { Types } from "mongoose";
import { IBase } from "./base.interface";

export interface IPosition {
    column: string;
    row: Number;
}

export interface IMove extends IBase {
    from: IPosition;
    to: IPosition;
    gameId: Types.ObjectId;
}