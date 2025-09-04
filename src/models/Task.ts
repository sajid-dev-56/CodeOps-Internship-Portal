import { Schema, Types, model, models } from 'mongoose';

const TaskSchema = new Schema(
  {
    title: { type: String, required: true, maxlength: 200 },
    description: { type: String, default: '' },
    deadline: { type: Date },
    tags: [{ type: String }],
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    assignedTo: [{ type: Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

export type TaskDoc = {
  _id: string;
  title: string;
  description: string;
  deadline?: Date;
  tags: string[];
  createdBy: string;
  assignedTo: string[];
};

export default models.Task || model('Task', TaskSchema);
