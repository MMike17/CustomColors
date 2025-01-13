// Invoked when we get on an itch.io/dashboard website
(() => {
	const saveKey = "scheme";
	const dataAtr = "data-game_id";
	const maxSceheme = 8;

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

			for (let element of elements) {
				const id = element.getAttribute(dataAtr);
				const data = sortedGamesData.find(item => item.id == id);
				let index = sortedGamesData.indexOf(data);
				index = (sortedGamesData.length - 1) - index
				element.setAttribute("fill", colors[index]);
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

				if (currentScheme >= maxSceheme)
					currentScheme = maxSceheme - 1;

				onResult(currentScheme)
			}
		);
	}

	function GetScemeColors(scheme, count) {
		switch (scheme) {
			case 0:
				return GetLerps("#6b1d1d", "#f2d234", count);
			case 1:
				return GetLerps("#483150", "#64e2ba", count);
			case 2:
				return GetLerps("#2f413b", "#cbe84b", count);
			case 3:
				return GetLerps("#343f4f", "#ff5d8e", count);
			case 4:
				return GetLerps("#313131", "#efefef", count);
			case 5:
				return GetLerps("#562335", "#93c9ed", count);
			case 6:
				return GetLerps("#5c1b26", "#fc3535", count);
			case 7:
				return GetLerps("#711d12", "#59e7d2", count);
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