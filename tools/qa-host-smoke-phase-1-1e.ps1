$ErrorActionPreference = "Stop"

$baseUrl = $env:DEVOPS_HOST_BASE_URL
if ([string]::IsNullOrWhiteSpace($baseUrl)) {
  $baseUrl = "http://localhost:8080"
}

$artifactDir = "qa-artifacts\devops\phase-1-1e"
$artifactPath = Join-Path $artifactDir "host-smoke.json"
$maxAttempts = 30
$delaySeconds = 1

New-Item -ItemType Directory -Force $artifactDir | Out-Null

$routes = @(
  @{ path = "/health"; expectedStatus = 200 },
  @{ path = "/es/"; expectedStatus = 200 },
  @{ path = "/en/"; expectedStatus = 200 },
  @{ path = "/de/"; expectedStatus = 200 },
  @{ path = "/no-existe/"; expectedStatus = 404 }
)

$results = @()
$errors = @()

function Invoke-HeadWithRetry {
  param(
    [string]$Url,
    [int]$ExpectedStatus,
    [string]$Path
  )

  $lastError = ""

  for ($attempt = 1; $attempt -le $maxAttempts; $attempt++) {
    $status = ""
    $exitCode = 1

    try {
      $status = & curl.exe -sS -o NUL -w "%{http_code}" -I $Url 2>$null
      $exitCode = $LASTEXITCODE
    } catch {
      $lastError = $_.Exception.Message
    }

    if ($exitCode -eq 0 -and $status -eq "$ExpectedStatus") {
      return [ordered]@{
        path = $Path
        url = $Url
        expectedStatus = $ExpectedStatus
        actualStatus = [int]$status
        attempt = $attempt
        passed = $true
      }
    }

    if ($exitCode -ne 0) {
      $lastError = "curl exit code $exitCode"
    } else {
      $lastError = "status $status"
    }

    Start-Sleep -Seconds $delaySeconds
  }

  return [ordered]@{
    path = $Path
    url = $Url
    expectedStatus = $ExpectedStatus
    actualStatus = $null
    attempt = $maxAttempts
    passed = $false
    error = $lastError
  }
}

foreach ($route in $routes) {
  $url = "$baseUrl$($route.path)"
  $result = Invoke-HeadWithRetry -Url $url -ExpectedStatus $route.expectedStatus -Path $route.path
  $results += $result

  if (-not $result.passed) {
    $errors += "$($route.path): esperado $($route.expectedStatus), recibido $($result.actualStatus). $($result.error)"
  }
}

$statusValue = "passed"
if ($errors.Count -gt 0) {
  $statusValue = "failed"
}

$payload = [ordered]@{
  phase = "1.1E"
  check = "host-smoke"
  status = $statusValue
  baseUrl = $baseUrl
  routes = $results
  warningCount = 0
  errorCount = $errors.Count
  warnings = @()
  errors = $errors
  generatedAt = (Get-Date).ToUniversalTime().ToString("o")
}

$json = $payload | ConvertTo-Json -Depth 10
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$artifactFullPath = [System.IO.Path]::GetFullPath($artifactPath)
[System.IO.File]::WriteAllText($artifactFullPath, $json, $utf8NoBom)

if ($errors.Count -gt 0) {
  Write-Host "Errores host smoke Fase 1.1E:"
  foreach ($errorItem in $errors) {
    Write-Host "- $errorItem"
  }

  throw "Host smoke Fase 1.1E falló."
}

Write-Host "Host smoke Fase 1.1E superado."
Write-Host "Artifact generado: $artifactPath"

docker compose --profile prod --profile qa run --rm `
  -e REQUIRE_HOST_SMOKE=true `
  browser-qa npm run summary:devops:1.1e

if ($LASTEXITCODE -ne 0) {
  throw "No se pudo regenerar summary.json Fase 1.1E con host smoke."
}

Write-Host "summary.json Fase 1.1E actualizado con host smoke."