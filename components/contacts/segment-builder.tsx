"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

interface Rule {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface SegmentBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SegmentBuilder({ open, onOpenChange }: SegmentBuilderProps) {
  const [name, setName] = useState("");
  const [rules, setRules] = useState<Rule[]>([{ id: "1", field: "tags", operator: "contains", value: "" }]);

  const addRule = () => {
    const newRule = {
      id: Date.now().toString(),
      field: "tags",
      operator: "contains",
      value: "",
    };
    setRules([...rules, newRule]);
  };

  const removeRule = (id: string) => {
    setRules(rules.filter((rule) => rule.id !== id));
  };

  const updateRule = (id: string, updates: Partial<Rule>) => {
    setRules(rules.map((rule) => (rule.id === id ? { ...rule, ...updates } : rule)));
  };

  const handleSave = () => {
    if (!name) {
      toast.error("Please enter a segment name");
      return;
    }

    if (rules.some((rule) => !rule.value)) {
      toast.error("Please fill in all rule values");
      return;
    }

    // In a real app, save the segment
    toast.success("Segment created successfully!");
    onOpenChange(false);
    setName("");
    setRules([{ id: "1", field: "tags", operator: "contains", value: "" }]);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Segment</DialogTitle>
          <DialogDescription>Create a dynamic segment based on contact properties and behavior.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Segment Name</Label>
            <Input
              placeholder="e.g., Active Customers"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="flex items-center gap-2 rounded-lg border p-4">
                <Select
                  value={rule.field}
                  onValueChange={(value) => updateRule(rule.id, { field: value })}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tags">Tags</SelectItem>
                    <SelectItem value="source">Source</SelectItem>
                    <SelectItem value="lastActive">Last Active</SelectItem>
                    <SelectItem value="score">Lead Score</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={rule.operator}
                  onValueChange={(value) => updateRule(rule.id, { operator: value })}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contains">Contains</SelectItem>
                    <SelectItem value="notContains">Does not contain</SelectItem>
                    <SelectItem value="equals">Equals</SelectItem>
                    <SelectItem value="notEquals">Does not equal</SelectItem>
                    <SelectItem value="greaterThan">Greater than</SelectItem>
                    <SelectItem value="lessThan">Less than</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  className="flex-1"
                  placeholder="Enter value"
                  value={rule.value}
                  onChange={(e) => updateRule(rule.id, { value: e.target.value })}
                />

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRule(rule.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button
              variant="outline"
              className="w-full"
              onClick={addRule}>
              <Plus className="mr-2 h-4 w-4" />
              Add Rule
            </Button>
          </div>

          <div className="rounded-lg border p-4">
            <div className="space-y-2">
              <Label>Matching Contacts Preview</Label>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">1,250 contacts match</Badge>
                <Badge variant="outline">48% of total contacts</Badge>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Create Segment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
