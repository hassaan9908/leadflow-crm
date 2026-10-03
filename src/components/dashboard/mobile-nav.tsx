"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  Building2,
  Handshake,
  Activity,
  UserRoundCog,
  Settings,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Leads",
    href: "/dashboard/leads",
    icon: Users,
  },
  {
    label: "Companies",
    href: "/dashboard/companies",
    icon: Building2,
  },
  {
    label: "Pipeline",
    href: "/dashboard/pipeline",
    icon: Handshake,
  },
  {
    label: "Activities",
    href: "/dashboard/activities",
    icon: Activity,
  },
  {
    label: "Team",
    href: "/dashboard/team",
    icon: UserRoundCog,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function MobileNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname.startsWith(href);
  }

  return (
    <div className="border-b bg-background lg:hidden">
      <div className="overflow-x-auto">
        <nav className="flex min-w-max items-center gap-1 px-3 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}