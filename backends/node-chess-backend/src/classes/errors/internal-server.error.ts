import { EErrorTitles } from "../../enums/error-titles.enum";
import { IError } from "../../interfaces/responses";



export class InternalServerError {
    error: any;

    constructor(err: any) {
        this.error = err;
    }

    build(): IError {
        if (this.error instanceof Error) {
            return {
                error: EErrorTitles.INTERNAL_SERVER,
                reason: {
                    name: (this.error as Error).name,
                    message: (this.error as Error).message,
                    stack: (this.error as Error).stack
                }
            } as IError;
        }

        return {
            error: EErrorTitles.INTERNAL_SERVER,
            reason: JSON.stringify(this.error)
        } as IError;
    }
} 
