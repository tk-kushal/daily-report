const REPORT = 'report',CALANDER = 'calander',PROFILE = 'profile'
const reportBtn = document.getElementsByClassName("report")[0];
const calanderBtn = document.getElementsByClassName('calander')[0];
const userBtn = document.getElementsByClassName('user')[0];
const body = document.getElementsByTagName("body")[0];
const title = document.getElementsByClassName('title')[0];
const navbarContainer = document.getElementsByClassName('navbarContainer')[0]
const stars = document.getElementsByClassName('fa-star');
let currentView = REPORT
let currentReport = {
}

for (let i = 0; i < stars.length; i++) {
  stars[i].addEventListener('click',e=>handleStarClickEvent(e));
}

function handleStarClickEvent(e){
  console.log(e)
  let parent = e.srcElement.parentElement
  let number = Array.from(parent.children).indexOf(e.srcElement)
  for (let i = 0; i < parent.children.length; i++){
    if(i<=number && number !== currentReport[parent.id])
    parent.children[i].classList.add('selectedStar');  
    else 
    parent.children[i].classList.remove('selectedStar');  
  }
  if(number !== currentReport[parent.id])
  currentReport[parent.id] = number
  else
  currentReport[parent.id] = null;
  console.log(currentReport)
}
function updateView(view){
  currentView = view
  if(currentView === REPORT){
    title.innerText = 'Report'
    reportBtn.classList.add('selected')
    calanderBtn.classList.remove('selected')
    userBtn.classList.remove('selected')
  }else if(currentView === CALANDER){
    title.innerText = 'Calander'
    calanderBtn.classList.add('selected')
    reportBtn.classList.remove('selected')
    userBtn.classList.remove('selected')
  }else if(currentView === PROFILE){
    title.innerText = 'Profile'
    userBtn.classList.add('selected')
    reportBtn.classList.remove('selected')
    calanderBtn.classList.remove('selected')
  }else{}
}
function transtition(e,element,view){
  element.style.zIndex = '10'
  let transition = document.createElement("div");
  let transitionContainer = document.createElement('div');
  let rect = element.getBoundingClientRect();
  let x=rect.left+e.target.clientWidth/2;
  let y=rect.top+e.target.clientHeight/2;
  window.innerHeight>window.innerWidth?
  document.documentElement.style.setProperty('--circleSize',window.innerHeight*3+'px'):
  document.documentElement.style.setProperty('--circleSize',window.innerWidth*3+'px')
  transitionContainer.classList.add('transitionContainer')
  transitionContainer.appendChild(transition)
  transition.classList.add("transition");
  navbarContainer.appendChild(transitionContainer);
  transition.style.top = y+'px';
  transition.style.left = x+'px';
  transition.classList.add("grow");
  setTimeout(() => {
    updateView(view)
  }, 250);
  setTimeout(() => {
    navbarContainer.removeChild(transitionContainer)
    element.style.zIndex = '1'
  }, 600);
}
updateView(REPORT)
reportBtn.addEventListener("click", (e) => {
  transtition(e,reportBtn,REPORT)
});
calanderBtn.addEventListener("click", (e) => {
  transtition(e,calanderBtn,CALANDER)
});
userBtn.addEventListener("click", (e) => {
  transtition(e,userBtn,PROFILE)
});
