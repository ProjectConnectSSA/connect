"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book, Clock, ArrowUpRight } from "lucide-react";
import Image from "next/image"; // Use Next.js Image for optimization

export interface Tutorial {
  id: number;
  title: string;
  duration: string;
  difficulty: string;
  image?: string; // Make image optional or provide default
}

interface TutorialsWidgetProps {
  tutorials: Tutorial[];
}

export function TutorialsWidget({ tutorials }: TutorialsWidgetProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>
          <div className="flex items-center">
            <Book className="mr-2 h-5 w-5 text-purple-600" />
            Quick Tutorials
          </div>
        </CardTitle>
        <Button
          variant="ghost"
          size="sm">
          View Library
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {" "}
          {/* Slightly reduced spacing */}
          {tutorials.slice(0, 4).map(
            (
              tutorial // Show only first 4
            ) => (
              <a // Make it a link if tutorials are clickable
                key={tutorial.id}
                href="#" // Replace with actual link later
                className="flex items-center space-x-3 rounded-lg border p-3 transition-colors hover:bg-gray-50 cursor-pointer group">
                <div className="flex-shrink-0 h-12 w-12 rounded overflow-hidden bg-gray-200 relative">
                  {tutorial.image ? (
                    <Image
                      src={tutorial.image}
                      alt={tutorial.title}
                      layout="fill"
                      objectFit="cover"
                      className="group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-300 flex items-center justify-center text-gray-500">
                      <Book className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm line-clamp-2">{tutorial.title}</h4> {/* Limit title lines */}
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Clock className="mr-1 h-3 w-3" />
                    {tutorial.duration} | {tutorial.difficulty}
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-gray-700 transition-colors ml-auto" />
              </a>
            )
          )}
          {tutorials.length === 0 && <p className="text-sm text-center text-gray-500 py-4">No tutorials available.</p>}
        </div>
      </CardContent>
    </Card>
  );
}
