"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  FlaskConical,
  Gamepad2,
  Gauge,
  GraduationCap,
  MessageSquare,
  Repeat,
  Settings,
  Timer,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/subjects", label: "Matières", icon: BookOpen },
  { href: "/quiz", label: "Quiz", icon: Gamepad2 },
  { href: "/exam", label: "Examen", icon: Timer },
  { href: "/interview", label: "Entretien", icon: MessageSquare },
  { href: "/review", label: "Révision", icon: Repeat },
  { href: "/settings", label: "Réglages", icon: Settings },
];

const DEV_ITEMS = [
  { href: "/dev/exercise-gallery", label: "Gallery (dev)", icon: FlaskConical },
];

export function Sidebar({ showDev = false }: { showDev?: boolean }) {
  const pathname = usePathname();
  const items = showDev ? [...NAV_ITEMS, ...DEV_ITEMS] : NAV_ITEMS;
  return (
    <nav
      aria-label="Navigation principale"
      className="flex h-full flex-col gap-1 border-r bg-sidebar p-3 text-sidebar-foreground"
    >
      <div className="mb-4 flex items-center gap-2 px-2 py-3">
        <GraduationCap className="size-5" aria-hidden="true" />
        <span className="text-base font-semibold tracking-tight">ISEN PREP</span>
      </div>
      <ul className="flex flex-col gap-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "hover:bg-sidebar-accent/60"
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="size-4" aria-hidden="true" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
