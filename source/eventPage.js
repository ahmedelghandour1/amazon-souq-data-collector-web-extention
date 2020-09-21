chrome.runtime.onMessage.addListener((request, sender, sendResp) => {
  if (request.todo === "showPageAction") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log(tabs);
      if (tabs.length > 0) {
        console.log(tabs);
        chrome.pageAction.show(tabs[0].id);
      }
    });
  }
});

chrome.runtime.onInstalled.addListener((e) => {
  console.log(e);
  chrome.identity.getProfileUserInfo((user) => {
    console.log(user);
    chrome.storage.sync.set({ 'user': user });
  });
});

chrome.identity.onSignInChanged.addListener((account, signedIn) => {
  console.log(account, signedIn);
  chrome.identity.getProfileUserInfo((user) => {
    console.log(user);
    chrome.storage.sync.set({ 'user': user });
  });
});
