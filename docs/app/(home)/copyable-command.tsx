'use client';

import { useState } from 'react';
import { Terminal, Copy, Check } from 'lucide-react';

const COMMAND = 'npx create-dot-app@latest my-dapp';

export function CopyableCommand() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(COMMAND);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-13 w-full max-w-md items-center gap-3 rounded-lg border border-neutral-200/80 bg-white px-4 text-sm shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-none">
      <Terminal className="size-4 shrink-0 text-neutral-400 dark:text-neutral-500" />
      <code className="min-w-0 flex-1 truncate font-medium text-neutral-800 dark:text-neutral-200">
        {COMMAND}
      </code>
      <button
        type="button"
        onClick={handleCopy}
        className="shrink-0 rounded p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
        aria-label={copied ? 'Copied' : 'Copy command'}
      >
        {copied ? (
          <Check className="size-4 text-green-600 dark:text-green-400" />
        ) : (
          <Copy className="size-4" />
        )}
      </button>
    </div>
  );
}
