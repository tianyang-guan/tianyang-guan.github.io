(function ($) {
    "use strict"


    let list = ["test.mp3", "attention.mp3", "shapeofyou1.mp3", "shapeofyou2.mp3", "snow.mp3", "wedonottalk.mp3", "legend.mp3"];
    let musicList = [];
    let history = [];





    list.forEach(element => {
        element = "./music/" + element;
        musicList.push(element);
    });
    let audio = prepareMusic();

    function randomNumber(start, end) {
        return Math.floor(Math.random() * (end - start)) + start;
    }

    function chooseMusic(audio, number, inhistory = true) {
        if (number !== undefined) {
            number = Math.floor(number);
            if (musicList.length <= number || number < 1) {
                number = 0;
            }
        } else {
            number = randomNumber(1, musicList.length);
        }
        if (number !== 0 && inhistory) {
            history.push(number);
        }

        let tempSrc = audio.src;
        audio.src = musicList[number];
        // console.log(tempSrc);
        // console.log(audio.src);
        if (tempSrc === audio.src) {
            // console.log("choose again.")
            chooseMusic(audio);
        }
    }

    function prepareMusic() {
        let myAudio = new Audio();
        myAudio.preload = false;
        myAudio.controls = true;
        myAudio.hidden = true;
        myAudio.loop = false;

        chooseMusic(myAudio);

        myAudio.addEventListener("ended", playEndedHandler, false);

        function playEndedHandler() {
            chooseMusic(myAudio);
            myAudio.play();
        }

        myAudio.volume = 0;

        return myAudio;
    }

    $(".realbody").scroll(() => {
        let scroll = $(".realbody").scrollTop();
        let position = scroll >= 800 ? 800 : scroll;
        let result = Math.floor(position / 10) / 500;
        let mobile_menu_list = $(".navbar__mobile .nav-list");

        if (mobile_menu_list.css("display") === 'none') {

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

    $(".nav-link__home").click(() => {
        let offset = $("#Home").offset();
        console.log("resume_postiton: ", offset);
        $(".realbody").animate({
            scrollTop: $(".realbody").scrollTop() + offset.top
        })
    });

    $(".nav-link__resume").click(() => {
        let offset = $("#Resume").offset();
        console.log("resume_postiton: ", offset);
        $(".realbody").animate({
            scrollTop: $(".realbody").scrollTop() + offset.top
        })
    });

    $(".nav-link__services").click(() => {
        let offset = $("#Services").offset();
        $(".realbody").animate({
            scrollTop: $(".realbody").scrollTop() + offset.top
        })
    });

    $(".nav-link__blog").click(() => {
        let offset = $("#Blog").offset();
        $(".realbody").animate({
            scrollTop: $(".realbody").scrollTop() + offset.top
        })
    });

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

    let TimeFn = null;
    let TimeDoubleFun = null;
    let doubleClick = 0;
    $(".picture").click(() => {
        clearTimeout(TimeFn)
        if (doubleClick) {
            clearTimeout(TimeDoubleFun);
        }
        TimeFn = setTimeout(() => {
            if (doubleClick) {
                // 三连击
                console.log("3 click");
                doubleClick = 0;
                if (history.length === 0) {
                    if (audio.paused && count === 0) {
                        chooseMusic(audio);
                        musicPlay();
                    } else {
                        audio.pause();
                        changeRadomMusic();
                    }
                } else {
                    history.pop();
                    let musicNumber = history[history.length - 1];
                    if (musicNumber !== 0) {
                        chooseMusic(audio, musicNumber, false);
                    } else {
                        chooseMusic(audio);
                    }
                    musicPlay();
                }
            } else if (audio.paused && count === 0) {
                // 暂停中
                musicPlay();
            } else {
                // 播放中
                musicPause();
            }
        }, 300);
    });

    function changeRadomMusic() {
        audio.currentTime = 0;
        chooseMusic(audio);
        audio.load();
        setTimeout(() => {
            audio.play();
        }, 300);
    }

    $(".picture").dblclick(() => {
        clearTimeout(TimeFn);
        doubleClick = 1;
        TimeDoubleFun = setTimeout(() => {
            if (audio.paused && count === 0) {
                // 暂停中
                audio.currentTime = 0
                musicPlay();
            } else {
                // 播放中
                audio.pause();
                changeRadomMusic();
            }
            doubleClick = 0;
        }, 300);

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

    let navbar_background_color;
    let navbar_box_shadow;

    $(".nav-menu").click(() => {
        let mobile_menu_list = $(".navbar__mobile .nav-list");
        let navbar = $(".navbar");
        if (mobile_menu_list.css("display") === 'none') {
            mobile_menu_list.css("display", "block");
            navbar_background_color = $(".navbar").css("background-color");
            navbar_box_shadow = $(".navbar").css("box_shadow");
            $(".navbar").removeAttr("style");
            navbar.addClass("show-list");
            $(".nav-menu").text("MENU △");
        } else {
            mobile_menu_list.css("display", "none");
            navbar.removeClass("show-list");
            $(".navbar").css("background-color", "navbar_background_color");
            $(".navbar").css("box_shadow", "navbar_box_shadow");
            $(".nav-menu").text("MENU ▽");
        }
    });

    document.addEventListener('DOMContentLoaded', event => {
        loadImage('wallpaper');
        loadImage('pictureImage', 'picture');
        let offset = $("#Home").offset();
        console.log("resume_postiton: ", offset);
        $(".realbody").animate({
            scrollTop: $(".realbody").scrollTop() + offset.top
        })

    });

    audio.addEventListener('loadeddata', () => {
        let duration = audio.duration;
    })

})(jQuery);

