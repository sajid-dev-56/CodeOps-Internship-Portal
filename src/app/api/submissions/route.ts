import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongoose';
import Submission from '@/models/Submission';
import Task from '@/models/Task';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const submitSchema = z.object({
  taskId: z.string(),
  links: z.array(z.string().url()).optional().default([]),
  notes: z.string().max(5000).optional().default('')
});

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get('taskId') || undefined;

  await dbConnect();
  const role = (session.user as any).role;
  const uid = (session.user as any).id;

  if (role === 'TEACHER') {
    if (!taskId) return NextResponse.json({ error: 'taskId required' }, { status: 400 });
    const subs = await Submission.find({ taskId }).sort({ createdAt: -1 });
    return NextResponse.json({ submissions: subs });
  } else {
    const query: any = { studentId: uid };
    if (taskId) query.taskId = taskId;
    const subs = await Submission.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ submissions: subs });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = (session.user as any).role;
  if (role !== 'STUDENT') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const json = await req.json();
  const data = submitSchema.safeParse(json);
  if (!data.success) return NextResponse.json({ error: data.error.flatten() }, { status: 400 });

  await dbConnect();
  const task = await Task.findById(data.data.taskId);
  if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

  const uid = (session.user as any).id;
  const isAssigned = (task.assignedTo as any[]).map(String).includes(uid);
  if (!isAssigned) return NextResponse.json({ error: 'Task not assigned to you' }, { status: 403 });

  const existing = await Submission.findOne({ taskId: data.data.taskId, studentId: uid });
  if (existing) {
    existing.links = data.data.links ?? [];
    existing.notes = data.data.notes ?? '';
    existing.status = 'PENDING';
    await existing.save();
    return NextResponse.json({ submission: existing }, { status: 200 });
  } else {
    const created = await Submission.create({
      taskId: data.data.taskId,
      studentId: uid,
      links: data.data.links,
      notes: data.data.notes,
      status: 'PENDING'
    });
    return NextResponse.json({ submission: created }, { status: 201 });
  }
}
