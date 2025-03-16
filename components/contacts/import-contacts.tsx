"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { FileUp, Download, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface ImportContactsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportContacts({ open, onOpenChange }: ImportContactsProps) {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleImport = () => {
    if (!file) return;

    setImporting(true);
    // Simulate import process
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);

      if (currentProgress === 100) {
        clearInterval(interval);
        setImporting(false);
        onOpenChange(false);
        toast.success("Contacts imported successfully!");
        setFile(null);
        setProgress(0);
      }
    }, 500);
  };

  const downloadTemplate = () => {
    // In a real app, this would download a CSV template
    toast.success("Template downloaded successfully!");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Contacts</DialogTitle>
          <DialogDescription>Upload a CSV file with your contacts or download our template.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={downloadTemplate}>
              <Download className="mr-2 h-4 w-4" />
              Download Template
            </Button>
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <p className="text-sm text-muted-foreground">Accepted format: CSV</p>
          </div>

          {file && (
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">{file.name}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{file.size} bytes</p>
            </div>
          )}

          {importing && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-muted-foreground">Importing contacts... {progress}%</p>
            </div>
          )}

          {!file && !importing && (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <FileUp className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium">Drop your file here</p>
                <p className="text-sm text-muted-foreground">or click to browse</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={!file || importing}>
            {importing ? "Importing..." : "Import Contacts"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
