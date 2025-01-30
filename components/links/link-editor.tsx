/* eslint-disable no-unused-vars */

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, GripVertical, Edit3 } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import supabase from "@/lib/supabaseClient";

interface Link {
  id: string;
  type: string;
  title: string;
  url: string;
}

interface LinkEditorProps {
  links: Link[];
  setLinks: (links: Link[]) => void;
  avatarURL: string | null;
  setAvatarURL: (avatar: string) => void;
}

export function LinkEditor({ links, setLinks, avatarURL, setAvatarURL }: LinkEditorProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentLink, setCurrentLink] = useState<Link | null>(null);

  const openAddModal = () => {
    setCurrentLink({ id: "", type: "", title: "", url: "" });
    setIsAddModalOpen(true);
  };
  const openEditModal = (link: Link) => {
    setCurrentLink(link);
    setIsEditModalOpen(true);
  };

  const handleSaveLink = () => {
    if (currentLink) {
      if (currentLink.id) {
        // Edit existing link
        setLinks(links.map((link) => (link.id === currentLink.id ? currentLink : link)));
      } else {
        // Add new link
        setLinks([{ ...currentLink, id: Date.now().toString() }, ...links]);
      }
    }
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
  };

  const removeLink = (id: string) => {
    setLinks(links.filter((link) => link.id !== id));
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(links);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setLinks(items);
  };

  // Avatar upload handler

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // If an avatar URL already exists, remove the old image
      if (avatarURL) {
        const filePath = avatarURL.split("/").pop(); // Extract the filename from the URL
        if (filePath) {
          await supabase.storage.from("linkimage").remove([filePath]);
        }
      }

      // Upload the new image
      const fileName = `${Date.now()}_${"Avatar"}`;
      const { data, error } = await supabase.storage.from("linkimage").upload(fileName, file);

      if (error) {
        console.error("Avatar upload error:", error.message);
      } else if (data) {
        // Get public URL for the uploaded image and update the avatarUrl state
        const { publicUrl } = supabase.storage.from("linkimage").getPublicUrl(data.path).data;
        console.log(publicUrl);
        setAvatarURL(publicUrl);
      }
    }
  };

  const updateCurrentLink = (field: keyof Link, value: string) => {
    setCurrentLink((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  return (
    <div className="h-full p-6 space-y-6">
      {/* Avatar Upload Section */}
      <Card className="shadow-md border rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Avatar</CardTitle>
        </div>
        <div className="flex items-center space-x-4">
          {avatarURL && (
            <img
              src={avatarURL}
              alt="Avatar"
              className="w-16 h-16 rounded-full border"
            />
          )}
          <input
            type="file"
            onChange={handleAvatarUpload}
          />
        </div>
      </Card>
      {/* Links Section */}
      <Card className="shadow-md border rounded-lg">
        <CardHeader className="flex justify-between px-4 py-2 bg-gray-100 rounded-t-lg">
          <div className="flex justify-between">
            <CardTitle className="text-sm font-medium">Links</CardTitle>
            <Button onClick={openAddModal}>
              <Plus className="mr-2 h-4 w-4" />
              Add Link
            </Button>
          </div>
        </CardHeader>

        <div className="overflow-y-auto max-h-64 p-4">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="links">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4">
                  {links.map((link, index) => (
                    <Draggable
                      key={link.id}
                      draggableId={link.id}
                      index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex items-center justify-between p-2 bg-white shadow rounded-md border">
                          <div className="flex items-center space-x-2">
                            <div {...provided.dragHandleProps}>
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <span className="text-sm">{link.title || `Link ${index + 1}`}</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditModal(link)}>
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => removeLink(link.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </Card>

      {/* Add/Edit Link Modal */}
      <Dialog.Root
        open={isAddModalOpen || isEditModalOpen}
        onOpenChange={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
        }}>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
        <Dialog.Content className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg space-y-4">
            <Dialog.Title className="text-lg font-semibold">{isEditModalOpen ? "Edit Link" : "Add Link"}</Dialog.Title>
            <Input
              placeholder="Title"
              value={currentLink?.title || ""}
              onChange={(e) => updateCurrentLink("title", e.target.value)}
            />
            <select
              value={currentLink?.type || "simple"}
              onChange={(e) => updateCurrentLink("type", e.target.value as "simple" | "image")}
              className="border rounded p-2">
              <option value="simple">Simple</option>
              <option value="image">Image</option>
            </select>
            <Input
              placeholder="URL"
              value={currentLink?.url || ""}
              onChange={(e) => updateCurrentLink("url", e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}>
                Cancel
              </Button>
              <Button onClick={handleSaveLink}>{isEditModalOpen ? "Save Changes" : "Add Link"}</Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
}
