function loadImage(id, targetId) {
    console.log(1);
    let element = document.getElementById(id);
    let targetElement = targetId ? document.getElementById(targetId) : element;
    if (element.dataset.image) {
        console.log(2);
        let img = new Image();
        img.src = element.dataset.image;
        console.log("img.src: ", img.src);
        img.onload = function () {
            targetElement.classList.add('is-loaded');
        }
    }
}

document.addEventListener('DOMContentLoaded', event => {
    loadImage('wallpaper');
    loadImage('pictureImage', 'picture');
});

