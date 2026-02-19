import { BASE_URL } from "./main";

// ─── Markdown generator ───────────────────────────────────────────────────────
export function generateMarkdown(products) {
	return products
		.map((name) => {
			const slug = name
				// German umlauts
				.replace(/ä/g, "ae")
				.replace(/ö/g, "oe")
				.replace(/ü/g, "ue")
				.replace(/Ä/g, "ae")
				.replace(/Ö/g, "oe")
				.replace(/Ü/g, "ue")
				.replace(/ß/g, "ss")
				// Replace slashes with dash
				.replace(/\//g, "-")
				// Remove all other non-alphanumeric chars except space/dash
				.replace(/[^a-zA-Z0-9\s-]/g, "")
				// Remove spaces between numbers and letters
				.replace(/(\d)\s+(?=[a-zA-Z])/g, "$1")
				// Replace remaining spaces with dash
				.replace(/\s+/g, "-")
				// Collapse multiple dashes
				.replace(/-+/g, "-")
				.toLowerCase()
				.trim();

			return `- [${name}](${BASE_URL}/${slug})`;
		})
		.join("\n");
}
