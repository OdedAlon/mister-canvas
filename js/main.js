'use strict';

var gElCanvas;
var gCtx;
var gCurrShape = 'rect';
var gCurrColor = '#fff';
var gCurrBorderColor = '#000';
var gShapes = [];
var gGrabbedShape;
var gStartPos;
var gPrevPos;
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']


function init() {
    gElCanvas = document.getElementById('my-canvas');
    gCtx = gElCanvas.getContext('2d');
    addListeners()
}

function draw(ev) {
    const pos = getEvPos(ev);
    if (isShapeClicked(pos)) return;
    const { offsetX, offsetY } = ev
    let elShapeSelect = document.getElementById('select-shape');
    gCurrShape = elShapeSelect.value;
    let elColorSelect = document.getElementById('shape-color');
    gCurrColor = elColorSelect.value;
    let elBorderColorSelect = document.getElementById('border-color');
    gCurrBorderColor = elBorderColorSelect.value;
    switch (gCurrShape) {
        case 'triangle':
            drawTriangle(offsetX, offsetY, gCurrColor, gCurrBorderColor);
            break;
        case 'rect':
            drawRect(offsetX, offsetY, gCurrColor, gCurrBorderColor);
            break;
        case 'arc':
            drawArc(offsetX, offsetY, gCurrColor, gCurrBorderColor);
            break;
    }
    let shape = {
        shape: gCurrShape,
        color: gCurrColor,
        borderColor: gCurrBorderColor,
        size: 100,
        pos: { x: offsetX, y: offsetY },
        isDragging: false 
    }
    gShapes.push(shape);
    console.log(gShapes)
}

function drawRect(x, y, fillColor, borderColor) {
    gCtx.beginPath();
    gCtx.rect(x - 50, y - 50, 100, 100);
    gCtx.lineWidth = 6;
    gCtx.fillStyle = fillColor;
    gCtx.fillRect(x - 50, y - 50, 100, 100);
    gCtx.strokeStyle = borderColor;
    gCtx.stroke();
}

function drawArc(x, y, fillColor, borderColor) {
    gCtx.beginPath();
    gCtx.lineWidth = 6;
    gCtx.arc(x, y, 60, 0, 2 * Math.PI);
    gCtx.fillStyle = fillColor;
    gCtx.fill();
    gCtx.strokeStyle = borderColor;
    gCtx.stroke();
}

function downloadCanvas(elLink) {
    const data = gElCanvas.toDataURL();
    elLink.href = data;
    elLink.download = 'my-canvas.jpg';
}

function addListeners() {
    addMouseListeners();
    addTouchListeners();
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousemove', onMove);
    gElCanvas.addEventListener('mousedown', onDown);
    gElCanvas.addEventListener('mouseup', onUp);
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove);
    gElCanvas.addEventListener('touchstart', onDown);
    gElCanvas.addEventListener('touchend', onUp);
}

function onDown(ev) {
    const pos = getEvPos(ev);
    if (!isShapeClicked(pos)) return;
    gGrabbedShape.isDragging = true;
    gPrevPos = pos;
    gStartPos = pos;
    document.body.style.cursor = 'grabbing';
}

function onMove(ev) {
    if (gGrabbedShape.isDragging) {
        const pos = getEvPos(ev);
        const dx = pos.x - gStartPos.x;
        const dy = pos.y - gStartPos.y;
        // renderPrevShapeRemove();
        gGrabbedShape.pos.x += dx;
        gGrabbedShape.pos.y += dy;
        gStartPos = pos;
        renderCanvas()
        renderShape();
        renderShapes();
    }
}

function onUp() {
    // renderCanvas()
    renderShape();
    renderShapes();
    gGrabbedShape.isDragging = false;
    document.body.style.cursor = 'grab';
    // let shapeIdx = gShapes.findIndex(shape => {
    //     gPrevPos === shape.pos;
    // })
    // gShapes.splice(shapeIdx, 1);
}

// function renderCurrShape() {
//     gCurrShape =  gGrabbedShape.shape;
//     renderShape(gGrabbedShape.shape, gGrabbedShape.color, gGrabbedShape.border, gGrabbedShape.pos.x, gGrabbedShape.pos.y);
// }

function renderShape() {
    gCurrShape =  gGrabbedShape.shape;
    gCurrColor = gGrabbedShape.color;
    gCurrBorderColor = gGrabbedShape.border;
    switch (gCurrShape) {
        case 'triangle':
            drawTriangle(gGrabbedShape.pos.x, gGrabbedShape.pos.y, gCurrColor, gCurrBorderColor);
            break;
        case 'rect':
            drawRect(gGrabbedShape.pos.x, gGrabbedShape.pos.y, gCurrColor, gCurrBorderColor);
            break;
        case 'arc':
            drawArc(gGrabbedShape.pos.x, gGrabbedShape.pos.y, gCurrColor, gCurrBorderColor);
            break;
    }
}

function renderShapes() {
    gShapes.map(shape => {
        switch (shape.shape) {
            case 'triangle':
                drawTriangle(shape.pos.x, shape.pos.y, shape.color, shape.borderColor);
                break;
            case 'rect':
                drawRect(shape.pos.x, shape.pos.y, shape.color, shape.borderColor);
                break;
            case 'arc':
                drawArc(shape.pos.x, shape.pos.y, shape.color, shape.borderColor);
                break;
        }
    })
}

function renderCanvas() {
    gCtx.fillStyle = "#fff"
    gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height)
}

function getEvPos(ev) {
    const pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos
}

function isShapeClicked(clickedPos) {
    gGrabbedShape = gShapes.find(shape => {
        const distance = Math.sqrt((shape.pos.x - clickedPos.x) ** 2 + (shape.pos.y - clickedPos.y) ** 2);        
        return distance <= shape.size;
    });
    return gGrabbedShape;
}