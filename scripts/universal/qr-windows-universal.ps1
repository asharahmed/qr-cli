param(
  [string]$Tag = "latest",
  [string]$InstallDir = "$env:LOCALAPPDATA\\qr-cli\\bin",
  [switch]$AddToPath
)

$repo = "asharahmed/qr-cli"

function Get-Arch {
  $arch = (Get-CimInstance -ClassName Win32_Processor | Select-Object -First 1 -ExpandProperty Architecture)
  switch ($arch) {
    9 { return "x64" }
    12 { return "arm64" }
    default { throw "Unsupported architecture: $arch" }
  }
}

$arch = Get-Arch
$asset = "qr-win-$arch.exe"
if ($Tag -eq "latest") {
  $url = "https://github.com/$repo/releases/latest/download/$asset"
} else {
  $url = "https://github.com/$repo/releases/download/$Tag/$asset"
}

New-Item -ItemType Directory -Path $InstallDir -Force | Out-Null
$destination = Join-Path $InstallDir "qr.exe"
Invoke-WebRequest -Uri $url -OutFile $destination -UseBasicParsing

if ($AddToPath) {
  $currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
  if ($currentPath -notlike "*$InstallDir*") {
    $newPath = if ($currentPath) { "$currentPath;$InstallDir" } else { $InstallDir }
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
    Write-Output "Added $InstallDir to user PATH. Restart your terminal."
  }
}

Write-Output "Installed qr to $destination"
