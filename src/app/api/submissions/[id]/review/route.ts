import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongoose';
import Submission from '@/models/Submission';
import Task from '@/models/Task';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const schema = z.object({
  status: z.enum(['APPROVED', 'CHANGES_REQUESTED', 'REJECTED']),
  feedback: z.string().max(5000).optional(),
  score: z.number().min(0).max(100).optional()
});

export async function POST(req: Request, context: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if ((session.user as any).role !== 'TEACHER') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const json = await req.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  await dbConnect();
  const sub = await Submission.findById(context.params.id);
  if (!sub) return NextResponse.json({ error: 'Submission not found' }, { status: 404 });

  const task = await Task.findById(sub.taskId);
  if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  if (String(task.createdBy) !== (session.user as any).id) return NextResponse.json({ error: 'Not owner' }, { status: 403 });

  sub.status = parsed.data.status;
  sub.feedback = parsed.data.feedback ?? '';
  if (parsed.data.score !== undefined) sub.score = parsed.data.score;
  await sub.save();

  return NextResponse.json({ submission: sub });
}
