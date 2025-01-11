// Invoked when we get on an itch.io/dashboard website
(() => {
	// let currentScheme = 0;

	// Invoked when we receive a message
	chrome.runtime.onMessage.addListener((obj, sender, response) => {
		const { type } = obj.type;
		console.log("Repaint message received");

		if (type == "Repaint")
			Repaint();
	});

	// save stuff here
	// chrome.storage.sync.set({
	// 	[tag]: JSON.stringify(currentScheme)
	// });

	function Repaint() {
		// currentScheme = GetCurrentScheme();

		// console.log("Current : " + currentScheme);

		// ----------- rework line --------------

		// let allElements = document.getElementsByTagName('*');

		// const dataAtr = "data-game_id";
		// const minS = 0.8;
		// const maxS = 0.3;
		// const minV = 0.4;
		// const maxV = 0.8;

		// const gameIds = [];
		// const gameIdsCount = [];
		// const elements = [];
		// let gameColors = [];
		// let maxIdCount = 0;

		// for (let element of allElements) {
		// 	if (element.hasAttribute(dataAtr)) {
		// 		const attribute = element.getAttribute(dataAtr);
		// 		elements.push(element);

		// 		if (!gameIds.includes(attribute)) {
		// 			gameIds.push(attribute);
		// 			gameIdsCount.push(1);
		// 		}
		// 		else {
		// 			let index = gameIds.indexOf(attribute);
		// 			gameIdsCount[index] += 1;
		// 			maxIdCount = Math.max(gameIdsCount[index], maxIdCount);
		// 		}
		// 	}
		// }

		// for (let i = 0; i < gameIds.length; i++) {
		// 	gameColors.push(GetColor(
		// 		i / gameIds.length,
		// 		Lerp(minS, maxS, 1 - (gameIdsCount[i] / maxIdCount)),
		// 		Lerp(minV, maxV, (gameIdsCount[i] / maxIdCount))
		// 	));
		// }

		// gameColors = gameColors.sort(() => (Math.random() - 0.5) * 2);

		// for (let color of gameColors)
		// 	console.log("%cColor", "color : " + color);

		// for (let element of elements) {
		// 	const id = element.getAttribute(dataAtr);
		// 	let index = gameIds.indexOf(id);
		// 	element.setAttribute("fill", gameColors[index]);
		// }
	};

	function GetCurrentScheme() {
		let currentScheme = 0;
		const saveKey = "scheme";

		// TODO : Can't access chrome.storage.sync

		chrome.storage.sync.get(
			[saveKey], (obj) => {
				if (obj[saveKey] != null)
					currentScheme = JSON.parse(obj[saveKey]);
				else // save if we can't find any
					chrome.storage.sync.set([saveKey], JSON.stringify({ [saveKey]: currentScheme }));
			}
		);

		return currentScheme;
	}

	function Lerp(min, max, percent) { return min + (max - min) * percent };

	function GetColor(percent, saturation, value) {
		// Convert HSV to RGB
		percent *= 5;

		const c = value * saturation;
		const x = c * (1 - Math.abs(percent % 2 - 1));
		const m = value - c;
		let r, g, b;

		if (percent >= 0 && percent < 1) { r = c; g = x; b = 0; }
		else if (percent >= 1 && percent < 2) { r = x; g = c; b = 0; }
		else if (percent >= 2 && percent < 3) { r = 0; g = c; b = x; }
		else if (percent >= 3 && percent < 4) { r = 0; g = x; b = c; }
		else if (percent >= 4 && percent < 5) { r = x; g = 0; b = c; }
		else { r = c; g = 0; b = x; }

		// Convert RGB to Hex
		r = Math.round((r + m) * 255).toString(16).padStart(2, '0');
		g = Math.round((g + m) * 255).toString(16).padStart(2, '0');
		b = Math.round((b + m) * 255).toString(16).padStart(2, '0');

		return `#${r}${g}${b}`;
	}
})();