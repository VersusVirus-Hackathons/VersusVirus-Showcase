const fs = require("fs");
const templateEngine = require("eta");
const { data } = require("./data.json");
const { promisify } = require("util");
const read = promisify(fs.readFile);
const write = promisify(fs.writeFile);

read("./src/project.html")
  .then((template) => {
    data.projects.forEach((project) => {
      const rendered = templateEngine.render(template.toString(), project);
      write(`./public/submissions/${project.id}.html`, rendered)
        .then(() => console.log(`wrote ${project.id}`))
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
