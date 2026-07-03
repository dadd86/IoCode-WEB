$ErrorActionPreference = "Stop"

$ProjectName = "IoCode-WEB"
$Root = Resolve-Path "."
$ReleaseDir = Join-Path $Root "releases"
$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$OutputZip = Join-Path $ReleaseDir "$ProjectName-source-$Timestamp.zip"
$TempDir = Join-Path $env:TEMP "$ProjectName-source-$Timestamp"

$ExcludedDirectories = @(
  ".git",
  "node_modules",
  "dist",
  ".astro",
  ".output",
  ".cache",
  "qa-artifacts",
  "playwright-report",
  "test-results",
  "coverage",
  "logs",
  "releases",
  "artifacts",
  "exports",
  "backups",
  "backup",
  "dumps",
  "dump",
  "database",
  "db",
  "assets-source",
  "Skills",
  "Logo",
  ".docker",
  "docker-data",
  "docker-volumes"
)

$ExcludedFilePatterns = @(
  "*.zip",
  "*.tar",
  "*.tar.gz",
  "*.tgz",
  "*.rar",
  "*.7z",
  "*.log",
  "*.sqlite",
  "*.sqlite3",
  "*.db",
  "*.dump",
  "*.sql",
  "*.pem",
  "*.key",
  "*.crt",
  "*.p12",
  "*.pfx",
  ".env",
  ".env.*",
  "Prompt.md"
)

function Test-IsExcludedPath {
  param (
    [string] $RelativePath
  )

  $NormalizedPath = $RelativePath.Replace("\", "/")

  foreach ($Directory in $ExcludedDirectories) {
    if (
      $NormalizedPath -eq $Directory -or
      $NormalizedPath.StartsWith("$Directory/") -or
      $NormalizedPath.Contains("/$Directory/")
    ) {
      return $true
    }
  }

  foreach ($Pattern in $ExcludedFilePatterns) {
    if ((Split-Path $NormalizedPath -Leaf) -like $Pattern) {
      if ($NormalizedPath -ne ".env.example" -and $NormalizedPath -ne "Docker/.env.example") {
        return $true
      }
    }
  }

  return $false
}

if (Test-Path $TempDir) {
  Remove-Item -Recurse -Force $TempDir
}

New-Item -ItemType Directory -Force -Path $TempDir | Out-Null
New-Item -ItemType Directory -Force -Path $ReleaseDir | Out-Null

$Files = Get-ChildItem -Path $Root -Recurse -File | Where-Object {
  $RelativePath = Resolve-Path -Relative $_.FullName
  $RelativePath = $RelativePath.TrimStart(".", "\", "/")
  -not (Test-IsExcludedPath -RelativePath $RelativePath)
}

foreach ($File in $Files) {
  $RelativePath = Resolve-Path -Relative $File.FullName
  $RelativePath = $RelativePath.TrimStart(".", "\", "/")

  $Destination = Join-Path $TempDir $RelativePath
  $DestinationDir = Split-Path $Destination -Parent

  New-Item -ItemType Directory -Force -Path $DestinationDir | Out-Null
  Copy-Item -Path $File.FullName -Destination $Destination -Force
}

if (Test-Path $OutputZip) {
  Remove-Item -Force $OutputZip
}

Compress-Archive -Path (Join-Path $TempDir "*") -DestinationPath $OutputZip -Force

$ForbiddenEntries = @(
  "node_modules/",
  ".git/",
  "dist/",
  ".astro/",
  "qa-artifacts/",
  "playwright-report/",
  "test-results/",
  "coverage/",
  "logs/",
  "assets-source/"
)

Add-Type -AssemblyName System.IO.Compression.FileSystem

$Zip = [System.IO.Compression.ZipFile]::OpenRead($OutputZip)
$Entries = $Zip.Entries | ForEach-Object { $_.FullName }
$Zip.Dispose()

$Errors = @()

foreach ($Forbidden in $ForbiddenEntries) {
  if ($Entries | Where-Object { $_ -like "*$Forbidden*" }) {
    $Errors += "El ZIP contiene ruta prohibida: $Forbidden"
  }
}

if ($Entries | Where-Object { $_ -like "*.zip" -or $_ -like "*.rar" -or $_ -like "*.7z" -or $_ -like "*.tar" -or $_ -like "*.tgz" }) {
  $Errors += "El ZIP contiene archivos comprimidos antiguos."
}

if ($Errors.Count -gt 0) {
  Remove-Item -Force $OutputZip

  Write-Host "ERROR: ZIP inválido." -ForegroundColor Red
  $Errors | ForEach-Object { Write-Host "- $_" -ForegroundColor Red }

  exit 1
}

Remove-Item -Recurse -Force $TempDir

$SizeMb = [Math]::Round((Get-Item $OutputZip).Length / 1MB, 2)

Write-Host "ZIP limpio creado:" -ForegroundColor Green
Write-Host $OutputZip
Write-Host "Tamaño: $SizeMb MB"