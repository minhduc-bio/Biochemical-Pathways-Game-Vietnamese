(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
var CAP = 0.716;        // Arial cap height in em; capitals are centred on the atom
var BASE = CAP / 2;     // baseline below the atom centre (em, y down) that centres capitals
var SMALL = 0.7;        // sub/sup size relative to the main run
var SUB_DROP = 0.25;    // subscript baseline drop, in main em
var SUP_RISE = 0.4;     // superscript baseline rise, in main em
var LABEL_EM = 0.62;    // label font size as a fraction of one bond length
var GAP = 0.11;         // default clear space between a bond end and a label run (bond units)
var GAP_MIN = 0.03;     // smallest gap a short bond may get before its terminal atom is moved
var MIN_STUB = 0.5;     // least bond length (bond units) that should show next to a label
var PUSH_BELOW = 0.25; // a terminal atom moves only when less than this would show, even at GAP_MIN
var JOIN_EXT = 0.02;    // overlap of joined tapered bands, so no hairline seam shows at a miter
var MITER_LIMIT = 3;    // a miter tip further than this many half widths becomes a bevel
var DOUBLE = 0.085;     // distance of each double-bond line from the axis (triple: 2x)
var WEDGE_HW = 0.11;    // half width of a wedge (and of the widest hash stroke) at its wide end
var HASH_N = 6;         // strokes in a hashed wedge
var STROKE = WEDGE_HW + 0.02;   // margin reserved around the drawing when fitting the box
var EPS = 1e-12;
var DEFAULT_COLOR = 'var(--mg-struct, #141414)';
var DEFAULT_HL = 'var(--mg-struct-hl, #1D4ED8)';
var PILL_FILL = 'var(--mg-struct-pill, #DCEAFF)';   // pale blue behind a highlighted label
var PILL_PAD = 0.12;          // margin of that pill around the label, in bond units
var DEFAULT_MAXBOND = 34;
var FONT = 'Arial, Helvetica, sans-serif';
var ADV = {
' ': 0.278, '(': 0.333, ')': 0.333, '+': 0.584, ',': 0.278, '-': 0.333,
'.': 0.278, '−': 0.584
};
(function fillAdvanceTable() {
var caps = [0.722, 0.722, 0.722, 0.722, 0.667, 0.611, 0.778, 0.722, 0.278, 0.556, 0.722, 0.611, 0.833,
0.722, 0.778, 0.667, 0.778, 0.722, 0.667, 0.611, 0.722, 0.667, 0.944, 0.667, 0.667, 0.611];
var lower = [0.556, 0.611, 0.556, 0.611, 0.556, 0.333, 0.611, 0.611, 0.278, 0.278, 0.556, 0.278, 0.889,
0.611, 0.611, 0.611, 0.611, 0.389, 0.556, 0.333, 0.611, 0.556, 0.778, 0.556, 0.556, 0.5];
var i;
for (i = 0; i < 26; i++) {
ADV[String.fromCharCode(65 + i)] = caps[i];
ADV[String.fromCharCode(97 + i)] = lower[i];
}
for (i = 0; i < 10; i++) { ADV[String(i)] = 0.556; }
})();
function charAdvance(ch) {
return Object.prototype.hasOwnProperty.call(ADV, ch) ? ADV[ch] : 0.6;
}
function isScript(run) {
return run.style === 'sub' || run.style === 'sup';
}
function runWidth(run) {
var text = String(run.t == null ? '' : run.t);
var w = 0;
for (var i = 0; i < text.length; i++) { w += charAdvance(text.charAt(i)); }
return isScript(run) ? w * SMALL : w;
}
function num(v) {
var r = Math.round(v * 100) / 100;
return String(r === 0 ? 0 : r);
}
function esc(s) {
return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function include(e, x, y) {
if (x < e.x0) { e.x0 = x; }
if (x > e.x1) { e.x1 = x; }
if (y < e.y0) { e.y0 = y; }
if (y > e.y1) { e.y1 = y; }
}
function dist(P, Q) {
var dx = Q.x - P.x, dy = Q.y - P.y;
return Math.sqrt(dx * dx + dy * dy);
}
function taperOf(bd) {
var t = bd && bd.taper;
if (!t || t.length < 2) { return null; }
var w0 = +t[0], w1 = +t[1];
return (isFinite(w0) && isFinite(w1) && w0 >= 0 && w1 >= 0) ? [w0, w1] : null;
}
function layoutLabel(label) {
var runs = (label && label.runs) || [];
var items = [];
if (!runs.length) { return { items: items }; }
var main = 0;
runs.forEach(function (r, i) { if (r && r.main) { main = i; } });
var widths = runs.map(runWidth);
var mainW = widths[main];
function add(run, i, anchor, x) {
var base = BASE;
if (run.style === 'sub') { base += SUB_DROP; }
else if (run.style === 'sup') { base -= SUP_RISE; }
var left = anchor === 'middle' ? -mainW / 2 : anchor === 'end' ? x - widths[i] : x;
var right = anchor === 'middle' ? mainW / 2 : anchor === 'end' ? x : x + widths[i];
items.push({
text: String(run.t == null ? '' : run.t), anchor: anchor, x: x,
base: base, size: isScript(run) ? SMALL : 1, left: left, right: right
});
}
add(runs[main], main, 'middle', 0);
var cursor = -mainW / 2;          // left edge of the run being placed, going left
for (var i = main - 1; i >= 0; i--) {
add(runs[i], i, 'end', cursor);
cursor -= widths[i];
}
cursor = mainW / 2;               // right edge of the run being placed, going right
for (i = main + 1; i < runs.length; i++) {
add(runs[i], i, 'start', cursor);
cursor += widths[i];
}
return { items: items };
}
function runBoxes(L, ls, cx, cy, g) {
return L.items.map(function (it) {
return {
x0: cx + it.left * ls - g, x1: cx + it.right * ls + g,
y0: cy + (it.base - CAP * it.size) * ls - g, y1: cy + it.base * ls + g
};
});
}
function firstContact(from, to, boxes) {
var dx = to.x - from.x, dy = to.y - from.y;
var best = 1;
boxes.forEach(function (b) {
var s0 = -Infinity, s1 = Infinity;
if (Math.abs(dx) < EPS) {
if (from.x < b.x0 || from.x > b.x1) { return; }
} else {
var ta = (b.x0 - from.x) / dx, tb = (b.x1 - from.x) / dx;
s0 = Math.max(s0, Math.min(ta, tb));
s1 = Math.min(s1, Math.max(ta, tb));
}
if (Math.abs(dy) < EPS) {
if (from.y < b.y0 || from.y > b.y1) { return; }
} else {
var tc = (b.y0 - from.y) / dy, td = (b.y1 - from.y) / dy;
s0 = Math.max(s0, Math.min(tc, td));
s1 = Math.min(s1, Math.max(tc, td));
}
if (s0 <= s1 && s1 >= 0 && s0 <= 1) { best = Math.min(best, Math.max(s0, 0)); }
});
return best;
}
function clipSegment(P, Q, boxesP, boxesQ) {
var a = boxesP ? 1 - firstContact(Q, P, boxesP) : 0;
var b = boxesQ ? firstContact(P, Q, boxesQ) : 1;
if (b - a <= EPS) { return null; }
var dx = Q.x - P.x, dy = Q.y - P.y;
return {
p: { x: P.x + dx * a, y: P.y + dy * a },
q: { x: P.x + dx * b, y: P.y + dy * b },
a: a, b: b
};
}
function visibleLength(P, Q, boxesP, boxesQ) {
var c = clipSegment(P, Q, boxesP, boxesQ);
return c ? dist(P, Q) * (c.b - c.a) : 0;
}
function pointSegmentDistance(p, A, B) {
var dx = B.x - A.x, dy = B.y - A.y;
var len2 = dx * dx + dy * dy;
var t = len2 < EPS ? 0 : Math.max(0, Math.min(1, ((p.x - A.x) * dx + (p.y - A.y) * dy) / len2));
return dist(p, { x: A.x + dx * t, y: A.y + dy * t });
}
function pointBoxDistance(p, box) {
var dx = Math.max(box.x0 - p.x, 0, p.x - box.x1);
var dy = Math.max(box.y0 - p.y, 0, p.y - box.y1);
return Math.sqrt(dx * dx + dy * dy);
}
function segmentBoxDistance(A, B, box) {
if (firstContact(A, B, [box]) < 1) { return 0; }
var d = Math.min(pointBoxDistance(A, box), pointBoxDistance(B, box));
[{ x: box.x0, y: box.y0 }, { x: box.x1, y: box.y0 }, { x: box.x1, y: box.y1 }, { x: box.x0, y: box.y1 }]
.forEach(function (c) { d = Math.min(d, pointSegmentDistance(c, A, B)); });
return d;
}
function miterJoin(V, A, B) {
var cross = A.u.x * B.u.y - A.u.y * B.u.x;
if (Math.abs(cross) < 1e-9) { return null; }
var nA = { x: -A.u.y, y: A.u.x }, nB = { x: -B.u.y, y: B.u.x };
var sA = (nA.x * B.u.x + nA.y * B.u.y) > 0 ? -1 : 1;
var sB = (nB.x * A.u.x + nB.y * A.u.y) > 0 ? -1 : 1;
var PA = { x: V.x + sA * A.h * nA.x, y: V.y + sA * A.h * nA.y };
var PB = { x: V.x + sB * B.h * nB.x, y: V.y + sB * B.h * nB.y };
var rx = PB.x - PA.x, ry = PB.y - PA.y;
var s = (-rx * B.u.y + B.u.x * ry) / (-cross);
var tip = { x: PA.x + s * A.u.x, y: PA.y + s * A.u.y };
if (dist(V, tip) > MITER_LIMIT * Math.max(A.h, B.h)) { return [V, PA, PB]; }
return [V, PA, tip, PB];
}
function buildScene(geom, fontScale) {
var ls = LABEL_EM * fontScale;           // bond units per em of label text
var atoms = (geom && geom.atoms) || [];
var bonds = (geom && geom.bonds) || [];
var labels = atoms.map(function (a) { return a && a.label ? layoutLabel(a.label) : null; });
var labelled = function (i) { return !!labels[i] && labels[i].items.length > 0; };
var pos = atoms.map(function (a) { return { x: a.x, y: a.y }; });
var gap = atoms.map(function () { return GAP; });
var deg = atoms.map(function () { return 0; });
bonds.forEach(function (bd) {
if (atoms[bd.a] && atoms[bd.b]) { deg[bd.a]++; deg[bd.b]++; }
});
var simple = function (L) {
return L.items.length >= 2 && L.items.every(function (it) { return it.size === 1; });
};
var clearance = function (bd) {
var t = taperOf(bd);
return t ? Math.max(t[0], t[1]) / 2 + 0.02 : (bd.o >= 2 ? DOUBLE : 0) + 0.065;   // 0.065 = half a line + 0.02
};
var collisions = function (i, boxes) {
var n = 0;
bonds.forEach(function (bd) {
if (bd.a === i || bd.b === i || !pos[bd.a] || !pos[bd.b]) { return; }
var m = clearance(bd);
if (boxes.some(function (b) { return segmentBoxDistance(pos[bd.a], pos[bd.b], b) < m; })) { n++; }
});
atoms.forEach(function (a, k) {
if (k === i || !labelled(k)) { return; }
var other = runBoxes(labels[k], ls, pos[k].x, pos[k].y, 0);
boxes.forEach(function (b) {
other.forEach(function (o) {
if (b.x0 < o.x1 && o.x0 < b.x1 && b.y0 < o.y1 && o.y0 < b.y1) { n++; }
});
});
});
return n;
};
atoms.forEach(function (a, i) {
if (!labelled(i) || !simple(labels[i])) { return; }
var c0 = collisions(i, runBoxes(labels[i], ls, pos[i].x, pos[i].y, 0));
if (c0 === 0) { return; }
var mirrored = layoutLabel({ runs: a.label.runs.slice().reverse() });
var c1 = collisions(i, runBoxes(mirrored, ls, pos[i].x, pos[i].y, 0));
if (c1 < c0) { labels[i] = mirrored; }
});
bonds.forEach(function (bd) {
if (!pos[bd.a] || !pos[bd.b] || dist(pos[bd.a], pos[bd.b]) < EPS) { return; }
if (!labelled(bd.a) && !labelled(bd.b)) { return; }
var visWith = function (ga, gb) {
return visibleLength(pos[bd.a], pos[bd.b],
labelled(bd.a) ? runBoxes(labels[bd.a], ls, pos[bd.a].x, pos[bd.a].y, ga) : null,
labelled(bd.b) ? runBoxes(labels[bd.b], ls, pos[bd.b].x, pos[bd.b].y, gb) : null);
};
var ga0 = labelled(bd.a) ? gap[bd.a] : 0, gb0 = labelled(bd.b) ? gap[bd.b] : 0;
if (visWith(ga0, gb0) >= MIN_STUB) { return; }   // long enough already: no gap changes
var vis = function (g) { return visWith(labelled(bd.a) ? g : 0, labelled(bd.b) ? g : 0); };
var lo = GAP_MIN, hi = Math.max(ga0, gb0);
if (vis(lo) >= MIN_STUB) {
for (var k = 0; k < 40; k++) {
var mid = (lo + hi) / 2;
if (vis(mid) >= MIN_STUB) { lo = mid; } else { hi = mid; }
}
}
var g = lo;                                       // GAP_MIN if even that is not enough
if (labelled(bd.a)) { gap[bd.a] = g; }
if (labelled(bd.b)) { gap[bd.b] = g; }
var v = vis(g);
if (v < PUSH_BELOW) {
var term = labelled(bd.b) && deg[bd.b] === 1 ? bd.b : (labelled(bd.a) && deg[bd.a] === 1 ? bd.a : -1);
if (term >= 0) {
var other = term === bd.b ? bd.a : bd.b;
var ux = pos[term].x - pos[other].x, uy = pos[term].y - pos[other].y;
var ul = Math.sqrt(ux * ux + uy * uy), shift = MIN_STUB - v;
pos[term].x += ux / ul * shift;
pos[term].y += uy / ul * shift;
}
}
});
var clip = atoms.map(function (a, i) { return labelled(i) ? runBoxes(labels[i], ls, pos[i].x, pos[i].y, gap[i]) : null; });
var ext = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
var texts = [];
var labelBoxes = [];
atoms.forEach(function (a, i) {
include(ext, pos[i].x, pos[i].y);
if (!labelled(i)) { return; }
var box = { atom: i, x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
labels[i].items.forEach(function (it) {
var bx0 = pos[i].x + it.left * ls, by0 = pos[i].y + (it.base - CAP * it.size) * ls;
var bx1 = pos[i].x + it.right * ls, by1 = pos[i].y + it.base * ls;
include(ext, bx0, by0);
include(ext, bx1, by1);
box.x0 = Math.min(box.x0, bx0); box.y0 = Math.min(box.y0, by0);
box.x1 = Math.max(box.x1, bx1); box.y1 = Math.max(box.y1, by1);
texts.push({
atom: i, text: it.text, anchor: it.anchor,
x: pos[i].x + it.x * ls, y: pos[i].y + it.base * ls, fs: it.size * ls
});
});
labelBoxes.push(box);
});
var tapers = bonds.map(taperOf);
var tapersAt = atoms.map(function () { return []; });
bonds.forEach(function (bd, j) {
if (tapers[j] && atoms[bd.a] && atoms[bd.b]) { tapersAt[bd.a].push(j); tapersAt[bd.b].push(j); }
});
var joined = function (j, v) { return tapersAt[v].length >= 2 && !labelled(v); };
var arm = function (j, v) {
var bd = bonds[j], o = bd.a === v ? bd.b : bd.a;
var len = dist(pos[v], pos[o]);
if (len < EPS) { return null; }
return {
u: { x: (pos[o].x - pos[v].x) / len, y: (pos[o].y - pos[v].y) / len },
h: (bd.a === v ? tapers[j][0] : tapers[j][1]) / 2
};
};
var prims = [];
bonds.forEach(function (bd, j) {
var A = pos[bd.a], B = pos[bd.b];
if (!A || !B) { return; }               // dangling index: skip, never draw NaN
var len = dist(A, B);
if (len < EPS) { return; }
var u = { x: (B.x - A.x) / len, y: (B.y - A.y) / len };
var n = { x: -u.y, y: u.x };              // unit normal to the bond
if (tapers[j]) {
var ct = clipSegment(A, B, clip[bd.a], clip[bd.b]);
if (!ct) { return; }
var dw = tapers[j][1] - tapers[j][0];
var w0 = tapers[j][0] + dw * ct.a, w1 = tapers[j][0] + dw * ct.b;
var p = ct.p, q = ct.q;
if (joined(j, bd.a)) { p = { x: p.x - u.x * JOIN_EXT, y: p.y - u.y * JOIN_EXT }; }
if (joined(j, bd.b)) { q = { x: q.x + u.x * JOIN_EXT, y: q.y + u.y * JOIN_EXT }; }
var corners = [
{ x: p.x + n.x * w0 / 2, y: p.y + n.y * w0 / 2 },
{ x: q.x + n.x * w1 / 2, y: q.y + n.y * w1 / 2 },
{ x: q.x - n.x * w1 / 2, y: q.y - n.y * w1 / 2 },
{ x: p.x - n.x * w0 / 2, y: p.y - n.y * w0 / 2 }
];
corners.forEach(function (k) { include(ext, k.x, k.y); });
prims.push({ kind: 'taper', bond: j, pts: corners });
return;
}
if (bd.s === 1 || bd.s === -1) {
var cw = clipSegment(A, B, clip[bd.a], clip[bd.b]);
if (!cw) { return; }
var ex = cw.q.x - cw.p.x, ey = cw.q.y - cw.p.y;
var el = Math.sqrt(ex * ex + ey * ey);
if (el < EPS) { return; }
var wx = -ey / el, wy = ex / el;
if (bd.s === 1) {
prims.push({
kind: 'wedge', bond: j, apex: cw.p,
b1: { x: cw.q.x + wx * WEDGE_HW, y: cw.q.y + wy * WEDGE_HW },
b2: { x: cw.q.x - wx * WEDGE_HW, y: cw.q.y - wy * WEDGE_HW }
});
} else {
var segs = [];
for (var k = 1; k <= HASH_N; k++) {
var f = k / (HASH_N + 1);
var mx = cw.p.x + ex * f, my = cw.p.y + ey * f;
var h = WEDGE_HW * Math.max(0.25, f);
segs.push([mx - wx * h, my - wy * h, mx + wx * h, my + wy * h]);
}
prims.push({ kind: 'hash', bond: j, segs: segs });
}
return;
}
var offsets = bd.o === 3 ? [-2 * DOUBLE, 0, 2 * DOUBLE] : (bd.o === 2 ? [-DOUBLE, DOUBLE] : [0]);
offsets.forEach(function (off) {
var c = clipSegment(
{ x: A.x + n.x * off, y: A.y + n.y * off },
{ x: B.x + n.x * off, y: B.y + n.y * off },
clip[bd.a], clip[bd.b]);
if (c) { prims.push({ kind: 'line', bond: j, p: c.p, q: c.q }); }
});
});
atoms.forEach(function (a, v) {
var list = tapersAt[v];
if (labelled(v) || list.length < 2) { return; }
for (var p1 = 0; p1 < list.length; p1++) {
for (var p2 = p1 + 1; p2 < list.length; p2++) {
var armA = arm(list[p1], v), armB = arm(list[p2], v);
if (!armA || !armB) { continue; }
var pts = miterJoin(pos[v], armA, armB);
if (!pts) { continue; }
pts.forEach(function (k) { include(ext, k.x, k.y); });
prims.push({ kind: 'poly', pts: pts, bonds: [list[p1], list[p2]] });
}
}
});
if (ext.x0 === Infinity) { ext = { x0: 0, y0: 0, x1: 0, y1: 0 }; }
return { ext: ext, texts: texts, prims: prims, ls: ls, pos: pos, bonds: bonds, labelBoxes: labelBoxes };
}
function halfBondLines(sc, geom, hlAtom, hlBond) {
var out = [];
var bonds = sc.bonds, pos = sc.pos;
Object.keys(hlAtom).forEach(function (k) {
var i = +k;
var atom = (geom.atoms || [])[i];
if (!atom || atom.label || !pos[i]) { return; }     // labelled atoms are recoloured already
var touching = [];
bonds.forEach(function (bd, j) { if (bd.a === i || bd.b === i) { touching.push(j); } });
if (touching.some(function (j) { return hlBond[j]; })) { return; }
touching.forEach(function (j) {
var bd = bonds[j], A = pos[bd.a], B = pos[bd.b];
if (!A || !B) { return; }
var dx = B.x - A.x, dy = B.y - A.y, len = Math.sqrt(dx * dx + dy * dy);
if (len < EPS) { return; }
var nx = -dy / len, ny = dx / len;
var offs = bd.o === 3 ? [-2 * DOUBLE, 0, 2 * DOUBLE] : (bd.o === 2 ? [-DOUBLE, DOUBLE] : [0]);
var mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2;
offs.forEach(function (off) {
out.push({
p: { x: pos[i].x + nx * off, y: pos[i].y + ny * off },
q: { x: mx + nx * off, y: my + ny * off }
});
});
});
});
return out;
}
var SOFT = 'var(--mg-ink-soft, #55554C)';
var WRONG = 'var(--mg-wrong, #F97B6B)';
var RIGHT = 'var(--mg-correct, #8FF06B)';
var BADGE_R = 11;       // radius of the check and cross badges, in drawing pixels
function applyGhosts(geom, ghosts) {
var atoms = (geom.atoms || []).slice();
var bonds = (geom.bonds || []).slice();
var atomState = {}, bondState = {};
(ghosts || []).forEach(function (gh) {
var a = atoms[gh.atom];
if (!a) { return; }
atomState[gh.atom] = gh.state;
var b = gh.bond >= 0 ? bonds[gh.bond] : null;
var plain = !!b && !b.s && !taperOf(b);
if (plain) { bondState[gh.bond] = gh.state; }
if (gh.state === 'open' || gh.state === 'wrong') {
atoms[gh.atom] = { x: a.x, y: a.y, el: '?', label: { runs: [{ t: '?', main: true }] } };
if (plain) { bonds[gh.bond] = { a: b.a, b: b.b, o: 1, s: 0 }; }
} else if (gh.state === 'placed') {
atoms[gh.atom] = { x: a.x, y: a.y, el: gh.label ? a.el : 'C', label: gh.label || null };
if (plain) { bonds[gh.bond] = { a: b.a, b: b.b, o: gh.order === 2 ? 2 : 1, s: 0 }; }
}
});
return { geom: { atoms: atoms, bonds: bonds, groups: geom.groups || {} }, atomState: atomState, bondState: bondState };
}
function badge(x, y, r, good) {
var d = good ? 'M' + num(x - r * 0.45) + ' ' + num(y + r * 0.05) + 'L' + num(x - r * 0.1) + ' ' + num(y + r * 0.4) + 'L' + num(x + r * 0.5) + ' ' + num(y - r * 0.35)
: 'M' + num(x - r * 0.38) + ' ' + num(y - r * 0.38) + 'L' + num(x + r * 0.38) + ' ' + num(y + r * 0.38) + 'M' + num(x + r * 0.38) + ' ' + num(y - r * 0.38) + 'L' + num(x - r * 0.38) + ' ' + num(y + r * 0.38);
return '<circle cx="' + num(x) + '" cy="' + num(y) + '" r="' + num(r) + '" fill="' + (good ? RIGHT : WRONG) + '" stroke="' + DEFAULT_COLOR + '" stroke-width="1.5"/>' +
'<path d="' + d + '" fill="none" stroke="' + DEFAULT_COLOR + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
}
function renderEx(geom, opts) {
opts = opts || {};
var W = +opts.width, H = +opts.height;
if (!(W > 0) || !(H > 0)) { throw new Error('renderMolecule: width and height (px) are required'); }
var maxBond = opts.maxBond > 0 ? +opts.maxBond : DEFAULT_MAXBOND;
var color = opts.color || DEFAULT_COLOR;
var hlColor = opts.hlColor || DEFAULT_HL;
var lw = opts.lw > 0 ? +opts.lw : 0.085;
var fontScale = opts.fontScale > 0 ? +opts.fontScale : 1;
var pad = opts.pad >= 0 ? +opts.pad : 4;
var ghosted = opts.ghosts && opts.ghosts.length ? applyGhosts(geom, opts.ghosts) : null;
var atomState = ghosted ? ghosted.atomState : {};
var bondState = ghosted ? ghosted.bondState : {};
var sc = buildScene(ghosted ? ghosted.geom : geom, fontScale);
var hlAtom = {}, hlBond = {};
[].concat(opts.hl || []).forEach(function (name) {
var groups = geom && geom.groups;
if (!groups || !Object.prototype.hasOwnProperty.call(groups, name)) { return; }
var g = groups[name];
(g.atoms || []).forEach(function (i) { hlAtom[i] = true; });
(g.bonds || []).forEach(function (j) { hlBond[j] = true; });
});
(opts.hlAtoms || []).forEach(function (i) { hlAtom[i] = true; });
(opts.hlBonds || []).forEach(function (j) { hlBond[j] = true; });
Object.keys(atomState).forEach(function (k) { if (atomState[k] === 'placed' || atomState[k] === 'right' || atomState[k] === 'answer') { hlAtom[k] = true; } });
Object.keys(bondState).forEach(function (k) { if (bondState[k] === 'placed' || bondState[k] === 'right' || bondState[k] === 'answer') { hlBond[k] = true; } });
var ext = opts.extentOf ? buildScene(opts.extentOf, fontScale).ext : sc.ext;
var x0 = ext.x0 - STROKE, x1 = ext.x1 + STROKE, y0 = ext.y0 - STROKE, y1 = ext.y1 + STROKE;
var s = maxBond;
if (x1 - x0 > 0) { s = Math.min(s, (W - 2 * pad) / (x1 - x0)); }
if (y1 - y0 > 0) { s = Math.min(s, (H - 2 * pad) / (y1 - y0)); }
if (!(s > 0)) { s = 0.01; }                 // degenerate box: tiny drawing, never NaN
var cx = (ext.x0 + ext.x1) / 2, cy = (ext.y0 + ext.y1) / 2;
var view = opts.view && opts.view.s > 0 ? opts.view : null;
if (view) { s = +view.s; }
function px(x) { return view ? (+view.ox || 0) + x * s : W / 2 + (x - cx) * s; }
function py(y) { return view ? (+view.oy || 0) + y * s : H / 2 + (y - cy) * s; }
function pt(p) { return num(px(p.x)) + ',' + num(py(p.y)); }
var lwPx = Math.max(1.4, lw * s);
var dash = ' stroke-dasharray="' + num(Math.max(3, 0.16 * s)) + ' ' + num(Math.max(2.5, 0.12 * s)) + '"';
var parts = [];
sc.prims.forEach(function (p) {
if (p.kind === 'poly') {
var jcol = hlBond[p.bonds[0]] && hlBond[p.bonds[1]] ? hlColor : color;
parts.push('<polygon points="' + p.pts.map(pt).join(' ') + '" fill="' + jcol + '" stroke="none"/>');
return;
}
var col = hlBond[p.bond] ? hlColor : color;
var bst = bondState[p.bond];
if (bst === 'open') { col = SOFT; }
else if (bst === 'wrong') { col = WRONG; }
var extra = bst === 'open' || bst === 'wrong' ? dash : '';
if (p.kind === 'taper') {
parts.push('<polygon points="' + p.pts.map(pt).join(' ') + '" fill="' + col + '" stroke="none"/>');
} else if (p.kind === 'line') {
parts.push('<line x1="' + num(px(p.p.x)) + '" y1="' + num(py(p.p.y)) +
'" x2="' + num(px(p.q.x)) + '" y2="' + num(py(p.q.y)) + '" stroke="' + col + '"' + extra + '/>');
} else if (p.kind === 'wedge') {
parts.push('<polygon points="' + pt(p.apex) + ' ' + pt(p.b1) + ' ' + pt(p.b2) +
'" fill="' + col + '" stroke="none"/>');
} else {
var d = p.segs.map(function (sg) {
return 'M' + num(px(sg[0])) + ' ' + num(py(sg[1])) + 'L' + num(px(sg[2])) + ' ' + num(py(sg[3]));
}).join('');
parts.push('<path d="' + d + '" stroke="' + col + '"/>');
}
});
halfBondLines(sc, ghosted ? ghosted.geom : geom, hlAtom, hlBond).forEach(function (h) {
parts.push('<line x1="' + num(px(h.p.x)) + '" y1="' + num(py(h.p.y)) +
'" x2="' + num(px(h.q.x)) + '" y2="' + num(py(h.q.y)) + '" stroke="' + hlColor + '"/>');
});
var labels = sc.texts.map(function (t) {
var col = hlAtom[t.atom] ? hlColor : color;
var ast = atomState[t.atom];
if (ast === 'open') { col = SOFT; }
else if (ast === 'wrong') { col = WRONG; }
return '<text x="' + num(px(t.x)) + '" y="' + num(py(t.y)) + '" font-size="' + num(t.fs * s) +
'" text-anchor="' + t.anchor + '"' + (col !== color ? ' fill="' + col + '"' : '') + '>' +
esc(t.text) + '</text>';
});
var head = '<svg xmlns="http://www.w3.org/2000/svg" width="' + num(W) + '" height="' + num(H) +
'" viewBox="0 0 ' + num(W) + ' ' + num(H) + '" role="img"' +
(opts.x !== undefined ? ' x="' + num(+opts.x) + '"' : '') +
(opts.y !== undefined ? ' y="' + num(+opts.y) + '"' : '') + '>';
var title = opts.title ? '<title>' + esc(opts.title) + '</title>' : '';
var bonds = '<g fill="none" stroke="' + color + '" stroke-width="' + num(lwPx) +
'" stroke-linecap="round" stroke-linejoin="round">' + parts.join('') + '</g>';
var text = '<g font-family="' + FONT + '" font-weight="700" fill="' + color + '">' + labels.join('') + '</g>';
var pills = (sc.labelBoxes || []).filter(function (b) { return hlAtom[b.atom]; }).map(function (b) {
var x0 = px(b.x0 - PILL_PAD), y0 = py(b.y0 - PILL_PAD), x1 = px(b.x1 + PILL_PAD), y1 = py(b.y1 + PILL_PAD);
return '<rect x="' + num(x0) + '" y="' + num(y0) + '" width="' + num(x1 - x0) + '" height="' + num(y1 - y0) +
'" rx="' + num((y1 - y0) / 2) + '" fill="' + PILL_FILL + '"/>';
});
var rings = [], badges = [];
var ringR = Math.max(13, 0.4 * s);
Object.keys(atomState).forEach(function (k) {
var st = atomState[k], p = sc.pos[+k];
if (!p) { return; }
var cxp = px(p.x), cyp = py(p.y);
if (st === 'open' || st === 'wrong') {
rings.push('<circle cx="' + num(cxp) + '" cy="' + num(cyp) + '" r="' + num(ringR) + '" fill="' + PILL_FILL + '" fill-opacity="0.6" stroke="' +
(st === 'wrong' ? WRONG : SOFT) + '" stroke-width="1.8" stroke-dasharray="4 3"/>');
}
if (st === 'wrong' || st === 'right') { badges.push(badge(cxp + ringR * 0.85, cyp - ringR * 0.85, BADGE_R, st === 'right')); }
if (st === 'placed') {
var pb = (sc.labelBoxes || []).filter(function (b) { return b.atom === +k; })[0];
if (pb) {
var qx0 = px(pb.x0 - PILL_PAD), qy0 = py(pb.y0 - PILL_PAD), qx1 = px(pb.x1 + PILL_PAD), qy1 = py(pb.y1 + PILL_PAD);
rings.push('<rect x="' + num(qx0) + '" y="' + num(qy0) + '" width="' + num(qx1 - qx0) + '" height="' + num(qy1 - qy0) + '" rx="' + num((qy1 - qy0) / 2) +
'" fill="none" stroke="' + hlColor + '" stroke-width="1.8" stroke-dasharray="4 3"/>');
} else {
rings.push('<circle cx="' + num(cxp) + '" cy="' + num(cyp) + '" r="' + num(ringR * 0.7) + '" fill="none" stroke="' + hlColor +
'" stroke-width="1.8" stroke-dasharray="4 3"/>');
}
}
});
(opts.marks || []).forEach(function (m) {
var good = m.state === 'right';
if (m.atom !== undefined && sc.pos[m.atom]) {
var p = sc.pos[m.atom], bx = (sc.labelBoxes || []).filter(function (b) { return b.atom === m.atom; })[0];
var mx = px(p.x), my = py(p.y);
if (bx) {
var rx0 = px(bx.x0 - PILL_PAD), ry0 = py(bx.y0 - PILL_PAD), rx1 = px(bx.x1 + PILL_PAD), ry1 = py(bx.y1 + PILL_PAD);
rings.push('<rect x="' + num(rx0) + '" y="' + num(ry0) + '" width="' + num(rx1 - rx0) + '" height="' + num(ry1 - ry0) + '" rx="' + num((ry1 - ry0) / 2) +
'" fill="none" stroke="' + (good ? hlColor : WRONG) + '" stroke-width="1.8" stroke-dasharray="4 3"/>');
badges.push(badge(rx1, ry0, BADGE_R, good));
} else {
rings.push('<circle cx="' + num(mx) + '" cy="' + num(my) + '" r="' + num(ringR * 0.7) + '" fill="none" stroke="' + (good ? hlColor : WRONG) +
'" stroke-width="1.8" stroke-dasharray="4 3"/>');
badges.push(badge(mx + ringR * 0.6, my - ringR * 0.6, BADGE_R, good));
}
} else if (m.bond !== undefined && sc.bonds[m.bond] && sc.pos[sc.bonds[m.bond].a] && sc.pos[sc.bonds[m.bond].b]) {
var bd = sc.bonds[m.bond], A = sc.pos[bd.a], B = sc.pos[bd.b];
rings.push('<line x1="' + num(px(A.x)) + '" y1="' + num(py(A.y)) + '" x2="' + num(px(B.x)) + '" y2="' + num(py(B.y)) + '" stroke="' + (good ? hlColor : WRONG) +
'" stroke-width="' + num(Math.max(6, lwPx * 3)) + '" stroke-opacity="0.45" stroke-linecap="round"/>');
badges.push(badge((px(A.x) + px(B.x)) / 2, (py(A.y) + py(B.y)) / 2 - ringR * 0.55, BADGE_R, good));
}
});
var layout = {
scale: s, width: W, height: H,
atoms: sc.pos.map(function (p, i) {
var bx = (sc.labelBoxes || []).filter(function (b) { return b.atom === i; })[0];
return { x: px(p.x), y: py(p.y), box: bx ? { x0: px(bx.x0), y0: py(bx.y0), x1: px(bx.x1), y1: py(bx.y1) } : null };
}),
bonds: sc.bonds.map(function (bd) {
var A = sc.pos[bd.a], B = sc.pos[bd.b];
return A && B ? { x1: px(A.x), y1: py(A.y), x2: px(B.x), y2: py(B.y) } : null;
})
};
return { svg: head + title + bonds + pills.join('') + rings.join('') + text + badges.join('') + '</svg>', layout: layout };
}
MG.renderMoleculeEx = renderEx;
MG.renderMolecule = function (geom, opts) { return renderEx(geom, opts).svg; };
MG.moleculeExtent = function (geom) {
var ext = buildScene(geom, 1).ext;
return { w: ext.x1 - ext.x0, h: ext.y1 - ext.y0 };
};
})(typeof window !== 'undefined' ? window : globalThis);

(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
var SVGNS = 'http://www.w3.org/2000/svg';
var CARD_W = 140, CARD_H = 152, CARD_R = 16;
var STRUCT_X = 4, STRUCT_Y = 8, STRUCT_W = 132, STRUCT_H = 104;
var NAME_CY = (STRUCT_Y + STRUCT_H + CARD_H) / 2;   // centre line of a two-line name
var MAX_BOND = 26;                                  // caps small molecules so they do not blow up
var STRUCT_FONT = 1.3;                              // label size relative to the bond length
var PILL_H = 34, PILL_PAD = 28;
var CHIP_H = 30, CHIP_PAD = 22, CHIP_MIN_W = 52;
var PILL_TEXT = 12.5, PILL_TEXT_MAX = 170;   // pill label px, and the widest line before wrapping
var CHIP_TEXT = 13, CHIP_STACK_GAP = 8;
var ARROW_GAP = 8;
var CONNECTOR_GAP = 14;
var CHART_MARGIN = 60;
var TAG_H = 34, TAG_TEXT = 20, TAG_EM = 0.60, TAG_PAD = 28, TAG_STEP = 16;
var MEMBRANE_W = 14;   // membrane line width; a membrane's box is padded by half of it
var ZOOM_MIN = 0.07, ZOOM_MAX = 2.5;
var CHAR_EM = 0.61;
var STATES = { hidden: 1, empty: 1, active: 1, filled: 1, missed: 1 };
function tok(name, fallback) { return 'var(' + name + ', ' + fallback + ')'; }
var C = {
ink: tok('--mg-ink', '#141414'),
cardFilled: tok('--mg-question', '#FFF3B8'),
pillFilled: tok('--mg-pill', '#DFF5D8'),
missed: tok('--mg-orange', '#E8590C'),
blue: tok('--mg-blue', '#1D4ED8'),
regionLabel: '#6b5d3a'
};
function textWidth(text, px) {
return Math.ceil(String(text).length * px * CHAR_EM);
}
function wrapName(entity, text, maxLines, maxChars) {
var lines = entity && entity.lines ? entity.lines.slice() : null;
if (!lines) {
var words = String(text).split(/\s+/);
lines = [];
var cur = '';
words.forEach(function (w) {
var trial = cur ? cur + ' ' + w : w;
if (trial.length <= maxChars || !cur) { cur = trial; }
else { lines.push(cur); cur = w; }
});
if (cur) { lines.push(cur); }
}
if (lines.length > maxLines) {
var head = lines.slice(0, maxLines - 1);
var tail = lines.slice(maxLines - 1).join(' ');
lines = head.concat([tail.length > maxChars ? tail.slice(0, maxChars - 1) + '…' : tail]);
}
return lines;
}
function chipBox(display) {
var w = textWidth(display, CHIP_TEXT) + CHIP_PAD;
return { w: Math.max(CHIP_MIN_W, w), h: CHIP_H };
}
function hasStructures() {
return !!(MG.renderMolecule && MG.geometry);
}
function el(tag, attrs, parent) {
var e = document.createElementNS(SVGNS, tag);
if (attrs) {
Object.keys(attrs).forEach(function (k) {
if (attrs[k] !== null && attrs[k] !== undefined) { e.setAttribute(k, String(attrs[k])); }
});
}
if (parent) { parent.appendChild(e); }
return e;
}
function prefersReducedMotion() {
try {
return !!(root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches);
} catch (e) { return false; }
}
function unitVec(dx, dy) {
var len = Math.hypot(dx, dy) || 1;
return { x: dx / len, y: dy / len, len: len };
}
function exitDist(hw, hh, ux, uy) {
var t = Infinity;
if (Math.abs(ux) > 1e-9) { t = Math.min(t, hw / Math.abs(ux)); }
if (Math.abs(uy) > 1e-9) { t = Math.min(t, hh / Math.abs(uy)); }
return t;
}
function halfProj(w, h, n) {
return (w / 2) * Math.abs(n.x) + (h / 2) * Math.abs(n.y);
}
function leftOf(d) { return { x: d.y, y: -d.x }; }
function rightOf(d) { return { x: -d.y, y: d.x }; }
function resolveSide(spec, dflt, d) {
var n = null;
if (spec === 'L') { n = leftOf(d); }
else if (spec === 'R') { n = rightOf(d); }
else if (spec === 'up' || spec === 'north') { n = { x: 0, y: -1 }; }
else if (spec === 'down' || spec === 'south') { n = { x: 0, y: 1 }; }
else if (spec === 'west') { n = { x: -1, y: 0 }; }
else if (spec === 'east') { n = { x: 1, y: 0 }; }
if (!n || Math.abs(n.x * d.x + n.y * d.y) > 0.9) {
n = dflt === 'L' ? leftOf(d) : rightOf(d);
}
return n;
}
function wrapPill(name, maxW) {
var chunks = [];
String(name).split(' ').forEach(function (word) {
var pieces = word.split('-');
pieces.forEach(function (p, i) {
var t = i < pieces.length - 1 ? p + '-' : p;
chunks.push({ t: t, space: i === 0 });
});
});
var lines = [];
var line = '';
chunks.forEach(function (c) {
if (line === '') { line = c.t; return; }
var cand = (c.space ? line + ' ' : line) + c.t;
if (textWidth(cand, PILL_TEXT) <= (maxW || PILL_TEXT_MAX)) { line = cand; }
else { lines.push(line); line = c.t; }
});
if (line !== '') { lines.push(line); }
return lines;
}
function box(x, y, w, h) { return { x0: x, y0: y, x1: x + w, y1: y + h }; }
function overlaps(a, b, pad) {
return a.x0 < b.x1 + pad && b.x0 < a.x1 + pad && a.y0 < b.y1 + pad && b.y0 < a.y1 + pad;
}
function placeChips(ctx, r, dir, n, frac) {
var list = dir === 'in' ? r.ins : r.outs;
if (!list || !list.length) { return; }
var d = ctx.d, pill = ctx.pill, Pc = ctx.Pc, L = ctx.L;
var items = list.map(function (cid, i) {
var ent = MG.entities.cofactor[cid];
var text = ent ? ent.display : cid;
var sz = chipBox(text);
return {
slotId: dir + ':' + r.id + ':' + i, rxn: r.id, kind: dir, cofId: cid, display: text,
family: ent ? ent.family : 'small', w: sz.w, h: sz.h
};
});
var obstacles = [];
Object.keys(L.cards).forEach(function (id) { var q = L.cards[id]; obstacles.push(box(q.x, q.y, q.w, q.h)); });
Object.keys(L.pills).forEach(function (id) { var q = L.pills[id]; obstacles.push(box(q.x, q.y, q.w, q.h)); });
Object.keys(L.badges).forEach(function (id) { var q = L.badges[id]; obstacles.push(box(q.x, q.y, q.w, q.h)); });
L.chips.forEach(function (q) { obstacles.push(box(q.x, q.y, q.w, q.h)); });

function layoutWith(nVec, offDelta, shiftS) {
var s = { x: -nVec.y, y: nVec.x };
if (s.x * d.x + s.y * d.y < 0) { s = { x: -s.x, y: -s.y }; }
var tc = ((ctx.S.x - Pc.x) * d.x + (ctx.S.y - Pc.y) * d.y + ctx.Lv * frac) * (s.x * d.x + s.y * d.y) + shiftS;
var pillN = halfProj(pill.w, pill.h, nVec);
var pillS = halfProj(pill.w, pill.h, s);
var chipN = 0;
items.forEach(function (it) { chipN = Math.max(chipN, halfProj(it.w, it.h, nVec)); });
var off = pillN + chipN + CONNECTOR_GAP + offDelta;
var ext = items.map(function (it) { return Math.abs(it.w * s.x) + Math.abs(it.h * s.y); });
var total = CHIP_STACK_GAP * (items.length - 1);
ext.forEach(function (e) { total += e; });
var t = tc - total / 2;
var placed = items.map(function (it, k) {
var tcen = t + ext[k] / 2;
t += ext[k] + CHIP_STACK_GAP;
var cx = Pc.x + s.x * tcen + nVec.x * off;
var cy = Pc.y + s.y * tcen + nVec.y * off;
var x = cx - it.w / 2, y = cy - it.h / 2;
var nearChip = off - halfProj(it.w, it.h, nVec) - 1.5;
var nearPill = Math.abs(tcen) <= pillS ? pillN + 1.5 : 1.5;
var conn = null;
if (nearChip - nearPill >= 4) {
var a = { x: Pc.x + s.x * tcen + nVec.x * nearChip, y: Pc.y + s.y * tcen + nVec.y * nearChip };
var b = { x: Pc.x + s.x * tcen + nVec.x * nearPill, y: Pc.y + s.y * tcen + nVec.y * nearPill };
conn = dir === 'in' ? { x1: a.x, y1: a.y, x2: b.x, y2: b.y } : { x1: b.x, y1: b.y, x2: a.x, y2: a.y };
}
return { cx: cx, cy: cy, x: x, y: y, w: it.w, h: it.h, conn: conn };
});
var clear = placed.every(function (p) {
var pb = box(p.x, p.y, p.w, p.h);
return obstacles.every(function (ob) { return !overlaps(pb, ob, 4); });
});
return { placed: placed, clear: clear };
}

var tries = [
[n, 0, 0], [n, 16, 0], [n, 32, 0], [n, 48, 0],
[n, 0, 18], [n, 0, -18], [n, 16, 24], [n, 16, -24],
[n, 32, 32], [n, 32, -32],
[{ x: -n.x, y: -n.y }, 0, 0], [{ x: -n.x, y: -n.y }, 16, 0]
];
var best = layoutWith(n, 0, 0);
if (!best.clear) {
for (var ti = 1; ti < tries.length; ti++) {
var cand = layoutWith(tries[ti][0], tries[ti][1], tries[ti][2]);
if (cand.clear) { best = cand; break; }
}
}
items.forEach(function (it, k) {
var p = best.placed[k];
it.cx = p.cx; it.cy = p.cy; it.x = p.x; it.y = p.y; it.conn = p.conn;
L.chips.push(it);
});
}
function badgeBox(step, px, py) {
var w = Math.max(24, textWidth(step, 12) + 10);
return box(px - 6, py - 10, w, 24);
}
function choosePill(L, label, step, S, E, base) {
var widths = [PILL_TEXT_MAX, 150, 130, 112, 96];
var slide = [0, 0.04, -0.04, 0.08, -0.08, 0.12, -0.12, 0.16, -0.16, 0.2, -0.2];
var perps = [0, 22, -22, 44, -44];
var u = unitVec(E.x - S.x, E.y - S.y);
var perp = { x: -u.y, y: u.x };
var cards = Object.keys(L.cards).map(function (id) {
var q = L.cards[id];
return box(q.x, q.y, q.w, q.h);
});
var others = [];
Object.keys(L.pills).forEach(function (id) { var q = L.pills[id]; others.push(box(q.x, q.y, q.w, q.h)); });
Object.keys(L.badges).forEach(function (id) { var q = L.badges[id]; others.push(box(q.x, q.y, q.w, q.h)); });
L.chips.forEach(function (q) { others.push(box(q.x, q.y, q.w, q.h)); });

function candidate(f, maxW, po) {
var lines = wrapPill(label, maxW);
var tw = 0;
lines.forEach(function (ln) { tw = Math.max(tw, textWidth(ln, PILL_TEXT)); });
var pw = Math.max(90, tw + PILL_PAD);
var ph = PILL_H + (lines.length - 1) * 14;
var cx = S.x + (E.x - S.x) * f + perp.x * (po || 0);
var cy = S.y + (E.y - S.y) * f + perp.y * (po || 0);
return { lines: lines, pw: pw, ph: ph, pillAt: f, cx: cx, cy: cy, pb: box(cx - pw / 2, cy - ph / 2, pw, ph) };
}
var fallback = candidate(base, widths[0], 0);
for (var p = 0; p < perps.length; p++) {
for (var k = 0; k < slide.length; k++) {
var f = base + slide[k];
if (f < 0.25 || f > 0.75) { continue; }
for (var w = 0; w < widths.length; w++) {
var c = candidate(f, widths[w], perps[p]);
var bb = badgeBox(step, c.pb.x0, c.pb.y0);
var clearCards = cards.every(function (card) {
return !overlaps(c.pb, card, 8) && !overlaps(bb, card, 2);
});
var clearOthers = others.every(function (ob) {
return !overlaps(c.pb, ob, 6) && !overlaps(bb, ob, 2);
});
if (clearCards && clearOthers) { return c; }
}
}
}
return fallback;
}
function clipEndpoints(pts, hw0, hh0, hw1, hh1) {
var n = pts.length;
var f = unitVec(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
var l = unitVec(pts[n - 1].x - pts[n - 2].x, pts[n - 1].y - pts[n - 2].y);
var t0 = exitDist(hw0, hh0, f.x, f.y), t1 = exitDist(hw1, hh1, l.x, l.y);
var out = pts.slice();
out[0] = { x: pts[0].x + f.x * t0, y: pts[0].y + f.y * t0 };
out[n - 1] = { x: pts[n - 1].x - l.x * t1, y: pts[n - 1].y - l.y * t1 };
return out;
}
function clipRoute(pts, HW, HH) {
return clipEndpoints(pts, HW, HH, HW, HH);
}
function layoutReaction(L, r, cw) {
var main = r.arrows[0];
var A = L.cards[main.from], B = L.cards[main.to];
if (!A || !B) {
console.error('chart: reaction ' + r.id + ' refers to a node that is not in the pathway');
return;
}
var HW = cw / 2 + ARROW_GAP, HH = CARD_H / 2 + ARROW_GAP;
var sh = r.shift ? { x: r.shift[0] || 0, y: r.shift[1] || 0 } : { x: 0, y: 0 };
r.arrows.forEach(function (a, i) {
var P = L.cards[a.from], Q = L.cards[a.to];
if (!P || !Q) { return; }
var o = i === 0 ? sh : { x: 0, y: 0 };
var viaPts = (a.via || []).map(function (q) { return { x: q.x + o.x, y: q.y + o.y }; });
var pts = [{ x: P.cx + o.x, y: P.cy + o.y }].concat(viaPts, [{ x: Q.cx + o.x, y: Q.cy + o.y }]);
var route = clipRoute(pts, HW, HH);
var eff = a.effect || null;
var dashed = !!(a.dashed || eff === 'inhibit' || eff === 'activate');
var badge = a.badge || (eff === 'inhibit' ? '−' : (eff === 'activate' ? '+' : null));
L.arrows.push({
id: 'arr:' + r.id + ':' + i, rxn: r.id, index: i, main: i === 0,
twoWay: a.twoWay !== undefined ? !!a.twoWay : (a.link ? false : !!r.twoWay),
link: !!a.link,
effect: eff, dashed: dashed, badge: badge, toPill: a.toPill || null, label: a.label || null, role: a.role || null, junction: a.junction || null, rawVia: viaPts, shift: o,
from: a.from, to: a.to,
pts: route,
x1: route[0].x, y1: route[0].y, x2: route[route.length - 1].x, y2: route[route.length - 1].y
});
});
var Ac = { x: A.cx + sh.x, y: A.cy + sh.y }, Bc = { x: B.cx + sh.x, y: B.cy + sh.y };
var distAB = Math.hypot(Bc.x - Ac.x, Bc.y - Ac.y);
if (distAB < 1) { console.error('chart: reaction ' + r.id + ' has coincident nodes ' + main.from + ' and ' + main.to); }
var u = distAB < 1 ? { x: 1, y: 0, len: 1 } : unitVec(Bc.x - Ac.x, Bc.y - Ac.y);
var t0 = distAB < 1 ? 0 : exitDist(HW, HH, u.x, u.y);
var S = { x: Ac.x + u.x * t0, y: Ac.y + u.y * t0 };
var E = { x: Bc.x - u.x * t0, y: Bc.y - u.y * t0 };
var Lv = Math.hypot(E.x - S.x, E.y - S.y);
var d = { x: u.x, y: u.y };
var enz = MG.entities.enzyme[r.enzyme];
var label = enz ? enz.name : r.enzyme;
var base = typeof r.pillAt === 'number' ? r.pillAt : 0.5;
var choice = choosePill(L, label, String(r.step), S, E, base);
var lines = choice.lines, pw = choice.pw, ph = choice.ph, pillAt = choice.pillAt;
var Pc = { x: choice.cx, y: choice.cy };
var pill = {
id: r.id, rxn: r.id, cx: Pc.x, cy: Pc.y, w: pw, h: ph,
x: Pc.x - pw / 2, y: Pc.y - ph / 2, lines: lines, label: label
};
L.pills[r.id] = pill;
var bt = String(r.step);
L.badges[r.id] = {
rxn: r.id, text: bt, x: pill.x - 6, y: pill.y - 10,
w: Math.max(24, textWidth(bt, 12) + 10), h: 24
};
var cof = r.cof || {};
var nIn = resolveSide(cof['in'], 'L', d);
var nOut = resolveSide(cof.out, 'R', d);
var same = nIn.x * nOut.x + nIn.y * nOut.y > 0.99;
var ctx = { L: L, pill: pill, Pc: Pc, S: S, Lv: Lv, d: d };
var fracIn = same ? 0.25 : 0.5, fracOut = same ? 0.75 : 0.5;
placeChips(ctx, r, 'in', nIn, fracIn);
placeChips(ctx, r, 'out', nOut, fracOut);
}
function placeBadges(L) {
var fixed = [];
Object.keys(L.cards).forEach(function (id) { var c = L.cards[id]; fixed.push({ id: null, b: box(c.x, c.y, c.w, c.h) }); });
Object.keys(L.pills).forEach(function (id) { var q = L.pills[id]; fixed.push({ id: id, b: box(q.x, q.y, q.w, q.h) }); });
L.chips.forEach(function (c) { fixed.push({ id: null, b: box(c.x, c.y, c.w, c.h) }); });
Object.keys(L.badges).forEach(function (id) {
var bd = L.badges[id], q = L.pills[id];
if (!q) { return; }
var spots = [
{ x: q.x - 6, y: q.y - 10 },
{ x: q.x + q.w - bd.w + 6, y: q.y - 10 },
{ x: q.x - 6, y: q.y + q.h - bd.h + 10 },
{ x: q.x + q.w - bd.w + 6, y: q.y + q.h - bd.h + 10 }
];
var pick = spots[0];
for (var i = 0; i < spots.length; i++) {
var bb = box(spots[i].x, spots[i].y, bd.w, bd.h);
var ok = fixed.every(function (f) { return f.id === id || !overlaps(bb, f.b, 2); });
if (ok) { pick = spots[i]; break; }
}
bd.x = pick.x;
bd.y = pick.y;
fixed.push({ id: id, b: box(bd.x, bd.y, bd.w, bd.h) });
});
}
function regionGeom(g, L, p) {
if (g.type === 'circle') {
return {
type: 'circle', cx: g.cx, cy: g.cy, r: g.r, color: g.color, label: g.label,
bbox: { x0: g.cx - g.r, y0: g.cy - g.r, x1: g.cx + g.r, y1: g.cy + g.r }
};
}
var rx = g.x, ry = g.y, rw = g.w, rh = g.h;
if (!g.fixed && L && L.cards) {
var nids = null;
if (Array.isArray(g.nodes) && g.nodes.length > 0) {
nids = g.nodes;
} else {
var allCards = Object.keys(L.cards);
var rectRegions = p && p.regions ? p.regions.filter(function (r) { return r.type !== 'circle'; }) : [];
if (rectRegions.length <= 1) {
nids = allCards;
} else if (typeof g.x === 'number' && typeof g.w === 'number') {
var x0 = g.x - 40, y0 = g.y - 40, x1 = g.x + g.w + 40, y1 = g.y + g.h + 40;
var inside = [];
allCards.forEach(function (id) {
var c = L.cards[id];
if (c && c.cx >= x0 && c.cx <= x1 && c.cy >= y0 && c.cy <= y1) {
inside.push(id);
}
});
if (inside.length > 0) {
nids = inside;
}
}
}
if (nids && nids.length > 0) {
var nodeSet = {};
var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
var count = 0;
nids.forEach(function (id) {
nodeSet[id] = true;
var c = L.cards[id];
if (c) {
count++;
if (c.x < minX) minX = c.x;
if (c.y < minY) minY = c.y;
if (c.x + c.w > maxX) maxX = c.x + c.w;
if (c.y + c.h > maxY) maxY = c.y + c.h;
}
});
if (count > 0) {
var rxnSet = {};
if (L.arrows) {
L.arrows.forEach(function (arr) {
if (nodeSet[arr.from] && nodeSet[arr.to]) {
rxnSet[arr.rxn] = true;
var q = L.pills && L.pills[arr.rxn];
if (q) {
if (q.x < minX) minX = q.x;
if (q.y < minY) minY = q.y;
if (q.x + q.w > maxX) maxX = q.x + q.w;
if (q.y + q.h > maxY) maxY = q.y + q.h;
}
var bd = L.badges && L.badges[arr.rxn];
if (bd) {
if (bd.x < minX) minX = bd.x;
if (bd.y < minY) minY = bd.y;
if (bd.x + bd.w > maxX) maxX = bd.x + bd.w;
if (bd.y + bd.h > maxY) maxY = bd.y + bd.h;
}
}
});
}
if (L.chips) {
L.chips.forEach(function (ch) {
if (rxnSet[ch.rxn]) {
if (ch.x < minX) minX = ch.x;
if (ch.y < minY) minY = ch.y;
if (ch.x + ch.w > maxX) maxX = ch.x + ch.w;
if (ch.y + ch.h > maxY) maxY = ch.y + ch.h;
}
});
}
var padX = g.padX != null ? g.padX : (g.pad != null ? g.pad : 60);
var padTop = g.padTop != null ? g.padTop : (g.padY != null ? g.padY : (g.pad != null ? g.pad : 60));
var padBottom = g.padBottom != null ? g.padBottom : (g.padY != null ? g.padY : (g.pad != null ? g.pad : 60));
rx = minX - padX;
ry = minY - padTop;
rw = (maxX - minX) + padX * 2;
rh = (maxY - minY) + padTop + padBottom;
}
}
}
return {
type: 'rect', x: rx, y: ry, w: rw, h: rh, color: g.color, label: g.label,
bbox: { x0: rx, y0: ry, x1: rx + rw, y1: ry + rh }
};
}
function regionLabel(g, solid) {
var text = String(g.label || '');
var w = text ? Math.ceil(text.length * TAG_TEXT * TAG_EM) + TAG_PAD : 0;
var h = text ? TAG_H : 0;
if (g.type === 'circle') {
return { text: text, x: g.cx - w / 2, y: g.cy - g.r - TAG_H / 2, w: w, h: h };
}
var y = g.y - TAG_H / 2, x = g.x + 24;
var right = Math.max(x, g.x + g.w - 24 - w);
if (text) {
var yTries = [g.y - TAG_H / 2, g.y - TAG_H - 6, g.y - TAG_H - 24, g.y - TAG_H - 42, g.y - TAG_H - 60, g.y - TAG_H - 84, g.y + g.h - TAG_H / 2];
var found = false;
for (var yi = 0; yi < yTries.length && !found; yi++) {
for (var s = x; s <= right; s += TAG_STEP) {
var b = box(s, yTries[yi], w, h);
var clear = solid.every(function (c) { return !overlaps(b, c, 6); });
if (clear) { x = s; y = yTries[yi]; found = true; break; }
}
}
if (!found) {
for (var sx = g.x; sx >= g.x - 80 && !found; sx -= TAG_STEP) {
var b2 = box(sx, y, w, h);
if (solid.every(function (c) { return !overlaps(b2, c, 6); })) { x = sx; found = true; break; }
}
}
}
return { text: text, x: x, y: y, w: w, h: h };
}
function noteBox(n) {
var w = Math.ceil(String(n.text).length * n.size * 0.58);
var x0 = n.anchor === 'end' ? n.x - w : (n.anchor === 'middle' ? n.x - w / 2 : n.x);
return { x0: x0, y0: n.y - n.size, x1: x0 + w, y1: n.y + n.size * 0.35 };
}
function layoutPathway(p, size) {
var cw = size && size.cardW ? size.cardW : CARD_W;
var L = { cards: {}, pills: {}, badges: {}, chips: [], arrows: [], regions: [], notes: [], membranes: [], bounds: null };
Object.keys(p.nodes).forEach(function (id) {
var n = p.nodes[id];
L.cards[id] = { id: id, mol: n.mol, cx: n.x, cy: n.y, x: n.x - cw / 2, y: n.y - CARD_H / 2, w: cw, h: CARD_H };
});
p.reactions.forEach(function (r) { layoutReaction(L, r, cw); });
placeBadges(L);
L.arrows.forEach(function (a) {
if (a.toPill && L.pills[a.toPill] && L.cards[a.from]) {
var P = L.cards[a.from], Q = L.pills[a.toPill], o = a.shift || { x: 0, y: 0 };
var pts = [{ x: P.cx + o.x, y: P.cy + o.y }].concat(a.rawVia || [], [{ x: Q.cx, y: Q.cy }]);
var route = clipEndpoints(pts, cw / 2 + ARROW_GAP, CARD_H / 2 + ARROW_GAP, Q.w / 2 + ARROW_GAP, Q.h / 2 + ARROW_GAP);
a.pts = route;
a.x1 = route[0].x; a.y1 = route[0].y;
a.x2 = route[route.length - 1].x; a.y2 = route[route.length - 1].y;
}
});
var solid = [];
Object.keys(L.cards).forEach(function (id) { var c = L.cards[id]; solid.push(box(c.x, c.y, c.w, c.h)); });
Object.keys(L.pills).forEach(function (id) { var q = L.pills[id]; solid.push(box(q.x, q.y, q.w, q.h)); });
Object.keys(L.badges).forEach(function (id) { var b = L.badges[id]; solid.push(box(b.x, b.y, b.w, b.h)); });
L.chips.forEach(function (c) { solid.push(box(c.x, c.y, c.w, c.h)); });
L.arrows.forEach(function (a) {
if (!a.badge) { return; }
var fracs = [0.5, 0.35, 0.65, 0.25, 0.75];
var best = polylineAt(a.pts, 0.5);
for (var fi = 0; fi < fracs.length; fi++) {
var pt = polylineAt(a.pts, fracs[fi]);
var bx = box(pt.x - 11, pt.y - 11, 22, 22);
if (solid.every(function (sb) { return !overlaps(bx, sb, 4); })) { best = pt; break; }
}
a.badgePos = best;
solid.push(box(best.x - 11, best.y - 11, 22, 22));
});
L.regions = (p.regions || []).map(function (g) {
var rg = regionGeom(g, L, p);
rg.labelBox = regionLabel(rg, solid);
return rg;
});
var noteSolid = solid.slice();
L.regions.forEach(function (rg) {
var lb = rg.labelBox;
if (lb && lb.w) { noteSolid.push(box(lb.x, lb.y, lb.w, lb.h)); }
});
function boxHitsSeg(b, p1, p2, pad) {
  var rx0 = b.x0 - pad, ry0 = b.y0 - pad, rx1 = b.x1 + pad, ry1 = b.y1 + pad;
  var sx0 = Math.min(p1.x, p2.x), sx1 = Math.max(p1.x, p2.x);
  var sy0 = Math.min(p1.y, p2.y), sy1 = Math.max(p1.y, p2.y);
  if (sx1 < rx0 || sx0 > rx1 || sy1 < ry0 || sy0 > ry1) { return false; }
  var t0 = 0, t1 = 1, dx = p2.x - p1.x, dy = p2.y - p1.y;
  var p = [-dx, dx, -dy, dy];
  var q = [p1.x - rx0, rx1 - p1.x, p1.y - ry0, ry1 - p1.y];
  for (var i = 0; i < 4; i++) {
    if (Math.abs(p[i]) < 1e-9) {
      if (q[i] < 0) { return false; }
    } else {
      var t = q[i] / p[i];
      if (p[i] < 0) {
        if (t > t1) { return false; }
        if (t > t0) { t0 = t; }
      } else {
        if (t < t0) { return false; }
        if (t < t1) { t1 = t; }
      }
    }
  }
  return t0 <= t1;
}
function hitsOtherArrow(b, ownerArrow, pad) {
  for (var ai = 0; ai < L.arrows.length; ai++) {
    var oa = L.arrows[ai];
    if (oa === ownerArrow || !oa.pts || oa.pts.length < 2) { continue; }
    for (var pi = 0; pi < oa.pts.length - 1; pi++) {
      if (boxHitsSeg(b, oa.pts[pi], oa.pts[pi + 1], pad)) { return true; }
    }
  }
  return false;
}
var linkLabelIdx = 0;
L.arrows.forEach(function (a) {
if (!a.label || !a.pts || a.pts.length < 2) { return; }
var idx = linkLabelIdx++;
var lw = Math.ceil(String(a.label).length * 12 * 0.56) + 20, lh = 24;
var segs = [];
for (var si = 0; si < a.pts.length - 1; si++) {
  var sp1 = a.pts[si], sp2 = a.pts[si + 1];
  var slen = Math.hypot(sp2.x - sp1.x, sp2.y - sp1.y);
  var isHoriz = Math.abs(sp2.y - sp1.y) < 1;
  segs.push({ i: si, p1: sp1, p2: sp2, len: slen, horiz: isHoriz, score: slen * (isHoriz ? 1.65 : 1.0) });
}
segs.sort(function (sa, sb) { return sb.score - sa.score; });
var fracs = idx % 2 === 0 ? [0.30, 0.70, 0.50, 0.22, 0.78] : [0.70, 0.30, 0.50, 0.78, 0.22];
var offsets = [0, -26, 26, -46, 46];
var best = null;
for (var oi = 0; oi < offsets.length && !best; oi++) {
  for (var sk = 0; sk < segs.length && !best; sk++) {
    var sg = segs[sk];
    if (sg.len < 55) { continue; }
    var su = unitVec(sg.p2.x - sg.p1.x, sg.p2.y - sg.p1.y);
    var sperp = { x: -su.y, y: su.x };
    for (var fi = 0; fi < fracs.length && !best; fi++) {
      var lx = sg.p1.x + (sg.p2.x - sg.p1.x) * fracs[fi] + sperp.x * offsets[oi];
      var ly = sg.p1.y + (sg.p2.y - sg.p1.y) * fracs[fi] + sperp.y * offsets[oi];
      var lb = box(lx - lw / 2, ly - lh / 2, lw, lh);
      if (noteSolid.every(function (sb) { return !overlaps(lb, sb, 6); }) && !hitsOtherArrow(lb, a, 8)) {
        best = { x: lx, y: ly };
      }
    }
  }
}
if (!best) {
  for (var sk2 = 0; sk2 < segs.length && !best; sk2++) {
    var sg2 = segs[sk2];
    if (sg2.len < 40) { continue; }
    for (var fi2 = 0; fi2 < fracs.length && !best; fi2++) {
      var lx2 = sg2.p1.x + (sg2.p2.x - sg2.p1.x) * fracs[fi2];
      var ly2 = sg2.p1.y + (sg2.p2.y - sg2.p1.y) * fracs[fi2];
      var lb2 = box(lx2 - lw / 2, ly2 - lh / 2, lw, lh);
      if (noteSolid.every(function (sb) { return !overlaps(lb2, sb, 4); })) {
        best = { x: lx2, y: ly2 };
      }
    }
  }
}
if (!best) { best = polylineAt(a.pts, 0.5); }
a.labelPos = { x: best.x, y: best.y, w: lw, h: lh };
noteSolid.push(box(best.x - lw / 2, best.y - lh / 2, lw, lh));
});
var noteList = (p.notes || []).map(function (n) {
return { text: n.text, x: n.x, y: n.y, size: n.size || 16, color: n.color || C.regionLabel, anchor: n.anchor || 'start' };
});
var rectRegions = L.regions.filter(function (rg) { return rg.type === 'rect'; }).map(function (rg) { return rg.bbox; });
var dyCands = [0];
for (var d = 14; d <= 182; d += 14) { dyCands.push(d, -d); }
var dxCands = [0, 40, -40, 80, -80];
L.notes = noteList.map(function (nt) {
var placed = false;
for (var xi = 0; xi < dxCands.length && !placed; xi++) {
for (var yi = 0; yi < dyCands.length && !placed; yi++) {
var cx = nt.x + dxCands[xi], cy = nt.y + dyCands[yi];
var b = noteBox({ text: nt.text, x: cx, y: cy, size: nt.size, anchor: nt.anchor });
var okSolid = noteSolid.every(function (sb) { return !overlaps(b, sb, 6); });
var okReg = rectRegions.every(function (r) {
var inside = b.x0 >= r.x0 && b.x1 <= r.x1 && b.y0 >= r.y0 && b.y1 <= r.y1;
var shares = b.x0 < r.x1 && b.x1 > r.x0 && b.y0 < r.y1 && b.y1 > r.y0;
return inside || !shares;
});
if (okSolid && okReg) {
nt.x = cx; nt.y = cy; placed = true;
}
}
}
nt.box = noteBox(nt);
noteSolid.push(nt.box);
return nt;
});
var b = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
function grow(q) {
b.x0 = Math.min(b.x0, q.x0); b.y0 = Math.min(b.y0, q.y0);
b.x1 = Math.max(b.x1, q.x1); b.y1 = Math.max(b.y1, q.y1);
}
solid.forEach(grow);
L.regions.forEach(function (rg) {
grow(rg.bbox);
var lb = rg.labelBox;
if (lb.w) { grow({ x0: lb.x, y0: lb.y, x1: lb.x + lb.w, y1: lb.y + lb.h }); }   // a title tag sticks out above its region
});
L.membranes = (p.membranes || []).map(function (m) { return { x1: m.x1, y1: m.y1, x2: m.x2, y2: m.y2 }; });
L.membranes.forEach(function (m) {
var hw = MEMBRANE_W / 2;
grow({ x0: Math.min(m.x1, m.x2) - hw, y0: Math.min(m.y1, m.y2) - hw, x1: Math.max(m.x1, m.x2) + hw, y1: Math.max(m.y1, m.y2) + hw });
});
L.notes.forEach(function (nt) { grow(nt.box); });
L.arrows.forEach(function (a) {
if (!a.link) { return; }
(a.pts || []).forEach(function (pt) {
  grow({ x0: pt.x - 10, y0: pt.y - 10, x1: pt.x + 10, y1: pt.y + 10 });
});
if (a.labelPos) {
  var lp = a.labelPos;
  grow({ x0: lp.x - lp.w / 2, y0: lp.y - lp.h / 2, x1: lp.x + lp.w / 2, y1: lp.y + lp.h / 2 });
}
});
if (b.x0 === Infinity) { b = { x0: 0, y0: 0, x1: 1, y1: 1 }; }
L.bounds = {
x: b.x0 - CHART_MARGIN, y: b.y0 - CHART_MARGIN,
w: b.x1 - b.x0 + 2 * CHART_MARGIN, h: b.y1 - b.y0 + 2 * CHART_MARGIN
};
L.solid = solid;
return L;
}
function missedFlag(parent, cx, cy, r, textCls) {
var g = el('g', { 'class': 'mgc-flag' }, parent);
el('circle', { 'class': 'mgc-flag-disc', cx: cx, cy: cy, r: r }, g);
var t = el('text', { 'class': textCls, x: cx, y: cy, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, g);
t.textContent = '!';
return g;
}
function darken(hex, amount) {
var m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
if (!m) { return '#6b5d3a'; }
var n = parseInt(m[1], 16);
var parts = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
return '#' + parts.map(function (v) {
var s = Math.max(0, Math.round(v * (1 - amount))).toString(16);
return s.length < 2 ? '0' + s : s;
}).join('');
}
function clearNode(node) {
while (node.firstChild) { node.removeChild(node.firstChild); }
}
function replay(node, cls) {
node.classList.remove(cls);
void node.getBoundingClientRect();
node.classList.add(cls);
}
function polylineAt(pts, frac) {
var total = 0, segs = [];
for (var i = 0; i < pts.length - 1; i++) {
var len = Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y);
segs.push(len);
total += len;
}
var target = total * frac, acc = 0;
for (var j = 0; j < segs.length; j++) {
if (acc + segs[j] >= target && segs[j] > 0) {
var t = (target - acc) / segs[j];
return { x: pts[j].x + (pts[j + 1].x - pts[j].x) * t, y: pts[j].y + (pts[j + 1].y - pts[j].y) * t };
}
acc += segs[j];
}
return { x: pts[0].x, y: pts[0].y };
}
function polylineD(pts, twoWay, bluntEnd, cornerR) {
var n = pts.length, last = pts[n - 1], prev = pts[n - 2];
var l = unitVec(last.x - prev.x, last.y - prev.y);
var first = pts[0], f = unitVec(pts[1].x - first.x, pts[1].y - first.y);
var s = twoWay ? { x: first.x + f.x * 8.4, y: first.y + f.y * 8.4 } : first;
var endPull = bluntEnd ? 0 : 8.4;
var e = { x: last.x - l.x * endPull, y: last.y - l.y * endPull };
var d = 'M' + s.x.toFixed(1) + ' ' + s.y.toFixed(1);
if (n > 2 && cornerR > 0) {
  var rPts = [s].concat(pts.slice(1, n - 1), [e]);
  for (var k = 1; k < rPts.length - 1; k++) {
    var pPrev = rPts[k - 1], pCur = rPts[k], pNext = rPts[k + 1];
    var len1 = Math.hypot(pCur.x - pPrev.x, pCur.y - pPrev.y);
    var len2 = Math.hypot(pNext.x - pCur.x, pNext.y - pCur.y);
    var u1x = len1 > 1 ? (pCur.x - pPrev.x) / len1 : 0;
    var u1y = len1 > 1 ? (pCur.y - pPrev.y) / len1 : 0;
    var u2x = len2 > 1 ? (pNext.x - pCur.x) / len2 : 0;
    var u2y = len2 > 1 ? (pNext.y - pCur.y) / len2 : 0;
    var cross = Math.abs(u1x * u2y - u1y * u2x);
    var r = Math.min(cornerR, len1 * 0.45, len2 * 0.45);
    if (cross > 0.05 && r >= 2) {
      var c1x = pCur.x - u1x * r, c1y = pCur.y - u1y * r;
      var c2x = pCur.x + u2x * r, c2y = pCur.y + u2y * r;
      d += ' L' + c1x.toFixed(1) + ' ' + c1y.toFixed(1) +
           ' Q' + pCur.x.toFixed(1) + ' ' + pCur.y.toFixed(1) + ' ' + c2x.toFixed(1) + ' ' + c2y.toFixed(1);
    } else {
      d += ' L' + pCur.x.toFixed(1) + ' ' + pCur.y.toFixed(1);
    }
  }
  return d + ' L' + e.x.toFixed(1) + ' ' + e.y.toFixed(1);
}
for (var k = 1; k < n - 1; k++) { d += ' L' + pts[k].x.toFixed(1) + ' ' + pts[k].y.toFixed(1); }
return d + ' L' + e.x.toFixed(1) + ' ' + e.y.toFixed(1);
}
function headAt(pts) {
var n = pts.length, last = pts[n - 1], prev = pts[n - 2];
var l = unitVec(last.x - prev.x, last.y - prev.y);
return headD(last.x, last.y, l.x, l.y, 14, 6.5);
}
function bluntAt(pts) {
var n = pts.length, last = pts[n - 1], prev = pts[n - 2];
var l = unitVec(last.x - prev.x, last.y - prev.y);
var px = -l.y * 9.5, py = l.x * 9.5;
return 'M' + (last.x + px).toFixed(1) + ' ' + (last.y + py).toFixed(1) +
' L' + (last.x - px).toFixed(1) + ' ' + (last.y - py).toFixed(1);
}
function headStartAt(pts) {
var first = pts[0], f = unitVec(pts[1].x - first.x, pts[1].y - first.y);
return headD(first.x, first.y, -f.x, -f.y, 14, 6.5);
}
function shaftD(x1, y1, x2, y2, ux, uy, headLen) {
return 'M' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' L' +
(x2 - ux * headLen * 0.6).toFixed(1) + ' ' + (y2 - uy * headLen * 0.6).toFixed(1);
}
function headD(x2, y2, ux, uy, len, half) {
var bx = x2 - ux * len, by = y2 - uy * len;
var px = -uy * half, py = ux * half;
return 'M' + x2.toFixed(1) + ' ' + y2.toFixed(1) +
' L' + (bx + px).toFixed(1) + ' ' + (by + py).toFixed(1) +
' L' + (bx - px).toFixed(1) + ' ' + (by - py).toFixed(1) + ' Z';
}
var structCache = {};
function structureSvg(mol) {
if (!hasStructures() || !MG.geometry[mol]) { return null; }
var flagged = MG.entities && MG.entities.molecule && MG.entities.molecule[mol];
if (flagged && flagged.noStructure) { return null; }    // a molecule flagged noStructure never shows a drawing
if (!(mol in structCache)) {
try {
structCache[mol] = MG.renderMolecule(MG.geometry[mol], {
width: STRUCT_W, height: STRUCT_H, x: STRUCT_X, y: STRUCT_Y, maxBond: MAX_BOND,
fontScale: STRUCT_FONT, pad: 0
});
} catch (e) {
console.error('chart: could not draw ' + mol, e);
structCache[mol] = null;
}
}
return structCache[mol];
}
function shrinkToFit(t, maxW, px) {
t.style.fontSize = px + 'px';
var w = t.getComputedTextLength ? t.getComputedTextLength() : 0;
if (w > maxW) { t.style.fontSize = Math.max(12, Math.floor(px * maxW / w * 2) / 2) + 'px'; }
}
function addLines(parent, lines, cx, cy0, lh, cls, maxW) {
var n = lines.length;
lines.forEach(function (text, i) {
var t = el('text', {
'class': cls, x: cx, y: cy0 + (i - (n - 1) / 2) * lh,
'text-anchor': 'middle', 'dominant-baseline': 'central'
}, parent);
t.textContent = text;
if (maxW) { fitText(t, maxW); }
});
}
function fitText(t, maxW) {
t.removeAttribute('textLength');
t.removeAttribute('lengthAdjust');
var w = t.getComputedTextLength ? t.getComputedTextLength() : 0;
if (w > maxW) {
t.setAttribute('textLength', maxW.toFixed(1));
t.setAttribute('lengthAdjust', 'spacingAndGlyphs');
}
}
function paintNode(refs, state, mol) {
clearNode(refs.content);
if (state !== 'filled' && state !== 'missed') {
var q = el('text', {
'class': 'mgc-node-q', x: CARD_W / 2, y: STRUCT_Y + STRUCT_H / 2,
'text-anchor': 'middle', 'dominant-baseline': 'central'
}, refs.content);
q.textContent = '?';
return;
}
var ent = MG.entities.molecule[mol];
var name = ent ? ent.name : mol;
var svg = structureSvg(mol);
if (svg) {
refs.content.innerHTML = svg;
addLines(refs.content, wrapName(ent, name, 2, 16), CARD_W / 2, NAME_CY, 15, 'mgc-node-name', CARD_W - 12);
} else if (ent && ent.short) {
var repeats = String(name).toLowerCase() === String(ent.short).toLowerCase();
var sl = el('text', {
'class': 'mgc-node-short', x: CARD_W / 2, y: repeats ? CARD_H / 2 : STRUCT_Y + STRUCT_H / 2,
'text-anchor': 'middle', 'dominant-baseline': 'central'
}, refs.content);
sl.textContent = ent.short;
shrinkToFit(sl, STRUCT_W - 8, 26);
if (!repeats) { addLines(refs.content, wrapName(ent, name, 2, 16), CARD_W / 2, NAME_CY, 15, 'mgc-node-name', CARD_W - 12); }
} else {
addLines(refs.content, wrapName(ent, name, 3, 14), CARD_W / 2, CARD_H / 2, 17, 'mgc-node-name mgc-node-name--solo', CARD_W - 12);
}
}
function paintPill(refs, pill, state, showLabels, word) {
clearNode(refs.text);
var filled = state === 'filled' || state === 'missed';
var lines = filled ? pill.lines : [showLabels ? (word || 'enzyme') : '?'];
var cls = filled ? 'mgc-pill-text' : (showLabels ? 'mgc-pill-hint' : 'mgc-pill-text mgc-pill-text--q');
addLines(refs.text, lines, pill.w / 2, pill.h / 2, 13.5, cls, pill.w - 12);
}
function luminance(hex) {
var n = parseInt(hex.slice(1), 16);
var c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(function (v) {
v /= 255;
return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
});
return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function contrastRatio(a, b) {
var x = luminance(a), y = luminance(b);
return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
function textOn(fill, preferred) {
if (contrastRatio(fill, preferred) >= 4.5) { return preferred; }
return contrastRatio(fill, '#FFFFFF') >= contrastRatio(fill, '#141414') ? '#FFFFFF' : '#141414';
}
var MAP_CHIP = {
adenylate: ['#FFD08A', '#5C2E00'],
redox: ['#FFD08A', '#5C2E00'],
carrier: ['#D7DBE0', '#141414'],
small: ['#FFFFFF', '#141414']
};
function mapPair(family) {
return ['var(--mg-map-' + family + ', ' + MAP_CHIP[family][0] + ')', 'var(--mg-map-' + family + '-ink, ' + MAP_CHIP[family][1] + ')', true];
}
function chipPalette(theme, state, ent) {
if (!ent) { return null; }
if (theme === 'map' && state === 'filled' && MAP_CHIP.hasOwnProperty(ent.family)) { return mapPair(ent.family); }
return null;
}
function paintChip(refs, chip, state, value, showLabels, theme) {
var filled = state === 'filled' || state === 'missed';
var ent = filled ? MG.entities.cofactor[value || chip.cofId] : null;
var pal = chipPalette(theme, state, ent);
refs.body.style.fill = pal ? pal[0] : '';
refs.text.style.fill = pal ? (pal[2] ? pal[1] : textOn(pal[0], pal[1])) : '';
refs.text.textContent = filled ? (ent ? ent.display : chip.display) : (showLabels ? chip.kind : '?');
refs.text.setAttribute('class', filled ? 'mgc-chip-text' : (showLabels ? 'mgc-chip-hint' : 'mgc-chip-text mgc-chip-text--q'));
refs.group.setAttribute('data-family', filled ? (ent ? ent.family : chip.family) : '');
fitText(refs.text, chip.w - 10);
}
function describeSlot(P, slot, state, value) {
var rxn = null;
if (slot.rxn) { P.reactions.forEach(function (r) { if (r.id === slot.rxn) { rxn = r; } }); }
var where = !rxn ? 'chất chuyển hóa ban đầu'
: (typeof rxn.step === 'number' ? 'bước chân ' + rxn.step : 'cái ' + String(rxn.step).toLowerCase() + ' sự phản ứng lại');
var filled = state === 'filled' || state === 'missed';
var shown = state === 'missed' ? ', câu trả lời đã được hiển thị' : '';
var v = value || slot.answer;
if (slot.kind === 'node') {
var mol = MG.entities.molecule[v];
var mname = mol ? mol.name : v;
if (!filled) { return 'Ô trống: ' + (rxn ? 'chất chuyển hóa cho ' + where : 'chất chuyển hóa ban đầu'); }
return (rxn ? mname + ', ' + where : mname + ' (chất chuyển hóa ban đầu)') + shown;
}
if (slot.kind === 'enz') {
var en = MG.entities.enzyme[v];
var word = rxn && rxn.terms && rxn.terms.enz ? rxn.terms.enz : (P.terms && P.terms.enz ? P.terms.enz : 'enzyme');
return filled ? word.charAt(0).toUpperCase() + word.slice(1) + ' vì ' + where + ': ' + (en ? en.name : v) + shown : 'Ô trống: ' + word + ' vì ' + where;
}
var cf = MG.entities.cofactor[v];
var verb = slot.kind === 'in' ? 'được tiêu thụ trong ' : 'được phát hành vào ';
return filled ? (cf ? cf.name : v) + ', ' + verb + where + shown : 'Ô trống: đồng yếu tố ' + verb + where;
}
function create(container, pathway, options) {
if (!container || !pathway) { throw new Error('MG.chart.create needs a container and a pathway'); }
var opts = {
interactive: true, showSlotLabels: true, arrows: 'auto', reduceMotion: false,
onSlotClick: null, onNodeClick: null, onEnzymeClick: null, onChipClick: null, chipTheme: 'family'
};
Object.keys(options || {}).forEach(function (k) { opts[k] = options[k]; });
var reduce = !!opts.reduceMotion || prefersReducedMotion();
var P = pathway;
var stepWords = {};
P.reactions.forEach(function (r) { stepWords[r.id] = (r.terms && r.terms.enz) || (P.terms && P.terms.enz) || ''; });
function stepWord(rid) { return stepWords[rid] || ''; }
var L = layoutPathway(P);
var slots = MG.slots.list(P);
var byId = {};
slots.forEach(function (s) { byId[s.id] = s; });
var st = {};                 // slot id -> { state, value }; value null means "the answer"
slots.forEach(function (s) { st[s.id] = { state: 'hidden', value: null }; });
var refs = {};               // slot id -> DOM references
var arrowRefs = [];          // one per arrow in L.arrows, same order
var chipBySlot = {};
L.chips.forEach(function (c) { chipBySlot[c.slotId] = c; });
container.classList.add('mgc-host');
container.setAttribute('data-chip-theme', opts.chipTheme);
if (reduce) { container.classList.add('mgc-reduce'); }
if (root.getComputedStyle && root.getComputedStyle(container).position === 'static') {
container.style.position = 'relative';
}
var svg = el('svg', { 'class': 'mgc-svg', role: 'group', 'aria-label': P.title + ' sơ đồ đường đi' });
container.appendChild(svg);
var world = el('g', { 'class': 'mgc-world' }, svg);
var layers = {};
['regions', 'notes', 'arrows', 'conns', 'chips', 'pills', 'nodes', 'arrowLabels'].forEach(function (name) {
layers[name] = el('g', { 'class': 'mgc-layer mgc-layer--' + name }, world);
});
L.regions.forEach(function (rg) {
var shape = rg.type === 'circle'
? el('circle', { cx: rg.cx, cy: rg.cy, r: rg.r }, layers.regions)
: el('rect', { x: rg.x, y: rg.y, width: rg.w, height: rg.h, rx: 28 }, layers.regions);
shape.setAttribute('class', 'mgc-region');
shape.setAttribute('fill', rg.color);
});
L.regions.forEach(function (rg) {
var lb = rg.labelBox;
if (!lb.w) { return; }   // an empty label draws nothing
el('rect', {
'class': 'mgc-region-tag', x: lb.x, y: lb.y, width: lb.w, height: lb.h, rx: 10,
fill: '#FFFFFF', stroke: darken(rg.color, 0.15), 'stroke-width': 1.5
}, layers.regions);
var t = el('text', {
'class': 'mgc-region-label', x: lb.x + lb.w / 2, y: lb.y + lb.h / 2,
'text-anchor': 'middle', 'dominant-baseline': 'central', fill: darken(rg.color, 0.6)
}, layers.regions);
t.textContent = lb.text;
fitText(t, lb.w - 16);   // a wider fallback font squeezes the label rather than running past its tag
});
L.membranes.forEach(function (m) {
el('line', {
'class': 'mgc-membrane', x1: m.x1, y1: m.y1, x2: m.x2, y2: m.y2,
stroke: '#9AA0A6', 'stroke-width': MEMBRANE_W, 'stroke-linecap': 'round', 'pointer-events': 'none'
}, layers.regions);
});
L.notes.forEach(function (nt) {
var t = el('text', {
'class': 'mgc-note', x: nt.x, y: nt.y, 'text-anchor': nt.anchor,
'font-size': nt.size, fill: nt.color
}, layers.notes);
t.textContent = nt.text;
});
L.arrows.forEach(function (a) {
var roleCls = a.role ? ' mgc-arrow--role-' + a.role : '';
var cls = 'mgc-arrow mgc-off' +
(a.link ? ' mgc-arrow--link' : '') +
(a.dashed ? ' mgc-arrow--dashed' : '') +
(a.effect === 'inhibit' ? ' mgc-arrow--inhibit' : '') +
(a.effect === 'activate' ? ' mgc-arrow--activate' : '') +
roleCls;
var g = el('g', { 'class': cls, 'data-arrow': a.id }, layers.arrows);
var dPath = polylineD(a.pts, a.twoWay, a.effect === 'inhibit', a.link ? 14 : 0);
if (a.link) {
  el('path', { 'class': 'mgc-arrow-halo', d: dPath }, g);
}
var shaftAttrs = { 'class': 'mgc-arrow-line', d: dPath };
if (!a.dashed) { shaftAttrs.pathLength = 1; }
var shaft = el('path', shaftAttrs, g);
var head = el('path', { 'class': 'mgc-arrow-head', d: a.effect === 'inhibit' ? bluntAt(a.pts) : headAt(a.pts) }, g);
var startHead = a.twoWay ? el('path', { 'class': 'mgc-arrow-head mgc-arrow-head--start', d: headStartAt(a.pts) }, g) : null;
if (a.junction) {
  el('circle', { 'class': 'mgc-arrow-junction', cx: a.junction.x.toFixed(1), cy: a.junction.y.toFixed(1), r: 3.5 }, g);
}
if (a.badge && a.badgePos) {
var ab = el('g', { 'class': 'mgc-arrow-badge' }, g);
el('circle', { 'class': 'mgc-arrow-badge-bg', cx: a.badgePos.x, cy: a.badgePos.y, r: 11 }, ab);
var abt = el('text', { 'class': 'mgc-arrow-badge-text', x: a.badgePos.x, y: a.badgePos.y, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, ab);
abt.textContent = a.badge;
}
var labelEl = null;
if (a.label && a.labelPos) {
labelEl = el('g', { 'class': 'mgc-arrow-label mgc-off' + roleCls, 'data-arrow': a.id }, layers.arrowLabels);
var lp = a.labelPos;
el('rect', { 'class': 'mgc-arrow-label-bg', x: (lp.x - lp.w / 2).toFixed(1), y: (lp.y - lp.h / 2).toFixed(1), width: lp.w, height: lp.h, rx: lp.h / 2 }, labelEl);
var alt = el('text', { 'class': 'mgc-arrow-label-text', x: lp.x.toFixed(1), y: lp.y.toFixed(1), 'text-anchor': 'middle', 'dominant-baseline': 'central' }, labelEl);
alt.textContent = a.label;
}
arrowRefs.push({ def: a, g: g, shaft: shaft, head: head, startHead: startHead, labelEl: labelEl, visible: false });
});
function slotGroup(parent, id, x, y, kind) {
var g = el('g', {
'class': 'mgc-slot mgc-' + kind, 'data-slot': id, 'data-state': 'hidden',
transform: 'translate(' + x + ',' + y + ')'
}, parent);
var pop = el('g', { 'class': 'mgc-anim' }, g);
return { group: g, pop: pop };
}
slots.forEach(function (s) {
if (s.kind !== 'node') { return; }
var card = L.cards[s.node];
if (!card) { return; }
var sg = slotGroup(layers.nodes, s.id, card.x, card.y, 'node');
el('rect', { 'class': 'mgc-node-shadow', x: 3, y: 4, width: CARD_W, height: CARD_H, rx: CARD_R }, sg.pop);
el('rect', { 'class': 'mgc-node-body', x: 0, y: 0, width: CARD_W, height: CARD_H, rx: CARD_R }, sg.pop);
var content = el('g', { 'class': 'mgc-node-content' }, sg.pop);
missedFlag(sg.pop, CARD_W, 0, 8, 'mgc-flag-text');
refs[s.id] = { group: sg.group, pop: sg.pop, content: content, kind: 'node' };
});
slots.forEach(function (s) {
if (s.kind !== 'enz') { return; }
var pill = L.pills[s.rxn];
if (!pill) { return; }
var sg = slotGroup(layers.pills, s.id, pill.x, pill.y, 'pill');
el('rect', { 'class': 'mgc-pill-body', x: 0, y: 0, width: pill.w, height: pill.h, rx: pill.h / 2 }, sg.pop);
var text = el('g', { 'class': 'mgc-pill-layer' }, sg.pop);
var bd = L.badges[s.rxn];
var badge = el('g', { 'class': 'mgc-badge', transform: 'translate(' + (bd.x - pill.x) + ',' + (bd.y - pill.y) + ')' }, sg.pop);
el('rect', { 'class': 'mgc-badge-body', x: 0, y: 0, width: bd.w, height: bd.h, rx: bd.h / 2 }, badge);
var bt = el('text', { 'class': 'mgc-badge-text', x: bd.w / 2, y: bd.h / 2, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, badge);
bt.textContent = bd.text;
missedFlag(sg.pop, pill.w, 0, 7, 'mgc-flag-text mgc-flag-text--small');
refs[s.id] = { group: sg.group, pop: sg.pop, text: text, kind: 'enz' };
});
slots.forEach(function (s) {
if (s.kind !== 'in' && s.kind !== 'out') { return; }
var c = chipBySlot[s.id];
if (!c) { return; }
var sg = slotGroup(layers.chips, s.id, c.x, c.y, 'chip');
sg.group.setAttribute('data-family', '');
var chipBody = el('rect', { 'class': 'mgc-chip-body', x: 0, y: 0, width: c.w, height: c.h, rx: c.h / 2 }, sg.pop);
var t = el('text', { 'class': 'mgc-chip-text', x: c.w / 2, y: c.h / 2, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, sg.pop);
missedFlag(sg.pop, c.w, 0, 6, 'mgc-flag-text mgc-flag-text--small');
refs[s.id] = { group: sg.group, pop: sg.pop, text: t, body: chipBody, kind: s.kind, chip: c };
if (c.conn) {
var cn = c.conn;
var cdx = cn.x2 - cn.x1, cdy = cn.y2 - cn.y1;
var clen = Math.hypot(cdx, cdy) || 1;
var cux = cdx / clen, cuy = cdy / clen;
var cg = el('g', { 'class': 'mgc-conn mgc-off', 'data-slot': s.id }, layers.conns);
el('path', { 'class': 'mgc-conn-line', d: shaftD(cn.x1, cn.y1, cn.x2, cn.y2, cux, cuy, 5) }, cg);
el('path', { 'class': 'mgc-conn-head', d: headD(cn.x2, cn.y2, cux, cuy, 5, 3) }, cg);
refs[s.id].conn = cg;
}
});
function paint(id, prev, animate) {
var r = refs[id];
var slot = byId[id];
if (!r || !slot) { return; }
var s = st[id];
var state = s.state;
var value = s.value != null ? s.value : slot.answer;
var filled = state === 'filled' || state === 'missed';
r.group.setAttribute('data-state', state);
r.group.classList.toggle('mgc-off', state === 'hidden');
if (r.conn) { r.conn.classList.toggle('mgc-off', state === 'hidden'); }
if (slot.kind === 'node') { paintNode(r, state, value); }
else if (slot.kind === 'enz') { paintPill(r, L.pills[slot.rxn], state, opts.showSlotLabels, stepWord(slot.rxn)); }
else { paintChip(r, r.chip, state, value, opts.showSlotLabels, opts.chipTheme); }
var clickable = filled || ((state === 'empty' || state === 'active') && !!opts.interactive);
r.group.classList.toggle('mgc-clickable', clickable);
if (clickable) {
r.group.setAttribute('tabindex', '0');
r.group.setAttribute('role', 'button');
r.group.setAttribute('aria-label', describeSlot(P, slot, state, value));
} else {
r.group.removeAttribute('tabindex');
r.group.removeAttribute('role');
r.group.removeAttribute('aria-label');
}
var wasFilled = prev === 'filled' || prev === 'missed';
if (animate && !reduce && filled && !wasFilled) { replay(r.pop, 'mgc-pop'); }
}
function setSlot(id, change, animate) {
if (!byId[id]) { console.error('chart: unknown slot ' + id); return; }
var state = change && change.state;
if (!STATES[state]) { console.error('chart: bad state ' + state + ' for ' + id); return; }
var prev = st[id].state;
var filled = state === 'filled' || state === 'missed';
st[id] = { state: state, value: filled && change.value != null ? change.value : null };
paint(id, prev, animate);
}
function isSlotLit(slotId) {
var s = st[slotId];
return !!s && (s.state === 'filled' || s.state === 'missed');
}
function isLit(nodeId) {
return isSlotLit('node:' + nodeId);
}
function updateArrows(animate) {
arrowRefs.forEach(function (a) {
var targetLit = a.def.toPill
? (isSlotLit('enz:' + a.def.toPill) || (a.def.to && isLit(a.def.to)))
: isLit(a.def.to);
var vis = opts.arrows === 'always' || (isLit(a.def.from) && targetLit);
if (vis === a.visible) { return; }
a.visible = vis;
a.g.classList.toggle('mgc-off', !vis);
if (a.labelEl) { a.labelEl.classList.toggle('mgc-off', !vis); }
if (vis && animate && !reduce) {
replay(a.shaft, a.def.dashed ? 'mgc-fade' : 'mgc-draw');
replay(a.head, 'mgc-fade');
if (a.startHead) { replay(a.startHead, 'mgc-fade'); }
}
});
}
function setSlots(list) {
(list || []).forEach(function (c) { setSlot(c.id, c, true); });
updateArrows(true);
}
function setAll(state) {
slots.forEach(function (s) { setSlot(s.id, { state: state }, true); });
updateArrows(true);
}
function activate(id) {
var slot = byId[id];
var s = st[id];
if (!slot || !s) { return; }
var filled = s.state === 'filled' || s.state === 'missed';
if (filled) {
if (slot.kind === 'node' && opts.onNodeClick) { opts.onNodeClick(slot.node); }
else if (slot.kind === 'enz' && opts.onEnzymeClick) { opts.onEnzymeClick(slot.rxn); }
else if ((slot.kind === 'in' || slot.kind === 'out') && opts.onChipClick) {
opts.onChipClick(id, getSlotRect(id));
}
return;
}
if ((s.state === 'empty' || s.state === 'active') && opts.interactive && opts.onSlotClick) {
opts.onSlotClick(id, getSlotRect(id));
}
}
function getSlotRect(id) {
var r = refs[id];
return r ? r.group.getBoundingClientRect() : null;
}
slots.forEach(function (s) {
var r = refs[s.id];
if (!r) { return; }
r.group.addEventListener('click', function () {
if (dragMoved) { return; }   // the click that ends a pan is not a click
activate(s.id);
});
r.group.addEventListener('keydown', function (e) {
if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
e.preventDefault();
activate(s.id);
}
});
});
var cam = { x: 0, y: 0, z: 1 };   // screen = world * z + (x, y)
var anim = null;                  // running camera animation { raf }
var userMoved = false;            // once the user pans or zooms, resizes stop refitting
var pointers = {};                // pointer id -> last position in container coordinates
var press = null;                 // one pointer that may become a pan
var pinch = null;                 // two pointers: last distance and midpoint
var dragMoved = false;            // set once a press moved; suppresses the click after it
function applyCam() {
world.setAttribute('transform', 'translate(' + cam.x.toFixed(2) + ' ' + cam.y.toFixed(2) + ') scale(' + cam.z.toFixed(4) + ')');
}
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function viewSize() { return { w: container.clientWidth, h: container.clientHeight }; }
function stopAnim() {
if (anim) { cancelAnimationFrame(anim.raf); anim = null; }
}
function localXY(e) {
var r = container.getBoundingClientRect();
return { x: e.clientX - r.left, y: e.clientY - r.top };
}
function moveTo(tx, ty, tz, animate) {
stopAnim();
if (!animate || reduce) { cam.x = tx; cam.y = ty; cam.z = tz; applyCam(); return; }
var from = { x: cam.x, y: cam.y, z: cam.z };
var t0 = null;
var job = { raf: 0 };
anim = job;
function step(now) {
if (t0 === null) { t0 = now; }
var k = Math.min(1, (now - t0) / 380);
var e = 1 - Math.pow(1 - k, 3);   // ease out
cam.x = from.x + (tx - from.x) * e;
cam.y = from.y + (ty - from.y) * e;
cam.z = from.z + (tz - from.z) * e;
applyCam();
if (k < 1) { job.raf = requestAnimationFrame(step); }
else if (anim === job) { anim = null; }
}
job.raf = requestAnimationFrame(step);
}
function zoomAt(sx, sy, factor, animate) {
var z = clamp(cam.z * factor, ZOOM_MIN, ZOOM_MAX);
var wx = (sx - cam.x) / cam.z, wy = (sy - cam.y) / cam.z;
moveTo(sx - wx * z, sy - wy * z, z, animate);
}
function fitTo(animate) {
var v = viewSize();
if (!v.w || !v.h) { return false; }
var B = L.bounds, pad = 24;
var z = clamp(Math.min((v.w - 2 * pad) / B.w, (v.h - 2 * pad) / B.h), ZOOM_MIN, ZOOM_MAX);
var cx = B.x + B.w / 2, cy = B.y + B.h / 2;
moveTo(v.w / 2 - cx * z, v.h / 2 - cy * z, z, animate);
return true;
}
function keepInside(tx, ty, z, v) {
var B = L.bounds, pad = 12;
function axis(t, size, lo, len) {
var min = size - pad - (lo + len) * z, max = pad - lo * z;
return min > max ? t : clamp(t, min, max);
}
return { x: axis(tx, v.w, B.x, B.w), y: axis(ty, v.h, B.y, B.h) };
}
function focusSlot(id, o) {
var s = byId[id];
if (!s) { return; }
var b = s.kind === 'node' ? L.cards[s.node] : (s.kind === 'enz' ? L.pills[s.rxn] : chipBySlot[id]);
var v = viewSize();
if (!b || !v.w || !v.h) { return; }
var z = clamp(Math.max(cam.z, (o && o.zoom) || 0.6), ZOOM_MIN, ZOOM_MAX);
var cx = b.x + b.w / 2, cy = b.y + b.h / 2;
var at = keepInside(v.w / 2 - cx * z, v.h / 2 - cy * z, z, v);
moveTo(at.x, at.y, z, !(o && o.animate === false));
}
svg.addEventListener('pointerdown', function (e) {
if (e.pointerType === 'mouse' && e.button !== 0) { return; }
pointers[e.pointerId] = localXY(e);
dragMoved = false;
userMoved = true;
stopAnim();
var ids = Object.keys(pointers);
if (ids.length >= 2) {
var a = pointers[ids[0]], b = pointers[ids[1]];
pinch = { d: Math.hypot(a.x - b.x, a.y - b.y) || 1, mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2 };
press = null;
dragMoved = true;
} else {
press = { id: e.pointerId, x: pointers[e.pointerId].x, y: pointers[e.pointerId].y, moved: false };
}
});
svg.addEventListener('pointermove', function (e) {
var prev = pointers[e.pointerId];
if (!prev) { return; }
var p = localXY(e);
pointers[e.pointerId] = p;
var ids = Object.keys(pointers);
if (pinch && ids.length >= 2) {
var a = pointers[ids[0]], b = pointers[ids[1]];
var d = Math.hypot(a.x - b.x, a.y - b.y) || 1;
var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
zoomAt(mx, my, d / pinch.d, false);
cam.x += mx - pinch.mx;
cam.y += my - pinch.my;
applyCam();
pinch = { d: d, mx: mx, my: my };
return;
}
if (press && press.id === e.pointerId) {
if (!press.moved) {
if (Math.hypot(p.x - press.x, p.y - press.y) < 4) { return; }
press.moved = true;
dragMoved = true;
try { svg.setPointerCapture(e.pointerId); } catch (err) { /* capture is optional */ }
}
cam.x += p.x - prev.x;
cam.y += p.y - prev.y;
applyCam();
}
});
function endPointer(e) {
delete pointers[e.pointerId];
if (press && press.id === e.pointerId) { press = null; }
if (Object.keys(pointers).length < 2) { pinch = null; }
}
svg.addEventListener('pointerup', endPointer);
svg.addEventListener('pointercancel', endPointer);
svg.addEventListener('wheel', function (e) {
e.preventDefault();
userMoved = true;
var p = localXY(e);
var unit = e.deltaMode === 1 ? 16 : (e.deltaMode === 2 ? 400 : 1);
zoomAt(p.x, p.y, Math.exp(-e.deltaY * unit * 0.0015), false);
}, { passive: false });
svg.addEventListener('dblclick', function (e) {
if (e.target.closest && e.target.closest('.mgc-slot')) { return; }
userMoved = true;
fitTo(true);
});
var FIT_ICON = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">' +
'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" ' +
'stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
var bar = document.createElement('div');
bar.className = 'mgc-controls';
function addButton(text, label, html, handler) {
var b = document.createElement('button');
b.type = 'button';
b.className = 'mg-btn mg-btn--icon mgc-btn';
b.setAttribute('aria-label', label);
b.title = label;
if (html) { b.innerHTML = html; } else { b.textContent = text; }
b.addEventListener('click', function () { userMoved = true; handler(); });
bar.appendChild(b);
}
addButton('+', 'Phóng to', null, function () {
var v = viewSize();
zoomAt(v.w / 2, v.h / 2, 1.25, true);
});
addButton('−', 'Thu nhỏ', null, function () {
var v = viewSize();
zoomAt(v.w / 2, v.h / 2, 0.8, true);
});
addButton('', 'Đặt lại khung nhìn', FIT_ICON, function () { fitTo(true); });
container.appendChild(bar);
function layoutControls() {
bar.classList.toggle('mgc-controls--narrow', container.clientWidth > 0 && container.clientWidth < 600);
}
layoutControls();
var ro = null;
function onResize() { layoutControls(); if (!userMoved) { fitTo(false); } }
if (root.ResizeObserver) {
ro = new root.ResizeObserver(onResize);
ro.observe(container);
} else {
var tries = 30;
(function retry() {
if (!fitTo(false) && tries-- > 0) { requestAnimationFrame(retry); }
})();
}
slots.forEach(function (s) { paint(s.id, 'hidden', false); });
updateArrows(false);
applyCam();
function destroy() {
stopAnim();
if (ro) { ro.disconnect(); }
if (svg.parentNode === container) { container.removeChild(svg); }
if (bar.parentNode === container) { container.removeChild(bar); }
container.classList.remove('mgc-host', 'mgc-reduce');
}
return {
setSlot: function (id, change) { setSlot(id, change, true); updateArrows(true); },
setSlots: setSlots,
setAll: setAll,
setArrowMode: function (mode) { opts.arrows = mode === 'always' ? 'always' : 'auto'; updateArrows(true); },
setShowSlotLabels: function (on) {
opts.showSlotLabels = !!on;
slots.forEach(function (s) { paint(s.id, st[s.id].state, false); });
},
focus: function (id, o) { userMoved = true; focusSlot(id, o); },
fit: function (o) { userMoved = true; fitTo(!(o && o.animate === false)); },
zoomBy: function (f) {
var v = viewSize();
zoomAt(v.w / 2, v.h / 2, f, true);
},
getSlotRect: getSlotRect,
destroy: destroy
};
}
MG.chart = MG.chart || {};
MG.chart.create = create;
MG.chart.contrastRatio = contrastRatio;
MG.chart.textOn = textOn;
MG.chart.layout = layoutPathway;   // pure geometry, used by the tests and the demo
MG.chart.paintChip = paintChip;    // chip colours, run on stand-in elements by the tests
if (MG.custom && typeof MG.custom.rebuildLipidsEverything === 'function') {
MG.custom.rebuildLipidsEverything();
}
})(typeof window !== 'undefined' ? window : globalThis);
