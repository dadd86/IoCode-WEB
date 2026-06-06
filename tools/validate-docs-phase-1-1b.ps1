$ErrorActionPreference = "Stop"

$forbiddenPatterns = @(
  "Docker/compose\.yml",
  "Docker/\.env",
  "/healthz",
  "healthz",
  "--env-file Docker",
  "compose -f Docker"
)

$includedExtensions = @(".md", ".json", ".yml", ".yaml")
$excludedDirectories = @("\.git\", "\node_modules\", "\dist\", "\.astro\")

$files = Get-ChildItem -Recurse -File | Where-Object {
  $path = $_.FullName
  $extension = $_.Extension.ToLowerInvariant()

  if ($includedExtensions -notcontains $extension) {
    return $false
  }

  foreach ($excluded in $excludedDirectories) {
    if ($path -like "*$excluded*") {
      return $false
    }
  }

  return $true
}

$matches = @()

foreach ($pattern in $forbiddenPatterns) {
  $result = $files | Select-String -Pattern $pattern -AllMatches
  if ($result) {
    $matches += $result
  }
}

if ($matches.Count -gt 0) {
  Write-Host "Se encontraron referencias obsoletas:" -ForegroundColor Red
  $matches | ForEach-Object {
    Write-Host "$($_.Path):$($_.LineNumber): $($_.Line)" -ForegroundColor Yellow
  }
  exit 1
}

$requiredFiles = @(
  "README.md",
  "RUN_GUIDE.md",
  "SECURITY.md",
  "QA_CHECKLIST.md",
  "Docker/README.md",
  "Docker/OPERATIONS.md",
  "Docker/SECURITY_NOTES.md",
  "docs/index.md",
  "docs/ARCHITECTURE.md",
  "docs/MAINTENANCE.md",
  "docs/MIGRATION_FROM_STATIC_HTML.md"
)

foreach ($file in $requiredFiles) {
  if (-not (Test-Path $file)) {
    Write-Host "Falta documento requerido: $file" -ForegroundColor Red
    exit 1
  }
}

Write-Host "DocumentaciÃ³n Fase 1.1B validada: sin referencias obsoletas bloqueantes." -ForegroundColor Green