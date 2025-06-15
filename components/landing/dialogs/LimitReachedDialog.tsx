import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Sparkles } from "lucide-react";

interface LimitReachedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LimitReachedDialog({
  open,
  onOpenChange,
}: LimitReachedDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-gray-900 border dark:border-gray-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
            <AlertTriangle className="h-5 w-5" />
            Landing Page Limit Reached
          </DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            You've reached the maximum number of landing pages for your current plan.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md p-4">
            <p className="text-sm text-amber-800 dark:text-amber-400">
              To create more landing pages, you can either upgrade your plan or delete some existing landing pages.
            </p>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 dark:bg-blue-800 rounded-full p-2 mt-1">
                <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <h3 className="font-medium text-blue-700 dark:text-blue-400 mb-1">
                  Upgrade to Pro
                </h3>
                <p className="text-sm text-blue-600 dark:text-blue-500 mb-3">
                  Get unlimited landing pages and premium features with our Pro plan.
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600">
                  Upgrade Now
                </Button>
              </div>
            </div>
          </div>
        </div>
        <DialogClose asChild>
          <Button variant="ghost" className="w-full dark:text-gray-400 dark:hover:bg-gray-800">
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}