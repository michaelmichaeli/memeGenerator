'use strict'

var gMemes = loadFromStorage('MEMES');

function onSavedGalleryInit() {
    if (!gMemes || !gMemes.length) {
        const elContainer = document.querySelector('main')
        elContainer.innerHTML = `<p class="with-margin">There are no saved memes yet, you can generate memes and save them here.</p>`;
    }
    else {
        renderSavedMemes(gMemes);
    }
}


function renderSavedMemes(memes) {

    var strHTML = memes.map((meme, idx) => {
        return `<div class="saved-meme-box flex column space-between">
            <img src="${meme.imgContent}" onclick="onOpenSaved('${meme.imgContent}')" alt="" />
            <div>
                <a class="delete-meme" onclick="onDelete(${idx})"><img src="icons/trash.png"></a>
                <a href="#" class="download-meme" onmouseup="onDownload(this, '${meme.imgContent}')" download="meme.jpg"><img src="icons/download.png"></a>
            </div>
        </div>`
    })
    const elImgsContainer = document.querySelector('section.saved-memes-boxes');
    elImgsContainer.innerHTML = strHTML.join('');

}


function onDownload(elLink, dataURL) {
    elLink.href = dataURL
}

function onDelete(i) {
    gMemes.splice(i, 1);
    saveToStorage('MEMES',  gMemes)
    onSavedGalleryInit();
}

function onOpenSaved(dataURL) {
    var win = window.open();
    win.document.write(`<iframe src="${dataURL}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
}
