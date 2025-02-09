"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Clock, Globe } from "lucide-react";

export function CampaignScheduler() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [enableScheduling, setEnableScheduling] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Switch
          checked={enableScheduling}
          onCheckedChange={setEnableScheduling}
        />
        <Label>Schedule for later</Label>
      </div>

      {enableScheduling && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <Label>Select Date</Label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Time</Label>
              <div className="flex gap-2">
                <Select defaultValue="09">
                  <SelectTrigger>
                    <SelectValue placeholder="Hour" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }).map((_, i) => (
                      <SelectItem
                        key={i}
                        value={i.toString().padStart(2, "0")}
                      >
                        {i.toString().padStart(2, "0")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select defaultValue="00">
                  <SelectTrigger>
                    <SelectValue placeholder="Minute" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 60 }).map((_, i) => (
                      <SelectItem
                        key={i}
                        value={i.toString().padStart(2, "0")}
                      >
                        {i.toString().padStart(2, "0")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select defaultValue="UTC">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">
                    <div className="flex items-center">
                      <Globe className="mr-2 h-4 w-4" />
                      UTC
                    </div>
                  </SelectItem>
                  <SelectItem value="EST">EST (UTC-5)</SelectItem>
                  <SelectItem value="PST">PST (UTC-8)</SelectItem>
                  <SelectItem value="GMT">GMT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sending Speed</Label>
              <Select defaultValue="normal">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slow">
                    Slow (100 emails/hour)
                  </SelectItem>
                  <SelectItem value="normal">
                    Normal (500 emails/hour)
                  </SelectItem>
                  <SelectItem value="fast">
                    Fast (1000 emails/hour)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}