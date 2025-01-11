let currentTab;

// Invoked when tabs are updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	currentTab = tab;
	TriggerRepaint();
});

// Invoked when we change tab
chrome.tabs.onActivated.addListener((activeInfo) => {
	GetCurrentTab((tab) => currentTab = tab);
});

// Invoked when we receive a message
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.greeting = "trigger-repaint")
		TriggerRepaint();

	sendResponse();
});

function TriggerRepaint() {
	console.log("Sending message");

	if (currentTab && currentTab.url.includes("itch.io/dashboard"))
		chrome.tabs.sendMessage(currentTab.id, { type: "Repaint" });
}

async function GetCurrentTab(onResult) {
	let queryOptions = { active: true, currentWindow: true };
	let [tab] = await chrome.tabs.query(queryOptions);
	onResult(tab);
}