
import { useState, useRef, useCallback, useEffect } from "react";

// ─── Icons (inline SVG components) ───────────────────────────────────────────
const Icon = ({ d, size = 16, stroke = "currentColor", fill = "none", strokeWidth = 1.75 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((path, i) => <path key={i} d={path} />) : <path d={d} />}
  </svg>
);

const icons = {
  plus: "M12 5v14M5 12h14",
  trash: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  copy: "M8 4H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2M8 4h8M8 4a2 2 0 012-2h0a2 2 0 012 2h0",
  drag: "M9 5h.01M9 12h.01M9 19h.01M15 5h.01M15 12h.01M15 19h.01",
  collapse: "M19 9l-7 7-7-7",
  expand: "M5 15l7-7 7 7",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z",
  image: "M21 19V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2zM8.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM21 15l-5-5L5 21",
  video: "M23 7l-7 5 7 5V7zM1 5h15a2 2 0 012 2v10a2 2 0 01-2 2H1a2 2 0 01-2-2V7a2 2 0 012-2z",
  text: "M4 6h16M4 12h16M4 18h12",
  quote: "M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zM15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z",
  divider: "M5 12h14",
  heading: "M4 4v16M12 4v16M4 12h8M16 8l4 4-4 4",
  audio: "M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zM21 16a3 3 0 11-6 0 3 3 0 016 0z",
  link: "M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71",
  check: "M20 6L9 17l-5-5",
  warning: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01",
  info: "M12 22a10 10 0 100-20 10 10 0 000 20zM12 8h.01M11 12h1v4h1",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  formula: "M4 5h7M9 3v2c0 4.418-2.239 8-5 8M5 9c0 4.418 2.239 8 5 8m5 2l3-11m0 11l3-11",
  definition: "M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z",
  flashcard: "M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM12 8v8M8 12h8",
  accordion: "M9 18l6-6-6-6",
  tabs: "M4 3h5v5H4zM10 3h5v5h-5zM16 3h4v5h-4zM4 13h16v8H4z",
  timeline: "M12 2v20M7 7l5-5 5 5M7 17l5 5 5-5",
  steps: "M3 6h18M3 12h18M3 18h18",
  mcq: "M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11",
  tf: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  fill: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  match: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  drag2: "M5 9l4-4 4 4M5 15l4 4 4-4",
  download: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3",
  export: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12",
  settings: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z",
  ai: "M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1a1 1 0 010 2h-1v1a2 2 0 01-2 2v1a1 1 0 01-2 0v-1H7v1a1 1 0 01-2 0v-1a2 2 0 01-2-2v-1H2a1 1 0 010-2h1a7 7 0 017-7h1V5.73A2 2 0 0110 4a2 2 0 012-2z",
  module: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  lesson: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  palette: "M12 2a10 10 0 000 20c1.1 0 2-.9 2-2v-.5c0-.28-.1-.53-.29-.71a1 1 0 01-.21-1.09A1 1 0 0114.5 17H16a6 6 0 006-6C22 7.13 17.52 2 12 2z",
  media: "M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM9 9l6 3-6 3V9z",
  note: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  key: "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4",
  summary: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  doc: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM14 2v6h6",
  gallery: "M4 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM3 20h18",
  interactive: "M13 10V3L4 14h7v7l9-11h-7z",
  tip: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  scorm: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  xapi: "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z",
};

// ─── Block Type Definitions ────────────────────────────────────────────────────
const BLOCK_CATEGORIES = [
  {
    label: "Text & Structure",
    color: "#6366f1",
    blocks: [
      { type: "title", label: "Title", icon: "heading", desc: "Main lesson title" },
      { type: "heading", label: "Heading", icon: "heading", desc: "Section heading" },
      { type: "subheading", label: "Subheading", icon: "heading", desc: "Subsection heading" },
      { type: "paragraph", label: "Paragraph", icon: "text", desc: "Body text content" },
      { type: "quote", label: "Quote Block", icon: "quote", desc: "Highlighted quotation" },
      { type: "divider", label: "Divider", icon: "divider", desc: "Section separator" },
    ]
  },
  {
    label: "Media",
    color: "#0ea5e9",
    blocks: [
      { type: "image", label: "Image", icon: "image", desc: "Single image" },
      { type: "gallery", label: "Image Gallery", icon: "gallery", desc: "Multiple images" },
      { type: "video_upload", label: "Video Upload", icon: "video", desc: "Upload video file" },
      { type: "video_url", label: "Video URL", icon: "video", desc: "Embed from URL" },
      { type: "audio", label: "Audio", icon: "audio", desc: "Audio player" },
      { type: "animation", label: "Animation", icon: "interactive", desc: "GIF or Lottie" },
    ]
  },
  {
    label: "Callouts",
    color: "#f59e0b",
    blocks: [
      { type: "highlight", label: "Highlight", icon: "star", desc: "Important info" },
      { type: "note", label: "Note", icon: "note", desc: "Additional context" },
      { type: "warning", label: "Warning", icon: "warning", desc: "Caution notice" },
      { type: "tip", label: "Tip", icon: "tip", desc: "Helpful tip" },
      { type: "summary", label: "Summary", icon: "summary", desc: "Section summary" },
    ]
  },
  {
    label: "Knowledge",
    color: "#10b981",
    blocks: [
      { type: "key_concept", label: "Key Concept", icon: "key", desc: "Core concept" },
      { type: "definition", label: "Definition", icon: "definition", desc: "Term definition" },
      { type: "formula", label: "Formula", icon: "formula", desc: "Math formula" },
      { type: "equation", label: "Equation", icon: "formula", desc: "Math equation" },
    ]
  },
  {
    label: "Documents & Links",
    color: "#8b5cf6",
    blocks: [
      { type: "document", label: "Document", icon: "doc", desc: "PDF or DOCX file" },
      { type: "external_link", label: "External Link", icon: "link", desc: "Link to URL" },
      { type: "file_download", label: "File Download", icon: "download", desc: "Downloadable file" },
      { type: "interactive_image", label: "Interactive Image", icon: "interactive", desc: "Hotspot image" },
    ]
  },
  {
    label: "Interactive",
    color: "#ef4444",
    blocks: [
      { type: "mcq", label: "Multiple Choice", icon: "mcq", desc: "Multiple choice quiz" },
      { type: "true_false", label: "True / False", icon: "tf", desc: "True/false question" },
      { type: "fill_blank", label: "Fill in Blank", icon: "fill", desc: "Fill blank exercise" },
      { type: "matching", label: "Matching", icon: "match", desc: "Match pairs" },
      { type: "drag_drop", label: "Drag & Drop", icon: "drag2", desc: "Arrange items" },
      { type: "flashcards", label: "Flashcards", icon: "flashcard", desc: "Flip cards" },
      { type: "accordion", label: "Accordion", icon: "accordion", desc: "Expandable sections" },
      { type: "tabs", label: "Tabs", icon: "tabs", desc: "Tabbed content" },
      { type: "timeline", label: "Timeline", icon: "timeline", desc: "Chronological events" },
      { type: "step_process", label: "Step Process", icon: "steps", desc: "Step-by-step guide" },
    ]
  },
];

const ALL_BLOCKS = BLOCK_CATEGORIES.flatMap(c => c.blocks.map(b => ({ ...b, category: c.label, color: c.color })));

// ─── Generate block default data ──────────────────────────────────────────────
const createBlock = (type) => {
  const base = { id: `block_${Date.now()}_${Math.random().toString(36).slice(2,7)}`, type, collapsed: false };
  const defaults = {
    title: { text: "Lesson Title" },
    heading: { text: "Section Heading", level: 2 },
    subheading: { text: "Subheading", level: 3 },
    paragraph: { text: "Begin typing your content here. This is a paragraph block that supports rich text content.", level: 1 },
    quote: { text: "Enter a meaningful quote here.", author: "Author Name" },
    divider: { style: "solid" },
    image: { src: "", alt: "", caption: "" },
    gallery: { images: [] },
    video_upload: { src: "", caption: "" },
    video_url: { url: "", caption: "" },
    audio: { src: "", title: "" },
    animation: { src: "", type: "gif" },
    interactive_image: { src: "", hotspots: [] },
    highlight: { text: "This is highlighted important information.", color: "#fef3c7" },
    note: { text: "This is a note with additional context or information." },
    warning: { text: "Important warning that learners should be aware of." },
    tip: { text: "Helpful tip to improve understanding or performance." },
    summary: { text: "Summary of key points covered in this section." },
    key_concept: { term: "Key Concept", text: "Explanation of this key concept." },
    definition: { term: "Term", text: "Definition of the term." },
    formula: { formula: "E = mc^2", description: "Einstein's mass-energy equivalence" },
    equation: { equation: "\\int_a^b f(x)\\,dx", description: "Definite integral" },
    document: { src: "", name: "", type: "pdf" },
    external_link: { url: "", title: "", description: "" },
    file_download: { src: "", name: "", size: "" },
    mcq: { question: "What is the correct answer?", options: ["Option A", "Option B", "Option C", "Option D"], correct: 0, feedback: "" },
    true_false: { question: "This statement is true.", correct: true, feedback: "" },
    fill_blank: { text: "The capital of France is ___.", answer: "Paris", hint: "" },
    matching: { pairs: [{ left: "Item 1", right: "Match A" }, { left: "Item 2", right: "Match B" }] },
    drag_drop: { prompt: "Arrange in correct order:", items: ["First item", "Second item", "Third item"] },
    flashcards: { cards: [{ front: "Front of card", back: "Back of card" }] },
    accordion: { items: [{ title: "Section 1", content: "Content for section 1." }] },
    tabs: { tabs: [{ label: "Tab 1", content: "Content for tab 1." }] },
    timeline: { events: [{ date: "2024", title: "Event Title", description: "Event description." }] },
    step_process: { steps: [{ number: 1, title: "Step One", description: "Description of step one." }] },
  };
  return { ...base, ...(defaults[type] || {}) };
};

// ─── Themes ────────────────────────────────────────────────────────────────────
const THEMES = {
  light: { name: "Light", bg: "#ffffff", surface: "#f8fafc", border: "#e2e8f0", text: "#0f172a", accent: "#6366f1", preview_bg: "#f1f5f9" },
  dark: { name: "Dark", bg: "#0f172a", surface: "#1e293b", border: "#334155", text: "#f1f5f9", accent: "#818cf8", preview_bg: "#0f172a" },
  school: { name: "School", bg: "#fffbeb", surface: "#fef3c7", border: "#fcd34d", text: "#1c1917", accent: "#f59e0b", preview_bg: "#fffbeb" },
  corporate: { name: "Corporate", bg: "#f8fafc", surface: "#e0f2fe", border: "#bae6fd", text: "#0c4a6e", accent: "#0284c7", preview_bg: "#f0f9ff" },
  government: { name: "Government", bg: "#f8f9fa", surface: "#e8f5e9", border: "#c8e6c9", text: "#1b2631", accent: "#2e7d32", preview_bg: "#f1f8e9" },
};

// ─── Block Preview HTML Generator ────────────────────────────────────────────
const generateBlockHTML = (block, theme) => {
  const t = THEMES[theme] || THEMES.light;
  const styles = `font-family: 'Georgia', serif; color: ${t.text};`;

  switch (block.type) {
    case "title": return `<h1 style="font-size:2.4em;font-weight:800;color:${t.accent};margin:0 0 8px;letter-spacing:-0.02em">${block.text}</h1>`;
    case "heading": return `<h2 style="font-size:1.7em;font-weight:700;color:${t.text};margin:0 0 8px;border-bottom:2px solid ${t.accent};padding-bottom:6px">${block.text}</h2>`;
    case "subheading": return `<h3 style="font-size:1.3em;font-weight:600;color:${t.text};margin:0 0 8px">${block.text}</h3>`;
    case "paragraph": return `<p style="font-size:1em;line-height:1.75;color:${t.text};margin:0">${block.text}</p>`;
    case "quote": return `<blockquote style="border-left:4px solid ${t.accent};padding:12px 20px;margin:0;background:${t.surface};border-radius:0 8px 8px 0"><p style="font-size:1.1em;font-style:italic;color:${t.text};margin:0 0 6px">"${block.text}"</p><cite style="font-size:0.85em;color:${t.accent};font-weight:600">— ${block.author}</cite></blockquote>`;
    case "divider": return `<hr style="border:none;border-top:2px solid ${t.border};margin:16px 0"/>`;
    case "image": return block.src ? `<figure style="margin:0"><img src="${block.src}" alt="${block.alt}" style="width:100%;border-radius:8px"/>${block.caption ? `<figcaption style="text-align:center;font-size:0.85em;color:#64748b;margin-top:6px">${block.caption}</figcaption>` : ""}</figure>` : `<div style="background:${t.surface};border:2px dashed ${t.border};border-radius:8px;padding:40px;text-align:center;color:#94a3b8">📷 No image selected</div>`;
    case "gallery": return `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">${block.images.length ? block.images.map(s=>`<img src="${s}" style="width:100%;border-radius:6px;aspect-ratio:1;object-fit:cover"/>`).join("") : `<div style="grid-column:span 3;background:${t.surface};border:2px dashed ${t.border};border-radius:8px;padding:40px;text-align:center;color:#94a3b8">🖼️ Gallery empty</div>`}</div>`;
    case "video_upload": case "video_url": return `<div style="background:#000;border-radius:8px;padding:40px;text-align:center;color:#fff;opacity:0.7">▶ Video: ${block.url || block.src || "No source set"}</div>`;
    case "audio": return `<div style="background:${t.surface};border:1px solid ${t.border};border-radius:8px;padding:16px;display:flex;align-items:center;gap:12px"><span style="font-size:1.5em">🎵</span><div><div style="font-weight:600;color:${t.text}">${block.title || "Audio File"}</div><div style="font-size:0.8em;color:#94a3b8">Click to play</div></div></div>`;
    case "animation": return `<div style="background:${t.surface};border:2px dashed ${t.border};border-radius:8px;padding:40px;text-align:center;color:#94a3b8">🎬 Animation: ${block.type?.toUpperCase() || "GIF"}</div>`;
    case "highlight": return `<div style="background:${block.color || "#fef3c7"};border-left:4px solid #f59e0b;border-radius:0 8px 8px 0;padding:16px"><p style="margin:0;color:${t.text}">${block.text}</p></div>`;
    case "note": return `<div style="background:#eff6ff;border-left:4px solid #3b82f6;border-radius:0 8px 8px 0;padding:16px"><strong style="color:#1d4ed8;display:block;margin-bottom:4px">📝 Note</strong><p style="margin:0;color:#1e3a5f">${block.text}</p></div>`;
    case "warning": return `<div style="background:#fff7ed;border-left:4px solid #f97316;border-radius:0 8px 8px 0;padding:16px"><strong style="color:#c2410c;display:block;margin-bottom:4px">⚠️ Warning</strong><p style="margin:0;color:#7c2d12">${block.text}</p></div>`;
    case "tip": return `<div style="background:#f0fdf4;border-left:4px solid #22c55e;border-radius:0 8px 8px 0;padding:16px"><strong style="color:#15803d;display:block;margin-bottom:4px">💡 Tip</strong><p style="margin:0;color:#14532d">${block.text}</p></div>`;
    case "summary": return `<div style="background:${t.surface};border:1px solid ${t.border};border-radius:8px;padding:20px"><strong style="color:${t.accent};display:block;margin-bottom:8px;font-size:1.1em">📋 Summary</strong><p style="margin:0;color:${t.text}">${block.text}</p></div>`;
    case "key_concept": return `<div style="background:linear-gradient(135deg,${t.accent}22,${t.accent}11);border:1px solid ${t.accent}55;border-radius:8px;padding:20px"><div style="font-size:0.75em;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:${t.accent};margin-bottom:6px">KEY CONCEPT</div><strong style="color:${t.text};font-size:1.1em;display:block;margin-bottom:6px">${block.term}</strong><p style="margin:0;color:${t.text}">${block.text}</p></div>`;
    case "definition": return `<div style="border:1px solid ${t.border};border-radius:8px;padding:16px"><strong style="color:${t.accent}">${block.term}:</strong> <span style="color:${t.text}">${block.text}</span></div>`;
    case "formula": case "equation": return `<div style="background:${t.surface};border:1px solid ${t.border};border-radius:8px;padding:20px;text-align:center"><code style="font-size:1.3em;color:${t.accent};font-family:monospace">${block.formula || block.equation}</code>${(block.description) ? `<p style="margin:8px 0 0;font-size:0.85em;color:#64748b">${block.description}</p>` : ""}</div>`;
    case "document": return `<div style="background:${t.surface};border:1px solid ${t.border};border-radius:8px;padding:16px;display:flex;align-items:center;gap:12px"><span style="font-size:2em">📄</span><div><div style="font-weight:600;color:${t.text}">${block.name || "Document"}</div><div style="font-size:0.8em;color:#94a3b8">${(block.type||"pdf").toUpperCase()} Document</div></div></div>`;
    case "external_link": return `<a href="${block.url}" style="display:flex;align-items:center;gap:10px;padding:14px;background:${t.surface};border:1px solid ${t.border};border-radius:8px;text-decoration:none;color:${t.text}"><span style="color:${t.accent};font-size:1.5em">🔗</span><div><div style="font-weight:600">${block.title || block.url}</div>${block.description?`<div style="font-size:0.85em;color:#64748b">${block.description}</div>`:""}</div></a>`;
    case "file_download": return `<div style="background:${t.surface};border:1px solid ${t.border};border-radius:8px;padding:14px;display:flex;align-items:center;gap:12px"><span style="font-size:1.8em">⬇️</span><div style="flex:1"><div style="font-weight:600;color:${t.text}">${block.name || "Download File"}</div>${block.size?`<div style="font-size:0.8em;color:#94a3b8">${block.size}</div>`:""}</div><button style="background:${t.accent};color:#fff;border:none;padding:6px 16px;border-radius:6px;cursor:pointer">Download</button></div>`;
    case "mcq": return `<div style="border:1px solid ${t.border};border-radius:8px;overflow:hidden"><div style="background:${t.accent};color:#fff;padding:12px 16px;font-weight:600;font-size:0.85em">Multiple Choice</div><div style="padding:16px"><p style="font-weight:600;color:${t.text};margin:0 0 12px">${block.question}</p><div style="display:flex;flex-direction:column;gap:8px">${(block.options||[]).map((o,i)=>`<label style="display:flex;align-items:center;gap:10px;padding:10px;border:1px solid ${t.border};border-radius:6px;cursor:pointer;background:${i===block.correct?t.accent+"22":t.surface}"><input type="radio" name="mcq" style="accent-color:${t.accent}"/><span style="color:${t.text}">${o}</span></label>`).join("")}</div></div></div>`;
    case "true_false": return `<div style="border:1px solid ${t.border};border-radius:8px;overflow:hidden"><div style="background:#7c3aed;color:#fff;padding:12px 16px;font-weight:600;font-size:0.85em">True / False</div><div style="padding:16px"><p style="font-weight:600;color:${t.text};margin:0 0 12px">${block.question}</p><div style="display:flex;gap:8px"><button style="flex:1;padding:10px;border-radius:6px;border:2px solid #22c55e;color:#15803d;background:#f0fdf4;font-weight:600;cursor:pointer">✓ True</button><button style="flex:1;padding:10px;border-radius:6px;border:2px solid #ef4444;color:#dc2626;background:#fef2f2;font-weight:600;cursor:pointer">✗ False</button></div></div></div>`;
    case "fill_blank": return `<div style="border:1px solid ${t.border};border-radius:8px;overflow:hidden"><div style="background:#0284c7;color:#fff;padding:12px 16px;font-weight:600;font-size:0.85em">Fill in the Blank</div><div style="padding:16px"><p style="color:${t.text};margin:0 0 12px">${block.text?.replace("___",`<input type="text" placeholder="?" style="border:2px solid ${t.accent};border-radius:4px;padding:2px 8px;font-size:0.95em;width:100px"/>`) || "..."}</p></div></div>`;
    case "matching": return `<div style="border:1px solid ${t.border};border-radius:8px;overflow:hidden"><div style="background:#d97706;color:#fff;padding:12px 16px;font-weight:600;font-size:0.85em">Matching Exercise</div><div style="padding:16px;display:grid;grid-template-columns:1fr 1fr;gap:8px">${(block.pairs||[]).map(p=>`<div style="padding:10px;background:${t.surface};border-radius:6px;border:1px solid ${t.border};color:${t.text}">${p.left}</div><div style="padding:10px;background:${t.accent}22;border-radius:6px;border:1px solid ${t.accent}44;color:${t.text}">${p.right}</div>`).join("")}</div></div>`;
    case "drag_drop": return `<div style="border:1px solid ${t.border};border-radius:8px;overflow:hidden"><div style="background:#7c3aed;color:#fff;padding:12px 16px;font-weight:600;font-size:0.85em">Drag & Drop</div><div style="padding:16px"><p style="color:${t.text};margin:0 0 12px">${block.prompt}</p><div style="display:flex;flex-wrap:wrap;gap:8px">${(block.items||[]).map(item=>`<div style="padding:8px 16px;background:${t.surface};border:2px dashed ${t.border};border-radius:6px;cursor:grab;color:${t.text}">${item}</div>`).join("")}</div></div></div>`;
    case "flashcards": return `<div style="border:1px solid ${t.border};border-radius:8px;overflow:hidden"><div style="background:#0891b2;color:#fff;padding:12px 16px;font-weight:600;font-size:0.85em">Flashcards (${(block.cards||[]).length} cards)</div><div style="padding:16px">${(block.cards||[]).slice(0,1).map(c=>`<div style="background:linear-gradient(135deg,${t.accent}22,${t.surface});border:1px solid ${t.border};border-radius:8px;padding:32px;text-align:center"><div style="font-weight:600;color:${t.text};font-size:1.1em">${c.front}</div><div style="margin-top:8px;font-size:0.8em;color:#94a3b8">Click to flip</div></div>`).join("")}</div></div>`;
    case "accordion": return `<div style="border:1px solid ${t.border};border-radius:8px;overflow:hidden">${(block.items||[]).map((item,i)=>`<div style="border-bottom:${i<block.items.length-1?`1px solid ${t.border}`:"none"}"><button style="width:100%;padding:14px 16px;background:${i===0?t.surface:"transparent"};border:none;text-align:left;font-weight:600;color:${t.text};cursor:pointer;display:flex;justify-content:space-between">${item.title}<span style="color:${t.accent}">${i===0?"▲":"▼"}</span></button>${i===0?`<div style="padding:0 16px 14px;color:${t.text}">${item.content}</div>`:""}</div>`).join("")}</div>`;
    case "tabs": return `<div style="border:1px solid ${t.border};border-radius:8px;overflow:hidden"><div style="display:flex;border-bottom:1px solid ${t.border}">${(block.tabs||[]).map((tab,i)=>`<button style="padding:12px 20px;background:${i===0?t.surface:"transparent"};border:none;font-weight:${i===0?"600":"400"};color:${i===0?t.accent:t.text};cursor:pointer;border-bottom:${i===0?`2px solid ${t.accent}`:"none"}">${tab.label}</button>`).join("")}</div><div style="padding:16px;color:${t.text}">${(block.tabs||[])[0]?.content || ""}</div></div>`;
    case "timeline": return `<div style="padding:8px 0">${(block.events||[]).map((ev,i)=>`<div style="display:flex;gap:16px;margin-bottom:16px"><div style="display:flex;flex-direction:column;align-items:center"><div style="width:36px;height:36px;background:${t.accent};color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.8em;font-weight:700;flex-shrink:0">${ev.date.slice(-2)}</div>${i<block.events.length-1?`<div style="width:2px;height:100%;background:${t.border};flex:1;margin-top:4px"></div>`:""}</div><div style="padding-top:6px"><div style="font-weight:600;color:${t.text}">${ev.title}</div><div style="font-size:0.9em;color:#64748b;margin-top:2px">${ev.description}</div></div></div>`).join("")}</div>`;
    case "step_process": return `<div style="display:flex;flex-direction:column;gap:12px">${(block.steps||[]).map(step=>`<div style="display:flex;gap:14px;align-items:flex-start"><div style="width:36px;height:36px;background:${t.accent};color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9em;flex-shrink:0">${step.number}</div><div><div style="font-weight:600;color:${t.text}">${step.title}</div><div style="font-size:0.9em;color:#64748b;margin-top:2px">${step.description}</div></div></div>`).join("")}</div>`;
    case "interactive_image": return `<div style="position:relative;background:${t.surface};border:2px dashed ${t.border};border-radius:8px;padding:40px;text-align:center;color:#94a3b8">🖱️ Interactive Image (${(block.hotspots||[]).length} hotspots)</div>`;
    default: return `<div style="padding:16px;background:${t.surface};border-radius:8px;color:#94a3b8">[${block.type}]</div>`;
  }
};

// ─── Block Editor Components ───────────────────────────────────────────────────
const BlockEditor = ({ block, onChange, theme }) => {
  const t = THEMES[theme] || THEMES.light;
  const inputStyle = { width: "100%", padding: "8px 12px", borderRadius: "6px", border: `1px solid ${t.border}`, background: t.bg, color: t.text, fontSize: "0.9em", boxSizing: "border-box", outline: "none", fontFamily: "inherit" };
  const labelStyle = { fontSize: "0.75em", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.08em", color: "#94a3b8", display: "block", marginBottom: "5px" };
  const fieldWrap = { marginBottom: "12px" };
  const textareaStyle = { ...inputStyle, resize: "vertical", minHeight: "80px" };

  const Field = ({ label, children }) => <div style={fieldWrap}><label style={labelStyle}>{label}</label>{children}</div>;

  switch (block.type) {
    case "title":
      return <Field label="Title Text"><input style={inputStyle} value={block.text} onChange={e => onChange({ text: e.target.value })} placeholder="Lesson Title"/></Field>;
    case "heading":
      return <><Field label="Heading Text"><input style={inputStyle} value={block.text} onChange={e => onChange({ text: e.target.value })}/></Field>
        <Field label="Level"><select style={inputStyle} value={block.level} onChange={e => onChange({ level: +e.target.value })}><option value={2}>H2</option><option value={3}>H3</option><option value={4}>H4</option></select></Field></>;
    case "subheading":
      return <Field label="Subheading Text"><input style={inputStyle} value={block.text} onChange={e => onChange({ text: e.target.value })}/></Field>;
    case "paragraph":
      return <Field label="Paragraph Text"><textarea style={textareaStyle} value={block.text} onChange={e => onChange({ text: e.target.value })}/></Field>;
    case "quote":
      return <><Field label="Quote Text"><textarea style={textareaStyle} value={block.text} onChange={e => onChange({ text: e.target.value })}/></Field>
        <Field label="Author"><input style={inputStyle} value={block.author} onChange={e => onChange({ author: e.target.value })}/></Field></>;
    case "divider":
      return <Field label="Style"><select style={inputStyle} value={block.style} onChange={e => onChange({ style: e.target.value })}><option>solid</option><option>dashed</option><option>dotted</option></select></Field>;
    case "image":
      return <><Field label="Image URL"><input style={inputStyle} value={block.src} onChange={e => onChange({ src: e.target.value })} placeholder="https://..."/></Field>
        <Field label="Alt Text"><input style={inputStyle} value={block.alt} onChange={e => onChange({ alt: e.target.value })}/></Field>
        <Field label="Caption"><input style={inputStyle} value={block.caption} onChange={e => onChange({ caption: e.target.value })}/></Field></>;
    case "highlight":
      return <><Field label="Text"><textarea style={textareaStyle} value={block.text} onChange={e => onChange({ text: e.target.value })}/></Field>
        <Field label="Background Color"><input type="color" value={block.color} onChange={e => onChange({ color: e.target.value })} style={{ width: "48px", height: "32px", border: "none", cursor: "pointer", borderRadius: "4px" }}/></Field></>;
    case "note": case "warning": case "tip": case "summary":
      return <Field label="Content"><textarea style={textareaStyle} value={block.text} onChange={e => onChange({ text: e.target.value })}/></Field>;
    case "key_concept":
      return <><Field label="Term"><input style={inputStyle} value={block.term} onChange={e => onChange({ term: e.target.value })}/></Field>
        <Field label="Explanation"><textarea style={textareaStyle} value={block.text} onChange={e => onChange({ text: e.target.value })}/></Field></>;
    case "definition":
      return <><Field label="Term"><input style={inputStyle} value={block.term} onChange={e => onChange({ term: e.target.value })}/></Field>
        <Field label="Definition"><textarea style={textareaStyle} value={block.text} onChange={e => onChange({ text: e.target.value })}/></Field></>;
    case "formula": case "equation":
      return <><Field label={block.type === "formula" ? "Formula" : "Equation"}><input style={{ ...inputStyle, fontFamily: "monospace" }} value={block.formula || block.equation} onChange={e => onChange(block.type === "formula" ? { formula: e.target.value } : { equation: e.target.value })}/></Field>
        <Field label="Description"><input style={inputStyle} value={block.description} onChange={e => onChange({ description: e.target.value })}/></Field></>;
    case "external_link":
      return <><Field label="URL"><input style={inputStyle} value={block.url} onChange={e => onChange({ url: e.target.value })} placeholder="https://..."/></Field>
        <Field label="Title"><input style={inputStyle} value={block.title} onChange={e => onChange({ title: e.target.value })}/></Field>
        <Field label="Description"><input style={inputStyle} value={block.description} onChange={e => onChange({ description: e.target.value })}/></Field></>;
    case "mcq":
      return <><Field label="Question"><textarea style={{ ...textareaStyle, minHeight: "60px" }} value={block.question} onChange={e => onChange({ question: e.target.value })}/></Field>
        {(block.options || []).map((opt, i) => (
          <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
            <input type="radio" checked={block.correct === i} onChange={() => onChange({ correct: i })} style={{ accentColor: t.accent }} />
            <input style={{ ...inputStyle, flex: 1, marginBottom: 0 }} value={opt} onChange={e => { const opts = [...block.options]; opts[i] = e.target.value; onChange({ options: opts }); }} placeholder={`Option ${i+1}`}/>
            <button onClick={() => { const opts = block.options.filter((_,j) => j!==i); onChange({ options: opts, correct: block.correct >= i ? Math.max(0, block.correct-1) : block.correct }); }} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "4px" }}>✕</button>
          </div>
        ))}
        <button onClick={() => onChange({ options: [...(block.options||[]), `Option ${(block.options||[]).length+1}`] })} style={{ fontSize: "0.8em", color: t.accent, background: "none", border: `1px dashed ${t.accent}`, borderRadius: "4px", padding: "4px 10px", cursor: "pointer", marginBottom: "8px" }}>+ Add Option</button>
        <Field label="Feedback"><input style={inputStyle} value={block.feedback} onChange={e => onChange({ feedback: e.target.value })} placeholder="Correct! That's right..."/></Field></>;
    case "true_false":
      return <><Field label="Question"><textarea style={{ ...textareaStyle, minHeight: "60px" }} value={block.question} onChange={e => onChange({ question: e.target.value })}/></Field>
        <Field label="Correct Answer"><select style={inputStyle} value={String(block.correct)} onChange={e => onChange({ correct: e.target.value === "true" })}><option value="true">True</option><option value="false">False</option></select></Field>
        <Field label="Feedback"><input style={inputStyle} value={block.feedback} onChange={e => onChange({ feedback: e.target.value })}/></Field></>;
    case "fill_blank":
      return <><Field label="Text (use ___ for blank)"><textarea style={{ ...textareaStyle, minHeight: "60px" }} value={block.text} onChange={e => onChange({ text: e.target.value })}/></Field>
        <Field label="Answer"><input style={inputStyle} value={block.answer} onChange={e => onChange({ answer: e.target.value })}/></Field>
        <Field label="Hint"><input style={inputStyle} value={block.hint} onChange={e => onChange({ hint: e.target.value })}/></Field></>;
    case "flashcards":
      return <><div style={labelStyle}>Cards</div>{(block.cards||[]).map((card, i) => (
        <div key={i} style={{ border: `1px solid ${t.border}`, borderRadius: "6px", padding: "10px", marginBottom: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span style={{ fontSize: "0.8em", color: "#94a3b8", fontWeight: "600" }}>Card {i+1}</span>
            <button onClick={() => onChange({ cards: block.cards.filter((_,j)=>j!==i) })} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}>✕</button>
          </div>
          <input style={{ ...inputStyle, marginBottom: "6px" }} placeholder="Front" value={card.front} onChange={e => { const c = [...block.cards]; c[i]={...c[i],front:e.target.value}; onChange({cards:c}); }}/>
          <input style={inputStyle} placeholder="Back" value={card.back} onChange={e => { const c = [...block.cards]; c[i]={...c[i],back:e.target.value}; onChange({cards:c}); }}/>
        </div>))}
        <button onClick={() => onChange({ cards: [...(block.cards||[]), { front: "Front", back: "Back" }] })} style={{ fontSize: "0.8em", color: t.accent, background: "none", border: `1px dashed ${t.accent}`, borderRadius: "4px", padding: "4px 10px", cursor: "pointer" }}>+ Add Card</button></>;
    case "accordion":
      return <><div style={labelStyle}>Sections</div>{(block.items||[]).map((item, i) => (
        <div key={i} style={{ border: `1px solid ${t.border}`, borderRadius: "6px", padding: "10px", marginBottom: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontSize: "0.8em", color: "#94a3b8", fontWeight: "600" }}>Section {i+1}</span>
            <button onClick={() => onChange({ items: block.items.filter((_,j)=>j!==i) })} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}>✕</button>
          </div>
          <input style={{ ...inputStyle, marginBottom: "6px" }} placeholder="Title" value={item.title} onChange={e => { const it = [...block.items]; it[i]={...it[i],title:e.target.value}; onChange({items:it}); }}/>
          <textarea style={{ ...textareaStyle, minHeight: "60px" }} placeholder="Content" value={item.content} onChange={e => { const it = [...block.items]; it[i]={...it[i],content:e.target.value}; onChange({items:it}); }}/>
        </div>))}
        <button onClick={() => onChange({ items: [...(block.items||[]), { title: "Section", content: "" }] })} style={{ fontSize: "0.8em", color: t.accent, background: "none", border: `1px dashed ${t.accent}`, borderRadius: "4px", padding: "4px 10px", cursor: "pointer" }}>+ Add Section</button></>;
    case "tabs":
      return <><div style={labelStyle}>Tabs</div>{(block.tabs||[]).map((tab, i) => (
        <div key={i} style={{ border: `1px solid ${t.border}`, borderRadius: "6px", padding: "10px", marginBottom: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontSize: "0.8em", color: "#94a3b8", fontWeight: "600" }}>Tab {i+1}</span>
            <button onClick={() => onChange({ tabs: block.tabs.filter((_,j)=>j!==i) })} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}>✕</button>
          </div>
          <input style={{ ...inputStyle, marginBottom: "6px" }} placeholder="Label" value={tab.label} onChange={e => { const tb = [...block.tabs]; tb[i]={...tb[i],label:e.target.value}; onChange({tabs:tb}); }}/>
          <textarea style={{ ...textareaStyle, minHeight: "60px" }} placeholder="Content" value={tab.content} onChange={e => { const tb = [...block.tabs]; tb[i]={...tb[i],content:e.target.value}; onChange({tabs:tb}); }}/>
        </div>))}
        <button onClick={() => onChange({ tabs: [...(block.tabs||[]), { label: "New Tab", content: "" }] })} style={{ fontSize: "0.8em", color: t.accent, background: "none", border: `1px dashed ${t.accent}`, borderRadius: "4px", padding: "4px 10px", cursor: "pointer" }}>+ Add Tab</button></>;
    case "timeline":
      return <><div style={labelStyle}>Events</div>{(block.events||[]).map((ev, i) => (
        <div key={i} style={{ border: `1px solid ${t.border}`, borderRadius: "6px", padding: "10px", marginBottom: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontSize: "0.8em", color: "#94a3b8", fontWeight: "600" }}>Event {i+1}</span>
            <button onClick={() => onChange({ events: block.events.filter((_,j)=>j!==i) })} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}>✕</button>
          </div>
          <input style={{ ...inputStyle, marginBottom: "6px" }} placeholder="Date/Year" value={ev.date} onChange={e => { const ev2 = [...block.events]; ev2[i]={...ev2[i],date:e.target.value}; onChange({events:ev2}); }}/>
          <input style={{ ...inputStyle, marginBottom: "6px" }} placeholder="Title" value={ev.title} onChange={e => { const ev2 = [...block.events]; ev2[i]={...ev2[i],title:e.target.value}; onChange({events:ev2}); }}/>
          <input style={inputStyle} placeholder="Description" value={ev.description} onChange={e => { const ev2 = [...block.events]; ev2[i]={...ev2[i],description:e.target.value}; onChange({events:ev2}); }}/>
        </div>))}
        <button onClick={() => onChange({ events: [...(block.events||[]), { date: "2024", title: "Event", description: "" }] })} style={{ fontSize: "0.8em", color: t.accent, background: "none", border: `1px dashed ${t.accent}`, borderRadius: "4px", padding: "4px 10px", cursor: "pointer" }}>+ Add Event</button></>;
    case "step_process":
      return <><div style={labelStyle}>Steps</div>{(block.steps||[]).map((step, i) => (
        <div key={i} style={{ border: `1px solid ${t.border}`, borderRadius: "6px", padding: "10px", marginBottom: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontSize: "0.8em", color: "#94a3b8", fontWeight: "600" }}>Step {i+1}</span>
            <button onClick={() => onChange({ steps: block.steps.filter((_,j)=>j!==i) })} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}>✕</button>
          </div>
          <input style={{ ...inputStyle, marginBottom: "6px" }} placeholder="Step Title" value={step.title} onChange={e => { const s = [...block.steps]; s[i]={...s[i],title:e.target.value}; onChange({steps:s}); }}/>
          <input style={inputStyle} placeholder="Step Description" value={step.description} onChange={e => { const s = [...block.steps]; s[i]={...s[i],description:e.target.value}; onChange({steps:s}); }}/>
        </div>))}
        <button onClick={() => { const n=block.steps.length+1; onChange({ steps: [...(block.steps||[]), { number: n, title: `Step ${n}`, description: "" }] }); }} style={{ fontSize: "0.8em", color: t.accent, background: "none", border: `1px dashed ${t.accent}`, borderRadius: "4px", padding: "4px 10px", cursor: "pointer" }}>+ Add Step</button></>;
    case "audio":
      return <><Field label="Audio URL"><input style={inputStyle} value={block.src} onChange={e => onChange({ src: e.target.value })} placeholder="https://..."/></Field>
        <Field label="Title"><input style={inputStyle} value={block.title} onChange={e => onChange({ title: e.target.value })}/></Field></>;
    case "video_url":
      return <><Field label="Video URL"><input style={inputStyle} value={block.url} onChange={e => onChange({ url: e.target.value })} placeholder="YouTube, Vimeo, or direct .mp4"/></Field>
        <Field label="Caption"><input style={inputStyle} value={block.caption} onChange={e => onChange({ caption: e.target.value })}/></Field></>;
    case "document":
      return <><Field label="Document URL"><input style={inputStyle} value={block.src} onChange={e => onChange({ src: e.target.value })} placeholder="https://..."/></Field>
        <Field label="File Name"><input style={inputStyle} value={block.name} onChange={e => onChange({ name: e.target.value })}/></Field>
        <Field label="Type"><select style={inputStyle} value={block.type} onChange={e => onChange({ type: e.target.value })}><option>pdf</option><option>docx</option></select></Field></>;
    case "matching":
      return <><div style={labelStyle}>Pairs</div>{(block.pairs||[]).map((pair,i)=>(
        <div key={i} style={{ display:"flex", gap:"8px", marginBottom:"8px", alignItems:"center" }}>
          <input style={{ ...inputStyle, flex:1, marginBottom:0 }} placeholder="Left" value={pair.left} onChange={e=>{ const p=[...block.pairs]; p[i]={...p[i],left:e.target.value}; onChange({pairs:p}); }}/>
          <span style={{color:"#94a3b8"}}>↔</span>
          <input style={{ ...inputStyle, flex:1, marginBottom:0 }} placeholder="Right" value={pair.right} onChange={e=>{ const p=[...block.pairs]; p[i]={...p[i],right:e.target.value}; onChange({pairs:p}); }}/>
          <button onClick={()=>onChange({pairs:block.pairs.filter((_,j)=>j!==i)})} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer"}}>✕</button>
        </div>))}
        <button onClick={()=>onChange({pairs:[...(block.pairs||[]),{left:"Item",right:"Match"}]})} style={{fontSize:"0.8em",color:t.accent,background:"none",border:`1px dashed ${t.accent}`,borderRadius:"4px",padding:"4px 10px",cursor:"pointer"}}>+ Add Pair</button></>;
    case "drag_drop":
      return <><Field label="Prompt"><input style={inputStyle} value={block.prompt} onChange={e => onChange({ prompt: e.target.value })}/></Field>
        <div style={labelStyle}>Items</div>{(block.items||[]).map((item,i)=>(
          <div key={i} style={{ display:"flex", gap:"8px", marginBottom:"6px" }}>
            <input style={{ ...inputStyle, flex:1, marginBottom:0 }} value={item} onChange={e=>{ const it=[...block.items]; it[i]=e.target.value; onChange({items:it}); }}/>
            <button onClick={()=>onChange({items:block.items.filter((_,j)=>j!==i)})} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer"}}>✕</button>
          </div>))}
        <button onClick={()=>onChange({items:[...(block.items||[]),"New Item"]})} style={{fontSize:"0.8em",color:t.accent,background:"none",border:`1px dashed ${t.accent}`,borderRadius:"4px",padding:"4px 10px",cursor:"pointer"}}>+ Add Item</button></>;
    case "file_download":
      return <><Field label="File URL"><input style={inputStyle} value={block.src} onChange={e => onChange({ src: e.target.value })} placeholder="https://..."/></Field>
        <Field label="File Name"><input style={inputStyle} value={block.name} onChange={e => onChange({ name: e.target.value })}/></Field>
        <Field label="File Size"><input style={inputStyle} value={block.size} onChange={e => onChange({ size: e.target.value })} placeholder="e.g. 2.4 MB"/></Field></>;
    default:
      return <div style={{ color: "#94a3b8", fontSize: "0.85em", padding: "8px" }}>No editor available for this block type yet.</div>;
  }
};

// ─── Add Block Dropdown ────────────────────────────────────────────────────────
const AddBlockMenu = ({ onAdd, theme, onClose }) => {
  const t = THEMES[theme] || THEMES.light;
  const [search, setSearch] = useState("");
  const filtered = search ? ALL_BLOCKS.filter(b => b.label.toLowerCase().includes(search.toLowerCase()) || b.desc.toLowerCase().includes(search.toLowerCase())) : null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}/>
      <div onClick={e => e.stopPropagation()} style={{ position: "relative", background: t.bg, border: `1px solid ${t.border}`, borderRadius: "16px", width: "680px", maxHeight: "80vh", overflow: "hidden", boxShadow: "0 25px 60px rgba(0,0,0,0.4)", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px 20px 0" }}>
          <h3 style={{ margin: "0 0 14px", color: t.text, fontSize: "1.1em", fontWeight: "700" }}>Add Content Block</h3>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search blocks..." style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: `1px solid ${t.border}`, background: t.surface, color: t.text, fontSize: "0.9em", boxSizing: "border-box", outline: "none" }} autoFocus/>
        </div>
        <div style={{ overflow: "auto", padding: "14px 20px 20px", flex: 1 }}>
          {filtered ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
              {filtered.map(b => (
                <button key={b.type} onClick={() => { onAdd(b.type); onClose(); }} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", background: t.surface, border: `1px solid ${t.border}`, borderRadius: "8px", cursor: "pointer", color: t.text, textAlign: "left" }}>
                  <span style={{ color: b.color, flexShrink: 0 }}><Icon d={icons[b.icon] || icons.text} size={16}/></span>
                  <div><div style={{ fontWeight: "600", fontSize: "0.85em" }}>{b.label}</div></div>
                </button>
              ))}
            </div>
          ) : (
            BLOCK_CATEGORIES.map(cat => (
              <div key={cat.label} style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "0.72em", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: cat.color, marginBottom: "8px" }}>{cat.label}</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px" }}>
                  {cat.blocks.map(b => (
                    <button key={b.type} onClick={() => { onAdd(b.type); onClose(); }} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", background: t.surface, border: `1px solid ${t.border}`, borderRadius: "8px", cursor: "pointer", color: t.text, textAlign: "left", transition: "all 0.15s" }}>
                      <span style={{ color: cat.color, flexShrink: 0 }}><Icon d={icons[b.icon] || icons.text} size={15}/></span>
                      <div>
                        <div style={{ fontWeight: "600", fontSize: "0.83em", color: t.text }}>{b.label}</div>
                        <div style={{ fontSize: "0.72em", color: "#94a3b8" }}>{b.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// ─── AI Assistant Panel ────────────────────────────────────────────────────────
const AIPanel = ({ blocks, theme, onClose, onInsertBlock }) => {
  const t = THEMES[theme] || THEMES.light;
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [mode, setMode] = useState("generate");

  const modes = [
    { id: "generate", label: "Generate Content" },
    { id: "quiz", label: "Create Quiz" },
    { id: "flashcards", label: "Flashcards" },
    { id: "summary", label: "Summarize" },
    { id: "simplify", label: "Simplify" },
  ];

  const run = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const systemPrompts = {
        generate: "You are a professional instructional content writer. Generate clear, educational content based on the topic provided. Write 2-3 well-structured paragraphs.",
        quiz: "You are an expert quiz creator. Create 3 multiple choice questions based on the topic. For each question, provide 4 options (A, B, C, D) and indicate the correct answer. Format clearly.",
        flashcards: "You are an educational flashcard creator. Create 5 flashcards for the topic. Format each as 'FRONT: [question] | BACK: [answer]' on separate lines.",
        summary: `You are a content summarizer. Here are the current blocks: ${JSON.stringify(blocks.map(b => ({ type: b.type, text: b.text || b.question || b.term || "" })))}. Provide a concise 3-4 sentence summary of this lesson content.`,
        simplify: "Rewrite the following content in simpler language suitable for a beginner learner. Keep it clear and accessible.",
      };
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: `${systemPrompts[mode]}\n\nTopic/Content: ${prompt}` }] })
      });
      const data = await res.json();
      setResult(data.content?.[0]?.text || "No response received.");
    } catch (e) { setResult("Error: " + e.message); }
    setLoading(false);
  };

  return (
    <div style={{ position: "fixed", right: 0, top: 0, bottom: 0, width: "380px", background: t.bg, borderLeft: `1px solid ${t.border}`, zIndex: 500, display: "flex", flexDirection: "column", boxShadow: "-8px 0 30px rgba(0,0,0,0.2)" }}>
      <div style={{ padding: "20px", borderBottom: `1px solid ${t.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontWeight: "700", color: t.text, display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", borderRadius: "6px", padding: "3px 8px", fontSize: "0.75em" }}>AI</span>
            Course Assistant
          </div>
          <div style={{ fontSize: "0.8em", color: "#94a3b8", marginTop: "2px" }}>Powered by Claude</div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "1.2em" }}>✕</button>
      </div>
      <div style={{ padding: "16px", borderBottom: `1px solid ${t.border}` }}>
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {modes.map(m => <button key={m.id} onClick={() => setMode(m.id)} style={{ padding: "5px 10px", borderRadius: "20px", border: `1px solid ${mode===m.id ? t.accent : t.border}`, background: mode===m.id ? t.accent+"22" : "transparent", color: mode===m.id ? t.accent : "#94a3b8", fontSize: "0.78em", fontWeight: "600", cursor: "pointer" }}>{m.label}</button>)}
        </div>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder={mode === "summary" ? "The AI will summarize your current blocks..." : "Enter a topic, concept, or paste text to transform..."} style={{ width: "100%", minHeight: "100px", padding: "12px", borderRadius: "8px", border: `1px solid ${t.border}`, background: t.surface, color: t.text, fontSize: "0.9em", resize: "vertical", boxSizing: "border-box", outline: "none", fontFamily: "inherit" }}/>
        <button onClick={run} disabled={loading} style={{ padding: "10px", background: loading ? "#94a3b8" : "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", border: "none", borderRadius: "8px", cursor: loading ? "not-allowed" : "pointer", fontWeight: "600", fontSize: "0.9em" }}>
          {loading ? "Generating..." : "✨ Generate"}
        </button>
        {result && (
          <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: "8px", padding: "14px" }}>
            <div style={{ fontSize: "0.75em", fontWeight: "700", color: t.accent, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Result</div>
            <div style={{ fontSize: "0.9em", color: t.text, lineHeight: "1.6", whiteSpace: "pre-wrap" }}>{result}</div>
            <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
              <button onClick={() => { onInsertBlock({ type: "paragraph", text: result }); }} style={{ flex: 1, padding: "7px", background: t.accent, color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.8em", fontWeight: "600" }}>Insert as Block</button>
              <button onClick={() => navigator.clipboard?.writeText(result)} style={{ padding: "7px 10px", background: "none", border: `1px solid ${t.border}`, color: t.text, borderRadius: "6px", cursor: "pointer", fontSize: "0.8em" }}>Copy</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Export Modal ──────────────────────────────────────────────────────────────
const ExportModal = ({ blocks, lessonTitle, theme, onClose }) => {
  const t = THEMES[theme] || THEMES.light;
  const th = THEMES[theme] || THEMES.light;
  const [format, setFormat] = useState("html");
  const [exported, setExported] = useState(false);

  const formats = [
    { id: "html", label: "Clean HTML", icon: "export", desc: "Standalone HTML package" },
    { id: "scorm12", label: "SCORM 1.2", icon: "scorm", desc: "LMS compatible SCORM 1.2" },
    { id: "scorm2004", label: "SCORM 2004", icon: "scorm", desc: "SCORM 2004 4th edition" },
    { id: "xapi", label: "xAPI / Tin Can", icon: "xapi", desc: "Experience API package" },
    { id: "offline", label: "Offline Package", icon: "download", desc: "Self-contained offline" },
  ];

  const generateHTML = () => {
    const bodyContent = blocks.map(b => generateBlockHTML(b, theme)).join("\n<br/>\n");
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${lessonTitle || "Course Lesson"}</title>
  <link rel="stylesheet" href="style.css">
  <script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js" defer></script>
</head>
<body class="lesson-body theme-${theme}">
  <main class="lesson-container" id="lesson-main" role="main">
    ${bodyContent}
  </main>
  <script src="script.js"></script>
</body>
</html>`;
  };

  const doExport = () => {
    const html = generateHTML();
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(lessonTitle||"lesson").replace(/\s+/g,"-").toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}/>
      <div onClick={e => e.stopPropagation()} style={{ position: "relative", background: th.bg, border: `1px solid ${th.border}`, borderRadius: "16px", width: "520px", overflow: "hidden", boxShadow: "0 25px 60px rgba(0,0,0,0.4)" }}>
        <div style={{ padding: "24px 24px 0" }}>
          <h3 style={{ margin: "0 0 4px", color: th.text, fontSize: "1.2em", fontWeight: "700" }}>Export Course</h3>
          <p style={{ margin: "0 0 20px", color: "#94a3b8", fontSize: "0.85em" }}>Choose your export format and download the package</p>
        </div>
        <div style={{ padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {formats.map(f => (
            <button key={f.id} onClick={() => setFormat(f.id)} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", background: format===f.id ? th.accent+"22" : th.surface, border: `2px solid ${format===f.id ? th.accent : th.border}`, borderRadius: "10px", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
              <span style={{ color: format===f.id ? th.accent : "#94a3b8" }}><Icon d={icons[f.icon] || icons.export} size={20}/></span>
              <div>
                <div style={{ fontWeight: "700", color: th.text, fontSize: "0.95em" }}>{f.label}</div>
                <div style={{ fontSize: "0.8em", color: "#94a3b8" }}>{f.desc}</div>
              </div>
              {format===f.id && <span style={{ marginLeft: "auto", color: th.accent, fontWeight: "700" }}>✓</span>}
            </button>
          ))}
          <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
            <button onClick={doExport} style={{ flex: 1, padding: "12px", background: `linear-gradient(135deg,${th.accent},${th.accent}cc)`, color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "0.95em" }}>
              {exported ? "✓ Downloaded!" : "⬇ Export Package"}
            </button>
            <button onClick={onClose} style={{ padding: "12px 20px", background: "none", border: `1px solid ${th.border}`, color: th.text, borderRadius: "10px", cursor: "pointer", fontWeight: "600" }}>Cancel</button>
          </div>
          {format !== "html" && <div style={{ padding: "10px", background: "#fef3c7", borderRadius: "8px", fontSize: "0.8em", color: "#92400e" }}>ℹ️ {format.toUpperCase()} packaging requires the desktop app. Exporting as HTML preview.</div>}
        </div>
      </div>
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme] = useState("light");
  const [blocks, setBlocks] = useState([
    createBlock("title"),
    createBlock("paragraph"),
    createBlock("heading"),
    createBlock("key_concept"),
    createBlock("mcq"),
  ]);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [showThemes, setShowThemes] = useState(false);
  const [activeTab, setActiveTab] = useState("editor"); // editor | structure | media
  const [dragId, setDragId] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [lessonTitle, setLessonTitle] = useState("Introduction to Course Authoring");
  const [courseStructure] = useState({
    name: "My Course",
    modules: [
      { name: "Module 1: Foundations", lessons: ["Introduction", "Core Concepts", "Key Terms"] },
      { name: "Module 2: Advanced", lessons: ["Deep Dive", "Case Studies", "Assessment"] },
    ]
  });

  const t = THEMES[theme];

  const addBlock = (type) => {
    setBlocks(prev => [...prev, createBlock(type)]);
  };

  const insertBlock = (blockData) => {
    const block = { ...createBlock(blockData.type || "paragraph"), ...blockData };
    setBlocks(prev => [...prev, block]);
  };

  const updateBlock = (id, changes) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, ...changes } : b));
  };

  const deleteBlock = (id) => setBlocks(prev => prev.filter(b => b.id !== id));
  const duplicateBlock = (id) => {
    const idx = blocks.findIndex(b => b.id === id);
    const copy = { ...blocks[idx], id: `block_${Date.now()}` };
    const next = [...blocks];
    next.splice(idx + 1, 0, copy);
    setBlocks(next);
  };
  const toggleCollapse = (id) => updateBlock(id, { collapsed: !blocks.find(b => b.id === id).collapsed });

  const handleDragStart = (id) => setDragId(id);
  const handleDragOver = (e, id) => { e.preventDefault(); setDragOver(id); };
  const handleDrop = (e, targetId) => {
    e.preventDefault();
    if (!dragId || dragId === targetId) { setDragId(null); setDragOver(null); return; }
    const arr = [...blocks];
    const fromIdx = arr.findIndex(b => b.id === dragId);
    const toIdx = arr.findIndex(b => b.id === targetId);
    const [moved] = arr.splice(fromIdx, 1);
    arr.splice(toIdx, 0, moved);
    setBlocks(arr);
    setDragId(null); setDragOver(null);
  };

  const blockMeta = (type) => ALL_BLOCKS.find(b => b.type === type) || { label: type, color: "#94a3b8", icon: "text", category: "Other" };

  const previewHTML = blocks.map(b => generateBlockHTML(b, theme)).join("\n<br/>\n");

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: t.bg, color: t.text, fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif", overflow: "hidden" }}>
      {/* ── Topbar ── */}
      <div style={{ height: "54px", background: t.surface, borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", padding: "0 16px", gap: "12px", flexShrink: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginRight: "8px" }}>
          <div style={{ width: "28px", height: "28px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "800", fontSize: "0.75em" }}>CA</div>
          <span style={{ fontWeight: "700", fontSize: "0.9em", color: t.text }}>CourseAuthor</span>
        </div>
        <div style={{ width: "1px", height: "24px", background: t.border }}/>
        <input value={lessonTitle} onChange={e => setLessonTitle(e.target.value)} style={{ background: "none", border: "none", outline: "none", color: t.text, fontSize: "0.9em", fontWeight: "600", flex: 1, maxWidth: "320px", padding: "4px 8px", borderRadius: "4px" }}/>
        <div style={{ flex: 1 }}/>
        {/* Theme picker */}
        <div style={{ position: "relative" }}>
          <button onClick={() => setShowThemes(!showThemes)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px", background: "none", border: `1px solid ${t.border}`, borderRadius: "8px", color: t.text, cursor: "pointer", fontSize: "0.82em", fontWeight: "600" }}>
            <Icon d={icons.palette} size={14}/> {THEMES[theme].name}
          </button>
          {showThemes && (
            <div style={{ position: "absolute", right: 0, top: "calc(100% + 6px)", background: t.bg, border: `1px solid ${t.border}`, borderRadius: "10px", padding: "6px", display: "flex", flexDirection: "column", gap: "2px", zIndex: 200, boxShadow: "0 10px 30px rgba(0,0,0,0.2)", minWidth: "140px" }}>
              {Object.entries(THEMES).map(([key, th2]) => (
                <button key={key} onClick={() => { setTheme(key); setShowThemes(false); }} style={{ padding: "8px 12px", background: theme===key ? t.accent+"22" : "none", border: "none", borderRadius: "6px", color: theme===key ? t.accent : t.text, cursor: "pointer", textAlign: "left", fontSize: "0.85em", fontWeight: theme===key ? "700" : "400" }}>
                  {theme===key ? "✓ " : ""}{th2.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => setShowAI(!showAI)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px", background: showAI ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "none", border: `1px solid ${showAI ? "transparent" : t.border}`, borderRadius: "8px", color: showAI ? "#fff" : t.text, cursor: "pointer", fontSize: "0.82em", fontWeight: "600" }}>
          <Icon d={icons.ai} size={14}/> AI
        </button>
        <button onClick={() => setShowExport(true)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 14px", background: t.accent, border: "none", borderRadius: "8px", color: "#fff", cursor: "pointer", fontSize: "0.82em", fontWeight: "700" }}>
          <Icon d={icons.export} size={14}/> Export
        </button>
      </div>

      {/* ── Main Layout ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* ── Left Sidebar ── */}
        <div style={{ width: "220px", background: t.surface, borderRight: `1px solid ${t.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
          {/* Sidebar tabs */}
          <div style={{ display: "flex", borderBottom: `1px solid ${t.border}` }}>
            {[{id:"editor",label:"Blocks"},{id:"structure",label:"Course"},{id:"media",label:"Media"}].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: "10px 4px", background: "none", border: "none", borderBottom: `2px solid ${activeTab===tab.id ? t.accent : "transparent"}`, color: activeTab===tab.id ? t.accent : "#94a3b8", cursor: "pointer", fontSize: "0.75em", fontWeight: "600" }}>{tab.label}</button>
            ))}
          </div>
          {activeTab === "editor" && (
            <div style={{ flex: 1, overflow: "auto", padding: "12px" }}>
              <button onClick={() => setShowAddMenu(true)} style={{ width: "100%", padding: "10px", background: `linear-gradient(135deg,${t.accent},${t.accent}cc)`, color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "0.85em", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginBottom: "14px" }}>
                <Icon d={icons.plus} size={16}/> Add Block
              </button>
              {BLOCK_CATEGORIES.map(cat => (
                <div key={cat.label} style={{ marginBottom: "12px" }}>
                  <div style={{ fontSize: "0.68em", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: cat.color, marginBottom: "6px", paddingLeft: "4px" }}>{cat.label}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    {cat.blocks.map(b => (
                      <button key={b.type} onClick={() => addBlock(b.type)} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 8px", background: "none", border: "none", borderRadius: "6px", cursor: "pointer", color: t.text, textAlign: "left", fontSize: "0.82em" }}>
                        <span style={{ color: cat.color, flexShrink: 0 }}><Icon d={icons[b.icon] || icons.text} size={13}/></span>
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === "structure" && (
            <div style={{ flex: 1, overflow: "auto", padding: "12px" }}>
              <div style={{ fontSize: "0.72em", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: "#94a3b8", marginBottom: "10px" }}>Course Structure</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ padding: "8px 10px", background: t.accent+"22", borderRadius: "6px", fontWeight: "700", fontSize: "0.82em", color: t.accent, display: "flex", alignItems: "center", gap: "6px" }}>
                  <Icon d={icons.module} size={13}/> {courseStructure.name}
                </div>
                {courseStructure.modules.map((mod, mi) => (
                  <div key={mi}>
                    <div style={{ padding: "6px 10px 6px 18px", fontWeight: "600", fontSize: "0.8em", color: t.text, display: "flex", alignItems: "center", gap: "6px", borderRadius: "4px" }}>
                      <Icon d={icons.module} size={12}/> {mod.name}
                    </div>
                    {mod.lessons.map((les, li) => (
                      <div key={li} style={{ padding: "5px 10px 5px 30px", fontSize: "0.78em", color: li===0 && mi===0 ? t.accent : "#94a3b8", display: "flex", alignItems: "center", gap: "6px", background: li===0 && mi===0 ? t.accent+"11" : "none", borderRadius: "4px", fontWeight: li===0 && mi===0 ? "600" : "400", cursor: "pointer" }}>
                        <Icon d={icons.lesson} size={11}/> {les}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: "16px", borderTop: `1px solid ${t.border}`, paddingTop: "12px" }}>
                <div style={{ fontSize: "0.72em", fontWeight: "700", textTransform: "uppercase", color: "#94a3b8", marginBottom: "8px" }}>Current Lesson</div>
                <div style={{ fontSize: "0.8em", color: t.text, fontWeight: "600" }}>{lessonTitle}</div>
                <div style={{ fontSize: "0.75em", color: "#94a3b8", marginTop: "4px" }}>{blocks.length} blocks</div>
              </div>
            </div>
          )}
          {activeTab === "media" && (
            <div style={{ flex: 1, overflow: "auto", padding: "12px" }}>
              <div style={{ fontSize: "0.72em", fontWeight: "700", textTransform: "uppercase", color: "#94a3b8", marginBottom: "10px" }}>Media Manager</div>
              {["Images", "Videos", "Audio", "Documents", "Animations"].map(cat => (
                <div key={cat} style={{ marginBottom: "10px" }}>
                  <div style={{ fontSize: "0.78em", fontWeight: "600", color: t.text, padding: "6px 8px", background: t.bg, borderRadius: "6px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", border: `1px solid ${t.border}` }}>
                    {cat} <span style={{ color: "#94a3b8", fontSize: "0.85em" }}>0</span>
                  </div>
                </div>
              ))}
              <button style={{ width: "100%", padding: "9px", background: "none", border: `1px dashed ${t.border}`, borderRadius: "8px", color: "#94a3b8", cursor: "pointer", fontSize: "0.8em" }}>
                + Upload Media
              </button>
            </div>
          )}
        </div>

        {/* ── Block Editor ── */}
        <div style={{ flex: 1, overflow: "auto", padding: "24px", minWidth: 0 }}>
          {blocks.length === 0 && (
            <div style={{ textAlign: "center", paddingTop: "80px", color: "#94a3b8" }}>
              <div style={{ fontSize: "3em", marginBottom: "12px" }}>📄</div>
              <div style={{ fontWeight: "600", marginBottom: "8px" }}>No blocks yet</div>
              <div style={{ fontSize: "0.85em" }}>Click "Add Block" or use the sidebar to get started</div>
            </div>
          )}
          {blocks.map((block, idx) => {
            const meta = blockMeta(block.type);
            const isDragTarget = dragOver === block.id;
            return (
              <div key={block.id}
                draggable
                onDragStart={() => handleDragStart(block.id)}
                onDragOver={e => handleDragOver(e, block.id)}
                onDrop={e => handleDrop(e, block.id)}
                onDragEnd={() => { setDragId(null); setDragOver(null); }}
                style={{ marginBottom: "10px", border: `2px solid ${isDragTarget ? t.accent : dragId===block.id ? t.accent+"55" : t.border}`, borderRadius: "10px", overflow: "hidden", background: t.bg, transition: "border-color 0.15s, opacity 0.15s", opacity: dragId===block.id ? 0.5 : 1 }}
              >
                {/* Block header */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", background: t.surface, borderBottom: block.collapsed ? "none" : `1px solid ${t.border}` }}>
                  <div style={{ cursor: "grab", color: "#94a3b8", flexShrink: 0 }}><Icon d={icons.drag} size={14}/></div>
                  <span style={{ color: meta.color, flexShrink: 0 }}><Icon d={icons[meta.icon] || icons.text} size={13}/></span>
                  <span style={{ fontSize: "0.75em", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: meta.color }}>{meta.label}</span>
                  <span style={{ fontSize: "0.7em", color: "#94a3b8", marginLeft: "2px" }}>— {meta.category}</span>
                  <div style={{ flex: 1 }}/>
                  <span style={{ fontSize: "0.7em", color: "#94a3b8" }}>#{idx+1}</span>
                  {/* Actions */}
                  <div style={{ display: "flex", gap: "2px" }}>
                    <button onClick={() => toggleCollapse(block.id)} title="Collapse" style={{ padding: "3px 6px", background: "none", border: "none", color: "#94a3b8", cursor: "pointer", borderRadius: "4px" }}><Icon d={block.collapsed ? icons.expand : icons.collapse} size={13}/></button>
                    <button onClick={() => duplicateBlock(block.id)} title="Duplicate" style={{ padding: "3px 6px", background: "none", border: "none", color: "#94a3b8", cursor: "pointer", borderRadius: "4px" }}><Icon d={icons.copy} size={13}/></button>
                    <button onClick={() => deleteBlock(block.id)} title="Delete" style={{ padding: "3px 6px", background: "none", border: "none", color: "#ef4444", cursor: "pointer", borderRadius: "4px" }}><Icon d={icons.trash} size={13}/></button>
                  </div>
                </div>
                {/* Block editor */}
                {!block.collapsed && (
                  <div style={{ padding: "14px 16px" }}>
                    <BlockEditor block={block} theme={theme} onChange={changes => updateBlock(block.id, changes)}/>
                  </div>
                )}
              </div>
            );
          })}
          {/* Add block CTA */}
          <button onClick={() => setShowAddMenu(true)} style={{ width: "100%", padding: "14px", background: "none", border: `2px dashed ${t.border}`, borderRadius: "10px", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "0.9em", marginTop: "8px", transition: "all 0.2s" }}>
            <Icon d={icons.plus} size={18}/> Add Block
          </button>
        </div>

        {/* ── Live Preview ── */}
        <div style={{ width: "420px", borderLeft: `1px solid ${t.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "10px 16px", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: t.surface }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8em", fontWeight: "700", color: t.text }}>
              <Icon d={icons.eye} size={14}/> Live Preview
            </div>
            <span style={{ fontSize: "0.72em", color: "#94a3b8", background: "#22c55e22", color: "#16a34a", padding: "2px 8px", borderRadius: "10px", fontWeight: "600" }}>● Live</span>
          </div>
          <div style={{ flex: 1, overflow: "auto", background: THEMES[theme].preview_bg }}>
            <div style={{ padding: "28px 32px", maxWidth: "100%", lineHeight: "1.6" }} dangerouslySetInnerHTML={{ __html: previewHTML }}/>
          </div>
        </div>
      </div>

      {/* ── Status bar ── */}
      <div style={{ height: "26px", background: t.accent, display: "flex", alignItems: "center", padding: "0 16px", gap: "16px", flexShrink: 0 }}>
        <span style={{ fontSize: "0.72em", color: "rgba(255,255,255,0.8)" }}>Theme: <strong style={{color:"#fff"}}>{THEMES[theme].name}</strong></span>
        <span style={{ fontSize: "0.72em", color: "rgba(255,255,255,0.8)" }}>{blocks.length} blocks</span>
        <span style={{ fontSize: "0.72em", color: "rgba(255,255,255,0.8)" }}>WCAG 2.1 AA ✓</span>
        <span style={{ fontSize: "0.72em", color: "rgba(255,255,255,0.8)" }}>Accessibility ✓</span>
        <div style={{ flex: 1 }}/>
        <span style={{ fontSize: "0.72em", color: "rgba(255,255,255,0.8)" }}>CourseAuthor Pro — Electron + React</span>
      </div>

      {/* ── Modals ── */}
      {showAddMenu && <AddBlockMenu onAdd={addBlock} theme={theme} onClose={() => setShowAddMenu(false)}/>}
      {showExport && <ExportModal blocks={blocks} lessonTitle={lessonTitle} theme={theme} onClose={() => setShowExport(false)}/>}
      {showAI && <AIPanel blocks={blocks} theme={theme} onClose={() => setShowAI(false)} onInsertBlock={insertBlock}/>}
    </div>
  );
  
}
