// app/dashboard/emails/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

type Draft = {
  id: string;
  title: string;
  updated_at: string;
};

export default function EmailsDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [drafts, setDrafts] = useState<Draft[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user);
    });
  }, [supabase]);

  useEffect(() => {
    if (user) {
      fetchDrafts();
    }
  }, [user]);

  const fetchDrafts = async () => {
    const res = await fetch(`/api/drafts?user_id=${user?.id}`);
    if (res.ok) {
      const data = await res.json();
      setDrafts(data);
    } else {
      console.error('Error fetching drafts');
    }
  };

  return (
    <div>
      <h1>Email Drafts Dashboard</h1>
      <button onClick={() => router.push('/builder')}>Create New Email</button>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Last Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {drafts.map((draft) => (
            <tr key={draft.id}>
              <td>{draft.title}</td>
              <td>{new Date(draft.updated_at).toLocaleString()}</td>
              <td>
                <button onClick={() => router.push(`/builder?draft=${draft.id}`)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
