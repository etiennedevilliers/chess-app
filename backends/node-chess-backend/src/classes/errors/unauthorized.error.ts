import { EErrorTitles } from "../../enums/error-titles.enum";
import { IError } from "../../interfaces/responses";

export class UnauthorizedError {
    reason: string;

    constructor(reason: string) {
        this.reason = reason;
    }

    build(): IError {
        return {
            error: EErrorTitles.UNAUTHORIZED,
            title: 'Unauthorized',
            reason: this.reason,
        } as IError;
    }
}