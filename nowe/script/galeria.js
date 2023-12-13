const MINIATURKI = document.querySelectorAll(".miniaturka img");
const OKIENKO = document.querySelector(".okienko");
const OKIENKO_CLOSE = document.querySelector(".okienko__close");
const OKIENKO_IMG = document.querySelector(".okienko__img");
const ARROW_LEFT = document.querySelector(".okienko__arrow--left");
const ARROW_RIGHT = document.querySelector(".okienko__arrow--right");

let currentImgIndex;

const showNextImg = () => {
    if (currentImgIndex === MINIATURKI.length - 1) {
        currentImgIndex = 0;
    } else {
        currentImgIndex++;
    }
    OKIENKO_IMG.src = MINIATURKI[currentImgIndex].src;
};

const showPreviousImg = () => {
    if (currentImgIndex === 0) {
        currentImgIndex = MINIATURKI.length - 1;
    } else {
        currentImgIndex--;
    }
    OKIENKO_IMG.src = MINIATURKI[currentImgIndex].src;
};

const closeOkienko = () => {
    OKIENKO.classList.add("fade-out");
    setTimeout(() => {
        OKIENKO.classList.add("hidden");
        OKIENKO.classList.remove("fade-out");
        MINIATURKI.forEach((element) => {
            element.setAttribute("tabindex", 1);
        });
    }, 300);
};

MINIATURKI.forEach((miniaturka, index) => {
    const showOkienko = (e) => {
        OKIENKO.classList.remove("hidden");
        OKIENKO_IMG.src = e.target.src;
        currentImgIndex = index;
        MINIATURKI.forEach((element) => {
            element.setAttribute("tabindex", -1);
        });
    };

    miniaturka.addEventListener("click", showOkienko);

    miniaturka.addEventListener("keydown", (e) => {
        if (e.code === "Enter" || e.keyCode === 13) {
            showOkienko(e);
        }
    });
});

OKIENKO_CLOSE.addEventListener("click", closeOkienko);

ARROW_RIGHT.addEventListener("click", showNextImg);

ARROW_LEFT.addEventListener("click", showPreviousImg);



OKIENKO.addEventListener("click", (e) => {
    if (e.target === OKIENKO) {
        closeOkienko();
    }
});