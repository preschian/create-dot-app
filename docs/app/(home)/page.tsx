import Link from 'next/link';
import {
  FileCode2,
  Zap,
  Layers,
  Terminal,
  BookOpen,
  Github,
  ChevronRight,
} from 'lucide-react';
import { CopyableCommand } from './copyable-command';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-neutral-200/80 bg-neutral-50/80 px-6 py-24 dark:border-neutral-800 dark:bg-neutral-950 md:py-32">
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.25em] text-neutral-400 dark:text-neutral-500">
            Polkadot dApps · Smart Contracts
          </p>
          <h1 className="mb-6 text-4xl font-bold leading-[1.1] tracking-tight text-neutral-900 dark:text-neutral-50 md:text-5xl lg:text-6xl">
            Build with Solidity
            <br />
            on Polkadot
          </h1>
          <p className="mx-auto mb-12 max-w-xl text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
            One command. Hardhat and Wagmi. Ship EVM-compatible smart contracts
            on Polkadot Asset Hub in minutes.
          </p>
          <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-center">
            <CopyableCommand />
            <Link
              href="/docs"
              className="inline-flex h-13 shrink-0 items-center justify-center gap-2 rounded-lg border-2 border-neutral-900 bg-neutral-900 px-5 font-medium text-white transition-colors hover:bg-neutral-800 dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              Docs
              <ChevronRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Solidity template */}
      <section className="border-b border-neutral-200/80 px-6 py-20 dark:border-neutral-800 dark:bg-neutral-900/20 md:py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 md:text-3xl">
            Smart contracts, ready to ship
          </h2>
          <p className="mx-auto mb-14 max-w-2xl text-center text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            Full-stack monorepo: Hardhat for contracts, Wagmi for the dApp, and
            a sample contract to learn from.
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<FileCode2 className="size-5" />}
              title="Hardhat"
              description="Solidity 0.8, TypeScript, deploy & verify on Polkadot Asset Hub."
            />
            <FeatureCard
              icon={<Zap className="size-5" />}
              title="Wagmi + Viem"
              description="Modern Web3 hooks and type-safe contract calls in your dApp."
            />
            <FeatureCard
              icon={<Layers className="size-5" />}
              title="Full-stack"
              description="Contracts and frontend in one repo. One install, one deploy."
            />
            <FeatureCard
              icon={<Terminal className="size-5" />}
              title="One command"
              description="Monorepo with workspaces. Bootstrap and run in minutes."
            />
          </div>
        </div>
      </section>

      {/* Quick start */}
      <section className="border-b border-neutral-200/80 px-6 py-20 dark:border-neutral-800 md:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-center text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 md:text-3xl">
            Quick start
          </h2>
          <div className="overflow-hidden rounded-lg border border-neutral-200/80 bg-neutral-50/80 shadow-sm dark:border-neutral-700 dark:bg-neutral-900/50 dark:shadow-none">
            <pre className="overflow-x-auto p-6 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
              <code>{`# Create project
npx create-dot-app@latest my-dapp --template solidity-react

# Install and run
cd my-dapp && npm install
npm run deploy -w hardhat   # Deploy contracts
npm run dev -w dapp-react   # Start dApp`}</code>
            </pre>
          </div>
          <p className="mt-5 text-center text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
            Includes sample contract, deployment scripts, and Wagmi-based dApp. See{' '}
            <Link
              href="/docs"
              className="font-medium text-neutral-800 underline underline-offset-2 transition-colors hover:text-neutral-600 dark:text-neutral-200 dark:hover:text-neutral-300"
            >
              full documentation
            </Link>{' '}
            for more options.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 md:py-24">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 text-center">
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 md:text-2xl">
            Start building your Polkadot dApp today
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-5 py-2.5 font-medium text-neutral-800 shadow-sm transition-colors hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
            >
              <BookOpen className="size-4" />
              Documentation
            </Link>
            <a
              href="https://github.com/preschian/create-dot-app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-5 py-2.5 font-medium text-neutral-800 shadow-sm transition-colors hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
            >
              <Github className="size-4" />
              GitHub
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-neutral-200/80 bg-white p-6 shadow-sm transition-shadow dark:border-neutral-700 dark:bg-neutral-900/50 dark:shadow-none">
      <div className="mb-4 inline-flex rounded-lg border border-neutral-200/80 bg-neutral-50 p-2.5 text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
        {icon}
      </div>
      <h3 className="mb-2 font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
        {description}
      </p>
    </div>
  );
}
