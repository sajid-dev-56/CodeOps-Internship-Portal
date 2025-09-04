'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'STUDENT' });
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (!res.ok) {
      const data = await res.json();
      setErr(data.error || 'Failed');
      return;
    }
    router.push('/signin');
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>Name</label><br />
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div>
          <label>Email</label><br />
          <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div>
          <label>Password</label><br />
          <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
        </div>
        <div>
          <label>Role</label><br />
          <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
            <option value="STUDENT">Student</option>
            <option value="TEACHER">Teacher</option>
          </select>
        </div>
        {err && <p style={{ color: 'crimson' }}>{err}</p>}
        <button type="submit">Create account</button>
      </form>
    </div>
  );
}
