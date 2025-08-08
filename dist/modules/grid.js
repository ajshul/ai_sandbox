import { drawPixel, gridWidth, col, row, ctx, updateOnNextFrame, } from "./renderer.js";
import { currentElement, brushSize, mouseX, mouseY } from "./controls.js";
import { ALLOW_REPLACEMENT, isPaused, DEBUG_LIFE, DEBUG_MOVEMENT, DEBUG_VELOCITY, } from "./config.js";
import { Sand, Water, Fire, Smoke, Wood, Stone, Custom, Empty, Acid, Foam, Oil, Ice, Bomb, Meteor, } from "./elements/ElementIndex.js";
class Grid {
    initialize(row, col) {
        this.row = row;
        this.col = col;
        this.grid = new Array(row * col);
        for (let i = 0; i < row * col; i++) {
            this.grid[i] = new Empty(i);
        }
        this.drawAll();
        this.highlightIndex = new Set();
        this.debugView = false;
    }
    reset() {
        this.grid = new Array(row * col);
        for (let i = 0; i < row * col; i++) {
            this.grid[i] = new Empty(i);
        }
        this.drawAll();
    }
    fill() {
        for (let i = 0; i < row * col; i++) {
            const ElementCtor = currentElement.constructor;
            let newElement = new ElementCtor(i);
            this.setIndex(i, newElement);
            this.grid[i] = newElement;
        }
        this.drawAll();
    }
    updateColor() {
        this.grid.forEach((element, index) => {
            if (element.constructor.name === "Empty") {
                element.setColor(Empty.currentColor);
                updateOnNextFrame.add(index);
            }
        });
    }
    removeIndex(i) {
        this.grid[i] = new Empty(i);
    }
    get(i) {
        return this.grid[i];
    }
    setIndex(i, element) {
        element.index = i;
    }
    setElement(x, y, element) {
        let newElement;
        // This switch statement is very annoying but cannot seem to get around typescript not
        // liking to construct using element constructor for all types.
        switch (element.constructor.name) {
            case "Empty":
                newElement = new Empty(y * this.col + x);
                break;
            case "Sand":
                newElement = new Sand(y * this.col + x);
                break;
            case "Water":
                newElement = new Water(y * this.col + x);
                break;
            case "Wood":
                newElement = new Wood(y * this.col + x);
                break;
            case "Fire":
                newElement = new Fire(y * this.col + x);
                break;
            case "Smoke":
                newElement = new Smoke(y * this.col + x);
                break;
            case "Stone":
                newElement = new Stone(y * this.col + x);
                break;
            case "Acid":
                newElement = new Acid(y * this.col + x);
                break;
            case "Foam":
                newElement = new Foam(y * this.col + x);
                break;
            case "Oil":
                newElement = new Oil(y * this.col + x);
                break;
            case "Ice":
                newElement = new Ice(y * this.col + x);
                break;
            case "Bomb":
                newElement = new Bomb(y * this.col + x);
                break;
            case "Meteor":
                newElement = new Meteor(y * this.col + x);
                break;
            case "Custom":
                newElement = new Custom(y * this.col + x);
                break;
            default:
                newElement = new Empty(y * this.col + x);
        }
        this.grid[y * this.col + x] = newElement;
        updateOnNextFrame.add(y * this.col + x);
    }
    setBrush(x, y) {
        const elementClass = currentElement.constructor;
        for (let i = x - brushSize; i <= x + brushSize; i++) {
            for (let j = y - brushSize; j <= y + brushSize; j++) {
                let dx = i - x;
                let dy = j - y;
                if (dx * dx + dy * dy <= brushSize * brushSize) {
                    if (this.isValidIndex(i, j)) {
                        if (currentElement.constructor.name === "Empty") {
                            this.removeIndex(j * this.col + i);
                        }
                        if (Math.random() < elementClass.currentProbability) {
                            if (ALLOW_REPLACEMENT ||
                                (this.get(j * this.col + i).constructor.name !==
                                    currentElement.constructor.name &&
                                    this.isEmpty(j * this.col + i))) {
                                let newElement = currentElement instanceof Empty
                                    ? new Empty(j * this.col + i)
                                    : new currentElement.constructor(j * this.col + i);
                                this.setIndex(j * this.col + i, newElement);
                                this.setElement(i, j, newElement);
                            }
                        }
                    }
                }
            }
        }
    }
    swap(a, b) {
        if (this.grid[a] instanceof Empty && this.grid[b] instanceof Empty) {
            return;
        }
        let temp = this.grid[a];
        this.setIndex(a, this.grid[b]);
        this.setIndex(b, temp);
        this.grid[a] = this.grid[b];
        this.grid[b] = temp;
        updateOnNextFrame.add(a);
        updateOnNextFrame.add(b);
        drawPixel(a, this.grid[a]);
        drawPixel(b, this.grid[b]);
    }
    isEmpty(i) {
        return this.grid[i] instanceof Empty;
    }
    isLiquid(i) {
        return this.grid[i].liquid;
    }
    isGas(i) {
        return this.grid[i].gas;
    }
    isPassable(i) {
        return (this.grid[i] instanceof Empty || this.grid[i].liquid || this.grid[i].gas);
    }
    isValidIndex(x, y) {
        return x >= 0 && x < this.col && y >= 0 && y < this.row;
    }
    draw() {
        if (this.debugView !== (DEBUG_LIFE || DEBUG_MOVEMENT || DEBUG_VELOCITY)) {
            this.debugView = DEBUG_LIFE || DEBUG_MOVEMENT || DEBUG_VELOCITY;
            this.drawAll();
        }
        else if (this.debugView) {
            this.drawAll();
        }
        else {
            updateOnNextFrame.forEach((index) => {
                drawPixel(index, this.grid[index]);
            });
        }
        this.highlightIndex.forEach((index) => {
            drawPixel(index, this.grid[index]);
        });
        this.highlightIndex.clear();
        let x = Math.floor(mouseX / gridWidth);
        let y = Math.floor(mouseY / gridWidth);
        const elementClass = currentElement.constructor;
        for (let i = x - brushSize; i <= x + brushSize; i++) {
            for (let j = y - brushSize; j <= y + brushSize; j++) {
                let dx = i - x;
                let dy = j - y;
                if (dx * dx + dy * dy <= brushSize * brushSize) {
                    if (this.isValidIndex(i, j)) {
                        if (currentElement.constructor.name === "Empty") {
                            ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
                        }
                        else {
                            ctx.fillStyle = `rgba(${elementClass.currentColor[0]}, ${elementClass.currentColor[1]}, ${elementClass.currentColor[2]}, 0.3)`;
                        }
                        ctx.fillRect(i * gridWidth, j * gridWidth, gridWidth, gridWidth);
                        this.highlightIndex.add(j * this.col + i);
                    }
                }
            }
        }
        this.update();
    }
    drawAll() {
        this.grid.forEach((element, index) => {
            drawPixel(index, element);
        });
    }
    update() {
        if (isPaused) {
            return;
        }
        // update solids and liquid from top to bottom
        for (let i = Math.floor(this.grid.length / this.col) - 1; i >= 0; i--) {
            for (let j = 0; j < this.col; j++) {
                let rndmOffset = Math.random() > 0.5;
                let colOffset = rndmOffset ? j : -j + this.col - 1;
                let element = this.grid[i * this.col + colOffset];
                if (!element.gas) {
                    element.update(this);
                }
            }
        }
        for (let i = 0; i < Math.floor(this.grid.length / this.col); i++) {
            for (let j = 0; j < this.col; j++) {
                let rndmOffset = Math.random() > 0.5;
                let colOffset = rndmOffset ? j : -j + this.col - 1;
                let element = this.grid[i * this.col + colOffset];
                if (element.gas) {
                    element.update(this);
                }
            }
        }
    }
}
export default Grid;
