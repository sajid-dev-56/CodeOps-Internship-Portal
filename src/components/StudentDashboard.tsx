'use client';

import { useEffect, useState } from 'react';

type Task = {
  _id: string;
  title: string;
  description?: string;
  deadline?: string;
  createdAt: string;
};

type Submission = {
  _id: string;
  taskId: string;
  links: string[];
  notes: string;
  status: string;
  updatedAt: string;
};

export default function StudentDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subs, setSubs] = useState<Record<string, Submission | undefined>>({});
  const [form, setForm] = useState<{ [taskId: string]: { links: string; notes: string } }>({});

  const load = async () => {
    const [tRes, sRes] = await Promise.all([
      fetch('/api/tasks', { cache: 'no-store' }),
      fetch('/api/submissions', { cache: 'no-store' })
    ]);
    const tData = await tRes.json();
    const sData = await sRes.json();
    setTasks(tData.tasks || []);
    const byTask: Record<string, Submission> = {};
    (sData.submissions || []).forEach((s: Submission) => { byTask[s.taskId] = s; });
    setSubs(byTask);
  };

  useEffect(() => { load(); }, []);

  const submit = async (taskId: string) => {
    const payload = {
      taskId,
      links: form[taskId]?.links?.split(',').map(s => s.trim()).filter(Boolean) ?? [],
      notes: form[taskId]?.notes ?? ''
    };
    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      await load();
      setForm(prev => ({ ...prev, [taskId]: { links: '', notes: '' } }));
    }
  };

  return (
    <div>
      <h3>Assigned tasks</h3>
      {tasks.map(t => {
        const prev = subs[t._id];
        return (
          <div className="card" key={t._id}>
            <b>{t.title}</b>
            <p>{t.description}</p>
            {prev ? (
              <p>Status: {prev.status} • Updated: {new Date(prev.updatedAt).toLocaleString()}</p>
            ) : <p>No submission yet</p>}
            <div>
              <input placeholder="Links (comma separated)" value={form[t._id]?.links ?? ''} onChange={e => setForm({ ...form, [t._id]: { ...(form[t._id] || { notes: '' }), links: e.target.value } })} />
            </div>
            <div>
              <textarea placeholder="Notes" value={form[t._id]?.notes ?? ''} onChange={e => setForm({ ...form, [t._id]: { ...(form[t._id] || { links: '' }), notes: e.target.value } })} />
            </div>
            <button onClick={() => submit(t._id)}>Submit</button>
          </div>
        );
      })}
    </div>
  );
}
