param(
    [ValidateSet('user', 'project')]
    [string]$Scope = 'user',
    [switch]$Force
)

$ErrorActionPreference = 'Stop'
$RepoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$SkillsSource = Join-Path $RepoRoot 'skills'
$CommandsSource = Join-Path $RepoRoot '.opencode\commands'
$AgentsSource = Join-Path $RepoRoot '.opencode\agents'

if ($Scope -eq 'user') {
    $SkillsDest = Join-Path $env:USERPROFILE '.config\opencode\skills'
    $CommandsDest = Join-Path $env:USERPROFILE '.config\opencode\commands'
    $AgentsDest = Join-Path $env:USERPROFILE '.config\opencode\agents'
} else {
    $SkillsDest = Join-Path (Get-Location) '.opencode\skills'
    $CommandsDest = Join-Path (Get-Location) '.opencode\commands'
    $AgentsDest = Join-Path (Get-Location) '.opencode\agents'
}

function Copy-SkillFolder {
    param([string]$Source, [string]$Destination, [string]$Category)

    $name = Split-Path -Leaf $Source
    $dest = Join-Path $Destination (Join-Path $Category $name)
    if (Test-Path $dest) {
        if (-not $Force) {
            Write-Host "  skip (exists): $dest" -ForegroundColor Yellow
            return
        }
        Remove-Item -Recurse -Force $dest
    }
    New-Item -ItemType Directory -Force (Split-Path -Parent $dest) | Out-Null
    Copy-Item -Recurse -Force $Source $dest
    Write-Host "  installed: $dest" -ForegroundColor Green
}

function Install-Skills {
    Write-Host "Installing skills to $SkillsDest"
    foreach ($category in Get-ChildItem $SkillsSource -Directory) {
        foreach ($skill in Get-ChildItem $category.FullName -Directory) {
            if (Test-Path (Join-Path $skill.FullName 'SKILL.md')) {
                Copy-SkillFolder -Source $skill.FullName -Destination $SkillsDest -Category $category.Name
            }
        }
    }
}

function Install-Files {
    param([string]$Source, [string]$Destination, [string]$Label)

    New-Item -ItemType Directory -Force $Destination | Out-Null
    Write-Host "Installing $Label to $Destination"
    foreach ($file in Get-ChildItem $Source -File -Filter '*.md') {
        $dest = Join-Path $Destination $file.Name
        if ((Test-Path $dest) -and -not $Force) {
            Write-Host "  skip (exists): $dest" -ForegroundColor Yellow
            continue
        }
        Copy-Item -Force $file.FullName $dest
        Write-Host "  installed: $dest" -ForegroundColor Green
    }
}

Write-Host "Target: opencode ($Scope)" -ForegroundColor Cyan
Install-Skills
Install-Files -Source $CommandsSource -Destination $CommandsDest -Label 'commands'
Install-Files -Source $AgentsSource -Destination $AgentsDest -Label 'agents'

Write-Host ""
Write-Host "Done. Reload OpenCode if the new commands or agents do not appear." -ForegroundColor Cyan
Write-Host "Use -Force to overwrite existing files." -ForegroundColor DarkGray
