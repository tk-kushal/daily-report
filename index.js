const REPORT = "/",
  CALANDER = "/calander",
  PROFILE = "/profile";
const reportBtn = document.getElementsByClassName("reportBtn")[0];
const calanderBtn = document.getElementsByClassName("calanderBtn")[0];
const userBtn = document.getElementsByClassName("userBtn")[0];
const body = document.getElementsByTagName("body")[0];
const title = document.getElementsByClassName("text")[0];
const navbarContainer = document.getElementsByClassName("navbarContainer")[0];
const sliders = document.getElementsByClassName("emojiSlider");
const reportSection = document.getElementsByClassName("report")[0];
const calanderSection = document.getElementsByClassName("calander")[0];
const profileSection = document.getElementsByClassName("profile")[0];
let currentView = REPORT;
let currentReport = {
  feel: null,
  energy: null,
};
let hold = false;

//Setting initial view ot Report
handleUrlChangeEvent();
window.onpopstate = () => handleUrlChangeEvent();
//Updating the URL based on current View
function windowNavigation(view, subpath) {
  window.history.pushState({}, view, window.location.origin + view + subpath);
}
function handleUrlChangeEvent() {
  let path = window.location.pathname;
  if (currentView !== path) {
    if (path === REPORT) {
      transtition(
        null,
        reportBtn,
        REPORT,
        reportBtn.getBoundingClientRect().left,
        reportBtn.getBoundingClientRect().top
      );
    } else if (path === CALANDER) {
      transtition(
        null,
        calanderBtn,
        CALANDER,
        calanderBtn.getBoundingClientRect().left,
        calanderBtn.getBoundingClientRect().top
      );
    } else if (path === PROFILE) {
      transtition(
        null,
        userBtn,
        PROFILE,
        userBtn.getBoundingClientRect().left,
        userBtn.getBoundingClientRect().top
      );
    }
  }else{
    updateView(currentView);
  }
}
//adding event listeners to Sliders
for (let i = 0; i < sliders.length; i++) {
  initiateEmojiPosition(sliders[i]);
  sliders[i].addEventListener("change", (e) => {
    handleEmojiSliderEvent(e, e.x);
  });
  sliders[i].addEventListener("touchstart", (e) => {
    hold = true;
    handleEmojiSliderEvent(e, e.changedTouches[0].pageX);
  });
  sliders[i].addEventListener("mousedown", (e) => {
    hold = true;
    handleEmojiSliderEvent(e, e.x);
  });
  sliders[i].addEventListener("touchmove", (e) => {
    handleEmojiSliderEvent(e, e.changedTouches[0].pageX);
    hold = true;
  });
  sliders[i].addEventListener("mousemove", (e) =>
    handleEmojiSliderEvent(e, e.x)
  );
  sliders[i].addEventListener("touchend", (e) => (hold = false));
  sliders[i].addEventListener("mouseup", (e) => (hold = false));
}
//Emoji Slider
function handleEmojiSliderEvent(e, x) {
  let parent = e.srcElement.parentElement;
  let sliderRect = parent.children[1].getBoundingClientRect();
  let number = e.srcElement.value;
  let offsetX = x - sliderRect.x;
  if (offsetX <= sliderRect.width - 10 && offsetX > 10 && hold) {
    parent.children[0].style.left = offsetX + "px";
  }
  for (let i = 0; i < parent.children[0].children.length; i++) {
    if (number == i) {
      parent.children[0].children[i].style.display = "inline-block";
    } else {
      parent.children[0].children[i].style.display = "none";
    }
  }
}
function initiateEmojiPosition(slider) {
  let emoji = slider.parentElement.children[0];
  let number = slider.value;
  let width = slider.getBoundingClientRect().width;
  let position = number * (width / (emoji.children.length - 1));
  emoji.style.left = position + "px";
  for (let i = 0; i < emoji.children.length; i++) {
    if (number == i) {
      emoji.children[i].style.display = "inline-block";
    } else {
      emoji.children[i].style.display = "none";
    }
  }
}
function updateView(view) {
  currentView = view;
  if (currentView === REPORT) {
    title.innerText = "Report";
    reportBtn.classList.add("selected");
    calanderBtn.classList.remove("selected");
    userBtn.classList.remove("selected");
    reportSection.style.display = "block";
    calanderSection.style.display = "none";
    profileSection.style.display = "none";
  } else if (currentView === CALANDER) {
    title.innerText = "Calander";
    calanderBtn.classList.add("selected");
    reportBtn.classList.remove("selected");
    userBtn.classList.remove("selected");
    reportSection.style.display = "none";
    calanderSection.style.display = "block";
    profileSection.style.display = "none";
  } else if (currentView === PROFILE) {
    title.innerText = "Profile";
    userBtn.classList.add("selected");
    reportBtn.classList.remove("selected");
    calanderBtn.classList.remove("selected");
    reportSection.style.display = "none";
    calanderSection.style.display = "none";
    profileSection.style.display = "block";
  } else {
  }
}
function transtition(e, element, view, cordX, cordY) {
  element.style.zIndex = "10";
  let transition = document.createElement("div");
  let transitionContainer = document.createElement("div");
  let rect = element.getBoundingClientRect();
  let x = cordX + element.clientWidth / 2;
  let y = cordY + element.clientHeight / 2;
  if (e) {
    x = rect.left + e.target.clientWidth / 2;
    y = rect.top + e.target.clientHeight / 2;
  }
  window.innerHeight > window.innerWidth
    ? document.documentElement.style.setProperty(
        "--circleSize",
        window.innerHeight * 3 + "px"
      )
    : document.documentElement.style.setProperty(
        "--circleSize",
        window.innerWidth * 3 + "px"
      );
  transitionContainer.classList.add("transitionContainer");
  transitionContainer.appendChild(transition);
  transition.classList.add("transition");
  navbarContainer.appendChild(transitionContainer);
  transition.style.top = y + "px";
  transition.style.left = x + "px";
  transition.classList.add("grow");
  setTimeout(() => {
    updateView(view);
  }, 250);
  setTimeout(() => {
    navbarContainer.removeChild(transitionContainer);
    element.style.zIndex = "1";
  }, 600);
}
reportBtn.addEventListener("click", (e) => {
  windowNavigation(REPORT, "");
  transtition(e, reportBtn, REPORT);
});
calanderBtn.addEventListener("click", (e) => {
  windowNavigation(CALANDER, "");
  transtition(e, calanderBtn, CALANDER);
});
userBtn.addEventListener("click", (e) => {
  windowNavigation(PROFILE, "");
  transtition(e, userBtn, PROFILE);
});
