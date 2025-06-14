"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConditionBuilder } from "./condition-builder";
import { ConditionFlow } from "./flow/condition-flow";
import { List, Share2 } from "lucide-react";

interface ConditionTabsProps {
  form: any;
  setForm: (form: any) => void;
}

export function ConditionTabs({ form, setForm }: ConditionTabsProps) {
  return (
    <Tabs
      defaultValue="list"
      className="h-full overflow-x-hidden">
      <div className="border-b px-6 py-2">
        <TabsList>
          <TabsTrigger
            value="list"
            className="flex items-center gap-2">
            <List className="h-4 w-4" />
            List View
          </TabsTrigger>
          <TabsTrigger
            value="flow"
            className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Flow View
          </TabsTrigger>
        </TabsList>
      </div>

      {/* LIST TAB */}
      <TabsContent
        value="list"
        // Ensure horizontal overflow is hidden here
        className="h-[calc(100%-3rem)] mt-0 overflow-x-hidden">
        <ConditionBuilder
          form={form}
          setForm={setForm}
        />
      </TabsContent>

      {/* FLOW TAB */}
      <TabsContent
        value="flow"
        className="h-full w-full overflow-x-hidden">
        <ConditionFlow
          form={form}
          setForm={setForm}
        />
      </TabsContent>
    </Tabs>
  );
}
