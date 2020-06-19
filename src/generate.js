const fs = require("fs");
const templateEngine = require("eta");
const { data } = require("../public/submissions/projects.json");
const { promisify } = require("util");
const read = promisify(fs.readFile);
const write = promisify(fs.writeFile);
const sanitize = require("sanitize-filename");

const idToName = {
  "10008d3f-9f35-489b-b39b-762163b7e3f2": "visitor-box",
  "1796d464-6777-49fd-9317-828f8b38bcb0": "crowdy",
  "1a2a9ea5-5567-4b7e-8f39-5139b8a50f17": "vamos",
  "251fd5bc-0b0b-4255-8cee-467d3410faa9": "lokaler-einkauf",
  "2bb3f36f-cc3c-49c8-9de6-d741fb0e143e": "prevails",
  "2c3d5287-6f89-4d33-b250-cb47e728dbf6": "covid-19-trials",
  "44ae33e4-e05b-4ec8-8017-dd943e7df2b2": "swiss-delivery",
  "454499ba-d8c7-402e-becf-ca32981f40c6": "old-school",
  "52096ed4-c5ba-4e67-81db-2ea57fcd0399": "arise",
  "7789240c-fe6c-4249-98fa-169f01d4f8b5": "fact-o-meter",
  "81c38b0c-9755-416b-86cc-80faa72ffdac": "worldschool",
  "828b6e1a-d68f-473e-befa-44513504389b": "allyship",
  "8b1fabec-c2bc-45e2-bb52-708b63d5ea8d": "corona-reduit",
  "8b580c85-bccf-4e2c-949b-b355cb05991d": "happy-spark",
  "be46d18f-67d9-4b91-b48f-4d732c577180": "dolce-covida",
  "cc3ecdef-54e9-447e-a8d9-f662c8502379": "hyperlocal",
  "d409a247-9235-4b38-b451-01ee617b0eac": "boost-your-business",
  "d7b9e08c-e6da-4b5c-ae58-194953cf1937": "art-hub-live",
  "e7ad3426-fc3c-4c98-bbf3-df25299a79e3": "citizen-empowerment",
};

for (let index = 0; index < data.projects.length; index++) {
  data.projects[index].name = idToName[data.projects[index].id];
}

read("./src/project.html")
  .then((template) => {
    data.projects.forEach((project) => {
      const rendered = templateEngine.render(template.toString(), project);
      write(`./public/submissions/${project.name}.html`, rendered)
        .then(() => console.log(`wrote ${project.name}`))
        .catch((e) => console.error(e));
    });
  })
  .catch((e) => console.error(e));

read("./src/index.html")
  .then((template) => {
    const rendered = templateEngine.render(template.toString(), data);
    write(`./public/submissions/index.html`, rendered)
      .then(() => console.log(`wrote index`))
      .catch((e) => console.error(e));
  })
  .catch((e) => console.error(e));
