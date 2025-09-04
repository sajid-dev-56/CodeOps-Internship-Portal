'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false
    });
    if (res?.error) setErr(res.error);
    else router.push('/dashboard');
  };

  return (
    <div className="container">
      <h2>Sign in</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>Email</label><br />
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password</label><br />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        {err && <p style={{ color: 'crimson' }}>{err}</p>}
        <button type="submit">Sign in</button>
      </form>
    </div>
  );
}
