(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
var CLASS_NAMES = { 1: 'oxidoreductase (oxi hóa - khử)', 2: 'transferase (chuyển nhóm)', 3: 'hydrolase (thủy phân)', 4: 'lyase (phân cắt)', 5: 'isomerase (đồng phân hóa)', 6: 'ligase (tổng hợp / nối)', 7: 'translocase (vận chuyển màng)' };
var COFACTOR_CLUE = {
redox: 'Quan sát chất nào bị oxi hóa hoặc khử ở đây: chất mang này ở trạng thái đối lập ở phía bên kia mũi tên.',
adenylate: 'Nó mang năng lượng và luôn đi thành cặp, ví dụ một triphosphate và diphosphate còn lại sau khi sử dụng.',
carrier: 'Nó là chất mang chứa lưu huỳnh giữ các nhóm acyl.',
small: 'Nó là một phân tử nhỏ hoặc ion, không phải chất mang năng lượng hay chất mang electron.'
};
var COFACTOR_CLUE_BY_ID = {
amp: 'Nó chỉ có một nhóm phosphat, là phần còn lại khi nucleotide triphosphate mất hai phosphat.',
hco3: 'Nó cung cấp nguyên tử carbon của nhóm carbamoyl.'
};
var WHAT_TO_FIND = {
enz: 'Bạn đang tìm kiếm enzyme.',
'in': 'Bạn đang tìm chất bị tiêu thụ ở bước này.',
out: 'Bạn đang tìm chất được giải phóng hoặc tạo ra ở bước này.'
};
function entityOf(kind, id) {
var table = MG.entities && MG.entities[kind];
return table && Object.prototype.hasOwnProperty.call(table, id) ? table[id] : null;
}
function words(t) {
return String(t).toLowerCase().replace(/[^a-z0-9+]+/g, ' ').trim().split(' ').filter(Boolean);
}
function normText(t) {
return String(t).toLowerCase().replace(/α/g, 'alpha').replace(/β/g, 'beta').replace(/[^a-z0-9+]/g, '');
}
function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function spellingsOf(e) {
var all = [e.name, e.short, e.display].concat(e.aliases || []).filter(Boolean);
return all.filter(function (s, i) { return all.indexOf(s) === i; });
}
function spellingRegex(sp) {
var toks = words(sp);
if (toks.length === 1) {
return new RegExp('(?<![a-z0-9+])' + escapeRe(toks[0]) + '(?![a-z0-9+])', 'gi');
}
var flat = normText(sp);
if (flat.length < 4) { return null; }
var body = flat.split(/(alpha|beta)/).filter(function (p) { return p !== ''; }).map(function (p) {
if (p === 'alpha') { return '(?:alpha|α)'; }
if (p === 'beta') { return '(?:beta|β)'; }
return p.split('').map(escapeRe).join('[^a-z0-9+]*');
}).join('[^a-z0-9+]*');
return new RegExp('(?<![a-z0-9+])' + body, 'gi');
}
function redact(text, kind, ids) {
var out = text === undefined || text === null ? '' : String(text);
var spellings = [];
(ids || []).forEach(function (id) {
var e = entityOf(kind, id);
if (e) { spellingsOf(e).forEach(function (sp) { if (spellings.indexOf(sp) < 0) { spellings.push(sp); } }); }
});
spellings.sort(function (a, b) { return b.length - a.length; });
spellings.forEach(function (sp) {
var re = spellingRegex(sp);
if (re) { out = out.replace(re, '...'); }
});
return out;
}
function noteSentence(note, kind, ids) {
var sentences = String(note || '').match(/[^.!?]*[.!?]+(?=\s|$)|[^.!?]+$/g) || [];
for (var i = 0; i < sentences.length; i++) {
var clean = redact(sentences[i].trim(), kind, ids);
if (/^\.\.\.,\s*[a-z]/.test(clean)) { clean = clean.replace(/^\.\.\.,\s*/, ''); clean = clean.charAt(0).toUpperCase() + clean.slice(1); }
if (/[a-z]{3}/i.test(clean)) { return clean; }
}
return '';
}
function lookText(slot, target, ids, kind, enzWord) {
var what = (slot.kind === 'enz' && enzWord && enzWord !== 'enzyme' ? 'Bạn đang tìm kiếm ' + enzWord + '.' : WHAT_TO_FIND[slot.kind]) || (slot.role === 'prod'
? 'Bạn đang tìm sản phẩm của bước này.'
: 'Bạn đang tìm cơ chất còn thiếu của bước này.');
var family = (MG.entities.familyHint && MG.entities.familyHint[kind]) || {};
var text = what + (family[target.family] ? ' Nó là ' + family[target.family] + '.' : '');
if (ids.length > 1) { text += ' Có ' + ids.length + ' chất cần tìm ở đây, theo thứ tự bất kỳ.'; }
return text;
}
function moleculeClue(e, ids) {
var geom = MG.geometry && MG.geometry[e.id];
var atoms = geom && geom.atoms ? geom.atoms : [];
var textGroup = atoms.some(function (a) { return a.el === '*'; });
if (geom && !e.noStructure && geom.formula && !textGroup) {
var counts = {};
String(geom.formula).replace(/([A-Z][a-z]?)(\d*)/g, function (m, el, n) {
counts[el] = (counts[el] || 0) + (n ? Number(n) : 1);
return m;
});
var parts = [];
if (counts.C) { parts.push(counts.C + ' nguyên tử carbon'); }
if (counts.P) { parts.push(counts.P + ' nguyên tử phospho'); }
if (parts.length) { return 'Chất này có ' + parts.join(' và ') + '.'; }
}
return noteSentence(e.note, 'molecule', ids);
}
function enzymeClue(e, rxn, ids) {
var parts = [];
var cls = e.ec ? String(e.ec).split('.')[0] : '';
if (CLASS_NAMES[cls]) { parts.push('Mã số EC của enzyme bắt đầu bằng ' + cls + ' (' + CLASS_NAMES[cls] + ').'); }
if (rxn && rxn.irreversible) { parts.push('Bước này là phản ứng không thuận nghịch trong tế bào.'); }
var note = noteSentence(e.note, 'enzyme', ids);
if (note) { parts.push(note); }
return parts.join(' ');
}
function clueText(kind, rxn, target, ids) {
if (kind === 'molecule') { return moleculeClue(target, ids); }
if (kind === 'enzyme') { return enzymeClue(target, rxn, ids); }
return COFACTOR_CLUE_BY_ID[target.id] || COFACTOR_CLUE[target.family] || noteSentence(target.note, 'cofactor', ids);
}
function lastClue(e) {
var name = String(e.name || '');
var n = name.trim().split(/\s+/).length;
var letters = (name.match(/[\p{L}\p{N}]/gu) || []).length;
return 'Tên của chất gồm ' + n + ' từ và ' + letters + ' chữ cái.';
}
function stepAnswers(pathway, rxn) {
var mols = [];
(rxn.substrates || []).concat(rxn.products || []).forEach(function (n) {
var node = pathway && pathway.nodes ? pathway.nodes[n] : null;
if (node && node.mol && mols.indexOf(node.mol) < 0) { mols.push(node.mol); }
});
return { molecule: mols, enzyme: rxn.enzyme ? [rxn.enzyme] : [], cofactor: (rxn.ins || []).concat(rxn.outs || []) };
}
function redactStep(text, step) {
var out = text;
['molecule', 'enzyme', 'cofactor'].forEach(function (k) { out = redact(out, k, step[k]); });
return out;
}
function ladder(pathway, rxn, slot, openAnswerIds) {
var ids = (openAnswerIds || []).slice();
if (!ids.length || !rxn || !slot) { return []; }
var kind = slot.entityKind;
var target = entityOf(kind, ids[0]);
if (!target) { return []; }
var wording = pathway && pathway.entityNotes ? pathway.entityNotes[target.id] : null;
if (wording) { target = Object.assign({}, target, { note: wording }); }
var out = [{ label: 'Diễn biến phản ứng', text: redact(rxn.hint || '', kind, ids) }];
var enzWord = rxn && rxn.terms && rxn.terms.enz ? rxn.terms.enz : (pathway && pathway.terms && pathway.terms.enz ? pathway.terms.enz : 'enzyme');
var step = stepAnswers(pathway, rxn);
out.push({ label: 'Đặc điểm cần tìm', text: redactStep(redact(lookText(slot, target, ids, kind, enzWord), kind, ids), step) });
var clue = clueText(kind, rxn, target, ids);
if (clue) { out.push({ label: 'Manh mối gợi ý', text: redactStep(redact(clue, kind, ids), step) }); }
out.push({ label: 'Gợi ý then chốt', text: redact(lastClue(target), kind, ids) });
return out;
}
var WHY_MAX = 240;
var SPENT = { atp: ['adp', 'amp'], gtp: ['gdp'], utp: ['udp', 'ump'] };
var MADE = { adp: 'atp', gdp: 'gtp', udp: 'utp' };
var OXIDIZED = { nad: 'nadh', nadp: 'nadph', fad: 'fadh2', q: 'qh2' };
var REDUCED = { nadh: 'nad', nadph: 'nadp', fadh2: 'fad', qh2: 'q' };
var CARRIERS = ['nad', 'nadh', 'fad', 'fadh2', 'q', 'qh2', 'cytcox'];
var VERBS = [
{ re: /^(phosphoryl transfer|phosphorylation|pyrophosphoryl transfer)/, shape: '1:1', text: 'phosphoryl hóa {S} thành {P}' },
{ re: /^(isomerization|epimerization|phosphoryl shift|cyclization)/, shape: '1:1', text: 'sắp xếp lại cấu trúc {S} thành {P}' },
{ re: /^(oxidative decarboxylation|oxidation|oxidative deamination|water oxidation)/, shape: '1:1', text: 'oxi hóa {S} thành {P}' },
{ re: /^(oxidative decarboxylation|oxidation|oxidative deamination)/, shape: '1:2', text: 'oxi hóa {S} thành {P1} và {P2}' },
{ re: /^(reduction|reductive amination)/, shape: '1:1', text: 'khử {S} thành {P}' },
{ re: /^(reduction|reductive amination)/, shape: '2:1', text: 'khử {S} thành {P}' },
{ re: /^dehydration/, shape: '1:1', skip: ['h2o'], text: 'tách nước từ {S}, tạo ra {P}' },
{ re: /^hydration/, shape: '1:1', skip: ['h2o'], text: 'cộng nước vào {S}, tạo ra {P}' },
{ re: /^decarboxylation/, shape: '1:1', needsOut: 'co2', skip: ['co2'], text: 'tách một carbon từ {S} dưới dạng CO₂, tạo ra {P}' },
{ re: /^carboxylation/, shape: '1:1', needsIn: 'co2', skip: ['co2'], text: 'cộng một carbon từ CO₂ vào {S}, tạo thành {P}' },
{ re: /^carboxylation/, shape: '1:1', needsIn: 'hco3', skip: ['hco3'], text: 'cộng một carbon từ HCO₃⁻ vào {S}, tạo thành {P}' },
{ re: /^carboxylation/, shape: '1:1', text: 'cộng một carbon vào {S}, tạo thành {P}' },
{ re: /^transamination/, shape: '2:2', text: 'chuyển nhóm amin từ {S1} sang {S2}, tạo ra {P1} và {P2}' },
{ re: /^transamination/, shape: '1:1', text: 'đổi nhóm amin lấy nhóm ceto, biến {S} thành {P}' },
{ re: /^(hydrolysis|proteolysis|proteolytic)/, shape: '1:2', skip: ['h2o'], text: 'thủy phân {S} thành {P1} và {P2}' },
{ re: /^(hydrolysis|proteolysis|proteolytic|dephosphorylation|gtpase action)/, shape: '1:1', skip: ['h2o'], text: 'thủy phân {S}, tạo ra {P}' },
{ re: /^phosphorolysis/, shape: '1:1', needsIn: 'pi', skip: ['pi'], text: 'phân cắt {S} bằng phosphat, tạo ra {P}' },
{ re: /^(thiolysis|cleavage)/, shape: '1:2', needsIn: 'coa', skip: ['coa'], text: 'phân cắt {S} bằng CoA-SH thành {P1} và {P2}' },
{ re: /^(aldol cleavage|elimination|thiolysis|cleavage|phosphorolysis)/, shape: '1:2', text: 'phân cắt {S} thành {P1} và {P2}' },
{ re: /^(cleavage|phosphorolysis)/, shape: '1:1', text: 'phân cắt {S}, tạo ra {P}' },
{ re: /^(condensation|aldol condensation|amide bond|amidation|ring closure|complex assembly|carbamoyl transfer|glycosyl transfer|nucleotidyl transfer|transfer of|two-carbon transfer|amidotransfer)/, shape: '2:1', text: 'nối {S1} và {S2} thành {P}' },
{ re: /^(condensation|aldol condensation)/, shape: '2:2', text: 'ngưng tụ {S1} và {S2}, tạo ra {P1} và {P2}' },
{ re: /^photoexcitation/, shape: '1:1', needsIn: 'photon', skip: ['photon'], text: 'kích thích {S} thành {P} bằng năng lượng photon' },
{ re: /^(electron transfer|reduction of o|release into the quinone)/, shape: '1:1', skip: CARRIERS, pump: true, text: 'thu nhận electron từ {S} và truyền tiếp, tạo ra {P}' },
{ re: /^(atp synthesis|photophosphorylation)/, shape: '1:1', skip: ['pi', 'hplus'], text: 'tạo {P} từ {S} và Pᵢ' },
{ re: /^(antiport|symport|transport|facilitated diffusion|movement|uptake|entry)/, shape: 'same', skip: ['hplus'], text: 'vận chuyển {S} qua màng' }
];
var SENTENCE_START = /^(It|Its|The|A|An|This|These|In|At|On|Once|When|After|Before|Because|Since|As|With|Without|Here|Each|Every|Both|Most|Many|Some|One|Two|Three|Only|Unlike|Like|If|Where|While|Then|There|Their|Nothing|Hydrolysis|Binding|Breakdown|Protons|Electrons|Small|Cells|Muscle|Liver|Brain|Plants|Animals|Adaptors|Lipases|Mitofusins)\b/;
var BARE_VERB = /^[A-Z][a-z]+(?:[^s]s|zes|ses|ches|shes)$/;
function cofName(id) {
var e = entityOf('cofactor', id);
return e ? (e.display || e.name) : String(id);
}
function nodeName(pathway, n) {
var node = pathway && pathway.nodes ? pathway.nodes[n] : null;
var e = node ? entityOf('molecule', node.mol) : null;
return e ? e.name : String(n);
}
function lower(name) {
var m = /^((?:\d+(?:,\d+)*-|[α-ω]-|[A-Z]-|cis-|trans-)*)([A-Z])([a-z])/.exec(name);
if (!m) { return name; }
return m[1] + m[2].toLowerCase() + name.slice(m[1].length + 1);
}
function joinNames(list) {
if (list.length <= 1) { return list.join(''); }
return list.slice(0, -1).join(', ') + ' và ' + list[list.length - 1];
}
function uniq(list) {
return list.filter(function (x, i) { return list.indexOf(x) === i; });
}
function cofactorClause(ins, outs, tpl) {
var skip = tpl && tpl.skip ? tpl.skip : [];
var inLeft = ins.filter(function (id) { return skip.indexOf(id) < 0; });
var outLeft = outs.filter(function (id) { return skip.indexOf(id) < 0; });
var parts = [];
function drop(list, id) { var i = list.indexOf(id); if (i >= 0) { list.splice(i, 1); } }
if (tpl && tpl.pump && outLeft.indexOf('hplus') >= 0) { parts.push('bơm H⁺ qua màng'); drop(outLeft, 'hplus'); }
ins.forEach(function (id) {
if (SPENT[id]) {
var to = SPENT[id].filter(function (x) { return outLeft.indexOf(x) >= 0; })[0];
if (to) {
parts.push('tiêu tốn ' + cofName(id) + (to === 'amp' || to === 'ump' ? ' (thành ' + cofName(to) + ' và PPᵢ)' : ''));
drop(inLeft, id); drop(outLeft, to); if (to === 'amp' || to === 'ump') { drop(outLeft, 'ppi'); }
}
} else if (MADE[id] && outLeft.indexOf(MADE[id]) >= 0) {
parts.push('tạo ' + cofName(MADE[id]) + ' từ ' + cofName(id));
drop(inLeft, id); drop(outLeft, MADE[id]);
} else if (OXIDIZED[id] && outLeft.indexOf(OXIDIZED[id]) >= 0) {
parts.push('với ' + cofName(id) + ' nhận electron thành ' + cofName(OXIDIZED[id]));
drop(inLeft, id); drop(outLeft, OXIDIZED[id]);
} else if (REDUCED[id] && outLeft.indexOf(REDUCED[id]) >= 0) {
parts.push('với electron từ ' + cofName(id));
drop(inLeft, id); drop(outLeft, REDUCED[id]);
}
});
if (inLeft.length) { parts.push('sử dụng ' + joinNames(inLeft.map(cofName))); }
if (outLeft.length) { parts.push('giải phóng ' + joinNames(outLeft.map(cofName))); }
return joinNames(parts);
}
function fill(text, subs, prods) {
return text.replace(/\{S1\}/g, subs[0] || '').replace(/\{S2\}/g, subs[1] || '').replace(/\{P1\}/g, prods[0] || '').replace(/\{P2\}/g, prods[1] || '')
.replace(/\{S\}/g, joinNames(subs)).replace(/\{P\}/g, joinNames(prods));
}
function verbPhrase(type, subs, prods, ins, outs) {
var base = String(type || '').toLowerCase().replace(/\s*\([^)]*\)/g, '').trim();
var shape = subs.length + ':' + prods.length;
var same = subs.length > 0 && subs.length === prods.length && subs.every(function (s) { return prods.indexOf(s) >= 0; });
for (var i = 0; i < VERBS.length; i++) {
var v = VERBS[i];
if (!v.re.test(base)) { continue; }
if (v.shape === 'same' ? !same : (v.shape !== shape || same)) { continue; }
if (v.needsIn && ins.indexOf(v.needsIn) < 0) { continue; }
if (v.needsOut && outs.indexOf(v.needsOut) < 0) { continue; }
return { text: fill(v.text, subs, prods), skip: v.skip || [], pump: !!v.pump };
}
if (same) { return { text: fill('mang {S} qua màng', subs, prods), skip: ['hplus'], pump: false }; }
return null;
}
function reasonSentence(rxn, subs, ins, outs) {
var base = String(rxn.type || '').toLowerCase();
var spent = ins.filter(function (id) { return SPENT[id] && SPENT[id].some(function (x) { return outs.indexOf(x) >= 0; }); })[0];
var madeIrr = ins.filter(function (id) { return MADE[id] && outs.indexOf(MADE[id]) >= 0; })[0];
if (rxn.irreversible === true) {
if (spent) { return 'Phản ứng không thuận nghịch trong tế bào: năng lượng từ ' + cofName(spent) + ' thúc đẩy phản ứng đi theo một chiều.'; }
if (madeIrr && subs.length) { return 'Phản ứng không thuận nghịch trong tế bào: liên kết giàu năng lượng của ' + joinNames(subs) + ' cung cấp năng lượng để tạo ' + cofName(MADE[madeIrr]) + '.'; }
if (outs.indexOf('co2') >= 0) { return 'Phản ứng không thuận nghịch trong tế bào: CO₂ thoát ra không thể hoàn nguyên lại.'; }
if (outs.indexOf('ppi') >= 0) { return 'Phản ứng không thuận nghịch trong tế bào: pyrophosphat giải phóng bị thủy phân ngay lập tức, kéo phản ứng dịch chuyển về phía trước.'; }
if (/condensation|thioester/.test(base) && outs.indexOf('coa') >= 0) { return 'Phản ứng không thuận nghịch trong tế bào: sự thủy phân liên kết thioester kéo phản ứng dịch chuyển về phía trước.'; }
if (/hydrolysis|phosphatase|gtpase|dephosphorylation/.test(base) && outs.indexOf('pi') >= 0) { return 'Phản ứng không thuận nghịch trong tế bào: sự giải phóng nhóm phosphat giải phóng thế năng rất lớn.'; }
if (/hydrolysis|proteolysis|proteolytic/.test(base)) { return 'Phản ứng không thuận nghịch trong tế bào: một liên kết đã bị thủy phân và không thể tự đảo ngược.'; }
return 'Phản ứng không thuận nghịch trong tế bào, vì vậy nó chỉ xảy ra theo một chiều.';
}
if (rxn.twoWay === true) { return 'Phản ứng thuận nghịch: chiều phản ứng phụ thuộc vào sự chênh lệch nồng độ chất ở hai phía.'; }
if (/atp synthesis|photophosphorylation/.test(base)) { return 'Dòng proton chảy xuôi gradient nồng độ làm quay enzyme, cung cấp năng lượng để tổng hợp ATP.'; }
if (/electron transfer|reduction of o/.test(base)) { return 'Electron dịch chuyển theo chiều giảm thế năng: mỗi chất mang giữ electron chặt hơn chất mang đứng trước.'; }
var reduced = ins.filter(function (id) { return REDUCED[id] && outs.indexOf(REDUCED[id]) >= 0; })[0];
if (reduced) { return cofName(reduced) + ' cung cấp electron và trở thành ' + cofName(REDUCED[reduced]) + '.'; }
var oxidized = ins.filter(function (id) { return OXIDIZED[id] && outs.indexOf(OXIDIZED[id]) >= 0; })[0];
if (oxidized && subs.length) { return 'Electron tách ra từ ' + joinNames(subs) + ' được chuyển sang ' + cofName(OXIDIZED[oxidized]) + '.'; }
var made = ins.filter(function (id) { return MADE[id] && outs.indexOf(MADE[id]) >= 0; })[0];
if (made && subs.length) { return 'Liên kết bị bẻ gãy trong ' + joinNames(subs) + ' đủ giàu năng lượng để tạo ' + cofName(MADE[made]) + ' từ ' + cofName(made) + '.'; }
if (spent && outs.indexOf('pi') >= 0) { return 'Năng lượng từ sự thủy phân ' + cofName(spent) + ' cung cấp cho phản ứng.'; }
if (spent) { return cofName(spent) + ' cung cấp nhóm phosphat và năng lượng.'; }
if (ins.indexOf('photon') >= 0) { return 'Năng lượng đến từ ánh sáng mà sắc tố hấp thụ.'; }
if (/symport/.test(base) || (/transport|uptake|entry/.test(base) && ins.indexOf('hplus') >= 0)) { return 'Gradient nồng độ proton qua màng là động lực thúc đẩy phản ứng.'; }
if (/antiport|exchange/.test(base)) { return 'Không có liên kết nào bị tạo ra hay bẻ gãy: một phân tử đi qua màng khi một phân tử khác đi theo chiều ngược lại.'; }
return '';
}
function contentWords(t) {
return words(t).filter(function (w) { return w.length >= 3; });
}
function noteWhy(note, names, shortName, room) {
var sentences = String(note || '').match(/[^.!?]*[.!?]+(?=\s|$)|[^.!?]+$/g) || [];
var keys = {};
names.forEach(function (n) { contentWords(n).forEach(function (w) { keys[w] = true; }); });
var best = '';
var bestScore = 0;
sentences.forEach(function (raw) {
var s = raw.trim();
if (!s || s.length > room || s.length < 25) { return; }
var first = s.split(/\s+/)[0].replace(/[^A-Za-z0-9⁺₂-]/g, '');
var named = contentWords(first).some(function (w) { return keys[w]; });
if (BARE_VERB.test(first) && !SENTENCE_START.test(s) && !named) {
if (!shortName || shortName.length + 1 + s.length > room) { return; }
s = shortName + ' ' + s.charAt(0).toLowerCase() + s.slice(1);
} else if (!SENTENCE_START.test(s) && !named && !/^[A-Z][a-z]+ (is|are|was|has|have|binds|moves|makes|pumps|holds|carries|passes|sits|lies|works|needs|does|goes|runs|stays|comes|forms|gets|takes|gives|turns|opens|closes|drives|pulls|lets|leaves|returns|repays|feeds|removes|adds|splits|joins|traps|brings|fixes|uses|spends)\b/.test(s)) {
return;
}
var score = 0;
contentWords(s).forEach(function (w) { if (keys[w]) { score += 1; } });
if (score > bestScore || (score === bestScore && score > 0 && !best)) { best = s; bestScore = score; }
});
if (!best) {
for (var i = 0; i < sentences.length; i++) {
var t = sentences[i].trim();
var w1 = t.split(/\s+/)[0].replace(/[^A-Za-z0-9⁺₂-]/g, '');
if (t.length >= 25 && t.length <= room && SENTENCE_START.test(t) && !BARE_VERB.test(w1)) { return t; }
}
}
return best;
}
function why(pathway, rxn) {
if (!rxn) { return ''; }
if (typeof rxn.why === 'string' && rxn.why.trim()) { return rxn.why.trim(); }
var enz = entityOf('enzyme', rxn.enzyme);
var full = enz ? enz.name : String(rxn.enzyme || '');
var shortName = enz && enz.short ? enz.short : full;
var word = rxn.terms && rxn.terms.enz ? rxn.terms.enz : (pathway && pathway.terms && pathway.terms.enz ? pathway.terms.enz : 'enzyme');
var subs = uniq((rxn.substrates || []).map(function (n) { return lower(nodeName(pathway, n)); }));
var prods = uniq((rxn.products || []).map(function (n) { return lower(nodeName(pathway, n)); }));
var ins = (rxn.ins || []).slice();
var outs = (rxn.outs || []).slice();
var verb = verbPhrase(rxn.type, subs, prods, ins, outs);
var clause = cofactorClause(ins, outs, verb);
var chemistry = !!verb || word === 'enzyme' || word === 'complex';
if (/[^s]s$/.test(full) && !/ase$/.test(full) && shortName !== full) { full = shortName; }
function first(name, withClause) {
var tail = withClause && clause ? ', ' + clause : '';
if (chemistry) { return name + ' ' + (verb ? verb.text : fill('biến {S} thành {P}', subs, prods)) + tail + '.'; }
var head = String(rxn.type || '').replace(/\s*\([^)]*\)/g, '').trim();
head = rxnTypeLabel(head);
if (/tiêu tốn/.test(tail)) { head = head.replace(/,\s*tiêu tốn\b.*$/i, ''); }
var path = subs.length && prods.length ? 'từ ' + joinNames(subs) + ' đến ' + joinNames(prods) : (prods.length ? joinNames(prods) + ' được tạo ra' : joinNames(subs) + ' được sử dụng');
return (head ? head + ': ' : '') + path + tail + '; enzyme xúc tác là ' + name + '.';
}
var names = subs.concat(prods, [full, shortName]);
var reason = reasonSentence(rxn, subs, ins, outs);
var tries = [[full, true], [shortName, true], [shortName, false]];
var out = '';
for (var i = 0; i < tries.length && !out; i++) {
var s1 = first(tries[i][0], tries[i][1]);
if (s1.length >= WHY_MAX) { continue; }
var s2 = reason || noteWhy(enz ? enz.note : '', names, shortName, WHY_MAX - 1 - s1.length - 1);
if (s2 && s1.length + 1 + s2.length < WHY_MAX) { out = s1 + ' ' + s2; }
else if (!reason || i === tries.length - 1) { out = s1; }
}
if (!out) { out = first(shortName, false); }
return out.replace(/\s+/g, ' ').replace(/\s+([,.;:])/g, '$1').trim();
}
MG.hints = { ladder: ladder, redact: redact, why: why };
})(typeof window !== 'undefined' ? window : globalThis);

(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
var MODES = ['build', 'pick', 'type'];
var FORMATS = ['names', 'structures', 'mixed'];
var PROMPTS = {
product: 'Sản phẩm là gì?',
productOne: 'Hãy nêu một sản phẩm của bước này.',
productOther: 'Hãy nêu sản phẩm còn lại.',
substrate: 'Cơ chất còn thiếu là gì?',
consumeOne: 'Hãy nêu một chất được tiêu thụ ở bước này.',
consumeMore: 'Bước này còn tiêu thụ chất nào khác?',
enz: 'Enzyme nào xúc tác cho bước này?',
'in': 'Bước này tiêu thụ chất gì?',
out: 'Bước này giải phóng hoặc tạo ra chất gì?',
releaseOne: 'Hãy nêu một chất mà bước này giải phóng hoặc tạo ra.',
releaseMore: 'Bước này còn giải phóng hoặc tạo ra chất nào khác?'
};
var TYPE_SUFFIX = ' Gõ một câu trả lời.';
var LOOKALIKE_RATE = 0.75;
var OPTIONS = 6;
var OPTIONS_STRUCTURES_BUILD = 4;
function hasOwn(obj, key) { return Object.prototype.hasOwnProperty.call(obj, key); }
function mulberry32(seed) {
var a = seed | 0;
return function () {
a = (a + 0x6D2B79F5) | 0;
var t = a;
t = Math.imul(t ^ (t >>> 15), t | 1);
t = (t + Math.imul(t ^ (t >>> 7), t | 61)) ^ t;
return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
}
function shuffle(arr, rng) {
var a = arr.slice();
for (var i = a.length - 1; i > 0; i--) {
var j = Math.floor(rng() * (i + 1));
var t = a[i]; a[i] = a[j]; a[j] = t;
}
return a;
}
function entityOf(kind, id) {
var table = MG.entities && MG.entities[kind];
return table && hasOwn(table, id) ? table[id] : null;
}
function labelOf(kind, id) {
var e = entityOf(kind, id);
if (!e) { return String(id); }
return kind === 'cofactor' ? (e.display || e.name) : e.name;
}
function closure(kind, ids, exact) {
var out = [];
ids.forEach(function (id) {
if (out.indexOf(id) < 0) { out.push(id); }
var e = entityOf(kind, id);
if (!exact && e && e.acceptAlso) {
e.acceptAlso.forEach(function (x) { if (out.indexOf(x) < 0) { out.push(x); } });
}
});
return out;
}
function covers(kind, a, v, exact) {
if (a === v) { return true; }
if (exact) { return false; }
var e = entityOf(kind, a);
return !!(e && e.acceptAlso && e.acceptAlso.indexOf(v) >= 0);
}
function indexCovering(kind, pool, v, exact) {
var i = pool.indexOf(v);
if (i >= 0) { return i; }
for (i = 0; i < pool.length; i++) {
if (covers(kind, pool[i], v, exact)) { return i; }
}
return -1;
}
function createGame(config) {
config = config || {};
var pathway = MG.pathways && hasOwn(MG.pathways, config.pathwayId) ? MG.pathways[config.pathwayId] : null;
if (!pathway) { throw new Error('MG.engine.createGame: unknown pathway ' + config.pathwayId); }
var mode = config.mode || 'build';
if (MODES.indexOf(mode) < 0) { throw new Error('MG.engine.createGame: unknown mode ' + mode); }
if (mode === 'type' && !(MG.match && MG.match.check)) {
throw new Error('MG.engine.createGame: type mode needs MG.match');
}
var format = FORMATS.indexOf(config.format) >= 0 ? config.format : 'mixed';
var store = config.store || null;
var now = typeof config.now === 'function' ? config.now : function () { return Date.now(); };
var seed = typeof config.seed === 'number' ? config.seed : Math.floor(Math.random() * 4294967296);
var rng = mulberry32(seed);
var rxnById = {};
pathway.reactions.forEach(function (r) { rxnById[r.id] = r; });
var orderIdx = {};
pathway.order.forEach(function (id, i) { orderIdx[id] = i; });
var glyIds = {};
if (MG.pathways.glycolysis) {
MG.pathways.glycolysis.order.forEach(function (id) { glyIds[id] = true; });
}
var selected = {};
var restricted = false;
if (config.steps) {
if (!config.steps.length) { throw new Error('MG.engine.createGame: steps must name at least one reaction'); }
config.steps.forEach(function (id) {
if (!hasOwn(orderIdx, id)) { throw new Error('MG.engine.createGame: unknown step ' + id); }
selected[id] = true;
});
restricted = pathway.order.some(function (id) { return !selected[id]; });
} else {
pathway.order.forEach(function (id) { selected[id] = true; });
}
var rxnIds = pathway.order.filter(function (id) { return selected[id]; });
var startNodes = pathway.start || [];
var giveSubstrates = mode === 'build' || restricted;
function producersOf(node) {
return pathway.order.filter(function (id) { return rxnById[id].products.indexOf(node) >= 0; });
}
function givenSubstrate(node, rid) {
var earlier = producersOf(node).filter(function (p) { return orderIdx[p] < orderIdx[rid]; });
return earlier.length > 0 && earlier.every(function (p) { return !selected[p]; });
}
var defs = [];
var seen = {};
function addDef(d) {
if (!hasOwn(seen, d.id)) { seen[d.id] = true; defs.push(d); }
}
function nodeDef(node, rid, role, given) {
return {
id: 'node:' + node, kind: 'node', rxn: rid, node: node, index: 0, entityKind: 'molecule',
answer: pathway.nodes[node].mol, role: role, given: given
};
}
function addReaction(rid, given) {
var r = rxnById[rid];
r.substrates.forEach(function (n) {
addDef(nodeDef(n, rid, 'sub', given || (giveSubstrates && givenSubstrate(n, rid))));
});
r.products.forEach(function (n) { addDef(nodeDef(n, rid, 'prod', given)); });
(r.arrows || []).forEach(function (a) {
if (a.from && pathway.nodes[a.from]) { addDef(nodeDef(a.from, rid, 'link', given)); }
if (a.to && pathway.nodes[a.to]) { addDef(nodeDef(a.to, rid, 'link', given)); }
});
addDef({ id: 'enz:' + rid, kind: 'enz', rxn: rid, node: null, index: 0, entityKind: 'enzyme', answer: r.enzyme, role: null, given: given });
var noCof = config.cofactors === false;
r.ins.forEach(function (c, i) {
addDef({ id: 'in:' + rid + ':' + i, kind: 'in', rxn: rid, node: null, index: i, entityKind: 'cofactor', answer: c, role: null, given: given || noCof, late: noCof && !given && mode === 'build' });
});
r.outs.forEach(function (c, i) {
addDef({ id: 'out:' + rid + ':' + i, kind: 'out', rxn: rid, node: null, index: i, entityKind: 'cofactor', answer: c, role: null, given: given || noCof, late: noCof && !given && mode === 'build' });
});
}
startNodes.forEach(function (n) {
addDef(nodeDef(n, null, 'start', mode === 'build' || restricted || !!config.givenStart));
});
rxnIds.forEach(function (rid) { addReaction(rid, false); });
if (mode !== 'build' && restricted) {
pathway.order.forEach(function (rid) { if (!selected[rid]) { addReaction(rid, true); } });
}
Object.keys(pathway.nodes || {}).forEach(function (n) {
addDef(nodeDef(n, null, 'start', mode === 'build' || restricted || !!config.givenStart));
});
function groupOf(d) {
if (d.given) { return null; }
if (d.kind === 'in') { return 'in:' + d.rxn; }
if (d.kind === 'out') { return 'out:' + d.rxn; }
if (d.kind === 'node' && mode === 'build' && (d.role === 'sub' || d.role === 'prod')) { return (d.role === 'sub' ? 'sub:' : 'prod:') + d.rxn; }
return null;
}
var list = defs.map(function (d) {
return {
id: d.id, kind: d.kind, rxn: d.rxn, node: d.node, index: d.index,
entityKind: d.entityKind, answer: d.answer, group: groupOf(d),
state: d.late ? 'hidden' : (d.given ? 'filled' : (mode === 'build' ? 'hidden' : 'empty')),
value: d.given ? d.answer : null,
wrong: 0, assisted: false, eliminated: [], hintLines: [], scored: !d.given
};
});
var roleOf = {};
var lateOf = {};
defs.forEach(function (d) { roleOf[d.id] = d.role; if (d.late) { lateOf[d.id] = true; } });
var byId = {};
list.forEach(function (s) { byId[s.id] = s; });
var members = {};
list.forEach(function (s) {
if (s.scored && s.group) { (members[s.group] = members[s.group] || []).push(s); }
});
var wrongTotal = 0;
var hintTotal = 0;
var revealTotal = 0;
var doneFired = false;
var qcache = {};
var listeners = [];
var t0 = null;
var t1 = null;
function isResolved(s) { return s.state === 'filled' || s.state === 'missed'; }
function slotOf(id) {
if (!hasOwn(byId, id)) { throw new Error('MG.engine: unknown slot ' + id); }
return byId[id];
}
function currentSlot() {
for (var i = 0; i < list.length; i++) {
if (list[i].scored && !isResolved(list[i])) { return list[i]; }
}
return null;
}
function askable(s) {
if (mode !== 'build') { return true; }
var cur = currentSlot();
return !!cur && (s === cur || (!!s.group && s.group === cur.group));
}
function isExact(s) { var r = rxnById[s.rxn]; return !!(r && r.exactAnswers === true); }
function remainingOf(s) {
var group = s.group ? members[s.group] : [s];
var pool = group.map(function (m) { return m.answer; });
group.forEach(function (m) {
if (isResolved(m)) {
var i = indexCovering(s.entityKind, pool, m.value, isExact(s));
if (i >= 0) { pool.splice(i, 1); }
}
});
var own = pool.indexOf(s.answer);
if (own > 0) { pool.splice(own, 1); pool.unshift(s.answer); }
return pool;
}
function targetFor(s, value) {
if (s.kind !== 'node' || !s.group) { return s; }
var group = members[s.group];
for (var i = 0; i < group.length; i++) {
if (!isResolved(group[i]) && group[i].answer === value) { return group[i]; }
}
for (var j = 0; j < group.length; j++) {
if (!isResolved(group[j]) && covers(s.entityKind, group[j].answer, value, isExact(s))) { return group[j]; }
}
return s;
}
function formatFor(s) {
if (mode === 'type') { return 'type'; }
if (s.entityKind !== 'molecule' || !hasDrawing(s.answer)) { return 'names'; }
if (format === 'mixed') { return rng() < 0.5 ? 'structures' : 'names'; }
return format;
}
function enzWord(s) {
var r = s ? rxnById[s.rxn] : null;
if (r && r.terms && r.terms.enz) { return r.terms.enz; }
return pathway.terms && pathway.terms.enz ? pathway.terms.enz : 'enzyme';
}
function promptFor(s) {
var group = s.group ? members[s.group] : null;
var multi = !!group && group.length > 1;
var open = multi ? remainingOf(s).length : 0;
var next = multi && open < group.length;
var base;
if (s.kind === 'enz') { base = enzWord(s) === 'enzyme' ? PROMPTS.enz : enzWord(s).charAt(0).toUpperCase() + enzWord(s).slice(1) + ' nào xúc tác cho bước này?'; }
else if (s.kind === 'node' && roleOf[s.id] === 'prod') {
base = !multi ? PROMPTS.product : (next ? PROMPTS.productOther : PROMPTS.productOne);
}
else if (s.kind === 'node' && roleOf[s.id] === 'link') {
base = 'Tín hiệu / thành phần điều hòa nào tham gia bước này?';
}
else if (s.kind === 'node') {
base = !multi ? PROMPTS.substrate : (next ? PROMPTS.consumeMore : PROMPTS.consumeOne);
}
else if (s.kind === 'in') {
base = !multi ? PROMPTS['in'] : (next ? PROMPTS.consumeMore : PROMPTS.consumeOne);
}
else {
base = !multi ? PROMPTS.out : (next ? PROMPTS.releaseMore : PROMPTS.releaseOne);
}
return mode === 'type' ? base + TYPE_SUFFIX : base;
}
function stepLabel(rid) {
var r = rxnById[rid];
if (!r) { return ''; }
if (r.label) { return r.label; }
if (pathway.id !== 'full') { return 'Bước ' + r.step; }
if (rid === 'pdc') { return 'Phản ứng liên kết (PDC)'; }
if (hasOwn(glyIds, rid)) { return 'Bước Đường phân ' + r.step; }
return 'Bước Chu trình TCA ' + r.step;
}
function positionContext(node) {
var order = pathway.order;
var usesIt = function (id) { return rxnById[id].substrates.indexOf(node) >= 0; };
if ((pathway.start || []).indexOf(node) >= 0) {
var firstUse = order.filter(usesIt)[0];
return firstUse ? 'Phân tử ban đầu, tham gia ' + stepLabel(firstUse) : 'Phân tử ban đầu';
}
var producers = producersOf(node);
if (!producers.length) { return ''; }
var made = producers[0];
var at = order.indexOf(made);
var used = order.slice(at + 1).concat(order.slice(0, at)).filter(usesIt)[0];
return used ? 'Sản phẩm của ' + stepLabel(made) + ', dùng trong ' + stepLabel(used) : 'Sản phẩm của ' + stepLabel(made);
}
function contextFor(s) {
if (s.kind === 'node' && mode !== 'build') { return positionContext(s.node); }
return s.rxn ? stepLabel(s.rxn) : '';
}
function regionsOf(e) { return Array.isArray(e.region) ? e.region : [e.region || 'both']; }
function hasDrawing(id) {
var e = entityOf('molecule', id);
return !!(e && !e.noStructure && MG.geometry && MG.geometry[id]);
}
function cardMolecules(rid) {
var r = rxnById[rid];
if (!r || mode !== 'build') { return []; }
var out = [];
r.substrates.concat(r.products).forEach(function (n) {
var s = hasOwn(byId, 'node:' + n) ? byId['node:' + n] : null;
if (s && isResolved(s)) { out.push(s.value); }
});
return out;
}
function distractorsFor(s, correct, want, geoOnly) {
if (want <= 0) { return []; }
var kind = s.entityKind;
var r = rxnById[s.rxn];
var placed = s.group ? members[s.group].filter(isResolved).map(function (m) { return m.value; }) : [];
var banned = closure(kind, correct, !!(r && r.exactAnswers === true)).concat(placed);
var avoid = r && r.avoid ? r.avoid : [];
var card = kind === 'molecule' ? cardMolecules(s.rxn) : [];
var excluded = pathway.noDistractor || [];
var pathRegions = pathway.region || [];
var pool = Object.keys(MG.entities[kind]).filter(function (id) {
var e = MG.entities[kind][id];
if (banned.indexOf(id) >= 0 || avoid.indexOf(id) >= 0 || card.indexOf(id) >= 0) { return false; }
if (e.noDistractor || excluded.indexOf(id) >= 0) { return false; }
if (geoOnly && !hasDrawing(id)) { return false; }
return regionsOf(e).some(function (x) { return pathRegions.indexOf(x) >= 0; });
});
var own = entityOf(kind, s.answer);
var fam = own ? own.family : null;
var sameFam = shuffle(pool.filter(function (id) { return entityOf(kind, id).family === fam; }), rng);
var rest = shuffle(pool.filter(function (id) { return entityOf(kind, id).family !== fam; }), rng);
if (pathway.custom && pathway.custom.length > 1) {
var ownRegions = own ? regionsOf(own).filter(function (x) { return x !== 'both' && x !== 'all'; }) : [];
var isNear = function (id) {
if (!ownRegions.length) { return true; }
var rs = regionsOf(entityOf(kind, id));
return rs.indexOf('both') >= 0 || rs.indexOf('all') >= 0 || rs.some(function (x) { return ownRegions.indexOf(x) >= 0; });
};
sameFam = sameFam.filter(isNear).concat(sameFam.filter(function (id) { return !isNear(id); }));
rest = rest.filter(isNear).concat(rest.filter(function (id) { return !isNear(id); }));
}
var picks = [];
function take(list, n) {
list.forEach(function (id) {
if (n > 0 && picks.length < want && picks.indexOf(id) < 0) { picks.push(id); n -= 1; }
});
}
if (kind === 'enzyme') {
var looks = (own && own.confusable ? own.confusable : []).filter(function (id) { return pool.indexOf(id) >= 0; });
take(shuffle(looks, rng).filter(function () { return rng() < LOOKALIKE_RATE; }), want);
}
take(sameFam, Math.min(Math.floor(sameFam.length / 2), Math.ceil(want / 2)));
take(rest, want);
take(sameFam, want);
return picks;
}
function makeQuestion(s) {
var fmt = formatFor(s);
var options = [];
if (mode !== 'type') {
var correct = remainingOf(s);
var total = mode === 'build' && fmt === 'structures' ? OPTIONS_STRUCTURES_BUILD : OPTIONS;
var extra = [];
if (fmt === 'structures') {
if (correct.every(hasDrawing)) { extra = distractorsFor(s, correct, total - correct.length, true); }
if (extra.length < total - correct.length) { fmt = 'names'; total = OPTIONS; extra = []; }
}
if (fmt !== 'structures') { extra = distractorsFor(s, correct, total - correct.length, false); }
var ids = shuffle(correct.concat(extra), rng);
options = ids.map(function (id) {
return { id: id, label: labelOf(s.entityKind, id), entityKind: s.entityKind };
});
}
return {
slotId: s.id, kind: s.kind, rxnId: s.rxn, entityKind: s.entityKind,
prompt: promptFor(s), context: contextFor(s), format: fmt, options: options
};
}
function presentQuestion(s) {
if (!hasOwn(qcache, s.id)) { qcache[s.id] = makeQuestion(s); }
var raw = qcache[s.id];
var q = {
slotId: raw.slotId, kind: raw.kind, rxnId: raw.rxnId, entityKind: raw.entityKind,
prompt: raw.prompt, context: raw.context, format: raw.format,
options: raw.options.map(function (o) {
return { id: o.id, label: o.label, entityKind: o.entityKind, eliminated: s.eliminated.indexOf(o.id) >= 0 };
})
};
if (mode === 'build') { q.eq = equationOf(s.rxn); }
return q;
}
function dropQuestions(s) {
delete qcache[s.id];
if (s.group) { members[s.group].forEach(function (m) { delete qcache[m.id]; }); }
if (mode === 'build' && s.rxn) {
list.forEach(function (m) { if (m.rxn === s.rxn) { delete qcache[m.id]; } });
}
}
function emit(evt) {
listeners.slice().forEach(function (fn) { fn(evt); });
}
function syncStates() {
var cur = mode === 'build' ? currentSlot() : null;
list.forEach(function (s) {
if (!hasOwn(lateOf, s.id)) { return; }
var want = isResolved(byId['enz:' + s.rxn]) ? 'filled' : 'hidden';
if (s.state !== want) {
s.state = want;
emit({ type: 'slot', slotId: s.id });
}
});
list.forEach(function (s) {
if (!s.scored || isResolved(s)) { return; }
var want = mode !== 'build' ? 'empty' : (s === cur ? 'active' : 'hidden');
if (s.state !== want) {
s.state = want;
emit({ type: 'slot', slotId: s.id });
}
});
}
function isDone() {
return list.every(function (s) { return !s.scored || isResolved(s); });
}
function place(t, value, state) {
t.value = value;
t.state = state;
dropQuestions(t);
if (store && typeof store.record === 'function' && t.rxn) {
var clean = state === 'filled' && t.wrong === 0 && !t.assisted;
try { store.record(pathway.id, t.rxn, t.kind, clean); } catch (e) { /* progress tracking is best effort */ }
}
}
function announce(ids) {
ids.forEach(function (id) { emit({ type: 'slot', slotId: id }); });
syncStates();
if (mode === 'build') { emit({ type: 'question' }); }
emit({ type: 'stats' });
if (isDone() && !doneFired) {
doneFired = true;
stop();
emit({ type: 'done' });
}
}
function start() {
if (t0 === null) { t0 = now(); }
}
function stop() {
if (t0 !== null && t1 === null) { t1 = now(); }
}
function elapsed() {
return t0 === null ? 0 : (t1 === null ? now() : t1) - t0;
}
function stats() {
var total = 0;
var filled = 0;
var right = 0;
list.forEach(function (s) {
if (!s.scored) { return; }
total += 1;
if (isResolved(s)) { filled += 1; }
if (s.state === 'filled') { right += 1; }
});
var wrong = wrongTotal;
return {
right: right, wrong: wrong, hints: hintTotal, revealed: revealTotal,
filled: filled, total: total, elapsed: elapsed(),
accuracy: right + wrong === 0 ? 1 : right / (right + wrong)
};
}
function subscribe(fn) {
listeners.push(fn);
return function () {
var i = listeners.indexOf(fn);
if (i >= 0) { listeners.splice(i, 1); }
};
}
function eqEntry(id) {
var s = hasOwn(byId, id) ? byId[id] : null;
if (!s) { return { slotId: id, state: 'unknown', value: null }; }
if (hasOwn(lateOf, id)) { return { slotId: id, state: 'known', value: s.value }; }
if (isResolved(s)) { return { slotId: id, state: 'known', value: s.value }; }
if (s.state === 'active') { return { slotId: id, state: 'active', value: null }; }
return { slotId: id, state: 'unknown', value: null };
}
function equationOf(rid) {
if (!hasOwn(rxnById, rid)) { throw new Error('MG.engine.equation: unknown reaction ' + rid); }
var r = rxnById[rid];
return {
rxnId: rid, step: r.step, type: r.type, equation: r.equation, irreversible: r.irreversible,
enzyme: eqEntry('enz:' + rid),
subs: r.substrates.map(function (n) { return eqEntry('node:' + n); }),
prods: r.products.map(function (n) { return eqEntry('node:' + n); }),
ins: r.ins.map(function (c, i) { return eqEntry('in:' + rid + ':' + i); }),
outs: r.outs.map(function (c, i) { return eqEntry('out:' + rid + ':' + i); })
};
}
function current() {
if (mode !== 'build') { return null; }
var cur = currentSlot();
return cur ? presentQuestion(cur) : null;
}
function options(slotId) {
var s = slotOf(slotId);
if (!s.scored || isResolved(s)) { return null; }
return presentQuestion(s);
}
function canAct(s) {
return !isDone() && s.scored && !isResolved(s) && askable(s);
}
function rejected(s) {
return { ok: false, slotId: s.id, filled: [], done: isDone() };
}
function checkChosen(s, value) {
if (typeof value !== 'string') { return { ok: false }; }
return indexCovering(s.entityKind, remainingOf(s), value, isExact(s)) >= 0 ? { ok: true, id: value } : { ok: false };
}
function checkTyped(s, text) {
if (typeof text !== 'string') { return { ok: false }; }
var rem = remainingOf(s);
var r = MG.match.check(s.entityKind, text, rem, isExact(s) ? { exact: true } : null);
if (!r || !r.ok) { return { ok: false }; }
return { ok: true, id: indexCovering(s.entityKind, rem, r.id, isExact(s)) >= 0 ? r.id : rem[0] };
}
function answer(slotId, value) {
var s = slotOf(slotId);
if (!canAct(s)) { return rejected(s); }
var res = mode === 'type' ? checkTyped(s, value) : checkChosen(s, value);
if (!res.ok) {
s.wrong += 1;
wrongTotal += 1;
if (mode !== 'type' && typeof value === 'string' && entityOf(s.entityKind, value)
&& s.eliminated.indexOf(value) < 0) {
s.eliminated.push(value);
}
announce([s.id]);
return { ok: false, slotId: s.id, filled: [], done: isDone() };
}
var target = targetFor(s, res.id);
place(target, res.id, 'filled');
announce([target.id]);
return { ok: true, slotId: target.id, filled: [target.id], done: isDone() };
}
function hintReaction(s) {
if (s.rxn) { return rxnById[s.rxn]; }
var user = pathway.order.filter(function (id) { return rxnById[id].substrates.indexOf(s.node) >= 0; })[0];
return user ? rxnById[user] : null;
}
function hintResult(s, more, total) {
var lines = s.hintLines.map(function (l) { return { label: l.label, text: l.text }; });
return { level: lines.length, lines: lines, text: lines.length ? lines[lines.length - 1].text : '', more: more, total: total === undefined ? lines.length : total };
}
function hint(slotId) {
var s = slotOf(slotId);
var open = s.scored && !isResolved(s) && !isDone() ? remainingOf(s) : [];
if (!open.length) { return hintResult(s, false); }
var ladderLines = MG.hints.ladder(pathway, hintReaction(s),
{ kind: s.kind, role: roleOf[s.id] || null, entityKind: s.entityKind }, open);
if (s.hintLines.length >= ladderLines.length) { return hintResult(s, false, ladderLines.length); }
s.hintLines.push(ladderLines[s.hintLines.length]);
s.assisted = true;
hintTotal += 1;
announce([s.id]);
return hintResult(s, s.hintLines.length < ladderLines.length, ladderLines.length);
}
function reveal(slotId) {
var s = slotOf(slotId);
if (!canAct(s)) { return rejected(s); }
var value = remainingOf(s)[0];
if (value === undefined) { return rejected(s); }
place(s, value, 'missed');
wrongTotal += 1;
revealTotal += 1;
announce([s.id]);
return { ok: true, slotId: s.id, filled: [s.id], done: isDone(), expected: value };
}
function summary() {
var st = stats();
function row(s) {
return {
slotId: s.id, kind: s.kind, rxnId: s.rxn,
step: hasOwn(rxnById, s.rxn) ? rxnById[s.rxn].step : null,
stepLabel: s.rxn ? stepLabel(s.rxn) : 'Phân tử ban đầu',
answerId: s.value, answerLabel: labelOf(s.entityKind, s.value)
};
}
var missed = list.filter(function (s) { return s.scored && s.state === 'missed'; }).map(row);
var retried = list.filter(function (s) { return s.scored && s.state === 'filled' && s.wrong > 0; }).map(row);
return {
pathwayId: pathway.id, title: pathway.title, mode: mode,
right: st.right, wrong: st.wrong, hints: st.hints, revealed: st.revealed,
accuracy: st.accuracy, elapsed: st.elapsed, missed: missed, retried: retried, lines: pathway.summary.slice()
};
}
syncStates();
return {
pathway: pathway,
mode: mode,
slotList: list,
slot: function (id) { return hasOwn(byId, id) ? byId[id] : null; },
start: start,
stop: stop,
elapsed: elapsed,
stats: stats,
isDone: isDone,
subscribe: subscribe,
current: current,
options: options,
answer: answer,
hint: hint,
reveal: reveal,
equation: equationOf,
summary: summary
};
}
MG.engine = { createGame: createGame };
})(typeof window !== 'undefined' ? window : globalThis);
