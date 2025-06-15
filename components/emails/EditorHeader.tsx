"use client"
import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Code, Monitor, Smartphone, ArrowLeft, Save, Loader2 } from 'lucide-react'
import { useScreenSize } from '@/app/ScreenSizeContext'

interface EditorHeaderProps {
  viewHTMLCode: (show: boolean) => void;
  onSave: () => void;
  isSaving?: boolean;
}

export default function EditorHeader({ viewHTMLCode, onSave, isSaving = false }: EditorHeaderProps) {
  const { screenSize, setScreenSize } = useScreenSize();
  const router = useRouter();

  return (
    <div className='py-3 px-4 flex items-center justify-between bg-white border-b'>
      <div className='flex items-center gap-4'>
        <Button 
          variant="ghost" 
          onClick={() => router.push('/dashboard/emails')}
          className="hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className='flex items-center gap-1'>
          <Image src="/favicon.svg" alt="logo" width={24} height={24} />
          <span className='font-semibold'>Email Builder</span>
        </div>
      </div>

      <div className='flex items-center gap-2'>
        <div className='bg-gray-100 rounded-md p-1 flex items-center'>
          <Button
            variant={screenSize === 'desktop' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setScreenSize('desktop')}
            className={screenSize === 'desktop' ? '' : 'text-gray-500'}
          >
            <Monitor className="h-4 w-4 mr-1" />
            Desktop
          </Button>
          <Button
            variant={screenSize === 'mobile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setScreenSize('mobile')}
            className={screenSize === 'mobile' ? '' : 'text-gray-500'}
          >
            <Smartphone className="h-4 w-4 mr-1" />
            Mobile
          </Button>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => viewHTMLCode(true)}
          disabled={isSaving}
        >
          <Code className="h-4 w-4 mr-1" />
          View HTML
        </Button>
        
        <Button
          variant="default"
          size="sm"
          onClick={onSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-1" />
              Save Template
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
