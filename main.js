#!/usr/bin/env bun

import { generateMarkdown } from "./formatter";
export const BASE_URL = "https://maisonafford.com/products";

/** Ansi color codes */
const COLORS = {
	RESET: "\x1b[0m",
	DIM: "\x1b[2m",
	GRAY: "\x1b[90m",
	CYAN: "\x1b[36m",
	GREEN: "\x1b[32m",
	YELLOW: "\x1b[33m",
};

// ─── CLI runner ───────────────────────────────────────────────────────────────
async function runCLI() {
	// Title frame
	const title = "MAISON AFFORD LINK BUILDER";
	const frameWidth = 42;
	const padding = Math.floor((frameWidth - title.length) / 2);
	const paddedTitle =
		" ".repeat(padding) +
		title +
		" ".repeat(frameWidth - title.length - padding);

	console.log(`
    ${COLORS.GRAY}╔══════════════════════════════════════════╗${COLORS.RESET}
    ${COLORS.GRAY}║${COLORS.RESET}${COLORS.CYAN}${paddedTitle}${COLORS.RESET}${COLORS.GRAY}║${COLORS.RESET}
    ${COLORS.GRAY}╚══════════════════════════════════════════╝${COLORS.RESET}
  `);

	// ─── Procedure Info ──────────────────────────────────────────────────────────
	console.log(`
      ${COLORS.DIM}Füge deine Liste ein und beende die Eingabe:

        ${COLORS.GRAY}Windows:${COLORS.RESET}        Ctrl+Z → Enter
        ${COLORS.GRAY}Linux:${COLORS.RESET}          Ctrl+D
        ${COLORS.GRAY}macOS:${COLORS.RESET}          Ctrl+D
        ${COLORS.GRAY}Zum Abbrechen:${COLORS.RESET}  Ctrl+C

    ${COLORS.RESET}
  `);

	// Read stdin
	const chunks = [];
	for await (const chunk of Bun.stdin.stream()) chunks.push(chunk);
	const input = Buffer.concat(chunks).toString().trim();
	console.clear();

	// Extract list items
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

	const markdown = generateMarkdown(products);

	// Print markdown
	console.log(
		"\n─── Markdown-Liste ──────────────────────────────────────────────────────────\n",
	);
	console.log(markdown);

	// Copy to clipboard (Linux / WSL detection)
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
		if (process.env.WSL_DISTRO_NAME) {
			copied = await tryCopy("clip.exe");
		} else {
			copied =
				(await tryCopy("xclip", ["-selection", "clipboard"])) ||
				(await tryCopy("wl-copy")) ||
				(await tryCopy("xsel", ["--clipboard", "--input"]));
		}
	}

	const CHECK = "✅";
	console.log(
		copied
			? `\n${COLORS.GREEN}${CHECK}${products.length} Links generiert und in die Zwischenablage kopiert.${COLORS.RESET}\n`
			: `\n${COLORS.YELLOW}${CHECK}${products.length} Links generiert (Zwischenablage nicht verfügbar).${COLORS.RESET}\n`,
	);
}

// ─── Only run CLI if file executed directly ───────────────────────────────────
if (import.meta.main) {
	await runCLI();
}
