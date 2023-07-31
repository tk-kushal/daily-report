import { auth, signIn, signOut } from "./firebase.js";
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
const toggleButtons = document.getElementsByClassName("yes-no-button");
const reportSection = document.getElementsByClassName("report")[0];
const calanderSection = document.getElementsByClassName("calander")[0];
const profileSection = document.getElementsByClassName("profile")[0];
const loginBtn = document.getElementsByClassName("loginBtn")[0];
const profilePicture = document.getElementById("profilePicture");
const profileIcon = document.getElementById("profileIcon");
let currentView = REPORT;
let currentReport = {
  feel: null,
  energy: null,
};
//for Dragging in Slider
let hold = false;
let currentUser = null;
auth.onAuthStateChanged((user) => {
  currentUser = user;
  if (currentUser) {
    loginBtn.style.display = "flex";
    loginBtn.innerText = "Logout";
    profilePicture.src = currentUser.photoURL;
    profilePicture.style.display = "flex";
    profileIcon.style.display = "none";
  } else {
    loginBtn.style.display = "flex";
    loginBtn.innerText = "Login";
    profilePicture.style.display = "none";
    profileIcon.style.display = "flex";
  }
});
loginBtn.addEventListener("click", () => {
  if (currentUser) {
    signOut();
  } else {
    signIn();
  }
});
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
    } else {
      transtition(
        null,
        reportBtn,
        REPORT,
        reportBtn.getBoundingClientRect().left,
        reportBtn.getBoundingClientRect().top
      );
    }
  } else {
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
for (let i = 0; i < toggleButtons.length; i++) {
  let yesButton = toggleButtons[i].getElementsByClassName("yes")[0];
  let noButton = toggleButtons[i].getElementsByClassName("No")[0];
  let indicator = toggleButtons[i].getElementsByClassName("indicator")[0];
  yesButton.addEventListener("click", () => {
    indicator.classList.remove("indicator-off");
    noButton.classList.remove("selectedYesNoBtn");
    yesButton.classList.add("selectedYesNoBtn");
  });
  noButton.addEventListener("click", () => {
    indicator.classList.add("indicator-off");
    yesButton.classList.remove("selectedYesNoBtn");
    noButton.classList.add("selectedYesNoBtn");
  });
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
    initCalander();
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
function initCalander() {
  let overallDate = new Date();
  let todaysDate = overallDate.getDate();
  let todaysDay = overallDate.getDay();
  let todaysMonth = overallDate.getMonth();
  let todaysYear = overallDate.getFullYear();
  let yearControlls = document.getElementsByClassName("yearControlls")[0];
  let monthControlls = document.getElementsByClassName("monthControlls")[0];
  yearControlls.innerText = todaysYear;
  monthControlls.innerText = getMonth(todaysMonth);
  populateCalander(todaysDay, todaysDate, todaysMonth, todaysYear);
}
function populateCalander(day, date, month, year) {
  let leapYear = false;
  if (year % 100 == 0) {
    if (year % 400 == 0) {
      leapYear = true;
    }
  } else if (year % 4 == 0) {
    leapYear = true;
  }
  let prevMonthDays = getDaysInMonth(leapYear,month-1)
  let thisMonthDays = getDaysInMonth(leapYear,month)
  let firstDateDay = getFirstDateDay(month,year)
  console.log(day)
  console.log(firstDateDay)
}
function getFirstDateDay(month,year){
  
}
function getDaysInMonth(leapYear,month){
  if(month<0){
    month==11+month;
  }else if(month>11){
    month = month-10
  }
  if(month<=6){
    if(month%2==0){
      return 31;
    }else if(month == 1 && leapYear){
      return 29;
    }else if(month == 1){
      return 28;
    }else{
      return 30;
    }
  }else if(month<=11){
    if(month%2==0){
      return 30;
    }
    else{return 31}
  }else{
    return 0;
  }
}
function getMonth(month) {
  switch (month) {
    case 0:
      return "January";
      break;

    case 1:
      return "February";
      break;

    case 2:
      return "March";
      break;

    case 3:
      return "April";
      break;

    case 4:
      return "May";
      break;

    case 5:
      return "June";
      break;

    case 6:
      return "July";
      break;

    case 7:
      return "Augst";
      break;

    case 8:
      return "September";
      break;

    case 9:
      return "October";
      break;

    case 10:
      return "November";
      break;
    case 11:
      return "December";
      break;
    default:
      return "";
      break;
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
