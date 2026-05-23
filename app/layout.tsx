import { Geist_Mono, Raleway } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AppNav } from "@/components/app-nav"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils";

export const metadata = {
  title: "HitMe — YouTube script reverse-engineer",
  description: "Find outlier videos and extract their scripts in bracket format.",
}

const raleway = Raleway({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", raleway.variable)}
    >
      <body>
        <ThemeProvider>
          <AppNav />
          <main className="min-h-[calc(100svh-3.5rem)]">{children}</main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
