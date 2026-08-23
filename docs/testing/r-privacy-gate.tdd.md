# G-01 — Gate de privacidad del repositorio

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| R-PRIVACIDAD / G-01 | Prevención S0 de datos privados en fuentes y artefactos | Repositorio, configuración y `dist/` | ES, EN, DE | Clasificación aprobada por el titular y `tools/qa-privacy-gate.mjs` | 2026-08-23 |

## Contrato

El gate falla antes de Astro cuando encuentra una dirección alemana distinta de la dirección pública de servicio, un identificador fiscal privado etiquetado, correo de proveedor personal, número estructural de cliente, IPv4 susceptible de ser endpoint o nombre de PDF contractual/identitario. Una segunda capa compara una lista exacta que nunca se versiona: localmente se lee desde `tools/private-denylist.txt`; CI la recibe mediante el secreto `PRIVACY_DENYLIST_CONTENT`.

El secreto debe ser texto UTF-8 multilínea, con un token exacto por línea. Se ignoran líneas vacías y espacios exteriores. No debe contener comentarios, encabezados ni separadores. CI establece `PRIVACY_DENYLIST_REQUIRED=1`: si el secreto falta o queda vacío, el gate falla expresamente con `EXACT_DENYLIST_MISSING` antes del build.

Se escanean `src/`, `docs/`, `config/`, `tools/`, `tests/`, `public/`, las tres plantillas de entorno, `package.json`, `compose.yml`, `Docker/` y `dist/` cuando existe. El gate sólo informa identificador de regla y ruta: no imprime el valor detectado.

## Fixtures obligatorios

| Caso | Clase | Resultado esperado |
|---|---|---|
| Dirección sintética con calle y código postal alemán distinto del público | Positivo | Falla `GERMAN_PRIVATE_ADDRESS` |
| Identificador fiscal privado sintético etiquetado | Positivo | Falla `PRIVATE_TAX_IDENTIFIER` |
| Buzón sintético de proveedor personal | Positivo | Falla `PERSONAL_EMAIL` |
| Dirección pública de servicio | Negativo | Pasa |
| USt-IdNr. pública | Negativo | Pasa |
| Correo corporativo público | Negativo | Pasa |

Los tres positivos se conservan codificados en el test y sólo se materializan en memoria. Así se prueba el detector sin añadir al repositorio una muestra reutilizable como dato real.

## Análisis de falsos positivos IPv4

El patrón IPv4 no es un juicio suficiente. La clasificación incorpora estas exclusiones verificables:

- `0.0.0.0`: dirección de bind; no identifica un servidor público.
- `127.0.0.1` y todo `127.0.0.0/8`: loopback.
- `192.0.2.0/24`, `198.51.100.0/24` y `203.0.113.0/24`: rangos reservados para documentación.
- Secuencias de cuatro grupos iniciadas por cero dentro de contexto explícito de versión/dependencia, como `0.184.0.0`: número de versión, no endpoint.

Una IPv4 válida fuera de esas excepciones falla. Los rangos privados no se excluyen: pueden revelar inventario interno y requieren revisión.

## Ejecución

```powershell
npm run internal:qa:privacy
node --test tests/unit/privacy-gate.test.mjs
```

En CI, `PRIVACY_DENYLIST_REQUIRED=1` convierte la ausencia del secreto en fallo. La lista local está cubierta por `.gitignore` y el propio gate la excluye de su recorrido.
