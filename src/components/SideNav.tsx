"use client";

import { cn } from "@/lib/utils";
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  Brain,
  Database,
  Layers,
  Puzzle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";

const LINKS = [
  { href: "/datasets", label: "Datasets", icon: Database },
  { href: "/train", label: "Train", icon: Brain },
  { href: "/models", label: "Models", icon: Layers },
  { href: "/predict", label: "Predict", icon: Puzzle },
];

export default function SideNav() {
  const [isExpanded, setIsExpanded] = useState(true);

  const pathname = usePathname();
  return (
    <nav
      className={cn(
        "relative border-r bg-background px-3 transition-[width] duration-300",
        isExpanded ? "w-1/6" : "w-[62px]",
      )}
    >
      <div className="sticky top-0 z-10 space-y-6 py-4">
        <div className="flex items-center justify-between">
          {isExpanded && (
            <Link
              href="/"
              className="whitespace-nowrap text-lg font-semibold text-primary"
            >
              AutoML Classifier
            </Link>
          )}

          <Button
            onClick={() => setIsExpanded((prev) => !prev)}
            size="sm"
            variant="ghost"
            className="p-2"
          >
            {isExpanded ? (
              <ArrowLeftToLine size={22} strokeWidth={1.5} />
            ) : (
              <ArrowRightToLine size={22} strokeWidth={1.5} />
            )}
          </Button>
        </div>
        <ul className="space-y-2">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg p-2 text-primary/80 transition duration-700 hover:bg-secondary",
                  pathname.includes(link.href) && "bg-secondary text-primary",
                )}
              >
                <div>
                  <link.icon size={20} />
                </div>
                {isExpanded && link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
