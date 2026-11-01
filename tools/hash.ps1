<#
  Generates the salted SHA-256 hash of an invitation password for js/main.js.

  Usage (from the project folder, in PowerShell):
    .\tools\hash.ps1 "my-new-password"

  Paste the output as the `hash` of the matching entry in CONFIG.passwords. The salt must match CONFIG.hashSalt.
#>
param(
  [Parameter(Mandatory = $true, Position = 0)][string]$Password,
  [string]$Salt = "namita-kabir-2027"
)

$sha = [Security.Cryptography.SHA256]::Create()
$bytes = [Text.Encoding]::UTF8.GetBytes($Salt + $Password.Trim().ToLower())
($sha.ComputeHash($bytes) | ForEach-Object { $_.ToString("x2") }) -join ""
