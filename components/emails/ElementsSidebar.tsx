import Layout from '@/public/data/Layout'
import React from 'react'
import ElelmentsLayotCard from './ElementsLayotCard'
import ElelmentList from '@/public/data/ElelmentList'
import { LucideProps } from 'lucide-react'
import { useDragElementLayout } from '@/components/context/DragDropLayoutElement'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ElementsSidebar() {
  const {dragDropLayoutElement, setDragDropLayoutElement} = useDragElementLayout()
  
  const onDragLayoutStart=(layout: { label: string; type: string; numOfCol: number; icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>> })=>{
    console.log("dragging layout", layout)
    setDragDropLayoutElement({
      dragLayout:{
        ...layout,
        id:Date.now()
      }
    })
  }

  const onDragElementStart=(element: any)=>{
    console.log("dragging element", element)
    setDragDropLayoutElement({
      dragElement:{
        ...element,
        id:Date.now()
      }
    })
  }

  return (
    <div className='w-64 border-r shadow-sm bg-white flex flex-col h-full'>
      <div className='p-3 border-b flex-none'>
        <h1 className='text-lg font-semibold text-gray-800'>Email Components</h1>
      </div>
      
      <Tabs defaultValue="layouts" className="w-full flex-1 flex flex-col">
        <TabsList className="w-full grid grid-cols-2 flex-none">
          <TabsTrigger value="layouts">Layouts</TabsTrigger>
          <TabsTrigger value="elements">Elements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="layouts" className="flex-1 overflow-y-auto p-3 pb-20">
          <div className='grid grid-cols-2 gap-2'>
            {Layout.map((layout, index)=>(
              <div 
                key={index} 
                draggable 
                onDragStart={()=>onDragLayoutStart(layout)}
                className="cursor-grab"
              >
                <ElelmentsLayotCard layout={layout} />
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="elements" className="flex-1 overflow-y-auto p-3 pb-20">
          <div className='grid grid-cols-2 gap-2'>
            {ElelmentList.map((element, index)=>(
              <div 
                key={index} 
                draggable 
                onDragStart={()=>onDragElementStart(element)}
                className="cursor-grab"
              >
                <ElelmentsLayotCard layout={element} />
              </div>
            ))}
            
            {/* Empty div at bottom to ensure scrolling reaches last element */}
            <div className="col-span-2 h-4"></div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
