let Qnum = 0;
let gameArry=[];
let shuffledAnsArry;
let selectedAns;
let scoreCount = 0;
let totalQnum = 20;
let canChoose = true;

document.addEventListener("DOMContentLoaded", function () {
  // בדיקה אם המכשיר הוא גלאקסי פולד
  // if (navigator.userAgent.includes("Galaxy Fold"))
  if (window.innerWidth < 281)
  {
    alert("דיס איז אוקוורד\nלצערנו אתר זה עדיין אינו מתאים את עצמו לכל הצורות המסך שלך...\nבבקשה פתח.י את הקפל וסובב.י את התצוגה.");
  } 
});

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
  showCircel();
}

function startOver() {
  window.location.reload();
}

function importData() {
  fetch("data/DataJSD.json") // הכתובת של הקובץ המקומי
    .then((response) => response.json()) // מנתח את התגובה ל-JSON
    .then((data) => {
      let importData = data; // מקצה את הנתונים למשתנה
      // לולאה לכל קטוגוריה
      // בוחר שאלה רנדומלית מתוך הקטגוריה
      // מוסיף את השאלה לגייםאריי
      importData.forEach(category => {
        let questions = category.questions;
        let numQuestions = category.Qnum;
        
        for (let i = 0; i < numQuestions; i++) {
            if (questions.length > 0) {
                // Get a random index
                let randomIndex = Math.floor(Math.random() * questions.length);
                
                // Push the random question to the gameArry
                gameArry.push(questions[randomIndex]);
                
                // Remove the selected question from the array to avoid duplicates
                questions.splice(randomIndex, 1);
            }
        }
    });

      
       console.log(gameArry); // מציג את השאלות בקונסולה


      creatQ();
    });
}

function creatQ() {
  canChoose = true;
  // הזנת השאלה
  document.getElementById("Qustion").innerHTML = gameArry[Qnum].question;

  // יצירת מערך מסיחים
  let ansArry = gameArry[Qnum].Additionalanswers.split(";");
  ansArry.push((innerHTML = gameArry[Qnum].correctanswer));
  //   console.log(ansArry);
  shuffledAnsArry = ansArry
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
  } else if (shuffledAnsArry.length == 3) {
    const myHtml = ` <ol >
    <li  id="A1" class="castume-button " onclick="selectAns(A1)">${shuffledAnsArry[0]}</li>
    <li  id="A2" class="castume-button "  onclick="selectAns(A2)">${shuffledAnsArry[1]}</li>
    <li  id="A3" class="castume-button "  onclick="selectAns(A3)">${shuffledAnsArry[2]}</li>
    </ol>`;
    ansList.innerHTML = myHtml;
  }
  else if (shuffledAnsArry.length == 2) {
    const myHtml = ` <ol >
    <li  id="A1" class="castume-button " onclick="selectAns(A1)">${shuffledAnsArry[0]}</li>
    <li  id="A2" class="castume-button "  onclick="selectAns(A2)">${shuffledAnsArry[1]}</li>
    </ol>`;
    ansList.innerHTML = myHtml;
  }
}

function selectAns(ans) {
  if (selectedAns != ans && canChoose) {
    if (shuffledAnsArry.length == 4) {
      document.getElementById("A1").classList.remove("highlight");
      document.getElementById("A2").classList.remove("highlight");
      document.getElementById("A3").classList.remove("highlight");
      document.getElementById("A4").classList.remove("highlight");

      document.getElementById("A1").classList.remove("castume-button-selected");
      document.getElementById("A2").classList.remove("castume-button-selected");
      document.getElementById("A3").classList.remove("castume-button-selected");
      document.getElementById("A4").classList.remove("castume-button-selected");
    } else if (shuffledAnsArry.length == 3) {
      document.getElementById("A1").classList.remove("highlight");
      document.getElementById("A2").classList.remove("highlight");
      document.getElementById("A3").classList.remove("highlight");

      document.getElementById("A1").classList.remove("castume-button-selected");
      document.getElementById("A2").classList.remove("castume-button-selected");
      document.getElementById("A3").classList.remove("castume-button-selected");
    }
    else if (shuffledAnsArry.length == 2) {
      document.getElementById("A1").classList.remove("highlight");
      document.getElementById("A2").classList.remove("highlight");

      document.getElementById("A1").classList.remove("castume-button-selected");
      document.getElementById("A2").classList.remove("castume-button-selected");
    }

    ans.classList.add("highlight");
    ans.classList.add("castume-button-selected");

    selectedAns = ans;
    // כפתור הגשה
    document.getElementById("sebmit").addEventListener("click", submit);
    document
      .getElementById("sebmit")
      .classList.remove("castume-button-disable");
  }
}

function submit() {
  if (selectedAns.innerHTML != null) {
    // ביטול כפתור הגשה
    document.getElementById("sebmit").classList.add("castume-button-disable");
    document.getElementById("sebmit").removeEventListener("click", submit);

    if (selectedAns.innerHTML === gameArry[Qnum].correctanswer) {
      // alert("תשובה נכונה");
      selectedAns.classList.add("corectAns");

      confetti({
        particleCount: 250,
        spread: 100,
        origin: { y: 0 },
      });

      // ספירה תשובה נכונה
      scoreCount++;
    } else {
      // alert("תשובה לא נכונה");
      selectedAns.classList.add("worngAns");

      if (
        document.getElementById("A1").innerHTML == gameArry[Qnum].correctanswer
      ) {
        document.getElementById("A1").classList.add("corectAns");
      } else if (
        document.getElementById("A2").innerHTML == gameArry[Qnum].correctanswer
      ) {
        document.getElementById("A2").classList.add("corectAns");
      } else if (
        document.getElementById("A3").innerHTML == gameArry[Qnum].correctanswer
      ) {
        document.getElementById("A3").classList.add("corectAns");
      } else if (
        document.getElementById("A4").innerHTML == gameArry[Qnum].correctanswer
      ) {
        document.getElementById("A4").classList.add("corectAns");
      }
    }

    Qnum++;
    selectedAns = "";
    if (Qnum == gameArry.length) {
      // נגמר המשחק
      setTimeout(changeToEndScreen, 1000);
    } else {
      // שאלה הבאה
      canChoose = false;
      setTimeout(creatQ, 2000);
    }
  } else {
    // חיווי שלא בחרו
    alert("לא נבחרה תשובה");
  }
}

function showCircel() {
  var bar = new ProgressBar.Circle(containerCircel, {
    color: "#fe9b4a",
    // This has to be the same size as the maximum width to
    // prevent clipping
    strokeWidth: 4,
    trailWidth: 1,
    easing: "easeInOut",
    duration: 1400,
    text: {
      autoStyleContainer: false,
    },
    from: { color: "#bd5e10", width: 1 },
    to: { color: "#065994", width: 4.5 },
    // Set default step function for all animate calls
    step: function (state, circle) {
      circle.path.setAttribute("stroke", state.color);
      circle.path.setAttribute("stroke-width", state.width);

      var value = Math.round(circle.value() * totalQnum);
      if (value === 0) {
        circle.setText("");
      } else {
        circle.setText(value + "/" + totalQnum);
      }
    },
  });
  (bar.text.style.fontFamily = "Assistant"), "sans-serif";
  bar.text.style.fontSize = "2rem";
  bar.text.style.color = "#000";

  bar.animate(scoreCount / totalQnum);
}
