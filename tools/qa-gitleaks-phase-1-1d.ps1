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
  generatedAt = (Get-Date).ToUniversalTime().ToString("o")
}

$payload | ConvertTo-Json -Depth 8 | Set-Content -Path $artifactPath -Encoding UTF8

Write-Host "Gitleaks Fase 1.1D superado."
Write-Host "Artifact generado: $artifactPath"