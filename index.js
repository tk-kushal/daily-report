const REPORT = 'report',CALANDER = 'calander',PROFILE = 'profile'
const reportBtn = document.getElementsByClassName("report")[0];
const calanderBtn = document.getElementsByClassName('calander')[0];
const userBtn = document.getElementsByClassName('user')[0];
const body = document.getElementsByTagName("body")[0];
const title = document.getElementsByClassName('title')[0];
let currentView = REPORT

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
function transtition(x,y,element,view){
  element.style.zIndex = '10'
  let transition = document.createElement("div");
  let transitionContainer = document.createElement('div');
  body.clientHeight>body.clientWidth?
  document.documentElement.style.setProperty('--circleSize',body.clientHeight*3+'px'):
  document.documentElement.style.setProperty('--circleSize',body.clientWidth*3+'px')
  transitionContainer.classList.add('transitionContainer')
  transitionContainer.appendChild(transition)
  transition.classList.add("transition");
  body.appendChild(transitionContainer);
  transition.style.top = y+'px';
  transition.style.left = x+'px';
  transition.classList.add("grow");
  setTimeout(() => {
    updateView(view)
  }, 500);
  setTimeout(() => {
    body.removeChild(transitionContainer)
    element.style.zIndex = '1'
  }, 1300);
}
updateView(REPORT)
reportBtn.addEventListener("click", (e) => {
  console.log(e);
  transtition(e.target.offsetLeft+e.target.clientWidth/2,e.target.offsetTop+e.target.clientHeight/2,reportBtn,REPORT)
  
});
calanderBtn.addEventListener("click", (e) => {
  console.log(e);
  transtition(e.target.offsetLeft+e.target.clientWidth/2,e.target.offsetTop+e.target.clientHeight/2,calanderBtn,CALANDER)
});
userBtn.addEventListener("click", (e) => {
  console.log(e);
  transtition(e.target.offsetLeft+e.target.clientWidth/2,e.target.offsetTop+e.target.clientHeight/2,userBtn,PROFILE)
});
