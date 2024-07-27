const API_KEY = 'OPENAPIKEY';

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "createInvite",
    title: "Create Calendar Invite",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "createInvite") {
    const selectedText = info.selectionText;
    const prompt = `Extract the following details from the text:\n\n${selectedText}\n\nProvide the details in the format: Name, Date, Time, Location.
    and format the data so that you can create it in the form of a Google Calendar link.

    Format it like so:

    Link: Link here

    The link should be in a format like so: https://calendar.google.com/calendar/r/eventedit?text=

    If you cannot find information that belongs to Date, Time, Location, do not include it in the Google Calendar link.
    If no date is specified leave that part blank. 
    `;

    const headers = {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    };

    const data = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    };

    fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      console.log('API Response:', data); 

      if (data.choices && data.choices.length > 0) {
        const gptResponse = data.choices[0].message.content;
        console.log('GPT Response:', gptResponse);
        const linkPattern = /Link:\s*(https:\/\/calendar\.google\.com\/calendar\/r\/eventedit\?text=[^\s]*)/i;
        const match = gptResponse.match(linkPattern);
      
        let calendarLink = '';
        if (match) {
          calendarLink = match[1];
        }

        if (calendarLink) {
          chrome.tabs.create({ url: calendarLink });
        } else {
          console.error('No valid Google Calendar link found in the GPT response.');
        }
      } else {
        console.error('Unexpected API response structure:', data);
      }
    })
    .catch(error => console.error('Error during fetch:', error));
  }
});
