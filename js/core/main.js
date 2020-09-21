(function ($) {
    "use strict"


    let musicList = ["attention.mp3"];

    let audio = prepareMusic(musicList);
    function prepareMusic(list) {
        let musicList = [];
        list.forEach(element => {
            element = "./music/" + element;
            musicList.push(element);
        });
        let myAudio = new Audio();
        myAudio.preload = false;
        myAudio.controls = true;
        myAudio.hidden = true;

        let src = musicList.pop();
        myAudio.src = src;
        musicList.unshift(src);
        myAudio.loop = false;
        myAudio.addEventListener("ended", playEndedHandler, false);

        function playEndedHandler() {
            src = musicList.pop();
            myAudio.src = src;
            musicList.unshift(src);
            myAudio.play();
        }

        myAudio.volume = 0;

        return myAudio;
    }

    $(".realbody").scroll(() => {

        let scroll = $(".realbody").scrollTop();
        let result = Math.floor(scroll / 10) / 500;

        if (scroll < 800) {
            $(".navbar").css("background-color", `rgba(255, 255, 255, ${result})`);
            $(".navbar").css("box-shadow", `0px 5px 5px rgba(0, 0, 0, ${result / 2})`);
        }

    });

    /**
     * replace element will let animate running again.
     * @param {*} element dom element eg: .picture
     */
    function replaceElement(element) {
        let el = $(element);
        let newone = el.clone(true);
        el.before(newone);
        $("." + el.attr("class") + ":last").remove();
    }

    $(".picture").mouseenter(() => {
        replaceElement(".about");

    });

    let count = 0;
    let time_start = 0;
    function musicPlay() {
        $(".picture").removeClass("picture-music-back");
        $(".picture").addClass("picture-music");
        audio.volume = 0;
        let handle = setInterval(() => {
            // console.log(audio.volume)
            audio.volume += 0.002;
            if (audio.volume > 0.9) {
                clearInterval(handle)
            }
        }, 1);

        setTimeout(() => {
            audio.play();
            time_start = new Date();
        }, 500);
    }

    function musicPause() {
        count = 3000 - (new Date() - time_start) % 3000;
        // console.log(count);
        let handle = setInterval(() => {
            // console.log(audio.volume)
            if (audio.volume > 0.02) {
                audio.volume -= 0.02;
            } else {
                clearInterval(handle);
                audio.volume = 0;
                audio.pause();
            }
        }, 10);
        setTimeout(() => {
            $(".picture").addClass("picture-music-back");
            $(".picture").removeClass("picture-music");
            count = 0;
        }, count);

    }

    $(".picture").click(() => {


        if (audio.paused && count === 0) {
            // 暂停中
            musicPlay();

        } else {
            // 播放中
            // let matrix3d = $(".picture").css("transform");
            // console.log(matrix3d);
            musicPause();
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

    audio.addEventListener('loadeddata', () => {
        let duration = audio.duration;
        // The duration variable now holds the duration (in seconds) of the audio clip 
        // console.log(duration);
    })




})(jQuery);

