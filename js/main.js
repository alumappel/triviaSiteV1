let Qnum = 0;
let gameArry;
let selectedAns;
let scoreCount=0;
let totalQnum=5;

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
      let startNum = Math.floor(Math.random() * (importData.length - totalQnum));
      gameArry = importData.slice(startNum, startNum + totalQnum); // מחתך חמש שאלות מהמערך
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
    <li id="A1" class="castume-button" onclick="selectAns(A1)">${shuffledAnsArry[0]}</li>
    <li id="A2" class="castume-button" onclick="selectAns(A2)">${shuffledAnsArry[1]}</li>
    <li id="A3" class="castume-button" onclick="selectAns(A3)">${shuffledAnsArry[2]}</li>
    <li id="A4" class="castume-button" onclick="selectAns(A4)">${shuffledAnsArry[3]}</li>
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

function selectAns(ans) {
  if (selectedAns != ans) {
    document.getElementById("A1").classList.remove("highlight");
    document.getElementById("A2").classList.remove("highlight");
    document.getElementById("A3").classList.remove("highlight");
    document.getElementById("A4").classList.remove("highlight");

    document.getElementById("A1").classList.remove("castume-button-selected");
    document.getElementById("A2").classList.remove("castume-button-selected");
    document.getElementById("A3").classList.remove("castume-button-selected");
    document.getElementById("A4").classList.remove("castume-button-selected");

    ans.classList.add("highlight");
    ans.classList.add("castume-button-selected");

    selectedAns = ans;
    // כפתור הגשה
    document.getElementById("sebmit").addEventListener("click", submit);
    document.getElementById("sebmit").classList.remove("castume-button-disable");
  }
}

function submit() {
  if (selectedAns.innerHTML != null) {
    // ביטול כפתור הגשה  
    document.getElementById("sebmit").classList.add("castume-button-disable");
    document.getElementById("sebmit").removeEventListener("click", submit);

    if (selectedAns.innerHTML === gameArry[Qnum].correct_answer) {
      alert("תשובה נכונה")
      selectedAns.classList.add("corectAns");

      // ספירה תשובה נכונה
      scoreCount++;

    }
    else{
      alert("תשובה לא נכונה")
      selectedAns.classList.add("worngAns");

      if(document.getElementById("A1").innerHTML==gameArry[Qnum].correct_answer){
        document.getElementById("A1").classList.add("corectAns");
      }
      else if(document.getElementById("A2").innerHTML==gameArry[Qnum].correct_answer){
        document.getElementById("A2").classList.add("corectAns");
      }
      else if(document.getElementById("A3").innerHTML==gameArry[Qnum].correct_answer){
        document.getElementById("A3").classList.add("corectAns");
      }
      else if (document.getElementById("A4").innerHTML==gameArry[Qnum].correct_answer){
        document.getElementById("A4").classList.add("corectAns");
      }



    }

    Qnum++;
    selectedAns=""; 
    if(Qnum==gameArry.length){
      // נגמר המשחק
      setTimeout(changeToEndScreen, 1000);
    } 
    else{
      // שאלה הבאה
      setTimeout(creatQ, 1000);
    }    


  } else {
    // חיווי שלא בחרו
    alert("לא נבחרה תשובה");
  }

  // פה בדיקה האם זו היתה השאלה האחרונה
}
