const interests = ["founders", "visual", "commerce", "culture"];
const modes = ["founder", "creative", "minimal", "future"];
const depths = ["quick", "case", "gallery", "hire"];
const projects = [
  { slug: "linkedin-creator", interests: ["founders", "visual"], type: "Concept system" },
  { slug: "airbnb-nomad", interests: ["founders", "visual"], type: "Immersive product concept" },
  { slug: "netflix-altitude", interests: ["visual"], type: "Entertainment concept" },
  { slug: "spotify-drive", interests: ["visual", "founders"], type: "Mobility concept" },
  { slug: "aryav", interests: ["founders", "visual"], type: "Client-style luxury website" },
  { slug: "aarna-salon", interests: ["commerce", "founders"], type: "Client-style service brand" },
  { slug: "jaabili", interests: ["visual", "culture"], type: "Destination experience" },
  { slug: "naad", interests: ["culture", "commerce"], type: "Cultural commerce" },
  { slug: "pawly", interests: ["commerce"], type: "Commerce and community" }
];

const depthProjectPriority = {
  quick: ["linkedin-creator", "airbnb-nomad", "netflix-altitude", "spotify-drive", "aarna-salon", "jaabili", "naad", "aryav", "pawly"],
  case: ["linkedin-creator", "airbnb-nomad", "spotify-drive", "aryav", "aarna-salon", "naad", "jaabili", "pawly", "netflix-altitude"],
  gallery: ["netflix-altitude", "spotify-drive", "airbnb-nomad", "linkedin-creator", "jaabili", "aryav", "naad", "aarna-salon", "pawly"],
  hire: ["aarna-salon", "linkedin-creator", "pawly", "airbnb-nomad", "aryav", "spotify-drive", "naad", "jaabili", "netflix-altitude"]
};

const questions = [
  [
    { id: "founder", mode: "founder", interest: "founders" },
    { id: "designer", mode: "creative", interest: "visual" },
    { id: "commerce", mode: "minimal", interest: "commerce" },
    { id: "culture", mode: "future", interest: "culture" }
  ],
  [
    { id: "proof", mode: "founder", interest: "founders" },
    { id: "motion", mode: "creative", interest: "visual" },
    { id: "flow", mode: "minimal", interest: "commerce" },
    { id: "story", mode: "future", interest: "culture" }
  ],
  [
    { id: "focused", mode: "founder" },
    { id: "cinematic", mode: "creative" },
    { id: "minimal", mode: "minimal" },
    { id: "future", mode: "future" }
  ],
  [
    { id: "short", depth: "quick" },
    { id: "case", depth: "case" },
    { id: "visual", interest: "visual", depth: "gallery" },
    { id: "contact", interest: "founders", depth: "hire" }
  ]
];

function highestScore(items, selected) {
  return items
    .map((item, index) => ({ item, index, score: selected.filter((value) => value === item).length }))
    .sort((a, b) => b.score - a.score || a.index - b.index)[0]?.item;
}

function modeForInterest(interest) {
  if (interest === "founders") return "founder";
  if (interest === "commerce") return "minimal";
  if (interest === "culture") return "future";
  return "creative";
}

function roomForInterest(interest, depth = "quick") {
  const suffix = depth === "case" ? " Casebook" : depth === "gallery" ? " Gallery" : depth === "hire" ? " Studio" : " Room";
  if (interest === "founders") return `Proof${suffix}`;
  if (interest === "commerce") return `Flow${suffix}`;
  if (interest === "culture") return `Story${suffix}`;
  return `Motion${suffix}`;
}

function derive(choices) {
  const interest = highestScore(interests, choices.map((choice) => choice.interest).filter(Boolean)) ?? "visual";
  const mode = highestScore(modes, choices.map((choice) => choice.mode).filter(Boolean)) ?? modeForInterest(interest);
  const depth = highestScore(depths, choices.map((choice) => choice.depth).filter(Boolean)) ?? "quick";
  const signature = choices.map((choice) => choice.id).join(":");
  return { interest, mode, depth, room: roomForInterest(interest, depth), signature };
}

function getCuratedProjects(result) {
  const primary = projects.filter((project) => project.interests.includes(result.interest));
  return rankProjects(primary, result.interest, result.depth, result.mode, result.signature);
}

function rankProjects(items, interest, depth, mode, signature) {
  const priority = depthProjectPriority[depth];
  const offset = signatureScore(signature) % Math.max(items.length, 1);
  return [...items].sort((a, b) => {
    const aScore = projectScore(a, interest, depth, mode, priority);
    const bScore = projectScore(b, interest, depth, mode, priority);
    if (aScore !== bScore) return bScore - aScore;
    return rotatedIndex(priority.indexOf(a.slug), offset, priority.length) - rotatedIndex(priority.indexOf(b.slug), offset, priority.length);
  });
}

function projectScore(project, interest, depth, mode, priority) {
  let score = 100 - priority.indexOf(project.slug);
  if (project.interests.includes(interest)) score += 50;
  if (depth === "hire" && (project.type.includes("Client-style") || project.interests.includes("commerce"))) score += 30;
  if (depth === "gallery" && project.interests.includes("visual")) score += 28;
  if (depth === "case" && project.interests.includes("founders")) score += 24;
  if (mode === "future" && project.interests.includes("culture")) score += 18;
  if (mode === "minimal" && project.interests.includes("commerce")) score += 18;
  return score;
}

function rotatedIndex(index, offset, length) {
  const safeIndex = index < 0 ? length : index;
  return (safeIndex + offset) % Math.max(length, 1);
}

function signatureScore(signature) {
  return signature.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
}

const seen = {
  interests: new Set(),
  modes: new Set(),
  depths: new Set(),
  rooms: new Set()
};
const projectSets = new Set();

let total = 0;

for (const visitor of questions[0]) {
  for (const goal of questions[1]) {
    for (const mood of questions[2]) {
      for (const depth of questions[3]) {
        const result = derive([visitor, goal, mood, depth]);
        total += 1;

        if (!interests.includes(result.interest)) throw new Error(`Invalid interest: ${result.interest}`);
        if (!modes.includes(result.mode)) throw new Error(`Invalid mode: ${result.mode}`);
        if (!depths.includes(result.depth)) throw new Error(`Invalid depth: ${result.depth}`);
        if (!result.room || !result.room.includes(" ")) throw new Error(`Invalid room: ${result.room}`);
        if (!result.signature.includes(":")) throw new Error(`Invalid signature: ${result.signature}`);

        const curatedProjects = getCuratedProjects(result);
        if (!curatedProjects.length) throw new Error(`No curated projects for ${JSON.stringify(result)}`);
        if (result.interest !== "all" && curatedProjects.some((project) => !project.interests.includes(result.interest))) {
          throw new Error(`Non-matching project entered primary curation for ${JSON.stringify(result)}`);
        }

        seen.interests.add(result.interest);
        seen.modes.add(result.mode);
        seen.depths.add(result.depth);
        seen.rooms.add(result.room);
        projectSets.add(`${result.room}::${curatedProjects.map((project) => project.slug).join(",")}`);
      }
    }
  }
}

if (total !== 256) throw new Error(`Expected 256 combinations, checked ${total}`);
if (seen.interests.size !== interests.length) throw new Error("Not every interest can be reached");
if (seen.modes.size !== modes.length) throw new Error("Not every mode can be reached");
if (seen.depths.size !== depths.length) throw new Error("Not every depth can be reached");
if (seen.rooms.size < 12) throw new Error(`Expected broad room variation, found ${seen.rooms.size}`);
if (projectSets.size < 16) throw new Error(`Expected every room to have a curated project set, found ${projectSets.size}`);

console.log(`Curation combinations passed: ${total}`);
console.log(`Unique portfolio rooms: ${seen.rooms.size}`);
console.log(`Unique room/project curations: ${projectSets.size}`);
