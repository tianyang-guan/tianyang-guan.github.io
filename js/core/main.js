(function ($) {
    "use strict";

    let list = [
        "test.mp3",
        "attention.mp3",
        "shapeofyou1.mp3",
        "shapeofyou2.mp3",
        "snow.mp3",
        "wedonottalk.mp3",
        "legend.mp3",
    ];
    let musicList = [];
    let history = [];
    let abs_list = new Array();
    let block_list = new Array();

    let mode = 1; //desktop mode :1 , mobile mode :0 default desktop mode

    abs_list_init();
    block_init();

    function abs_list_init() {
        list_init("#Home");
        list_init("#Resume");
        list_init("#Services");
        list_init("#Blog");
        // list_init("#Contact");

        function list_init(element) {
            abs_list[element] = abs_position(element);
        }
    }

    function block_init() {
        block_init_base(".home-block");
        block_init_base(".resume-block");
        block_init_base(".services-block");
        block_init_base(".blog-block");
        // block_init_base(".contact-block");

        function block_init_base(element) {
            let name = "#" + fisrstUpperCase(element.slice(1, -6));
            block_list[element] = name;
            // console.log(element, name);
        }
    }

    function abs_position(element) {
        let offset = $(element).offset();
        // console.log("offset.top: ", Math.floor(offset.top), "scrollTop: ", $(".realbody").scrollTop());
        return $(".realbody").scrollTop() + Math.floor(offset.top);
    }

    function fisrstUpperCase(str) {
        return str[0].toUpperCase() + str.slice(1).toLowerCase();
    }

    list.forEach((element) => {
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

    function navbarColorChange() {
        let scroll = $(".realbody").scrollTop();
        let position = scroll >= 800 ? 800 : scroll;
        let result = Math.floor(position / 10) / 500;
        let mobile_menu_list = $(".navbar__mobile .nav-list");

        if (mobile_menu_list.css("display") === "none") {
            $(".navbar").css(
                "background-color",
                `rgba(255, 255, 255, ${result})`
            );
            $(".navbar").css(
                "box-shadow",
                `0px 5px 5px rgba(0, 0, 0, ${result / 2})`
            );

            $("#Foot").css(
                "background-color",
                `rgba(255, 255, 255, ${result})`
            );
            $("#Foot").css(
                "box-shadow",
                `0px 5px 5px rgba(0, 0, 0, ${result / 2})`
            );
        }
    }

    let mode_store = mode;
    $(".realbody").scroll(() => {
        navbarColorChange();
        if (mode === 1) {
            // desktop mode
            pageTranslate3d(".home-block", "left", "flex");
            pageTranslate3d(".resume-block", "right");
            pageTranslate3d(".services-block", "left");
            // pageTranslate3d(".blog-block", "right");
            // donot hide contect
            mode_store = mode;
        }

        if (mode === 0) {
            // mobile mode
            if (mode_store === 1) {
                removeAttr(".home-block");
                removeAttr(".resume-block");
                removeAttr(".services-block");
                // removeAttr(".blog-block");
            }
            mode_store = mode;
        }
    });

    function isMobileMenuShow() {
        if (mode === 0 && mobile_menu_list.css("display") !== "none") {
            return true;
        }
        return false;
    }

    $(".realbody").click(() => {
        if (isMobileMenuShow()) {
            // mobile mode
            mobile_menu_hide();
        }
    });

    function removeAttr(element) {
        $(element).removeAttr("style");
    }

    function pageTranslate3d(
        element,
        direction = "right",
        display_mode = "inline-block"
    ) {
        let scroll = $(".realbody").scrollTop();

        let abs_hight = abs_list[block_list[element]];
        // console.log(element, "scroll: ", scroll, "abs_hight: ", abs_hight);
        let scroll_start = scroll - abs_hight > 0 ? scroll - abs_hight : 0;
        let scroll_deg = scroll_start / 10 >= 90 ? 90 : scroll_start / 10;
        let opacity = 1 - scroll_deg / 90;
        let deg = `${scroll_deg}deg`;
        let tr_x = `${scroll_start}px`;
        if (direction === "left") {
            deg = "-" + deg;
        } else {
            tr_x = "-" + tr_x;
        }
        $(element).css(
            "transform",
            `translateX(${tr_x}) translateY(${scroll_start}px) rotateY(${deg})`
        );
        $(element).css("opacity", opacity);
        if (opacity <= 0.1) {
            // display_mode = $(element).css("display");
            $(element).css("display", "none");
        } else {
            if ($(element).css("display") === "none") {
                $(element).css("display", display_mode);
            }
        }
    }

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
    let color_handle;
    let color_number = 0;
    function musicPlay() {
        clearInterval(color_handle);
        $(".picture").removeClass("picture-music-back");
        $(".picture").addClass("picture-music");
        // $("body").css("animation", "pureRotation 5s ease infinite");

        let color_flag = 0;
        let color_blue = "#69c0ff";
        let color_green = "#b7eb8f";
        let color_list = [color_blue, color_green];
        let direction_list = ["to bottom right", "to top left"];

        function change_list(list) {
            let temp = list[0];
            list[0] = list[1];
            list[1] = temp;
            return list;
        }

        color_handle = setInterval(() => {
            if (color_number === 100) {
                color_flag = 1;
            }
            if (color_number === 0) {
                color_flag = 0;
                color_list = change_list(color_list);
                direction_list = change_list(direction_list);
            }
            if (color_flag === 0) {
                color_number++;
            }
            if (color_flag === 1) {
                color_number--;
            }
            // if ((color_number === 75 && color_flag === 0) || (color_number === 25 && color_flag === 1)) {
            //     color_list = change_list(color_list);
            //     direction_list = change_list(direction_list)
            // }
            $("body").css(
                "background-image",
                `linear-gradient(${direction_list[0]}, ${color_list[0]} ${color_number}%, ${color_list[1]} 100%)`
            );
            // console.log(`linear-gradient(${direction_list[0]}, ${color_list[0]} ${color_number}%, ${color_list[1]} 100%)`);
        }, 24);

        // replaceElement(".home-block");

        // $(".home-block").css("background-color", "rgba(255, 255, 255, 0.1)");

        audio.volume = 0;
        let handle = setInterval(() => {
            // console.log(audio.volume)
            audio.volume += 0.002;
            if (audio.volume > 0.9) {
                clearInterval(handle);
            }
        }, 1);

        setTimeout(() => {
            audio.play();
            time_start = new Date();
        }, 500);
    }

    $(".nav-link__home").click(() => {
        $(".realbody").animate({
            scrollTop: abs_list["#Home"],
        });
    });

    $(".nav-link__resume").click(() => {
        $(".realbody").animate({
            scrollTop: abs_list["#Resume"],
        });
    });

    $(".nav-link__services").click(() => {
        $(".realbody").animate({
            scrollTop: abs_list["#Services"],
        });
    });

    $(".nav-link__blog").click(() => {
        $(".realbody").animate({
            scrollTop: abs_list["#Blog"],
        });
    });

    $(".nav-link__contact").click(() => {
        $(".realbody").animate({
            scrollTop: abs_list["#Contact"],
        });
    });

    function musicPause() {
        count = 3000 - ((new Date() - time_start) % 3000);
        // replaceElement("body");
        // console.log(count);
        // replaceElement(".home-block");
        let check_handle = setInterval(() => {
            // console.log("color_number:", color_number);
            if (color_number === 0) {
                clearInterval(color_handle);
                clearInterval(check_handle);
                $("body").removeAttr("style");
            }
        }, 24);

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
        // console.log("1 click");
        clearTimeout(TimeFn);
        if (doubleClick) {
            clearTimeout(TimeDoubleFun);
        }
        TimeFn = setTimeout(() => {
            if (doubleClick) {
                // 三连击
                // console.log("3 click");
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
        // console.log("2 click");
        clearTimeout(TimeFn);
        doubleClick = 1;
        TimeDoubleFun = setTimeout(() => {
            if (audio.paused && count === 0) {
                // 暂停中
                audio.currentTime = 0;
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
        let targetElement = targetId
            ? document.getElementById(targetId)
            : element;

        if (element.dataset.image) {
            let img = new Image();
            img.src = element.dataset.image;
            img.onload = function () {
                targetElement.classList.add("is-loaded");
            };
        }
    }

    let navbar_background_color;
    let navbar_box_shadow;
    let mobile_menu_list = $(".navbar__mobile .nav-list");
    let navbar = $(".navbar");

    function mobile_menu_show() {
        mobile_menu_list.css("display", "block");
        navbar_background_color = $(".navbar").css("background-color");
        navbar_box_shadow = $(".navbar").css("box_shadow");
        $(".navbar").removeAttr("style");
        navbar.addClass("show-list");
        $(".nav-menu").text("MENU △");
    }

    function mobile_menu_hide() {
        mobile_menu_list.css("display", "none");
        navbar.removeClass("show-list");
        $(".navbar").css("background-color", "navbar_background_color");
        $(".navbar").css("box_shadow", "navbar_box_shadow");
        $(".nav-menu").text("MENU ▽");
    }

    $(".nav-menu").click(() => {
        if (isMobileMenuShow()) {
            mobile_menu_hide();
        } else {
            mobile_menu_show();
        }
    });

    let windows_width_status = 0;
    let min_width = 600;

    document.addEventListener("DOMContentLoaded", (event) => {
        loadImage("wallpaper");
        loadImage("pictureImage", "picture");
        let offset = $("#Home").offset();
        // console.log("resume_postiton: ", offset);
        $(".realbody").animate({
            scrollTop: $(".realbody").scrollTop() + offset.top,
        });

        check_app_mode();
    });

    // audio.addEventListener('loadeddata', () => {
    //     let duration = audio.duration;
    // })

    // audio.addEventListener('playing', () => {
    //     let duration = audio.duration;
    // })

    function setGreenColor(element) {
        $(element).mouseenter(() => {
            $(`${element} h3`).addClass("setGreenColor");
        });

        $(element).mouseleave(() => {
            $(`${element} h3`).removeClass("setGreenColor");
        });
    }

    setGreenColor("#Head");
    setGreenColor("#Develop");
    setGreenColor("#Design");
    setGreenColor("#LightBox");

    function check_app_mode() {
        let width = window.innerWidth;

        if (width >= 600) {
            if (windows_width_status === 0) {
                // console.log("low to hight");
                mobile_menu_hide();
                navbarColorChange();
            }
            windows_width_status = 1;
            mode = 1; // desktop mode
        } else {
            if (windows_width_status === 1) {
                // console.log("hight to low");
            }
            windows_width_status = 0;
            mode = 0; // mobile mode
        }
    }
    check_app_mode();
    window.addEventListener("resize", (event) => {
        abs_list_init();
        check_app_mode();
    });

    function AppendZero(obj) {
        if (obj < 10) return "0" + "" + obj;
        else return obj;
    }
    function GetWeek(weeknum) {
        switch (weeknum) {
            case 0:
                return "Sunday";
            case 1:
                return "Monday";
            case 2:
                return "Tuesday";
            case 3:
                return "Wednesday";
            case 4:
                return "Thursday";
            case 5:
                return "Friday";
            case 6:
                return "Saturday";
            default:
                break;
        }
    }

    function GetTime() {
        // let time_zone = (0 - new Date().getTimezoneOffset()) * 60;
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hours = date.getHours();
        let week = GetWeek(date.getDay());
        let minutes = AppendZero(date.getMinutes());
        let seconds = AppendZero(date.getSeconds());

        let result = `${year} - ${month} - ${day}     ${hours} : ${minutes} : ${seconds}    ${week}`;

        return result;
    }

    setInterval(() => {
        $(".time").text(GetTime());
        // console.log(GetTime());
    }, 100);
})(jQuery);
