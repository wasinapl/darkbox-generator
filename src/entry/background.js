chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.fun == "gethtml") {
    getResponse(request.href).then((html) => {
      sendResponse(html);
    });
  } else if (request.fun == "updateRequests") {
    chrome.storage.local.get(["requests", "date"], function (items) {
      if (!items.date) {
        chrome.storage.local.set(
          { date: Date.now(), requests: 1 },
          function () {}
        );
      } else {
        const same_day = sameDay(new Date(items.date), new Date());
        chrome.storage.local.set(
          { date: Date.now(), requests: same_day ? items.requests + 1 : 1 },
          function () {}
        );
      }
    });
  } else if (request.fun == "getRequests") {
    chrome.storage.local.get(["requests", "date"], function (items) {
      if (!items.date) {
        chrome.storage.local.set(
          { date: Date.now(), requests: 0 },
          function () {}
        );
        sendResponse(0);
      } else {
        const same_day = sameDay(new Date(items.date), new Date());
        if (!same_day) {
          chrome.storage.local.set(
            { date: Date.now(), requests: 0 },
            function () {}
          );
          sendResponse(0);
        } else {
          sendResponse(items.requests);
        }
      }
    });
  }
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

function sameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}
