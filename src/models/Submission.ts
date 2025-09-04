import { Schema, Types, model, models } from 'mongoose';

const SubmissionSchema = new Schema(
  {
    taskId: { type: Types.ObjectId, ref: 'Task', required: true, index: true },
    studentId: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    links: [{ type: String }],
    notes: { type: String, default: '' },
    status: { type: String, enum: ['PENDING', 'APPROVED', 'CHANGES_REQUESTED', 'REJECTED'], default: 'PENDING', index: true },
    feedback: { type: String, default: '' },
    score: { type: Number, min: 0, max: 100 }
  },
  { timestamps: true }
);

SubmissionSchema.index({ taskId: 1, studentId: 1 }, { unique: true });

export type SubmissionDoc = {
  _id: string;
  taskId: string;
  studentId: string;
  links: string[];
  notes: string;
  status: 'PENDING' | 'APPROVED' | 'CHANGES_REQUESTED' | 'REJECTED';
  feedback?: string;
  score?: number;
};

export default models.Submission || model('Submission', SubmissionSchema);
