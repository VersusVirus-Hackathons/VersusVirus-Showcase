const scrape = require("website-scraper");
const options = {
  urls: ["https://app.versusvirus.ch/submissions"],
  directory: "./scraped/",
  recursive: true,
  maxRecursiveDepth: 1,
  filenameGenerator: 'bySiteStructure',
};

scrape(options).then((result) => {
  console.log("done");
});
