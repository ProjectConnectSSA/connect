// components/emails/email-editor.tsx
'use client';
import React, { useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import type { EditorRef, EmailEditorProps } from 'react-email-editor';

const EmailEditor = dynamic(() => import('react-email-editor'), { ssr: false });

interface EmailEditorComponentProps {
  initialDesign?: any;
  onSaveDraft?: (design: any) => void;
}

const EmailEditorComponent: React.FC<EmailEditorComponentProps> = ({ initialDesign, onSaveDraft }) => {
  const emailEditorRef = useRef<EditorRef>(null);

  useEffect(() => {
    if (initialDesign && emailEditorRef.current?.editor) {
      emailEditorRef.current.editor.loadDesign(initialDesign);
    }
  }, [initialDesign]);

  const handleSave = () => {
    if (emailEditorRef.current?.editor) {
      emailEditorRef.current.editor.exportHtml((data: { design: any; html: string }) => {
        const { design } = data;
        if (onSaveDraft) {
          onSaveDraft(design);
        }
      });
    }
  };

  const onReady: EmailEditorProps['onReady'] = (unlayer) => {
    console.log('Editor is ready', unlayer);
  };

  return (
    <div>
      <Button onClick={handleSave}>Save Draft</Button>
      <EmailEditor ref={emailEditorRef} onReady={onReady} />
    </div>
  );
};

export default EmailEditorComponent;
