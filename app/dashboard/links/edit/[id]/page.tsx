"use client";

import { Button } from "@/components/ui/button";
import { Link, Plus, Paintbrush, Settings } from "lucide-react";
import React, { useEffect, useState } from "react";

import { UUID } from "crypto";
import { LinkEditor } from "@/components/links/link-editor";
import { LinkStyles } from "@/components/links/link-styles";
import { LinkPreview } from "@/components/links/link-preview";
import { getFormToEdit } from "@/services/linkFormService";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { getCurrentUser } from "@/app/actions";
interface EditFormPageProps {
  params: Promise<{ id: string }>;
}

interface FormData {
  user_id?: UUID;
  title: string;
  avatarURL?: string;
  links: Link[];
}

interface Link {
  id: string;
  type: string;
  title: string;
  url: string;
  imageURL?: string;
}

interface Style {
  form_background?: string;
  link_background?: string;
  text_color?: string;
  font_family?: string;
  font_size?: string;
  font_weight?: string;
}

export default function EditFormPage({ params }: EditFormPageProps) {
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;

  const [formId, setFormId] = useState(id);
  const [formData, setFormData] = useState<FormData>({ title: "", links: [] });
  const [userId, setUserId] = useState<string | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [styles, setStyles] = useState<Style>({});
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  useEffect(() => {
    const form = getFormToEdit();
    if (form) {
      console.log("edit form", form);
      setFormData(form);
      setLinks(form.links);
      setAvatarUrl(form.avatarURL);
      setStyles(form.style);
    }
    fetchUser();
  }, []);

  async function fetchUser() {
    const currentUser = await getCurrentUser();
    console.log(currentUser);
    if (currentUser) {
      setUserId(currentUser.id);
    } else {
      console.error("No authenticated user found.");
    }
  }

  async function saveForm() {
    toast.success("page saved successfully!");
    const formPayload = {
      user_id: userId,
      title: formData.title,
      avatarURL: avatarUrl,
      links,
      styles,
    };
    console.log("payload", formPayload);
    if (formId === "new") {
      const response = await fetch(`/api/links`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formPayload),
      });
      toast.success("page saved successfully!");
      const newForm = await response.json();
      setFormId(newForm.id);
    } else {
      const response = await fetch(`/api/links`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: formId,
          title: formPayload.title,
          avatarURL: formPayload.avatarURL,
          links: formPayload.links,
          style: formPayload.styles,
        }),
      });
      const updatedForm = await response.json();
      console.log("put req", updatedForm);
      toast.success("page saved successfully!");
    }
  }

  return (
    <div className="flex flex-col h-screen p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{id === "new" ? "Create New Form" : "Edit Form"}</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Title</label>
            <input
              type="text"
              value={formData?.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="border rounded-md px-2 py-1 text-sm w-64"
            />
          </div>
          <Button
            onClick={saveForm}
            disabled={!userId}
            className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Save Form</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-grow h-full space-x-6">
        {/* Left Side: Editor */}
        <div className="w-1/2 flex flex-col space-y-4 bg-white rounded-lg shadow-md">
          <Tabs
            defaultValue="editor"
            className="h-full">
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex items-center justify-between p-4">
                <TabsList className="flex">
                  <TabsTrigger
                    value="editor"
                    className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Editor
                  </TabsTrigger>
                  <TabsTrigger
                    value="styles"
                    className="flex items-center gap-2">
                    <Paintbrush className="h-4 w-4" />
                    Styles
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
            <TabsContent
              value="editor"
              className="p-4 overflow-y-auto h-full">
              <LinkEditor
                links={links}
                setLinks={setLinks}
                avatarURL={avatarUrl}
                setAvatarURL={setAvatarUrl}
              />
            </TabsContent>
            <TabsContent
              value="styles"
              className="p-4 overflow-y-auto h-full">
              <LinkStyles
                styles={styles}
                setStyle={setStyles}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Side: Preview */}
        <div className="w-1/2 flex flex-col space-y-4 bg-gray-100 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-2">Form Preview</h2>
          <div className="flex-grow ">
            <LinkPreview
              links={links}
              avatarURL={avatarUrl}
              style={styles}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
