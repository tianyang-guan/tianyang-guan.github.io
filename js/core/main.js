(function ($) {
    "use strict"
    $(".realbody").scroll(function () {
        let scroll = $(".realbody").scrollTop();
        let result = Math.floor(scroll / 10) / 500;
        if (scroll < 800) {
            $(".navbar").css("background-color", `rgba(255, 255, 255, ${result})`);
            $(".navbar").css("box-shadow", `0px 5px 5px rgba(0, 0, 0, ${result / 2})`);
        }
    });

    function loadImage(id, targetId) {
        let element = document.getElementById(id);
        let targetElement = targetId ? document.getElementById(targetId) : element;
        if (element.dataset.image) {
            let img = new Image();
            img.src = element.dataset.image;
            img.onload = function () {
                targetElement.classList.add('is-loaded');
            }
        }
    }

    document.addEventListener('DOMContentLoaded', event => {
        loadImage('wallpaper');
        loadImage('pictureImage', 'picture');
    });


})(jQuery);

