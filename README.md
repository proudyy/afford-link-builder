# MaisonAfford Link Builder

A lightweight and fast CLI tool built with **Bun** that generates Markdown product links for [MaisonAfford](https://maisonafford.com).  
It automatically converts product names into URL-friendly slugs, handles German umlauts, and copies the resulting Markdown list to the clipboard.
This can be used to share products across contacts.

---

## Prerequisites

- **Bun runtime** must be installed on your system.  
  Install from [https://bun.sh](https://bun.sh).

---

## Features

- Minimalistic, dependency-free, and fast  
- Generates **Markdown links** in the format `- [Product Name](URL)`
- Handles **German umlauts** and special characters in URLs  
- Cross-platform **clipboard support**: macOS, Windows, Linux  
- ANSI-colored terminal output for a clean CLI experience  
- Paste-friendly input (supports Ctrl+C + Ctrl+V)  

---

## Setup

Make the script executable:

```bash
chmod +x main.js
```

### Usage

1. Run the CLI command:

```bash
./main.js
# or, if installed globally:
ms
```
2. Paste your product list, which *MUST* contain valid markdown list items e.g.:
```
Favoriten:
- Woody Tobacco
- Campfire
- 74 km/h

Sonstige:
- Obsidian Trace
- Desert Night
- Woody Satin
```
| Markdown list items start with a dash (`- `) at the line start.

## Contributions

They're desired to happen if they meet these points:
1. Slightly! explain code with details about what's happening.
2. Make a pull request.