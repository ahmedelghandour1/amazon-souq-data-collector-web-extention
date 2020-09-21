  const button = document.querySelector("button");
console.log(button);
button.addEventListener("click", (e) => {
  console.log(e);
chrome.runtime.sendMessage({ todo: "showData" });
  // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  //   chrome.tabs.sendMessage(tabs[0].id, {
  //     todo: "showData",
  //   });
  // });

});

