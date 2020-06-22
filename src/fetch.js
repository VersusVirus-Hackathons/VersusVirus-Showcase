const fetch = require("node-fetch");
const custom = require("./projects-custom.json");
const { promisify } = require("util");
const fs = require("fs");
const write = promisify(fs.writeFile);

const query = `{
  projects(where: {
    isPublished: {
      equals: true
    }
  }
    first: 50
  ) {
    id
    title
    tagline
    description
    technologiesUsed
    obstacles
    accomplishments
    learnings
    nextSteps
    videoUrl
    urls
    relevanceToHackathon
    relevanceToChallenge
    longTermImpact
    progressDuringHackathon
    valueAdded
    team {
      primaryTopic {
        id,
        title
      }
    }
  }
}`;

function mergeById(a, b) {
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      if (b[j].id === a[i].id) {
        Object.assign(a[i], b[j]);
      }
    }
  }
}

fetch("https://app.versusvirus.ch/api/graphql", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Accept-Encoding": "gzip, deflate, br",
    Accept: "application/json",
    Connection: "keep-alive",
    DNT: "1",
    Origin: "https://app.versusvirus.ch",
  },
  body: JSON.stringify({ query }),
})
  .then(async (res) => {
    const parsed = await res.json();

    mergeById(parsed.data.projects, custom.data.projects);

    write(`./public/submissions/projects.json`, JSON.stringify(parsed))
      .then(() => console.log(`wrote projects.json`))
      .catch((e) => console.error(e));
  })
  .catch((error) => console.error(error));
