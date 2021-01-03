const fs = require("fs");
const sizeOf = require("image-size");
const sharp = require("sharp");

const allFiles = fs.readdirSync("./images");

for (const file of allFiles) {
  const { width, height } = sizeOf("./images/" + file);

  if (width > height) {
    sharp("./images/" + file)
      .resize(420, 300)
      .toFile("./images-resized/" + file, (err, info) => {});
  } else {
    sharp("./images/" + file)
      .resize(300, 420)
      .toFile("./images-resized/" + file, (err, info) => {});
  }
}
