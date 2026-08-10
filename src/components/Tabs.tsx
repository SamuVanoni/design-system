import { ReactNode } from 'react';
import * as T from '@radix-ui/react-tabs';
import { cn } from '../lib/cn';

/**
 * Tabs (wrapper sobre @radix-ui/react-tabs) — estilo underline.
 * Uso:
 *   <Tabs defaultValue="overview">
 *     <Tabs.List>
 *       <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
 *       <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
 *     </Tabs.List>
 *     <Tabs.Content value="overview">...</Tabs.Content>
 *     <Tabs.Content value="settings">...</Tabs.Content>
 *   </Tabs>
 */

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (v: string) => void;
  children: ReactNode;
  className?: string;
}

function TabsRoot({ defaultValue, value, onValueChange, children, className }: TabsProps) {
  return (
    <T.Root
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
      className={className}
    >
      {children}
    </T.Root>
  );
}

function TabsList({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <T.List className={cn('flex gap-1 border-b border-border-subtle', className)}>{children}</T.List>
  );
}

function TabsTrigger({ value, children }: { value: string; children: ReactNode }) {
  return (
    <T.Trigger
      value={value}
      className={cn(
        'relative -mb-px inline-flex h-10 items-center gap-2 px-3 text-sm font-medium',
        'text-text-tertiary hover:text-text-primary',
        'border-b-2 border-transparent transition-colors',
        'data-[state=active]:text-text-primary data-[state=active]:border-primary-500',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-t',
      )}
    >
      {children}
    </T.Trigger>
  );
}

function TabsContent({ value, children, className }: { value: string; children: ReactNode; className?: string }) {
  return (
    <T.Content value={value} className={cn('py-4 focus-visible:outline-none', className)}>
      {children}
    </T.Content>
  );
}

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});
