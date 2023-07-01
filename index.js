const REPORT = "report",
  CALANDER = "calander",
  PROFILE = "profile";
const reportBtn = document.getElementsByClassName("report")[0];
const calanderBtn = document.getElementsByClassName("calander")[0];
const userBtn = document.getElementsByClassName("user")[0];
const body = document.getElementsByTagName("body")[0];
const title = document.getElementsByClassName("title")[0];
const selectedColors = ["red", "orange", "yellow", "lightgreen", "cyan"];
const navbarContainer = document.getElementsByClassName("navbarContainer")[0];
const sliders = document.getElementsByClassName("emojiSlider");
let currentView = REPORT;
let currentReport = {
  feel:null,
  energy:null
};
let hold = false;
for (let i = 0; i < sliders.length; i++) {
  
  sliders[i].addEventListener('change', (e) => {
    handleEmojiSliderEvent(e,e.x)
    });
  sliders[i].addEventListener('touchstart', (e) => {
    hold = true;
    handleEmojiSliderEvent(e,e.changedTouches[0].pageX)
    });
  sliders[i].addEventListener('mousedown', (e) => {
    hold = true;
    handleEmojiSliderEvent(e,e.x)
    });
  sliders[i].addEventListener('touchmove', (e) => {handleEmojiSliderEvent(e,e.changedTouches[0].pageX)
    hold = true});
  sliders[i].addEventListener('mousemove', (e) => handleEmojiSliderEvent(e,e.x));
  sliders[i].addEventListener('touchend', (e) => hold = false);
  sliders[i].addEventListener('mouseup', (e) => hold = false);
}
function handleEmojiSliderEvent(e,x) {
  let parent = e.srcElement.parentElement;
  let sliderRect = parent.children[1].getBoundingClientRect();
  let number = e.srcElement.value;
  let offsetX = x-sliderRect.x;
  if(offsetX<=sliderRect.width-10&&offsetX>10&&hold){
    parent.children[0].style.left = offsetX+'px'
  }
  for (let i = 0; i < parent.children[0].children.length; i++) {
    if (number == i) {
      parent.children[0].children[i].style.display = "inline-block"
    } else {
      parent.children[0].children[i].style.display = "none"
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
  } else if (currentView === CALANDER) {
    title.innerText = "Calander";
    calanderBtn.classList.add("selected");
    reportBtn.classList.remove("selected");
    userBtn.classList.remove("selected");
  } else if (currentView === PROFILE) {
    title.innerText = "Profile";
    userBtn.classList.add("selected");
    reportBtn.classList.remove("selected");
    calanderBtn.classList.remove("selected");
  } else {
  }
}
function transtition(e, element, view) {
  element.style.zIndex = "10";
  let transition = document.createElement("div");
  let transitionContainer = document.createElement("div");
  let rect = element.getBoundingClientRect();
  let x = rect.left + e.target.clientWidth / 2;
  let y = rect.top + e.target.clientHeight / 2;
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
updateView(REPORT);
reportBtn.addEventListener("click", (e) => {
  transtition(e, reportBtn, REPORT);
});
calanderBtn.addEventListener("click", (e) => {
  transtition(e, calanderBtn, CALANDER);
});
userBtn.addEventListener("click", (e) => {
  transtition(e, userBtn, PROFILE);
});
