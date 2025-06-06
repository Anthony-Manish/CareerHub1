document.addEventListener("DOMContentLoaded", function () {
    let currentQuestionIndex = 0;
    let selectedAnswers = {};
    let timer;
    let remainingTime = 20 * 60; // 20 minutes in seconds

    const nameInput = document.getElementById("nameInput");
    const gradeSelect = document.getElementById("gradeSelect");
    const goButton = document.getElementById("goButton");

    const instructionCard = document.getElementById("instructionCard");
    const startButton = document.getElementById("startButton");
    const quizContainer = document.getElementById("quizContainer");
    const questionText = document.getElementById("questionText");
    const optionsDiv = document.getElementById("options");
    const timerText = document.getElementById("timerText");
    const prevButton = document.getElementById("prevButton");
    const nextButton = document.getElementById("nextButton");
    const submitButton = document.getElementById("submitButton");
    const resultText = document.getElementById("resultText");
    const resultContainer = document.getElementById("resultContainer");

    goButton.addEventListener("click", () => {
        if (nameInput.value.trim() && gradeSelect.value) {
            document.getElementById("startContainer").style.display = "none";
            instructionCard.style.display = "block";
        } else {
            alert("Please enter your name and select your grade.");
        }
    });

    startButton.addEventListener("click", startTest);
    nextButton.addEventListener("click", nextQuestion);
    prevButton.addEventListener("click", prevQuestion);
    submitButton.addEventListener("click", submitTest);

    function startTest() {
        instructionCard.style.display = "none";
        quizContainer.style.display = "block";
        loadQuestion();
        startTimer();
    }

    function loadQuestion() {
        let grade = gradeSelect.value;
        let question = questions[grade][currentQuestionIndex];

        questionText.textContent = `${currentQuestionIndex + 1}. ${question.question}`;
        optionsDiv.innerHTML = "";

        question.options.forEach((opt, index) => {
            let optionContainer = document.createElement("div");
            optionContainer.classList.add("option-container");

            let input = document.createElement("input");
            input.type = "radio";
            input.name = "answer";
            input.value = opt;
            input.id = `option${index}`;
            input.checked = selectedAnswers[currentQuestionIndex] === opt;

            let label = document.createElement("label");
            label.htmlFor = `option${index}`;
            label.textContent = opt;

            input.addEventListener("change", function () {
                selectAnswer(opt);
                updateSelection();
            });

            optionContainer.appendChild(input);
            optionContainer.appendChild(label);
            optionsDiv.appendChild(optionContainer);
        });

        prevButton.disabled = currentQuestionIndex === 0;
        nextButton.disabled = currentQuestionIndex === questions[grade].length - 1;
        checkSubmitEnable();
        updateSelection();
    }

    function selectAnswer(answer) {
        selectedAnswers[currentQuestionIndex] = answer;
        checkSubmitEnable();
    }

    function updateSelection() {
        document.querySelectorAll(".option-container").forEach((container) => {
            let input = container.querySelector("input");
            container.classList.toggle("selected", input.checked);
        });
    }

    function nextQuestion() {
        if (currentQuestionIndex < questions[gradeSelect.value].length - 1) {
            currentQuestionIndex++;
            loadQuestion();
        }
    }

    function prevQuestion() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            loadQuestion();
        }
    }

    function checkSubmitEnable() {
        let totalQuestions = questions[gradeSelect.value].length;
        let answeredCount = Object.keys(selectedAnswers).length;
        submitButton.disabled = answeredCount !== totalQuestions;
    }

    function startTimer() {
        timer = setInterval(() => {
            remainingTime--;
            let minutes = Math.floor(remainingTime / 60);
            let seconds = remainingTime % 60;
            timerText.textContent = `Time Left: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
            if (remainingTime <= 0) {
                clearInterval(timer);
                submitTest();
            }
        }, 1000);
    }

    function submitTest() {
        clearInterval(timer);
        quizContainer.style.display = "none";
        resultContainer.style.display = "block";
    
        let grade = gradeSelect.value;
        let fieldScores = {
            Science: 0,
            Commerce: 0,
            Arts: 0,
            IT: 0,
            Law: 0,
            Management: 0,
            Mathematics: 0,
            Engineering: 0,
            Medical: 0
        };
    
        // Count correct answers for each field
        questions[grade].forEach((q, index) => {
            if (selectedAnswers[index] === q.answer) {
                fieldScores[q.field] = (fieldScores[q.field] || 0) + 1;
            }
        });
    
        // Get only fields with the highest scores
        let maxScore = Math.max(...Object.values(fieldScores));
        let bestFields = Object.entries(fieldScores)
            .filter(([_, score]) => score === maxScore && score > 0) // Only keep fields with the highest score
            .map(entry => entry[0]);
    
        // Recommend courses based on top fields
        let recommendedCourses = new Set();
        bestFields.forEach(field => {
            switch (field) {
                case "Science": recommendedCourses.add("BSc IT"); break;
                case "Commerce": recommendedCourses.add("BBA"); break;
                case "Arts": recommendedCourses.add("BA Economics"); break;
                case "IT": recommendedCourses.add("BSc Computer Science"); break;
                case "Law": recommendedCourses.add("LLB"); break;
                case "Management": recommendedCourses.add("MBA"); break;
                case "Mathematics": recommendedCourses.add("BSc Mathematics"); break;
                case "Engineering": recommendedCourses.add("BTech"); break;
                case "Medical": recommendedCourses.add("MBBS"); break;
            }
        });
    
        // Generate result message dynamically
        if (bestFields.length === 0) {
            resultMessage.innerHTML = `
                <h3 class="heading">🎉 Congratulations, ${nameInput.value}!</h3> 
                <p>We couldn't determine a strong preference based on your answers.</p>
                <p>Consider exploring various career options to see what interests you.</p>
            `;
        } else {
            resultMessage.innerHTML = `
                <h3 class="heading">🎉 Congratulations, ${nameInput.value}!</h3> 
                <p>Based on your performance, you have strong skills in <b>${bestFields.join(" & ")}</b>.</p>
                <p>You can explore fields like <b>${[...recommendedCourses].join(", ")}</b>.</p>
            `;
        }
        
        resultText.innerHTML = `<h3>🎉 Congratulations, ${nameInput.value}!</h3> 
            <p>Based on your performance, you have strong skills in <b>${sortedFields.join(" & ")}</b>.</p>
            <p>You can explore fields like <b>${[...recommendedCourses].join(", ")}</b>.</p>`;
    }
});
