import { calanderSwipe, updateButtons } from "./buttonClick.js";
import {
  auth,
  createDocument,
  getdocuments,
  signIn,
  signOut,
} from "./firebase.js";
const REPORT = "/",
  CALANDER = "/calander",
  PROFILE = "/profile";
const NEWQUESTIONID = "newQuestionID";
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
const backdrop = document.getElementsByClassName("backdrop")[0];
const warningContainer =
  document.getElementsByClassName("warning-container")[0];
const warningCancle = document.getElementsByClassName("warning-cancle")[0];
const warningDone = document.getElementsByClassName("warning-done")[0];
const loadingElement = document.getElementsByClassName("loading")[0];
const navbar = document.getElementsByClassName("right")[0];

let loading = false;
let editing = false;
let overallDate = new Date();
let todaysDate = overallDate.getDate();
let todaysMonth = overallDate.getMonth();
let todaysYear = overallDate.getFullYear();
let dateString = todaysDate + ":" + todaysMonth + ":" + todaysYear;
let defaultQuestions = {
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
let questions = null;
let data = JSON.parse(localStorage.getItem("questions"));
if (data && data.questions) {
  questions = data.questions;
  if (data.date != dateString) {
    let questionKeys = Object.keys(questions);
    for (let i = 0; i < questionKeys.length; i++) {
      delete questions[questionKeys[i]].value;
    }
    console.log(questions);
  }
} else {
  questions = defaultQuestions;
}

// add a function to check if user is logged in if there is user, check if there is a record for today, if not, get the previous day's record and strip the questions and then process the data, in the meantime roll the loading animation.

//also think about the data handling when you are ofline and how shuld you manage the data between other devices writing offline data and them how would you merge the final data, research about this.


let editQuestions = window.structuredClone(questions);
let questionsDom = [];
let sliders = document.getElementsByClassName("emojiSlider");
let toggleButtons = document.getElementsByClassName("yes-no-button");
let currentMonth = todaysMonth;
let currentYear = todaysYear;
let selectedMonth = todaysMonth;
let selectedYear = todaysYear;
let selectedDate = todaysDate;
let currentView = REPORT;
let updateTimeout = 500;
let dataChanged = false;
let initialize = true;
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
    getdocuments();
  } else {
    loginBtn.style.display = "flex";
    loginBtn.innerText = "Login";
    profilePicture.style.display = "none";
    profileIcon.style.display = "flex";
  }
});

//Setting initial view ot Report
handleUrlChangeEvent();
window.onpopstate = () => handleUrlChangeEvent();
//Updating the URL based on current View

setupReportSection();
setInterval(() => {
  //this will update the data to the server if certain time passed after an input
  if (updateTimeout > 0) {
    updateTimeout -= 50;
  } else if (dataChanged) {
    console.log("data changed and updating");
    dataChanged = false;
    localStorage.setItem(
      "questions",
      JSON.stringify({ date: dateString, questions: questions })
    );
    loadingStop();
    let Data = {
      date: {
        date: selectedDate,
        month: selectedMonth,
        year: selectedYear,
      },
      questions: questions,
    };
    createDocument(dateString, Data);
  }
}, 50);
function windowNavigation(view, subpath) {
  window.history.pushState({}, view, window.location.origin + view + subpath);
}
function createQuestion(questionData, creating = false) {
  let type = questionData.type;
  let question = document.createElement("div");
  let questionEditControlls = document.createElement("div");
  let questionContainer = document.createElement("div");
  question.classList.add("question");
  questionEditControlls.classList.add("editControlls");
  if (!creating) {
    questionEditControlls.classList.add("hidden");
  }
  if (creating) {
    questionContainer.classList.add("questionEditing");
  }
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
                <div class="detailedEditBtn ripple-button ${
                  !creating ? "" : "hidden"
                }">
                  <i class="fa-solid fa-pen"></i>
                </div>
                <div class="detailedControlls ${creating ? "" : "hidden"}">
                  <div class="delete ripple-button">
                    <i class="fa-solid fa-trash"></i>
                  </div>
                  ${
                    creating
                      ? ""
                      : `<div class="cancle ripple-button">
                          <i class="fa-solid fa-xmark"></i>
                        </div>`
                  }
                  <div class="done ripple-button">
                    <i class="fa-solid fa-check"></i>
                  </div>
                </div>
              </div>
              <div class="detailedControllsContainer ${
                creating ? "" : "hidden"
              }">
                  ${
                    creating
                      ? `<div class="id-input-container">
                      <input
                        type="text"
                        name=""
                        placeholder="Enter a ID for the Question"
                        class="questionId editInput questionIdInvalid"
                      />
                      <div class="id-info ripple-button">
                        <i class="fa-solid fa-question"></i>
                      </div>
                    </div>`
                      : ""
                  }
                <input
                  type="text"
                  name=""
                  placeholder="Lable"
                  class="questionLable editInput"
                />
              </div>
  `;
  switch (type) {
    case "small-text":
      questionContainer.innerHTML = `
        <input type="text" placeholder="${questionData.lable}" id="${
        questionData.id
      }" value = "${questionData.value ? questionData.value : ""}"/>
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
        <div class="No">No</div>
          <div class="yes">Yes</div>
          <div class="indicator ${
            questionData.value == true ? "" : "indicator-off"
          }"></div>
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
              value=${questionData.value ? questionData.value : "2"}
              max="4"
            />
          </div>
          <div class="emojiEdit ${creating ? "" : "hidden"}">
                <input type="text" class="emojiInput" value="${
                  questionData.emotes[0]
                }"/>
                <input type="text" class="emojiInput" value="${
                  questionData.emotes[1]
                }"/>
                <input type="text" class="emojiInput" value="${
                  questionData.emotes[2]
                }"/>
                <input type="text" class="emojiInput" value="${
                  questionData.emotes[3]
                }"/>
                <input type="text" class="emojiInput" value="${
                  questionData.emotes[4]
                }"/>
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
          >${questionData.value ? questionData.value : ""}</textarea>
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
  let emojiEditContainer =
    questionContainer.getElementsByClassName("emojiEdit")[0];
  let emojiContainer =
    questionContainer.getElementsByClassName("star-input")[0];
  let emojiSlider = questionContainer.getElementsByClassName("emojiSlider")[0];
  let emojiInputs = questionContainer.getElementsByClassName("emojiInput");
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
  let idInfoBtn = questionEditControlls.getElementsByClassName("id-info")[0];
  let questionLableInput =
    questionEditControlls.getElementsByClassName("questionLable")[0];
  questionLableInput.value = questionData.lable;
  if (emojiSlider) initiateEmojiPosition(emojiSlider);
  for (let i = 0; i < emojiInputs.length; i++) {
    const element = emojiInputs[i];
    element.addEventListener("input", (e) => {
      if (e.data == null) element.value = "";
      else {
        element.value = e.data;
        editQuestions[questionData.id].emotes[i] = e.data;
        emojiContainer.children[i].innerText = e.data;
      }
    });
    element.addEventListener("focusout", () => {
      if (element.value == "") {
        element.value = questionData.emotes[i];
        editQuestions[questionData.id].emotes[i] = questionData.emotes[i];
        emojiContainer.children[i].innerText = questionData.emotes[i];
      }
    });
  }
  if (questionIdInput) {
    questionIdInput.addEventListener("input", () => {
      if (questionIdInput.value != "" && idNotTaken(questionIdInput.value)) {
        questionIdInput.classList.remove("questionIdInvalid");
        editQuestions[questionData.id].id = questionIdInput.value;
      } else {
        questionIdInput.classList.add("questionIdInvalid");
        editQuestions[questionData.id].id = questionData.id;
      }
    });
    idInfoBtn.addEventListener("click", () => {
      warningPupup(
        'Think of the question ID as a special code, such as "books" for a question about books. This code helps us organize and identify your questions within the app.',
        () => {},
        true
      );
    });
  }
  questionLableInput.addEventListener("input", (e) => {
    editQuestions[questionData.id].lable = questionLableInput.value;
    if (type == "small-text")
      questionContainer.getElementsByTagName("input")[0].placeholder =
        questionLableInput.value;
    else if (type == "large-text")
      questionContainer.getElementsByTagName("textarea")[0].placeholder =
        questionLableInput.value;
    else
      questionContainer.getElementsByClassName("lable")[0].innerHTML =
        questionLableInput.value;
  });

  if (cancleBtn) {
    cancleBtn.addEventListener("click", () => {
      setTimeout(() => {
        detailedEditBtn.classList.remove("hidden");
        questionDetailedControlls.classList.add("hidden");
        questionDetailedControllsContainer.classList.add("hidden");
        if (emojiEditContainer) emojiEditContainer.classList.add("hidden");
        editQuestions[questionData.id] = {
          ...window.structuredClone(questions[questionData.id]),
          order: editQuestions[questionData.id].order,
        };
        questionLableInput.value = "";
        if (type == "small-text")
          questionContainer.getElementsByTagName("input")[0].placeholder =
            editQuestions[questionData.id].lable;
        else if (type == "large-text")
          questionContainer.getElementsByTagName("textarea")[0].placeholder =
            editQuestions[questionData.id].lable;
        else
          questionContainer.getElementsByClassName("lable")[0].innerHTML =
            editQuestions[questionData.id].lable;
        if (emojiContainer) {
          for (let i = 0; i < emojiContainer.children.length; i++) {
            emojiInputs[i].value = questions[questionData.id].emotes[i];
            emojiContainer.children[i].innerText =
              questions[questionData.id].emotes[i];
          }
        }
      }, 200);
    });
  }
  doneBtn.addEventListener("click", () => {
    setTimeout(() => {
      if (editQuestions[questionData.id].id == NEWQUESTIONID) {
        warningPupup("Please Enter a Valid ID", (e) => {}, true);
      } else {
        detailedEditBtn.classList.remove("hidden");
        questionDetailedControlls.classList.add("hidden");
        questionDetailedControllsContainer.classList.add("hidden");
        if (emojiEditContainer) emojiEditContainer.classList.add("hidden");
      }
    }, 200);
  });
  deleteBtn.addEventListener("click", () => {
    question.remove();
    delete editQuestions[questionData.id];
    delete questionsDom[questionData.id];
    refreshQuestionStyling();
  });
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
      if (emojiEditContainer) emojiEditContainer.classList.remove("hidden");
    }, 200);
  });

  if (questionData.order == 1) {
    question.style.marginTop = "0px";
    question.style.border = "";
    question.style.paddingBottom = "";
  }
  if (questionData.order == Object.keys(questions).length) {
    question.style.border = "none";
    question.style.paddingBottom = "0px";
    question.style.marginTop = "";
  }
  question.style.order = questionData.order;
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
    toggleButtons[i].addEventListener("swiped-right", () => {
      indicator.classList.remove("indicator-off");
      noButton.classList.remove("selectedYesNoBtn");
      yesButton.classList.add("selectedYesNoBtn");
      changeQuestionValue(id, true);
    });
    //no
    toggleButtons[i].addEventListener("swiped-left", () => {
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
    loadingStart();
    questions[id].value = value;
    updateTimeout = 1000;
    dataChanged = true;
  }
}
function questionsEdited() {
  loadingStart();
  updateTimeout = 500;
  dataChanged = true;
}
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
function handleEmojiSliderEvent(e, x) {
  let parent = e.srcElement.parentElement;
  let sliderRect = parent.children[1].getBoundingClientRect();
  let number = e.srcElement.value;
  let offsetX = x - sliderRect.x;
  let percentage = (offsetX / sliderRect.width) * 100;
  if (offsetX <= sliderRect.width && offsetX >= 0 && hold) {
    parent.children[0].style.left = offsetX + "px";
    e.srcElement.style.background = `linear-gradient(to right, var(--primaryTransparent) ${percentage}%,  var(--secondaryTransparent) ${percentage}%)`;
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
  if (width == 0) width = 250;
  let position = number * (width / (emoji.children.length - 1));
  emoji.style.left = position + "px";
  let percentage = (position / width) * 100;
  slider.style.background = `linear-gradient(to right, var(--primaryTransparent) ${percentage}%,  var(--secondaryTransparent) ${percentage}%)`;
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
    handleContentChange();
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
  populateCalander(currentMonth, currentYear);
}
function populateCalander(month, year) {
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
  title.parentElement.style.zIndex = 0;
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
        window.innerHeight * 2.1 + "px"
      )
    : document.documentElement.style.setProperty(
        "--circleSize",
        window.innerWidth * 2.1 + "px"
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
    title.parentElement.style.zIndex = 8;
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
  let questionsKeys = Object.keys(editQuestions);
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
  refreshQuestionStyling();
  scrollTo(questionsDom[id]);
}
function questionOrderChangeDown(id) {
  let questionsKeys = Object.keys(editQuestions);
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
  refreshQuestionStyling();
  scrollTo(questionsDom[id]);
}
function hidePopup() {
  backdrop.classList.add("hidden");
  addQuestionPopup.classList.add("hidden");
}
function cancleEdit() {
  editing = false;
  editQuestions = window.structuredClone(questions);
  reportEditControlls.classList.add("hidden");
  reportEditBtn.parentElement.classList.remove("hidden");
  hidePopup();
  setupReportSection();
}
function warningPupup(warning, callback, info = false) {
  warningContainer.classList.remove("hidden");
  if (info) {
    warningDone.style.display = "none";
  } else {
    warningDone.style.display = "flex";
  }
  warningContainer.getElementsByClassName("warning")[0].innerText = warning;
  warningCancle.addEventListener(
    "click",
    () => {
      setTimeout(() => {
        callback(false);
        warningContainer.classList.add("hidden");
      }, 100);
    },
    { once: true }
  );
  warningDone.addEventListener(
    "click",
    () => {
      setTimeout(() => {
        callback(true);
        warningContainer.classList.add("hidden");
      }, 100);
    },
    { once: true }
  );
}
function addQuestion(type) {
  let questionData = {
    type: type,
    id: NEWQUESTIONID,
    lable: "enter a lable",
    order: 1,
  };
  if (type == "slider") {
    questionData.emotes = ["☹️", "🙁", "😐", "🙂", "😄"];
  }
  let question = createQuestion(questionData, true);
  let questionsKeys = Object.keys(editQuestions);
  for (let i = 0; i < questionsKeys.length; i++) {
    editQuestions[questionsKeys[i]].order += 1;
    questionsDom[questionsKeys[i]].style.order =
      editQuestions[questionsKeys[i]].order;
  }
  delete editQuestions[questionData.id];
  if (questionsDom[questionData.id]) questionsDom[questionData.id].remove();
  editQuestions[questionData.id] = questionData;
  questionsDom[questionData.id] = question;
  questionsContainer.appendChild(question);
  refreshQuestionStyling();
  reOrderQuestions(editQuestions);
  hidePopup();
  updateButtons();
}
function refreshQuestionStyling() {
  let questionsKeys = Object.keys(editQuestions);
  for (let i = 0; i < questionsKeys.length; i++) {
    let questionData = editQuestions[questionsKeys[i]];
    let question = questionsDom[questionsKeys[i]];
    if (questionData.order == 1 && question) {
      question.style.marginTop = "0px";
      question.style.border = "";
      question.style.paddingBottom = "";
    }
    if (questionData.order == Object.keys(questions).length) {
      question.style.border = "none";
      question.style.paddingBottom = "0px";
      question.style.marginTop = "";
    } else {
      question.style.border = "";
      question.style.paddingBottom = "";
    }
  }
}
function idNotTaken(value) {
  let notTaken = true;
  let questionsKeys = Object.keys(questions);
  for (let i = 0; i < questionsKeys.length; i++) {
    if (value == questionsKeys[i]) {
      notTaken = false;
    }
  }
  return notTaken;
}
function reOrderQuestions(questions) {
  let questionsKeys = Object.keys(questions);
  let pointer = 1;
  let tempObj = window.structuredClone(questions);
  while (pointer <= questionsKeys.length) {
    let tempKeys = Object.keys(tempObj);
    let smallestObj = tempKeys.length - 1;
    for (let i = tempKeys.length - 1; i >= 0; i--) {
      if (tempObj[tempKeys[smallestObj]].order >= tempObj[tempKeys[i]].order) {
        smallestObj = i;
      }
    }
    questions[tempKeys[smallestObj]].order = pointer;
    delete tempObj[tempKeys[smallestObj]];
    pointer++;
  }
  editQuestions = window.structuredClone(questions);
}
function scrollTo(element) {
  const targetElement = element;
  const windowHeight = window.innerHeight; // Height of the viewport
  const elementHeight = targetElement.clientHeight; // Height of the target element

  // Calculate the scroll position to center the element
  const scrollTo = targetElement.offsetTop - (windowHeight - elementHeight) / 2;

  const duration = 50; // Duration of the scroll animation in milliseconds
  const startTime = performance.now();
  const startScrollPosition = window.scrollY;

  function animateScroll() {
    const currentTime = performance.now();
    const elapsedTime = currentTime - startTime;

    if (elapsedTime < duration) {
      const scrollProgress = elapsedTime / duration;
      const newScrollPosition =
        startScrollPosition + (scrollTo - startScrollPosition) * scrollProgress;
      window.scrollTo(0, newScrollPosition);
      requestAnimationFrame(animateScroll);
    } else {
      window.scrollTo(0, scrollTo);
    }
  }

  requestAnimationFrame(animateScroll);
}
function saveQuestions() {
  reportEditControlls.classList.add("hidden");
  reportEditBtn.parentElement.classList.remove("hidden");
  hidePopup();
  if (JSON.stringify(editQuestions) != JSON.stringify(questions)) {
    questionsEdited();
  }
  questions = window.structuredClone(editQuestions);
  reOrderQuestions(questions);
  hideQuestionsEditControlls();
  setupReportSection();
}
function loadingStart() {
  console.log("start");
  loading = true;
  loadingElement.classList.remove("loading-hidden");
}
function loadingStop() {
  loading = false;
  loadingElement.classList.add("loading-hidden");
}
function toggleTransparentBackground() {
  let isAtBottom =
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 10;
  if (isAtBottom || document.body.offsetHeight <= window.innerHeight) {
    navbar.classList.add("transparent-bg");
  } else {
    navbar.classList.remove("transparent-bg");
  }
}
function handleContentChange() {
  const observer = new MutationObserver(() => {
    // Handle content changes, such as dynamically added or removed elements
    toggleTransparentBackground();
  });
  observer.observe(document.body, { childList: true, subtree: true });
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
document.addEventListener("DOMContentLoaded", function () {
  function toggleTranslucentBackground() {
    if (window.scrollY === 0) {
      navbar.classList.remove("translucent-bg");
    } else {
      navbar.classList.add("translucent-bg");
    }
  }
  // Initial check
  toggleTranslucentBackground();
  window.addEventListener("scroll", toggleTranslucentBackground);
});
document.addEventListener("DOMContentLoaded", function () {
  // Check on initial load
  toggleTransparentBackground();
  // Check on scroll and resize events
  window.addEventListener("scroll", toggleTransparentBackground);
  window.addEventListener("resize", toggleTransparentBackground);
});
loginBtn.addEventListener("click", () => {
  if (currentUser) {
    signOut();
  } else {
    signIn();
  }
});
reportBtn.addEventListener("click", (e) => {
  windowNavigation(REPORT, "");
  transtition(e, reportBtn, REPORT);
});
calanderBtn.addEventListener("click", (e) => {
  if (!editing) {
    cancleEdit();
    windowNavigation(CALANDER, "");
    transtition(e, calanderBtn, CALANDER);
    hidePopup();
  } else {
    warningPupup("Changes will not be saved Cancle?", (result) => {
      if (result) {
        cancleEdit();
        windowNavigation(CALANDER, "");
        transtition(e, calanderBtn, CALANDER);
        hidePopup();
      }
    });
  }
});
userBtn.addEventListener("click", (e) => {
  if (!editing) {
    cancleEdit();
    windowNavigation(PROFILE, "");
    transtition(e, userBtn, PROFILE);
    hidePopup();
  } else {
    warningPupup("Changes will not be saved Cancle?", (result) => {
      if (result) {
        cancleEdit();
        windowNavigation(PROFILE, "");
        transtition(e, userBtn, PROFILE);
        hidePopup();
      }
    });
  }
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
    editing = true;
    reportEditControlls.classList.remove("hidden");
    reportEditBtn.parentElement.classList.add("hidden");
    showQuestionsEditControlls();
  }, 100);
});
reportEditCancleBtn.addEventListener("click", () => {
  setTimeout(() => {
    if (!editing) {
      cancleEdit();
    } else {
      warningPupup("Changes will not be saved Cancle?", (result) => {
        if (result) cancleEdit();
      });
    }
  }, 100);
});
reportEditDoneBtn.addEventListener("click", () => {
  setTimeout(() => {
    if (
      editQuestions[NEWQUESTIONID] &&
      editQuestions[NEWQUESTIONID].id == NEWQUESTIONID
    ) {
      warningPupup("Please Enter a valid ID", () => {}, true);
    } else if (
      editQuestions[NEWQUESTIONID] &&
      editQuestions[NEWQUESTIONID].id != NEWQUESTIONID
    ) {
      questions[editQuestions[NEWQUESTIONID].id] = window.structuredClone(
        editQuestions[NEWQUESTIONID]
      );
      editQuestions[editQuestions[NEWQUESTIONID].id] = window.structuredClone(
        editQuestions[NEWQUESTIONID]
      );
      questionsDom[editQuestions[NEWQUESTIONID].id] =
        questionsDom[NEWQUESTIONID];
      delete questionsDom[NEWQUESTIONID];
      delete editQuestions[NEWQUESTIONID];
      delete questions[NEWQUESTIONID];
      console.log(questions);
      saveQuestions();
    } else {
      saveQuestions();
    }
  }, 100);
});
reportAddQuestionBtn.addEventListener("click", (e) => {
  if (addQuestionPopup.classList.contains("hidden")) {
    let height = e.srcElement.offsetHeight + 20;
    addQuestionPopup.style.top = height + "px";
    addQuestionPopup.classList.remove("hidden");
    backdrop.classList.remove("hidden");
  } else {
    hidePopup();
  }
});
backdrop.addEventListener("click", () => {
  hidePopup();
});
addQuestionPopup
  .getElementsByClassName("small-text")[0]
  .addEventListener("click", () => {
    setTimeout(() => {
      addQuestion("small-text");
    }, 100);
  });
addQuestionPopup
  .getElementsByClassName("toggle")[0]
  .addEventListener("click", () => {
    setTimeout(() => {
      addQuestion("toggle");
    }, 100);
  });
addQuestionPopup
  .getElementsByClassName("slider")[0]
  .addEventListener("click", () => {
    setTimeout(() => {
      addQuestion("slider");
    }, 100);
  });
addQuestionPopup
  .getElementsByClassName("large-text")[0]
  .addEventListener("click", () => {
    setTimeout(() => {
      addQuestion("large-text");
    }, 100);
  });
