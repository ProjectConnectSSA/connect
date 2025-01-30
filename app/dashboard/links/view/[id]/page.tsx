"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

interface Link {
  id: string;
  type: string;
  title: string;
  url: string;
}

interface Style {
  form_background?: string;
  link_background?: string;
  text_color?: string;
  font_family?: string;
  font_size?: string;
  font_weight?: string;
}

interface ViewFormPageProps {
  params: Promise<{ id: string }>;
}

export default function FormView({ params }: ViewFormPageProps) {
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;

  const [links, setLinks] = useState<Link[]>([]);
  const [style, setStyle] = useState<Style>({});
  const [avatarURL, setAvatarURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    console.log(id);
    async function fetchFormData() {
      try {
        const response = await fetch(`/api/links/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch form data");
        }
        const data = await response.json();
        console.log("view form", data);

        // Assuming the response contains `links`, `avatarURL`, and `style`
        setLinks(data.links || []);
        setAvatarURL(data.avatarURL || null);
        setStyle(data.style || {});
      } catch (error) {
        console.error("Error fetching form data:", error);
        router.push("/404"); // Redirect to a 404 page if the form is not found
      } finally {
        setLoading(false);
      }
    }

    fetchFormData();
  }, [id, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="p-6 space-y-4 rounded-lg h-[90vh]  flex flex-col"
      style={{ backgroundColor: style.form_background || "#ffffff" }}>
      {/* Avatar Display */}
      {avatarURL && (
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={avatarURL}
            alt="Avatar"
            className="w-16 h-16 rounded-full border"
          />
        </div>
      )}

      {/* Links Display */}
      {links.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block no-underline">
          <Card style={{ backgroundColor: style.link_background || "#f8f8f8" }}>
            <CardContent className="p-4">
              <div className="text-center">
                <h3
                  style={{ color: style.text_color, fontFamily: style.font_family, fontSize: style.font_size, fontWeight: style.font_weight }}
                  className="font-semibold">
                  {link.title || "Untitled Link"}
                </h3>
              </div>
            </CardContent>
          </Card>
        </a>
      ))}
    </div>
  );
}
