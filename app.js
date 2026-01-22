// --------------------------
// 1. DOM Elements
// --------------------------
const MoveDown = document.querySelector("#MoveDown");
const MoveUp = document.querySelector("#MoveUp");
const canvas = document.querySelector("#canvas");
const layers = document.querySelector("#layers");
const addTextBtn = document.querySelector("#addText");
const addRectangleBtn = document.querySelector("#addRectangle");
const showLayers = document.querySelector(".showLayers");
const layersContainer = document.querySelector(".layersContainer");
const hideLayer = document.querySelector(".hideLayer");
const showProp = document.querySelector(".showProp");
const propContainer = document.querySelector(".propContainer");
const hideProp = document.querySelector(".hideProp");

// Property Inputs
const hProp = document.getElementById("height");
const wProp = document.getElementById("width");
const xProp = document.getElementById("x");
const yProp = document.getElementById("y");
const rotationProp = document.getElementById("rotation");
const bgProp = document.getElementById("background");
const textProp = document.getElementById("text");

// Export Buttons
const expoJSON = document.getElementById("expoJSON");
const expoHTML = document.getElementById("expoHTML");

// --------------------------
// 2. State Variables
// --------------------------
let isDragging = false;
let isResizing = false;
let isRotating = false;

let startX, startY, startW, startH, startLeft, startTop;
let offsetX = 0,
  offsetY = 0;
let startAngle = 0,
  startRotation = 0;
let resizeDir = null;

let selectedElem = null;
let selectedId = null;
const moveStep = 5;
const STORAGE_KEY = "mini-figma-state";

// Initial Elements (can be loaded from localStorage)
let allElements = [
  {
    id: "7f00136b-f82b-4898-a867-c4dd6bbf1a0b",
    type: "rect",
    x: 128,
    y: 400,
    width: 273,
    height: 146,
    rotation: 0,
    zIndex: 1,
    styles: { backgroundColor: "#22c55e" },
  },
  {
    id: "01ffb82d-0890-4f15-8d56-c5efa3d31a20",
    type: "text",
    x: 106,
    y: 382,
    width: 309.983,
    height: 172.,
    rotation: 0,
    zIndex: 2,
    text: "It's Mini Figma",
    styles: { color: "#ffffff" },
  },
];

// --------------------------
// 3. Helper Functions
// --------------------------
const uid = () => crypto.randomUUID();
const getElemData = (id) => allElements.find((el) => el.id === id);

// Local Storage
function saveToLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allElements));
}
function loadFromLocalStorage() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) allElements = JSON.parse(data);
}

// --------------------------
// 4. Element Creation
// --------------------------
function createElem(type) {
  const id = uid();
  const base = {
    id,
    x: 100,
    y: 100,
    width: 120,
    height: 80,
    rotation: 0,
    zIndex: allElements.length + 1,
  };

  if (type === "text") {
    return {
      ...base,
      type: "text",
      text: "Enter Text",
      styles: { color: "#fff" },
    };
  }
  return { ...base, type: "rect", styles: { backgroundColor: "#4b4a63" } };
}

function addElem(type) {
  const elem = createElem(type);
  allElements.push(elem);
  renderElement(elem);
  renderLayer(elem);
  saveToLocalStorage();
}

// --------------------------
// 5. Rendering Elements & Layers
// --------------------------
function renderElement(elem) {
  const div = document.createElement("div");
  div.classList.add("elem");
  div.dataset.id = elem.id;

  div.style.left = elem.x + "px";
  div.style.top = elem.y + "px";
  div.style.width = elem.width + "px";
  div.style.height = elem.height + "px";
  div.style.zIndex = elem.zIndex;
  div.style.transform = `rotate(${elem.rotation}deg)`;

  if (elem.type === "text") {
    div.classList.add("text");
    div.textContent = elem.text;
  } else {
    div.classList.add("rectangle");
    div.style.backgroundColor = elem.styles.backgroundColor;
  }

  canvas.appendChild(div);
}

function renderLayer(elem) {
  const layer = document.createElement("div");
  layer.classList.add("layer");
  layer.dataset.id = elem.id;
  layer.textContent = elem.type === "text" ? "Text" : "Rectangle";

  layer.onclick = () => {
    const domElem = document.querySelector(`.elem[data-id="${elem.id}"]`);
    selectElement(domElem);
  };

  layers.appendChild(layer);
}

// Load all elements from state/localStorage
function loadFromState() {
  canvas.innerHTML = "";
  layers.innerHTML = "";
  allElements.forEach((el) => {
    renderElement(el);
    renderLayer(el);
  });
}

// --------------------------
// 6. Selection & Controllers
// --------------------------
function selectElement(elem) {
  // Remove previous selection
  document.querySelectorAll(".elem").forEach((e) => {
    e.classList.remove("selected");
    e.querySelectorAll(".handle").forEach((h) => h.remove());
  });

  if (!elem) {
    selectedElem = null;
    selectedId = null;
    return;
  }

  selectedElem = elem;
  selectedId = elem.dataset.id;
  selectedElem.classList.add("selected");
  addResizeController(selectedElem);
  syncValues();
}

function addResizeController(elem) {
  elem.insertAdjacentHTML(
    "beforeend",
    `<div class="handle nw"></div>
     <div class="handle ne"></div>
     <div class="handle se"></div>
     <div class="handle sw"></div>
     <div class="handle rotate"></div>`,
  );
}

// --------------------------
// 7. Property Panel Sync
// --------------------------
function syncValues() {
  if (!selectedId) return;
  const data = getElemData(selectedId);
  hProp.value = data.height;
  wProp.value = data.width;
  xProp.value = data.x;
  yProp.value = data.y;
  rotationProp.value = data.rotation;
  bgProp.value = data.styles.backgroundColor || "";
  textProp.value = data.text || "";
}

// Input Listeners
function bindPropertyUpdates() {
  hProp.addEventListener("input", () => updateElemProp("height", +hProp.value));
  wProp.addEventListener("input", () => updateElemProp("width", +wProp.value));
  xProp.addEventListener("input", () => updateElemProp("x", +xProp.value));
  yProp.addEventListener("input", () => updateElemProp("y", +yProp.value));
  rotationProp.addEventListener("input", () =>
    updateElemProp("rotation", +rotationProp.value),
  );
  bgProp.addEventListener("input", () =>
    updateElemStyle("backgroundColor", bgProp.value),
  );
  textProp.addEventListener("input", () => updateElemText(textProp.value));
}

function updateElemProp(prop, value) {
  if (!selectedId) return;
  const data = getElemData(selectedId);
  data[prop] = value;
  updateElem(data);
}

function updateElemStyle(styleProp, value) {
  if (!selectedId) return;
  const data = getElemData(selectedId);
  data.styles[styleProp] = value;
  updateElem(data);
}

function updateElemText(text) {
  if (!selectedId) return;
  const data = getElemData(selectedId);
  data.text = text;
  updateElem(data);
}

function updateElem(data) {
  const el = document.querySelector(`.elem[data-id="${data.id}"]`);
  if (!el) return;

  el.style.left = data.x + "px";
  el.style.top = data.y + "px";
  el.style.width = data.width + "px";
  el.style.height = data.height + "px";
  el.style.transform = `rotate(${data.rotation}deg)`;

  if (data.type === "rect")
    el.style.backgroundColor = data.styles.backgroundColor;
  if (data.type === "text") el.textContent = data.text;

  saveToLocalStorage();
}

// --------------------------
// 8. Canvas Interaction
// --------------------------
canvas.addEventListener("mousedown", (e) => {
  const elem = e.target.closest(".elem");

  // If clicked on element
  if (elem) {
    selectElement(elem);
    isDragging = !e.target.classList.contains("handle");
    const rect = elem.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
  }

  // If clicked on handle
  if (e.target.classList.contains("handle")) {
    isDragging = false;
    isResizing = true;
    resizeDir = e.target.classList[1];

    const rect = selectedElem.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();

    startX = e.clientX;
    startY = e.clientY;
    startW = rect.width;
    startH = rect.height;
    startLeft = rect.left - canvasRect.left;
    startTop = rect.top - canvasRect.top;

    if (resizeDir === "rotate") {
      isResizing = false;
      isRotating = true;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      startAngle = Math.atan2(e.clientY - cy, e.clientX - cx);
      startRotation = getElemData(selectedId).rotation;
    }
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (!selectedElem) return;
  const data = getElemData(selectedId);
  if (!data) return;

  const canvasRect = canvas.getBoundingClientRect();

  // Dragging
  if (isDragging) {
    data.x = e.clientX - canvasRect.left - offsetX;
    data.y = e.clientY - canvasRect.top - offsetY;
    selectedElem.style.left = data.x + "px";
    selectedElem.style.top = data.y + "px";
  }

  // Resizing
  if (isResizing) {
    let dx = e.clientX - startX;
    let dy = e.clientY - startY;

    let w = startW,
      h = startH,
      l = startLeft,
      t = startTop;

    if (resizeDir.includes("se")) {
      w += dx;
      h += dy;
    }
    if (resizeDir.includes("sw")) {
      w -= dx;
      h += dy;
      l += dx;
    }
    if (resizeDir.includes("ne")) {
      w += dx;
      h -= dy;
      t += dy;
    }
    if (resizeDir.includes("nw")) {
      w -= dx;
      h -= dy;
      l += dx;
      t += dy;
    }

    data.width = w;
    data.height = h;
    data.x = l;
    data.y = t;
    selectedElem.style.width = w + "px";
    selectedElem.style.height = h + "px";
    selectedElem.style.left = l + "px";
    selectedElem.style.top = t + "px";
  }

  // Rotating
  if (isRotating) {
    const rect = selectedElem.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - cy, e.clientX - cx);
    const deg = (angle - startAngle) * (180 / Math.PI);
    data.rotation = startRotation + deg;
    selectedElem.style.transform = `rotate(${data.rotation}deg)`;
  }

  syncValues();
});

document.addEventListener("mouseup", () => {
  isDragging = isResizing = isRotating = false;
  saveToLocalStorage();
});

// --------------------------
// 9. Keyboard Controls
// --------------------------
document.addEventListener("keydown", (e) => {
  if (!selectedElem) return;
  const data = getElemData(selectedId);
  if (!data) return;

  switch (e.key) {
    case "ArrowUp":
      data.y -= moveStep;
      break;
    case "ArrowDown":
      data.y += moveStep;
      break;
    case "ArrowLeft":
      data.x -= moveStep;
      break;
    case "ArrowRight":
      data.x += moveStep;
      break;
    case "Delete":
      deleteElement(selectedId);
      return;
  }
  selectedElem.style.left = data.x + "px";
  selectedElem.style.top = data.y + "px";
  saveToLocalStorage();
});

// --------------------------
// 10. Delete Element
// --------------------------
function deleteElement(id) {
  allElements = allElements.filter((el) => el.id !== id);
  document.querySelector(`.elem[data-id="${id}"]`)?.remove();
  document.querySelector(`.layer[data-id="${id}"]`)?.remove();
  selectedElem = null;
  selectedId = null;
  saveToLocalStorage();
}

// --------------------------
// 11. Z-Index Control
// --------------------------
function setZindexes() {
  allElements.forEach((elem, idx) => {
    elem.zIndex = idx + 1;
    const model = document.querySelector(`[data-id="${elem.id}"]`);
    if (model) model.style.zIndex = elem.zIndex;
  });
}

function bringForward(id) {
  const index = allElements.findIndex((el) => el.id === id);
  if (index === allElements.length - 1) return;
  [allElements[index], allElements[index + 1]] = [
    allElements[index + 1],
    allElements[index],
  ];
  setZindexes();
}

function sendBackward(id) {
  const index = allElements.findIndex((el) => el.id === id);
  if (index === 0) return;
  [allElements[index], allElements[index - 1]] = [
    allElements[index - 1],
    allElements[index],
  ];
  setZindexes();
}

// Buttons
MoveUp.addEventListener("click", () => {
  if (selectedElem) {
    bringForward(selectedId);
    loadFromState();
  }
});
MoveDown.addEventListener("click", () => {
  if (selectedElem) {
    sendBackward(selectedId);
    loadFromState();
  }
});

// --------------------------
// 12. Export Functions
// --------------------------
function generateHTML() {
  let html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Exported Design</title>
</head>
<body style="margin:0; position:relative; background:#111;">
`;

  allElements.forEach((el) => {
    let style = `
      position:absolute;
      left:${el.x}px;
      top:${el.y}px;
      width:${el.width}px;
      height:${el.height}px;
      transform:rotate(${el.rotation}deg);
      z-index:${el.zIndex};
    `;

    if (el.type === "rect") {
      style += `background:${el.styles.backgroundColor};`;
      html += `<div style="${style}"></div>`;
    }

    if (el.type === "text") {
      style += `color:${el.styles.color || "#fff"}; font-size:${el.styles.fontSize || 16}px;`;
      html += `<div style="${style}">${el.text}</div>`;
    }
  });

  html += `</body></html>`;
  return html;
}

function exportHTML_DataURL(html) {
  const url = "data:text/html;charset=utf-8," + encodeURIComponent(html);
  const a = document.createElement("a");
  a.href = url;
  a.download = "design.html";
  a.click();
}

function exportHTML() {
  exportHTML_DataURL(generateHTML());
}
function exportJson() {
  const json = JSON.stringify(allElements);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "design.json";
  a.click();
}

// Export Buttons
expoHTML.addEventListener("click", exportHTML);
expoJSON.addEventListener("click", exportJson);

// --------------------------
// 13. Add Elements Buttons
// --------------------------
addTextBtn.onclick = () => addElem("text");
addRectangleBtn.onclick = () => addElem("rect");

// --------------------------
// 14. Initialization
// --------------------------
window.addEventListener("load", () => {
  loadFromLocalStorage();
  loadFromState();
  bindPropertyUpdates();
});



// --------------------------
// 15. Show & Hide || Props And Layers
// --------------------------
showHideAside(showLayers,hideLayer,layersContainer,-200);
showHideAside(showProp,hideProp,propContainer,200);

function showHideAside(show,hide,container,value) {
  show.addEventListener("click", () => {
    container.style.transform = "translateX(0)";
    show.classList.add("hide");
  });

  hide.addEventListener("click", () => {
    show.classList.remove("hide");
    container.style.transform = `translateX(${value}%)`;
  });
}
