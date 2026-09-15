"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export function TeardownMarkdown({ text }: { text: string }) {
  return (
    <div className="prose-teardown text-sm leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (props) => <h1 className="mt-4 mb-2 text-base font-semibold" {...props} />,
          h2: (props) => <h2 className="mt-4 mb-2 text-base font-semibold" {...props} />,
          h3: (props) => <h3 className="mt-3 mb-2 text-sm font-semibold" {...props} />,
          p: (props) => <p className="my-2 leading-relaxed" {...props} />,
          strong: (props) => <strong className="font-semibold text-foreground" {...props} />,
          em: (props) => <em className="italic" {...props} />,
          ul: (props) => <ul className="my-2 list-disc space-y-1 pl-5" {...props} />,
          ol: (props) => <ol className="my-2 list-decimal space-y-1 pl-5" {...props} />,
          li: (props) => <li className="leading-relaxed" {...props} />,
          hr: () => <hr className="my-4 border-border" />,
          code: (props) => (
            <code
              className="rounded bg-muted px-1 py-0.5 font-mono text-xs"
              {...props}
            />
          ),
          a: ({ href, ...props }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-4 hover:underline"
              {...props}
            />
          ),
          blockquote: (props) => (
            <blockquote
              className="my-2 border-l-2 border-border pl-3 text-muted-foreground"
              {...props}
            />
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  )
}
