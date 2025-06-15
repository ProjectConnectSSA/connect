import React from 'react'
import Layout from '@/public/data/Layout'

interface LayoutProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
}

export default function ElementsLayotCard({ layout }: { layout: LayoutProps }) {
  return (
    <div className='flex flex-col items-center justify-center broder border-dashed rounded-xl p-3 group hover:shadow-md hover:border-primary cursor-pointer'>
            {<layout.icon className='p-2 h-8 w-9 bg-gray-100 group-hover:text-primary group-hover:bg-purple-100 rounded-full'/>}
            <h2 className='text-sm group-hover:text-primary'>{layout.label}</h2>
        </div>    
  )
}
