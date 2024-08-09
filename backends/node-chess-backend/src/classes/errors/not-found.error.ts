import { EErrorTitles } from "../../enums/error-titles.enum";
import { IError } from "../../interfaces/responses/error.interface";

export class NotFoundError {
    title: string;
    reason: string;

    constructor(title: string, reason: string) {
        this.title = title;
        this.reason = reason;
    }

    build(): IError {
        return {
            error: EErrorTitles.NOT_FOUND,
            title: this.title,
            reason: this.reason
        } as IError;
    }

    static byId(modelName: string): NotFoundError {
        return new NotFoundError(
            `${modelName} not found`,
            `Could not find ${modelName} with provided id`
        );
    }

    static path(path: string): NotFoundError {
        return new NotFoundError(
            'Path not found',
            `Path ${path} does not exist`
        );
    }
}