import { Sand, Water, Fire, Smoke, Wood, Stone, Custom, Empty, Acid, Foam, Oil, } from "./elements/ElementIndex.js";
import { gridWidth, col, row, grid } from "./renderer.js";
import { updateHTMLValues } from "./editor.js";
let brushSpeed = 10;
let brushSize = 4;
let brushInterval;
let currentElement = new Sand(0);
let mouseX;
let mouseY;
export function setupControls() {
    let canvas = document.getElementById("canvas");
    let resetButton = document.getElementById("reset");
    resetButton.addEventListener("click", function () {
        grid.reset();
    });
    let fillButton = document.getElementById("fillgrid");
    fillButton.addEventListener("click", function () {
        grid.fill();
    });
    canvas.addEventListener("mousedown", function (e) {
        let rect = canvas.getBoundingClientRect();
        mouseX = (e.clientX - rect.left) * (800 / canvas.clientWidth);
        mouseY = (e.clientY - rect.top) * (800 / canvas.clientWidth);
        brushInterval = window.setInterval(() => {
            let i = Math.floor(mouseX / gridWidth);
            let j = Math.floor(mouseY / gridWidth);
            if (i >= 0 && i < col && j >= 0 && j < row) {
                grid.setBrush(i, j);
            }
        }, brushSpeed);
    });
    canvas.addEventListener("mouseup", function () {
        clearInterval(brushInterval);
    });
    canvas.addEventListener("mousemove", function (e) {
        let rect = canvas.getBoundingClientRect();
        mouseX = (e.clientX - rect.left) * (800 / canvas.clientWidth);
        mouseY = (e.clientY - rect.top) * (800 / canvas.clientWidth);
        // Calculate the grid position of the mouse
        let i = Math.floor(mouseX / gridWidth);
        let j = Math.floor(mouseY / gridWidth);
        if (i >= 0 && i < col && j >= 0 && j < row) {
            let mousePosition = document.getElementById("mousePosition");
            mousePosition.textContent = `Mouse position: ${i}, ${j}`;
        }
    });
    canvas.addEventListener("mouseleave", function () {
        clearInterval(brushInterval);
    });
    const controls = {
        sand: () => new Sand(0),
        wood: () => new Wood(0),
        water: () => new Water(0),
        smoke: () => new Smoke(0),
        stone: () => new Stone(0),
        fire: () => new Fire(0),
        custom: () => new Custom(0),
        eraser: () => new Empty(0),
        acid: () => new Acid(0),
        foam: () => new Foam(0),
        oil: () => new Oil(0),
    };
    Object.keys(controls).forEach((controlId) => {
        let button = document.getElementById(controlId);
        button.addEventListener("click", function () {
            Object.keys(controls).forEach((id) => {
                let elementButton = document.getElementById(id);
                elementButton.classList.remove("button-selected");
            });
            button.classList.add("button-selected");
            currentElement = controls[controlId]();
            localStorage.setItem("currentElement", controlId);
            let selected = document.getElementById("selected");
            selected.textContent = `Selected: ${controlId.charAt(0).toUpperCase() + controlId.slice(1)}`;
            updateHTMLValues();
        });
    });
    const brushControls = {
        plusbrush: () => brushSize++,
        minusbrush: () => (brushSize = Math.max(0, brushSize - 1)),
    };
    Object.keys(brushControls).forEach((controlId) => {
        let button = document.getElementById(controlId);
        button.addEventListener("click", function () {
            brushControls[controlId]();
            localStorage.setItem("brushSize", brushSize.toString());
            let brush = document.getElementById("brush");
            brush.textContent = `Brush Size: ${brushSize + 1}`;
        });
    });
    let storedElement = localStorage.getItem("currentElement") || "sand";
    currentElement = controls[storedElement]();
    let selected = document.getElementById("selected");
    selected.textContent = `Selected: ${storedElement.charAt(0).toUpperCase() + storedElement.slice(1)}`;
    let storedElementButton = document.getElementById(storedElement);
    storedElementButton.classList.add("button-selected");
    updateHTMLValues();
    let storedBrushSize = localStorage.getItem("brushSize") || "4";
    brushSize = parseInt(storedBrushSize);
    let brush = document.getElementById("brush");
    brush.textContent = `Brush Size: ${brushSize + 1}`;
}
export { currentElement, brushSize, mouseX, mouseY };
