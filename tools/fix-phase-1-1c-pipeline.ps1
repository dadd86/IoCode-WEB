$ErrorActionPreference = "Stop"

function Write-Utf8NoBom {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][string]$Content
  )

  $directory = Split-Path -Parent $Path

  if ($directory -and -not (Test-Path $directory)) {
    New-Item -ItemType Directory -Path $directory -Force | Out-Null
  }

  $encoding = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($Path, $Content, $encoding)
}

function Normalize-JsonNoBom {
  param([Parameter(Mandatory = $true)][string]$Path)

  $raw = [System.IO.File]::ReadAllText($Path, [System.Text.Encoding]::UTF8)
  $raw = $raw.TrimStart([char]0xFEFF)

  $json = $raw | ConvertFrom-Json
  $normalized = $json | ConvertTo-Json -Depth 50

  Write-Utf8NoBom $Path $normalized
}

function Add-UniqueArrayValues {
  param(
    [Parameter(Mandatory = $true)]$Object,
    [Parameter(Mandatory = $true)][string]$PropertyName,
    [Parameter(Mandatory = $true)][string[]]$Values
  )

  if (-not ($Object.PSObject.Properties.Name -contains $PropertyName)) {
    $Object | Add-Member -NotePropertyName $PropertyName -NotePropertyValue @()
  }

  $current = @($Object.$PropertyName)

  foreach ($value in $Values) {
    if ($current -notcontains $value) {
      $current += $value
    }
  }

  $Object.$PropertyName = $current
}

Write-Host "1. Normalizando package.json sin BOM..." -ForegroundColor Cyan
Normalize-JsonNoBom "package.json"

Write-Host "2. Excluyendo QA browser del astro check normal..." -ForegroundColor Cyan

$tsconfigPath = "tsconfig.json"

if (-not (Test-Path $tsconfigPath)) {
  throw "No existe tsconfig.json"
}

$tsconfigRaw = Get-Content $tsconfigPath -Raw
$tsconfig = $tsconfigRaw | ConvertFrom-Json

Add-UniqueArrayValues `
  -Object $tsconfig `
  -PropertyName "exclude" `
  -Values @(
    "tests",
    "tests/**/*",
    "playwright.config.ts",
    "qa-artifacts",
    "qa-artifacts/**/*",
    "test-results",
    "test-results/**/*",
    "playwright-report",
    "playwright-report/**/*"
  )

Write-Utf8NoBom $tsconfigPath ($tsconfig | ConvertTo-Json -Depth 50)

Write-Host "3. Corrigiendo Dockerfile.browser-qa con Playwright 1.60.0..." -ForegroundColor Cyan

Write-Utf8NoBom "Docker/Dockerfile.browser-qa" @'
# syntax=docker/dockerfile:1.7

ARG PLAYWRIGHT_VERSION=1.60.0
FROM mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-noble

ARG PLAYWRIGHT_VERSION=1.60.0

WORKDIR /app

ENV CI=1 \
    ASTRO_TELEMETRY_DISABLED=1 \
    PLAYWRIGHT_BROWSERS_PATH=/ms-playwright \
    PLAYWRIGHT_BASE_URL=http://web:8080 \
    LIGHTHOUSE_BASE_URL=http://web:8080

COPY package*.json ./

RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi \
  && npm install --no-save \
    @playwright/test@${PLAYWRIGHT_VERSION} \
    playwright@${PLAYWRIGHT_VERSION} \
    axe-core@^4.10.0 \
    lighthouse@^12.2.0 \
  && npx playwright --version

COPY . .

CMD ["npm", "run", "qa:phase-1-1c"]
'@

Write-Host "4. Asegurando build arg PLAYWRIGHT_VERSION en compose.yml..." -ForegroundColor Cyan

$composePath = "compose.yml"

if (-not (Test-Path $composePath)) {
  throw "No existe compose.yml"
}

$compose = Get-Content $composePath -Raw

if ($compose -match "PLAYWRIGHT_VERSION:") {
  $compose = $compose -replace 'PLAYWRIGHT_VERSION:\s*"?[0-9]+\.[0-9]+\.[0-9]+"?', 'PLAYWRIGHT_VERSION: "1.60.0"'
} elseif ($compose -match "dockerfile:\s*Docker/Dockerfile\.browser-qa") {
  $compose = $compose -replace "dockerfile:\s*Docker/Dockerfile\.browser-qa", "dockerfile: Docker/Dockerfile.browser-qa`r`n      args:`r`n        PLAYWRIGHT_VERSION: `"1.60.0`""
} else {
  Write-Host "No encontré el bloque browser-qa en compose.yml. Revisa manualmente el servicio browser-qa." -ForegroundColor Yellow
}

Write-Utf8NoBom $composePath $compose

Write-Host "5. Reemplazando validate-phase-1-1c.ps1 por una versión estricta..." -ForegroundColor Cyan

Write-Utf8NoBom "tools/validate-phase-1-1c.ps1" @'
$ErrorActionPreference = "Stop"

function Invoke-Checked {
  param(
    [Parameter(Mandatory = $true)][string]$Label,
    [Parameter(Mandatory = $true)][scriptblock]$Command
  )

  Write-Host ""
  Write-Host ">>> $Label" -ForegroundColor Cyan

  & $Command

  if ($LASTEXITCODE -ne 0) {
    throw "Fallo en: $Label. Exit code: $LASTEXITCODE"
  }
}

function Assert-Status {
  param(
    [Parameter(Mandatory = $true)][string]$Url,
    [Parameter(Mandatory = $true)][int]$Expected
  )

  Write-Host "HEAD $Url" -ForegroundColor DarkCyan

  $status = curl.exe -s -o NUL -w "%{http_code}" -I $Url

  if ([int]$status -ne $Expected) {
    throw "HTTP inesperado en $Url. Esperado $Expected, recibido $status"
  }
}

function Assert-RedirectLocation {
  param(
    [Parameter(Mandatory = $true)][string]$Url,
    [Parameter(Mandatory = $true)][string]$ExpectedLocation
  )

  Write-Host "HEAD redirect $Url" -ForegroundColor DarkCyan

  $headers = curl.exe -s -I $Url
  $status = ($headers | Select-String -Pattern "^HTTP/" | Select-Object -First 1).ToString()
  $location = ($headers | Select-String -Pattern "^Location:" | Select-Object -First 1).ToString()

  if ($status -notmatch "308") {
    throw "Redirect inesperado en $Url. Esperado 308. Headers: $headers"
  }

  if ($location -notmatch [regex]::Escape($ExpectedLocation)) {
    throw "Location inesperado en $Url. Esperado $ExpectedLocation. Headers: $headers"
  }
}

Write-Host "Fase 1.1C - validación técnica, QA estático, navegador, accesibilidad y Lighthouse" -ForegroundColor Cyan

Invoke-Checked "docker compose up -d dev" {
  docker compose up -d dev
}

Invoke-Checked "npm run check" {
  docker compose exec dev npm run check
}

Invoke-Checked "npm run build" {
  docker compose exec dev npm run build
}

Invoke-Checked "npm run audit:prod" {
  docker compose exec dev npm run audit:prod
}

Invoke-Checked "npm run qa:static" {
  docker compose exec dev npm run qa:static
}

Invoke-Checked "docker compose --profile prod up --build -d web" {
  docker compose --profile prod up --build -d web
}

Assert-Status "http://localhost:8080/health" 200
Assert-Status "http://localhost:8080/es/" 200
Assert-Status "http://localhost:8080/en/" 200
Assert-Status "http://localhost:8080/de/" 200
Assert-Status "http://localhost:8080/es/proceso/" 200
Assert-Status "http://localhost:8080/en/process/" 200
Assert-Status "http://localhost:8080/de/prozess/" 200
Assert-Status "http://localhost:8080/es/contacto/" 200
Assert-Status "http://localhost:8080/en/contact/" 200
Assert-Status "http://localhost:8080/de/kontakt/" 200
Assert-Status "http://localhost:8080/sitemap.xml" 200
Assert-Status "http://localhost:8080/robots.txt" 200
Assert-Status "http://localhost:8080/no-existe/" 404
Assert-RedirectLocation "http://localhost:8080/es/proceso" "/es/proceso/"

Invoke-Checked "docker compose --profile prod --profile qa build --no-cache browser-qa" {
  docker compose --profile prod --profile qa build --no-cache browser-qa
}

Invoke-Checked "docker compose --profile prod --profile qa run --rm browser-qa" {
  docker compose --profile prod --profile qa run --rm browser-qa
}

Write-Host ""
Write-Host "Fase 1.1C validada correctamente." -ForegroundColor Green
'@

Write-Host "6. Limpiando artefactos QA anteriores..." -ForegroundColor Cyan

$pathsToClean = @(
  "qa-artifacts",
  "test-results",
  "playwright-report"
)

foreach ($path in $pathsToClean) {
  if (Test-Path $path) {
    Remove-Item $path -Recurse -Force
  }
}

Write-Host ""
Write-Host "Corrección Fase 1.1C-Fix-2 aplicada." -ForegroundColor Green
Write-Host "Ejecuta ahora: powershell -ExecutionPolicy Bypass -File tools\validate-phase-1-1c.ps1" -ForegroundColor Cyan

