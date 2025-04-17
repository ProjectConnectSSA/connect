import React, { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Edit2, X, Check, Trash2 } from "lucide-react";
import { BioElement, StyleProps } from "@/app/types/links/types";
import { motion } from "framer-motion";

interface CountdownElementProps {
  element: BioElement;
  styles: StyleProps;
  updateElement: (id: string, updatedData: Partial<BioElement>) => void;
  deleteElement: (id: string) => void;
}

export default function CountdownElement({ element, styles, updateElement, deleteElement }: CountdownElementProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(element.title || "Countdown");
  const [editedDate, setEditedDate] = useState(element.targetDate || "");
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const target = new Date(element.targetDate || "");
      const now = new Date();
      const diff = Math.max(target.getTime() - now.getTime(), 0);

      const seconds = Math.floor((diff / 1000) % 60);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const hours = Math.floor((diff / 1000 / 60 / 60) % 24);
      const days = Math.floor(diff / 1000 / 60 / 60 / 24);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [element.targetDate]);

  const handleSave = () => {
    updateElement(element.id, { title: editedTitle.trim(), targetDate: editedDate });
    setIsModalOpen(false);
  };

  return (
    <motion.div className="relative group my-4 p-4 rounded border shadow bg-white text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
      <h3 className="font-semibold text-lg mb-2" style={{ color: styles.textColor }}>
        {element.title || "Countdown"}
      </h3>
      <motion.div className="text-2xl font-bold" style={{ color: styles.textColor }} animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}>
        {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
      </motion.div>

      <div className="absolute top-1 right-1 flex space-x-2 opacity-0 group-hover:opacity-100 transition">
        <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
          <Dialog.Trigger asChild>
            <button className="p-1 bg-green-500 text-white rounded hover:bg-green-600 transition">
              <Edit2 size={18} />
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60" />
            <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-lg transform -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title className="text-xl font-semibold">Edit Countdown</Dialog.Title>
                <Dialog.Close asChild>
                  <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100">
                    <X size={22} />
                  </button>
                </Dialog.Close>
              </div>
              <div className="space-y-4 mb-6">
                <input type="text" placeholder="Title" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} className="w-full p-3 border border-gray-300 rounded" />
                <input type="datetime-local" value={editedDate} onChange={(e) => setEditedDate(e.target.value)} className="w-full p-3 border border-gray-300 rounded" />
              </div>
              <div className="flex justify-end space-x-3">
                <Dialog.Close asChild>
                  <button className="px-4 py-2 rounded bg-red-500 text-white">Cancel</button>
                </Dialog.Close>
                <button onClick={handleSave} className="px-4 py-2 rounded bg-green-500 text-white flex items-center">
                  <Check size={18} className="mr-1" /> Save
                </button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <button onClick={() => deleteElement(element.id)} className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition">
          <Trash2 size={18} />
        </button>
      </div>
    </motion.div>
  );
}
