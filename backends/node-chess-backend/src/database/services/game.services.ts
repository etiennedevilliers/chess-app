import { HydratedDocument, Types } from "mongoose";
import { IGame } from "../../interfaces/models";
import { GameModel, GameSchema } from "../models";
import * as mongodb from "mongodb";

export async function create(
    document: Omit<IGame, '_id' | 'createdAt' | 'updatedAt' | 'deleted' | 'deletedAt'>,
): Promise<HydratedDocument<IGame, unknown, unknown>> {
    const date = new Date();

    return GameModel.create({
        ...document,
        createdAt: date,
        updatedAt: date,
    });
}

export function streamChanges(): mongodb.ChangeStream<IGame> {
    return GameModel.watch([], { fullDocument: 'updateLookup' });
}

export async function read(
    id: Types.ObjectId,
): Promise<HydratedDocument<IGame, unknown, unknown> | null> {
    return GameModel.findOne({
        _id: id,
        deleted: false,
    });
}

export async function readAll()
: Promise<HydratedDocument<IGame, unknown, unknown>[]> {
    return GameModel.find({
        deleted: false,
    });
}

export async function update(
    document: HydratedDocument<IGame, unknown, unknown>,
    updates: Partial<IGame>
): Promise<HydratedDocument<IGame, unknown, unknown>> {
    await document.updateOne({
        ...updates,
        updatedAt: new Date()
    } as Partial<IGame>);

    return await GameModel.findOne({
        _id: document._id
    }) ?? document;
}

export async function softDelete(
    document: HydratedDocument<IGame, unknown, unknown>,
): Promise<HydratedDocument<IGame, unknown, unknown>> {
    return update(document, {
        deletedAt: new Date(),
        deleted: true
    });
};