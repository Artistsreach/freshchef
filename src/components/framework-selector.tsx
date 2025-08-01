"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { templates } from "@/lib/templates";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type FrameworkSelectorProps = {
  value?: keyof typeof templates;
  onChange: (value: keyof typeof templates) => void;
  className?: string;
};

export function FrameworkSelector({
  value = "nextjs",
  onChange,
  className,
}: FrameworkSelectorProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={cn("flex justify-center gap-2 my-4", className)}>
      {Object.entries(templates).map(([key, template]) => {
        const logo =
          typeof template.logo === "string"
            ? template.logo
            : theme === "dark"
            ? template.logo.dark
            : template.logo.light;
        return (
          <Button
            key={key}
            variant="outline"
            size="sm"
            className={cn(
              "h-7 gap-2 px-3 text-xs rounded-full",
              value === key && "pulse-glow"
            )}
            onClick={() => onChange(key)}
          >
            <Image
              src={
                mounted
                  ? logo
                  : typeof template.logo === "string"
                  ? template.logo
                  : template.logo.light
              }
              alt={template.name}
              width={16}
              height={16}
              className="opacity-90"
            />
            {template.name}
          </Button>
        );
      })}
    </div>
  );
}
