import { NextFunction, Request, Response } from "express"

export function created(req: Request, res: Response, next: NextFunction) {
    res.status(201).send(res.locals.result);
}

export function ok(req: Request, res: Response, next: NextFunction) {
    res.status(200).send(res.locals.result);
}

export function noContent(req: Request, res: Response, next: NextFunction) {
    res.status(204).send();
}
