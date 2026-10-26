const FONT_LATIN = "Roboto";
const FONT_JA = "Noto Sans JP";
const FONT_MONO = "Roboto Mono";

function addText(slide, text, opts, meta) {
  slide.addText(String(text ?? ""), {
    margin: 0,
    breakLine: false,
    fontFace: meta.language === "ja" ? FONT_JA : FONT_LATIN,
    color: opts.color,
    fontSize: opts.fontSize,
    bold: opts.bold,
    ...opts
  });
}

function addBrandMotif(pptx, slide, theme) {
  if (theme.motif === "system-grid" || theme.motif === "cyber-grid") {
    const cols = theme.motif === "cyber-grid" ? 16 : 12;
    const rows = theme.motif === "cyber-grid" ? 10 : 7;
    const transparency = Math.max(82, Math.round(100 - (theme.gridOpacity || 0.08) * 100));
    for (let i = 1; i < cols; i++) {
      const x = 13.333 * i / cols;
      slide.addShape(pptx.ShapeType.line, { x, y: 0, w: 0, h: 7.5, line: { color: theme.border, width: 0.3, transparency } });
    }
    for (let i = 1; i < rows; i++) {
      const y = 7.5 * i / rows;
      slide.addShape(pptx.ShapeType.line, { x: 0, y, w: 13.333, h: 0, line: { color: theme.border, width: 0.3, transparency } });
    }
    slide.addShape(pptx.ShapeType.line, { x: 11.78, y: 0.34, w: 0.72, h: 0, line: { color: theme.primary, width: 2.4 } });
    slide.addShape(pptx.ShapeType.line, { x: 12.52, y: 0.34, w: 0.34, h: 0, line: { color: theme.accent2, width: 2.4 } });
    if (theme.motif === "cyber-grid") {
      slide.addShape(pptx.ShapeType.line, { x: 0.22, y: 0.25, w: 0.36, h: 0, line: { color: theme.primary, width: 1.2 } });
      slide.addShape(pptx.ShapeType.line, { x: 0.22, y: 0.25, w: 0, h: 0.36, line: { color: theme.primary, width: 1.2 } });
      slide.addShape(pptx.ShapeType.line, { x: 12.74, y: 7.02, w: 0.36, h: 0, line: { color: theme.accent2, width: 1.2 } });
      slide.addShape(pptx.ShapeType.line, { x: 13.10, y: 6.66, w: 0, h: 0.36, line: { color: theme.accent2, width: 1.2 } });
    }
  } else if (theme.motif === "dual-sync") {
    slide.addShape(pptx.ShapeType.line, { x: 11.24, y: 0.36, w: 0.68, h: 0, line: { color: theme.accent, width: 2.8 } });
    slide.addShape(pptx.ShapeType.line, { x: 12.02, y: 0.36, w: 0.68, h: 0, line: { color: theme.accent2, width: 2.8 } });
    slide.addShape(pptx.ShapeType.line, { x: 11.96, y: 0.23, w: 0, h: 0.26, line: { color: theme.text, width: 0.8, transparency: 45 } });
  } else if (theme.motif === "collective-blocks" || theme.motif === "hack-editorial") {
    slide.addShape(pptx.ShapeType.rect, { x: 11.72, y: 0.18, w: 0.50, h: 0.16, fill: { color: theme.primary, transparency: theme.motif === "hack-editorial" ? 0 : 18 }, line: { color: theme.primary, transparency: 100 } });
    slide.addShape(pptx.ShapeType.rect, { x: 12.14, y: 0.31, w: 0.50, h: 0.16, fill: { color: theme.accent, transparency: 20 }, line: { color: theme.accent, transparency: 100 } });
    slide.addShape(pptx.ShapeType.rect, { x: 12.56, y: 0.18, w: 0.30, h: 0.16, fill: { color: theme.accent2, transparency: 25 }, line: { color: theme.accent2, transparency: 100 } });
  } else if (theme.motif === "learning-path" || theme.motif === "learning-map") {
    slide.addShape(pptx.ShapeType.line, { x: 10.92, y: 0.36, w: 1.82, h: 0, line: { color: theme.border, width: 1.2 } });
    [11.02, 11.58, 12.14, 12.70].forEach((x, i) => {
      slide.addShape(pptx.ShapeType.ellipse, { x, y: 0.29, w: 0.14, h: 0.14, fill: { color: i < 2 ? theme.primary : theme.surface2 }, line: { color: i < 2 ? theme.primary : theme.border, width: 0.7 } });
    });
  }
}

function headerText(spec, index, theme, meta) {
  const section = String(spec.section || "DECK").toUpperCase();
  const page = String(index + 1).padStart(2, "0");
  if (theme.headerStyle === "lab") return `// ROBO_LAB · ${section} · ${page}`;
  if (theme.headerStyle === "manifesto") return `CO-OP LAB // ${section} // ${page}`;
  if (theme.headerStyle === "progress") return `ROBO UNIVERSITY · MODULE ${section} · ${page}`;
  return `ROBO CO-OP / SUPPORT TOGETHER / ${section} / ${page}`;
}

function addBase(pptx, slide, spec, index, theme, meta, isCover = false) {
  slide.background = { color: theme.bg };
  addBrandMotif(pptx, slide, theme);
  if (isCover) return;

  addText(slide, headerText(spec, index, theme, meta), {
    x: 0.56, y: 0.28, w: 6.8, h: 0.22,
    fontFace: FONT_MONO, fontSize: 9.2, color: theme.muted, charSpacing: theme.codeHeader ? 1.3 : 0.8
  }, meta);

  const baseTitle = spec.title.length > 60 ? 25 : 29;
  addText(slide, spec.title, {
    x: 0.56, y: 0.72, w: 12.1, h: 0.72,
    fontSize: Math.round(baseTitle * (theme.titleScale || 1)),
    bold: true, color: theme.text, fit: "shrink"
  }, meta);

  slide.addShape(pptx.ShapeType.line, {
    x: 0.56, y: 6.96, w: 12.18, h: 0,
    line: { color: theme.border, width: theme.ruleWidth || 0.7 }
  });

  if (spec.source) {
    addText(slide, `SOURCE · ${spec.source}`, {
      x: 0.56, y: 7.02, w: 9.7, h: 0.18,
      fontFace: FONT_MONO, fontSize: 7.5, color: theme.muted
    }, meta);
  }

  addText(slide, String(index + 1).padStart(2, "0"), {
    x: 12.15, y: 7.0, w: 0.58, h: 0.18,
    fontFace: FONT_MONO, fontSize: 8, color: theme.muted, align: "right"
  }, meta);
}

function panel(slide, pptx, theme, x, y, w, h, fill = theme.surface) {
  if (theme.motif === "collective-blocks" || theme.motif === "hack-editorial") {
    slide.addShape(pptx.ShapeType.rect, {
      x: x + 0.06, y: y + 0.07, w, h,
      fill: { color: theme.accent, transparency: 78 },
      line: { color: theme.accent, transparency: 100 }
    });
  }
  slide.addShape(theme.panelShape === "square" ? pptx.ShapeType.rect : pptx.ShapeType.roundRect, {
    x, y, w, h,
    fill: { color: fill },
    line: { color: theme.border, width: theme.borderWidth || 0.8 }
  });
  if (theme.motif === "cyber-grid") {
    slide.addShape(pptx.ShapeType.line, { x: x + 0.08, y: y + 0.10, w: 0.48, h: 0, line: { color: theme.primary, width: 1.6 } });
  } else if (theme.motif === "dual-sync") {
    slide.addShape(pptx.ShapeType.line, { x: x + 0.08, y: y + 0.10, w: 0.22, h: 0, line: { color: theme.accent, width: 1.8 } });
    slide.addShape(pptx.ShapeType.line, { x: x + 0.32, y: y + 0.10, w: 0.22, h: 0, line: { color: theme.accent2, width: 1.8 } });
  } else if (theme.motif === "learning-path" || theme.motif === "learning-map") {
    slide.addShape(pptx.ShapeType.ellipse, { x: x + 0.12, y: y + 0.12, w: 0.14, h: 0.14, fill: { color: theme.primary }, line: { color: theme.primary, width: 0.5 } });
  }
}

function bulletText(items = []) {
  return items.map((v, i) => ({ text: String(v), options: { bullet: { indent: 12 }, breakLine: i < items.length - 1 } }));
}

export function renderCover({ pptx, slide, spec, index, theme, meta }) {
  addBase(pptx, slide, spec, index, theme, meta, true);
  const label =
    theme.brand === "robo-lab" ? (theme.mode === "expressive" ? "// ROBO_LAB · EXPERIMENTAL_SYSTEM" : "// ROBO_LAB · SYSTEMIC_LAB") :
    theme.brand === "coop-lab" ? (theme.mode === "expressive" ? "CO-OP LAB // LET'S HACK CAPITALISM" : "CO-OP LAB // STARTUP TOGETHER") :
    theme.brand === "robo-university" ? (theme.mode === "expressive" ? "ROBO UNIVERSITY · UPDATE IN PROGRESS" : "ROBO UNIVERSITY · LEARN TOGETHER") :
    (theme.mode === "expressive" ? "ROBO CO-OP · HUMAN ⇄ MACHINE OS" : "ROBO CO-OP · SUPPORT TOGETHER");
  addText(slide, label, {
    x: 0.7, y: 0.55, w: 7.4, h: 0.28,
    fontFace: FONT_MONO, fontSize: 10, color: theme.primary, charSpacing: 1.2
  }, meta);
  addText(slide, spec.title, {
    x: 0.7, y: 1.55, w: 10.9, h: 1.55,
    fontSize: Math.round((spec.title.length > 48 ? 35 : 44) * (theme.titleScale || 1)),
    bold: true, color: theme.text, fit: "shrink"
  }, meta);
  if (spec.subtitle || meta.subtitle) addText(slide, spec.subtitle || meta.subtitle, {
    x: 0.72, y: 3.35, w: 8.8, h: 0.7,
    fontSize: 18, color: theme.muted, fit: "shrink"
  }, meta);
  slide.addShape(pptx.ShapeType.line, {
    x: 0.72, y: 5.9, w: 3.15, h: 0,
    line: { color: theme.primary, width: 3 }
  });
  addText(slide, meta.author || "Robo Co-op", {
    x: 0.72, y: 6.15, w: 5.0, h: 0.28,
    fontFace: FONT_MONO, fontSize: 9.5, color: theme.muted
  }, meta);
}

export function renderStatement({ pptx, slide, spec, index, theme, meta }) {
  addBase(pptx, slide, spec, index, theme, meta);
  panel(slide, pptx, theme, 0.58, 1.72, 7.52, 4.65, theme.surface);
  addText(slide, spec.body || spec.subtitle || "", {
    x: 0.95, y: 2.12, w: 6.82, h: 2.25,
    fontSize: 24, bold: true, color: theme.text, valign: "mid", fit: "shrink"
  }, meta);
  slide.addShape(pptx.ShapeType.line, {
    x: 8.55, y: 2.05, w: 0, h: 3.65,
    line: { color: theme.primary, width: 2.5 }
  });
  addText(slide, spec.proof || "", {
    x: 8.92, y: 2.2, w: 3.34, h: 3.2,
    fontSize: 15, color: theme.muted, valign: "mid", fit: "shrink"
  }, meta);
}

export function renderMetrics({ pptx, slide, spec, index, theme, meta }) {
  addBase(pptx, slide, spec, index, theme, meta);
  const items = spec.metrics.slice(0, 4);
  const gap = 0.24;
  const w = (12.15 - gap * (items.length - 1)) / items.length;
  items.forEach((m, i) => {
    const x = 0.58 + i * (w + gap);
    panel(slide, pptx, theme, x, 2.0, w, 3.9, theme.surface);
    addText(slide, m.label || "", {x:x+0.28,y:2.35,w:w-0.56,h:0.35,fontFace:FONT_MONO,fontSize:9,color:theme.muted}, meta);
    addText(slide, m.value || "", {x:x+0.28,y:3.0,w:w-0.56,h:0.8,fontSize:32,bold:true,color:i===0?theme.primary:theme.text,fit:"shrink"}, meta);
    addText(slide, m.note || "", {x:x+0.28,y:4.15,w:w-0.56,h:1.0,fontSize:12.5,color:theme.muted,fit:"shrink"}, meta);
  });
}

export function renderComparison({ pptx, slide, spec, index, theme, meta }) {
  addBase(pptx, slide, spec, index, theme, meta);
  const cols = spec.columns.slice(0, 3);
  const gap = 0.25;
  const w = (12.15 - gap * (cols.length - 1)) / cols.length;
  cols.forEach((c, i) => {
    const x = 0.58 + i * (w + gap);
    panel(slide, pptx, theme, x, 1.85, w, 4.65, theme.surface);
    addText(slide, c.label || `OPTION ${i+1}`, {x:x+0.3,y:2.15,w:w-0.6,h:0.25,fontFace:FONT_MONO,fontSize:8.5,color:i===0?theme.primary:theme.muted}, meta);
    addText(slide, c.title || "", {x:x+0.3,y:2.58,w:w-0.6,h:0.65,fontSize:19,bold:true,color:theme.text,fit:"shrink"}, meta);
    slide.addText(bulletText(c.points || []), {
      x:x+0.3,y:3.48,w:w-0.65,h:2.3,margin:0.03,fontFace:meta.language==="ja"?FONT_JA:FONT_LATIN,
      fontSize:12.5,color:theme.muted,breakLine:false,paraSpaceAfterPt:8
    });
  });
}

export function renderProcess({ pptx, slide, spec, index, theme, meta }) {
  addBase(pptx, slide, spec, index, theme, meta);
  const steps = spec.steps.slice(0, 6);
  const w = 11.9 / steps.length;
  steps.forEach((s, i) => {
    const x = 0.68 + i * w;
    addText(slide, String(i+1).padStart(2,"0"), {x,y:2.04,w:0.55,h:0.25,fontFace:FONT_MONO,fontSize:9,color:theme.primary}, meta);
    slide.addShape(pptx.ShapeType.line, {x:x+0.02,y:2.55,w:w-0.23,h:0,line:{color:i===0?theme.primary:theme.border,width:2}});
    addText(slide, s.title || "", {x,y:2.88,w:w-0.22,h:0.6,fontSize:15,bold:true,color:theme.text,fit:"shrink"}, meta);
    addText(slide, s.body || "", {x,y:3.75,w:w-0.25,h:1.85,fontSize:11.5,color:theme.muted,fit:"shrink"}, meta);
  });
}

export function renderArchitecture({ pptx, slide, spec, index, theme, meta }) {
  addBase(pptx, slide, spec, index, theme, meta);
  const layers = spec.layers.slice(0, 4);
  const gap = 0.28;
  const w = (12.1 - gap * (layers.length - 1)) / layers.length;
  layers.forEach((layer, i) => {
    const x = 0.6 + i * (w + gap);
    addText(slide, layer.title || `LAYER ${i+1}`, {x,y:1.8,w,h:0.3,fontFace:FONT_MONO,fontSize:9,color:theme.primary}, meta);
    (layer.nodes || []).slice(0,4).forEach((node,j) => {
      const y = 2.35 + j * 0.94;
      panel(slide, pptx, theme, x, y, w, 0.7, j===0?theme.surface2:theme.surface);
      addText(slide, typeof node === "string" ? node : node.label || "", {x:x+0.18,y:y+0.18,w:w-0.36,h:0.3,fontSize:12,bold:j===0,color:theme.text,align:"center",fit:"shrink"}, meta);
    });
    if (i < layers.length - 1) addText(slide, "→", {x:x+w+0.03,y:3.6,w:gap-0.05,h:0.4,fontSize:18,color:theme.primary,align:"center"}, meta);
  });
}

export function renderDemo({ pptx, slide, spec, index, theme, meta }) {
  addBase(pptx, slide, spec, index, theme, meta);
  panel(slide, pptx, theme, 0.6, 1.85, 3.45, 4.6, theme.surface);
  const flowLabel = theme.brand === "robo-university" ? "PATH" : theme.brand === "coop-lab" ? "BUILD" : theme.brand === "robo-coop" ? "SYNC" : "FLOW";
  addText(slide, flowLabel, {x:0.9,y:2.15,w:1,h:0.25,fontFace:FONT_MONO,fontSize:9,color:theme.primary}, meta);
  (spec.steps || []).slice(0,5).forEach((s,i) => {
    addText(slide, `${String(i+1).padStart(2,"0")}  ${s.title || s}`, {x:0.9,y:2.75+i*0.68,w:2.8,h:0.42,fontSize:11.5,color:i===0?theme.text:theme.muted,bold:i===0,fit:"shrink"}, meta);
  });

  const terminalFill = theme.terminal ? (theme.brand === "robo-lab" ? "060B18" : theme.surface2) : theme.surface2;
  panel(slide, pptx, theme, 4.45, 1.85, 8.25, 4.6, terminalFill);
  addText(slide, spec.screen.title || "SYSTEM OUTPUT", {x:4.8,y:2.12,w:4.8,h:0.3,fontFace:FONT_MONO,fontSize:9,color:theme.primary}, meta);
  (spec.screen.lines || []).slice(0,9).forEach((line,i) => {
    addText(slide, String(line), {x:4.82,y:2.7+i*0.37,w:7.4,h:0.28,fontFace:FONT_MONO,fontSize:9.5,color:i===0?theme.text:theme.muted,fit:"shrink"}, meta);
  });
}

export const RENDERERS = {
  cover: renderCover,
  statement: renderStatement,
  metrics: renderMetrics,
  comparison: renderComparison,
  process: renderProcess,
  architecture: renderArchitecture,
  demo: renderDemo
};
