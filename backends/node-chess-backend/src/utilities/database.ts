import mongoose, { HydratedDocument, ToObjectOptions, mongo } from 'mongoose';

const debug = require('debug')('app:utilities:database');

export const documentJsonTransform = (
    doc: HydratedDocument<any>,
    ret: Record<string, any>,
    options: ToObjectOptions<HydratedDocument<any>>) => {
    return {
        id: ret._id,
        ...ret,
        _id: undefined,
        deleted: undefined,
        __v: undefined,
        passwordHash: undefined
    };
};

mongoose.plugin((schema) => {
    schema.set('toJSON', {
        transform: documentJsonTransform
    });
})

export async function connect(): Promise<void> {
    const connectionString = process.env.DB_CONNECTION_STRING;

    if (connectionString === undefined) {
        debug('ERROR: DB_CONNECTION_STRING is undefined');
        process.exit(1);
    }

    await mongoose.connect(connectionString);

    debug('Connected');
}

export async function disconnect(): Promise<void> {
    await mongoose.disconnect();
}

export async function clear(): Promise<void> {
    for (const collection of Object.values(mongoose.connection.collections)) {
        await collection.deleteMany({});
    }
}