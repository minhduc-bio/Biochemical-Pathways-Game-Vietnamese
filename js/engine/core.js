(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
function list(pathway) {
var out = [];
var seen = {};
function add(s) { if (!seen[s.id]) { seen[s.id] = true; out.push(s); } }
function nodeSlot(nodeId, rxnId) {
add({
id: 'node:' + nodeId, kind: 'node', rxn: rxnId, node: nodeId, index: 0,
entityKind: 'molecule', answer: pathway.nodes[nodeId].mol, group: null
});
}
(pathway.start || []).forEach(function (n) { nodeSlot(n, null); });
pathway.order.forEach(function (rid) {
var r = pathway.reactions.filter(function (x) { return x.id === rid; })[0];
r.substrates.forEach(function (n) { nodeSlot(n, rid); });
r.products.forEach(function (n) { nodeSlot(n, rid); });
(r.arrows || []).forEach(function (a) {
if (a.from && pathway.nodes[a.from]) { nodeSlot(a.from, rid); }
if (a.to && pathway.nodes[a.to]) { nodeSlot(a.to, rid); }
});
add({ id: 'enz:' + rid, kind: 'enz', rxn: rid, node: null, index: 0, entityKind: 'enzyme', answer: r.enzyme, group: null });
r.ins.forEach(function (c, i) {
add({ id: 'in:' + rid + ':' + i, kind: 'in', rxn: rid, node: null, index: i, entityKind: 'cofactor', answer: c, group: 'in:' + rid });
});
r.outs.forEach(function (c, i) {
add({ id: 'out:' + rid + ':' + i, kind: 'out', rxn: rid, node: null, index: i, entityKind: 'cofactor', answer: c, group: 'out:' + rid });
});
});
Object.keys(pathway.nodes || {}).forEach(function (n) { nodeSlot(n, null); });
return out;
}
function parse(id) {
var p = id.split(':');
if (p[0] === 'node') { return { kind: 'node', node: p[1] }; }
if (p[0] === 'enz') { return { kind: 'enz', rxn: p[1] }; }
return { kind: p[0], rxn: p[1], index: +p[2] };
}
MG.slots = { list: list, parse: parse };
})(typeof window !== 'undefined' ? window : globalThis);

(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
var KINDS = ['molecule', 'enzyme', 'cofactor'];
var FUZZY_MIN = 6;   // shorter spellings are too close to other short words to trust
var CHAR_MAP = buildCharMap();
var indexes = {};
var everyKind = null;   // spellings of all kinds together, built on first use
var neverRef = null;    // the MG.entities.neverFuzzy array the cached set was built from
var neverSet = new Set();
function buildCharMap() {
var map = {};
var d;
map['α'] = 'alpha';
map['β'] = 'beta';
map['γ'] = 'gamma';
map['δ'] = 'delta';
map['¹'] = '1';                       // superscript one, two and three are not in the blocks below
map['²'] = '2';
map['³'] = '3';
map['⁰'] = '0';                       // superscript zero
for (d = 4; d <= 9; d++) { map[String.fromCharCode(0x2070 + d)] = String(d); }   // superscript 4 to 9
for (d = 0; d <= 9; d++) { map[String.fromCharCode(0x2080 + d)] = String(d); }   // subscript 0 to 9
map['⁺'] = '+';                       // superscript plus
map['₊'] = '+';                       // subscript plus
map['−'] = '-';                       // Unicode minus sign
map['⁻'] = '-';                       // script minus signs are dropped by the final filter anyway
map['₋'] = '-';
map['ᵢ'] = 'i';                       // subscript small i, as in the phosphate label Pi
return map;
}
function normalize(str) {
if (str === null || str === undefined) { return ''; }
var s = String(str).toLowerCase().replace(/[^\x00-\x7f]/g, function (ch) {
return Object.prototype.hasOwnProperty.call(CHAR_MAP, ch) ? CHAR_MAP[ch] : ch;
});
return s.replace(/\+/g, 'plus').replace(/\*/g, 'star').replace(/[^a-z0-9]/g, '');
}
function digitsOf(key) {
return key.replace(/[^0-9]/g, '');
}
function allowance(len) {
return len >= 12 ? 2 : (len >= FUZZY_MIN ? 1 : 0);
}
function damerau(a, b) {
var n = a.length;
var m = b.length;
var i, j;
if (n === 0) { return m; }
if (m === 0) { return n; }
var INF = n + m;
var d = [];
for (i = 0; i < n + 2; i++) { d.push(new Array(m + 2).fill(0)); }
d[0][0] = INF;
for (i = 0; i <= n; i++) { d[i + 1][0] = INF; d[i + 1][1] = i; }
for (j = 0; j <= m; j++) { d[0][j + 1] = INF; d[1][j + 1] = j; }
var lastRowOf = new Map();                 // letter -> last row of a that held it
for (i = 1; i <= n; i++) {
var lastColMatch = 0;                  // last column of b that matched a[i]
for (j = 1; j <= m; j++) {
var k = lastRowOf.get(b.charAt(j - 1)) || 0;
var l = lastColMatch;
var cost = 1;
if (a.charAt(i - 1) === b.charAt(j - 1)) {
cost = 0;
lastColMatch = j;
}
d[i + 1][j + 1] = Math.min(
d[i][j] + cost,                          // substitute, or match at zero cost
d[i + 1][j] + 1,                         // insert
d[i][j + 1] + 1,                         // delete
d[k][l] + (i - k - 1) + 1 + (j - l - 1)  // transpose a pair further apart
);
}
lastRowOf.set(a.charAt(i - 1), i);
}
return d[n + 1][m + 1];
}
function conceptOf(kind, id) {
var table = MG.entities || {};
var k = kind;
var i = id;
for (var hop = 0; hop < 4; hop++) {
var rec = table[k] && table[k][i];
var t = rec && rec.twin;
if (!t || !table[t.kind] || !table[t.kind][t.id]) { break; }
k = t.kind;
i = t.id;
}
return k + ':' + i;
}
function buildIndex(kind) {
var table = MG.entities && MG.entities[kind];
if (!table || typeof table !== 'object') { return null; }
var idx = { ids: new Set(), exact: new Map(), all: [], acceptAlso: new Map() };
Object.keys(table).forEach(function (id) {
var rec = table[id];
var keys = new Map();                  // normalized key -> 'alias' or 'other'
var add = function (raw, via) {
var key = normalize(raw);
if (key !== '' && keys.get(key) !== 'alias') { keys.set(key, via); }
};
add(rec.name, 'alias');
(rec.aliases || []).forEach(function (a) { add(a, 'alias'); });
add(rec.short, 'other');
add(rec.display, 'other');
idx.ids.add(id);
idx.acceptAlso.set(id, (rec.acceptAlso || []).slice());
var concept = conceptOf(kind, id);
keys.forEach(function (via, key) {
var hit = idx.exact.get(key);
if (!hit) {
hit = { alias: [], other: [] };
idx.exact.set(key, hit);
}
(via === 'alias' ? hit.alias : hit.other).push(id);
idx.all.push({ id: id, key: key, owner: concept, digits: digitsOf(key) });
});
});
return idx;
}
function indexFor(kind) {
if (KINDS.indexOf(kind) < 0) { return null; }
if (!indexes[kind]) {
var built = buildIndex(kind);
if (!built) { return null; }
indexes[kind] = built;
}
return indexes[kind];
}
function everyKindData() {
if (!everyKind) {
everyKind = { exact: new Map(), candidates: [], byDigits: new Map() };
KINDS.forEach(function (kind) {
var idx = indexFor(kind);
if (!idx) { return; }
idx.exact.forEach(function (hit, key) {
var set = everyKind.exact.get(key);
if (!set) {
set = new Set();
everyKind.exact.set(key, set);
}
hit.alias.concat(hit.other).forEach(function (id) { set.add(conceptOf(kind, id)); });
});
idx.all.forEach(function (c) {
everyKind.candidates.push(c);
var bucket = everyKind.byDigits.get(c.digits);
if (!bucket) {
bucket = [];
everyKind.byDigits.set(c.digits, bucket);
}
bucket.push(c);
});
});
}
return everyKind;
}
function neverFuzzySet() {
var list = (MG.entities && Array.isArray(MG.entities.neverFuzzy)) ? MG.entities.neverFuzzy : [];
if (list !== neverRef) {
neverRef = list;
neverSet = new Set(list.map(function (s) { return normalize(s); }));
}
return neverSet;
}
function expandAccepted(idx, acceptIds, exact) {
var ids = Array.isArray(acceptIds) ? acceptIds : [acceptIds];
var out = [];
var take = function (id) {
if (typeof id === 'string' && idx.ids.has(id) && out.indexOf(id) < 0) { out.push(id); }
};
ids.forEach(take);
if (exact) { return out; }
ids.forEach(function (id) {
if (idx.acceptAlso.has(id)) { idx.acceptAlso.get(id).forEach(take); }
});
return out;
}
function nearestPerOwner(candidates, key) {
var best = new Map();
candidates.forEach(function (c) {
var allow = allowance(c.key.length);
if (allow === 0 || Math.abs(c.key.length - key.length) > allow) { return; }
var dist = damerau(key, c.key);
if (dist <= allow && (!best.has(c.owner) || dist < best.get(c.owner))) { best.set(c.owner, dist); }
});
return best;
}
function fuzzyPick(kind, idx, key, accepted) {
if (key.length < FUZZY_MIN) { return null; }
var data = everyKindData();
var sameDigits = data.byDigits.get(digitsOf(key));
if (!sameDigits) { return null; }
var near = nearestPerOwner(sameDigits, key);
var pick = null;
var pickDist = Infinity;
accepted.forEach(function (id) {
var dist = near.get(conceptOf(kind, id));
if (dist !== undefined && dist < pickDist) {
pick = id;
pickDist = dist;
}
});
if (pick === null) { return null; }
var acceptedConcepts = accepted.map(function (id) { return conceptOf(kind, id); });
var rivals = nearestPerOwner(data.candidates, key);
var rivalNear = false;
rivals.forEach(function (dist, owner) {
if (acceptedConcepts.indexOf(owner) < 0 && dist <= pickDist) { rivalNear = true; }
});
return rivalNear ? null : pick;
}
function resolveOne(kind, idx, key, accepted, typoBlocked) {
var none = { ok: false, id: null, how: null };
if (key === '') { return none; }
var owners = everyKindData().exact.get(key);
if (owners) {
for (var i = 0; i < accepted.length; i++) {
if (owners.has(conceptOf(kind, accepted[i]))) { return { ok: true, id: accepted[i], how: 'exact' }; }
}
return none;
}
if (typoBlocked || neverFuzzySet().has(key)) { return none; }
var pick = fuzzyPick(kind, idx, key, accepted);
return pick === null ? none : { ok: true, id: pick, how: 'fuzzy' };
}
function nameCommas(s) {
var out = [];
for (var i = 0; i < s.length; i++) {
if (s.charAt(i) !== ',') { continue; }
var before = s.slice(0, i).replace(/\s+$/, '').slice(-1);
var after = s.slice(i + 1).replace(/^\s+/, '').charAt(0);
if (!(/\d/.test(before) && /\d/.test(after))) { out.push(i); }
}
return out;
}
function explicitSplits(text) {
var s = String(text);
var out = [];
var paren = /^\s*([^()]*?)\s*\(\s*([^()]*?)\s*\)\s*$/.exec(s);
var dash = s.split(/\s+-\s*|\s*-\s+/);
var commas = nameCommas(s);
var comma = commas.length === 1 ? [s.slice(0, commas[0]), s.slice(commas[0] + 1)] : [s];
var strong = function (p) { return nameCommas(p).length > 0 || /\s-|-\s/.test(p); };
[paren ? [paren[1], paren[2]] : null, dash, comma].forEach(function (parts) {
if (parts && parts.length === 2 && parts[0].trim() !== '' && parts[1].trim() !== '' &&
!strong(parts[0]) && !strong(parts[1])) { out.push(parts); }
});
return out;
}
function implicitSplit(kind, idx, text, accepted) {
var none = { ok: false, id: null, how: null };
var s = String(text);
for (var p = 1; p < s.length; p++) {
var c = s.charAt(p);
var left = '';
var right = '';
if (c === ' ' || c === '-') {
left = s.slice(0, p);
right = s.slice(p + 1);
} else if (s.charAt(p - 1) === ')' || c === '(') {
left = s.slice(0, p);
right = s.slice(p);
} else {
continue;
}
var l = resolveOne(kind, idx, normalize(left), accepted, true);
if (!l.ok) { continue; }
var r = resolveOne(kind, idx, normalize(right), accepted, true);
if (r.ok && r.id === l.id && normalize(left) !== normalize(right)) { return { ok: true, id: l.id, how: 'exact' }; }
}
return none;
}
function check(kind, text, acceptIds, opts) {
var none = { ok: false, id: null, how: null };
var idx = indexFor(kind);
var key = normalize(text);
if (!idx || key === '') { return none; }
var accepted = expandAccepted(idx, acceptIds, !!(opts && opts.exact));
if (accepted.length === 0) { return none; }
var exact = resolveOne(kind, idx, key, accepted, true);
if (exact.ok) { return exact; }
if (everyKindData().exact.has(key)) { return none; }   // the whole text names another concept
var splits = explicitSplits(text);
if (splits.length) {
for (var i = 0; i < splits.length; i++) {
var a = resolveOne(kind, idx, normalize(splits[i][0]), accepted, false);
var b = resolveOne(kind, idx, normalize(splits[i][1]), accepted, false);
if (a.ok && b.ok && a.id === b.id && normalize(splits[i][0]) !== normalize(splits[i][1])) {
return { ok: true, id: a.id, how: a.how === 'exact' && b.how === 'exact' ? 'exact' : 'fuzzy' };
}
}
return none;   // an explicit two-name answer, and no reading credits one accepted concept
}
var bare = implicitSplit(kind, idx, text, accepted);
if (bare.ok) { return bare; }
if (/[()]|\s-|-\s/.test(text) || nameCommas(String(text)).length > 0) { return none; }
var whole = resolveOne(kind, idx, key, accepted, false);
return whole.ok ? whole : none;
}
function identify(kind, text) {
var idx = indexFor(kind);
var key = normalize(text);
if (!idx || key === '') { return null; }
var hit = idx.exact.get(key);
if (!hit) { return null; }
var list = hit.alias.length ? hit.alias : hit.other;
return list.length === 1 ? list[0] : null;
}
function reset() {
indexes = {};
everyKind = null;
neverRef = null;
}
MG.match = {
normalize: normalize,
identify: identify,
check: check,
reset: reset
};
})(typeof window !== 'undefined' ? window : globalThis);

(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
var KEY = 'mg.v1';
var HISTORY = 10;
var KINDS = ['node', 'enz', 'in', 'out'];
var FORMATS = ['names', 'structures', 'mixed'];
var MODES = ['build', 'pick', 'type'];
var THEMES = ['light', 'dark', 'auto'];
var DEFAULTS = {
format: 'mixed', showSlotLabels: true, givenStart: false, cofactors: true, sound: true, introSeen: false, theme: 'light', advanced: false,
pathwayId: 'glycolysis', mode: 'build', excluded: {}
};
var cache = null;
function isPathwayId(id) {
if (typeof id !== 'string' || !MG.pathways) { return false; }
if (Object.prototype.hasOwnProperty.call(MG.pathways, id)) { return true; }
if (MG.packs && typeof MG.packs.isPackId === 'function' && MG.packs.isPackId(id)) { return true; }
return !!(MG.custom && typeof MG.custom.resolve === 'function' && MG.custom.resolve(id));
}
function cleanExcluded(value) {
if (!value || typeof value !== 'object' || Array.isArray(value)) { return undefined; }
var out = {};
Object.keys(value).forEach(function (pid) {
if (!isPathwayId(pid) || !Array.isArray(value[pid])) { return; }
var ids = [];
value[pid].forEach(function (id) {
if (typeof id === 'string' && id !== '' && ids.indexOf(id) < 0) { ids.push(id); }
});
out[pid] = ids;
});
return out;
}
function normalise(key, value) {
if (key === 'format') { return FORMATS.indexOf(value) >= 0 ? value : undefined; }
if (key === 'mode') { return MODES.indexOf(value) >= 0 ? value : undefined; }
if (key === 'theme') { return THEMES.indexOf(value) >= 0 ? value : undefined; }
if (key === 'pathwayId') { return value === '' || isPathwayId(value) ? value : undefined; }
if (key === 'excluded') { return cleanExcluded(value); }
return typeof value === 'boolean' ? value : undefined;
}
function defaultFor(key) {
return key === 'excluded' ? {} : DEFAULTS[key];
}
function cleanSettings(raw) {
var out = {};
if (!raw || typeof raw !== 'object') { return out; }
Object.keys(DEFAULTS).forEach(function (k) {
var v = normalise(k, raw[k]);
if (v !== undefined) { out[k] = v; }
});
return out;
}
function storage() {
try { return root.localStorage || null; } catch (e) { return null; }
}
function cleanSteps(steps) {
var out = {};
if (!steps || typeof steps !== 'object') { return out; }
Object.keys(steps).forEach(function (id) {
var hist = steps[id];
if (!Array.isArray(hist)) { return; }
var good = hist.filter(function (v) { return v === 0 || v === 1; });
out[id] = good.slice(-HISTORY);
});
return out;
}
function load() {
if (cache) { return cache; }
cache = { settings: {}, steps: {} };
var ls = storage();
if (!ls) { return cache; }
try {
var raw = ls.getItem(KEY);
var doc = raw ? JSON.parse(raw) : null;
if (doc && typeof doc === 'object') {
cache.settings = cleanSettings(doc.settings);
cache.steps = cleanSteps(doc.steps);
}
} catch (e) {
}
return cache;
}
function save() {
var ls = storage();
if (!ls) { return; }
try { ls.setItem(KEY, JSON.stringify(cache)); } catch (e) { /* quota or blocked: memory copy stays */ }
}
function reactionIds(pathwayId) {
var p = MG.pathways && MG.pathways[pathwayId];
return p ? p.reactions.map(function (r) { return r.id; }) : [];
}
function getSettings() {
var s = load().settings, out = {};
Object.keys(DEFAULTS).forEach(function (k) {
var v = normalise(k, s[k]);
out[k] = v === undefined ? defaultFor(k) : v;
});
return out;
}
function setSettings(partial) {
var doc = load();
if (!partial || typeof partial !== 'object') { return; }
Object.keys(partial).forEach(function (k) {
if (!Object.prototype.hasOwnProperty.call(DEFAULTS, k)) { return; }
var v = normalise(k, partial[k]);
if (v !== undefined) { doc.settings[k] = v; }
});
save();
}
function record(pathwayId, rxnId, kind, correct) {
if (KINDS.indexOf(kind) < 0) { throw new TypeError('MG.store.record: unknown kind ' + kind); }
if (typeof rxnId !== 'string' || rxnId === '') { throw new TypeError('MG.store.record: rxnId required'); }
var steps = load().steps;
var hist = Object.prototype.hasOwnProperty.call(steps, rxnId) ? steps[rxnId] : (steps[rxnId] = []);
hist.push(correct ? 1 : 0);
if (hist.length > HISTORY) { hist.splice(0, hist.length - HISTORY); }
save();
}
function mastery(pathwayId, rxnId) {
var steps = load().steps;
if (!Object.prototype.hasOwnProperty.call(steps, rxnId)) { return null; }
var hist = steps[rxnId];
if (!hist.length) { return null; }
var sum = hist.reduce(function (a, b) { return a + b; }, 0);
return Math.round(100 * sum / hist.length);
}
function masteryAll(pathwayId) {
var out = {};
reactionIds(pathwayId).forEach(function (id) { out[id] = mastery(pathwayId, id); });
return out;
}
function reset(target) {
var doc = load();
if (target === undefined || target === null) {
doc.steps = {};
} else if (Array.isArray(target)) {
target.forEach(function (id) { delete doc.steps[id]; });
} else {
reactionIds(target).forEach(function (id) { delete doc.steps[id]; });
}
save();
}
function weak(limit) {
var steps = load().steps;
var out = [];
Object.keys(steps).forEach(function (id) {
var hist = steps[id];
if (!Array.isArray(hist) || !hist.length) { return; }
var misses = hist.filter(function (v) { return v === 0; }).length;
if (!misses) { return; }
out.push({ id: id, misses: misses, total: hist.length, rate: misses / hist.length, recent: hist.length - 1 - hist.lastIndexOf(0) });
});
out.sort(function (a, b) {
if (b.rate !== a.rate) { return b.rate - a.rate; }
if (a.recent !== b.recent) { return a.recent - b.recent; }
if (b.misses !== a.misses) { return b.misses - a.misses; }
return a.id < b.id ? -1 : (a.id > b.id ? 1 : 0);
});
return typeof limit === 'number' && limit >= 0 ? out.slice(0, limit) : out;
}
function persists() {
var ls = storage();
if (!ls) { return false; }
try {
ls.setItem('mg.probe', '1');
var ok = ls.getItem('mg.probe') === '1';
ls.removeItem('mg.probe');
return ok;
} catch (e) {
return false;
}
}
MG.store = {
persists: persists,
getSettings: getSettings,
setSettings: setSettings,
record: record,
mastery: mastery,
masteryAll: masteryAll,
reset: reset,
weak: weak
};
})(typeof window !== 'undefined' ? window : globalThis);

(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
var PEAK = 0.16;                 // loudest single partial, well below clipping
var override = null;             // null = follow the stored setting
var ctx = null;                  // the shared AudioContext, created on first use
var out = null;                  // master node: gain, then a gentle low-pass, then the speakers
var broken = false;              // set once Web Audio proved unavailable, so we stop trying
var NOTE = { C6: 1046.5, E6: 1318.51, G6: 1567.98, B6: 1975.53, C7: 2093.0, E7: 2637.02 };
var PARTIALS = [
{ mult: 1, gain: 1.0, decay: 1.0 },
{ mult: 2, gain: 0.32, decay: 0.55 },
{ mult: 2.76, gain: 0.1, decay: 0.3 }
];
function storedOn() {
try {
var s = MG.store && typeof MG.store.getSettings === 'function' ? MG.store.getSettings() : null;
return !s || s.sound !== false;
} catch (e) {
return true;
}
}
function isEnabled() {
return override === null ? storedOn() : !!override;
}
function setEnabled(on) {
override = on === null || on === undefined ? null : !!on;
}
function audio() {
if (broken) { return null; }
if (ctx) { return ctx; }
var AC = root.AudioContext || root.webkitAudioContext;
if (!AC) { broken = true; return null; }
try {
ctx = new AC();
var master = ctx.createGain();
master.gain.value = 0.9;
var soften = ctx.createBiquadFilter();
soften.type = 'lowpass';
soften.frequency.value = 7000;
master.connect(soften);
soften.connect(ctx.destination);
out = master;
} catch (e) {
broken = true;
ctx = null;
out = null;
}
return ctx;
}
function unlock() {
var c = audio();
if (c && c.state === 'suspended' && typeof c.resume === 'function') {
try {
var p = c.resume();
if (p && typeof p.catch === 'function') { p.catch(function () { /* still blocked: stay silent */ }); }
} catch (e) { /* stay silent */ }
}
}
function bell(freq, at, dur, level) {
var t0 = ctx.currentTime + at;
PARTIALS.forEach(function (p) {
var osc = ctx.createOscillator();
var env = ctx.createGain();
var peak = PEAK * level * p.gain;
var end = t0 + dur * p.decay;
osc.type = 'sine';
osc.frequency.value = freq * p.mult;
env.gain.setValueAtTime(0.0001, t0);
env.gain.linearRampToValueAtTime(peak, t0 + 0.004);
env.gain.exponentialRampToValueAtTime(0.0001, end);
osc.connect(env);
env.connect(out);
osc.start(t0);
osc.stop(end + 0.05);
});
}
function play(notes) {
if (!isEnabled()) { return false; }
var c = audio();
if (!c) { return false; }
unlock();
try {
notes.forEach(function (n) { bell(NOTE[n[0]], n[1], n[2], n[3]); });
return true;
} catch (e) {
return false;
}
}
function correct() {
return play([['E6', 0, 0.2, 0.85], ['B6', 0.085, 0.55, 1.0]]);
}
function complete() {
return play([
['C6', 0.3, 0.25, 0.8], ['E6', 0.39, 0.25, 0.85], ['G6', 0.48, 0.25, 0.9],
['C7', 0.57, 0.3, 0.95], ['E7', 0.68, 0.9, 1.0]
]);
}
MG.sound = { correct: correct, complete: complete, isEnabled: isEnabled, setEnabled: setEnabled, unlock: unlock };
})(typeof window !== 'undefined' ? window : globalThis);
