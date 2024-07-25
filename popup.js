document.getElementById('login').addEventListener('click', function() {
    chrome.identity.getAuthToken({ interactive: true }, function(token) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        console.log("Token acquired: " + token);
        fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        }).then(response => response.json())
          .then(data => console.log(data))
          .catch(error => console.error(error));
      }
    });
  });