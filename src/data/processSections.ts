import type { Locale } from "../i18n/config";
import type { RouteKey } from "../i18n/routes";

export type ProcessPhase = {
  number: string;
  title: string;
  objectiveLabel: string;
  objective: string;
  deliverablesLabel: string;
  deliverables: string[];
  valueLabel: string;
  value: string;
};

export type ProcessRiskControl = {
  title: string;
  text: string;
};

export type ProcessSectionsContent = {
  hero: {
    eyebrow: string;
    title: string;
    text: string;
  };
  methodCard: {
    label: string;
    title: string;
    text: string;
    flow: string[];
  };
  timeline: {
    eyebrow: string;
    title: string;
    text: string;
    phases: ProcessPhase[];
  };
  riskControls: {
    eyebrow: string;
    title: string;
    text: string;
    items: ProcessRiskControl[];
  };
  cta: {
    title: string;
    text: string;
    primaryLabel: string;
    primaryRouteKey: RouteKey;
    secondaryLabel: string;
    secondaryRouteKey: RouteKey;
  };
};

export const processSections: Record<Locale, ProcessSectionsContent> = {
  es: {
    hero: {
      eyebrow: "Proceso",
      title: "Un método técnico para reducir incertidumbre antes de construir.",
      text:
        "IoCode SOLUTIONS trabaja por fases para entender el problema real, controlar riesgos, definir criterios de aceptación y entregar soluciones industriales mantenibles."
    },
    methodCard: {
      label: "Método de trabajo",
      title: "Diagnóstico → Propuesta → Desarrollo → Validación",
      text:
        "Cada fase tiene un objetivo claro, entregables concretos y una función: evitar improvisación técnica en proyectos donde intervienen máquinas, PLCs, robots, datos y software.",
      flow: ["Diagnóstico", "Propuesta", "Desarrollo", "Validación"]
    },
    timeline: {
      eyebrow: "Fases del proyecto",
      title: "De problema operativo a solución verificable.",
      text:
        "El proceso está diseñado para mantener alineados a producción, mantenimiento, ingeniería y software desde el primer análisis hasta la entrega.",
      phases: [
        {
          number: "01",
          title: "Diagnóstico",
          objectiveLabel: "Objetivo",
          objective:
            "Entender el problema real antes de proponer una solución técnica.",
          deliverablesLabel: "Entregables",
          deliverables: [
            "Alcance inicial",
            "Riesgos técnicos",
            "Sistemas afectados",
            "Datos disponibles",
            "Restricciones operativas"
          ],
          valueLabel: "Valor",
          value:
            "Evita construir sobre supuestos y permite priorizar lo que realmente afecta a la operación."
        },
        {
          number: "02",
          title: "Propuesta técnica",
          objectiveLabel: "Objetivo",
          objective:
            "Definir una solución viable, mantenible y alineada con el entorno existente.",
          deliverablesLabel: "Entregables",
          deliverables: [
            "Arquitectura propuesta",
            "Fases de trabajo",
            "Tecnologías recomendadas",
            "Dependencias",
            "Criterios de aceptación"
          ],
          valueLabel: "Valor",
          value:
            "Reduce ambigüedad, mejora la estimación y deja claro qué se va a construir y cómo se validará."
        },
        {
          number: "03",
          title: "Desarrollo modular",
          objectiveLabel: "Objetivo",
          objective:
            "Construir por bloques pequeños, revisables e integrables con sistemas reales.",
          deliverablesLabel: "Entregables",
          deliverables: [
            "Componentes funcionales",
            "Integraciones progresivas",
            "Documentación mínima útil",
            "Revisión técnica",
            "Control de cambios"
          ],
          valueLabel: "Valor",
          value:
            "Facilita mantenimiento, reduce regresiones y permite validar avances sin esperar al final del proyecto."
        },
        {
          number: "04",
          title: "Validación y entrega",
          objectiveLabel: "Objetivo",
          objective:
            "Comprobar que la solución funciona, es entendible y queda lista para operación o evolución.",
          deliverablesLabel: "Entregables",
          deliverables: [
            "Pruebas funcionales",
            "Revisión de rutas y enlaces",
            "Build validado",
            "Riesgos pendientes",
            "Límites conocidos"
          ],
          valueLabel: "Valor",
          value:
            "Cierra la fase con evidencia, no con intuición, y deja una base clara para soporte o mejora futura."
        }
      ]
    },
    riskControls: {
      eyebrow: "Control de riesgo",
      title: "Cómo se evita que un proyecto técnico se vuelva frágil.",
      text:
        "La calidad no depende solo del código o del PLC. Depende de entender el proceso, documentar decisiones y validar cada paso con criterios claros.",
      items: [
        {
          title: "Alcance claro",
          text:
            "Antes de construir se definen objetivos, límites, usuarios, máquinas, datos y dependencias."
        },
        {
          title: "Validación continua",
          text:
            "Cada avance se revisa con criterios de aceptación para detectar errores antes de que sean costosos."
        },
        {
          title: "Documentación útil",
          text:
            "La documentación se orienta al mantenimiento real: qué existe, por qué se decidió y cómo se opera."
        }
      ]
    },
    cta: {
      title: "¿Tienes un proceso, máquina o sistema que necesita diagnóstico?",
      text:
        "Podemos empezar por una revisión técnica para entender alcance, riesgos, datos disponibles y opciones reales de mejora.",
      primaryLabel: "Solicitar diagnóstico",
      primaryRouteKey: "contact",
      secondaryLabel: "Ver servicios",
      secondaryRouteKey: "services"
    }
  },

  en: {
    hero: {
      eyebrow: "Process",
      title: "A technical method to reduce uncertainty before building.",
      text:
        "IoCode SOLUTIONS works in phases to understand the real problem, control risks, define acceptance criteria and deliver maintainable industrial solutions."
    },
    methodCard: {
      label: "Work method",
      title: "Diagnostics → Proposal → Development → Validation",
      text:
        "Each phase has a clear goal, concrete deliverables and one purpose: avoiding technical improvisation in projects involving machines, PLCs, robots, data and software.",
      flow: ["Diagnostics", "Proposal", "Development", "Validation"]
    },
    timeline: {
      eyebrow: "Project phases",
      title: "From operational problem to verifiable solution.",
      text:
        "The process is designed to keep production, maintenance, engineering and software aligned from the first analysis to delivery.",
      phases: [
        {
          number: "01",
          title: "Diagnostics",
          objectiveLabel: "Goal",
          objective:
            "Understand the real problem before proposing a technical solution.",
          deliverablesLabel: "Deliverables",
          deliverables: [
            "Initial scope",
            "Technical risks",
            "Affected systems",
            "Available data",
            "Operational constraints"
          ],
          valueLabel: "Value",
          value:
            "Prevents building on assumptions and helps prioritize what truly affects operations."
        },
        {
          number: "02",
          title: "Technical proposal",
          objectiveLabel: "Goal",
          objective:
            "Define a viable, maintainable solution aligned with the existing environment.",
          deliverablesLabel: "Deliverables",
          deliverables: [
            "Proposed architecture",
            "Work phases",
            "Recommended technologies",
            "Dependencies",
            "Acceptance criteria"
          ],
          valueLabel: "Value",
          value:
            "Reduces ambiguity, improves estimation and makes clear what will be built and how it will be validated."
        },
        {
          number: "03",
          title: "Modular development",
          objectiveLabel: "Goal",
          objective:
            "Build in small, reviewable blocks that can be integrated with real systems.",
          deliverablesLabel: "Deliverables",
          deliverables: [
            "Functional components",
            "Progressive integrations",
            "Useful technical documentation",
            "Technical review",
            "Change control"
          ],
          valueLabel: "Value",
          value:
            "Improves maintainability, reduces regressions and allows progress to be validated before the end of the project."
        },
        {
          number: "04",
          title: "Validation and delivery",
          objectiveLabel: "Goal",
          objective:
            "Verify that the solution works, is understandable and is ready for operation or future evolution.",
          deliverablesLabel: "Deliverables",
          deliverables: [
            "Functional tests",
            "Route and link review",
            "Validated build",
            "Remaining risks",
            "Known limits"
          ],
          valueLabel: "Value",
          value:
            "Closes the phase with evidence, not intuition, and leaves a clear base for support or future improvement."
        }
      ]
    },
    riskControls: {
      eyebrow: "Risk control",
      title: "How technical projects avoid becoming fragile.",
      text:
        "Quality does not depend only on code or PLC logic. It depends on understanding the process, documenting decisions and validating each step with clear criteria.",
      items: [
        {
          title: "Clear scope",
          text:
            "Before building, goals, limits, users, machines, data and dependencies are defined."
        },
        {
          title: "Continuous validation",
          text:
            "Each step is reviewed against acceptance criteria to detect errors before they become expensive."
        },
        {
          title: "Useful documentation",
          text:
            "Documentation is focused on real maintenance: what exists, why it was decided and how it is operated."
        }
      ]
    },
    cta: {
      title: "Do you have a process, machine or system that needs diagnostics?",
      text:
        "A technical review can clarify scope, risks, available data and realistic improvement options.",
      primaryLabel: "Request diagnostics",
      primaryRouteKey: "contact",
      secondaryLabel: "View services",
      secondaryRouteKey: "services"
    }
  },

  de: {
    hero: {
      eyebrow: "Prozess",
      title:
        "Ein technischer Ablauf, um Unsicherheit vor der Umsetzung zu reduzieren.",
      text:
        "IoCode SOLUTIONS arbeitet in Phasen, um das reale Problem zu verstehen, Risiken zu kontrollieren, Akzeptanzkriterien zu definieren und wartbare industrielle Lösungen zu liefern."
    },
    methodCard: {
      label: "Arbeitsmethode",
      title: "Diagnose → Vorschlag → Entwicklung → Validierung",
      text:
        "Jede Phase hat ein klares Ziel, konkrete Lieferobjekte und eine Aufgabe: technische Improvisation in Projekten mit Maschinen, SPS, Robotern, Daten und Software zu vermeiden.",
      flow: ["Diagnose", "Vorschlag", "Entwicklung", "Validierung"]
    },
    timeline: {
      eyebrow: "Projektphasen",
      title: "Vom operativen Problem zur überprüfbaren Lösung.",
      text:
        "Der Prozess ist darauf ausgelegt, Produktion, Instandhaltung, Engineering und Software von der ersten Analyse bis zur Übergabe auszurichten.",
      phases: [
        {
          number: "01",
          title: "Diagnose",
          objectiveLabel: "Ziel",
          objective:
            "Das reale Problem verstehen, bevor eine technische Lösung vorgeschlagen wird.",
          deliverablesLabel: "Lieferobjekte",
          deliverables: [
            "Erster Umfang",
            "Technische Risiken",
            "Betroffene Systeme",
            "Verfügbare Daten",
            "Operative Einschränkungen"
          ],
          valueLabel: "Wert",
          value:
            "Verhindert Entscheidungen auf Basis von Annahmen und priorisiert, was den Betrieb wirklich beeinflusst."
        },
        {
          number: "02",
          title: "Technischer Vorschlag",
          objectiveLabel: "Ziel",
          objective:
            "Eine tragfähige, wartbare Lösung definieren, die zur bestehenden Umgebung passt.",
          deliverablesLabel: "Lieferobjekte",
          deliverables: [
            "Vorgeschlagene Architektur",
            "Arbeitsphasen",
            "Empfohlene Technologien",
            "Abhängigkeiten",
            "Akzeptanzkriterien"
          ],
          valueLabel: "Wert",
          value:
            "Reduziert Unklarheit, verbessert die Einschätzung und macht sichtbar, was gebaut und wie es geprüft wird."
        },
        {
          number: "03",
          title: "Modulare Entwicklung",
          objectiveLabel: "Ziel",
          objective:
            "In kleinen, prüfbaren Bausteinen entwickeln, die mit realen Systemen integriert werden können.",
          deliverablesLabel: "Lieferobjekte",
          deliverables: [
            "Funktionale Komponenten",
            "Schrittweise Integrationen",
            "Nützliche technische Dokumentation",
            "Technische Prüfung",
            "Änderungskontrolle"
          ],
          valueLabel: "Wert",
          value:
            "Erhöht Wartbarkeit, reduziert Regressionen und ermöglicht Validierung vor dem Projektende."
        },
        {
          number: "04",
          title: "Validierung und Übergabe",
          objectiveLabel: "Ziel",
          objective:
            "Prüfen, ob die Lösung funktioniert, verständlich ist und für Betrieb oder Weiterentwicklung bereitsteht.",
          deliverablesLabel: "Lieferobjekte",
          deliverables: [
            "Funktionale Tests",
            "Prüfung von Routen und Links",
            "Validierter Build",
            "Verbleibende Risiken",
            "Bekannte Grenzen"
          ],
          valueLabel: "Wert",
          value:
            "Schließt die Phase mit Evidenz statt Bauchgefühl ab und schafft eine klare Basis für Support oder Weiterentwicklung."
        }
      ]
    },
    riskControls: {
      eyebrow: "Risikokontrolle",
      title: "Wie technische Projekte stabil und wartbar bleiben.",
      text:
        "Qualität hängt nicht nur von Code oder SPS-Logik ab. Entscheidend sind Prozessverständnis, dokumentierte Entscheidungen und Validierung mit klaren Kriterien.",
      items: [
        {
          title: "Klarer Umfang",
          text:
            "Vor der Umsetzung werden Ziele, Grenzen, Benutzer, Maschinen, Daten und Abhängigkeiten definiert."
        },
        {
          title: "Kontinuierliche Validierung",
          text:
            "Jeder Schritt wird gegen Akzeptanzkriterien geprüft, um Fehler früh zu erkennen."
        },
        {
          title: "Nützliche Dokumentation",
          text:
            "Dokumentation unterstützt reale Wartung: was existiert, warum es entschieden wurde und wie es betrieben wird."
        }
      ]
    },
    cta: {
      title:
        "Gibt es einen Prozess, eine Maschine oder ein System, das Diagnose benötigt?",
      text:
        "Eine technische Prüfung kann Umfang, Risiken, verfügbare Daten und realistische Verbesserungsoptionen klären.",
      primaryLabel: "Diagnose anfragen",
      primaryRouteKey: "contact",
      secondaryLabel: "Leistungen ansehen",
      secondaryRouteKey: "services"
    }
  }
};