import { Schema, model, models } from 'mongoose';

export type UserRole = 'TEACHER' | 'STUDENT';

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['TEACHER', 'STUDENT'], required: true, default: 'STUDENT' }
  },
  { timestamps: true }
);

export type UserDoc = {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
};

export default models.User || model('User', UserSchema);
