// components/MarkdownRenderer.jsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

export const MarkdownRenderer = ({ content, className = '' }) => {
  const [copiedCode, setCopiedCode] = useState('');

  const copyToClipboard = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(''), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      const code = String(children).replace(/\n$/, '');

      if (!inline && language) {
        return (
          <div className="relative group">
            {/* Copy button */}
            <button
              onClick={() => copyToClipboard(code)}
              className="absolute top-2 right-2 z-10 p-2 rounded-md bg-background/80 backdrop-blur-sm border border-border opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-background"
              title="Copy code"
            >
              {copiedCode === code ? (
                <Check size={16} className="text-green-500" />
              ) : (
                <Copy size={16} className="text-muted-foreground" />
              )}
            </button>

            {/* Syntax highlighter */}
            <SyntaxHighlighter
              style={oneDark}
              language={language}
              PreTag="div"
              customStyle={{
                margin: '1rem 0',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                lineHeight: '1.5',
              }}
              codeTagProps={{
                style: {
                  fontSize: '0.875rem',
                  fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", "SF Mono", Consolas, "Liberation Mono", Menlo, Courier, monospace',
                }
              }}
              showLineNumbers={code.split('\n').length > 5}
              wrapLines={true}
              wrapLongLines={true}
              {...props}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        );
      }

      // Inline code
      return (
        <code 
          className="px-1.5 py-0.5 rounded-md bg-secondary text-secondary-foreground font-mono text-sm" 
          {...props}
        >
          {children}
        </code>
      );
    },

    // Custom heading renderer with anchor links
    h1: ({ children, ...props }) => (
      <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground border-b border-border pb-2" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="text-xl font-medium mt-4 mb-2 text-foreground" {...props}>
        {children}
      </h3>
    ),

    // Custom blockquote
    blockquote: ({ children, ...props }) => (
      <blockquote className="border-l-4 border-primary pl-4 py-2 my-4 bg-secondary/50 rounded-r-md italic" {...props}>
        {children}
      </blockquote>
    ),

    // Custom table styling
    table: ({ children, ...props }) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full border border-border rounded-lg overflow-hidden" {...props}>
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...props }) => (
      <th className="px-4 py-2 bg-secondary font-semibold text-left border-b border-border" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td className="px-4 py-2 border-b border-border last:border-b-0" {...props}>
        {children}
      </td>
    ),

    // Custom link styling
    a: ({ children, href, ...props }) => (
      <a 
        href={href}
        className="text-primary hover:text-primary/80 underline underline-offset-2 font-medium"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        {...props}
      >
        {children}
      </a>
    ),

    // Custom list styling
    ul: ({ children, ...props }) => (
      <ul className="list-disc list-inside my-4 space-y-1 text-muted-foreground" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="list-decimal list-inside my-4 space-y-1 text-muted-foreground" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="leading-relaxed" {...props}>
        {children}
      </li>
    ),

    // Custom paragraph styling
    p: ({ children, ...props }) => (
      <p className="mb-4 leading-relaxed text-muted-foreground" {...props}>
        {children}
      </p>
    ),

    // Custom horizontal rule
    hr: ({ ...props }) => (
      <hr className="my-8 border-border" {...props} />
    ),
  };

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};