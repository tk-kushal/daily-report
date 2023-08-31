import { monthChange } from "./index.js";
const calander = document.getElementsByClassName("ripple-calander")[0];
let oldButtons = []
updateButtons()
export function updateButtons() {
  let currentButtons = document.querySelectorAll(".ripple-button");
  for(let i=0;i<currentButtons.length;i++){
    let ifadd = true
    oldButtons.forEach(button => {
      if(currentButtons[i]== button){
        ifadd = false
      }
    });
    let button = currentButtons[i]
    if(ifadd){
      button.addEventListener("click", function (e) {
        const ripple = document.createElement("span");
        ripple.classList.add("ripple");
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        button.appendChild(ripple);
  
        ripple.addEventListener("animationend", () => {
          ripple.remove();
        });
      });
    }
  }
  oldButtons = currentButtons;
}

export function calanderSwipe(direction) {
  const ripple = document.createElement("span");
  ripple.classList.add("calander-ripple");
  const rect = calander.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x =
    direction == "left"
      ? 0 - size / 2
      : direction == "right"
      ? rect.width - size / 2
      : rect.width / 2 - size / 2;
  const y = rect.height / 2 - size / 2;
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  calander.appendChild(ripple);

  ripple.addEventListener("animationend", () => {
    ripple.remove();
  });
}

calander.addEventListener("swiped-left", (e) => {
  calanderSwipe("right");
  monthChange("next");
});

calander.addEventListener("swiped-right", (e) => {
  calanderSwipe("left");
  monthChange("previous");
});
