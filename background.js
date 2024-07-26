chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "createInvite",
    title: "Create Calendar Invite",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "createInvite") {
    chrome.identity.getAuthToken({ interactive: true }, function(token) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        const eventDetails = encodeURIComponent(info.selectionText);
        const createEventUrl = `https://calendar.google.com/calendar/r/eventedit?text=${eventDetails}`;
        
        chrome.tabs.create({ url: createEventUrl });
      }
    });
  }
});
