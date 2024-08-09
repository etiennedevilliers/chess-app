import { HydratedDocument, Types } from "mongoose";
import { IMove } from "../../interfaces/models";
import { MoveModel } from "../models";
import * as mongodb from "mongodb";

export async function create(
    document: Omit<IMove, '_id' | 'createdAt' | 'updatedAt' | 'deleted' | 'deletedAt'>,
): Promise<HydratedDocument<IMove, unknown, unknown>> {
    const date = new Date();

    return MoveModel.create({
        ...document,
        createdAt: date,
        updatedAt: date,
    });
}

export function streamChanges(): mongodb.ChangeStream<IMove> {
    return MoveModel.watch([], { fullDocument: 'updateLookup' });
}

export async function read(
    id: Types.ObjectId,
): Promise<HydratedDocument<IMove, unknown, unknown> | null> {
    return MoveModel.findOne({
        _id: id,
        deleted: false,
    });
}

export async function readByGameId(
    id: Types.ObjectId
): Promise<HydratedDocument<IMove, unknown, unknown>[]> {
    return MoveModel.find({
        gameId: id,
        deleted: false,
    });
}

export async function readAll()
: Promise<HydratedDocument<IMove, unknown, unknown>[]> {
    return MoveModel.find({
        deleted: false,
    });
}

export async function update(
    document: HydratedDocument<IMove, unknown, unknown>,
    updates: Partial<IMove>
): Promise<HydratedDocument<IMove, unknown, unknown>> {
    await document.updateOne({
        ...updates,
        updatedAt: new Date()
    } as Partial<IMove>);

    return await MoveModel.findOne({
        _id: document._id
    }) ?? document;
}

export async function softDelete(
    document: HydratedDocument<IMove, unknown, unknown>,
): Promise<HydratedDocument<IMove, unknown, unknown>> {
    return update(document, {
        deletedAt: new Date(),
        deleted: true
    });
};