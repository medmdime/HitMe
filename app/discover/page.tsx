"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { QuotaMeter } from "@/components/discover/quota-meter"
import { ChannelDeepDive } from "@/components/discover/channel-deep-dive"
import { KeywordSearch } from "@/components/discover/keyword-search"
import { SmallBreakouts } from "@/components/discover/small-breakouts"
import { HitVsFlop } from "@/components/discover/hit-vs-flop"
import { Trending } from "@/components/discover/trending"
import {
  RiUser3Line,
  RiSearchLine,
  RiFireLine,
  RiScales3Line,
  RiFlashlightLine,
} from "@remixicon/react"

type Mode = "trending" | "channel" | "keyword" | "breakouts" | "compare"

function DiscoverInner() {
  const router = useRouter()
  const search = useSearchParams()
  const mode = (search.get("mode") as Mode) ?? "trending"
  const channelParam = search.get("channel") ?? undefined

  const [quotaTick, setQuotaTick] = React.useState(0)

  function setMode(next: Mode) {
    const sp = new URLSearchParams(search.toString())
    sp.set("mode", next)
    if (next !== "channel") sp.delete("channel")
    router.replace(`/discover?${sp.toString()}`, { scroll: false })
  }

  function jumpToChannel(channelId: string) {
    const sp = new URLSearchParams()
    sp.set("mode", "channel")
    sp.set("channel", channelId)
    router.replace(`/discover?${sp.toString()}`, { scroll: false })
  }

  function onSearched() {
    setQuotaTick((t) => t + 1)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold">Discover</h1>
        <p className="text-sm text-muted-foreground">
          Find outlier videos — then send them to the analyzer.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        <Tabs
          value={mode}
          onValueChange={(v) => setMode(v as Mode)}
          className="min-w-0"
        >
          <TabsList className="flex-wrap">
            <TabsTrigger value="trending">
              <RiFlashlightLine />
              Trending
            </TabsTrigger>
            <TabsTrigger value="channel">
              <RiUser3Line />
              Channel deep-dive
            </TabsTrigger>
            <TabsTrigger value="keyword">
              <RiSearchLine />
              Keyword search
            </TabsTrigger>
            <TabsTrigger value="breakouts">
              <RiFireLine />
              Small breakouts
            </TabsTrigger>
            <TabsTrigger value="compare">
              <RiScales3Line />
              Hit vs flop
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trending" className="mt-4">
            <Trending
              onChannelClick={jumpToChannel}
              onSearched={onSearched}
            />
          </TabsContent>
          <TabsContent value="channel" className="mt-4">
            <ChannelDeepDive
              key={channelParam ?? "channel"}
              initialChannel={channelParam}
              onSearched={onSearched}
            />
          </TabsContent>
          <TabsContent value="keyword" className="mt-4">
            <KeywordSearch onChannelClick={jumpToChannel} onSearched={onSearched} />
          </TabsContent>
          <TabsContent value="breakouts" className="mt-4">
            <SmallBreakouts
              onChannelClick={jumpToChannel}
              onSearched={onSearched}
            />
          </TabsContent>
          <TabsContent value="compare" className="mt-4">
            <HitVsFlop onSearched={onSearched} />
          </TabsContent>
        </Tabs>

        <aside className="space-y-4">
          <QuotaMeter refreshSignal={quotaTick} />
        </aside>
      </div>
    </div>
  )
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading…</div>}>
      <DiscoverInner />
    </Suspense>
  )
}
