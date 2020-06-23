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
    thumbnail {
      base64
    }
    images {
      base64
    }
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

const imageWritePromises = [];
function saveImage(dataUrl, name) {
  const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

  if (matches.length !== 3) {
    return new Error("Invalid input string");
  }

  const type = matches[1];
  const data = Buffer.from(matches[2], "base64");

  let ext = "";
  switch (type) {
    case "image/png":
      ext = ".png";
      break;
    case "image/jpeg":
      ext = ".jpg";
      break;
    case "image/gif":
      ext = ".gif";
      break;
    default:
      throw new Error("Unkown file type: " + type);
  }

  const fileName = name + ext;
  imageWritePromises.push(
    write(`./public/submissions/${fileName}`, data)
      .then(() => console.log(`wrote ` + fileName))
      .catch((e) => console.error(e))
  );

  return fileName;
}

function extractImages(projects) {
  for (let i = 0; i < projects.length; i++) {
    // Extract Thumbnail
    if (projects[i].thumbnail && projects[i].thumbnail.base64) {
      const name = projects[i].name + "-thumbnail";
      projects[i].thumbnail = saveImage(projects[i].thumbnail.base64, name);
    }

    // Extract images
    if (projects[i].images && projects[i].images.length > 0) {
      let images = [];
      projects[i].images.forEach((image, index) => {
        if (image.base64) {
          const name = projects[i].name + "-" + (index + 1);
          images.push(saveImage(image.base64, name));
        }
      });
      projects[i].images = images;
    }
  }
}

function extractYouTubeVideoIds(projects) {
  const reg = /(.*?)(^|\/|v=)([a-z0-9_-]{11})(.*)?/gim;

  for (let i = 0; i < projects.length; i++) {
    if (projects[i].videoUrl) {
      if (projects[i].videoUrl.includes("youtu")) {
        const matches = reg.exec(projects[i].videoUrl);
        if (matches && matches[3]) {
          projects[i].youTubeVideoId = matches[3];
        }
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
    extractYouTubeVideoIds(parsed.data.projects);

    extractImages(parsed.data.projects);
    await Promise.all(imageWritePromises);

    write("./public/submissions/projects.json", JSON.stringify(parsed))
      .then(() => console.log(`wrote projects.json`))
      .catch((e) => console.error(e));
  })
  .catch((error) => console.error(error));
