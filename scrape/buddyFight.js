const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const URL = "https://opentheflag.com/sets";

// nelson@ccb.wtf user id
const USER_ID = "8Bc95lVsDFOVRYhPeTWaMndKRZC2";

const RESUME_POINT = "Drum’s Adventures";

let startDownloading = false;

(async () => {
  const html = (await axios.get(URL)).data;
  const $ = cheerio.load(html);

  const sets = $(".set > a").get();
  for (const set of sets) {
    const setName = $(set).text();
    if (setName.includes(RESUME_POINT)) {
      startDownloading = true;
    }

    if (!startDownloading) {
      continue;
    }
    console.log(setName);
    let setPageLink = $(set).attr("href");
    let setPage = (await axios.get(setPageLink)).data;
    let currPage = 1;

    while ($(".list-empty", setPage).length < 1) {
      const cardLinksInSet = $(".card-view-mode-gallery > a", setPage).get();
      for (const cardLinkInSet of cardLinksInSet) {
        const cardLink = $(cardLinkInSet).attr("href");
        let cardPage = (await axios.get(cardLink)).data;

        while (!cardPage) {
          cardPage = (await axios.get(cardLink)).data;
        }

        const cardName = $("h1", cardPage).text().trim();
        const attributes = $(".card-attributes", cardPage)
          .text()
          .trim()
          .split("/\n");
        const setName = $(
          ".card-sets > ul:first-child > li:first-child > a",
          cardPage
        ).text();
        const tags = [cardName, ...attributes, setName];

        const cardId = (
          await axios.post("http://localhost:5000/api/v1/cards", {
            tags,
            createdBy: USER_ID,
          })
        ).data;

        const imageLink = $(".card-image > a", cardPage).attr("href");
        const buffer = (
          await axios.get(imageLink, { responseType: "arraybuffer" })
        ).data;
        fs.writeFileSync("./images/" + cardId + ".png", buffer);
      }

      setPage = (await axios.get(setPageLink + `?page=${++currPage}`)).data;
    }
  }
})();

[
  "Godly-speed Bal Dragon",
  "Sun Dragon",
  "Triple D Booster Pack Alternative Vol.1: Buddy Rave",
];
