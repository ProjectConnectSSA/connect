"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

interface Rule {
  id: string;
  field: string;
  operator: string;
  value: string;
}

export function SegmentBuilder() {
  const [rules, setRules] = useState<Rule[]>([
    { id: "1", field: "tags", operator: "contains", value: "customer" },
  ]);

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
    setRules(
      rules.map((rule) =>
        rule.id === id ? { ...rule, ...updates } : rule
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">Segment Rules</h3>
          <p className="text-sm text-muted-foreground">
            Define rules to create a targeted segment
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={addRule}>
          <Plus className="mr-2 h-4 w-4" />
          Add Rule
        </Button>
      </div>

      <div className="space-y-4">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="flex items-center gap-2 rounded-lg border p-4"
          >
            <Select
              value={rule.field}
              onValueChange={(value) =>
                updateRule(rule.id, { field: value })
              }
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tags">Tags</SelectItem>
                <SelectItem value="lastActive">Last Active</SelectItem>
                <SelectItem value="emailOpened">Email Opened</SelectItem>
                <SelectItem value="clickedLink">Clicked Link</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={rule.operator}
              onValueChange={(value) =>
                updateRule(rule.id, { operator: value })
              }
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contains">Contains</SelectItem>
                <SelectItem value="notContains">Does not contain</SelectItem>
                <SelectItem value="equals">Equals</SelectItem>
                <SelectItem value="notEquals">Does not equal</SelectItem>
              </SelectContent>
            </Select>

            <Input
              className="flex-1"
              placeholder="Enter value"
              value={rule.value}
              onChange={(e) =>
                updateRule(rule.id, { value: e.target.value })
              }
            />

            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeRule(rule.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="rounded-lg border p-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Matching Tags</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">customer</Badge>
            <Badge variant="secondary">active</Badge>
            <Badge variant="secondary">newsletter</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}