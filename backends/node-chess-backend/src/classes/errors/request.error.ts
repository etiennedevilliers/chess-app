import { EErrorTitles } from "../../enums/error-titles.enum";
import { IError } from "../../interfaces/responses/error.interface";

export class RequestError {
    title: string;
    reason: string;

    constructor(title: string, reason: string) {
        this.title = title;
        this.reason = reason;
    }

    build(): IError {
        return {
            error: EErrorTitles.REQUEST,
            title: this.title,
            reason: this.reason
        } as IError;
    }
}