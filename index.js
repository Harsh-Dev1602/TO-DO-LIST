const submitEle = document.querySelector("#submit");
const textEle = document.querySelector("#text");
const t1Ele = document.querySelector("#t1");

submitEle.addEventListener("click", () => {
  const textElev = textEle.value;

  if (textElev === "") {
    alert(" Please add your fist task ..");
  } else {
    const p = document.createElement("P");
    const clear = document.createElement("H2");
    const span = document.createElement("SPAN");
    p.textContent = textElev;
    span.appendChild(p);
    span.appendChild(clear);
    t1Ele.appendChild(span);

    span.addEventListener("click", (e) => {
      if (e.target.tagName == "SPAN") {
        span.style.textDecoration = "line-through";
        span.style.backgroundColor = "#D7C3F1";
        span.style.color = "black";
        setItem();
      } else if (e.target.tagName == "P") {
        span.style.textDecoration = "line-through";
        span.style.backgroundColor = "#D7C3F1";
        span.style.color = "black";
        setItem();
      }
      else if(e.target.tagName == "H2"){
          e.target.parentElement.remove()
            localStorage.clear()
      }
    });
  }

  textEle.value = "";
  setItem();
});

function setItem() {
  window.localStorage.setItem("text", t1Ele.innerHTML);
}
function getItem() {
  t1Ele.innerHTML = window.localStorage.getItem("text");
}

getItem();
