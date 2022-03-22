chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  getResponse(request.href).then(html => {
    sendResponse(html);
  })
  return true;
});

async function getResponse(href) {
  return fetch(href)
    .then((response) => {
      return response.text();
    })
    .then((html) => {
      return html;
    })
    .catch();
}
