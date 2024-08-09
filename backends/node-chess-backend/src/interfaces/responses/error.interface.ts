import { EErrorTitles } from "../../enums/error-titles.enum";

export interface IError {
    error: EErrorTitles,
    title?: string,
    reason?: any,
}