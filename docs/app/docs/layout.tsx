import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout tree={source.getPageTree()} {...baseOptions()}>
      <div className="sticky top-0 z-50 w-full border-b border-amber-200/60 bg-amber-50/95 px-4 py-2 text-center text-sm text-amber-800 backdrop-blur supports-backdrop-filter:bg-amber-50/80 dark:border-amber-800/40 dark:bg-amber-950/90 dark:text-amber-200">
        <span className="font-medium">Work in progress</span>
        <span className="ml-1.5 text-amber-600 dark:text-amber-400">
          — documentation is being updated and may change.
        </span>
      </div>
      {children}
    </DocsLayout>
  );
}
