'use strict';

const DEFAULT_LINE_TXT = 'I never eat Falafel';
const DEFAULT_TXT_SIZE = 40;
const ALIGN_TYPE = { LEFT: 'left', RIGHT: 'right', CENTER: 'center' };
const DEFUALT_TXT_ALIGMENT = ALIGN_TYPE.CENTER;
const DEFAULT_TXT_COLOR = 'white';
const DEFUALT_FONT = 'Impact'
const DEFAULT_STROKE = 'black'
const TXT_TOP_PADDING = 10;
var gMeme = { selectedImgId: -1, selectedLineIdx: -1, lines: [] };



function setSelectedLine(selectedLine) {
    gMeme.selectedLineIdx = selectedLine;
}

function getSelectedLine() {
    return gMeme.selectedLineIdx;
}

function findClickedLine(x, y) {
    return gMeme.lines.findIndex(line => line.location.y - line.fontSize < y && y < line.location.y 
        && line.location.x - line.width / 2 < x && x < line.location.x + line.width / 2);
}

function setLinesWidth() {
    gMeme.lines.forEach((line) => {
        line.width = gCtx.measureText(line.txt).width * line.fontSize * 0.09;
        // console.log(line.width);
    });
}

// function clearMeme() {
//     gMeme = { selectedImgId: -1, selectedLineIdx: -1, lines: [] };
// }

function addImage(imageId) {
    gMeme.selectedImgId = imageId;
}

function addLine() {
    var line = {
        // txt: (gMeme.lines.length > 0) ? `New Text Line ${gMeme.lines.length + 1}` : DEFAULT_LINE_TXT,
        txt: `New Text Line ${gMeme.lines.length + 1}`,
        fontSize: DEFAULT_TXT_SIZE,
        align: DEFUALT_TXT_ALIGMENT,
        color: DEFAULT_TXT_COLOR,
        font: DEFUALT_FONT,
        stroke: DEFAULT_STROKE,
        location: _getLinePosition()
    };
    gMeme.lines.push(line);
    gMeme.selectedLineIdx = gMeme.lines.length - 1;
}

function deleteLine() {
    if (gMeme.selectedLineIdx === -1) return;
    gMeme.lines.splice(gMeme.selectedLineIdx, 1);
    gMeme.selectedLineIdx = gMeme.lines.length - 1;
}

function changeFontSize(diff) {
    if (gMeme.selectedLineIdx === -1) return;
    var line = gMeme.lines[gMeme.selectedLineIdx]
    if (line.fontSize + diff <= 5) return;
    line.fontSize += diff
}

function updateLineTxt(txt) {
    if (gMeme.selectedLineIdx === -1) return;
    gMeme.lines[gMeme.selectedLineIdx].txt = txt;
}

function upDownLine(diff) {
    if (gMeme.selectedLineIdx === -1) return;
    var line = gMeme.lines[gMeme.selectedLineIdx]
    if (line.location.y + diff <= 0 ||
        line + diff > gCanvas.height - line.size) return;
    line.location.y += diff
}

function switchSelectedLines() {
    (gMeme.selectedLineIdx + 1 === gMeme.lines.length) ? gMeme.selectedLineIdx = 0 : gMeme.selectedLineIdx++;
}

function _getLinePosition() {
    if (gMeme.lines.length > 0) {
        const ys = Array.from(gMeme.lines.map((line) => {
            return line.location.y;
        }));

        const maxY = Math.max(...ys);
        const y = maxY + TXT_TOP_PADDING + DEFAULT_TXT_SIZE;
        const x = Math.floor(gCanvas.width / 2);
        if (y > gCanvas.height) y = getRandomInteger(TXT_TOP_PADDING, gCanvas.height);
        return { x: x, y: y };
    }
    else {
        const x = Math.floor(gCanvas.width / 2);
        const y = TXT_TOP_PADDING + DEFAULT_TXT_SIZE;
        return { x: x, y: y };
    }
}

function getCurrMeme() {
    return gMeme;
}

function getCurrLine() {
    return getCurrMeme().lines[getCurrMeme().selectedLineIdx];
}

function ChangeLineAligment(lcr) {
    const currLine = getCurrLine();
    switch (lcr) {
        case 'right':
            currLine.location.x = gCanvas.width - currLine.width / 2;
            break;
        case 'left':
            currLine.location.x = 0 + currLine.width / 2;
            break;
        case 'center':
            currLine.location.x = (gCanvas.width / 2);
            break;
    }

}

function changeFontColor(fontColor) {
    getCurrMeme().lines[getCurrMeme().selectedLineIdx].color = fontColor;
}

function changeStrokeColor(strokeColor) {
    getCurrMeme().lines[getCurrMeme().selectedLineIdx].stroke = strokeColor;
}