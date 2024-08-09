import mongoose from "mongoose";
import { IUser } from "../../interfaces/models/user.interface";
import { documentJsonTransform } from '../../utilities/database';

const schema = new mongoose.Schema<IUser>({
    unique: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
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

export const model = mongoose.model('users', schema);