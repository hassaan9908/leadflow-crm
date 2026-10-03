"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  Building2,
  Handshake,
  Activity,
  Settings,
  UserRoundCog,
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
];

export function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname.startsWith(href);
  }

  const settingsActive = pathname.startsWith(
    "/dashboard/settings"
  );

  return (
    <aside className="hidden min-h-screen w-64 border-r bg-background lg:block">
      <div className="flex h-16 items-center border-b px-6">
        <Link
          href="/dashboard"
          className="text-xl font-bold"
        >
          LeadFlow
        </Link>
      </div>

      <nav className="space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
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

        <div className="pt-4">
          <Link
            href="/dashboard/settings"
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
              settingsActive
                ? "bg-muted font-medium text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </div>
      </nav>
    </aside>
  );
}