'use client';

import { useEffect, useState } from 'react';

type Task = {
  _id: string;
  title: string;
  description?: string;
  deadline?: string;
  createdAt: string;
};

export default function TeacherDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');

  const load = async () => {
    const res = await fetch('/api/tasks', { cache: 'no-store' });
    const data = await res.json();
    setTasks(data.tasks || []);
  };

  useEffect(() => { load(); }, []);

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title, description, deadline: deadline || undefined })
    });
    if (res.ok) {
      setTitle(''); setDescription(''); setDeadline('');
      load();
    }
  };

  return (
    <div>
      <div className="card">
        <h3>Create task</h3>
        <form onSubmit={createTask}>
          <div><input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required /></div>
          <div><textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} /></div>
          <div><input type="datetime-local" value={deadline} onChange={e => setDeadline(e.target.value)} /></div>
          <button type="submit">Create</button>
        </form>
      </div>

      <div>
        <h3>Your tasks</h3>
        {tasks.map(t => (
          <div className="card" key={t._id}>
            <b>{t.title}</b>
            <p>{t.description}</p>
            <small>Created: {new Date(t.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
