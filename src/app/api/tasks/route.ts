import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongoose';
import Task from '@/models/Task';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const createSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional().default(''),
  deadline: z.string().datetime().optional(),
  tags: z.array(z.string()).optional().default([])
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const userId = (session.user as any).id;
  const role = (session.user as any).role;

  if (role === 'TEACHER') {
    const tasks = await Task.find({ createdBy: userId }).sort({ createdAt: -1 });
    return NextResponse.json({ tasks });
  } else {
    const tasks = await Task.find({ assignedTo: userId }).sort({ createdAt: -1 });
    return NextResponse.json({ tasks });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = (session.user as any).role;
  if (role !== 'TEACHER') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const data = createSchema.safeParse(body);
  if (!data.success) return NextResponse.json({ error: data.error.flatten() }, { status: 400 });

  await dbConnect();
  const created = await Task.create({
    title: data.data.title,
    description: data.data.description,
    deadline: data.data.deadline ? new Date(data.data.deadline) : undefined,
    tags: data.data.tags,
    createdBy: (session.user as any).id
  });
  return NextResponse.json({ task: created }, { status: 201 });
}
