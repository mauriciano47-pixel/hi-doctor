import { useMemo } from 'react';
import { COLORS } from '../styles/theme';
import { formatFechaCorta } from '../utils/clinicalHelpers';

export default function GraficaTemperatura({ registros }) {
  const conTemp = useMemo(() => (registros || []).filter(r => r.temperatura)
    .map(r => ({ fecha: new Date(r.fecha), temp: parseFloat(r.temperatura) }))
    .filter(r => !isNaN(r.temp) && !isNaN(r.fecha.getTime()))
    .sort((a, b) => a.fecha - b.fecha), [registros]);

  if (conTemp.length < 2) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: COLORS.inkLight, fontSize: 13.5 }}>
        ℹ️ Necesitas al menos 2 registros con temperatura para trazar la curva térmica.
      </div>
    );
  }

  const width = 600, height = 220, padding = { top: 24, right: 20, bottom: 36, left: 42 };
  const innerW = width - padding.left - padding.right, innerH = height - padding.top - padding.bottom;
  const temps = conTemp.map(p => p.temp);
  const minTemp = Math.min(35.5, Math.floor(Math.min(...temps) * 2) / 2 - 0.5);
  const maxTemp = Math.max(39.5, Math.ceil(Math.max(...temps) * 2) / 2 + 0.5);
  const minFecha = conTemp[0].fecha.getTime(), maxFecha = conTemp[conTemp.length - 1].fecha.getTime();
  const rangoFecha = Math.max(maxFecha - minFecha, 1);
  const x = (f) => padding.left + ((f.getTime() - minFecha) / rangoFecha) * innerW;
  const y = (t) => padding.top + innerH - ((t - minTemp) / (maxTemp - minTemp)) * innerH;
  const puntos = conTemp.map(p => `${x(p.fecha)},${y(p.temp)}`).join(' ');
  const yFiebreLinea = y(38);
  const yTicks = [];
  for (let t = Math.ceil(minTemp); t <= maxTemp; t++) yTicks.push(t);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block' }} aria-label="Curva térmica interactiva de temperatura corporal">
      {/* Línea de alerta de 38°C */}
      <line x1={padding.left} y1={yFiebreLinea} x2={width - padding.right} y2={yFiebreLinea}
        stroke={COLORS.alert} strokeWidth="1.5" strokeDasharray="4,4" opacity="0.8" />
      <text x={width - padding.right} y={yFiebreLinea - 5} textAnchor="end" fontSize="10"
        fontWeight="bold" fill={COLORS.alert} fontFamily="Nunito, sans-serif">Límite Fiebre 38°C</text>

      {/* Ticks de temperatura */}
      {yTicks.map(t => (
        <g key={t}>
          <line x1={padding.left} y1={y(t)} x2={width - padding.right} y2={y(t)} stroke={COLORS.border} strokeWidth="1" />
          <text x={padding.left - 8} y={y(t) + 3} textAnchor="end" fontSize="10" fill={COLORS.inkLight} fontFamily="Nunito, sans-serif">{t}°</text>
        </g>
      ))}

      {/* Fechas en eje X */}
      {conTemp.map((p, i) => (i === 0 || i === conTemp.length - 1 || i % Math.ceil(conTemp.length / 5) === 0) && (
        <text key={i} x={x(p.fecha)} y={height - padding.bottom + 16} textAnchor="middle" fontSize="9"
          fill={COLORS.inkLight} fontFamily="Nunito, sans-serif">{formatFechaCorta(p.fecha)}</text>
      ))}

      {/* Línea de evolución */}
      <polyline points={puntos} fill="none" stroke={COLORS.sage} strokeWidth="2.8" strokeLinejoin="round" strokeLinecap="round" />

      {/* Puntos térmicos */}
      {conTemp.map((p, i) => (
        <g key={i}>
          <circle cx={x(p.fecha)} cy={y(p.temp)} r="5" fill={p.temp >= 38 ? COLORS.alert : COLORS.sage} stroke={COLORS.white} strokeWidth="2" />
          <text x={x(p.fecha)} y={y(p.temp) - 8} textAnchor="middle" fontSize="10" fontWeight="bold" fill={p.temp >= 38 ? COLORS.alert : COLORS.ink} fontFamily="Nunito, sans-serif">
            {p.temp}°
          </text>
        </g>
      ))}
    </svg>
  );
}
