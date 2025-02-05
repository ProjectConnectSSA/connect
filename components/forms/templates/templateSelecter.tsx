"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// ----- Interfaces -----
// You can also import these interfaces from a shared types file.
export interface Form {
  title: string;
  description: string;
  pages: Pages[];
  background?: string;
  styles?: {
    width?: string;
    height?: string;
    columns?: number;
  };
  isActive?: boolean;
  isMultiPage?: boolean;
}

export interface Pages {
  id: string;
  title: string;
  elements: Elements[];
  condition?: Condition;
  styles?: Record<string, any>;
  background?: string;
}

export interface Elements {
  id: string;
  title: string;
  styles: {
    backgroundColor?: string;
    width?: string;
    height?: string;
  };
  type: string;
  required: boolean;
  value?: string;
}

export interface Condition {
  id: string;
  elementId: string;
  operator: string;
  value: string;
  targetPageId: string;
}

export interface TemplateSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelectTemplate: (template: Form) => void;
}

// ----- Detailed Templates -----
// Each template now contains multiple elements for a richer starting design.
const templates: Form[] = [
  {
    title: "Customer Feedback Form",
    description: "Gather valuable customer feedback on your product or service.",
    pages: [
      {
        id: "feedback-page-1",
        title: "Feedback",
        elements: [
          {
            id: "fb-el1",
            title: "Name",
            type: "text",
            required: true,
            styles: { backgroundColor: "#ffffff", width: "100%", height: "40px" },
          },
          {
            id: "fb-el2",
            title: "Email",
            type: "email",
            required: true,
            styles: { backgroundColor: "#ffffff", width: "100%", height: "40px" },
          },
          {
            id: "fb-el3",
            title: "Rating",
            type: "rating",
            required: true,
            styles: { backgroundColor: "#ffffff", width: "100%", height: "40px" },
          },
          {
            id: "fb-el4",
            title: "Comments",
            type: "text",
            required: false,
            styles: { backgroundColor: "#ffffff", width: "100%", height: "80px" },
          },
        ],
      },
    ],
    isMultiPage: false,
    styles: { columns: 1, width: "100%" },
  },
  {
    title: "User Registration Form",
    description: "Register new users with detailed information.",
    pages: [
      {
        id: "registration-page-1",
        title: "Register",
        elements: [
          {
            id: "reg-el1",
            title: "Username",
            type: "text",
            required: true,
            styles: { backgroundColor: "#ffffff", width: "100%", height: "40px" },
          },
          {
            id: "reg-el2",
            title: "Email",
            type: "email",
            required: true,
            styles: { backgroundColor: "#ffffff", width: "100%", height: "40px" },
          },
          {
            id: "reg-el3",
            title: "Password",
            type: "text",
            required: true,
            styles: { backgroundColor: "#ffffff", width: "100%", height: "40px" },
          },
          {
            id: "reg-el4",
            title: "Confirm Password",
            type: "text",
            required: true,
            styles: { backgroundColor: "#ffffff", width: "100%", height: "40px" },
          },
        ],
      },
    ],
    isMultiPage: false,
    styles: { columns: 1, width: "100%" },
  },
  {
    title: "Job Application Form",
    description: "Submit your application details easily.",
    pages: [
      {
        id: "application-page-1",
        title: "Application",
        elements: [
          {
            id: "app-el1",
            title: "Full Name",
            type: "text",
            required: true,
            styles: { backgroundColor: "#ffffff", width: "100%", height: "40px" },
          },
          {
            id: "app-el2",
            title: "Email",
            type: "email",
            required: true,
            styles: { backgroundColor: "#ffffff", width: "100%", height: "40px" },
          },
          {
            id: "app-el3",
            title: "Phone Number",
            type: "phone",
            required: true,
            styles: { backgroundColor: "#ffffff", width: "100%", height: "40px" },
          },
          {
            id: "app-el4",
            title: "Cover Letter",
            type: "text",
            required: false,
            styles: { backgroundColor: "#ffffff", width: "100%", height: "80px" },
          },
          {
            id: "app-el5",
            title: "Resume Upload",
            type: "image", // Using 'image' type to simulate file upload.
            required: true,
            styles: { backgroundColor: "#ffffff", width: "100%", height: "40px" },
          },
        ],
      },
    ],
    isMultiPage: false,
    styles: { columns: 1, width: "100%" },
  },
  {
    title: "Market Research Survey",
    description: "Collect insights for your market research.",
    pages: [
      {
        id: "survey-page-1",
        title: "Survey",
        elements: [
          {
            id: "surv-el1",
            title: "Age",
            type: "text",
            required: true,
            styles: { backgroundColor: "#ffffff", width: "100%", height: "40px" },
          },
          {
            id: "surv-el2",
            title: "Gender",
            type: "select",
            required: true,
            styles: { backgroundColor: "#ffffff", width: "100%", height: "40px" },
          },
          {
            id: "surv-el3",
            title: "Feedback",
            type: "text",
            required: false,
            styles: { backgroundColor: "#ffffff", width: "100%", height: "80px" },
          },
        ],
      },
    ],
    isMultiPage: false,
    styles: { columns: 1, width: "100%" },
  },
  {
    title: "Contact Us Form",
    description: "Allow customers to easily get in touch.",
    pages: [
      {
        id: "contact-page-1",
        title: "Contact Us",
        elements: [
          {
            id: "con-el1",
            title: "Name",
            type: "text",
            required: true,
            styles: { backgroundColor: "#ffffff", width: "100%", height: "40px" },
          },
          {
            id: "con-el2",
            title: "Email",
            type: "email",
            required: true,
            styles: { backgroundColor: "#ffffff", width: "100%", height: "40px" },
          },
          {
            id: "con-el3",
            title: "Message",
            type: "text",
            required: false,
            styles: { backgroundColor: "#ffffff", width: "100%", height: "80px" },
          },
        ],
      },
    ],
    isMultiPage: false,
    styles: { columns: 1, width: "100%" },
  },
  {
    title: "Product Order Form",
    description: "Place an order for your favorite products.",
    pages: [
      {
        id: "order-page-1",
        title: "Order",
        elements: [
          {
            id: "ord-el1",
            title: "Product Name",
            type: "text",
            required: true,
            styles: { backgroundColor: "#ffffff", width: "100%", height: "40px" },
          },
          {
            id: "ord-el2",
            title: "Quantity",
            type: "text",
            required: true,
            styles: { backgroundColor: "#ffffff", width: "100%", height: "40px" },
          },
          {
            id: "ord-el3",
            title: "Customer Name",
            type: "text",
            required: true,
            styles: { backgroundColor: "#ffffff", width: "100%", height: "40px" },
          },
          {
            id: "ord-el4",
            title: "Shipping Address",
            type: "text",
            required: true,
            styles: { backgroundColor: "#ffffff", width: "100%", height: "80px" },
          },
        ],
      },
    ],
    isMultiPage: false,
    styles: { columns: 1, width: "100%" },
  },
  {
    title: "Appointment Booking Form",
    description: "Schedule your appointment quickly and easily.",
    pages: [
      {
        id: "booking-page-1",
        title: "Booking",
        elements: [
          {
            id: "book-el1",
            title: "Full Name",
            type: "text",
            required: true,
            styles: { backgroundColor: "#ffffff", width: "100%", height: "40px" },
          },
          {
            id: "book-el2",
            title: "Email",
            type: "email",
            required: true,
            styles: { backgroundColor: "#ffffff", width: "100%", height: "40px" },
          },
          {
            id: "book-el3",
            title: "Phone",
            type: "phone",
            required: true,
            styles: { backgroundColor: "#ffffff", width: "100%", height: "40px" },
          },
          {
            id: "book-el4",
            title: "Appointment Date",
            type: "date",
            required: true,
            styles: { backgroundColor: "#ffffff", width: "100%", height: "40px" },
          },
          {
            id: "book-el5",
            title: "Preferred Time",
            type: "text",
            required: true,
            styles: { backgroundColor: "#ffffff", width: "100%", height: "40px" },
          },
        ],
      },
    ],
    isMultiPage: false,
    styles: { columns: 1, width: "100%" },
  },
  {
    title: "Event Registration Form",
    description: "Sign up for our exciting upcoming event.",
    pages: [
      {
        id: "event-page-1",
        title: "Event Signup",
        elements: [
          {
            id: "event-el1",
            title: "Full Name",
            type: "text",
            required: true,
            styles: { backgroundColor: "#ffffff", width: "100%", height: "40px" },
          },
          {
            id: "event-el2",
            title: "Email",
            type: "email",
            required: true,
            styles: { backgroundColor: "#ffffff", width: "100%", height: "40px" },
          },
          {
            id: "event-el3",
            title: "Ticket Type",
            type: "select",
            required: true,
            styles: { backgroundColor: "#ffffff", width: "100%", height: "40px" },
          },
          {
            id: "event-el4",
            title: "Additional Comments",
            type: "text",
            required: false,
            styles: { backgroundColor: "#ffffff", width: "100%", height: "80px" },
          },
        ],
      },
    ],
    isMultiPage: false,
    styles: { columns: 1, width: "100%" },
  },
  {
    title: "Online Quiz Form",
    description: "Test knowledge with our fun and interactive quiz.",
    pages: [
      {
        id: "quiz-page-1",
        title: "Quiz",
        elements: [
          {
            id: "quiz-el1",
            title: "Question 1",
            type: "text",
            required: true,
            styles: { backgroundColor: "#ffffff", width: "100%", height: "40px" },
          },
          {
            id: "quiz-el2",
            title: "Question 2",
            type: "text",
            required: true,
            styles: { backgroundColor: "#ffffff", width: "100%", height: "40px" },
          },
          {
            id: "quiz-el3",
            title: "Question 3",
            type: "text",
            required: true,
            styles: { backgroundColor: "#ffffff", width: "100%", height: "40px" },
          },
        ],
      },
    ],
    isMultiPage: false,
    styles: { columns: 1, width: "100%" },
  },
  {
    title: "Newsletter Signup Form",
    description: "Grow your mailing list by capturing subscriber details.",
    pages: [
      {
        id: "newsletter-page-1",
        title: "Newsletter Signup",
        elements: [
          {
            id: "news-el1",
            title: "Email",
            type: "email",
            required: true,
            styles: { backgroundColor: "#ffffff", width: "100%", height: "40px" },
          },
          {
            id: "news-el2",
            title: "First Name",
            type: "text",
            required: false,
            styles: { backgroundColor: "#ffffff", width: "100%", height: "40px" },
          },
          {
            id: "news-el3",
            title: "Last Name",
            type: "text",
            required: false,
            styles: { backgroundColor: "#ffffff", width: "100%", height: "40px" },
          },
        ],
      },
    ],
    isMultiPage: false,
    styles: { columns: 1, width: "100%" },
  },
];

export function TemplateSelector({ open, onClose, onSelectTemplate }: TemplateSelectorProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select a Template</DialogTitle>
          <DialogDescription>Choose one of our pre-designed templates to start your form.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {templates.map((template, index) => (
            <Card
              key={index}
              className="cursor-pointer hover:shadow-lg p-4"
              onClick={() => onSelectTemplate(template)}>
              <h3 className="text-lg font-semibold">{template.title}</h3>
              <p className="text-sm text-gray-600">{template.description}</p>
            </Card>
          ))}
        </div>
        <DialogClose asChild>
          <Button
            variant="ghost"
            className="mt-4 w-full"
            onClick={onClose}>
            Cancel
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
