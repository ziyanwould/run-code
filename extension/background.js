chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    url: 'dist/index.html'
  });
});