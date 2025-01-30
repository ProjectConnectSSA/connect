"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, MoreVertical, Star, Flag, Trash2 } from "lucide-react";

const mockResponses = [
  {
    id: "1",
    submittedAt: "2024-03-15T10:30:00",
    email: "john@example.com",
    completionTime: "2m 15s",
    status: "complete",
    answers: {
      "What type of customer are you?": "Business",
      "What's your company name?": "Acme Inc",
      "How satisfied are you with our service?": "4",
      "Any additional feedback?": "Great service overall!",
    },
  },
  {
    id: "2",
    submittedAt: "2024-03-15T09:45:00",
    email: "jane@example.com",
    completionTime: "1m 45s",
    status: "partial",
    answers: {
      "What type of customer are you?": "Individual",
      "How satisfied are you with our service?": "5",
    },
  },
];

export function ResponsesList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResponse, setSelectedResponse] = useState<any>(null);

  const handleViewResponse = (response: any) => {
    setSelectedResponse(response);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search responses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Submitted</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Completion Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockResponses.map((response) => (
              <TableRow key={response.id}>
                <TableCell>{new Date(response.submittedAt).toLocaleDateString()}</TableCell>
                <TableCell>{response.email}</TableCell>
                <TableCell>{response.completionTime}</TableCell>
                <TableCell>
                  <Badge variant={response.status === "complete" ? "success" : "warning"}>{response.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewResponse(response)}>
                        <Search className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Star className="mr-2 h-4 w-4" />
                        Mark as Important
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Flag className="mr-2 h-4 w-4" />
                        Flag Response
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!selectedResponse}
        onOpenChange={() => setSelectedResponse(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Response Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Submitted At</p>
                <p className="font-medium">{selectedResponse && new Date(selectedResponse.submittedAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{selectedResponse?.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Completion Time</p>
                <p className="font-medium">{selectedResponse?.completionTime}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <Badge variant={selectedResponse?.status === "complete" ? "success" : "warning"}>{selectedResponse?.status}</Badge>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Answers</h3>
              {selectedResponse &&
                Object.entries(selectedResponse.answers).map(([question, answer]) => (
                  <div
                    key={question}
                    className="space-y-1">
                    <p className="text-sm text-muted-foreground">{question}</p>
                    <p className="font-medium">{answer as string}</p>
                  </div>
                ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
