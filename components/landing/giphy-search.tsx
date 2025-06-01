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
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("per_page") || "24", 10);

  // Calculate offset based on page and perPage
  const offset = (page - 1) * perPage;

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  try {
    const apiKey = process.env.GIPHY_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GIPHY API key is not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(
        query
      )}&limit=${perPage}&offset=${offset}&rating=g`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch from GIPHY");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error searching GIPHY:", error);
    return NextResponse.json(
      { error: "Failed to search GIFs" },
      { status: 500 }
    );
  }
}
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Search, X, ExternalLink } from "lucide-react";
import { debounce } from "lodash";

interface GiphyGif {
  id: string;
  title: string;
  images: {
    fixed_height: {
      url: string;
      width: string;
      height: string;
    };
    original: {
      url: string;
      width: string;
      height: string;
    };
    preview_gif: {
      url: string;
    };
  };
  user?: {
    display_name?: string;
    username?: string;
    profile_url?: string;
  };
  url: string;
}

interface GiphySearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectImage: (imageUrl: string, attributionData: any) => void;
}

const CATEGORIES = [
  { id: "all", name: "All" },
  { id: "trending", name: "Trending" },
  { id: "reactions", name: "Reactions" },
  { id: "stickers", name: "Stickers" },
  { id: "memes", name: "Memes" },
  { id: "animals", name: "Animals" },
  { id: "sports", name: "Sports" },
  { id: "entertainment", name: "Entertainment" },
];

export function GiphySearch({
  open,
  onOpenChange,
  onSelectImage,
}: GiphySearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [gifs, setGifs] = useState<GiphyGif[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedGif, setSelectedGif] = useState<GiphyGif | null>(null);

  // Function to fetch GIFs from Giphy
  const fetchGifs = useCallback(
    async (q: string, category: string, pg: number) => {
      setLoading(true);
      setError("");

      try {
        let endpoint = "/api/giphy/trending";
        let params = new URLSearchParams();

        if (q) {
          endpoint = "/api/giphy/search";
          params.append("query", q);
        }

        if (category === "trending") {
          endpoint = "/api/giphy/trending";
        } else if (category === "stickers") {
          endpoint = "/api/giphy/stickers";
        } else if (category !== "all" && category !== "trending") {
          // Use the category as a search term if it's not "all" or "trending"
          if (!q) {
            endpoint = "/api/giphy/search";
            params.append("query", category);
          } else {
            // If there's already a query, append the category
            params.set("query", `${q} ${category}`);
          }
        }

        params.append("page", pg.toString());
        params.append("per_page", "24");

        const response = await fetch(`${endpoint}?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to fetch GIFs");
        }

        const data = await response.json();

        // Handle pagination
        const newGifs = pg === 1 ? data.data : [...gifs, ...data.data];
        setGifs(newGifs);
        setTotalPages(Math.ceil(data.pagination?.total_count / 24) || 1);
      } catch (err) {
        console.error("Error fetching GIFs:", err);
        setError("Failed to load GIFs. Please try again.");
        setGifs([]);
      } finally {
        setLoading(false);
      }
    },
    [gifs]
  );

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((q: string, category: string) => {
      setPage(1);
      fetchGifs(q, category, 1);
    }, 500),
    []
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query, selectedCategory);
  };

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
    fetchGifs(searchQuery, category, 1);
  };

  // Load more results
  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchGifs(searchQuery, selectedCategory, nextPage);
  };

  // Select a GIF
  const handleSelectGif = (gif: GiphyGif) => {
    setSelectedGif(gif);
  };

  // Confirm selection
  const confirmSelection = () => {
    if (selectedGif) {
      // Create attribution data
      const attributionData = {
        username: selectedGif.user?.username || "GIPHY User",
        userUrl: selectedGif.user?.profile_url || "https://giphy.com",
        giphyUrl: selectedGif.url,
      };

      // Pass the GIF URL and attribution data back to parent component
      onSelectImage(selectedGif.images.original.url, attributionData);
      onOpenChange(false);
    }
  };

  // Load initial GIFs when dialog opens
  useEffect(() => {
    if (open) {
      fetchGifs("", "trending", 1);
    }
  }, [open, fetchGifs]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl">
            <a
              href="https://giphy.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 hover:underline flex items-center"
            >
              GIPHY
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </DialogTitle>
          <DialogDescription>
            Search and select GIFs from GIPHY
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search GIPHY..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-9"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    fetchGifs("", selectedCategory, 1);
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
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {error && <div className="text-red-500 mb-4">{error}</div>}

          {loading && gifs.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {gifs.map((gif) => (
                  <div
                    key={gif.id}
                    className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer transition-all hover:opacity-95 border-2 ${
                      selectedGif?.id === gif.id
                        ? "border-blue-500 ring-2 ring-blue-500"
                        : "border-transparent"
                    }`}
                    onClick={() => handleSelectGif(gif)}
                  >
                    <img
                      src={gif.images.fixed_height.url}
                      alt={gif.title || "GIPHY GIF"}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {gif.user?.username && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                        <div className="text-xs text-white truncate">
                          By {gif.user.username}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {gifs.length === 0 && !loading && (
                <div className="text-center py-10">
                  <p className="text-gray-500">
                    No GIFs found. Try a different search term.
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
          {selectedGif && (
            <div className="flex-1 text-sm text-gray-500">
              {selectedGif.user ? (
                <>
                  GIF by{" "}
                  <a
                    href={selectedGif.user.profile_url || "https://giphy.com"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-600 hover:text-blue-800"
                  >
                    {selectedGif.user.username || "GIPHY User"}
                  </a>{" "}
                </>
              ) : (
                ""
              )}
              on{" "}
              <a
                href="https://giphy.com/?utm_source=your_app&utm_medium=referral"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600 hover:text-blue-800"
              >
                GIPHY
              </a>
            </div>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              disabled={!selectedGif || loading}
              onClick={confirmSelection}
            >
              Select GIF
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
