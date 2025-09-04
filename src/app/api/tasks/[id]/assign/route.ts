import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongoose';
import Task from '@/models/Task';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const schema = z.object({
  studentIds: z.array(z.string()).min(1)
});

export async function POST(req: Request, context: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if ((session.user as any).role !== 'TEACHER') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const taskId = context.params.id;
  const json = await req.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  await dbConnect();
  const task = await Task.findById(taskId);
  if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  if (String(task.createdBy) !== (session.user as any).id) {
    return NextResponse.json({ error: 'Not owner' }, { status: 403 });
  }

  const set = new Set([...(task.assignedTo as any[]).map(String), ...parsed.data.studentIds]);
  task.assignedTo = Array.from(set) as any;
  await task.save();

  return NextResponse.json({ task });
}
