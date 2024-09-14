import { Schema, model, Document, Types } from "mongoose";

const ImageSchema = new Schema({
    url: String,
    filekey: String,
    votes: { type: Number, default: 0 },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
    uploadedAt: { type: Date, default: Date.now },
});

export interface Image extends Document {
    url: string;
    filekey: string;
    votes: number;
    uploadedBy: string;
    uploadedAt: Date;
    _id: string;
}

const ImageModel = model<Image>("Image", ImageSchema);

export default ImageModel;
