# 🧠 MenteCalma — Plan de Implementación

## Descripción del Proyecto

**MenteCalma** es una aplicación web progresiva (PWA) de salud mental diseñada para Latinoamérica, que combina herramientas de autoayuda basadas en Terapia Cognitivo-Conductual (TCC) con un diseño empático y culturalmente adaptado. La app busca cerrar la brecha de atención mental en la región, donde el 80% de quienes necesitan ayuda no la reciben.

### Stack Tecnológico
- **Frontend**: HTML + CSS + JavaScript (Vanilla — app liviana y rápida)
- **Diseño**: Dark mode suave, glassmorphism, paleta calmante, micro-animaciones
- **Datos**: LocalStorage (privacidad total — datos en el dispositivo del usuario)
- **PWA**: Service Worker para funcionalidad offline
- **Sin backend**: Toda la lógica en el cliente para máxima privacidad

---

## ¿Por qué una PWA con almacenamiento local?

- **Privacidad por diseño**: Los datos sensibles de salud mental NUNCA salen del dispositivo.
- **Funciona offline**: Ideal para usuarios con conectividad intermitente.
- **Sin registro obligatorio**: Reduce barreras de entrada y estigma.
- **Instalable**: Se puede agregar a la pantalla de inicio como una app nativa.

---

## Funcionalidades del MVP

### 🏠 1. Pantalla de Inicio (Dashboard)
- Saludo empático adaptado al momento del día y estado emocional reciente
- Resumen visual del estado de ánimo de la última semana (mini-gráfico)
- Acceso rápido a las funcionalidades principales
- Frase motivacional diaria

### 😊 2. Registro de Estado de Ánimo (Mood Tracker)
- Selector de emociones con emojis/ilustraciones (baja fricción)
- Escala de intensidad (1-5) con colores suaves
- Tags opcionales de contexto (trabajo, familia, salud, relaciones, dinero)
- Campo de notas libre opcional
- Historial visual con gráficos de tendencia (semanal/mensual)

### 📓 3. Diario Emocional Inteligente
- Escritura libre con prompts guiados opcionales
- Sugerencias de escritura basadas en TCC
- Detección de patrones emocionales con insights semanales
- Exportar entradas como PDF

### 🧘 4. Herramientas de Bienestar
- **Respiración guiada**: Animación visual (técnica 4-7-8 y box breathing)
- **Grounding 5-4-3-2-1**: Ejercicio interactivo de anclaje sensorial
- **Relajación muscular progresiva**: Guía paso a paso con temporizador
- **Sonidos de naturaleza**: Lluvia, olas, bosque

### 🧩 5. Ejercicios de TCC
- **Registro de pensamientos**: pensamiento → emoción → distorsión → reestructuración
- **Lista de distorsiones cognitivas** con ejemplos culturalmente adaptados
- **Desafío de pensamientos**: Ejercicio guiado paso a paso
- **Logros del día**: Registro de 3 cosas positivas diarias

### 🚨 6. Botón de Crisis / SOS
- Siempre visible y accesible
- Líneas de ayuda locales (por país latinoamericano)
- Plan de seguridad personal editable
- Técnicas rápidas de regulación emocional

### ⚙️ 7. Configuración y Perfil
- Toggle dark/light mode
- Configuración de recordatorios
- Exportar/importar datos
- Política de privacidad transparente

---

## Arquitectura de Archivos

```
mi nueva app/
├── index.html              # Estructura principal (SPA)
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker para offline
├── css/
│   ├── variables.css       # Design tokens (colores, tipografía, espaciado)
│   ├── base.css            # Reset y estilos base
│   ├── components.css      # Componentes reutilizables
│   ├── layout.css          # Grid, navegación, estructura
│   └── animations.css      # Micro-animaciones y transiciones
├── js/
│   ├── app.js              # Controlador principal y routing SPA
│   ├── storage.js          # Capa de abstracción para LocalStorage
│   ├── mood-tracker.js     # Lógica del registro de ánimo
│   ├── journal.js          # Lógica del diario emocional
│   ├── wellness.js         # Herramientas de bienestar
│   ├── cbt.js              # Ejercicios de TCC
│   ├── crisis.js           # Módulo de crisis/SOS
│   ├── charts.js           # Visualización de datos
│   ├── insights.js         # Análisis de patrones
│   └── settings.js         # Configuración y preferencias
├── assets/
│   └── icons/              # Iconos PWA
└── sounds/                 # Sonidos de naturaleza
```

---

## Paleta de Diseño

### Modo Oscuro (Principal)
| Token | Color | Uso |
|---|---|---|
| `--bg-primary` | `#0F1923` | Fondo principal (midnight blue profundo) |
| `--bg-secondary` | `#162231` | Cards y superficies |
| `--bg-elevated` | `#1D2D3F` | Elementos elevados |
| `--accent-calm` | `#5DADE2` | Acciones principales (azul calmante) |
| `--accent-warm` | `#F7B731` | Destacados y logros (ámbar cálido) |
| `--accent-nature` | `#27AE60` | Positivo / bienestar (verde naturaleza) |
| `--accent-soft` | `#A78BFA` | Meditación / reflexión (lavanda) |
| `--text-primary` | `#E8EDF2` | Texto principal |
| `--text-secondary` | `#8899AA` | Texto secundario |
| `--danger` | `#E74C3C` | Crisis / urgencia |

### Modo Claro
| Token | Color | Uso |
|---|---|---|
| `--bg-primary` | `#F5F7FA` | Fondo principal |
| `--bg-secondary` | `#FFFFFF` | Cards |
| `--bg-elevated` | `#EDF1F5` | Elementos elevados |

### Tipografía
- **Fuente principal**: `Inter` (Google Fonts) — moderna, legible, neutral
- **Fuente display**: `Outfit` — para títulos y frases motivacionales
- **Tamaño base**: 16px con escala modular

---

## Plan de Implementación por Fases

### Fase 1 — Fundación (CSS + Estructura)
- [ ] Design system completo (variables.css, base.css)
- [ ] Layout principal con navegación bottom tab
- [ ] index.html con estructura SPA
- [ ] Sistema de routing por hash
- [ ] PWA manifest y Service Worker básico

### Fase 2 — Funcionalidades Core
- [ ] Módulo de almacenamiento (storage.js)
- [ ] Mood Tracker con selector de emociones y gráficos
- [ ] Dashboard con resumen y saludo adaptativo
- [ ] Diario emocional con prompts de TCC

### Fase 3 — Herramientas de Bienestar
- [ ] Respiración guiada con animación
- [ ] Ejercicio de Grounding 5-4-3-2-1
- [ ] Ejercicios de TCC (registro de pensamientos, distorsiones)
- [ ] Logros del día

### Fase 4 — Pulido y Completitud
- [ ] Botón de crisis/SOS con líneas locales
- [ ] Configuración (dark/light mode, recordatorios)
- [ ] Insights y análisis de patrones
- [ ] Micro-animaciones y transiciones
- [ ] Sonidos de naturaleza
- [ ] Exportar datos como PDF

---

## Preguntas Pendientes (revisar antes de continuar)

1. **Nombre de la app**: ¿Te gusta "MenteCalma" o prefieres otro nombre?
2. **Idioma**: ¿La app será solo en español o también en inglés?
3. **Sonidos**: ¿Quieres incluir sonidos de naturaleza en el MVP o lo dejamos para después?
4. **País foco**: ¿Hay algún país de LATAM específico para las líneas de crisis?
5. **Alcance del MVP**: ¿Prefieres que implementemos todo lo descrito o quieres empezar con un set más reducido?
