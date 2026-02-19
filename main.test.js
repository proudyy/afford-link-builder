import { describe, expect, it } from "bun:test";
import { generateMarkdown } from "./formatter.js";
import { BASE_URL } from "./main.js";

describe("generateMarkdown", () => {
	it("should convert product names to proper Markdown links", () => {
		const products = ["Honey Island", "Woody Tobacco", "Dark Flower"];
		const markdown = generateMarkdown(products);

		expect(markdown).toBe(
			`- [Honey Island](${BASE_URL}/honey-island)
- [Woody Tobacco](${BASE_URL}/woody-tobacco)
- [Dark Flower](${BASE_URL}/dark-flower)`,
		);
	});

	it("should handle German umlauts correctly", () => {
		const products = ["Äpfel", "Über", "Safira 3"];
		const markdown = generateMarkdown(products);

		expect(markdown).toBe(
			`- [Äpfel](${BASE_URL}/aepfel)
- [Über](${BASE_URL}/ueber)
- [Safira 3](${BASE_URL}/safira-3)`,
		);
	});

	it("should remove invalid URL characters and replace spaces with dashes", () => {
		const products = ["Espresso Noir", "Smoky Vanilla", "74 km/h"];
		const markdown = generateMarkdown(products);

		expect(markdown).toBe(
			`- [Espresso Noir](${BASE_URL}/espresso-noir)
- [Smoky Vanilla](${BASE_URL}/smoky-vanilla)
- [74 km/h](${BASE_URL}/74km-h)`,
		);
	});
});
