import mongoose from "mongoose";
import { IMove, IPosition } from "../../interfaces/models/move.interface";
import { required } from "joi";

export const positionSchema = new mongoose.Schema<IPosition>({
    column: {
        type: String,
        required: true,
    },
    row: {
        type: Number,
        required: true,
    }
}, {
    _id: false
});


export const schema = new mongoose.Schema<IMove>({
    from: {
        type: positionSchema,
        required: true,
    },
    to: {
        type: positionSchema,
        required: true,
    },
    gameId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
    },
    
    createdAt: {
        type: Date,
        required: true,
    },
    updatedAt: {
        type: Date,
        required: true,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
        required: false,
    }
});

export const model = mongoose.model('moves', schema);