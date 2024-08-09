import { NextFunction, Request } from "express";
import { WSResponse } from "websocket-express";

export async function upgrade(req: Request, res: WSResponse, next: NextFunction) {
    const ws = await res.accept();

    res.locals.ws = ws;

    next();
}

export async function keepConnectionOpen(req: Request, res: WSResponse, next: NextFunction) {
    
}