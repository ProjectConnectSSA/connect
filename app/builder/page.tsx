// app/builder/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { createClient } from '@/utils/supabase/client';

const EmailEditorComponent = dynamic(() => import('../../components/emails/email-editor'), { ssr: false });

export default function BuilderPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [initialDesign, setInitialDesign] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Session:', session);
      setUser(session?.user);
    });
  }, [supabase]);

  const draftId = searchParams.get('draft');
  useEffect(() => {
    if (draftId) {
      fetch(`/api/drafts/${draftId}`)
        .then((res) => res.json())
        .then((data) => setInitialDesign(data.template))
        .catch((err) => console.error(err));
    }
  }, [draftId]);

  const handleSaveDraft = async (design: any) => {
    if (!user) {
      alert('You must be logged in to save a draft.');
      return;
    }
    const endpoint = draftId ? `/api/drafts/${draftId}` : '/api/drafts';
    const payload = {
      user_id: user.id,
      title: 'Untitled Draft',
      template: design,
    };

    const res = await fetch(endpoint, {
      method: draftId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (res.ok) {
      alert('Draft saved successfully!');
      router.push('/dashboard/emails');
    } else {
      console.error('Error saving draft:', result.error);
    }
  };

  return (
    <div>
      <h1>Email Template Builder</h1>
      <EmailEditorComponent initialDesign={initialDesign} onSaveDraft={handleSaveDraft} />
    </div>
  );
}
