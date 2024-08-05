'use client';

import { cn } from '@/lib/utils';
import { Brain, Database, Puzzle, SearchCode } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/datasets', label: 'Datasets', icon: Database },
  { href: '/train', label: 'Train', icon: Brain },
  { href: '/models', label: 'Models', icon: Puzzle },
  { href: '/predict', label: 'Predict', icon: SearchCode },
];

export default function SideNav() {
  const pathname = usePathname();
  console.log(pathname);
  return (
    <nav className="w-1/5 space-y-6 bg-background border-r px-3 py-4">
      <Link href="/" className="text-primary font-semibold text-lg">
        AutoML Classifier
      </Link>
      <ul className="space-y-2">
        {LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={cn(
                'flex items-center gap-2 hover:bg-secondary text-primary/80 transition p-2 rounded-lg',
                pathname === link.href && 'bg-secondary text-primary'
              )}
            >
              <link.icon size={20} />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
