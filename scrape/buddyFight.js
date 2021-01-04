const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const URL = "https://opentheflag.com/sets";

// nelson@ccb.wtf user id
const USER_ID = "8Bc95lVsDFOVRYhPeTWaMndKRZC2";

const RESUME_POINT = "Dragonic Force";

let startDownloading = true;

const main = async () => {
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
        const setNames = $(".card-sets > ul:first-child > li > a", cardPage)
          .map(function () {
            return $(this).text();
          })
          .get();
        const tags = [...attributes, ...setNames];

        // Update script
        await axios.put(`http://localhost:5001/api/v1/cards`, {
          name: cardName,
          tags,
        });

        // const cardId = (
        //   await axios.post("http://localhost:5001/api/v1/cards", {
        //     tags,
        //     createdBy: USER_ID,
        //   })
        // ).data;

        // const imageLink = $(".card-image > a", cardPage).attr("href");
        // const buffer = (
        //   await axios.get(imageLink, { responseType: "arraybuffer" })
        // ).data;
        // fs.writeFileSync("./images/" + cardId + ".png", buffer);
      }

      setPage = (await axios.get(setPageLink + `?page=${++currPage}`)).data;
    }
  }
};

// main();

const COOKIE =
  "_ga=GA1.2.1889950943.1609658725; _gid=GA1.2.928663259.1609658725; _gat=1; XSRF-TOKEN=eyJpdiI6Ik1jS3ZSd1FoWjBNNGN5bU5oL29hbXc9PSIsInZhbHVlIjoiMEE1M1ZyNkJwOHNvUm84TnZaMU9TTkl0bEJROWRKNU9ZYzRQYzJ1WTh1bGhWTUg4TVF6OGRqUXlndzl1K3k0SVUwOXhZajRRRUNNM20vcG9GZzBKVlRHa1FsZ2R5bEhscjZWbkNSdzJNdU9PWGlXTGNWa2Fmam01YXdhTDVGY0QiLCJtYWMiOiIwNmNjZThmZTc2YWI4Yjc1YWQ2ZWE4OGJmNDAyOWU4ZDc5YzUwN2MyZGY5M2UzZWUzYWRmOWU5ZjM5MDRiMzU0In0%3D; open_the_flag_session=eyJpdiI6InVObGJCVjJxb0lndElEeTJPR1JUeVE9PSIsInZhbHVlIjoiU2lSanFWeGNUcWVxWFJkR0hWQXJnL3lLcEJoOTZqZVVjWGlLRXhJYkxJOGdQTVVFTnpqR3FMOHZSeGlwazEyaWY4UWd1cEhyK1VhRmRKdGFEeE9aaXJ3ZHZ4QUZWZjBiN1VoQnptd21HQzBxZ2YydlJUbzBFODNCVzc5ZHlNcm8iLCJtYWMiOiIxMTdiZTY1OWQzOGE5NzEzNTUzMmQ3OGVlMGI3NGVhMWFmYmNmNmMxNGM3ZjIwNjhhZDNmZDU1YjZlMWIxM2ZiIn0%3D; view_mode=full";

async function createDecks() {
  const WIKI_URL = "https://buddyfight.fandom.com/wiki/Trial_Decks";
  const html = (await axios.get(WIKI_URL)).data;
  const $ = cheerio.load(html);

  const wikiDeckNames = $("#gallery-0 .lightbox-caption > a")
    .map(function () {
      return {
        title: $(this).text().trim(),
        splitTitle: $(this).text().trim().split(": ")[1].trim(),
        link: "https://buddyfight.fandom.com" + $(this).attr("href"),
      };
    })
    .get();

  // console.log(wikiDeckNames);

  const openHtml = (await axios.get(URL)).data;
  const openDeckNames = $("#sets h2:nth-child(3) + div > .set", openHtml)
    .map(function () {
      return {
        title: $(this).text().trim(),
        splitTitle: $(this).text().trim().split(": ")[1],
        link: $("a", this).attr("href").trim(),
      };
    })
    .get();

  const decksInBoth = wikiDeckNames.reduce((acc, deck) => {
    const openDeck = openDeckNames.find(
      (openDeck) => openDeck.splitTitle === deck.splitTitle
    );
    if (openDeck) {
      return [
        ...acc,
        { ...deck, openDeckTitle: openDeck.title, openDeckLink: openDeck.link },
      ];
    }

    return acc;
  }, []);

  // console.log(decksInBoth);
  // console.log(decksInBoth.length);

  for (const deck of decksInBoth) {
    let cards = [];
    const html = (await axios.get(deck.link)).data;
    const openHtml = (
      await axios.get(deck.openDeckLink, { headers: { cookie: COOKIE } })
    ).data;

    const openDeckCardNames = $("h2", openHtml)
      .map(function () {
        return $(this).text().trim();
      })
      .get();

    // console.log(openDeckCardNames);

    const quantities = $("table:first-of-type td:nth-child(6)", html);
    const names = $("td:nth-child(3) > a", html).get();

    for (let i = 0; i < names.length; i++) {
      const cardName = $(names[i]).text().trim();
      const quantity = $(quantities[i]).text().trim();

      cards.push({
        quantity: +quantity,
        name: openDeckCardNames[i],
      });
    }

    await axios.post("http://localhost:5001/api/v1/decks/by-name", {
      name: deck.openDeckTitle,
      cards,
      createdBy: USER_ID,
    });

    console.log(deck.openDeckTitle);
    // break;
  }
}

createDecks();
