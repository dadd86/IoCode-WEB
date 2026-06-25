$ErrorActionPreference = "Stop"

$imageName = "iocode-solutions-web:latest"
$containerName = "iocode-dist-export-temp"

Write-Host "Sincronizando dist desde imagen Docker: $imageName"

docker image inspect $imageName | Out-Null

$existingContainer = docker ps -a --filter "name=$containerName" --format "{{.Names}}"

if ($existingContainer -eq $containerName) {
  docker rm -f $containerName | Out-Null
}

if (Test-Path ".\dist") {
  Remove-Item -Recurse -Force ".\dist"
}

docker create --name $containerName $imageName | Out-Null
docker cp "${containerName}:/app/dist" ".\dist"
docker rm -f $containerName | Out-Null

docker run --rm `
  -v "${PWD}:/workspace" `
  -w /workspace `
  node:24-alpine `
  node tools/validate-dist-sitemap.mjs

Write-Host "dist sincronizado y validado correctamente."