#!/usr/bin/env bun

const BASE_URL = "https://maisonafford.com/products/";

/** Ansi color codes */
const COLORS = {
	RESET: "\x1b[0m",
	DIM: "\x1b[2m",
	GRAY: "\x1b[90m",
	CYAN: "\x1b[36m",
	GREEN: "\x1b[32m",
	YELLOW: "\x1b[33m",
};

// ─── Title frame ─────────────────────────────────────────────────────────────
console.log(`
  ${COLORS.GRAY}╔══════════════════════════════════════════╗${COLORS.RESET}
  ${COLORS.GRAY}║${COLORS.RESET}        ${COLORS.CYAN}MAISON AFFORD LINK BUILDER${COLORS.RESET}       ${COLORS.GRAY}║${COLORS.RESET}
  ${COLORS.GRAY}╚══════════════════════════════════════════╝${COLORS.RESET}
`);

// ─── OS keybind info ─────────────────────────────────────────────────────────
console.log(`${COLORS.DIM}
Füge deine Liste ein und beende die Eingabe:

  ${COLORS.GRAY}Windows:${COLORS.RESET} Ctrl+Z → Enter
  ${COLORS.GRAY}Linux:${COLORS.RESET}   Ctrl+D
  ${COLORS.GRAY}macOS:${COLORS.RESET}   Ctrl+D

${COLORS.RESET}`);

// ─── Read stdin input ────────────────────────────────────────────────────────
const chunks = [];
for await (const chunk of Bun.stdin.stream()) chunks.push(chunk);
const input = Buffer.concat(chunks).toString();

// ─── List items extraction + builder ─────────────────────────────────────────
const products = input
	.split("\n")
	.map((line) => line.trim())
	.filter((line) => line.startsWith("- "))
	.map((line) => line.slice(2).trim())
	.filter(Boolean);

if (!products.length) {
	console.log("Keine Listeneinträge gefunden.");
	process.exit(0);
}

// ─── Markdown list generator ─────────────────────────────────────────────────
const markdown = products
	.map((name) => {
		const slug = name
			// German "umlauts"
			.replace(/ä/g, "ae")
			.replace(/ö/g, "oe")
			.replace(/ü/g, "ue")
			.replace(/Ä/g, "ae")
			.replace(/Ö/g, "oe")
			.replace(/Ü/g, "ue")
			.replace(/ß/g, "ss")

			// Slug cleanup (kebab-case)
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9\s-]/g, "")
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-");
		return `- [${name}](${BASE_URL}${slug})`;
	})
	.join("\n");

// ─── Print markdown ──────────────────────────────────────────────────────────
console.log("\nMarkdown-Liste:\n");
console.log(markdown);

// ─── Cross-platform compatible clipboard copy ────────────────────────────────
let copied = false;

async function tryCopy(cmd, args = []) {
	try {
		const proc = Bun.spawn([cmd, ...args], {
			stdin: new Response(markdown).body,
			stdout: "ignore",
			stderr: "ignore",
		});
		const exit = await proc.exited;
		return exit === 0;
	} catch {
		return false;
	}
}

if (process.platform === "darwin") {
	copied = await tryCopy("pbcopy");
} else if (process.platform === "win32") {
	copied = await tryCopy("clip");
} else if (process.platform === "linux") {
	// Try xclip, wl-copy, xsel in order
	copied =
		(await tryCopy("xclip", ["-selection", "clipboard"])) ||
		(await tryCopy("wl-copy")) ||
		(await tryCopy("xsel", ["--clipboard", "--input"]));
}

// ─── Final status message ────────────────────────────────────────────────────
console.log(
	copied
		? `\n${COLORS.GREEN}${products.length} Links generiert und in die Zwischenablage kopiert.${COLORS.RESET}\n`
		: `\n${COLORS.YELLOW}${products.length} Links generiert (Zwischenablage nicht verfügbar).${COLORS.RESET}\n`,
);
