(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
var STORE_KEY = 'mg.v1';
var FLAG = 'advanced';
var ID_RE = /^[a-z0-9]+$/;
var KINDS = ['molecule', 'enzyme', 'cofactor'];
var DEFAULT_REGIONS = ['all', 'both'];
var registry = {};
var order = [];
var applied = false;
var active = false;
var waiting = [];   // ATP scenarios of a pack applied before MG.atp was loaded (a test that loads fewer modules); flush() adds them later
function has(obj, key) { return Object.prototype.hasOwnProperty.call(obj, key); }
function pack(id) {
if (!has(registry, id)) {
registry[id] = {
id: id, title: id, regions: [],
entities: { molecule: {}, enzyme: {}, cofactor: {} },
geometry: {}, pathways: {}, groups: [], courses: {}, scenarios: [], games: [],
familyHints: { molecule: {}, enzyme: {}, cofactor: {} }, neverFuzzy: [],
extendRegions: { molecule: {}, enzyme: {}, cofactor: {} }
};
order.push(id);
}
return registry[id];
}
function ids() { return order.slice(); }
function listOf(region) { return Array.isArray(region) ? region : (region === undefined || region === null ? [] : [region]); }
function savedFlag() {
try {
var ls = root.localStorage;
if (!ls) { return false; }
var raw = ls.getItem(STORE_KEY);
var doc = raw ? JSON.parse(raw) : null;
return !!(doc && doc.settings && doc.settings[FLAG] === true);
} catch (e) {
return false;
}
}
function enabled() { return active; }
function hasContent() {
return order.some(function (id) { return Object.keys(registry[id].pathways).length > 0; });
}
function isPackPathway(id) {
return order.some(function (p) { return has(registry[p].pathways, id); });
}
function fullOrder() {
var out = [];
function add(id) { if (out.indexOf(id) < 0) { out.push(id); } }
(MG.categories || []).forEach(function (g) {
if (g.pack) { return; }
(g.pathways || []).forEach(function (id) { if (!isPackPathway(id)) { add(id); } });
order.forEach(function (pid) {
registry[pid].groups.forEach(function (pg) {
if (pg.into === g.id) { (pg.pathways || []).forEach(function (id) { if (has(registry[pid].pathways, id)) { add(id); } }); }
});
});
});
order.forEach(function (pid) {
registry[pid].groups.forEach(function (pg) {
if (!pg.into) { (pg.pathways || []).forEach(function (id) { if (has(registry[pid].pathways, id)) { add(id); } }); }
});
Object.keys(registry[pid].pathways).forEach(add);
});
return out;
}
function isPackId(id) {
if (typeof id !== 'string' || id === '') { return false; }
if (isPackPathway(id)) { return true; }
if (id.indexOf('mix:') !== 0) { return false; }
var parts = id.slice(4).split('+');
if (parts.length < 2) { return false; }
var all = fullOrder();
var known = parts.every(function (p) { return all.indexOf(p) >= 0; });
if (!known || !parts.some(isPackPathway)) { return false; }
var sorted = all.filter(function (p) { return parts.indexOf(p) >= 0; });
return sorted.length === parts.length && sorted.every(function (p, i) { return p === parts[i]; });
}
function fail(P, what) { throw new Error('MG.packs ' + P.id + ': ' + what); }
function checkRegions(P, kind, id, rec) {
var regions = listOf(rec.region);
if (!regions.length) { fail(P, kind + ' ' + id + ' has no region (give it one of the pack\'s: ' + P.regions.join(', ') + ')'); }
regions.forEach(function (r) {
if (DEFAULT_REGIONS.indexOf(r) >= 0) { fail(P, kind + ' ' + id + ' uses the default region ' + r + ' (it would reach the listed pathways)'); }
if (P.regions.indexOf(r) < 0) { fail(P, kind + ' ' + id + ' has region ' + r + ', which the pack does not declare'); }
});
}
function registerEntities(P) {
var E = MG.entities;
KINDS.forEach(function (kind) {
var table = E[kind];
var mine = P.entities[kind];
Object.keys(mine).forEach(function (id) {
if (!ID_RE.test(id)) { fail(P, kind + ' id ' + id + ' must be lowercase letters and digits'); }
if (has(table, id)) { fail(P, kind + ' id ' + id + ' is already taken'); }
var rec = mine[id];
rec.id = id; rec.kind = kind; rec.pack = P.id;
checkRegions(P, kind, id, rec);
table[id] = rec;
});
var extra = P.extendRegions[kind] || {};
Object.keys(extra).forEach(function (id) {
if (!has(table, id)) { fail(P, 'extendRegions names the unknown ' + kind + ' ' + id); }
var now = listOf(table[id].region).slice();
listOf(extra[id]).forEach(function (r) {
if (P.regions.indexOf(r) < 0) { fail(P, 'extendRegions gives ' + id + ' the undeclared region ' + r); }
if (now.indexOf(r) < 0) { now.push(r); }
});
table[id].region = now.length === 1 ? now[0] : now;
});
var hints = P.familyHints[kind] || {};
Object.keys(hints).forEach(function (family) {
var live = E.familyHint[kind];
if (!has(live, family)) { live[family] = hints[family]; }
});
});
(P.neverFuzzy || []).forEach(function (s) { if (E.neverFuzzy.indexOf(s) < 0) { E.neverFuzzy.push(s); } });
}
function registerGeometry(P) {
Object.keys(P.geometry).forEach(function (id) {
if (has(MG.geometry, id)) { fail(P, 'drawing ' + id + ' is already taken'); }
if (!has(P.entities.molecule, id) && !has(MG.entities.molecule, id)) { fail(P, 'drawing ' + id + ' has no molecule entity'); }
P.geometry[id].pack = P.id;
MG.geometry[id] = P.geometry[id];
});
}
function registerPathways(P) {
Object.keys(P.pathways).forEach(function (id) {
if (!ID_RE.test(id)) { fail(P, 'pathway id ' + id + ' must be lowercase letters and digits'); }
if (has(MG.pathways, id)) { fail(P, 'pathway id ' + id + ' is already taken'); }
var rec = P.pathways[id];
rec.id = id; rec.pack = P.id;
(rec.reactions || []).forEach(function (r) {
if (!ID_RE.test(r.id)) { fail(P, 'step id ' + r.id + ' of ' + id + ' must be lowercase letters and digits'); }
});
MG.pathways[id] = rec;
});
}
function registerMenu(P) {
P.groups.forEach(function (g) {
var name = g.into ? 'group into ' + g.into : 'group ' + g.id;
(g.pathways || []).forEach(function (pid) {
if (!has(MG.pathways, pid)) { fail(P, name + ' lists the unregistered pathway ' + pid); }
});
if (g.into) {
var host = null;
MG.categories.forEach(function (c) { if (c.id === g.into && !c.pack) { host = c; } });
if (!host) { fail(P, name + ': there is no listed group ' + g.into); }
(g.pathways || []).forEach(function (pid) { if (host.pathways.indexOf(pid) < 0) { host.pathways.push(pid); } });
return;
}
g.pack = P.id;
MG.categories.push(g);
});
Object.keys(P.courses).forEach(function (cid) {
var c = P.courses[cid];
if (has(MG.courses, cid)) { fail(P, 'course id ' + cid + ' is already taken'); }
(c.sections || []).forEach(function (pid) {
if (!has(MG.pathways, pid)) { fail(P, 'course ' + cid + ' lists the unregistered pathway ' + pid); }
});
c.id = cid; c.pack = P.id;
MG.courses[cid] = c;
});
}
function registerExtras(P) {
P.scenarios.forEach(function (s) { s.pack = P.id; waiting.push(s); });
flush();
if (P.games.length) {
MG.games = MG.games || [];
P.games.forEach(function (g) { g.pack = P.id; MG.games.push(g); });
}
}
function flush() {
if (!waiting.length || !(MG.atp && Array.isArray(MG.atp.scenarios))) { return; }
waiting.splice(0).forEach(function (s) { MG.atp.scenarios.push(s); });
}
function apply(on) {
if (applied) { return active; }
applied = true;
if (!on) { return false; }
order.forEach(function (id) {
var P = registry[id];
if (!P.regions.length && Object.keys(P.pathways).length) { fail(P, 'declare the pack\'s regions (P.regions)'); }
registerEntities(P);
registerGeometry(P);
registerPathways(P);
registerMenu(P);
registerExtras(P);
});
active = true;
if (MG.match && typeof MG.match.reset === 'function') { MG.match.reset(); }
return true;
}
MG.packs = {
FLAG: FLAG, ID_RE: ID_RE, pack: pack, ids: ids, apply: apply, flush: flush, enabled: enabled, hasContent: hasContent,
isPackId: isPackId, savedFlag: savedFlag
};
})(typeof window !== 'undefined' ? window : globalThis);

(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
if (!MG.packs) { return; }
var P = MG.packs.pack('advanced');
P.title = 'Trình độ cao';
P.regions = ['sig', 'photo', 'carbon', 'nitro'];
P.familyHints.molecule.photocarrier = 'chất mang electron, sắc tố hoặc chất nhận electron của pha sáng';
P.familyHints.enzyme.photocomplex = 'phức hợp protein lớn của màng thylakoid';
P.familyHints.enzyme.process = 'toàn bộ quá trình quang hợp hoặc chuyển hóa năng lượng, không phải một enzyme đơn lẻ';
P.familyHints.cofactor.photon = 'lượng tử năng lượng bức xạ (photon), không phải một phân tử';
P.familyHints.molecule.messenger = 'hormone hoặc chất truyền tin thứ hai của con đường truyền tín hiệu';
P.familyHints.molecule.sigstate = 'protein, phức hợp, ion hoặc đường của con đường tín hiệu ở một trạng thái/vị trí cụ thể';
P.familyHints.molecule.siglipid = 'lipid của màng sinh chất mà enzyme tín hiệu cắt hoặc biến đổi';
P.familyHints.molecule.nucleotide = 'nucleotide: gồm base nitơ, đường và các nhóm phosphat';
P.familyHints.enzyme.gprotein = 'protein G hoặc một tiểu phần của nó, công tắc chuyển tiếp tín hiệu từ thụ thể';
P.familyHints.enzyme.sigprotein = 'protein truyền tín hiệu chuyển tiếp thông điệp đi tiếp';
P.familyHints.enzyme.transporter = 'protein vận chuyển đưa phân tử qua màng sinh chất';
P.familyHints.enzyme.cellmachine = 'protein hoặc hạt tế bào lớn tham gia chuyển tín hiệu từ hormone steroid thành protein mới';
P.familyHints.enzyme.nprocess = 'toàn bộ quá trình của cơ thể vận chuyển hoặc phân giải phân tử, không phải một enzyme';
P.familyHints.molecule.b6 = 'coenzyme của các transaminase, ở một trong hai dạng của nó';
P.familyHints.molecule.plpint = 'một dạng coenzyme trung gian trong cơ chế chuyển amin';
P.familyHints.molecule.nucint = 'chất trung gian tổng hợp nucleotide: ribose phosphat hoặc base trên đường tạo nucleotide';
P.familyHints.molecule.tissuepool = 'bể phân tử trong mô, không phải một hợp chất đơn lẻ';
P.familyHints.cofactor.folate = 'coenzyme folate vận chuyển các đơn vị một carbon';
P.familyHints.molecule.folate = 'coenzyme folate: vòng pterin có hoặc không có đơn vị một carbon gắn vào';
P.familyHints.molecule.ketoacid = 'acid α-keto: bộ khung carbon của amino acid có nhóm ketone tại vị trí nhóm amin cũ';
P.familyHints.molecule.aacat = 'chất trung gian thoái hóa amino acid trên đường vào chu trình TCA hoặc thể ketone';
P.familyHints.enzyme.oxygenase = 'oxygenase: enzyme gắn một hoặc cả hai nguyên tử O₂ vào cơ chất';
})(typeof window !== 'undefined' ? window : globalThis);
