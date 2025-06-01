"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Search, X, ExternalLink } from "lucide-react";
import { debounce } from "lodash";
import Image from "next/image";

interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    name: string;
    username: string;
    links: {
      html: string;
    };
  };
  alt_description: string;
  description: string;
  links: {
    html: string;
  };
  width: number;
  height: number;
}

interface UnsplashSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectImage: (imageUrl: string, attributionData: any) => void;
}

const CATEGORIES = [
  { id: "all", name: "All" },
  { id: "nature", name: "Nature" },
  { id: "business", name: "Business" },
  { id: "technology", name: "Technology" },
  { id: "backgrounds", name: "Backgrounds" },
  { id: "patterns", name: "Patterns" },
  { id: "architecture", name: "Architecture" },
];

export function UnsplashSearch({
  open,
  onOpenChange,
  onSelectImage,
}: UnsplashSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [orientation, setOrientation] = useState("landscape"); // landscape, portrait, squarish
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState<UnsplashPhoto | null>(
    null
  );

  // Function to fetch photos from Unsplash
  const fetchPhotos = useCallback(
    async (q: string, category: string, orient: string, pg: number) => {
      setLoading(true);
      setError("");

      try {
        let endpoint = "/api/unsplash/photos";
        let params = new URLSearchParams();

        if (q) {
          endpoint = "/api/unsplash/search";
          params.append("query", q);
        }

        if (category !== "all") {
          params.append("category", category);
        }

        params.append("orientation", orient);
        params.append("page", pg.toString());
        params.append("per_page", "20");

        const response = await fetch(`${endpoint}?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to fetch images");
        }

        const data = await response.json();

        // Handle different response structures (search vs. random photos)
        const results = q ? data.results : data;
        const total = q ? data.total_pages : 1;

        setPhotos(results);
        setTotalPages(total);
      } catch (err) {
        console.error("Error fetching images:", err);
        setError("Failed to load images. Please try again.");
        setPhotos([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((q: string, cat: string, orient: string) => {
      setPage(1);
      fetchPhotos(q, cat, orient, 1);
    }, 500),
    []
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query, selectedCategory, orientation);
  };

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
    fetchPhotos(searchQuery, category, orientation, 1);
  };

  // Handle orientation change
  const handleOrientationChange = (orient: string) => {
    setOrientation(orient);
    setPage(1);
    fetchPhotos(searchQuery, selectedCategory, orient, 1);
  };

  // Load more results
  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPhotos(searchQuery, selectedCategory, orientation, nextPage);
  };

  // Select an image
  const handleSelectImage = (photo: UnsplashPhoto) => {
    setSelectedPhoto(photo);
  };

  // Confirm selection
  const confirmSelection = () => {
    if (selectedPhoto) {
      // Create attribution data
      const attributionData = {
        photographer: selectedPhoto.user.name,
        photographerUrl: selectedPhoto.user.links.html,
        unsplashUrl: selectedPhoto.links.html,
      };

      // Pass the image URL and attribution data back to parent component
      onSelectImage(selectedPhoto.urls.regular, attributionData);
      onOpenChange(false);
    }
  };

  // Load initial images when dialog opens
  useEffect(() => {
    if (open) {
      fetchPhotos("", "all", orientation, 1);
    }
  }, [open, fetchPhotos, orientation]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl">
            <a
              href="https://unsplash.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 hover:underline flex items-center"
            >
              Unsplash Images
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </DialogTitle>
          <DialogDescription>
            Search and select high-quality images from Unsplash
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search Unsplash images..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-9"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    fetchPhotos("", selectedCategory, orientation, 1);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap justify-between">
            <Tabs
              defaultValue="all"
              value={selectedCategory}
              onValueChange={handleCategoryChange}
              className="w-full"
            >
              <TabsList className="flex w-full h-auto flex-wrap">
                {CATEGORIES.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="text-sm py-1 px-3"
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="flex mt-4 gap-2">
              <Button
                variant={orientation === "landscape" ? "default" : "outline"}
                size="sm"
                onClick={() => handleOrientationChange("landscape")}
              >
                Landscape
              </Button>
              <Button
                variant={orientation === "portrait" ? "default" : "outline"}
                size="sm"
                onClick={() => handleOrientationChange("portrait")}
              >
                Portrait
              </Button>
              <Button
                variant={orientation === "squarish" ? "default" : "outline"}
                size="sm"
                onClick={() => handleOrientationChange("squarish")}
              >
                Square
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {error && <div className="text-red-500 mb-4">{error}</div>}

          {loading && photos.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className={`relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer transition-all hover:opacity-95 border-2 ${
                      selectedPhoto?.id === photo.id
                        ? "border-blue-500 ring-2 ring-blue-500"
                        : "border-transparent"
                    }`}
                    onClick={() => handleSelectImage(photo)}
                  >
                    <img
                      src={photo.urls.small}
                      alt={photo.alt_description || "Unsplash image"}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                      <div className="text-xs text-white truncate">
                        By {photo.user.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {photos.length === 0 && !loading && (
                <div className="text-center py-10">
                  <p className="text-gray-500">
                    No images found. Try a different search term.
                  </p>
                </div>
              )}

              {page < totalPages && (
                <div className="flex justify-center mt-6">
                  <Button
                    variant="outline"
                    onClick={loadMore}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Load more
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t">
          {selectedPhoto && (
            <div className="flex-1 text-sm text-gray-500">
              Photo by{" "}
              <a
                href={`${selectedPhoto.user.links.html}?utm_source=your_app&utm_medium=referral`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600 hover:text-blue-800"
              >
                {selectedPhoto.user.name}
              </a>{" "}
              on{" "}
              <a
                href="https://unsplash.com/?utm_source=your_app&utm_medium=referral"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600 hover:text-blue-800"
              >
                Unsplash
              </a>
            </div>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              disabled={!selectedPhoto || loading}
              onClick={confirmSelection}
            >
              Select Image
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
