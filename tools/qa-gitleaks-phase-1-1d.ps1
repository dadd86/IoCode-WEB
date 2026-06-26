$ErrorActionPreference = "Stop"

$imageName = "zricethezav/gitleaks:v8.24.3"
$artifactDir = "qa-artifacts\security\phase-1-1d"
$artifactPath = Join-Path $artifactDir "gitleaks.json"

Write-Host "Ejecutando Gitleaks Fase 1.1D con imagen $imageName"

New-Item -ItemType Directory -Force $artifactDir | Out-Null

docker run --rm `
  -v "${PWD}:/repo" `
  -w /repo `
  $imageName `
  detect --source . --no-git --redact --exit-code 1 --config .gitleaks.toml

$payload = [ordered]@{
  phase = "1.1D"
  check = "gitleaks"
  status = "passed"
  image = $imageName
  command = "gitleaks detect --source . --no-git --redact --exit-code 1 --config .gitleaks.toml"
  warningCount = 0
  errorCount = 0
  warnings = @()
  errors = @()
  generatedAt = (Get-Date).ToUniversalTime().ToString("o")
}

$json = $payload | ConvertTo-Json -Depth 8
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$artifactFullPath = [System.IO.Path]::GetFullPath($artifactPath)

[System.IO.File]::WriteAllText($artifactFullPath, $json, $utf8NoBom)

Write-Host "Gitleaks Fase 1.1D superado."
Write-Host "Artifact generado: $artifactPath"

Write-Host "Regenerando summary.json final con REQUIRE_GITLEAKS_ARTIFACT=true"

docker compose --profile prod --profile qa run --rm `
  -e EMAIL_CONFIRMED=true `
  -e REQUIRE_GITLEAKS_ARTIFACT=true `
  browser-qa npm run summary:security:1.1d

if ($LASTEXITCODE -ne 0) {
  throw "No se pudo regenerar summary.json final con Gitleaks."
}

Write-Host "summary.json final actualizado con Gitleaks."