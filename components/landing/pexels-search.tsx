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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Search, X, ExternalLink } from "lucide-react";
import { debounce } from "lodash";

interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  alt: string;
}

interface PexelsSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectImage: (imageUrl: string, attributionData: any) => void;
}

const COLOR_OPTIONS = [
  { id: "any", name: "Any Color" },
  { id: "red", name: "Red" },
  { id: "orange", name: "Orange" },
  { id: "yellow", name: "Yellow" },
  { id: "green", name: "Green" },
  { id: "turquoise", name: "Turquoise" },
  { id: "blue", name: "Blue" },
  { id: "violet", name: "Violet" },
  { id: "pink", name: "Pink" },
  { id: "brown", name: "Brown" },
  { id: "black", name: "Black" },
  { id: "gray", name: "Gray" },
  { id: "white", name: "White" },
];

const SIZE_OPTIONS = [
  { id: "large", name: "Large" },
  { id: "medium", name: "Medium" },
  { id: "small", name: "Small" },
];

export function PexelsSearch({
  open,
  onOpenChange,
  onSelectImage,
}: PexelsSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [photos, setPhotos] = useState<PexelsPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orientation, setOrientation] = useState("landscape");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("large");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState<PexelsPhoto | null>(null);

  // Function to fetch photos from Pexels
  const fetchPhotos = useCallback(
    async (q: string, orient: string, clr: string, sz: string, pg: number) => {
      setLoading(true);
      setError("");

      try {
        let endpoint = "/api/pexels/curated";
        let params = new URLSearchParams();

        if (q) {
          endpoint = "/api/pexels/search";
          params.append("query", q);
        }

        params.append("orientation", orient);
        params.append("color", clr);
        params.append("size", sz);
        params.append("page", pg.toString());
        params.append("per_page", "20");

        const response = await fetch(`${endpoint}?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to fetch images");
        }

        const data = await response.json();

        // Handle Pexels API response format
        // Both search and curated endpoints return { photos: [], total_results: number, ... }
        setPhotos(data.photos || []);

        // Calculate total pages based on total_results
        const total = data.total_results
          ? Math.ceil(data.total_results / 20)
          : 1;
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
    debounce((q: string, orient: string, clr: string, sz: string) => {
      setPage(1);
      fetchPhotos(q, orient, clr, sz, 1);
    }, 500),
    []
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query, orientation, color, size);
  };

  // Handle orientation change
  const handleOrientationChange = (orient: string) => {
    setOrientation(orient);
    setPage(1);
    fetchPhotos(searchQuery, orient, color, size, 1);
  };

  // Handle color change
  const handleColorChange = (clr: string) => {
    setColor(clr);
    setPage(1);
    fetchPhotos(searchQuery, orientation, clr, size, 1);
  };

  // Handle size change
  const handleSizeChange = (sz: string) => {
    setSize(sz);
    setPage(1);
    fetchPhotos(searchQuery, orientation, color, sz, 1);
  };

  // Load more results
  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPhotos(searchQuery, orientation, color, size, nextPage);
  };

  // Select an image
  const handleSelectImage = (photo: PexelsPhoto) => {
    setSelectedPhoto(photo);
  };

  // Confirm selection
  const confirmSelection = () => {
    if (selectedPhoto) {
      // Create attribution data
      const attributionData = {
        photographer: selectedPhoto.photographer,
        photographerUrl: selectedPhoto.photographer_url,
        pexelsUrl: selectedPhoto.url,
      };

      // Pass the image URL and attribution data back to parent component
      onSelectImage(selectedPhoto.src.large, attributionData);
      onOpenChange(false);
    }
  };

  // Load initial images when dialog opens
  useEffect(() => {
    if (open) {
      fetchPhotos("", orientation, color, size, 1);
    }
  }, [open, fetchPhotos, orientation, color, size]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl">
            <a
              href="https://www.pexels.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 hover:underline flex items-center"
            >
              Pexels Images
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </DialogTitle>
          <DialogDescription>
            Search and select high-quality free stock photos from Pexels
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search Pexels images..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-9"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    fetchPhotos("", orientation, color, size, 1);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Orientation
              </label>
              <div className="flex gap-2">
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
                  variant={orientation === "square" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleOrientationChange("square")}
                >
                  Square
                </Button>
              </div>
            </div>

            <div className="w-36">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Color
              </label>
              <Select
                value={color || "any"} // Use "any" instead of empty string
                onValueChange={(value) =>
                  handleColorChange(value === "any" ? "" : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any color" />
                </SelectTrigger>
                <SelectContent>
                  {COLOR_OPTIONS.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-36">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Size
              </label>
              <Select value={size} onValueChange={handleSizeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Size" />
                </SelectTrigger>
                <SelectContent>
                  {SIZE_OPTIONS.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                {Array.isArray(photos) &&
                  photos.map((photo) => (
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
                        src={photo.src.medium}
                        alt={photo.alt || "Pexels image"}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                        <div className="text-xs text-white truncate">
                          By {photo.photographer}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {Array.isArray(photos) && photos.length === 0 && !loading && (
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
                href={`${selectedPhoto.photographer_url}?utm_source=your_app&utm_medium=referral`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600 hover:text-blue-800"
              >
                {selectedPhoto.photographer}
              </a>{" "}
              on{" "}
              <a
                href="https://www.pexels.com/?utm_source=your_app&utm_medium=referral"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600 hover:text-blue-800"
              >
                Pexels
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
