import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import TeacherDashboard from '@/components/TeacherDashboard';
import StudentDashboard from '@/components/StudentDashboard';
import { redirect } from 'next/navigation';
import SignOut from '@/components/SignOut';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/signin');

  const role = (session.user as any).role;
  return (
    <div className="container">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div>
          <h1>Dashboard</h1>
          <p>Signed in as {session.user?.email} ({role})</p>
        </div>
        <SignOut />
      </div>
      {role === 'TEACHER' ? <TeacherDashboard /> : <StudentDashboard />}
    </div>
  );
}
