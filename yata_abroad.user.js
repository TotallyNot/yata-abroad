// ==UserScript==
// @name         YATA abroad
// @namespace    yata.alwaysdata.net
// @version      0.6
// @updateURL    https://raw.githubusercontent.com/TotallyNot/yata-abroad/master/yata_abroad.user.js
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
                    item
                        .querySelector(".stck-amount")
                        .innerText.replace(/[^0-9]+/g, "")
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
    const payload = {
        country: document
            .querySelector(".content-title > h4")
            .innerText.substr(0, 3)
            .toLowerCase(),
        client: "YATA abroad userscript",
        version: GM.info.script.version,
        author_name: "Pyrit",
        author_id: 2111649,
        items,
    };
    console.log(payload);

    GM.xmlHttpRequest({
        url: "https://yata.alwaysdata.net/api/v1/travel/import/",
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        data: JSON.stringify(payload),
        onload: (response) => console.log(response),
    });
}

const items = scrapeStock();
if (Object.keys(items).length) {
    update(items);
}
