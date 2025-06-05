import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Wand2, CircleSlash, Loader2 } from "lucide-react";

interface AIGeneratorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (prompt: string) => void;
}

export function AIGeneratorDialog({
  open,
  onOpenChange,
  onGenerate,
}: AIGeneratorDialogProps) {
  const [aiPrompt, setAiPrompt] = useState("");
  const [magicParticles, setMagicParticles] = useState<
    { id: number; top: number; left: number }[]
  >([]);

  // Example prompts to inspire users
  const examplePrompts = [
    "Create a product landing page for a new organic coffee brand",
    "Design an event registration page for a tech conference",
    "Make a promotional page for a limited-time discount on courses",
    "Generate a landing page for a mobile app launch",
    "Create a lead generation page for a real estate agency",
  ];

  // Creates magic particle effect when typing in the prompt field
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAiPrompt(e.target.value);

    // Create magic particles for long enough inputs
    if (e.target.value.length > 5 && Math.random() > 0.7) {
      const newParticle = {
        id: Date.now(),
        top: Math.random() * 100,
        left: Math.random() * 100,
      };

      setMagicParticles((prev) => [...prev, newParticle]);

      // Remove particle after animation completes
      setTimeout(() => {
        setMagicParticles((prev) =>
          prev.filter((p) => p.id !== newParticle.id)
        );
      }, 2000);
    }
  };

  const handleGenerateClick = () => {
    if (!aiPrompt.trim()) return;
    onGenerate(aiPrompt.trim());
  };

  const applyExamplePrompt = (prompt: string) => {
    setAiPrompt(prompt);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-indigo-950/90 dark:via-violet-900/80 dark:to-fuchsia-900/70 border border-purple-200 dark:border-purple-800 shadow-xl overflow-hidden rounded-xl max-w-3xl">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[url('/landing/magic-bg.svg')] bg-repeat opacity-20 dark:opacity-10"></div>

        <div
          className="absolute inset-0 bg-gradient-to-r from-violet-400 via-fuchsia-300 to-blue-300 dark:from-violet-600 dark:via-fuchsia-500 dark:to-blue-500 opacity-50 dark:opacity-40 animate-pulse"
          style={{ filter: "blur(50px)" }}
        ></div>

        <div className="absolute -right-8 top-6 w-36 h-36 md:w-48 md:h-48 opacity-90 pointer-events-none">
          <img
            src="/landing/Ninjacookiegachaanimation.gif"
            alt="AI Magic Assistant"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Magic floating particles */}
        {magicParticles.map((particle) => (
          <div
            key={particle.id}
            className="absolute pointer-events-none animate-magic-float"
            style={{
              top: `${particle.top}%`,
              left: `${particle.left}%`,
              width: "20px",
              height: "20px",
            }}
          >
            <Sparkles className="h-full w-full text-purple-400 dark:text-purple-300" />
          </div>
        ))}

        <div className="relative z-10">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-violet-600 dark:from-blue-400 dark:via-purple-400 dark:to-violet-400 flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-purple-500 dark:text-purple-400" />
              Generating Landing Page with AI
            </DialogTitle>
            <DialogDescription className="text-gray-700 dark:text-gray-300">
              Describe what type of landing page you want, and our AI will
              create it for you.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-5">
            <Textarea
              value={aiPrompt}
              onChange={handlePromptChange}
              placeholder="Example: Create a product landing page for a new fitness app with sections for features, pricing, and testimonials..."
              className="resize-none h-32 bg-white/60 dark:bg-gray-900/50 dark:text-gray-100 border-purple-100 dark:border-purple-900/30 
              focus:outline-none focus:ring-0 focus:border-purple-100 dark:focus:border-purple-900/30 
              focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
            />

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                <Wand2 className="h-3.5 w-3.5" /> Example prompts:
              </p>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => applyExamplePrompt(prompt)}
                    className="text-xs px-3 py-1 rounded-full bg-white/80 dark:bg-gray-800/70 border border-purple-200 dark:border-purple-700/50 text-purple-800 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-blue-50/80 dark:bg-blue-950/50 p-3 rounded-md border border-blue-200 dark:border-blue-900/70">
              <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                The more specific your description, the better the result!
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-purple-200 dark:border-purple-800 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/30"
            >
              <CircleSlash className="h-4 w-4 mr-2" />
              Cancel
            </Button>

            <Button
              onClick={handleGenerateClick}
              disabled={!aiPrompt.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 text-white"
            >
              <Wand2 className="h-4 w-4 mr-2" />
              Generate Landing Page
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
