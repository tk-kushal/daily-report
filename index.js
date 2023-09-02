import { calanderSwipe, updateButtons } from "./buttonClick.js";
import { auth, signIn, signOut } from "./firebase.js";
const REPORT = "/",
  CALANDER = "/calander",
  PROFILE = "/profile";
let questions = {
  title: { type: "small-text", id: "title", lable: "Name Your Day", order: 1 },
  exercise: {
    type: "toggle",
    id: "exercise",
    lable: "Did You Exercise Today?",
    order: 2,
  },
  reading: {
    type: "toggle",
    id: "reading",
    lable: "Did You Read Today?",
    order: 3,
  },
  meditation: {
    type: "toggle",
    id: "meditation",
    lable: "Did You Meditate Today?",
    order: 4,
  },
  feel: {
    type: "slider",
    id: "feel",
    lable: "How did you feel today?",
    order: 5,
    emotes: ["☹️", "🙁", "😐", "🙂", "😄"],
  },
  energylevel: {
    type: "slider",
    id: "energylevel",
    lable: "What was your energy level?",
    order: 6,
    emotes: ["☹️", "🙁", "😐", "🙂", "😄"],
  },
  health: {
    type: "slider",
    id: "health",
    lable: "How was your Health?",
    order: 7,
    emotes: ["☹️", "🙁", "😐", "🙂", "😄"],
  },
  emotions: {
    type: "slider",
    id: "emotions",
    lable: "How did you feel Emotionaly?",
    order: 8,
    emotes: ["💔", "❤️‍🩹", "❤️", "💓", "💖"],
  },
  aboutday: {
    type: "large-text",
    id: "aboutday",
    lable: "Write about your day",
    order: 9,
  },
};
let editQuestions = window.structuredClone(questions);
let questionsDom = [];
const questionsContainer =
  document.getElementsByClassName("questionsContainer")[0];
const reportBtn = document.getElementsByClassName("reportBtn")[0];
const calanderBtn = document.getElementsByClassName("calanderBtn")[0];
const userBtn = document.getElementsByClassName("userBtn")[0];
const title = document.getElementsByClassName("text")[0];
const navbarContainer = document.getElementsByClassName("navbar")[0];
const reportSection = document.getElementsByClassName("report")[0];
const calanderSection = document.getElementsByClassName("calander")[0];
const profileSection = document.getElementsByClassName("profile")[0];
const loginBtn = document.getElementsByClassName("loginBtn")[0];
const profilePicture = document.getElementById("profilePicture");
const profileIcon = document.getElementById("profileIcon");
const yearControlls = document.getElementsByClassName("yearControlls")[0];
const monthControlls = document.getElementsByClassName("monthControlls")[0];
const prevMonthButton = document.getElementsByClassName("previousMonthBtn")[0];
const nextMonthButton = document.getElementsByClassName("nextMonthBtn")[0];
const resetCalanderButton = document.getElementsByClassName("resetBtn")[0];
const reportDate = document.getElementsByClassName("date-day")[0];
const reportMonth = document.getElementsByClassName("month")[0];
const reportYear = document.getElementsByClassName("year")[0];
const reportEditBtn = document.getElementsByClassName("edit")[0];
const reportAddQuestionBtn = document.getElementsByClassName("add")[0];
const addQuestionPopup = document.getElementsByClassName("popup")[0];
const reportEditCancleBtn = document.getElementsByClassName("cancle")[0];
const reportEditDoneBtn = document.getElementsByClassName("done")[0];
const reportEditControlls = document.getElementsByClassName(
  "report-edit-controlls"
)[0];

let sliders = document.getElementsByClassName("emojiSlider");
let toggleButtons = document.getElementsByClassName("yes-no-button");
let overallDate = new Date();
let todaysDate = overallDate.getDate();
let todaysMonth = overallDate.getMonth();
let todaysYear = overallDate.getFullYear();
let currentMonth = todaysMonth;
let currentYear = todaysYear;
let selectedMonth = todaysMonth;
let selectedYear = todaysYear;
let selectedDate = todaysDate;
let currentView = REPORT;
let updateTimeout = 2000; // 3 seconds
let dataChanged = false;
let initialize = true;
let currentReport = {
  feel: null,
  energy: null,
};
let hold = false; //for Dragging in Slider
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

setupReportSection();

function createQuestion(questionData) {
  let type = questionData.type;
  let question = document.createElement("div");
  let questionEditControlls = document.createElement("div");
  let questionContainer = document.createElement("div");
  question.classList.add("question");
  questionEditControlls.classList.add("editControlls");
  questionEditControlls.classList.add("hidden");
  questionContainer.classList.add("questionContainer");
  questionEditControlls.innerHTML = `
              <div>
                <div class="positionControlls">
                  <div class="downbtn ripple-button">
                    <i class="fa-solid fa-angle-down"></i>
                  </div>
                  <div class="upbtn ripple-button">
                    <i class="fa-solid fa-angle-up"></i>
                  </div>
                </div>
                <div class="detailedEditBtn ripple-button">
                  <i class="fa-solid fa-pen"></i>
                </div>
                <div class="detailedControlls hidden">
                  <div class="delete ripple-button">
                    <i class="fa-solid fa-trash"></i>
                  </div>
                  <div class="cancle ripple-button">
                    <i class="fa-solid fa-xmark"></i>
                  </div>
                  <div class="done ripple-button">
                    <i class="fa-solid fa-check"></i>
                  </div>
                </div>
              </div>
              <div class="detailedControllsContainer hidden">
                <input
                  type="text"
                  name=""
                  placeholder="name"
                  class="questionId editInput"
                />
                <input
                  type="text"
                  name=""
                  placeholder="Lable"
                  class="questionLable editInput"
                />
              </div>
  `;

  let upBtn = questionEditControlls.getElementsByClassName("upbtn")[0];
  let downBtn = questionEditControlls.getElementsByClassName("downbtn")[0];
  let detailedEditBtn =
    questionEditControlls.getElementsByClassName("detailedEditBtn")[0];
  let deleteBtn = questionEditControlls.getElementsByClassName("delete")[0];
  let cancleBtn = questionEditControlls.getElementsByClassName("cancle")[0];
  let doneBtn = questionEditControlls.getElementsByClassName("done")[0];
  let questionDetailedControlls =
    questionEditControlls.getElementsByClassName("detailedControlls")[0];
  let questionDetailedControllsContainer =
    questionEditControlls.getElementsByClassName(
      "detailedControllsContainer"
    )[0];
  let questionIdInput =
    questionEditControlls.getElementsByClassName("questionId")[0];
  let questionLableInput =
    questionEditControlls.getElementsByClassName("questionLable")[0];

  upBtn.addEventListener("click", () => {
    questionOrderChangeUp(questionData.id);
  });
  downBtn.addEventListener("click", () => {
    questionOrderChangeDown(questionData.id);
  });
  detailedEditBtn.addEventListener("click", () => {
    setTimeout(() => {
      detailedEditBtn.classList.add("hidden");
      questionDetailedControlls.classList.remove("hidden");
      questionDetailedControllsContainer.classList.remove("hidden");
    }, 200);
  });
  cancleBtn.addEventListener("click", () => {
    setTimeout(() => {
      detailedEditBtn.classList.remove("hidden");
      questionDetailedControlls.classList.add("hidden");
      questionDetailedControllsContainer.classList.add("hidden");
    }, 200);
  });
  if (questionData.order == 1) {
    question.style.marginTop = "0px";
  }
  if (questionData.order == Object.keys(questions).length) {
    question.style.border = "none";
    question.style.paddingBottom = "0px";
  }
  question.style.order = questionData.order;
  switch (type) {
    case "small-text":
      questionContainer.innerHTML = `
        <input type="text" placeholder="${questionData.lable}" id="${questionData.id}" />
      `;
      questionContainer
        .getElementsByTagName("input")[0]
        .addEventListener("input", (e) => {
          changeQuestionValue(questionData.id, e.target.value);
        });
      break;
    case "toggle":
      questionContainer.innerHTML = `
        <div class="lable">${questionData.lable}</div>
        <div class="yes-no-button" id=${questionData.id}>
          <div class="yes">Yes</div>
          <div class="No selectedYesNoBtn">No</div>
          <div class="indicator indicator-off"></div>
        </div>
        `;
      break;
    case "slider":
      questionContainer.innerHTML = `
          <div class="lable">${questionData.lable}</div>
          <div class="slider" id="${questionData.id}">
            <div class="star-input">
              <span>${questionData.emotes[0]}</span>
              <span>${questionData.emotes[1]}</span>
              <span>${questionData.emotes[2]}</span>
              <span>${questionData.emotes[3]}</span>
              <span>${questionData.emotes[4]}</span>
            </div>
            <input
              type="range"
              class="emojiSlider"
              value="2"
              max="4"
            />
          </div>
        `;
      break;
    case "large-text":
      questionContainer.innerHTML = `
          <textarea
            id="${questionData.id}"
            rows="20"
            placeholder="${questionData.lable}"
            oninput="resizeTextbox(this)"
          ></textarea>
        `;
      questionContainer
        .getElementsByTagName("textarea")[0]
        .addEventListener("input", (e) => {
          changeQuestionValue(questionData.id, e.target.value);
        });
      break;
    default:
      break;
  }
  question.appendChild(questionEditControlls);
  question.appendChild(questionContainer);
  return question;
}
function setupReportSection() {
  let questionsKeys = Object.keys(questions);
  questionsContainer.innerHTML = "";
  for (let i = 0; i < questionsKeys.length; i++) {
    let question = createQuestion(questions[questionsKeys[i]]);
    questionsContainer.appendChild(question);
    questionsDom[questionsKeys[i]] = question;
  }
  for (let i = 0; i < toggleButtons.length; i++) {
    let yesButton = toggleButtons[i].getElementsByClassName("yes")[0];
    let noButton = toggleButtons[i].getElementsByClassName("No")[0];
    let indicator = toggleButtons[i].getElementsByClassName("indicator")[0];
    let id = toggleButtons[i].id;
    yesButton.addEventListener("click", () => {
      indicator.classList.remove("indicator-off");
      noButton.classList.remove("selectedYesNoBtn");
      yesButton.classList.add("selectedYesNoBtn");
      changeQuestionValue(id, true);
    });
    noButton.addEventListener("click", () => {
      indicator.classList.add("indicator-off");
      yesButton.classList.remove("selectedYesNoBtn");
      noButton.classList.add("selectedYesNoBtn");
      changeQuestionValue(id, false);
    });
    //yes
    toggleButtons[i].addEventListener("swiped-left", () => {
      indicator.classList.remove("indicator-off");
      noButton.classList.remove("selectedYesNoBtn");
      yesButton.classList.add("selectedYesNoBtn");
      changeQuestionValue(id, true);
    });
    //no
    toggleButtons[i].addEventListener("swiped-right", () => {
      indicator.classList.add("indicator-off");
      yesButton.classList.remove("selectedYesNoBtn");
      noButton.classList.add("selectedYesNoBtn");
      changeQuestionValue(id, false);
    });
  }
  for (let i = 0; i < sliders.length; i++) {
    let id = sliders[i].parentElement.id;
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
    sliders[i].addEventListener("touchend", (e) => {
      changeQuestionValue(id, e.target.value);
      hold = false;
    });
    sliders[i].addEventListener("mouseup", (e) => {
      changeQuestionValue(id, e.target.value);
      hold = false;
    });
    initiateEmojiPosition(sliders[i]);
  }
  updateButtons();
}
function changeQuestionValue(id, value) {
  if (questions[id].value != value) {
    questions[id].value = value;
    updateTimeout = 2000;
    dataChanged = true;
  }
}
//this will update the data to the server if certain time passed after an input
setInterval(() => {
  if (updateTimeout > 0) {
    updateTimeout -= 100;
  } else if (dataChanged) {
    console.log("data changed and updating");
    console.log(questions);
    dataChanged = false;
  }
}, 100);
function handleUrlChangeEvent() {
  let path = window.location.pathname;
  //so that the transition does not occur when reloading the page or loading another page besies the report page directly form url
  if (initialize && (path == REPORT || path == CALANDER || path == PROFILE)) {
    currentView = path;
    initialize = false;
  }

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
function updateReportSection() {
  for (let i = 0; i < sliders.length; i++) {
    initiateEmojiPosition(sliders[i]);
  }
}
function updateView(view) {
  currentView = view;
  if (currentView === REPORT) {
    reportDate.innerText = todaysDate;
    reportMonth.innerText = getMonth(todaysMonth);
    reportYear.innerText = todaysYear;
    title.innerText = "Report";
    reportBtn.classList.add("selected");
    calanderBtn.classList.remove("selected");
    userBtn.classList.remove("selected");
    reportSection.style.display = "block";
    calanderSection.style.display = "none";
    profileSection.style.display = "none";
    updateReportSection();
  } else if (currentView === CALANDER) {
    title.innerText = "Calander";
    calanderBtn.classList.add("selected");
    reportBtn.classList.remove("selected");
    userBtn.classList.remove("selected");
    reportSection.style.display = "none";
    calanderSection.style.display = "block";
    profileSection.style.display = "none";
    updateCalander();
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
function updateCalander() {
  yearControlls.innerText = currentYear;
  monthControlls.innerText = getMonth(currentMonth);
  populateCalander(todaysDate, currentMonth, currentYear);
}
function populateCalander(date, month, year) {
  const daysContainer = document.getElementsByClassName("days")[0];
  let daysDom = "";
  let leapYear = isLeapYear(year);
  let prevMonthDays = getDaysInMonth(leapYear, month - 1);
  let thisMonthDays = getDaysInMonth(leapYear, month);
  let firstDateDay = getDateDay(1, month, year);
  let lastDateDay = getDateDay(thisMonthDays, month, year);
  for (let i = prevMonthDays - firstDateDay + 1; i <= prevMonthDays; i++) {
    daysDom += `
    <div class="day otherMonthDay">${i}</div>
    `;
  }
  for (let i = 1; i <= thisMonthDays; i++) {
    daysDom += `
    <div class="day ${
      selectedDate == i && month == selectedMonth && year == selectedYear
        ? "selectedDay"
        : ""
    }">${i}</div>
    `;
  }
  for (let i = 1; i <= 6 - lastDateDay; i++) {
    daysDom += `
    <div class="day otherMonthDay">${i}</div>
    `;
  }
  daysContainer.innerHTML = daysDom;
}
function isLeapYear(year) {
  let leapYear = false;
  if (year % 100 == 0) {
    if (year % 400 == 0) {
      leapYear = true;
    }
  } else if (year % 4 == 0) {
    leapYear = true;
  }
  return leapYear;
}
function getDateDay(date, month, year) {
  let ReferenceYear = 2023;
  let YearsFirstDay = 0;
  let yearOffset = year - ReferenceYear;
  let daysOffset = 0;
  let day = 0;
  if (year < ReferenceYear) {
    let leapYearsInBetween = 0;
    for (let i = year; i < ReferenceYear; i++) {
      if (isLeapYear(i)) {
        leapYearsInBetween++;
      }
    }
    yearOffset = yearOffset - leapYearsInBetween;
  } else if (year > ReferenceYear) {
    let leapYearsInBetween = 0;
    for (let i = ReferenceYear; i < year; i++) {
      if (isLeapYear(i)) {
        leapYearsInBetween++;
      }
    }
    yearOffset = yearOffset + leapYearsInBetween;
  }
  if (yearOffset > 0) {
    YearsFirstDay = yearOffset % 7;
  }
  if (yearOffset < 0) {
    YearsFirstDay = yearOffset % 7;
    if (yearOffset % 7 < 0) {
      YearsFirstDay = 7 + (yearOffset % 7);
    }
  }
  for (let i = 0; i < month; i++) {
    daysOffset += getDaysInMonth(isLeapYear(year), i);
  }
  daysOffset += date - 1;
  day = (daysOffset + YearsFirstDay) % 7;
  return day;
}
function getDaysInMonth(leapYear, month) {
  if (month < 0) {
    month == 11 + month;
  } else if (month > 11) {
    month = month - 10;
  }
  if (month <= 6) {
    if (month % 2 == 0) {
      return 31;
    } else if (month == 1 && leapYear) {
      return 29;
    } else if (month == 1) {
      return 28;
    } else {
      return 30;
    }
  } else if (month <= 11) {
    if (month % 2 == 0) {
      return 30;
    } else {
      return 31;
    }
  } else {
    return 0;
  }
}
function getMonth(month) {
  switch (month) {
    case 0:
      return "Jan";
      break;

    case 1:
      return "Feb";
      break;

    case 2:
      return "Mar";
      break;

    case 3:
      return "Apr";
      break;

    case 4:
      return "May";
      break;

    case 5:
      return "Jun";
      break;

    case 6:
      return "Jul";
      break;

    case 7:
      return "Aug";
      break;

    case 8:
      return "Sep";
      break;

    case 9:
      return "Oct";
      break;

    case 10:
      return "Nov";
      break;
    case 11:
      return "Dec";
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
function showQuestionsEditControlls() {
  let questionsKeys = Object.keys(questions);
  for (let i = 0; i < questionsKeys.length; i++) {
    let question = questionsDom[questionsKeys[i]];

    question.children[0].classList.remove("hidden");
    question.children[1].classList.add("questionEditing");
  }
}
function hideQuestionsEditControlls() {
  let questionsKeys = Object.keys(questions);
  for (let i = 0; i < questionsKeys.length; i++) {
    let question = questionsDom[questionsKeys[i]];
    question.children[0].classList.add("hidden");
    question.children[0]
      .getElementsByClassName("detailedEditBtn")[0]
      .classList.remove("hidden");
    question.children[0]
      .getElementsByClassName("detailedControlls")[0]
      .classList.add("hidden");
    question.children[0]
      .getElementsByClassName("detailedControllsContainer")[0]
      .classList.add("hidden");
    question.children[1].classList.remove("questionEditing");
  }
}
function questionOrderChangeUp(id) {
  let questionsKeys = Object.keys(questions);
  let currentQuestion = questionsDom[id];
  let order = editQuestions[id].order;
  for (let i = 0; i < questionsKeys.length; i++) {
    let questionOrder = editQuestions[questionsKeys[i]].order;
    if (order - 1 == questionOrder && questionsKeys[i] != id) {
      currentQuestion.style.order = order - 1;
      questionsDom[questionsKeys[i]].style.order =
        editQuestions[questionsKeys[i]].order + 1;
      editQuestions[questionsKeys[i]].order += 1;
      editQuestions[id].order -= 1;
    }
  }
}
function questionOrderChangeDown(id) {
  let questionsKeys = Object.keys(questions);
  let currentQuestion = questionsDom[id];
  let order = editQuestions[id].order;
  for (let i = 0; i < questionsKeys.length; i++) {
    let questionOrder = editQuestions[questionsKeys[i]].order;
    if (order + 1 == questionOrder && questionsKeys[i] != id) {
      currentQuestion.style.order = order + 1;
      questionsDom[questionsKeys[i]].style.order =
        editQuestions[questionsKeys[i]].order - 1;
      editQuestions[questionsKeys[i]].order -= 1;
      editQuestions[id].order += 1;
    }
  }
}
export function monthChange(direction, ripple = true) {
  if (direction === "previous") {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    if (ripple == true) {
      calanderSwipe("left");
    }
  } else if (direction === "next") {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    if (ripple == true) {
      calanderSwipe("right");
    }
  }
  updateCalander();
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
prevMonthButton.addEventListener("click", () => {
  monthChange("previous");
});
nextMonthButton.addEventListener("click", () => {
  monthChange("next");
});
resetCalanderButton.addEventListener("click", () => {
  currentMonth = todaysMonth;
  currentYear = todaysYear;
  calanderSwipe("reset");
  updateCalander();
});
reportEditBtn.addEventListener("click", () => {
  setTimeout(() => {
    reportEditControlls.classList.remove("hidden");
    reportEditBtn.parentElement.classList.add("hidden");
    showQuestionsEditControlls();
  }, 100);
});
reportEditCancleBtn.addEventListener("click", () => {
  setTimeout(() => {
    reportEditControlls.classList.add("hidden");
    reportEditBtn.parentElement.classList.remove("hidden");
    addQuestionPopup.classList.add("hidden");
    setupReportSection();
  }, 100);
});
reportEditDoneBtn.addEventListener("click", () => {
  setTimeout(() => {
    reportEditControlls.classList.add("hidden");
    reportEditBtn.parentElement.classList.remove("hidden");
    addQuestionPopup.classList.add("hidden");
    questions = window.structuredClone(editQuestions);
    hideQuestionsEditControlls();
    setupReportSection();
  }, 100);
});
reportAddQuestionBtn.addEventListener("click", (e) => {
  if (addQuestionPopup.classList.contains("hidden")) {
    let height = e.srcElement.offsetHeight + 20;
    addQuestionPopup.style.top = height + "px";
    addQuestionPopup.classList.remove("hidden");
  } else {
    addQuestionPopup.classList.add("hidden");
  }
});
