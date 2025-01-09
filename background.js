chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (tab.url && tab.url.includes("itch.io/dashboard")) {
		chrome.tabs.sendMessage(tabId, {
			type: "Repaint"
		});
	}
});