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

Write-Host "Fase 1.1C - validaciÃ³n tÃ©cnica, QA estÃ¡tico, navegador, accesibilidad y Lighthouse" -ForegroundColor Cyan

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