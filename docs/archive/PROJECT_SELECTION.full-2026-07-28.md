# PROJECT_SELECTION.md

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| R2 | Criterios editoriales para seleccionar proyectos públicos | Contenido y portafolio | ES, EN, DE | `src/data/projects.ts` y política editorial existente | 2026-07-28 |

Guía de selección de proyectos para IoCode SOLUTIONS Web.

## 1. Propósito

Este documento define los criterios para decidir qué proyectos deben aparecer en la web de IoCode SOLUTIONS.

La web no debe funcionar como una lista genérica de proyectos ni como un blog. Debe presentar una selección profesional, clara y estratégica que refuerce el posicionamiento técnico:

```text
Software + Automatización PLC + Robótica Industrial + Industria 4.0 + Datos
```

El objetivo no es mostrar muchos proyectos. El objetivo es mostrar proyectos que aporten evidencia de capacidad técnica, criterio profesional, madurez, seguridad y valor para potenciales clientes.

## 2. Principio principal

No se publica un proyecto solo porque exista.

Un proyecto debe entrar en la web si ayuda a demostrar al menos una de estas capacidades:

* resolver problemas técnicos reales;
* diseñar software mantenible;
* integrar sistemas industriales;
* trabajar con PLC, HMI, robots o comunicaciones industriales;
* estructurar datos, backend o bases de datos;
* crear aplicaciones útiles;
* documentar arquitectura;
* explicar decisiones técnicas;
* demostrar criterio profesional;
* generar confianza comercial.

## 3. Qué no debe ser la sección de proyectos

La sección de proyectos no debe ser:

* una lista larga sin criterio;
* una colección de pruebas sueltas;
* una copia del GitHub completo;
* una vitrina de repos incompletos sin explicación;
* una página tipo blog;
* una promesa comercial sin evidencia;
* una exposición de proyectos privados o sensibles;
* una lista de tecnologías sin contexto;
* una demostración visual sin valor técnico.

## 4. Tipos de proyectos permitidos

La web puede incluir estos tipos de proyectos:

| Tipo                             | Uso                                                 |
| -------------------------------- | --------------------------------------------------- |
| Proyecto público                 | Repositorio o demo pública revisable                |
| Caso privado anonimizado         | Proyecto real o técnico sin datos sensibles         |
| Caso conceptual                  | Diseño técnico o prototipo explicable               |
| Proyecto interno                 | Herramienta propia de IoCode SOLUTIONS              |
| Proyecto industrial              | PLC, robótica, HMI, comunicaciones o automatización |
| Proyecto software                | Web, backend, Android, datos o arquitectura         |
| Proyecto IoT / Industria 4.0     | Sensores, datos, integración física-digital         |
| Proyecto de aprendizaje avanzado | Solo si demuestra calidad y está bien delimitado    |

## 5. Tipos de proyectos no permitidos

No se deben publicar proyectos que contengan:

* secretos;
* tokens;
* claves API;
* `.env`;
* credenciales;
* datos reales de clientes;
* nombres de empresas sin permiso;
* rutas internas;
* capturas con información sensible;
* código privado;
* contratos;
* documentación confidencial;
* repositorios privados enlazados;
* datos personales innecesarios;
* claims no verificables;
* métricas inventadas;
* resultados de IA o ML sin validación;
* automatización industrial con información sensible de planta o cliente.

## 6. Clasificación de visibilidad

Cada proyecto debe clasificarse antes de publicarse.

### 6.1 Público

Proyecto que puede mostrar:

* nombre;
* descripción;
* tecnologías;
* repositorio público;
* demo si existe;
* capturas si no contienen datos sensibles;
* decisiones técnicas;
* limitaciones.

Ejemplo:

```text
TechWizards
```

### 6.2 Privado anonimizado

Proyecto que puede mostrar:

* descripción general;
* problema resuelto;
* tecnologías usadas;
* valor profesional;
* aprendizajes;
* arquitectura general;
* limitaciones públicas.

No puede mostrar:

* cliente;
* código;
* capturas internas;
* repositorio;
* datos;
* credenciales;
* rutas;
* detalles de seguridad o producción.

Ejemplos:

```text
NeuronaPrediccion
MacetaInteligente
Casos de PLC / robótica industrial
```

### 6.3 Interno

Proyecto propio de IoCode SOLUTIONS.

Puede mostrar más información, pero debe revisarse igual:

* no publicar secretos;
* no publicar `.env`;
* no publicar datos privados;
* no publicar rutas internas innecesarias.

Ejemplo:

```text
IoCode SOLUTIONS Web
```

## 7. Criterios de selección

Cada proyecto debe evaluarse con estos criterios.

| Criterio                 | Pregunta                                                                   |
| ------------------------ | -------------------------------------------------------------------------- |
| Valor profesional        | ¿Ayuda a conseguir clientes o demostrar capacidad real?                    |
| Relevancia técnica       | ¿Está alineado con software, PLC, robótica, datos o Industria 4.0?         |
| Evidencia                | ¿Se puede demostrar con código, demo, documentación o explicación técnica? |
| Madurez                  | ¿Tiene estructura suficiente para enseñarse?                               |
| Seguridad                | ¿No expone datos sensibles ni repos privados?                              |
| Claridad                 | ¿Se puede explicar en menos de 2 minutos?                                  |
| Diferenciación           | ¿Marca diferencia frente a un portafolio genérico?                         |
| Mantenibilidad           | ¿Está ordenado, documentado o puede documentarse?                          |
| Honestidad               | ¿No exagera su alcance ni estado real?                                     |
| Compatibilidad comercial | ¿Refuerza la imagen de IoCode SOLUTIONS?                                   |

## 8. Sistema de puntuación

Antes de publicar un proyecto, puntuarlo del 0 al 5 en cada criterio.

| Puntuación | Significado         |
| ---------- | ------------------- |
| 0          | No cumple           |
| 1          | Muy débil           |
| 2          | Aceptable con dudas |
| 3          | Bueno               |
| 4          | Muy bueno           |
| 5          | Excelente           |

### 8.1 Tabla de evaluación

| Criterio               | Peso | Puntuación |     Total |
| ---------------------- | ---: | ---------: | --------: |
| Valor profesional      |  20% |        0-5 | Pendiente |
| Relevancia técnica     |  20% |        0-5 | Pendiente |
| Evidencia disponible   |  15% |        0-5 | Pendiente |
| Seguridad / privacidad |  15% |        0-5 | Pendiente |
| Claridad comercial     |  10% |        0-5 | Pendiente |
| Diferenciación         |  10% |        0-5 | Pendiente |
| Madurez técnica        |  10% |        0-5 | Pendiente |

### 8.2 Decisión

| Resultado | Acción                                |
| --------- | ------------------------------------- |
| 4.0 - 5.0 | Publicable si pasa seguridad y QA     |
| 3.0 - 3.9 | Publicable con mejoras                |
| 2.0 - 2.9 | Mantener como borrador o caso interno |
| 0.0 - 1.9 | No publicar                           |

Regla: aunque un proyecto tenga buena puntuación, queda bloqueado si falla seguridad o privacidad.

## 9. Proyectos recomendados para la web actual

### 9.1 TechWizards

Tipo:

```text
Proyecto público / aplicación Android
```

Uso recomendado:

* demostrar capacidad de desarrollo Android;
* mostrar arquitectura de aplicación;
* mostrar documentación;
* mostrar uso de Kotlin;
* mostrar persistencia local o estructura modular si aplica.

Puede publicarse si:

* el repositorio es público;
* no contiene secretos;
* no contiene datos sensibles;
* README está presentable;
* no se vende como producto terminado si no lo es.

Riesgo:

```text
No presentarlo como app final validada en producción si no hay evidencia.
```

### 9.2 NeuronaPrediccion

Tipo:

```text
Caso privado / datos / ML / arquitectura
```

Uso recomendado:

* demostrar modelado de datos;
* YAML-first;
* SQL;
* DAO;
* trazabilidad;
* arquitectura por capas;
* pensamiento analítico.

Puede publicarse como caso privado si:

* no se enlaza repositorio privado;
* no se publican datos sensibles;
* no se prometen predicciones precisas sin métricas reproducibles;
* se describe como arquitectura, modelado o caso técnico.

Riesgo:

```text
No prometer rendimiento predictivo ni precisión financiera sin validación reproducible.
```

### 9.3 MacetaInteligente

Tipo:

```text
Caso privado / IoT / sensores / automatización
```

Uso recomendado:

* reforzar perfil híbrido físico-digital;
* demostrar integración de sensores;
* explicar captura de datos;
* conectar IoT con automatización y software.

Puede publicarse si:

* se anonimiza;
* no se exponen datos privados;
* no se muestran credenciales ni endpoints;
* se explica como caso técnico o prototipo.

Riesgo:

```text
No presentarlo como producto industrial certificado si no lo es.
```

### 9.4 IoCode SOLUTIONS Web

Tipo:

```text
Proyecto interno / web profesional / Astro / Docker / i18n / 3D
```

Uso recomendado:

* demostrar arquitectura web moderna;
* mostrar SEO multidioma;
* mostrar Docker;
* mostrar documentación;
* mostrar diseño profesional;
* mostrar integración Three.js.

Puede publicarse como proyecto interno si:

* no se incluye `.env`;
* no se incluye `.git`;
* no se publica `node_modules`;
* pasa QA;
* el logo 3D funciona;
* la documentación está actualizada.

Riesgo:

```text
No afirmar producción real hasta completar QA y revisión en hosting final.
```

### 9.5 Casos PLC / Robótica Industrial

Tipo:

```text
Caso privado anonimizado / automatización industrial
```

Uso recomendado:

* demostrar experiencia industrial;
* separar PLC y robótica como áreas clave;
* explicar tipos de problemas resueltos;
* reforzar credibilidad técnica.

Puede publicarse si:

* no se menciona cliente sin permiso;
* no se muestran pantallas HMI reales sensibles;
* no se publica código PLC de cliente;
* no se muestran IPs, rutas, tags privados o layouts de planta;
* se presenta como experiencia o caso anonimizado.

Riesgo:

```text
La automatización industrial puede contener información sensible de procesos, seguridad o producción. Revisar antes de publicar.
```

## 10. Estructura recomendada de cada proyecto

Cada proyecto debe tener esta estructura pública:

```text
Título
Categoría
Tipo de visibilidad
Resumen
Problema
Solución
Tecnologías
Valor profesional
Estado real
Limitaciones
Enlace público si existe
Cautela de seguridad si aplica
```

## 11. Modelo de datos recomendado

En `src/data/projects.ts`, cada proyecto debería seguir una estructura similar:

```ts
export type ProjectVisibility = "public" | "private-case" | "internal";

export type ProjectCategory =
  | "web"
  | "android"
  | "backend"
  | "database"
  | "automation"
  | "plc"
  | "robotics"
  | "iot"
  | "data"
  | "ml"
  | "industry40";

export type ProjectStatus =
  | "published"
  | "in-progress"
  | "prototype"
  | "private"
  | "case-study";

export type Project = {
  title: string;
  category: ProjectCategory;
  visibility: ProjectVisibility;
  status: ProjectStatus;
  featured: boolean;
  summary: string;
  problem: string;
  solution: string;
  value: string;
  caution?: string;
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
};
```

## 12. Reglas para `githubUrl`

Solo se permite `githubUrl` si:

* el repositorio es público;
* no contiene secretos;
* no contiene datos sensibles;
* tiene README mínimo;
* el código no expone información privada;
* el proyecto se puede defender técnicamente.

No usar `githubUrl` para:

* repos privados;
* repos de clientes;
* repos incompletos sin contexto;
* pruebas rotas;
* código con credenciales;
* código que no quieres que un cliente revise.

## 13. Reglas para `demoUrl`

Solo se permite `demoUrl` si:

* la demo funciona;
* no tiene errores críticos;
* no expone datos sensibles;
* no permite acciones inseguras;
* no promete backend si no existe;
* está alineada con la descripción del proyecto.

No enlazar demos rotas.

## 14. Reglas para proyectos privados

Los proyectos privados deben usar:

```ts
visibility: "private-case"
```

y no deben tener:

```ts
githubUrl
demoUrl
```

salvo que exista una demo pública segura.

Ejemplo:

```ts
{
  title: "Caso privado de automatización PLC",
  visibility: "private-case",
  status: "case-study",
  summary: "Caso anonimizado de diagnóstico y mejora de automatización industrial.",
  caution: "No se publica código PLC, cliente, capturas internas ni datos de planta."
}
```

## 15. Categorías recomendadas para la web

La web debe agrupar proyectos por valor profesional, no solo por tecnología.

Categorías recomendadas:

| Categoría            | Uso                                 |
| -------------------- | ----------------------------------- |
| Software profesional | Web, backend, arquitectura, Android |
| Automatización PLC   | PLC, HMI, comunicaciones            |
| Robótica industrial  | Robots, manipulación, motion        |
| Industria 4.0 / IoT  | Sensores, datos, integración        |
| Datos y arquitectura | SQL, YAML, DAO, trazabilidad        |
| Proyectos internos   | Web IoCode, herramientas propias    |

## 16. Orden recomendado en la web

No ordenar solo por fecha. Ordenar por impacto estratégico.

Orden recomendado:

1. IoCode SOLUTIONS Web.
2. TechWizards.
3. Caso PLC / automatización.
4. Caso robótica industrial.
5. NeuronaPrediccion.
6. MacetaInteligente.

Este orden puede cambiar si un proyecto gana evidencia, demo, documentación o valor comercial.

## 17. Cuándo destacar un proyecto

Un proyecto puede tener:

```ts
featured: true
```

solo si cumple al menos cuatro condiciones:

* está alineado con el posicionamiento de IoCode;
* se puede explicar bien;
* tiene evidencia suficiente;
* no expone riesgos de seguridad;
* está documentado;
* aporta diferenciación;
* puede interesar a clientes potenciales.

No marcar demasiados proyectos como destacados.

Recomendación:

```text
Máximo 3 a 5 proyectos destacados.
```

## 18. Cómo redactar un proyecto

### Buen enfoque

```text
Aplicación Android estructurada con arquitectura modular, persistencia local y separación de responsabilidades. El proyecto demuestra capacidad para organizar una app mantenible y documentada.
```

### Mal enfoque

```text
App increíble, completa, perfecta y lista para producción.
```

Motivo:

* exagera;
* no aporta evidencia;
* puede generar desconfianza.

## 19. Lenguaje recomendado

Usar lenguaje:

* claro;
* sobrio;
* profesional;
* técnico;
* verificable;
* sin exageración.

Evitar:

* “perfecto”;
* “revolucionario”;
* “100% seguro”;
* “garantizado”;
* “producción” sin evidencia;
* “IA avanzada” sin explicación;
* “predicción exacta” sin métricas.

## 20. Claims permitidos y no permitidos

### Permitidos si son ciertos

```text
Arquitectura modular
Separación de responsabilidades
Caso privado anonimizado
Prototipo técnico
Aplicación en evolución
Integración de sensores
Desarrollo orientado a mantenimiento
Web estática multidioma
Docker para entorno reproducible
```

### No permitidos sin evidencia

```text
Producción certificada
100% seguro
Predicción precisa garantizada
Escalable a millones de usuarios
Cumplimiento normativo garantizado
Integración industrial certificada
Sistema validado en planta
Aplicación comercial final
```

## 21. Checklist antes de añadir un proyecto

```text
[ ] Tiene categoría clara
[ ] Tiene visibilidad definida
[ ] Tiene estado real definido
[ ] Tiene resumen profesional
[ ] Explica problema y solución
[ ] Lista tecnologías relevantes
[ ] Explica valor profesional
[ ] No contiene secretos
[ ] No contiene datos sensibles
[ ] No enlaza repos privados
[ ] No exagera claims
[ ] Existe en español
[ ] Existe en inglés
[ ] Existe en alemán
[ ] Pasa revisión visual
[ ] Pasa QA
```

## 22. Checklist de seguridad por proyecto

```text
[ ] Sin .env
[ ] Sin tokens
[ ] Sin API keys
[ ] Sin contraseñas
[ ] Sin datos personales innecesarios
[ ] Sin datos de clientes
[ ] Sin capturas sensibles
[ ] Sin rutas internas
[ ] Sin IPs internas
[ ] Sin tags PLC privados
[ ] Sin nombres de empresa sin permiso
[ ] Sin repos privados enlazados
[ ] Sin dumps
[ ] Sin logs
[ ] Sin backups
```

## 23. Checklist de calidad técnica

```text
[ ] El proyecto se puede explicar claramente
[ ] Tiene estructura mínima
[ ] Tiene documentación o puede documentarse
[ ] Las tecnologías están justificadas
[ ] El estado real está claro
[ ] Las limitaciones están claras
[ ] No hay promesas sin evidencia
[ ] El proyecto refuerza IoCode SOLUTIONS
[ ] El proyecto no parece relleno
```

## 24. Checklist de contenido multidioma

```text
[ ] Título revisado en ES
[ ] Título revisado en EN
[ ] Título revisado en DE
[ ] Resumen revisado en ES
[ ] Resumen revisado en EN
[ ] Resumen revisado en DE
[ ] Valor profesional revisado en ES
[ ] Valor profesional revisado en EN
[ ] Valor profesional revisado en DE
[ ] Cautelas traducidas correctamente
[ ] No hay mezcla accidental de idiomas
```

## 25. Cómo añadir un proyecto a la web

1. Evaluar el proyecto con esta guía.
2. Decidir si es público, privado anonimizado o interno.
3. Revisar seguridad.
4. Redactar contenido en español.
5. Traducir o adaptar a inglés.
6. Traducir o adaptar a alemán.
7. Añadir a `src/data/projects.ts`.
8. Revisar en `/es/proyectos/`.
9. Revisar en `/en/projects/`.
10. Revisar en `/de/projekte/`.
11. Ejecutar QA.
12. Revisar visualmente.
13. Confirmar que no hay enlaces privados.

## 26. Cómo retirar un proyecto

Retirar un proyecto si:

* está obsoleto;
* ya no representa el nivel actual;
* expone riesgo;
* contiene información dudosa;
* no se puede explicar bien;
* distrae del posicionamiento;
* parece relleno;
* está roto;
* tiene enlaces muertos;
* contiene claims no justificables.

Pasos:

1. Eliminar o marcar como no visible en `src/data/projects.ts`.
2. Revisar página de proyectos.
3. Revisar traducciones.
4. Ejecutar QA.
5. Revisar que no queden enlaces rotos.
6. Documentar si era un proyecto destacado.

## 27. Cómo mejorar un proyecto antes de publicarlo

Mejoras recomendadas:

* añadir README;
* limpiar estructura;
* eliminar secretos;
* añadir capturas seguras;
* añadir diagrama simple;
* explicar arquitectura;
* explicar problema y solución;
* añadir limitaciones;
* añadir pruebas si aplica;
* revisar nombres;
* preparar demo segura;
* separar lo privado de lo público.

## 28. Proyectos y SEO

Cada proyecto debe ayudar al SEO temático de la web.

Temas estratégicos:

```text
software development
industrial automation
PLC programming
industrial robotics
Industry 4.0
IoT
backend
databases
Android development
automation engineering
```

En español:

```text
desarrollo software
automatización industrial
programación PLC
robótica industrial
Industria 4.0
IoT
backend
bases de datos
desarrollo Android
ingeniería de automatización
```

En alemán:

```text
Softwareentwicklung
industrielle Automatisierung
SPS-Programmierung
Industrierobotik
Industrie 4.0
IoT
Backend
Datenbanken
Android-Entwicklung
Automatisierungstechnik
```

No forzar keywords de forma artificial.

## 29. Relación con la marca IoCode SOLUTIONS

Un proyecto debe reforzar al menos una de estas ideas:

* ingeniería práctica;
* software mantenible;
* criterio industrial;
* automatización real;
* integración entre mundo físico y digital;
* datos y trazabilidad;
* documentación profesional;
* enfoque serio y seguro.

Si un proyecto no refuerza ninguna, probablemente no debe estar en la web.

## 30. Relación con servicios

Cada proyecto debería conectarse con uno o varios servicios:

| Servicio        | Proyecto relacionado         |
| --------------- | ---------------------------- |
| Desarrollo web  | IoCode SOLUTIONS Web         |
| Android         | TechWizards                  |
| Backend / datos | NeuronaPrediccion            |
| PLC             | Casos de automatización      |
| Robótica        | Casos de robótica industrial |
| IoT             | MacetaInteligente            |
| Industria 4.0   | PLC + IoT + datos            |

## 31. Riesgos específicos por tipo de proyecto

### PLC / Automatización

Riesgos:

* código propietario;
* procesos industriales sensibles;
* seguridad de planta;
* nombres de cliente;
* IPs;
* tags;
* capturas HMI;
* layout de líneas.

Mitigación:

* anonimizar;
* no publicar código;
* usar diagramas genéricos;
* no publicar capturas reales sin permiso.

### Robótica

Riesgos:

* layout de célula;
* parámetros de seguridad;
* procesos productivos;
* marcas o clientes;
* rutinas propietarias.

Mitigación:

* describir capacidades generales;
* no publicar programas reales de cliente;
* no mostrar zonas de seguridad o layouts confidenciales.

### Datos / ML

Riesgos:

* datos sensibles;
* claims de precisión;
* predicciones no reproducibles;
* uso financiero o industrial sin validación.

Mitigación:

* hablar de arquitectura y trazabilidad;
* no prometer precisión;
* publicar métricas solo si son reproducibles.

### Web / Android

Riesgos:

* secretos en repos;
* dependencias vulnerables;
* demos rotas;
* formularios inseguros;
* claims de producción sin evidencia.

Mitigación:

* QA;
* audit;
* documentación;
* no exponer `.env`;
* aclarar estado real.

## 32. Plantilla de evaluación de proyecto

```md
# Evaluación de proyecto

## Nombre

Pendiente.

## Tipo

- [ ] Público
- [ ] Privado anonimizado
- [ ] Interno

## Categoría

- [ ] Web
- [ ] Android
- [ ] Backend
- [ ] Base de datos
- [ ] PLC
- [ ] Robótica
- [ ] IoT
- [ ] Datos / ML
- [ ] Industria 4.0

## Estado

- [ ] Publicado
- [ ] En evolución
- [ ] Prototipo
- [ ] Caso privado
- [ ] Caso de estudio

## Valor profesional

Pendiente.

## Evidencia disponible

- [ ] Código público
- [ ] Demo
- [ ] Documentación
- [ ] Capturas seguras
- [ ] Diagrama
- [ ] Caso explicable

## Riesgos

Pendiente.

## Decisión

- [ ] Publicar
- [ ] Publicar con cautela
- [ ] Mejorar antes de publicar
- [ ] No publicar
```

## 33. Criterios de rechazo inmediato

Rechazar un proyecto si:

* contiene secretos;
* contiene datos de cliente;
* contiene código privado no autorizado;
* enlaza repos privados;
* no puede explicarse;
* no tiene valor profesional;
* está roto;
* contradice el posicionamiento;
* exagera capacidades;
* expone riesgos industriales;
* usa datos sensibles;
* no puede traducirse correctamente;
* genera dudas de confidencialidad.

## 34. Proyectos destacados máximos

Recomendación:

```text
3 a 5 proyectos destacados
```

Más de eso puede diluir el mensaje.

Los proyectos no destacados pueden seguir existiendo en una lista secundaria si aportan valor.

## 35. Revisión periódica

Revisar la sección de proyectos cada:

```text
3 meses
```

o cuando ocurra alguno de estos eventos:

* nuevo proyecto relevante;
* cambio importante de tecnología;
* mejora de documentación;
* proyecto antiguo queda obsoleto;
* se publica nuevo repositorio;
* se detecta riesgo de privacidad;
* se cambia el posicionamiento comercial;
* se actualiza LinkedIn o CV.

## 36. QA al cambiar proyectos

Después de modificar `src/data/projects.ts`:

```powershell
docker compose --profile qa build --no-cache qa
docker compose --profile qa run --rm qa
```

Revisar:

```text
/es/proyectos/
/en/projects/
/de/projekte/
```

Validar:

* cards;
* enlaces;
* textos;
* tecnologías;
* responsive;
* seguridad;
* traducciones.

## 37. No-go de selección de proyectos

No publicar cambios en proyectos si:

* hay repos privados enlazados;
* hay datos sensibles;
* falta traducción en algún idioma;
* hay claims exagerados;
* hay enlaces rotos;
* falla QA;
* el proyecto no refuerza IoCode SOLUTIONS;
* no se ha revisado visualmente la página de proyectos;
* no se ha revisado seguridad.

## 38. Resumen

La selección de proyectos debe ser estratégica.

El objetivo no es mostrar todo lo hecho, sino mostrar lo que mejor demuestra:

```text
criterio técnico + capacidad real + seguridad + claridad comercial + diferenciación
```

La fuente de verdad para proyectos es:

```text
src/data/projects.ts
```

No se debe añadir ningún proyecto a la web sin pasar por esta guía.

```
```
