import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const bodySchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  role: z.enum(['TEACHER', 'STUDENT']).default('STUDENT')
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const data = bodySchema.parse(json);
    await dbConnect();

    const exists = await User.findOne({ email: data.email });
    if (exists) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const u = await User.create({
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role
    });

    return NextResponse.json({ id: String(u._id), email: u.email, role: u.role }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Invalid request' }, { status: 400 });
  }
}
