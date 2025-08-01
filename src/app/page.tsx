"use client";

import { useRouter } from "next/navigation";
import { PromptInput, PromptInputActions } from "@/components/ui/prompt-input";
import { FrameworkSelector } from "@/components/framework-selector";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExampleButton } from "@/components/ExampleButton";
import { UserButton } from "@stackframe/stack";
import { UserApps } from "@/components/user-apps";
import { ModeToggle } from "@/components/theme-toggle";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PromptInputTextareaWithTypingAnimation } from "@/components/prompt-input";

const queryClient = new QueryClient();

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [framework, setFramework] = useState("nextjs");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setIsLoading(true);

    // window.location = `http://localhost:3000/app/new?message=${encodeURIComponent(prompt)}&template=${framework}`;

    router.push(
      `/app/new?message=${encodeURIComponent(prompt)}&template=${framework}`
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <main className="min-h-screen p-4 relative">
        <div className="flex w-full justify-end items-center">
          <div className="flex items-center gap-2 flex-1 sm:w-80 justify-end">
            <ModeToggle />
            <UserButton />
          </div>
        </div>

        <div>
          <div className="w-full max-w-lg px-4 sm:px-0 mx-auto flex flex-col items-center mt-16 sm:mt-24 md:mt-32 col-start-1 col-end-1 row-start-1 row-end-1 z-10">
            <Image
              className="dark:invert mx-2 mb-4"
              src="https://static.wixstatic.com/media/bd2e29_695f70787cc24db4891e63da7e7529b3~mv2.png"
              alt="Adorable Logo"
              width={48}
              height={48}
            />
            <p className="text-neutral-800 dark:text-neutral-300 text-center mb-6 text-2xl sm:text-3xl md:text-4xl font-bold">
              What do you want to build?
            </p>

            <div className="w-full relative my-5">
              <div className="relative w-full max-w-full overflow-hidden">
                <div className="w-full bg-accent rounded-3xl relative z-10 border transition-colors">
                  <PromptInput
                    isLoading={isLoading}
                    value={prompt}
                    onValueChange={setPrompt}
                    onSubmit={handleSubmit}
                    className="relative z-10 border-none bg-transparent shadow-none transition-all duration-200 ease-in-out "
                  >
                    <PromptInputTextareaWithTypingAnimation />
                    <PromptInputActions>
                      <Button
                        onClick={handleSubmit}
                        disabled={isLoading || !prompt.trim()}
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-2 text-sm font-semibold"
                      >
                        {isLoading ? (
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        ) : (
                          "Build It"
                        )}
                      </Button>
                    </PromptInputActions>
                  </PromptInput>
                </div>
              </div>
            </div>
            <FrameworkSelector
              value={framework}
              onChange={setFramework}
            />
            {/* <Examples setPrompt={setPrompt} /> */}
            <div className="mt-8 mb-16">
            </div>
          </div>
        </div>
        <div className="border-t py-8 mx-0 sm:-mx-4">
          <UserApps />
        </div>
      </main>
    </QueryClientProvider>
  );
}

function Examples({ setPrompt }: { setPrompt: (text: string) => void }) {
  return (
    <div className="mt-2">
      <div className="flex flex-wrap justify-center gap-2 px-2">
        <ExampleButton
          text="Habit Tracker"
          promptText="Build a tool to track my daily habits and progress."
          onClick={(text) => {
            console.log("Example clicked:", text);
            setPrompt(text);
          }}
        />
        <ExampleButton
          text="Sales Dashboard"
          promptText="Create an internal dashboard for my sales team to track leads and deals."
          onClick={(text) => {
            console.log("Example clicked:", text);
            setPrompt(text);
          }}
        />
        <ExampleButton
          text="Book Club Website"
          promptText="Build a website for my local book club with a forum and event calendar."
          onClick={(text) => {
            console.log("Example clicked:", text);
            setPrompt(text);
          }}
        />
      </div>
    </div>
  );
}
