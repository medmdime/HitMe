"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { RiSearch2Line, RiPlayCircleLine, RiScissorsCutLine } from "@remixicon/react"

const TABS = [
  { href: "/", label: "Analyze", icon: RiPlayCircleLine },
  { href: "/discover", label: "Discover", icon: RiSearch2Line },
  { href: "/clips", label: "Clips", icon: RiScissorsCutLine },
]

export function AppNav() {
  const pathname = usePathname()
  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-heading text-lg font-semibold tracking-tight">
            HitMe
          </span>
          <span className="text-xs text-muted-foreground">script reverse-engineer</span>
        </Link>
        <nav className="flex items-center gap-1 rounded-full bg-muted p-1">
          {TABS.map((t) => {
            const Icon = t.icon
            const active =
              t.href === "/" ? pathname === "/" : pathname?.startsWith(t.href)
            return (
              <Link
                key={t.href}
                href={t.href}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                {t.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
