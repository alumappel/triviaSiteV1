let Qnum = 0;
let gameArry = [];
let shuffledAnsArry;
let selectedAns;
let scoreCount = 0;
let totalQnum = 20;
let canChoose = true;

document.addEventListener("DOMContentLoaded", function () {
  // בדיקה אם המכשיר הוא גלאקסי פולד
  // if (navigator.userAgent.includes("Galaxy Fold"))
  if (window.innerWidth < 281) {
    alert(
      "דיס איז אוקוורד\nלצערנו אתר זה עדיין אינו מתאים את עצמו לכל הצורות המסך שלך...\nבבקשה פתח.י את הקפל וסובב.י את התצוגה."
    );
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
  document.getElementById("progress-bar-div").classList.add("d-none");
  Endscreen.classList.remove("d-none");
  showCircel();
}

function startOver() {
  window.location.reload();
}



function importData() {
  const mainCategoryName = "מבצע עם כלביא"; // Name of the primary category to prioritize
  fetch("data/DataIIW.json") // Load questions from local JSON file
    .then((response) => response.json())
    .then((data) => {
      gameArry = []; // Final array of selected questions restarts empty
      const mainCategoryTarget = Math.floor(totalQnum * 0.5); // 50% of total questions should come from main category
      let mainCategoryActual = 0; // Actual number taken from main category

      // Find the main category in the data
      const mainCategory = data.find(cat => cat.category?.trim() === mainCategoryName);

      if (mainCategory) {
        let questions = [...mainCategory.questions]; // Clone to avoid modifying original
        let available = Math.min(questions.length, mainCategoryTarget); // Take only as many as available

        // Randomly select questions from main category
        for (let i = 0; i < available; i++) {
          let randomIndex = Math.floor(Math.random() * questions.length);
          gameArry.push(questions[randomIndex]);
          questions.splice(randomIndex, 1); // Prevent duplicates
        }

        mainCategoryActual = available;
      }

      // Determine how many questions are left to select from other categories
      const remainingToFill = totalQnum - mainCategoryActual;

      // Filter out the main category
      const otherCategories = data.filter(cat => cat.category?.trim() !== mainCategoryName);

      const questionsPerCategory = Math.floor(remainingToFill / otherCategories.length);
      let remainder = remainingToFill % otherCategories.length; // Distribute leftover questions

      // Loop through other categories and randomly select questions
      otherCategories.forEach(category => {
        let questions = [...category.questions];
        let numToSelect = questionsPerCategory + (remainder > 0 ? 1 : 0);
        if (remainder > 0) remainder--;

        for (let i = 0; i < numToSelect && questions.length > 0; i++) {
          let randomIndex = Math.floor(Math.random() * questions.length);
          gameArry.push(questions[randomIndex]);
          questions.splice(randomIndex, 1); // Avoid duplicates
        }
      });

      // After all questions have been added to gameArry
      gameArry = gameArry
        .map((q) => ({ q, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ q }) => q);

      creatQ(); // Begin game logic
    });
}




function creatQ() {
  canChoose = true;

// מציג את השאלה הנוכחית מהמערך
let currentQuestion = gameArry[Qnum];

// מציג טקסט שאלה
document.getElementById("Qustion").textContent = currentQuestion.question;

// הצגת התמונה אם קיימת
const imgWrapper = document.getElementById("questionImageWrapper");
const imgElement = document.getElementById("questionImage");
const textCol = document.getElementById("questionTextCol");

// אם קיימת תמונה
if (currentQuestion.image && currentQuestion.image.trim() !== "") {
  const imageBaseName = currentQuestion.image.trim(); // לדוגמה: "test1"
  const imagePathBase = `assets/Qimages/${imageBaseName}`;
  const extensions = [".webp", ".jpg", ".jpeg", ".png"];
  let index = 0;

  // פונקציית בדיקה רקע כדי לא להציג שגיאות בקונסול
  function tryPreloadNext() {
    if (index >= extensions.length) {
      // לא נמצאה תמונה תקינה
      imgElement.src = "";
      imgWrapper.classList.add("d-none");
      textCol.classList.remove("col-md-6");
      textCol.classList.add("col-md-12");
      return;
    }

    const testPath = `${imagePathBase}${extensions[index]}`;
    const testImg = new Image();
    testImg.onload = () => {
      imgElement.src = testPath;
      imgElement.alt = "תמונה לשאלה";
      imgWrapper.classList.remove("d-none");
      textCol.classList.remove("col-md-12");
      textCol.classList.add("col-md-6");
    };
    testImg.onerror = () => {
      index++;
      tryPreloadNext();
    };
    testImg.src = testPath;
  }

  tryPreloadNext();
} else {
  // אם אין בכלל שדה תמונה או שהוא ריק
  imgElement.src = "";
  imgWrapper.classList.add("d-none");
  textCol.classList.remove("col-md-6");
  textCol.classList.add("col-md-12");
}



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
  } else if (shuffledAnsArry.length == 2) {
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
    } else if (shuffledAnsArry.length == 2) {
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
    updateProgressBar();
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


function updateProgressBar() {
  const progressBar = document.getElementById("progress-bar");
  const progress = (Qnum / totalQnum) * 100;
  progressBar.style.width = `${progress}%`;
  progressBar.setAttribute("aria-valuenow", progress);
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

// פונקצייה לשיתוף
function handleShare() {
  const scorePercent = Math.round((scoreCount / totalQnum) * 100); // אחוזי הצלחה

  const text = `ניסיתם את הטריוויה של מבצע "עם כלביא"?
אני הגעתי ל-${scorePercent}%, נראה אתכם!
https://idf-interactive.com/Home_Iran_Israel_war.html`;

  if (navigator.share) {
    navigator.share({
      title: "בואו לשחק בטריוויה!",
      text: text,
      // אין צורך ב-url נפרד, הוא כבר כלול בטקסט
    })
      .then(() => console.log("Shared successfully"))
      .catch((error) => console.error("שגיאה בשיתוף:", error));
  } else {
    alert("שיתוף לא נתמך בדפדפן זה. העתקו והדביקו ידנית:");
    console.log(text);
  }
}

// חלונית הגדלת תמונה
function openImageModal(src) {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  modalImg.src = src;
  modal.classList.remove("d-none");
}

function closeImageModal(event) {
  // Prevent closing when clicking directly on the image
  if (event && event.target.tagName === 'IMG') return;

  // Hide the modal
  document.getElementById("imageModal").classList.add("d-none");
}

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    closeImageModal();
  }
});

// דיווח על כפתור בסיום לGA
document.getElementById("EndBtn").addEventListener("click", function () {
  // שליחת אירוע ל-GA
  gtag("event", "End_button_clicked", {
    event_category: "engagement",
    event_label: "End Button",
    value: 1
  });
});

