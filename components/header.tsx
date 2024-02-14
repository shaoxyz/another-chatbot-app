import * as React from "react";
import { IconSeparator } from "@/components/ui/icons";
export function Header() {
  return (
    <header className="top-0 z-50 flex items-center justify-between w-full h-16 px-4 sm:px-2 md:px-4 lg:px-6 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="flex items-center">
        <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
          <IconSeparator />
          <a href="https://sigma.shaoxyz.com" className="mr-2">
            Sigma
          </a>
        </React.Suspense>
      </div>
    </header>
  );
}
