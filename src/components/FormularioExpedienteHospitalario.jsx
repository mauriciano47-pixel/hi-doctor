import { useState, useEffect, useMemo } from 'react';
import { COLORS, S } from '../styles/theme';
import { calcularEdadDetallada, calcularIMC } from '../utils/clinicalHelpers';
import { GRUPOS_SANGUINEOS, ALERGIAS_COMUNES, ANTECEDENTES_COMUNES, NUMEROS_EMERGENCIA } from '../data/clinicalData';

/**
 * ============================================================================
 * HiDoc — Formulario de Expediente Hospitalario Pediátrico (Auto-Save Reactivo)
 * ============================================================================
 */
export default function FormularioExpedienteHospitalario({ perfilInicial, esOnboarding, onGuardar, onCancelar, onCargarDemo }) {
  // Cargar borrador de localStorage si existe para evitar pérdida de datos ante recarga o navegación hacia atrás
  const [draftLoaded] = useState(() => {
    try {
      const d = window.localStorage.getItem('hidoctor_draft_expediente');
      return d ? JSON.parse(d) : null;
    } catch {
      return null;
    }
  });

  const [nombre, setNombre] = useState(() => draftLoaded?.nombre || perfilInicial?.nombre || '');
  const [alias, setAlias] = useState(() => draftLoaded?.alias || perfilInicial?.alias || '');
  const [sexo, setSexo] = useState(() => draftLoaded?.sexo || perfilInicial?.sexo || 'Femenino');
  const [fechaNacimiento, setFechaNacimiento] = useState(() => draftLoaded?.fechaNacimiento || perfilInicial?.fechaNacimiento || '');
  const [pesoKg, setPesoKg] = useState(() => draftLoaded?.pesoKg || (perfilInicial?.pesoKg ? String(perfilInicial.pesoKg) : '14'));
  const [tallaCm, setTallaCm] = useState(() => draftLoaded?.tallaCm || (perfilInicial?.tallaCm ? String(perfilInicial.tallaCm) : '96'));
  const [grupoSanguineo, setGrupoSanguineo] = useState(() => draftLoaded?.grupoSanguineo || perfilInicial?.grupoSanguineo || 'No determinado');

  const [alergias, setAlergias] = useState(() => draftLoaded?.alergias || perfilInicial?.alergias || []);
  const [alergiasTexto, setAlergiasTexto] = useState(() => draftLoaded?.alergiasTexto || '');

  const [antecedentes, setAntecedentes] = useState(() => draftLoaded?.antecedentes || perfilInicial?.antecedentes || []);
  const [antecedentesTexto, setAntecedentesTexto] = useState(() => draftLoaded?.antecedentesTexto || '');

  const [vacunasAlDia, setVacunasAlDia] = useState(() => draftLoaded?.vacunasAlDia ?? (perfilInicial?.vacunasAlDia ?? true));

  const [tutor, setTutor] = useState(() => draftLoaded?.tutor || perfilInicial?.tutor || '');
  const [parentesco, setParentesco] = useState(() => draftLoaded?.parentesco || perfilInicial?.parentesco || 'Madre');
  const [telefonoUrgencia, setTelefonoUrgencia] = useState(() => draftLoaded?.telefonoUrgencia || perfilInicial?.telefonoUrgencia || '');
  const [pais, setPais] = useState(() => draftLoaded?.pais || perfilInicial?.pais || 'Chile');
  const [seguroSalud, setSeguroSalud] = useState(() => draftLoaded?.seguroSalud || perfilInicial?.seguroSalud || 'Fonasa / Seguro Público');
  const [centroSalud, setCentroSalud] = useState(() => draftLoaded?.centroSalud || perfilInicial?.centroSalud || '');

  // Guardado reactivo en tiempo real (Auto-Save Reactivo por cada cambio)
  useEffect(() => {
    try {
      const payload = {
        nombre, alias, sexo, fechaNacimiento, pesoKg, tallaCm,
        grupoSanguineo, alergias, alergiasTexto, antecedentes,
        antecedentesTexto, vacunasAlDia, tutor, parentesco,
        telefonoUrgencia, pais, seguroSalud, centroSalud
      };
      window.localStorage.setItem('hidoctor_draft_expediente', JSON.stringify(payload));
    } catch (err) { void err; }
  }, [nombre, alias, sexo, fechaNacimiento, pesoKg, tallaCm, grupoSanguineo, alergias, alergiasTexto, antecedentes, antecedentesTexto, vacunasAlDia, tutor, parentesco, telefonoUrgencia, pais, seguroSalud, centroSalud]);

  const edadCalculada = useMemo(() => calcularEdadDetallada(fechaNacimiento), [fechaNacimiento]);
  const imcCalculado = useMemo(() => calcularIMC(pesoKg, tallaCm), [pesoKg, tallaCm]);

  function toggleAlergia(item) {
    if (item === 'Sin alergias conocidas') {
      setAlergias(['Sin alergias conocidas']);
      return;
    }
    setAlergias(prev => {
      const limpia = prev.filter(x => x !== 'Sin alergias conocidas');
      return limpia.includes(item) ? limpia.filter(x => x !== item) : [...limpia, item];
    });
  }

  function toggleAntecedente(item) {
    setAntecedentes(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]);
  }

  function manejarSubmit(e) {
    e?.preventDefault();
    if (!nombre.trim()) return;

    const listaFinalAlergias = [...alergias];
    if (alergiasTexto.trim() && !listaFinalAlergias.includes(alergiasTexto.trim())) {
      listaFinalAlergias.push(alergiasTexto.trim());
    }

    const listaFinalAntecedentes = [...antecedentes];
    if (antecedentesTexto.trim() && !listaFinalAntecedentes.includes(antecedentesTexto.trim())) {
      listaFinalAntecedentes.push(antecedentesTexto.trim());
    }

    onGuardar({
      id: perfilInicial?.id,
      codigoExpediente: perfilInicial?.codigoExpediente,
      nombre: nombre.trim(),
      alias: alias.trim() || nombre.trim(),
      sexo,
      fechaNacimiento,
      pesoKg,
      tallaCm,
      grupoSanguineo,
      alergias: listaFinalAlergias,
      antecedentes: listaFinalAntecedentes,
      vacunasAlDia,
      tutor: tutor.trim() || 'Familiar Responsable',
      parentesco,
      telefonoUrgencia: telefonoUrgencia.trim(),
      pais,
      seguroSalud,
      centroSalud: centroSalud.trim()
    });
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', paddingBottom: 60 }}>
      {/* Banner de Estado Clínico / Auto-Save */}
      <div style={{
        background: '#EAF5F0',
        border: `1.5px solid ${COLORS.emerald}`,
        borderRadius: 12,
        padding: '9px 14px',
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13 }}>🟢</span>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: '#1B4332' }}>
            Auto-guardado activo (Tus datos están protegidos en este dispositivo)
          </span>
        </div>
        <span style={{ fontSize: 11, color: COLORS.inkLight, fontWeight: 700 }}>EMR Pro</span>
      </div>

      {/* Banner para Exploración Inmediata de Inversores y Médicos */}
      {esOnboarding && onCargarDemo && (
        <div style={{
          background: 'linear-gradient(135deg, #FFF0EA, #FFE5D9)',
          border: '2px solid #E07A5F',
          borderRadius: 14,
          padding: '14px 16px',
          marginBottom: 18,
          textAlign: 'center',
          boxShadow: '0 4px 14px rgba(224, 122, 95, 0.15)'
        }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#C4624A', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            ⚡ Modo Explorador / Demostración en 1 Clic
          </span>
          <p style={{ fontSize: 12.5, color: COLORS.ink, margin: '0 0 10px', lineHeight: 1.4 }}>
            ¿Eres inversor, médico o deseas auditar la app de inmediato sin rellenar datos?
          </p>
          <button
            type="button"
            onClick={onCargarDemo}
            style={{
              ...S.btn,
              background: '#2A9D8F',
              color: '#FFF',
              border: 'none',
              padding: '10px 18px',
              fontSize: 13,
              fontWeight: 700,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer'
            }}
          >
            🧪 Entrar Directo con 4 Casos Clínicos de Prueba (Cohorte Completo)
          </button>
        </div>
      )}

      <div style={{ textAlign: 'center', marginBottom: 18 }}>
        <div style={{ fontSize: 40, marginBottom: 4 }}>📋</div>
        <h1 style={{ ...S.h1, fontSize: 22, margin: '0 0 6px' }}>
          {esOnboarding ? 'Expediente Pediátrico Hospitalario' : 'Editar Ficha Clínica Pediátrica'}
        </h1>
        <p style={{ fontSize: 13, color: COLORS.inkLight, margin: 0, lineHeight: 1.5 }}>
          Registro clínico técnico para la atención pediátrica, cálculo de dosis y triaje de urgencia.
        </p>
      </div>

      <form onSubmit={manejarSubmit}>
        {/* BLOQUE 1: IDENTIFICACIÓN Y SOMATOMETRÍA */}
        <div style={{ ...S.card, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, borderBottom: `1px solid ${COLORS.border}`, paddingBottom: 8 }}>
            <span style={{ fontSize: 18 }}>🧒</span>
            <div>
              <h2 style={{ ...S.h2, fontSize: 15, margin: 0 }}>1. Identificación y Somatometría</h2>
              <span style={{ fontSize: 11.5, color: COLORS.inkLight }}>Datos biológicos fundamentales del paciente</span>
            </div>
          </div>

          <div style={{ marginBottom: 10 }}>
            <label htmlFor="exp-nombre" style={S.label}>Nombre completo del paciente infantil *</label>
            <input
              id="exp-nombre"
              style={S.input}
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Ej. Lucas Daniel Pérez González"
              required
            />
          </div>

          <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <div style={{ flex: 1 }}>
              <label htmlFor="exp-alias" style={S.label}>Nombre de cariño / Alias</label>
              <input
                id="exp-alias"
                style={S.input}
                value={alias}
                onChange={e => setAlias(e.target.value)}
                placeholder="Ej. Luqui"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label htmlFor="exp-sexo" style={S.label}>Sexo biológico</label>
              <select
                id="exp-sexo"
                aria-label="Sexo biológico del paciente"
                style={S.input}
                value={sexo}
                onChange={e => setSexo(e.target.value)}
              >
                <option value="Femenino">♀ Femenino</option>
                <option value="Masculino">♂ Masculino</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 10 }}>
            <label htmlFor="exp-fnac" style={S.label}>Fecha de Nacimiento exacta *</label>
            <input
              id="exp-fnac"
              type="date"
              style={S.input}
              value={fechaNacimiento}
              onChange={e => setFechaNacimiento(e.target.value)}
            />
            {fechaNacimiento && (
              <div style={{
                marginTop: 6,
                background: '#F4F5F7',
                padding: '6px 10px',
                borderRadius: 8,
                fontSize: 12,
                color: COLORS.ink,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>
                <span>📅</span>
                <span><strong>Edad calculada:</strong> {edadCalculada.texto} · <em>{edadCalculada.grupoEtario}</em></span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
            <div style={{ flex: 1 }}>
              <label htmlFor="exp-peso" style={S.label}>Peso en kg * (dosis exacta)</label>
              <input
                id="exp-peso"
                type="number"
                step="0.1"
                min="1"
                max="80"
                style={S.input}
                value={pesoKg}
                onChange={e => setPesoKg(e.target.value)}
                placeholder="14.0"
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label htmlFor="exp-talla" style={S.label}>Estatura / Talla en cm</label>
              <input
                id="exp-talla"
                type="number"
                step="0.5"
                min="30"
                max="200"
                style={S.input}
                value={tallaCm}
                onChange={e => setTallaCm(e.target.value)}
                placeholder="96"
              />
            </div>
          </div>

          {imcCalculado.valor && (
            <div style={{
              background: '#EEF3EE',
              border: `1px solid ${COLORS.emerald}`,
              borderRadius: 8,
              padding: '6px 10px',
              fontSize: 12,
              color: '#1B4332'
            }}>
              📊 <strong>IMC Pediátrico:</strong> {imcCalculado.valor} kg/m² · <span>{imcCalculado.clasificacion}</span>
            </div>
          )}
        </div>

        {/* BLOQUE 2: SEGURIDAD CLÍNICA, ALERGIAS Y ANTECEDENTES */}
        <div style={{ ...S.card, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, borderBottom: `1px solid ${COLORS.border}`, paddingBottom: 8 }}>
            <span style={{ fontSize: 18 }}>🛡️</span>
            <div>
              <h2 style={{ ...S.h2, fontSize: 15, margin: 0 }}>2. Seguridad Clínica & Alergias</h2>
              <span style={{ fontSize: 11.5, color: COLORS.inkLight }}>Crucial para evitar contraindicaciones de medicamentos</span>
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label htmlFor="exp-sangre" style={S.label}>Grupo Sanguíneo y Factor Rh</label>
            <select
              id="exp-sangre"
              aria-label="Grupo sanguíneo y factor Rh"
              style={S.input}
              value={grupoSanguineo}
              onChange={e => setGrupoSanguineo(e.target.value)}
            >
              {GRUPOS_SANGUINEOS.map(g => (
                <option key={g} value={g}>🩸 {g}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={S.label}>Alergias a Medicamentos o Alimentos (toca para marcar):</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
              {ALERGIAS_COMUNES.map(a => {
                const marcada = alergias.includes(a);
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() => toggleAlergia(a)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: 14,
                      fontSize: 11.5,
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: `1.5px solid ${marcada ? COLORS.alert : COLORS.border}`,
                      background: marcada ? COLORS.alertBg : COLORS.white,
                      color: marcada ? COLORS.alert : COLORS.ink,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {marcada ? `⚠️ ${a}` : a}
                  </button>
                );
              })}
            </div>
            <input
              style={{ ...S.input, fontSize: 12, padding: '8px 10px' }}
              value={alergiasTexto}
              onChange={e => setAlergiasTexto(e.target.value)}
              placeholder="¿Otra alergia no listada? Escríbela aquí"
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={S.label}>Antecedentes Médicos Relevantes:</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
              {ANTECEDENTES_COMUNES.map(ant => {
                const marcada = antecedentes.includes(ant);
                return (
                  <button
                    key={ant}
                    type="button"
                    onClick={() => toggleAntecedente(ant)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: 14,
                      fontSize: 11.5,
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: `1.5px solid ${marcada ? COLORS.sage : COLORS.border}`,
                      background: marcada ? '#F8ECE8' : COLORS.white,
                      color: marcada ? COLORS.sageDark : COLORS.ink,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {marcada ? `✓ ${ant}` : ant}
                  </button>
                );
              })}
            </div>
            <input
              style={{ ...S.input, fontSize: 12, padding: '8px 10px' }}
              value={antecedentesTexto}
              onChange={e => setAntecedentesTexto(e.target.value)}
              placeholder="Otro antecedente (ej. Cirugía, condición crónica)"
            />
          </div>

          <div>
            <label style={S.label}>Carnet de Vacunación:</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={() => setVacunasAlDia(true)}
                style={{
                  ...S.btn,
                  flex: 1,
                  padding: '9px 12px',
                  fontSize: 12,
                  background: vacunasAlDia ? '#2A9D8F' : COLORS.white,
                  color: vacunasAlDia ? COLORS.white : COLORS.ink,
                  border: `1.5px solid ${COLORS.emerald}`
                }}
              >
                ✓ Esquema al día
              </button>
              <button
                type="button"
                onClick={() => setVacunasAlDia(false)}
                style={{
                  ...S.btn,
                  flex: 1,
                  padding: '9px 12px',
                  fontSize: 12,
                  background: !vacunasAlDia ? COLORS.alert : COLORS.white,
                  color: !vacunasAlDia ? COLORS.white : COLORS.ink,
                  border: `1.5px solid ${COLORS.alert}`
                }}
              >
                ⚠️ Dosis pendiente
              </button>
            </div>
          </div>
        </div>

        {/* BLOQUE 3: TUTOR LEGAL Y RED DE COBERTURA */}
        <div style={{ ...S.card, marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, borderBottom: `1px solid ${COLORS.border}`, paddingBottom: 8 }}>
            <span style={{ fontSize: 18 }}>👨‍👩‍👧</span>
            <div>
              <h2 style={{ ...S.h2, fontSize: 15, margin: 0 }}>3. Tutor Legal & Cobertura de Urgencia</h2>
              <span style={{ fontSize: 11.5, color: COLORS.inkLight }}>Para contacto inmediato y red asistencial</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <div style={{ flex: 2 }}>
              <label htmlFor="exp-tutor" style={S.label}>Nombre del Tutor Legal *</label>
              <input
                id="exp-tutor"
                style={S.input}
                value={tutor}
                onChange={e => setTutor(e.target.value)}
                placeholder="Ej. Mauricio Uribe Maldonado"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label htmlFor="exp-parentesco" style={S.label}>Parentesco</label>
              <select
                id="exp-parentesco"
                aria-label="Parentesco del tutor"
                style={S.input}
                value={parentesco}
                onChange={e => setParentesco(e.target.value)}
              >
                <option value="Madre">Madre</option>
                <option value="Padre">Padre</option>
                <option value="Abuelo/a">Abuelo/a</option>
                <option value="Tutor Legal">Tutor Legal</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <div style={{ flex: 1 }}>
              <label htmlFor="exp-tel" style={S.label}>Teléfono directo de urgencia</label>
              <input
                id="exp-tel"
                type="tel"
                style={S.input}
                value={telefonoUrgencia}
                onChange={e => setTelefonoUrgencia(e.target.value)}
                placeholder="Ej. +56 9 8765 4321"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label htmlFor="exp-pais" style={S.label}>País (fija 131/112/911)</label>
              <select
                id="exp-pais"
                aria-label="País de residencia para números de emergencia"
                style={S.input}
                value={pais}
                onChange={e => setPais(e.target.value)}
              >
                {Object.keys(NUMEROS_EMERGENCIA).map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 10 }}>
            <label htmlFor="exp-centro" style={S.label}>Centro de Salud / Hospital de referencia</label>
            <input
              id="exp-centro"
              style={S.input}
              value={centroSalud}
              onChange={e => setCentroSalud(e.target.value)}
              placeholder="Ej. Clínica Santa María / Hospital Exequiel González Cortés"
            />
          </div>

          <div>
            <label htmlFor="exp-seguro" style={S.label}>Previsión de Salud / Seguro Médico</label>
            <input
              id="exp-seguro"
              style={S.input}
              value={seguroSalud}
              onChange={e => setSeguroSalud(e.target.value)}
              placeholder="Ej. Fonasa Tramo B / Isapre Colmena / Seguro Escolar"
            />
          </div>
        </div>

        {/* Botonera de Acción */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <button
            type="submit"
            style={{
              ...S.btn,
              flex: 2,
              padding: '14px 18px',
              fontSize: 15,
              opacity: !nombre.trim() ? 0.6 : 1,
              boxShadow: '0 4px 12px rgba(224, 122, 95, 0.3)'
            }}
            disabled={!nombre.trim()}
          >
            💾 Guardar Expediente Clínico Pediátrico
          </button>
          {onCancelar && (
            <button
              type="button"
              onClick={onCancelar}
              style={{ ...S.btnOutline, flex: 1, padding: '14px 18px' }}
            >
              Cancelar
            </button>
          )}
        </div>

        {esOnboarding && onCargarDemo && (
          <div style={{ textAlign: 'center', marginTop: 14 }}>
            <div style={{ position: 'relative', margin: '14px 0 10px' }}>
              <hr style={{ border: 'none', borderTop: `1px solid ${COLORS.border}` }} />
              <span style={{
                position: 'absolute', top: -9, left: '50%', transform: 'translateX(-50%)',
                background: COLORS.cream, padding: '0 10px', fontSize: 11, color: COLORS.inkLight
              }}>
                o para evaluar la aplicación de inmediato
              </span>
            </div>
            <button
              type="button"
              onClick={onCargarDemo}
              style={{ ...S.btnOutline, width: '100%', padding: '11px 16px', fontSize: 13, background: COLORS.white }}
            >
              👀 Explorar con 4 Casos Clínicos de Demostración (Cohorte Pediátrico)
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
