import { ReactNode } from 'react';
import * as DM from '@radix-ui/react-dropdown-menu';
import { Check } from 'lucide-react';
import { cn } from '../lib/cn';

/**
 * Dropdown (wrapper sobre @radix-ui/react-dropdown-menu).
 * Uso:
 *   <Dropdown trigger={<Button variant="ghost">Menu</Button>}>
 *     <Dropdown.Item onSelect={...}>Editar</Dropdown.Item>
 *     <Dropdown.Item onSelect={...} tone="danger">Excluir</Dropdown.Item>
 *     <Dropdown.Separator />
 *     <Dropdown.CheckboxItem checked={x} onCheckedChange={setX}>Notificar</Dropdown.CheckboxItem>
 *   </Dropdown>
 */

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
}

function DropdownRoot({ trigger, children, align = 'start', sideOffset = 6 }: DropdownProps) {
  return (
    <DM.Root>
      <DM.Trigger asChild>{trigger}</DM.Trigger>
      <DM.Portal>
        <DM.Content
          align={align}
          sideOffset={sideOffset}
          className={cn(
            'z-50 min-w-[10rem] overflow-hidden rounded-md border border-border',
            'bg-surface-overlay p-1 shadow-lg',
            'text-text-primary',
          )}
        >
          {children}
        </DM.Content>
      </DM.Portal>
    </DM.Root>
  );
}

const itemBase =
  'relative flex select-none items-center gap-2 rounded px-2 py-1.5 text-sm outline-none ' +
  'transition-colors ' +
  'data-[highlighted]:bg-surface-elevated ' +
  'data-[disabled]:pointer-events-none data-[disabled]:opacity-40';

interface ItemProps {
  children: ReactNode;
  onSelect?: () => void;
  tone?: 'default' | 'danger';
  disabled?: boolean;
}

function DropdownItem({ children, onSelect, tone = 'default', disabled }: ItemProps) {
  return (
    <DM.Item
      onSelect={onSelect}
      disabled={disabled}
      className={cn(itemBase, tone === 'danger' && 'text-error data-[highlighted]:bg-error-soft')}
    >
      {children}
    </DM.Item>
  );
}

interface CheckboxItemProps {
  children: ReactNode;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  disabled?: boolean;
}

function DropdownCheckboxItem({ children, checked, onCheckedChange, disabled }: CheckboxItemProps) {
  return (
    <DM.CheckboxItem
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className={cn(itemBase, 'pl-6')}
    >
      <DM.ItemIndicator className="absolute left-1.5">
        <Check className="h-3.5 w-3.5 text-primary-500" />
      </DM.ItemIndicator>
      {children}
    </DM.CheckboxItem>
  );
}

function DropdownSeparator() {
  return <DM.Separator className="my-1 h-px bg-border-subtle" />;
}

function DropdownLabel({ children }: { children: ReactNode }) {
  return (
    <DM.Label className="px-2 py-1 text-caption uppercase tracking-wide text-text-tertiary">
      {children}
    </DM.Label>
  );
}

export const Dropdown = Object.assign(DropdownRoot, {
  Item: DropdownItem,
  CheckboxItem: DropdownCheckboxItem,
  Separator: DropdownSeparator,
  Label: DropdownLabel,
});
