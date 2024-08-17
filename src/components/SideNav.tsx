"use client";

import { cn } from "@/lib/utils";
import { Brain, Database, Layers, Puzzle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/datasets", label: "Datasets", icon: Database },
  { href: "/train", label: "Train", icon: Brain },
  { href: "/models", label: "Models", icon: Layers },
  { href: "/predict", label: "Predict", icon: Puzzle },
];

export default function SideNav() {
  const pathname = usePathname();
  return (
    <nav className="relative w-1/6 border-r bg-background px-3">
      <div className="sticky top-0 z-10 space-y-6 py-4">
        <Link href="/" className="text-lg font-semibold text-primary">
          AutoML Classifier
        </Link>
        <ul className="space-y-2">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg p-2 text-primary/80 transition hover:bg-secondary",
                  pathname.includes(link.href) && "bg-secondary text-primary",
                )}
              >
                <link.icon size={20} />
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
