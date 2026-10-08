import { useState, useMemo } from 'react';
import { COLORS, S } from '../styles/theme';
import { formatFecha } from '../utils/clinicalHelpers';

/**
 * ============================================================================
 * HiDoc — Vista de Resumen Pediátrico para Consulta Médica & Exportación PDF
 * ============================================================================
 */
export default function VistaResumen({ perfilActivo, registrosDelPerfil, patrones, marcaBlanca, onVolver }) {
  const [copiado, setCopiado] = useState(false);

  const textoResumen = useMemo(() => {
    const nombre = perfilActivo?.nombre || 'Paciente';
    const institucion = marcaBlanca?.activo && marcaBlanca?.nombreClinica
      ? marcaBlanca.nombreClinica
      : 'HiDoc HealthTech';
    let texto = `📋 RESUMEN CLÍNICO PEDIÁTRICO — ${nombre}\n`;
    texto += `Institución: ${institucion}\n`;
    texto += `Generado el ${new Date().toLocaleDateString('es-CL')} | Expediente: ${perfilActivo?.codigoExpediente || 'N/A'}\n`;
    if (perfilActivo?.pesoKg) {
      texto += `Peso: ${perfilActivo.pesoKg} kg | Talla: ${perfilActivo.tallaCm || '—'} cm | IMC: ${perfilActivo.imc || '—'}\n`;
      texto += `Alergias: ${perfilActivo.alergias?.length ? perfilActivo.alergias.join(', ') : 'Ninguna conocida'}\n`;
    }
    texto += `----------------------------------------\n\n`;

    if (patrones.length > 0) {
      texto += `PATRONES OBSERVADOS:\n`;
      patrones.forEach(p => { texto += `• ${p.texto}\n`; });
      texto += `\n`;
    }

    texto += `CRONOLOGÍA DE REGISTROS (${registrosDelPerfil.length}):\n`;
    registrosDelPerfil.slice().reverse().forEach(r => {
      texto += `\n📅 ${formatFecha(r.fecha)}\n`;
      if (r.temperatura) texto += `   Temperatura: ${r.temperatura}°C\n`;
      if (r.sintomas && r.sintomas.length) texto += `   Síntomas: ${r.sintomas.join(', ')}\n`;
      if (r.medicamento) texto += `   Medicación: ${r.medicamento.nombre} (${r.medicamento.dosis} ${r.medicamento.unidad})\n`;
      if (r.nota) texto += `   Nota: ${r.nota}\n`;
    });

    return texto;
  }, [perfilActivo, registrosDelPerfil, patrones, marcaBlanca]);

  function fallbackCopiar(texto) {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = texto;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (err) { void err; }
  }

  function copiar() {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(textoResumen).then(() => {
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
      }).catch(() => fallbackCopiar(textoResumen));
    } else {
      fallbackCopiar(textoResumen);
    }
  }

  function compartirWhatsApp() {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(textoResumen)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function imprimirPDF() {
    window.print();
  }

  return (
    <div>
      {/* Vista en Pantalla (Oculta al imprimir) */}
      <div className="no-print">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ ...S.h2, margin: 0 }}>Resumen para el Médico Pediatra</h2>
          {onVolver && (
            <button style={S.btnOutline} onClick={onVolver} aria-label="Volver al historial clínico">
              ← Volver
            </button>
          )}
        </div>

        <p style={{ fontSize: 13.5, color: COLORS.inkLight, marginBottom: 14 }}>
          Entrega el reporte al pediatra o compártelo instantáneamente por WhatsApp o PDF impreso:
        </p>

        {/* Acciones directas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 14 }}>
          <button
            style={{ ...S.btnTerracotta, background: '#25D366', borderColor: '#25D366', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12.5 }}
            onClick={compartirWhatsApp}
            aria-label="Compartir ficha clínica por WhatsApp con el pediatra"
          >
            💬 Enviar WhatsApp
          </button>
          <button
            style={{ ...S.btn, background: '#2A9D8F', borderColor: '#2A9D8F', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12.5 }}
            onClick={imprimirPDF}
            aria-label="Imprimir o exportar ficha clínica a PDF"
          >
            🖨️ Imprimir / PDF
          </button>
          <button
            style={{ ...S.btnOutline, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12.5 }}
            onClick={copiar}
            aria-label="Copiar resumen clínico al portapapeles"
          >
            {copiado ? '✓ Copiado' : '📋 Copiar Texto'}
          </button>
        </div>

        <div style={{
          ...S.card,
          whiteSpace: 'pre-wrap',
          fontSize: 12.5,
          fontFamily: 'monospace',
          background: '#FAF8F5',
          lineHeight: 1.6,
          maxHeight: 320,
          overflowY: 'auto'
        }}>
          {textoResumen}
        </div>
      </div>

      {/* Vista de Impresión Médica Oficial (Solo activa en @media print / Exportar a PDF) */}
      <div className="print-only" style={{ padding: '16px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{ borderBottom: '2.5px solid #2D2926', paddingBottom: '12px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '20px', margin: 0, textTransform: 'uppercase', color: '#111827', fontWeight: 800 }}>
              {marcaBlanca?.activo && marcaBlanca?.nombreClinica ? marcaBlanca.nombreClinica : 'HiDoc — Bitácora Clínica Pediátrica'}
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#4B5563' }}>
              Ficha Clínica & Reporte Evolutivo Térmico
            </p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '11px', color: '#4B5563' }}>
            <div><strong>Emisión:</strong> {new Date().toLocaleDateString('es-CL')}</div>
            <div><strong>Expediente:</strong> {perfilActivo?.codigoExpediente || 'HC-PENDIENTE'}</div>
          </div>
        </div>

        {/* Ficha del Paciente */}
        <div className="print-card" style={{ padding: '12px', marginBottom: '14px', borderRadius: '6px' }}>
          <h2 style={{ fontSize: '13px', margin: '0 0 8px', borderBottom: '1px solid #E5E7EB', paddingBottom: '4px', textTransform: 'uppercase', color: '#1F2937' }}>
            Datos del Paciente & Antecedentes
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '11.5px', lineHeight: 1.4 }}>
            <div><strong>Nombre:</strong> {perfilActivo?.nombre || '—'}</div>
            <div><strong>Edad:</strong> {perfilActivo?.edadTexto || '—'}</div>
            <div><strong>Grupo Etario:</strong> {perfilActivo?.grupoEtario || '—'}</div>
            <div><strong>Peso:</strong> {perfilActivo?.pesoKg ? `${perfilActivo.pesoKg} kg` : '—'}</div>
            <div><strong>Talla:</strong> {perfilActivo?.tallaCm ? `${perfilActivo.tallaCm} cm` : '—'}</div>
            <div><strong>IMC:</strong> {perfilActivo?.imc || '—'} ({perfilActivo?.clasificacionIMC || '—'})</div>
            <div><strong>Grupo Sanguíneo:</strong> {perfilActivo?.grupoSanguineo || '—'}</div>
            <div><strong>Alergias:</strong> <span style={{ color: perfilActivo?.alergias?.length ? '#B91C1C' : 'inherit', fontWeight: perfilActivo?.alergias?.length ? 700 : 'normal' }}>{perfilActivo?.alergias?.length ? perfilActivo.alergias.join(', ') : 'Ninguna conocida'}</span></div>
            <div><strong>Tutor:</strong> {perfilActivo?.tutor || '—'} ({perfilActivo?.telefonoUrgencia || '—'})</div>
          </div>
        </div>

        {/* Alertas Clínicas */}
        {patrones.length > 0 && (
          <div className="print-card" style={{ padding: '10px 12px', marginBottom: '14px', borderRadius: '6px', borderLeft: '4px solid #E07A5F' }}>
            <h3 style={{ fontSize: '12px', margin: '0 0 4px', color: '#B91C1C' }}>
              ⚠️ Patrones Clínicos Observados
            </h3>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '11px', lineHeight: 1.5 }}>
              {patrones.map((p, i) => (
                <li key={i}>{p.texto}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Tabla Cronológica */}
        <div className="print-card" style={{ padding: '12px', marginBottom: '32px', borderRadius: '6px' }}>
          <h2 style={{ fontSize: '13px', margin: '0 0 8px', borderBottom: '1px solid #E5E7EB', paddingBottom: '4px', textTransform: 'uppercase', color: '#1F2937' }}>
            Cronología de Registros & Medicación Administrada ({registrosDelPerfil.length} registros)
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10.5px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid #9CA3AF', background: '#F9FAFB' }}>
                <th style={{ padding: '6px' }}>Fecha y Hora</th>
                <th style={{ padding: '6px' }}>Temperatura</th>
                <th style={{ padding: '6px' }}>Síntomas</th>
                <th style={{ padding: '6px' }}>Medicación / Dosis</th>
                <th style={{ padding: '6px' }}>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {registrosDelPerfil.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <td style={{ padding: '5px 6px' }}>{formatFecha(r.fecha)}</td>
                  <td style={{ padding: '5px 6px', fontWeight: r.temperatura >= 38 ? 'bold' : 'normal', color: r.temperatura >= 38 ? '#DC2626' : 'inherit' }}>
                    {r.temperatura ? `${r.temperatura}°C` : '—'}
                  </td>
                  <td style={{ padding: '5px 6px' }}>{r.sintomas?.join(', ') || '—'}</td>
                  <td style={{ padding: '5px 6px' }}>
                    {r.medicamento ? `${r.medicamento.nombre} (${r.medicamento.dosis} ${r.medicamento.unidad})` : '—'}
                  </td>
                  <td style={{ padding: '5px 6px' }}>{r.nota || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Firmas y Timbres */}
        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-around', fontSize: '11px' }}>
          <div style={{ borderTop: '1px solid #6B7280', width: '220px', textAlign: 'center', paddingTop: '6px' }}>
            Firma del Padre / Tutor Responsable
          </div>
          <div style={{ borderTop: '1px solid #6B7280', width: '220px', textAlign: 'center', paddingTop: '6px' }}>
            Firma y Timbre del Médico / Pediatra
          </div>
        </div>
      </div>
    </div>
  );
}
