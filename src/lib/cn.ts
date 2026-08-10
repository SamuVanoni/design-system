// Utilitário para concatenar classes condicionalmente (evita dependência do clsx).
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
