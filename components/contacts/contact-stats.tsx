// File: src/components/contacts/ContactStats.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Lead } from "@/app/types/LeadType";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, UserPlus, UserCheck, UserX } from "lucide-react";

export function ContactStats() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeads() {
      try {
        const res = await fetch("/api/Leads");
        if (!res.ok) throw new Error("Failed to load leads");
        const data: Lead[] = await res.json();
        setLeads(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeads();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading stats…</div>;
  }

  const total = leads.length;

  const now = new Date();
  const ms30 = 30 * 24 * 60 * 60 * 1000;
  const cutoff30 = new Date(now.getTime() - ms30);
  const newCount = leads.filter((l) => new Date(l.createdAt) >= cutoff30).length;
  const newPercent = total > 0 ? Math.round((newCount / total) * 100) : 0;

  const activeCount = leads.filter((l) => l.status === "confirmed").length;
  const activePercent = total > 0 ? Math.round((activeCount / total) * 100) : 0;

  const unsubCount = leads.filter((l) => l.status === "unsubscribed").length;
  const unsubPercent = total > 0 ? Math.round((unsubCount / total) * 100) : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Contacts */}
      <Card>
        <CardHeader className="flex items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{total}</div>
          <p className="text-xs text-muted-foreground">across all sources</p>
          <Progress
            value={100}
            className="mt-2"
          />{" "}
          {/* always full */}
        </CardContent>
      </Card>

      {/* New Contacts */}
      <Card>
        <CardHeader className="flex items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">New Contacts</CardTitle>
          <UserPlus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{newCount}</div>
          <p className="text-xs text-muted-foreground">Last 30 days</p>
          <Progress
            value={newPercent}
            className="mt-2"
          />
        </CardContent>
      </Card>

      {/* Active Contacts */}
      <Card>
        <CardHeader className="flex items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Contacts</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeCount}</div>
          <p className="text-xs text-muted-foreground">{activePercent}% of total</p>
          <Progress
            value={activePercent}
            className="mt-2"
          />
        </CardContent>
      </Card>

      {/* Unsubscribed */}
      <Card>
        <CardHeader className="flex items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Unsubscribed</CardTitle>
          <UserX className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{unsubCount}</div>
          <p className="text-xs text-muted-foreground">{unsubPercent}% unsubscribe</p>
          <Progress
            value={unsubPercent}
            className="mt-2"
          />
        </CardContent>
      </Card>
    </div>
  );
}
