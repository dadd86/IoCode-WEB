# Checklist de Google Search Console

| Bloque | Descripción | Ámbito | Idiomas afectados | Origen de datos | Última verificación |
|---|---|---|---|---|---|
| A | Alta, indexación y seguimiento de la propiedad de dominio | SEO técnico de producción | ES, EN, DE | Google Search Console, DNS público, sitemap y robots | 2026-08-01 |

## Propiedad recomendada

Crear una propiedad de dominio `iocode-solutions.com`; cubre HTTP/HTTPS y todas las variantes/subdominios. Copiar el valor TXT entregado por Search Console al proveedor DNS con nombre `@`, TTL 300 durante la validación y 3600 después. El token real no se guarda en Git, capturas públicas ni logs de CI.

La etiqueta HTML solo se usa como alternativa temporal para una propiedad de prefijo URL. Si se elige, el valor se suministra mediante una variable protegida y se retira al migrar a verificación DNS. No se codifica un token de ejemplo en producción.

## Antes de publicar

- `PUBLIC_DEPLOY_ENV=preview`: páginas y `robots.txt` deben emitir `noindex`/`Disallow: /`.
- Confirmar que el dominio preview no aparece en canonicals, OG, Twitter ni sitemap del artefacto productivo.
- Verificar que la identidad §5 DDG y el aviso de privacidad versionados en `src/data/legal-profile.ts` y `src/data/legal.ts` siguen reflejando los datos aprobados; `config/privacy-governance.json` debe declarar `controllerApproval: "approved"`.
- Ejecutar build, `internal:qa:config:prod`, `internal:qa:phase-9b:static`, Playwright/Axe y Lighthouse.
- Verificar que `/sitemap-index.xml` referencia exclusivamente `https://iocode-solutions.com/sitemap.xml`.

## Publicación y envío

1. Publicar DNS/TLS y validar redirecciones HTTP/www al apex HTTPS.
2. Ejecutar el smoke post-deploy y confirmar respuestas 200 para ES, EN, DE, robots y ambos sitemaps.
3. Validar la propiedad de dominio por TXT.
4. En “Sitemaps”, enviar `https://iocode-solutions.com/sitemap-index.xml`.
5. Inspeccionar una portada y una ruta interna por idioma; solicitar indexación solo después de canonical/hreflang correcto.
6. Registrar fecha, operador, release SHA y resultado en el ticket privado de release.

## Seguimiento posterior

Revisar tras 24–72 horas cobertura/indexación, duplicados con canonical alternativo, páginas excluidas, HTTPS y Core Web Vitals. Revisar semanalmente el primer mes y después mensualmente. No forzar indexación de previews, 404, healthchecks ni URLs con parámetros técnicos.

## Comandos externos

```sh
dig TXT iocode-solutions.com +short
curl -fsSI https://iocode-solutions.com/es/
curl -fsS https://iocode-solutions.com/robots.txt
curl -fsS https://iocode-solutions.com/sitemap-index.xml
curl -fsS https://iocode-solutions.com/sitemap.xml
```
