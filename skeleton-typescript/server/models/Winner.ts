import { Schema, model, Document, Types } from "mongoose";

const WinnerSchema = new Schema({
    image: { type: Schema.Types.ObjectId, ref: "Image" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    date: { type: Date },
    votes: { type: Number },
});

export interface Winner extends Document {
    image: string;
    user: string;
    date: Date;
    votes: number;
    _id: string;
}

const WinnerModel = model<Winner>("Winner", WinnerSchema);

export default WinnerModel;
