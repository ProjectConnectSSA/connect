import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Search, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useState, useMemo, useRef, useEffect } from "react";
import { landingTemplates } from "@/components/landing/templates/landing-templates";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (templateId: string) => void;
  onOpenAIGenerator: () => void;
}

export function TemplateDialog({
  open,
  onOpenChange,
  onSelectTemplate,
  onOpenAIGenerator,
}: TemplateDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        isFiltersExpanded
      ) {
        setIsFiltersExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFiltersExpanded]);

  // Extract unique categories from the templates
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    landingTemplates.forEach((template) => {
      // Get category from template - assume it's the first part before "/"
      const category = template.title.includes("/")
        ? template.title.split("/")[0].trim()
        : template.title.trim();
      uniqueCategories.add(category);
    });

    return ["All", ...Array.from(uniqueCategories).sort()];
  }, []);

  // Visible categories - either all or just the first few
  const visibleCategories = useMemo(() => {
    if (isFiltersExpanded) {
      return categories;
    } else {
      // Display "All" and the first 3 categories when collapsed
      return categories.slice(0, 4);
    }
  }, [categories, isFiltersExpanded]);

  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter templates by search term and category
  const filteredTemplates = useMemo(() => {
    return landingTemplates.filter((template) => {
      const matchesSearch =
        template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Extract category consistently
      const categoryToCheck = template.title.includes("/")
        ? template.title.split("/")[0].trim()
        : template.title.trim();

      const matchesCategory =
        selectedCategory === "All" || categoryToCheck === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-br from-white/80 to-transparent dark:from-gray-900/80 dark:to-transparent border dark:border-gray-800 max-w-5xl max-h-[95vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="dark:text-gray-100">
            Create a Landing Page
          </DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Select a template to start with or create a custom landing page.
          </DialogDescription>
        </DialogHeader>

        {/* Search and category filter */}
        <div className="flex flex-row gap-3 my-2 flex-shrink-0">
          {/* Search bar - 70% width */}
          <div className="relative w-[70%]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Category dropdown - 30% width */}
          <div className="relative w-[30%]" ref={dropdownRef}>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto py-2">
          {/* AI Template Generator Card */}
          <div
            className="cursor-pointer border rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 dark:border-gray-700 transition-all hover:shadow-md group flex flex-col h-56"
            onClick={onOpenAIGenerator}
          >
            <div className="h-44 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 animate-gradient-x relative">
              {/* Add the GIF while keeping the gradient background */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/landing/Ninjacookiegachaanimation.gif"
                  alt="AI Template Generator"
                  width={140}
                  height={140}
                  className="object-contain z-10"
                />
              </div>
              {/* Keep sparkles icon as an overlay */}
              <Sparkles className="w-8 h-8 text-white absolute bottom-2 right-2 z-20" />
            </div>
            <div className="p-2 flex-1">
              <h3 className="font-medium dark:text-gray-200">
                Generate with AI
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Generate a Lanading page with our AI assistance
              </p>
            </div>
          </div>

          {/* Blank Template Card */}
          <div
            className="cursor-pointer border rounded-lg overflow-hidden bg-white dark:bg-gray-800 dark:border-gray-700 transition-all hover:shadow-md group flex flex-col h-56"
            onClick={() => onSelectTemplate("blank")}
          >
            <div className="h-44 flex items-center justify-center bg-gray-50 dark:bg-gray-900 relative">
              <div className="w-32 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center mb-2">
                    <span className="text-2xl text-gray-400 dark:text-gray-500">
                      +
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Blank
                  </span>
                </div>
              </div>
            </div>
            <div className="p-2 flex-1">
              <h3 className="font-medium dark:text-gray-200">Blank Template</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Start from scratch with a clean slate
              </p>
            </div>
          </div>

          {/* Template Cards with Images */}
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="cursor-pointer border rounded-lg overflow-hidden bg-white dark:bg-gray-800 dark:border-gray-700 transition-all hover:shadow-md group flex flex-col h-56"
              onClick={() => onSelectTemplate(template.id)}
            >
              <div className="h-44 relative overflow-hidden">
                <Image
                  src={template.image}
                  alt={`${template.title} template preview`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover"
                  priority={
                    template.id === "product-launch" ||
                    template.id === "event" ||
                    template.id === "sales"
                  }
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-2 left-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full bg-white/90 dark:bg-gray-800/90 ${template.iconColor}`}
                  >
                    {template.title}
                  </span>
                </div>
              </div>
              <div className="p-2 flex-1">
                <p className="text-xs text-gray-800 dark:text-gray-200">
                  {template.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between flex-shrink-0">
          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
            {filteredTemplates.length} template
            {filteredTemplates.length !== 1 ? "s" : ""} found
          </div>
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="dark:text-gray-400 dark:hover:bg-gray-800"
            >
              Cancel
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
