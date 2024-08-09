import { HydratedDocument, Types } from "mongoose";
import { IUser } from "../../interfaces/models";
import { UserModel } from "../models";

export async function create(
    document: Omit<IUser, '_id' | 'createdAt' | 'updatedAt' | 'deleted' | 'deletedAt'>,
): Promise<HydratedDocument<IUser, unknown, unknown>> {
    const date = new Date();

    return UserModel.create({
        ...document,
        createdAt: date,
        updatedAt: date,
    });
}

export async function read(
    id: Types.ObjectId,
): Promise<HydratedDocument<IUser, unknown, unknown> | null> {
    return UserModel.findOne({
        _id: id,
        deleted: false,
    });
}

export async function findByUnique(
    unique: string,
): Promise<HydratedDocument<IUser, unknown, unknown> | null> {
    return UserModel.findOne({
        unique,
        deleted: false
    })
}

export async function update(
    document: HydratedDocument<IUser, unknown, unknown>,
    updates: Partial<IUser>
): Promise<HydratedDocument<IUser, unknown, unknown>> {
    await document.updateOne({
        ...updates,
        updatedAt: new Date()
    } as Partial<IUser>);

    return await UserModel.findOne({
        _id: document._id
    }) ?? document;
}

export async function softDelete(
    document: HydratedDocument<IUser, unknown, unknown>,
): Promise<HydratedDocument<IUser, unknown, unknown>> {
    return update(document, {
        deletedAt: new Date(),
        deleted: true
    });
};