import { Schema, model, Document, Types } from "mongoose";

const UserSchema = new Schema({
  name: String,
  googleid: String,
  photoUrl: String,
  uploaded: { type: Schema.Types.ObjectId, ref: "Image", default: null },
  votingFor: { type: Schema.Types.ObjectId, ref: "Image", default: null },
});

export interface User extends Document {
  name: string;
  googleid: string;
  photoUrl: string;
  uploaded: string;
  votingFor: string;
  _id: string;
}

const UserModel = model<User>("User", UserSchema);

export default UserModel;
