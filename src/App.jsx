import { useState, useEffect, useMemo } from 'react';
import SplashScreenHiDoc from './SplashScreenHiDoc';
import LobbyRegistroHiDoc from './LobbyRegistroHiDoc';
import { COLORS, S } from './styles/theme';
import { DEMO_DATA, DEMO_PACIENTE_ID } from './data/clinicalData';
import {
  calcularEdadDetallada,
  calcularIMC,
  generarCodigoExpediente,
  uid,
  detectarPatrones
} from './utils/clinicalHelpers';

// Componentes Modulares Desacoplados (Clean Architecture)
import HeaderEMR from './components/HeaderEMR';
import FooterEMR from './components/FooterEMR';
import NavbarEMR from './components/NavbarEMR';
import FormularioExpedienteHospitalario from './components/FormularioExpedienteHospitalario';
import CredencialClinicaPediatrica from './components/CredencialClinicaPediatrica';
import VistaRegistro from './components/VistaRegistro';
import VistaHistorial from './components/VistaHistorial';
import VistaCalculadoraDosis from './components/VistaCalculadoraDosis';
import VistaAsistenteIA from './components/VistaAsistenteIA';
import VistaGuia from './components/VistaGuia';
import VistaResumen from './components/VistaResumen';
import VistaAyuda from './components/VistaAyuda';
import ModalMarcaBlanca from './components/ModalMarcaBlanca';
import ModalPlanesPremium from './components/ModalPlanesPremium';

// Re-export farmacológico canónico para interoperabilidad
export {
  TAXONOMIA_AINES,
  normalizarCadenaClinica,
  detectarAlergiaCruzadaAINE,
  FARMACOS_CONFIG,
  PRESENTACIONES_DOSIS,
  calcularDosisMilimetrica
} from './utils/clinicalPharmacology';

const STORAGE_KEY = 'bitacora-sintomas-data-v1';

/**
 * ============================================================================
 * HiDoc — Bitácora Clínica Pediátrica Inteligente con Triaje por IA
 * Orquestador Principal de Estado y Navegación SPA (<300 líneas)
 * ============================================================================
 */
export default function App() {
  // 1. Pantalla de Bienvenida / Splash Screen de 350ms
  const [mostrarSplash, setMostrarSplash] = useState(true);

  // 2. Sesión del Tutor / Usuario Autenticado (Google o Correo Alternativo)
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(() => {
    try {
      const sesion = window.localStorage.getItem('hidoctor_usuario_sesion');
      return sesion ? JSON.parse(sesion) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setMostrarSplash(false);
    }, 350);
    return () => clearTimeout(timer);
  }, []);

  const [onboardingCompletado, setOnboardingCompletado] = useState(() => {
    try {
      return window.localStorage.getItem('hidoctor_onboarding_completado') === 'true';
    } catch {
      return false;
    }
  });

  const [data, setData] = useState(() => {
    try {
      const res = window.localStorage.getItem(STORAGE_KEY);
      if (res) {
        const parsed = JSON.parse(res);
        if (parsed && Array.isArray(parsed.perfiles) && parsed.perfiles.length > 0) {
          return parsed;
        }
      }
    } catch (err) { void err; }
    return {
      tutor: '',
      pais: 'Chile',
      perfiles: [],
      registros: [],
      contactos: [],
    };
  });

  const perfiles = useMemo(() => data.perfiles || [], [data.perfiles]);
  const [perfilActivoId, setPerfilActivoId] = useState(() => perfiles[0]?.id || DEMO_PACIENTE_ID);
  const [vista, setVista] = useState(() => {
    try {
      const h = window.location.hash.replace('#', '').trim();
      const valid = ['expediente', 'registro', 'historial', 'dosis', 'ia', 'guia', 'resumen', 'ayuda'];
      return valid.includes(h) ? h : 'registro';
    } catch {
      return 'registro';
    }
  });
  const [modoEdicionExpediente, setModoEdicionExpediente] = useState(false);
  const [modoNuevoHermano, setModoNuevoHermano] = useState(false);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [prefillMedicamento, setPrefillMedicamento] = useState(null);

  // Estado de Personalización B2B / Marca Blanca para Clínicas y Consultas Privadas
  const [marcaBlanca, setMarcaBlanca] = useState(() => {
    try {
      const saved = window.localStorage.getItem('hidoctor_whitelabel_config');
      return saved ? JSON.parse(saved) : { activo: false, nombreClinica: '', telefonoUrgencia: '', linkReserva: '' };
    } catch {
      return { activo: false, nombreClinica: '', telefonoUrgencia: '', linkReserva: '' };
    }
  });
  const [mostrarModalMarcaBlanca, setMostrarModalMarcaBlanca] = useState(false);

  // Estado de Monetización B2C SaaS / Suscripción Familiar Premium
  const [mostrarModalPremium, setMostrarModalPremium] = useState(false);
  const [esPremiumActivo, setEsPremiumActivo] = useState(() => {
    try {
      return window.localStorage.getItem('hidoctor_premium_activo') === 'true';
    } catch {
      return false;
    }
  });

  function togglePremiumPrueba() {
    const nuevo = !esPremiumActivo;
    setEsPremiumActivo(nuevo);
    try {
      window.localStorage.setItem('hidoctor_premium_activo', String(nuevo));
    } catch (err) { void err; }
  }

  function guardarMarcaBlanca(nuevaConfig) {
    setMarcaBlanca(nuevaConfig);
    try {
      window.localStorage.setItem('hidoctor_whitelabel_config', JSON.stringify(nuevaConfig));
    } catch (err) { void err; }
  }

  // Asegurar persistencia y fallback seguro
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) { void err; }
  }, [data]);

  // Sincronización bidireccional SPA con Hash Navigation del navegador
  useEffect(() => {
    function sincronizarHash() {
      const h = window.location.hash.replace('#', '').trim();
      const valid = ['expediente', 'registro', 'historial', 'dosis', 'ia', 'guia', 'resumen', 'ayuda'];
      if (valid.includes(h) && h !== vista) {
        setVista(h);
      }
    }
    window.addEventListener('hashchange', sincronizarHash);
    return () => window.removeEventListener('hashchange', sincronizarHash);
  }, [vista]);

  function cambiarVista(nuevaVista) {
    setVista(nuevaVista);
    try {
      if (window.location.hash !== `#${nuevaVista}`) {
        window.location.hash = `#${nuevaVista}`;
      }
    } catch (err) { void err; }
  }

  // Fallback seguro inquebrantable para perfilActivo
  const perfilActivo = useMemo(() => {
    return perfiles.find(p => p.id === perfilActivoId) || perfiles[0] || null;
  }, [perfiles, perfilActivoId]);

  const registrosDelPerfil = useMemo(() => {
    const regs = data.registros || [];
    if (!perfilActivo) return [];
    return regs.filter(r => r.perfilId === perfilActivo.id).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }, [data.registros, perfilActivo]);

  const patrones = useMemo(() => detectarPatrones(registrosDelPerfil), [registrosDelPerfil]);

  function guardarExpedienteCompleto(expData) {
    const edadInfo = calcularEdadDetallada(expData.fechaNacimiento);
    const imcInfo = calcularIMC(expData.pesoKg, expData.tallaCm);

    const perfilExistente = perfiles.find(p => p.id === expData.id);
    const idPaciente = expData.id || uid();
    const codigoExpediente = perfilExistente?.codigoExpediente || expData.codigoExpediente || generarCodigoExpediente();

    const perfilActualizado = {
      id: idPaciente,
      codigoExpediente,
      nombre: expData.nombre.trim(),
      alias: expData.alias ? expData.alias.trim() : expData.nombre.trim(),
      fechaNacimiento: expData.fechaNacimiento || '',
      edadTexto: edadInfo.texto,
      grupoEtario: edadInfo.grupoEtario,
      sexo: expData.sexo || 'Femenino',
      pesoKg: parseFloat(expData.pesoKg) || 14,
      tallaCm: parseFloat(expData.tallaCm) || 96,
      imc: imcInfo.valor,
      clasificacionIMC: imcInfo.clasificacion,
      grupoSanguineo: expData.grupoSanguineo || 'No determinado',
      alergias: Array.isArray(expData.alergias) ? expData.alergias : [],
      antecedentes: Array.isArray(expData.antecedentes) ? expData.antecedentes : [],
      vacunasAlDia: expData.vacunasAlDia !== false,
      tutor: expData.tutor ? expData.tutor.trim() : (data.tutor || 'Tutor Familiar'),
      parentesco: expData.parentesco || 'Madre / Padre',
      telefonoUrgencia: expData.telefonoUrgencia || '',
      seguroSalud: expData.seguroSalud || 'Fonasa / Seguro Público',
      centroSalud: expData.centroSalud || '',
      creado: perfilExistente?.creado || new Date().toISOString(),
      actualizado: new Date().toISOString()
    };

    let nuevosPerfiles;
    if (perfilExistente) {
      nuevosPerfiles = perfiles.map(p => p.id === perfilExistente.id ? perfilActualizado : p);
    } else {
      nuevosPerfiles = [...perfiles, perfilActualizado];
    }

    const nuevaData = {
      ...data,
      tutor: perfilActualizado.tutor,
      pais: expData.pais || data.pais || 'Chile',
      perfiles: nuevosPerfiles,
    };

    setData(nuevaData);
    setPerfilActivoId(perfilActualizado.id);

    try {
      window.localStorage.setItem('hidoctor_onboarding_completado', 'true');
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevaData));
      window.localStorage.removeItem('hidoctor_draft_expediente');
    } catch (err) { void err; }

    setOnboardingCompletado(true);
    setModoEdicionExpediente(false);
    setModoNuevoHermano(false);
    cambiarVista('expediente');
  }

  function cargarCasoDemoSinBorrar() {
    const perfilesExistentes = data.perfiles || [];
    const perfilesNuevos = DEMO_DATA.perfiles.filter(
      dp => !perfilesExistentes.some(ep => ep.id === dp.id)
    );
    const registrosExistentes = data.registros || [];
    const registrosNuevos = DEMO_DATA.registros.filter(
      dr => !registrosExistentes.some(er => er.id === dr.id)
    );

    const nuevaData = {
      ...data,
      perfiles: [...perfilesExistentes, ...perfilesNuevos],
      registros: [...registrosExistentes, ...registrosNuevos],
      contactos: data.contactos && data.contactos.length > 0 ? data.contactos : DEMO_DATA.contactos,
    };

    setData(nuevaData);
    setPerfilActivoId(DEMO_PACIENTE_ID);
    try {
      window.localStorage.setItem('hidoctor_onboarding_completado', 'true');
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevaData));
    } catch (err) { void err; }
    setOnboardingCompletado(true);
    cambiarVista('registro');
  }

  function simularEvolucionClinica() {
    if (!perfilActivo) return;
    const ahora = new Date();
    const tempNum = (36.7 + Math.random() * 0.8).toFixed(1);
    const nuevoRegistro = {
      id: uid(),
      perfilId: perfilActivo.id,
      fecha: ahora.toISOString(),
      sintomas: ['Control de seguimiento', 'Tolerancia oral adecuada'],
      fiebre: parseFloat(tempNum) >= 38.0,
      temperatura: tempNum,
      nota: `Evolución clínica simulada (${ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}): Paciente hidratado, afebril y en recuperación favorable. Flujo dinámico verificado.`,
      foto: null,
      medicamento: null,
    };
    setData(d => ({
      ...d,
      registros: [...(d.registros || []), nuevoRegistro]
    }));
  }

  function agregarRegistro(registro) {
    if (!perfilActivo) return;
    setData(d => ({
      ...d,
      registros: [...(d.registros || []), { ...registro, id: uid(), perfilId: perfilActivo.id }]
    }));
    setMostrarForm(false);
    setPrefillMedicamento(null);
  }

  function eliminarRegistro(id) {
    setData(d => ({ ...d, registros: (d.registros || []).filter(r => r.id !== id) }));
  }

  function agregarContacto(contacto) {
    setData(d => ({ ...d, contactos: [...(d.contactos || []), { ...contacto, id: uid() }] }));
  }

  function eliminarContacto(id) {
    setData(d => ({ ...d, contactos: (d.contactos || []).filter(c => c.id !== id) }));
  }

  function setPais(pais) {
    setData(d => ({ ...d, pais }));
  }

  function transferirDosisARegistro(dosisData) {
    setPrefillMedicamento(dosisData);
    cambiarVista('registro');
    setMostrarForm(true);
  }

  // 1. Pantalla de Bienvenida / Splash Screen
  if (mostrarSplash) {
    return <SplashScreenHiDoc onSaltar={() => setMostrarSplash(false)} />;
  }

  // 2. Lobby de Registro / Inicio de Sesión Familiar
  if (!usuarioAutenticado) {
    return (
      <LobbyRegistroHiDoc
        onLoginExitoso={(usuario) => {
          setUsuarioAutenticado(usuario);
          try {
            window.localStorage.setItem('hidoctor_usuario_sesion', JSON.stringify(usuario));
            window.localStorage.setItem('hidoctor_onboarding_completado', 'true');
          } catch (err) { void err; }
          setOnboardingCompletado(true);
          if (!data.perfiles || data.perfiles.length === 0) {
            cargarCasoDemoSinBorrar();
          }
        }}
      />
    );
  }

  // 3. Si es un usuario nuevo o sin registros previos, mostrar el Expediente Hospitalario con Auto-Save
  if (!onboardingCompletado || perfiles.length === 0) {
    return (
      <div style={S.app}>
        <FormularioExpedienteHospitalario
          esOnboarding={true}
          onGuardar={guardarExpedienteCompleto}
          onCargarDemo={cargarCasoDemoSinBorrar}
        />
      </div>
    );
  }

  return (
    <main style={S.app} id="main-content">
      {/* Barra de estado / Cabecera EMR Header */}
      <HeaderEMR
        perfilActivo={perfilActivo}
        usuarioAutenticado={usuarioAutenticado}
        onLogout={() => {
          try {
            window.localStorage.removeItem('hidoctor_usuario_sesion');
          } catch (err) { void err; }
          setUsuarioAutenticado(null);
        }}
        esPremiumActivo={esPremiumActivo}
        onAbrirPremium={() => setMostrarModalPremium(true)}
        marcaBlanca={marcaBlanca}
        onAbrirMarcaBlanca={() => setMostrarModalMarcaBlanca(true)}
        vista={vista}
        onVerExpediente={() => {
          setModoNuevoHermano(false);
          setModoEdicionExpediente(false);
          cambiarVista('expediente');
        }}
        onCargarDemo={cargarCasoDemoSinBorrar}
        onSimularEvolucion={simularEvolucionClinica}
      />

      {/* Selector de perfil de pacientes y botón de alta */}
      <nav aria-label="Perfiles de pacientes" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
        {perfiles.map(p => (
          <button
            key={p.id}
            onClick={() => {
              setPerfilActivoId(p.id);
              setModoEdicionExpediente(false);
              setModoNuevoHermano(false);
            }}
            style={S.chip(p.id === perfilActivo?.id)}
            aria-pressed={p.id === perfilActivo?.id}
          >
            🧒 {p.nombre}
          </button>
        ))}
        <button
          onClick={() => {
            setModoNuevoHermano(true);
            setModoEdicionExpediente(true);
            cambiarVista('expediente');
          }}
          style={{ ...S.chip(false), borderStyle: 'dashed', color: COLORS.sageDark }}
          aria-label="Agregar nuevo paciente o hermano"
        >
          + Paciente
        </button>
      </nav>

      {/* Contenido según la pestaña activa */}
      <main>
        {vista === 'expediente' && (modoEdicionExpediente || perfiles.length === 0 ? (
          <FormularioExpedienteHospitalario
            perfilInicial={modoNuevoHermano ? null : perfilActivo}
            esOnboarding={false}
            onGuardar={guardarExpedienteCompleto}
            onCancelar={() => { setModoEdicionExpediente(false); setModoNuevoHermano(false); }}
          />
        ) : (
          <CredencialClinicaPediatrica
            perfilActivo={perfilActivo}
            onEditar={() => { setModoNuevoHermano(false); setModoEdicionExpediente(true); }}
            onNuevoPaciente={() => { setModoNuevoHermano(true); setModoEdicionExpediente(true); }}
            onIrABitacora={() => cambiarVista('registro')}
          />
        ))}

        {vista === 'registro' && (
          <VistaRegistro
            perfilActivo={perfilActivo}
            mostrarForm={mostrarForm}
            setMostrarForm={setMostrarForm}
            agregarRegistro={agregarRegistro}
            registrosDelPerfil={registrosDelPerfil}
            patrones={patrones}
            prefillMedicamento={prefillMedicamento}
            onCrearPerfilPrimero={() => { setModoNuevoHermano(true); setModoEdicionExpediente(true); cambiarVista('expediente'); }}
            onVerExpediente={() => { setModoNuevoHermano(false); setModoEdicionExpediente(false); cambiarVista('expediente'); }}
          />
        )}

        {vista === 'historial' && (
          <VistaHistorial
            perfilActivo={perfilActivo}
            registrosDelPerfil={registrosDelPerfil}
            eliminarRegistro={eliminarRegistro}
            onVerResumen={() => cambiarVista('resumen')}
          />
        )}

        {vista === 'dosis' && (
          <VistaCalculadoraDosis
            perfilActivo={perfilActivo}
            onTransferirDosis={transferirDosisARegistro}
          />
        )}

        {vista === 'ia' && (
          <VistaAsistenteIA
            perfilActivo={perfilActivo}
            registrosDelPerfil={registrosDelPerfil}
            patrones={patrones}
          />
        )}

        {vista === 'guia' && <VistaGuia />}

        {vista === 'resumen' && (
          <VistaResumen
            perfilActivo={perfilActivo}
            registrosDelPerfil={registrosDelPerfil}
            patrones={patrones}
            marcaBlanca={marcaBlanca}
            onVolver={() => cambiarVista('historial')}
          />
        )}

        {vista === 'ayuda' && (
          <VistaAyuda
            contactos={data.contactos || []}
            agregarContacto={agregarContacto}
            eliminarContacto={eliminarContacto}
            paisSeleccionado={data.pais || 'Chile'}
            setPaisSeleccionado={setPais}
          />
        )}
      </main>

      {/* Pie de página y accesos directos */}
      <FooterEMR
        marcaBlanca={marcaBlanca}
        onAbrirMarcaBlanca={() => setMostrarModalMarcaBlanca(true)}
        esPremiumActivo={esPremiumActivo}
        onAbrirPremium={() => setMostrarModalPremium(true)}
      />

      {/* Modales de Gestión */}
      {mostrarModalMarcaBlanca && (
        <ModalMarcaBlanca
          marcaBlanca={marcaBlanca}
          onGuardar={guardarMarcaBlanca}
          onClose={() => setMostrarModalMarcaBlanca(false)}
        />
      )}

      {mostrarModalPremium && (
        <ModalPlanesPremium
          esPremiumActivo={esPremiumActivo}
          onTogglePremium={togglePremiumPrueba}
          onAbrirMarcaBlanca={() => {
            setMostrarModalPremium(false);
            setMostrarModalMarcaBlanca(true);
          }}
          onClose={() => setMostrarModalPremium(false)}
        />
      )}

      {/* Barra de Navegación Inferior */}
      <NavbarEMR
        vista={vista}
        cambiarVista={cambiarVista}
        onIrAExpediente={() => { setModoNuevoHermano(false); setModoEdicionExpediente(false); cambiarVista('expediente'); }}
      />
    </main>
  );
}
