'use strict'

var gIsUpload = false;
var gUploadSrc;

function onToggleMenu() {
    document.body.classList.toggle('menu-open');
}

function onClearSearch() {
    const elSearchInput = document.querySelector('input[name="search-input"]');
    elSearchInput.value = '';
}

function onGalleryInit() {
    const images = getImages();
    renderGallery(images);
}

function onSearch(value) {
    const images = getImages().filter(image => image.keyWords.find(keyWord => keyWord.toLocaleLowerCase() === value.toLocaleLowerCase()))
    renderGallery(images);
    if (!value) renderGallery(getImages());
}

function renderGallery(images) {
    var galleryHTML = '';
    images.forEach(image => {
        galleryHTML += `<img class="non-square-image"  src="${image.url}" onClick="onImageClicked(${image.id})">`
    });

    var gallery = document.querySelector('.gallery-images');
    gallery.innerHTML = galleryHTML;
}

function onImageClicked(id) {
    renderEditView();
    memeInit(id);
}

function renderEditView() {
    const elGallery = document.querySelector('.gallery');
    elGallery.hidden = true;
    elGallery.classList.remove('flex');
    document.querySelector('.search').hidden = true;
    const elMemeEditor = document.querySelector('.editor');
    elMemeEditor.hidden = false;
    elMemeEditor.classList.add('flex');
    elMemeEditor.classList.add('wrap');
    elMemeEditor.classList.add('space-between');
}


function onImgInput(ev) {
    loadImageFromInput(ev, renderUpload)
}
function loadImageFromInput(ev, onImageReady) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var img = new Image();
        img.onload = onImageReady.bind(null, img)
        img.src = event.target.result;
        gUploadSrc = img.src
        gIsUpload = true
        renderUpload();
        draw();
    }
    reader.readAsDataURL(ev.target.files[0]);
}
function renderUpload() {
    renderEditView();
    gCanvas = document.querySelector('#meme-canvas');
    gCtx = gCanvas.getContext('2d');
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
    addLine();
    dragAndDrop();
}