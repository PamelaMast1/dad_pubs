// One-off build step: converts the source spreadsheet (kept outside the repo)
// into the static JSON files the site fetches at runtime.
//
// Usage: node scripts/build-data.mjs [path-to-ALLPUBS.xlsx]

import XLSX from "xlsx";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const outDir = join(repoRoot, "public", "data");
mkdirSync(outDir, { recursive: true });

const inputPath =
  process.argv[2] ?? "C:\\Users\\Pamela\\Downloads\\ALLPUBS\\ALLPUBS.xlsx";

console.log(`Reading ${inputPath} ...`);
const workbook = XLSX.readFile(inputPath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: "" });

const VENUE_TYPES = {
  P: "Pub",
  "P.": "Pub",
  H: "Hotel",
  C: "Club",
  B: "Bar",
  W: "Wine Bar",
};

// --- County normalisation -------------------------------------------------
// The source column is 60+ years of handwritten/abbreviated county names
// with typos and inconsistent styling. This maps the common forms to a
// canonical display name. Anything not matched here is kept as-is and
// simply excluded from the map view (it still appears in the table/filters).
const COUNTY_MAP = {
  "yorks.": "Yorkshire", yorks: "Yorkshire",
  kent: "Kent",
  sussex: "Sussex",
  "hants.": "Hampshire", hants: "Hampshire", aldershot: "Hampshire",
  essex: "Essex",
  "lancs.": "Lancashire", lancs: "Lancashire",
  herts: "Hertfordshire", "herts.": "Hertfordshire",
  midlands: "Midlands", midland: "Midlands", centre: "Midlands",
  surrey: "Surrey",
  "derbys.": "Derbyshire", derbys: "Derbyshire",
  "staffs.": "Staffordshire", staffs: "Staffordshire",
  devon: "Devon",
  "berks.": "Berkshire", berks: "Berkshire",
  "notts.": "Nottinghamshire", notts: "Nottinghamshire",
  "oxon.": "Oxfordshire", oxon: "Oxfordshire", oxford: "Oxfordshire", "oxford rd.": "Oxfordshire",
  cheshire: "Cheshire", "ches.": "Cheshire",
  "bucks.": "Buckinghamshire", bucks: "Buckinghamshire",
  norfolk: "Norfolk", norwich: "Norfolk",
  "cambs.": "Cambridgeshire", cambs: "Cambridgeshire",
  "leices.": "Leicestershire", leices: "Leicestershire",
  "beds.": "Bedfordshire",
  manchester: "Greater Manchester",
  "glouces.": "Gloucestershire", "glouces": "Gloucestershire", "glouces. (s)": "Gloucestershire",
  "wilts.": "Wiltshire", wilts: "Wiltshire",
  suffolk: "Suffolk",
  dorset: "Dorset",
  avon: "Avon", bristol: "Avon",
  "lincs.": "Lincolnshire",
  somerset: "Somerset", somerton: "Somerset",
  "warwicks.": "Warwickshire", warwicks: "Warwickshire",
  "northants.": "Northamptonshire", northants: "Northamptonshire",
  "worces.": "Worcestershire",
  strathclyde: "Strathclyde",
  lothian: "Lothian", "lothian (e)": "Lothian", "west lothian": "Lothian",
  "salop.": "Shropshire", salop: "Shropshire", shropshire: "Shropshire",
  glamorgan: "Glamorgan", "glamorgan (s)": "South Glamorgan", "glamorgan (m)": "Mid Glamorgan",
  "glamorgan (mid)": "Mid Glamorgan", "glamorgan (w)": "West Glamorgan", "west glamorgan": "West Glamorgan",
  "mid-glamorgan": "Mid Glamorgan",
  merseyside: "Merseyside", mersey: "Merseyside", wirral: "Merseyside",
  liverpool: "Merseyside", toxteth: "Merseyside", southport: "Merseyside", "edge hill": "Merseyside",
  cumbria: "Cumbria", carlisle: "Cumbria",
  "tyne & wear": "Tyne & Wear", "tyne and wear": "Tyne & Wear", tyneside: "Tyne & Wear",
  northumbria: "Tyne & Wear",
  cornwall: "Cornwall",
  humberside: "Humberside",
  gwent: "Gwent",
  "isle of wight": "Isle of Wight",
  "gtr.london": "Greater London", "gtr. london": "Greater London", "grtr. london": "Greater London",
  "gter london": "Greater London", "gtr london": "Greater London", london: "Greater London",
  middlesex: "Middlesex",
  durham: "Durham", "co. durham": "Durham",
  gwynedd: "Gwynedd", anglesey: "Gwynedd",
  "herefs.": "Herefordshire",
  cleveland: "Cleveland", teeside: "Cleveland",
  dyfed: "Dyfed", carmarthen: "Dyfed", pembroke: "Dyfed",
  fife: "Fife",
  clwyd: "Clwyd", wrexham: "Clwyd", flintshire: "Clwyd", denbighshire: "Clwyd",
  ayrshire: "Ayrshire",
  tayside: "Tayside", angus: "Tayside",
  powys: "Powys", powis: "Powys",
  highland: "Highland", highlands: "Highland", inverness: "Highland", nairn: "Highland",
  caithness: "Highland", "isle of skye": "Highland", sutherland: "Highland", cromarty: "Highland",
  ross: "Highland",
  grampian: "Grampian", aberdeen: "Grampian", moray: "Grampian",
  galloway: "Dumfries & Galloway", dumfries: "Dumfries & Galloway",
  renfrew: "Renfrewshire",
  dunbarton: "Dunbartonshire",
  argyle: "Argyll & Bute", "argyll & bute": "Argyll & Bute", "isle of bute": "Argyll & Bute",
  borders: "Scottish Borders",
  "hunts.": "Huntingdonshire",
  birmingham: "West Midlands", "west midlands": "West Midlands",
  rutland: "Rutland",
  monmouth: "Monmouthshire",
  clackmannan: "Clackmannanshire",
  "perth/kinross": "Perth & Kinross",
  "north lanark": "Lanarkshire",
  "isle of arran": "Ayrshire",
  "isle of lewis": "Western Isles",
  "isle of man": "Isle of Man",
  "jersey (ci)": "Channel Islands",
  stirlings: "Central", "stirlings.": "Central", central: "Central",
};

function normaliseCounty(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return { display: "", canonical: "" };
  if (/^lon[a-z]*\s|^gt?r?\.?\s?london|^grtr/i.test(trimmed) || /^london/i.test(trimmed)) {
    return { display: "Greater London", canonical: "greater london" };
  }
  const key = trimmed.toLowerCase().replace(/\s+/g, " ");
  const mapped = COUNTY_MAP[key];
  if (mapped) return { display: mapped, canonical: mapped.toLowerCase() };
  return { display: trimmed, canonical: key };
}

// Approximate centroids for the canonical counties/regions above.
// Public geographic knowledge, not derived from the source data.
const CENTROIDS = {
  Yorkshire: [53.96, -1.08], Kent: [51.27, 0.52], Sussex: [50.91, -0.3],
  Hampshire: [51.06, -1.31], Essex: [51.77, 0.47], Lancashire: [53.79, -2.65],
  "Greater London": [51.51, -0.12], Hertfordshire: [51.8, -0.24],
  Midlands: [52.48, -1.9], Surrey: [51.26, -0.46], Derbyshire: [53.1, -1.55],
  Staffordshire: [52.84, -2.07], Devon: [50.79, -3.78], Berkshire: [51.45, -1.09],
  Nottinghamshire: [53.1, -1.1], Oxfordshire: [51.84, -1.25], Cheshire: [53.2, -2.6],
  Buckinghamshire: [51.8, -0.8], Norfolk: [52.7, 1.0], Cambridgeshire: [52.4, 0.1],
  Leicestershire: [52.63, -1.14], Bedfordshire: [52.08, -0.47],
  "Greater Manchester": [53.48, -2.24], Gloucestershire: [51.86, -2.24],
  Wiltshire: [51.35, -1.99], Suffolk: [52.2, 1.0], Dorset: [50.78, -2.44],
  Avon: [51.46, -2.6], Lincolnshire: [53.1, -0.3], Somerset: [51.05, -3.0],
  Warwickshire: [52.28, -1.59], Northamptonshire: [52.3, -0.85],
  Worcestershire: [52.19, -2.22], Strathclyde: [55.86, -4.25],
  Lothian: [55.95, -3.19], Shropshire: [52.7, -2.75], Glamorgan: [51.57, -3.3],
  "South Glamorgan": [51.48, -3.18], "Mid Glamorgan": [51.57, -3.42],
  "West Glamorgan": [51.63, -3.95], Merseyside: [53.41, -2.98], Cumbria: [54.57, -3.0],
  "Tyne & Wear": [54.97, -1.6], Cornwall: [50.42, -4.75], Humberside: [53.74, -0.33],
  Gwent: [51.67, -2.98], "Isle of Wight": [50.69, -1.32], Middlesex: [51.53, -0.38],
  Durham: [54.78, -1.57], Gwynedd: [52.91, -4.0], Herefordshire: [52.06, -2.72],
  Cleveland: [54.57, -1.23], Dyfed: [51.9, -4.3], Fife: [56.25, -3.2], Clwyd: [53.08, -3.3],
  Ayrshire: [55.46, -4.63], Tayside: [56.46, -3.4], Powys: [52.35, -3.4],
  Highland: [57.48, -4.22], Grampian: [57.17, -2.5], "Dumfries & Galloway": [55.07, -3.6],
  Renfrewshire: [55.85, -4.5], Dunbartonshire: [55.95, -4.5], "Argyll & Bute": [56.1, -5.3],
  "Scottish Borders": [55.58, -2.73], Huntingdonshire: [52.33, -0.18],
  "West Midlands": [52.49, -1.89], Rutland: [52.65, -0.65], Monmouthshire: [51.8, -2.9],
  Clackmannanshire: [56.17, -3.75], "Perth & Kinross": [56.6, -3.75],
  Lanarkshire: [55.68, -3.78], "Western Isles": [58.0, -6.5], "Isle of Man": [54.25, -4.5],
  "Channel Islands": [49.21, -2.13], Central: [56.1, -4.0],
};

// --- Date parsing ----------------------------------------------------------
// Format observed is D.M.YY, where a 0 means "unknown" for that component
// (e.g. "0.10.60" = sometime in Oct 1960, "0.0.62" = sometime in 1962).
function parseDate(raw) {
  const parts = String(raw).trim().split(".");
  if (parts.length !== 3) return { y: null, m: null, d: null };
  const [dPart, mPart, yPart] = parts;
  // A handful of rows have a mistyped extra digit in the year (e.g. "22.1.286").
  // Rather than guess the intended year, treat the whole date as unrecorded.
  if (!/^\d{1,2}$/.test(yPart)) return { y: null, m: null, d: null };
  const d = parseInt(dPart, 10);
  const m = parseInt(mPart, 10);
  const yy = parseInt(yPart, 10);
  if (Number.isNaN(yy)) return { y: null, m: null, d: null };
  const y = yy <= 25 ? 2000 + yy : 1900 + yy;
  return { y, m: m > 0 ? m : null, d: d > 0 ? d : null };
}

const records = [];
const countyCounts = new Map(); // canonical -> { display, count }
const unmatchedCounties = new Map();

for (const row of rows) {
  const [dateRaw, name, town, county, address, status, type] = row;
  if (!name || !String(name).trim()) continue;

  const { y, m, d } = parseDate(dateRaw);
  const { display: countyDisplay, canonical } = normaliseCounty(String(county ?? ""));
  const statusText = String(status ?? "").trim();
  const closed = /^closed/i.test(statusText);
  const venueType = VENUE_TYPES[String(type ?? "").trim()] ?? "Other";

  records.push({
    y, m, d,
    name: String(name).trim(),
    town: String(town ?? "").trim(),
    county: countyDisplay,
    address: String(address ?? "").trim(),
    type: venueType,
    closed,
    note: statusText,
  });

  if (countyDisplay) {
    if (!countyCounts.has(canonical)) countyCounts.set(canonical, { display: countyDisplay, count: 0 });
    countyCounts.get(canonical).count++;
    if (!CENTROIDS[countyDisplay]) {
      unmatchedCounties.set(countyDisplay, (unmatchedCounties.get(countyDisplay) ?? 0) + 1);
    }
  }
}

console.log(`Parsed ${records.length} pub visits.`);

// --- counties.json (for the map view) --------------------------------------
const counties = [...countyCounts.values()]
  .filter((c) => CENTROIDS[c.display])
  .map((c) => ({
    county: c.display,
    lat: CENTROIDS[c.display][0],
    lon: CENTROIDS[c.display][1],
    count: c.count,
  }))
  .sort((a, b) => b.count - a.count);

const mappedTotal = counties.reduce((s, c) => s + c.count, 0);
console.log(
  `Mapped ${counties.length} counties covering ${mappedTotal}/${records.length} visits ` +
    `(${((mappedTotal / records.length) * 100).toFixed(1)}%).`
);
if (unmatchedCounties.size) {
  console.log(`${unmatchedCounties.size} county labels have no centroid (shown in table only):`);
  console.log([...unmatchedCounties.entries()].sort((a, b) => b[1] - a[1]).slice(0, 30));
}

// --- stats.json (fun facts) --------------------------------------------------
const byYear = new Map();
const byDecade = new Map();
const nameCounts = new Map();
const townCounts = new Map();
let closedCount = 0;
let firstVisit = null;
let lastVisit = null;
const dayCounts = new Map(); // "y-m-d" -> count, to find busiest single day

for (const r of records) {
  if (r.closed) closedCount++;
  if (r.y) {
    byYear.set(r.y, (byYear.get(r.y) ?? 0) + 1);
    const decade = Math.floor(r.y / 10) * 10;
    byDecade.set(decade, (byDecade.get(decade) ?? 0) + 1);
  }
  nameCounts.set(r.name, (nameCounts.get(r.name) ?? 0) + 1);
  if (r.town) townCounts.set(r.town, (townCounts.get(r.town) ?? 0) + 1);

  if (r.y && r.m && r.d) {
    const key = `${r.y}-${r.m}-${r.d}`;
    const existing = dayCounts.get(key);
    dayCounts.set(key, { y: r.y, m: r.m, d: r.d, count: (existing?.count ?? 0) + 1 });
    const stamp = r.y * 10000 + r.m * 100 + r.d;
    if (!firstVisit || stamp < firstVisit.stamp) firstVisit = { ...r, stamp };
    if (!lastVisit || stamp > lastVisit.stamp) lastVisit = { ...r, stamp };
  }
}

const topN = (map, n) =>
  [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => ({ key: k, count: v }));

const busiestDay = [...dayCounts.values()].sort((a, b) => b.count - a.count)[0] ?? null;

const stats = {
  totalVisits: records.length,
  totalClosed: closedCount,
  totalStillOpen: records.length - closedCount,
  distinctPubNames: nameCounts.size,
  distinctTowns: townCounts.size,
  distinctCounties: countyCounts.size,
  byYear: [...byYear.entries()].sort((a, b) => a[0] - b[0]).map(([year, count]) => ({ year, count })),
  byDecade: [...byDecade.entries()].sort((a, b) => a[0] - b[0]).map(([decade, count]) => ({ decade, count })),
  byType: topN(
    records.reduce((m, r) => (m.set(r.type, (m.get(r.type) ?? 0) + 1), m), new Map()),
    10
  ),
  mostCommonNames: topN(nameCounts, 15),
  mostVisitedTowns: topN(townCounts, 15),
  firstVisit,
  lastVisit,
  busiestDay,
  longestPubName: [...nameCounts.keys()].sort((a, b) => b.length - a.length)[0],
};

writeFileSync(join(outDir, "pubs.json"), JSON.stringify(records));
writeFileSync(join(outDir, "counties.json"), JSON.stringify(counties));
writeFileSync(join(outDir, "stats.json"), JSON.stringify(stats, null, 2));

console.log(`Wrote pubs.json, counties.json, stats.json to ${outDir}`);
