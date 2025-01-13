// Invoked when we get on an itch.io/dashboard website
(() => {
	const saveKey = "scheme";
	const dataAtr = "data-game_id";

	// Invoked when we receive a message
	chrome.runtime.onMessage.addListener((request, sender, response) => {
		if (request.type == "Repaint")
			Repaint();
	});

	function Repaint() {
		GetCurrentScheme((schemeIndex) => {
			const { elements, gamesData } = GetPageElements();
			const colors = GetScemeColors(schemeIndex, gamesData.length);

			const sortedGamesData = gamesData.sort((a, b) => a.count - b.count);

			console.log(sortedGamesData);

			for (let element of elements) {
				const id = element.getAttribute(dataAtr);
				const data = sortedGamesData.find(item => item.id == id);
				const index = sortedGamesData.indexOf(data);
				element.setAttribute("fill", colors[(sortedGamesData.length - 1) - index]);
			}
		});
	};

	function GetCurrentScheme(onResult) {
		chrome.storage.sync.get(
			[saveKey], (obj) => {
				let currentScheme = 0;

				if (obj[saveKey] != null)
					currentScheme = JSON.parse(obj[saveKey]);
				else // save if we can't find any
					SaveScheme(0);

				onResult(currentScheme)
			}
		);
	}

	function GetScemeColors(scheme, count) {
		switch (scheme) {
			case 0:
				return GetLerps("#842222", "#eaca4b", count);
			case 1:
				return GetLerps("#3c2d68", "#64d8e2", count);
			case 2:
				return GetLerps("#305f4a", "#acdb65", count);
			case 3:
				return GetLerps("#404572", "#c85a7d", count);
		}
	}

	function GetLerps(color1, color2, count) {
		const colors = [];

		for (let i = 0; i < count; i++) {
			const percent = i / count;
			colors.push(LerpColor(color1, color2, percent));
		}

		return colors;
	}

	function LerpColor(color1, color2, percent) {
		const trueColor1 = HexToRgb(color1);
		const trueColor2 = HexToRgb(color2);

		const r = LerpNumber(trueColor1.r, trueColor2.r, percent);
		const g = LerpNumber(trueColor1.g, trueColor2.g, percent);
		const b = LerpNumber(trueColor1.b, trueColor2.b, percent);

		return RgbToHex(r, g, b);
	}

	function LerpNumber(min, max, percent) {
		return min + (max - min) * percent;
	}

	function HexToRgb(hex) {
		// Remove the hash if it's present
		hex = hex.replace(/^#/, '');

		// Parse the hex values
		const r = parseInt(hex.slice(0, 2), 16) / 255;
		const g = parseInt(hex.slice(2, 4), 16) / 255;
		const b = parseInt(hex.slice(4, 6), 16) / 255;

		return { r, g, b };
	}

	function RgbToHex(r, g, b) {
		const toHex = (x) => {
			const hex = Math.round(x * 255).toString(16);
			return hex.length === 1 ? '0' + hex : hex;
		};

		return '#' + toHex(r) + toHex(g) + toHex(b);
	}

	function GetPageElements() {
		let allElements = document.getElementsByTagName('*');

		const elements = [];
		const gamesData = [];

		for (let element of allElements) {
			if (element.hasAttribute(dataAtr)) {
				const id = element.getAttribute(dataAtr);
				elements.push(element);

				const match = gamesData.find((value) => value.id == id);

				if (match == null)
					gamesData.push({ id: id, count: 1 });
				else
					match.count++;
			}
		}

		return {
			elements,
			gamesData
		};
	}
})();