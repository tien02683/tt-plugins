# scripts/push-to-github.ps1 — Script Đẩy Code Lên GitHub
param(
    [string]$RepoUrl = "",
    [string]$Token = ""
)

$ErrorActionPreference = "Stop"
$repoDir = Split-Path -Parent $PSScriptRoot

Write-Host "=== DỰ ÁN TT PLUGINS — ĐẨY CODE LÊN GITHUB ===" -ForegroundColor Cyan
Set-Location $repoDir

# Kiểm tra git remote
$currentRemote = ""
try {
    $currentRemote = (git remote get-url origin 2>$null)
} catch {}

if (-not $RepoUrl -and -not $currentRemote) {
    $RepoUrl = Read-Host "Nhập đường dẫn GitHub Repository (ví dụ: https://github.com/USERNAME/tt-plugins.git)"
}

if ($RepoUrl) {
    if ($Token -and $RepoUrl -match "https://github.com/(.*)") {
        $path = $matches[1]
        $RepoUrl = "https://${Token}@github.com/${path}"
    }
    if ($currentRemote) {
        git remote set-url origin $RepoUrl
    } else {
        git remote add origin $RepoUrl
    }
    Write-Host "Đã cấu hình remote origin: $RepoUrl" -ForegroundColor Green
}

Write-Host "Đang kiểm tra branch và đẩy commit lên GitHub..." -ForegroundColor Yellow
git branch -M main
git push -u origin main

Write-Host "=== HOÀN TẤT ĐẨY CODE LÊN GITHUB THÀNH CÔNG! ===" -ForegroundColor Green
