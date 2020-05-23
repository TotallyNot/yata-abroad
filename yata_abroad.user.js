// ==UserScript==
// @name         YATA abroad
// @namespace    yata.alwaysdata.net
// @version      0.2
// @updateURL    https://github.com/TotallyNot/yata-abroad/raw/master/js/yata_abroad.user.js
// @description  Update item stocks abroad for YATA
// @author       Pyrit[2111649]
// @match        https://www.torn.com/index.php
// @grant        GM.xmlHttpRequest
// @connect      yata.alwaysdata.net
// @run-at       document-end
// ==/UserScript==

function scrapeStock() {
    const items = document.querySelectorAll(".item-info-wrap");

    return Object.fromEntries(
        [...items].map((item) => [
            item.querySelector("[id^=item]").id.match(/[0-9]+/)[0],
            {
                quantity: parseInt(
                    item.querySelector(".stck-amount").innerText
                ),
                cost: parseInt(
                    item
                        .querySelector(".c-price")
                        .innerText.replace(/[^0-9]+/g, "")
                ),
            },
        ])
    );
}

function update(items) {
    GM.xmlHttpRequest({
        url: "https://yata.alwaysdata.net/bazaar/abroad/import/",
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        data: JSON.stringify({
            country: document
                .querySelector(".content-title > h4")
                .innerText.substr(0, 3)
                .toLowerCase(),
            client: "YATA abroad userscript",
            uid: parseInt(
                document
                    .querySelector('script[src^="/js/chat/chat"]')
                    .getAttribute("uid")
            ),
            items,
        }),
        onload: (response) => console.log(response),
    });
}

const items = scrapeStock();
if (Object.keys(items.length).length) {
    update(items);
}
