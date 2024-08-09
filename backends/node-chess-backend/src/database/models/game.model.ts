import mongoose from "mongoose";
import { documentJsonTransform } from '../../utilities/database';
import { IGame } from "../../interfaces/models/game.interface";

export const schema = new mongoose.Schema<IGame>({
    name: {
        type: String,
        required: true,
    },
    whitePlayerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
    },
    blackPlayerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
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

export const model = mongoose.model('games', schema);