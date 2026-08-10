import { useMemo } from 'react';
import { Select } from './Select';
import { cn } from '../lib/cn';
import { useField } from './Field';

/**
 * TimePicker — composto por dois (ou três) Selects para hora e minuto.
 *
 * Valor: string "HH:mm" (24h) ou "HH:mm:ss".
 *
 * Uso:
 *   const [time, setTime] = useState('14:30');
 *   <TimePicker value={time} onValueChange={setTime} minuteStep={15} />
 *
 *   // Formato 12h com AM/PM
 *   <TimePicker value={time} onValueChange={setTime} format="12h" />
 */

type Format = '24h' | '12h';

interface Props {
  value?: string;                      // "HH:mm" ou "HH:mm:ss"
  onValueChange: (v: string) => void;
  minuteStep?: number;                 // default 15
  format?: Format;                     // default '24h'
  showSeconds?: boolean;               // default false
  disabled?: boolean;
  className?: string;
}

function pad(n: number) { return String(n).padStart(2, '0'); }

function parseValue(v: string | undefined, showSeconds: boolean) {
  if (!v) return { h: '', m: '', s: '' };
  const [h = '', m = '', s = ''] = v.split(':');
  return { h, m, s: showSeconds ? s : '' };
}

export function TimePicker({
  value,
  onValueChange,
  minuteStep = 15,
  format = '24h',
  showSeconds = false,
  disabled,
  className,
}: Props) {
  const field = useField();
  const isDisabled = disabled ?? field?.disabled;

  const { h, m, s } = parseValue(value, showSeconds);

  const hours = useMemo(() => {
    if (format === '12h') {
      // Em 12h o Select mostra 12, 1..11. O valor real (interno) continua "HH".
      return Array.from({ length: 12 }, (_, i) => {
        const label = i === 0 ? '12' : pad(i);
        // 12h → 24h: 00 = 12 AM, 13..23 = 1..11 PM. Aqui só o AM range.
        return { value24: pad(i), label };
      });
    }
    return Array.from({ length: 24 }, (_, i) => ({ value24: pad(i), label: pad(i) }));
  }, [format]);

  const minutes = useMemo(() => {
    const count = Math.ceil(60 / minuteStep);
    return Array.from({ length: count }, (_, i) => pad(i * minuteStep)).filter((v) => Number(v) < 60);
  }, [minuteStep]);

  const seconds = useMemo(() => Array.from({ length: 60 }, (_, i) => pad(i)), []);

  const currentHour = h;
  const currentMinute = m;
  const currentSecond = s;

  // Detecção AM/PM (para format 12h)
  const period: 'AM' | 'PM' | '' =
    format === '12h' && h !== '' ? (Number(h) < 12 ? 'AM' : 'PM') : '';

  const emit = (nh: string, nm: string, ns: string) => {
    if (!nh || !nm) return;
    onValueChange(showSeconds ? `${nh}:${nm}:${ns || '00'}` : `${nh}:${nm}`);
  };

  const setHour24 = (h24: string) => emit(h24, currentMinute || '00', currentSecond);
  const setMinute = (nm: string) => emit(currentHour || '00', nm, currentSecond);
  const setSecond = (ns: string) => emit(currentHour || '00', currentMinute || '00', ns);
  const setPeriod = (p: 'AM' | 'PM') => {
    // Converte a hora atual para o período novo
    const cur = Number(currentHour || '0');
    const asAM = cur >= 12 ? cur - 12 : cur;
    const asPM = cur < 12 ? cur + 12 : cur;
    const next = p === 'AM' ? asAM : asPM;
    emit(pad(next), currentMinute || '00', currentSecond);
  };

  // Para o Select de hora em 12h, precisamos exibir o valor 12h atual
  const hourDisplayValue = useMemo(() => {
    if (format !== '12h' || currentHour === '') return currentHour;
    const cur = Number(currentHour);
    const twelve = cur % 12 === 0 ? 12 : cur % 12;
    return pad(twelve === 12 ? 0 : twelve); // usa "00" para representar "12"
  }, [format, currentHour]);

  return (
    <div className={cn('inline-flex items-center gap-1', className)}>
      <Select value={hourDisplayValue} onValueChange={(v) => {
        if (format === '24h') return setHour24(v);
        // 12h: `v` é a hora em base-12 (00-11 no valor interno onde 00 = "12" no label)
        const twelveHour = Number(v);
        const adjusted = period === 'PM' ? (twelveHour === 0 ? 12 : twelveHour + 12) : twelveHour;
        setHour24(pad(adjusted));
      }} disabled={isDisabled}>
        {hours.map((opt) => (
          <Select.Item key={opt.value24} value={opt.value24}>{opt.label}</Select.Item>
        ))}
      </Select>

      <span className="text-text-tertiary">:</span>

      <Select value={currentMinute} onValueChange={setMinute} disabled={isDisabled}>
        {minutes.map((mm) => (
          <Select.Item key={mm} value={mm}>{mm}</Select.Item>
        ))}
      </Select>

      {showSeconds && (
        <>
          <span className="text-text-tertiary">:</span>
          <Select value={currentSecond} onValueChange={setSecond} disabled={isDisabled}>
            {seconds.map((ss) => (
              <Select.Item key={ss} value={ss}>{ss}</Select.Item>
            ))}
          </Select>
        </>
      )}

      {format === '12h' && (
        <Select value={period} onValueChange={(v) => setPeriod(v as 'AM' | 'PM')} disabled={isDisabled}>
          <Select.Item value="AM">AM</Select.Item>
          <Select.Item value="PM">PM</Select.Item>
        </Select>
      )}
    </div>
  );
}
