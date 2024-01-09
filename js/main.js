let Qnum = 0;
let gameArry;

function startGame() {
  // שינוי נראות של המסך
  setTimeout(changeToQscreen, 500);

  // קריאה לנתונים/ הפעלת משחק וכו
  // הצגת נתונים
  importData();
  //   creatQ();
}

function endGame() {
  // שינוי של המסך
  setTimeout(changeToEndScreen, 500);
}

function changeToQscreen() {
  const Openscreen = document.getElementById("openScreen");
  const Qscreen = document.getElementById("qustionScreen");
  const header = document.getElementById("header");
  // שינוי נראות של המסך
  Openscreen.classList.add("d-none");
  header.classList.remove("d-none");
  Qscreen.classList.remove("d-none");
}

function changeToEndScreen() {
  const Qscreen = document.getElementById("qustionScreen");
  const Endscreen = document.getElementById("endScreen");
  // שינוי נראות של המסך
  Qscreen.classList.add("d-none");
  Endscreen.classList.remove("d-none");
}

function startOver() {
  window.location.reload();
}

function importData() {
  fetch("js/Data.json") // הכתובת של הקובץ המקומי
    .then((response) => response.json()) // מנתח את התגובה ל-JSON
    .then((data) => {
      let importData = data; // מקצה את הנתונים למשתנה
    //   console.log(importData); // מציג את הנתונים בקונסולה
      let startNum = Math.floor(Math.random() * (importData.length - 5));
      gameArry = importData.slice(startNum, startNum + 5); // מחתך חמש שאלות מהמערך
      //   console.log(gameArry); // מציג את השאלות בקונסולה
      creatQ();
    });
}

function creatQ() {
  // הזנת השאלה
  document.getElementById("Qustion").innerHTML = gameArry[Qnum].question;

  // יצירת מערך מסיחים
  let ansArry = gameArry[Qnum].additional_answers.split(",");
  ansArry.push((innerHTML = gameArry[Qnum].correct_answer));
//   console.log(ansArry);
  let shuffledAnsArry = ansArry
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
//   console.log(shuffledAnsArry);

  let ansList = document.getElementById("AnsList"); // get the ol element

  ansList.innerHTML = ""; // clear any existing content
  if (shuffledAnsArry.length == 4) {
    const myHtml = ` <ol >
    <li class="castume-button ">${shuffledAnsArry[0]}</li>
    <li class="castume-button ">${shuffledAnsArry[1]}</li>
    <li class="castume-button ">${shuffledAnsArry[2]}</li>
    <li class="castume-button">${shuffledAnsArry[3]}</li>
    </ol>`;
    ansList.innerHTML = myHtml;
  } else if (shuffledAnsArry.length == 2) {
    const myHtml = ` <ol >
    <li class="castume-button ">${shuffledAnsArry[0]}</li>
    <li class="castume-button ">${shuffledAnsArry[1]}</li>
    </ol>`;
    ansList.innerHTML = myHtml;
  }
}
