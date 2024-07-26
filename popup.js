document.addEventListener('DOMContentLoaded', function() {
  const loginButton = document.getElementById('login');
  const statusElement = document.getElementById('status');

  function checkSignInStatus() {
    chrome.identity.getAuthToken({ interactive: false }, function(token) {
      if (chrome.runtime.lastError || !token) {
        // User is not signed in
        loginButton.style.display = 'block';
        statusElement.style.display = 'none';
      } else {
        // User is signed in
        loginButton.style.display = 'none';
        statusElement.style.display = 'block';
      }
    });
  }

  loginButton.addEventListener('click', function() {
    chrome.identity.getAuthToken({ interactive: true }, function(token) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        checkSignInStatus(); // Check the sign-in status after authentication
      }
    });
  });

  // Check sign-in status when the popup is loaded
  checkSignInStatus();
});
