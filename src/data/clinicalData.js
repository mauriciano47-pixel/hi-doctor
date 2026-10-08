/**
 * ============================================================================
 * HiDoc — Catálogo Canónico Clínico Pediátrico & Datos de Demostración (SSOT)
 * ============================================================================
 */

export const SYMPTOM_OPTIONS = [
  'Fiebre', 'Tos', 'Vómito', 'Diarrea', 'Dolor de panza', 'Dolor de cabeza',
  'Dolor de garganta', 'Erupción en la piel', 'Congestión nasal', 'Decaimiento',
  'Pérdida de apetito', 'Dolor de oído', 'Llanto inusual', 'Dificultad para dormir', 'Otro'
];

export const UNIT_OPTIONS = ['ml', 'mg', 'gotas', 'cucharadita', 'cucharada', 'comprimido', 'sobre'];

export const GUIA_EDUCATIVA = [
  {
    titulo: 'Busca atención médica urgente si el niño presenta:',
    nivel: 'alerta',
    items: [
      'Dificultad para respirar, respiración muy rápida o silbante',
      'Labios o cara con color azulado o grisáceo',
      'Fiebre en un bebé menor de 3 meses (cualquier temperatura sobre 38°C)',
      'Fiebre muy alta (40°C o más) que no baja con medicación',
      'Letargo extremo, dificultad para despertar o falta de respuesta',
      'Rigidez de cuello, manchas en la piel que no desaparecen al presionar',
      'Vómitos o diarrea con signos de deshidratación (boca seca, sin lágrimas, orina muy escasa)',
      'Convulsiones',
      'Dolor abdominal intenso y persistente',
      'Erupción que se extiende rápido junto con fiebre',
    ]
  },
  {
    titulo: 'Puedes observar en casa, pero consulta si no mejora, cuando el niño presenta:',
    nivel: 'observar',
    items: [
      'Fiebre leve o moderada en un niño que sigue jugando, comiendo y reactivo',
      'Tos o congestión nasal sin dificultad para respirar',
      'Vómito o diarrea aislados, sin signos de deshidratación',
      'Síntomas leves que duran menos de 2-3 días sin empeorar',
      'Erupciones leves y localizadas sin fiebre alta asociada',
    ]
  },
  {
    titulo: 'Como referencia general (esto no sustituye la evaluación de un profesional):',
    nivel: 'info',
    items: [
      'Anota cuánto dura cada síntoma, no solo si aparece',
      'Lleva el registro de temperatura y medicación a la consulta médica',
      'Si tienes dudas, siempre es válido llamar o consultar a tu pediatra',
    ]
  },
];

export const NUMEROS_EMERGENCIA = {
  'Chile': [
    { nombre: 'Ambulancia (SAMU)', numero: '131', display: '131', tipo: 'emergencia' },
    { nombre: 'Bomberos', numero: '132', display: '132', tipo: 'emergencia' },
    { nombre: 'Carabineros', numero: '133', display: '133', tipo: 'emergencia' },
    { nombre: 'Salud Responde', numero: '6003607777', display: '600 360 7777', tipo: 'consulta' },
  ],
  'México': [
    { nombre: 'Emergencias', numero: '911', display: '911', tipo: 'emergencia' },
    { nombre: 'Cruz Roja', numero: '065', display: '065', tipo: 'emergencia' },
    { nombre: 'SAPTEL (apoyo emocional)', numero: '5552598121', display: '55 5259-8121', tipo: 'consulta' },
  ],
  'Colombia': [
    { nombre: 'Línea de emergencias', numero: '123', display: '123', tipo: 'emergencia' },
    { nombre: 'Cruz Roja', numero: '132', display: '132', tipo: 'emergencia' },
    { nombre: 'Línea de la salud', numero: '106', display: '106', tipo: 'consulta' },
  ],
  'Argentina': [
    { nombre: 'SAME (emergencias médicas)', numero: '107', display: '107', tipo: 'emergencia' },
    { nombre: 'Emergencias', numero: '911', display: '911', tipo: 'emergencia' },
    { nombre: 'Centro de Intoxicaciones', numero: '08003330160', display: '0800-333-0160', tipo: 'consulta' },
  ],
  'Perú': [
    { nombre: 'SAMU', numero: '106', display: '106', tipo: 'emergencia' },
    { nombre: 'Bomberos', numero: '116', display: '116', tipo: 'emergencia' },
    { nombre: 'Policía', numero: '105', display: '105', tipo: 'emergencia' },
  ],
  'España': [
    { nombre: 'Emergencias', numero: '112', display: '112', tipo: 'emergencia' },
    { nombre: 'Urgencias sanitarias', numero: '061', display: '061', tipo: 'emergencia' },
  ],
  'Ecuador': [
    { nombre: 'ECU 911', numero: '911', display: '911', tipo: 'emergencia' },
    { nombre: 'Cruz Roja', numero: '131', display: '131', tipo: 'emergencia' },
  ],
  'Venezuela': [
    { nombre: 'Emergencias', numero: '911', display: '911', tipo: 'emergencia' },
    { nombre: 'Bomberos', numero: '171', display: '171', tipo: 'emergencia' },
  ],
  'Rep. Dominicana': [
    { nombre: 'Emergencias', numero: '911', display: '911', tipo: 'emergencia' },
    { nombre: 'Cruz Roja', numero: '8092211000', display: '809-221-1000', tipo: 'emergencia' },
  ],
};

export const TIPOS_CONTACTO = {
  pediatra: '👨‍⚕️ Pediatra',
  hospital: '🏥 Hospital / Clínica',
  farmacia: '💊 Farmacia',
  otro: '📋 Otro contacto',
};

export const TIPOS_LUGAR = {
  hospital: '🏥 Hospital',
  clinic: '🩺 Clínica',
  pharmacy: '💊 Farmacia',
  doctors: '👨‍⚕️ Consultorio',
};

export const DEMO_PACIENTE_ID = 'paciente-demo-sofia';
export const DEMO_PACIENTE_MATEO_ID = 'paciente-demo-mateo';
export const DEMO_PACIENTE_LUCAS_ID = 'paciente-demo-lucas';
export const DEMO_PACIENTE_EMMA_ID = 'paciente-demo-emma';

export const DEMO_DATA = {
  tutor: 'Mauricio Uribe Maldonado',
  pais: 'Chile',
  perfiles: [
    {
      id: DEMO_PACIENTE_ID,
      codigoExpediente: 'HC-PED-2026-3814',
      nombre: 'Sofía Uribe',
      alias: 'Sofi',
      fechaNacimiento: new Date(Date.now() - 86400000 * 365 * 3.2).toISOString().slice(0, 10),
      edadTexto: '3 años 2 meses',
      grupoEtario: 'Preescolar (2 a 5 años)',
      sexo: 'Femenino',
      pesoKg: 14,
      tallaCm: 96,
      imc: '15.2',
      clasificacionIMC: 'Rango saludable / Eutrófico',
      grupoSanguineo: 'A+',
      alergias: ['Ibuprofeno / AINEs', 'Polen / Ácaros'],
      antecedentes: ['Bronquiolitis a los 11 meses'],
      vacunasAlDia: true,
      tutor: 'Mauricio Uribe Maldonado',
      parentesco: 'Padre',
      telefonoUrgencia: '+56 9 8765 4321',
      seguroSalud: 'Fonasa / Complementario',
      centroSalud: 'Clínica Santa María / Urgencia Infantil',
      creado: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: DEMO_PACIENTE_MATEO_ID,
      codigoExpediente: 'HC-PED-2026-1102',
      nombre: 'Mateo González',
      alias: 'Mateito',
      fechaNacimiento: new Date(Date.now() - 86400000 * 30 * 8).toISOString().slice(0, 10),
      edadTexto: '8 meses',
      grupoEtario: 'Lactante Menor (1 a 12 meses)',
      sexo: 'Masculino',
      pesoKg: 8.5,
      tallaCm: 71,
      imc: '16.9',
      clasificacionIMC: 'Eutrófico / Adecuado para la edad',
      grupoSanguineo: 'O+',
      alergias: [],
      antecedentes: ['Recién nacido a término (39 sem)'],
      vacunasAlDia: true,
      tutor: 'Mauricio Uribe Maldonado',
      parentesco: 'Padre',
      telefonoUrgencia: '+56 9 8765 4321',
      seguroSalud: 'Isapre Colmena',
      centroSalud: 'Hospital Clínico Pediátrico',
      creado: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
    {
      id: DEMO_PACIENTE_LUCAS_ID,
      codigoExpediente: 'HC-PED-2026-7731',
      nombre: 'Lucas Navarrete',
      alias: 'Luquitas',
      fechaNacimiento: new Date(Date.now() - 86400000 * 365 * 6.1).toISOString().slice(0, 10),
      edadTexto: '6 años 1 mes',
      grupoEtario: 'Escolar (6 a 11 años)',
      sexo: 'Masculino',
      pesoKg: 21,
      tallaCm: 116,
      imc: '15.6',
      clasificacionIMC: 'Rango saludable / Eutrófico',
      grupoSanguineo: 'B+',
      alergias: ['Penicilina / Amoxicilina'],
      antecedentes: ['Asma infantil leve', 'Rinitis estacional'],
      vacunasAlDia: true,
      tutor: 'Mauricio Uribe Maldonado',
      parentesco: 'Padre',
      telefonoUrgencia: '+56 9 8765 4321',
      seguroSalud: 'Banmédica',
      centroSalud: 'Clínica Alemana / Pediatría',
      creado: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: DEMO_PACIENTE_EMMA_ID,
      codigoExpediente: 'HC-PED-2026-9042',
      nombre: 'Emma Silva',
      alias: 'Emmita',
      fechaNacimiento: new Date(Date.now() - 86400000 * 30 * 16).toISOString().slice(0, 10),
      edadTexto: '1 año 4 meses',
      grupoEtario: 'Lactante Mayor (1 a 2 años)',
      sexo: 'Femenino',
      pesoKg: 11,
      tallaCm: 81,
      imc: '16.8',
      clasificacionIMC: 'Nutrición adecuada',
      grupoSanguineo: 'AB+',
      alergias: ['Proteína Leche Vaca (APLV)'],
      antecedentes: ['Control gastroenterológico infantil'],
      vacunasAlDia: true,
      tutor: 'Mauricio Uribe Maldonado',
      parentesco: 'Padre',
      telefonoUrgencia: '+56 9 8765 4321',
      seguroSalud: 'Fonasa Tramo D',
      centroSalud: 'Hospital Exequiel González Cortés',
      creado: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ],
  registros: [
    // --- 1. REGISTROS SOFÍA (Síndrome Febril Agudo / Faringitis) ---
    {
      id: 'reg-demo-sofia-1',
      perfilId: DEMO_PACIENTE_ID,
      fecha: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
      sintomas: ['Congestión nasal', 'Decaimiento'],
      fiebre: true,
      temperatura: '37.8',
      nota: 'Comenzó con moquitos y decaimiento leve por la tarde.',
      foto: null,
      medicamento: null,
    },
    {
      id: 'reg-demo-sofia-2',
      perfilId: DEMO_PACIENTE_ID,
      fecha: new Date(Date.now() - 1000 * 60 * 60 * 13).toISOString(),
      sintomas: ['Fiebre', 'Tos', 'Pérdida de apetito'],
      fiebre: true,
      temperatura: '38.6',
      nota: 'Temperatura elevada en la noche. Se administró Paracetamol 8.7 ml (Ibuprofeno contraindicado por alergia).',
      foto: null,
      medicamento: {
        nombre: 'Paracetamol Jarabe (120 mg/5 ml)',
        dosis: '8.7',
        unidad: 'ml',
        intervaloHoras: 8,
        ultimaHora: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      },
    },
    {
      id: 'reg-demo-sofia-3',
      perfilId: DEMO_PACIENTE_ID,
      fecha: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      sintomas: ['Fiebre', 'Tos'],
      fiebre: true,
      temperatura: '38.1',
      nota: 'Fiebre cediendo con hidratación y ropa ligera. Sigue con tos.',
      foto: null,
      medicamento: null,
    },

    // --- 2. REGISTROS MATEO (Lactante 8m / Fiebre Vacunal & Dentición) ---
    {
      id: 'reg-demo-mateo-1',
      perfilId: DEMO_PACIENTE_MATEO_ID,
      fecha: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
      sintomas: ['Irritabilidad', 'Dolor o molestia'],
      fiebre: false,
      temperatura: '37.4',
      nota: 'Babeo constante e irritabilidad por brote de incisivos inferiores.',
      foto: null,
      medicamento: null,
    },
    {
      id: 'reg-demo-mateo-2',
      perfilId: DEMO_PACIENTE_MATEO_ID,
      fecha: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
      sintomas: ['Fiebre', 'Irritabilidad'],
      fiebre: true,
      temperatura: '38.3',
      nota: 'Pico febril post-vacunal. Se administran 26 gotas de Paracetamol según peso (8.5 kg).',
      foto: null,
      medicamento: {
        nombre: 'Paracetamol Gotas (100 mg/ml)',
        dosis: '1.3',
        unidad: 'ml',
        intervaloHoras: 6,
        ultimaHora: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
      },
    },
    {
      id: 'reg-demo-mateo-3',
      perfilId: DEMO_PACIENTE_MATEO_ID,
      fecha: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      sintomas: ['Sin síntomas agudos'],
      fiebre: false,
      temperatura: '37.1',
      nota: 'Afebril, descansando plácidamente, buena succión al amamantar.',
      foto: null,
      medicamento: null,
    },

    // --- 3. REGISTROS LUCAS (Escolar 6a / Bronquitis Obstructiva & Asma) ---
    {
      id: 'reg-demo-lucas-1',
      perfilId: DEMO_PACIENTE_LUCAS_ID,
      fecha: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
      sintomas: ['Tos', 'Dificultad respiratoria'],
      fiebre: false,
      temperatura: '37.2',
      nota: 'Tos seca nocturna con silbido audible al exhalar.',
      foto: null,
      medicamento: {
        nombre: 'Salbutamol Inhalador (100 mcg)',
        dosis: '2',
        unidad: 'puffs',
        intervaloHoras: 6,
        ultimaHora: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
      },
    },
    {
      id: 'reg-demo-lucas-2',
      perfilId: DEMO_PACIENTE_LUCAS_ID,
      fecha: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
      sintomas: ['Fiebre', 'Tos'],
      fiebre: true,
      temperatura: '38.5',
      nota: 'Fiebre alta con malestar corporal. Dosis de Ibuprofeno calculada para 21 kg.',
      foto: null,
      medicamento: {
        nombre: 'Ibuprofeno Suspensión (100 mg/5 ml)',
        dosis: '10.5',
        unidad: 'ml',
        intervaloHoras: 8,
        ultimaHora: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
      },
    },
    {
      id: 'reg-demo-lucas-3',
      perfilId: DEMO_PACIENTE_LUCAS_ID,
      fecha: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      sintomas: ['Tos'],
      fiebre: false,
      temperatura: '36.8',
      nota: 'Ventilación pulmonar limpia tras broncodilatador. Sin dificultad para respirar.',
      foto: null,
      medicamento: null,
    },

    // --- 4. REGISTROS EMMA (Lactante Mayor 1a 4m / Cuadro Gastrointestinal) ---
    {
      id: 'reg-demo-emma-1',
      perfilId: DEMO_PACIENTE_EMMA_ID,
      fecha: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      sintomas: ['Vómitos', 'Pérdida de apetito'],
      fiebre: false,
      temperatura: '37.3',
      nota: 'Presentó 2 episodios de vómito. Iniciada pausa gástrica de 30 minutos.',
      foto: null,
      medicamento: null,
    },
    {
      id: 'reg-demo-emma-2',
      perfilId: DEMO_PACIENTE_EMMA_ID,
      fecha: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
      sintomas: ['Diarrea', 'Decaimiento'],
      fiebre: true,
      temperatura: '38.0',
      nota: 'Una deposición semilíquida. Administradas Sales de Rehidratación Oral (SRO) 60 ml a sorbos lentos.',
      foto: null,
      medicamento: {
        nombre: 'Sales de Rehidratación Oral (SRO)',
        dosis: '60',
        unidad: 'ml',
        intervaloHoras: 4,
        ultimaHora: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
      },
    },
    {
      id: 'reg-demo-emma-3',
      perfilId: DEMO_PACIENTE_EMMA_ID,
      fecha: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      sintomas: ['Sin síntomas agudos'],
      fiebre: false,
      temperatura: '36.9',
      nota: 'Buena diuresis (pañal mojado), ojos hidratados, llanto con lágrimas. Afebril.',
      foto: null,
      medicamento: null,
    },
  ],
  contactos: [
    {
      id: 'c-demo-1',
      tipo: 'pediatra',
      nombre: 'Dra. Francisca Morales (Pediatra)',
      telefono: '+56 9 8765 4321',
      direccion: 'Centro Médico Infantil, Consulta 402',
      nota: 'Atiende lunes a viernes 09:00 a 17:00',
    },
    {
      id: 'c-demo-2',
      tipo: 'hospital',
      nombre: 'Urgencia Pediátrica Clínica Santa María',
      telefono: '+56 2 2913 0000',
      direccion: 'Av. Santa María 0500, Providencia',
      nota: 'Servicio de urgencia pediátrica 24/7',
    },
  ],
};

export const GRUPOS_SANGUINEOS = ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-', 'No determinado'];

export const ALERGIAS_COMUNES = [
  'Ibuprofeno / AINEs',
  'Penicilina / Amoxicilina',
  'Paracetamol',
  'Proteína Leche Vaca (APLV)',
  'Huevo',
  'Frutos secos',
  'Sulfas',
  'Polen / Ácaros',
];

export const ANTECEDENTES_COMUNES = [
  'Bronquiolitis recurrente',
  'Asma infantil',
  'Prematurez (<37 sem)',
  'Convulsión febril previa',
  'Reflujo gastroesofágico',
  'Cardiopatía congénita',
  'Dermatitis atópica',
];
