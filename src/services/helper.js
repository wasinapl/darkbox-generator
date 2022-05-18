/* eslint-disable */

export default {
  addButtons(onClick, onClickLinkChecker) {
    const codeElements = document.querySelectorAll(".ipsCode");
    let codeid = 0;
    for (let item of codeElements) {
      if (siteList.some((el) => item.innerHTML.includes(el))) {
        const button = document.createElement("div");
        button.innerText = "sprawdź linki i poproś o generację";
        button.classList.add("ipsButton", "generuj");
        button.dataset.codeid = codeid;
        button.addEventListener("click", onClick);
        item.appendChild(document.createElement("br"));
        item.appendChild(button);
      }
      codeid++;
    }

    const menu = document.querySelector('#ipsLayout_header > header > div.focus-header-align > div > div > div > nav > div > ul');
    const menu_item = document.createElement('li');
    menu_item.style.cursor = 'pointer';
    menu_item.addEventListener('click', onClickLinkChecker);
    const menu_item_title = document.createElement('a');
    menu_item_title.innerText = "Link checker";

    menu_item.appendChild(menu_item_title);
    menu.prepend(menu_item);

  },

  getLinksInfo(e) {
    const codeid = e.target.dataset.codeid;
    let links = document
      .querySelectorAll(".ipsCode")
      [codeid].innerText.replaceAll("<br>", "\n")
      .split("\n");
    links = links.filter(
      (el) => siteList.some((site) => el.includes(site)) && el.length > 0
    );

    const linksList = [];
    for (let i = 0; i < links.length; i++) {
      const link = {
        href: links[i],
        site: new URL(links[i]).hostname,
        filename: links[i].substring(links[i].lastIndexOf("/") + 1),
        size: null,
        disabled: false,
        selected: false,
      };
      linksList.push(link);
    }
    return linksList;
  },

  async getSize(link, response) {
    chrome.runtime.sendMessage(
      { fun: "gethtml", href: link },
      async function (html) {
        const doc = document.implementation.createHTMLDocument("");
        doc.write(html);
        let selector, sizeStr;
        if (link.includes("ddownload")) {
          selector = ".file-size";
          if (doc.querySelector(selector)) {
            sizeStr = doc.querySelector(selector).innerText;
          } else {
            response(0);
          }
        } else if (link.includes("wplik")) {
          selector = "#container > font";
          if (doc.querySelector(selector)) {
            sizeStr = doc.querySelector(selector).innerText;
            sizeStr = sizeStr.match(/\((.*?)\)/gm)[0].slice(1, -1);
          } else {
            response(0);
          }
        } else if (link.includes("wrzucajpliki")) {
          selector = "#container > div > font";
          if (doc.querySelector(selector)) {
            sizeStr = doc.querySelector(selector).innerText.match(/\(([^)]+)\)/)[1];
          } else {
            response(0);
          }
        } else if (link.includes("rapidgator")) {
          selector = "strong";
          if (doc.querySelectorAll(selector)[2]) {
            sizeStr = doc.querySelectorAll(selector)[2].innerText;
          } else {
            response(0);
          }
        }

        if (sizeStr.includes("GB")) {
          response(Number(sizeStr.slice(0, -3)));
        } else if (sizeStr.includes("MB")) {
          response((Number(sizeStr.slice(0, -3)) / 1024).toFixed(2));
        } else {
          response(0);
        }
      }
    );
  },

  newWindow(link) {
    const url = new URL(link.href);
    let postTitle = "";
    if (url.hostname.includes("wplik")) {
      postTitle = "wplik.com " + link.size + " GB";
    } else {
      postTitle = url.hostname + " " + link.size + " GB";
    }
    const postMessage = `[code]${link.href}[/code]`;
    const newWindow = window.open(
      "https://darkbox.vip/forum/13-generowanie-linków/?do=add",
      "_blank"
    );
    newWindow.addEventListener(
      "load",
      () => {
        newWindow.document.querySelector("#elInput_topic_title").value =
          postTitle;
        const content = (newWindow.document.querySelector(
          "#topic_content_editor > div > div > div > div:nth-child(1) > div.norewrite > textarea"
        ).innerText = postMessage);
      },
      true
    );
  },
  updateRequests() {
    chrome.runtime.sendMessage({ fun: "updateRequests"});
  },
  getRequests(response) {
    chrome.runtime.sendMessage({ fun: "getRequests"}, res => {
      response(res);
    });
  }
};

const siteList = [
  "ddownload.com",
  "wrzucajpliki.pl",
  "rapidgator.net",
  "wplik.com",
];
