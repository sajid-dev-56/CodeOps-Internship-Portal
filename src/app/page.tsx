import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) redirect('/dashboard');

  return (
    <div className="container">
      <h1>Internship Portal</h1>
      <p>Manage internships, tasks, and student submissions.</p>
      <div className="row">
        <Link href="/signin">Sign in</Link>
        <Link href="/register">Register</Link>
      </div>
    </div>
  );
}
