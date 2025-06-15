import React, { useEffect, useState, useMemo } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Edit2, X, Check, Trash2, AlertCircle, CalendarClock } from "lucide-react"; // Added icons
import { BioElement, StyleProps } from "@/app/types/links/types"; // Adjust path if needed
import { motion } from "framer-motion";

interface CountdownElementProps {
  element: BioElement;
  styles: StyleProps;
  updateElement: (id: string, updatedData: Partial<BioElement>) => void;
  deleteElement: (id: string) => void;
  isNested?: boolean; // Added prop
}

const DEFAULT_TITLE = "Countdown Timer";

// Helper function to format date for datetime-local input
const formatDateForInput = (isoDateString?: string): string => {
  if (!isoDateString) return "";
  try {
    const date = new Date(isoDateString);
    // Check for invalid date
    if (isNaN(date.getTime())) return "";
    // Format to YYYY-MM-DDTHH:mm (datetime-local needs this format)
    // Adjust for timezone offset to display correctly in local time input
    const timezoneOffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
    const localISOTime = new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
    return localISOTime;
  } catch (e) {
    console.error("Error formatting date:", e);
    return "";
  }
};

// Helper function to format time parts with leading zeros
const formatTime = (time: number): string => {
  return String(time).padStart(2, "0");
};

export default function CountdownElement({ element, styles, updateElement, deleteElement, isNested = false }: CountdownElementProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Derive current values safely
  const currentTitle = element.title || DEFAULT_TITLE;
  const currentTargetDate = element.targetDate || ""; // Keep as ISO string or empty

  // States for dialog editing
  const [editedTitle, setEditedTitle] = useState(currentTitle);
  const [editedDate, setEditedDate] = useState(formatDateForInput(currentTargetDate)); // Format for input
  const [dateError, setDateError] = useState<string | null>(null);

  // Calculate time left
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number; isFinished: boolean }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isFinished: false,
  });
  const [isValidTargetDate, setIsValidTargetDate] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    let targetTime = 0;
    let isValidDate = false;

    if (currentTargetDate) {
      try {
        const target = new Date(currentTargetDate);
        if (!isNaN(target.getTime())) {
          targetTime = target.getTime();
          isValidDate = true;
          setIsValidTargetDate(true);
        } else {
          setIsValidTargetDate(false);
        }
      } catch (e) {
        console.error("Invalid target date format:", currentTargetDate);
        setIsValidTargetDate(false);
      }
    } else {
      setIsValidTargetDate(false);
    }

    if (isValidDate) {
      const updateCountdown = () => {
        const now = Date.now();
        const diff = Math.max(targetTime - now, 0);

        if (diff === 0 && !timeLeft.isFinished) {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isFinished: true });
          if (intervalId) clearInterval(intervalId); // Stop interval when countdown finishes
          return;
        }

        const seconds = Math.floor((diff / 1000) % 60);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        setTimeLeft({ days, hours, minutes, seconds, isFinished: false });
      };

      updateCountdown(); // Initial calculation
      intervalId = setInterval(updateCountdown, 1000);
    } else {
      // Reset time left if date is invalid or cleared
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isFinished: false });
    }

    // Cleanup function
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [currentTargetDate, timeLeft.isFinished]); // Rerun effect if target date changes

  // Reset modal state on open
  useEffect(() => {
    if (isModalOpen) {
      setEditedTitle(currentTitle);
      setEditedDate(formatDateForInput(currentTargetDate));
      setDateError(null);
    }
  }, [isModalOpen, currentTitle, currentTargetDate]);

  const validateAndFormatDate = (dateString: string): string | null => {
    if (!dateString) {
      setDateError("Target date and time are required.");
      return null;
    }
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        setDateError("Invalid date format.");
        return null;
      }
      if (date.getTime() <= Date.now()) {
        setDateError("Target date must be in the future.");
        // Allow saving past dates if needed, comment out or adjust this check
        // return null;
      }
      setDateError(null);
      return date.toISOString(); // Return valid ISO string
    } catch (e) {
      setDateError("Invalid date format.");
      return null;
    }
  };

  const handleSave = () => {
    const finalTitle = editedTitle.trim() || DEFAULT_TITLE;
    const finalIsoDate = validateAndFormatDate(editedDate);

    if (finalIsoDate === null) {
      // Check includes null and potentially future date error
      return; // Don't save if date is invalid
    }

    // Only update if changed
    if (finalTitle !== currentTitle || finalIsoDate !== currentTargetDate) {
      updateElement(element.id, { title: finalTitle, targetDate: finalIsoDate });
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => setIsModalOpen(false);
  const handleDelete = () => deleteElement(element.id);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSave();
    } else if (event.key === "Escape") {
      handleCancel();
    }
  };

  // --- Styling & Rendering ---
  const radiusClass = styles.borderRadius === "none" ? "rounded-none" : `rounded-${styles.borderRadius}`;
  const cardBgColor = styles.theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)";
  const cardTextColor = styles.textColor;

  return (
    <motion.div
      className={`relative group my-3 ${isNested ? "p-2" : "p-4"} text-center border border-gray-200/80 dark:border-gray-700/80 shadow-sm ${radiusClass}`}
      style={{ backgroundColor: cardBgColor }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      aria-live="polite" // Announce changes in time
    >
      {/* Title */}
      <h3 className="font-medium text-base mb-3" style={{ color: cardTextColor }}>
        {currentTitle}
      </h3>

      {/* Countdown Display or Placeholder */}
      {isValidTargetDate ? (
        <div className="flex justify-center items-baseline space-x-2 md:space-x-4" style={{ color: cardTextColor }}>
          {/* Days */}
          <div className="flex flex-col items-center">
            <span className="text-2xl md:text-4xl font-bold tabular-nums">{formatTime(timeLeft.days)}</span>
            <span className="text-xs uppercase opacity-70 tracking-wider">Days</span>
          </div>
          <span className="text-2xl md:text-4xl font-bold pb-3 opacity-50">:</span>
          {/* Hours */}
          <div className="flex flex-col items-center">
            <span className="text-2xl md:text-4xl font-bold tabular-nums">{formatTime(timeLeft.hours)}</span>
            <span className="text-xs uppercase opacity-70 tracking-wider">Hours</span>
          </div>
          <span className="text-2xl md:text-4xl font-bold pb-3 opacity-50">:</span>
          {/* Minutes */}
          <div className="flex flex-col items-center">
            <span className="text-2xl md:text-4xl font-bold tabular-nums">{formatTime(timeLeft.minutes)}</span>
            <span className="text-xs uppercase opacity-70 tracking-wider">Mins</span>
          </div>
          <span className="text-2xl md:text-4xl font-bold pb-3 opacity-50">:</span>
          {/* Seconds */}
          <div className="flex flex-col items-center">
            <span className="text-2xl md:text-4xl font-bold tabular-nums">{formatTime(timeLeft.seconds)}</span>
            <span className="text-xs uppercase opacity-70 tracking-wider">Secs</span>
          </div>
        </div>
      ) : (
        // Placeholder when date is not set or invalid
        <div className={`flex flex-col items-center justify-center h-24 bg-gray-100/50 dark:bg-gray-800/30 rounded-md p-4 border border-dashed border-gray-300 dark:border-gray-600 ${radiusClass}`}>
          <CalendarClock className="text-gray-400 dark:text-gray-500 mb-2" size={30} />
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium text-center">Set a target date.</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-center">Click the edit icon.</p>
        </div>
      )}

      {/* Edit/Delete Controls */}
      <div className="absolute top-1.5 right-1.5 flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10">
        {/* Edit Button & Dialog */}
        <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
          <Dialog.Trigger asChild>
            <button className="p-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1" aria-label="Edit Countdown">
              <Edit2 size={16} />
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 data-[state=open]:animate-overlayShow" />
            <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-md transform -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white shadow-xl p-6 focus:outline-none data-[state=open]:animate-contentShow" onEscapeKeyDown={handleCancel} onPointerDownOutside={(e) => e.preventDefault()}>
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-5 border-b pb-3">
                <Dialog.Title className="text-lg font-medium text-gray-900">Edit Countdown</Dialog.Title>
                <Dialog.Close asChild>
                  <button className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-400" aria-label="Close" onClick={handleCancel}>
                    <X size={20} />
                  </button>
                </Dialog.Close>
              </div>

              {/* Modal Body */}
              <div className="space-y-4 mb-6">
                {/* Title */}
                <div>
                  <label htmlFor={`countdown-title-${element.id}`} className="block text-sm font-medium text-gray-700 mb-1.5">
                    Title (Optional)
                  </label>
                  <input id={`countdown-title-${element.id}`} type="text" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} onKeyDown={handleKeyDown} placeholder={DEFAULT_TITLE} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" autoFocus />
                </div>
                {/* Target Date */}
                <div>
                  <label htmlFor={`countdown-date-${element.id}`} className="block text-sm font-medium text-gray-700 mb-1.5">
                    Target Date & Time*
                  </label>
                  <input
                    id={`countdown-date-${element.id}`}
                    type="datetime-local"
                    value={editedDate}
                    onChange={(e) => {
                      setEditedDate(e.target.value);
                      validateAndFormatDate(e.target.value); // Validate on change
                    }}
                    onKeyDown={handleKeyDown}
                    className={`w-full px-3 py-2 border rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition ${dateError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                    aria-required="true"
                    aria-invalid={!!dateError}
                    aria-describedby={dateError ? "countdown-date-error" : undefined}
                  />
                  {dateError && (
                    <p id="countdown-date-error" className="text-xs text-red-600 mt-1.5 flex items-center">
                      <AlertCircle size={14} className="mr-1" /> {dateError}
                    </p>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Dialog.Close asChild>
                  <button onClick={handleCancel} type="button" className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-400 transition">
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  onClick={handleSave}
                  type="button"
                  disabled={!!dateError} // Disable save if date has error
                  className={`px-4 py-2 rounded-md text-sm font-medium text-white flex items-center bg-blue-600 hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-500 transition ${!!dateError ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <Check size={16} className="mr-1" />
                  Save
                </button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Delete Button */}
        <button onClick={handleDelete} className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-1" aria-label="Delete Countdown">
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
}
