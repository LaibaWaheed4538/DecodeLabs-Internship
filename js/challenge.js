/* 
   CURIO MUSEUM — KNOWLEDGE CHALLENGE
    */

"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const data = window.CURIO_DATA;

    const elements = {
        container: document.getElementById("quiz-container"),
        category: document.getElementById("quiz-category"),
        questionNumber: document.getElementById("quiz-question-number"),
        questionIndex: document.getElementById("quiz-question-index"),
        question: document.getElementById("quiz-question"),
        options: document.getElementById("quiz-options"),
        progressTrack: document.getElementById("quiz-progress-track"),
        progressFill: document.getElementById("quiz-progress-fill"),
        progressText: document.getElementById("quiz-progress-text"),
        progressPercentage: document.getElementById("quiz-progress-percentage"),
        submit: document.getElementById("quiz-submit"),
        next: document.getElementById("quiz-next"),
        score: document.getElementById("quiz-score"),
        feedback: document.getElementById("quiz-feedback"),
        feedbackTitle: document.getElementById("quiz-feedback-title"),
        feedbackExplanation: document.getElementById("quiz-feedback-explanation"),
        results: document.getElementById("quiz-results"),
        resultsTitle: document.getElementById("quiz-results-title"),
        resultsDescription: document.getElementById("quiz-results-description"),
        finalScore: document.getElementById("quiz-final-score"),
        finalTotal: document.getElementById("quiz-final-total"),
        finalPercentage: document.getElementById("quiz-final-percentage"),
        restart: document.getElementById("quiz-restart")
    };

    const requiredElements = [
        "container",
        "question",
        "options",
        "submit",
        "next",
        "score",
        "feedback",
        "feedbackTitle",
        "feedbackExplanation",
        "results",
        "restart"
    ];

    const missingElements = requiredElements.filter(function (key) {
        return !elements[key];
    });

    if (missingElements.length) {
        console.error(
            "Curio Challenge: missing HTML elements:",
            missingElements.join(", ")
        );
        return;
    }

    if (!data || !Array.isArray(data.quizQuestions)) {
        showError(
            "Quiz questions could not be loaded. " +
            "Please check that js/data.js loads before js/challenge.js."
        );
        return;
    }

    let questionBank = [];
    async function loadQuizQuestions() {
    try {
        const response = await fetch("/api/quiz");

        if (!response.ok) {
            throw new Error("Failed to load quiz questions");
        }

        questionBank = await response.json();

        if (!questionBank.length) {
            showError("No quiz questions available.");
            return;
        }

        restartQuiz();

  } catch (error) {
    console.warn("Backend unavailable; using local quiz data.", error);

    questionBank = data.quizQuestions.slice();

    restartQuiz();
}
}

    

    const state = {
        questions: [],
        currentIndex: 0,
        score: 0,
        answered: false,
        checking: false,
        selectedAnswer: null
    };

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    function showError(message) {
        const error = document.createElement("p");
        error.className = "quiz-error";
        error.setAttribute("role", "alert");
        error.textContent = message;

        const container = document.getElementById("quiz-container");

        if (container) {
            container.replaceChildren(error);
        }

        console.error("Curio Challenge:", message);
    }

    function shuffleQuestions(questions) {
        const shuffled = questions.slice();

        for (let i = shuffled.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));

            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return shuffled;
    }

    function makeOption(optionText, index) {
        const label = document.createElement("label");
        label.className = "quiz-option";

        const input = document.createElement("input");
        input.type = "radio";
        input.name = "quiz-answer";
        input.value = String(index);
        input.autocomplete = "off";

        const letter = document.createElement("span");
        letter.className = "quiz-option-letter";
        letter.textContent = letters[index] || String(index + 1);

        const text = document.createElement("span");
        text.className = "quiz-option-text";
        text.textContent = optionText;

        const indicator = document.createElement("span");
        indicator.className = "quiz-option-indicator";
        indicator.setAttribute("aria-hidden", "true");
        indicator.textContent = "↗";

        label.append(input, letter, text, indicator);

        input.addEventListener("change", function () {
            if (state.answered) {
                return;
            }

            state.selectedAnswer = index;
            updateSelectedOption();
        });

        return label;
    }

    function updateSelectedOption() {
        const options = elements.options.querySelectorAll(".quiz-option");

        options.forEach(function (option, index) {
            option.classList.toggle(
                "is-selected",
                index === state.selectedAnswer
            );
        });
    }

    function updateProgress() {
        const total = state.questions.length;
        const completed = state.currentIndex;
        const percentage = Math.round((completed / total) * 100);

        elements.progressFill.style.width = percentage + "%";
        elements.progressTrack.setAttribute(
            "aria-valuenow",
            String(percentage)
        );

        elements.progressPercentage.textContent = percentage + "%";
        elements.progressText.textContent =
            "Question " + (state.currentIndex + 1) + " of " + total;

        elements.questionNumber.textContent =
            "Question " + (state.currentIndex + 1) + " / " + total;

        elements.questionIndex.textContent =
            String(state.currentIndex + 1).padStart(2, "0");
    }

    function renderQuestion() {
        const question = state.questions[state.currentIndex];

        if (!question) {
            showResults();
            return;
        }

        state.answered = false;
        state.selectedAnswer = null;

        elements.category.textContent = question.category || "General Knowledge";
        elements.question.textContent = question.question;

        elements.options.replaceChildren();

        question.options.forEach(function (optionText, index) {
            elements.options.appendChild(makeOption(optionText, index));
        });

        elements.feedback.hidden = true;
        elements.feedbackTitle.textContent = "";
        elements.feedbackExplanation.textContent = "";

        elements.submit.hidden = false;
        elements.submit.disabled = false;
        elements.submit.innerHTML =
            'Check answer <span aria-hidden="true">→</span>';

        elements.next.hidden = true;
        elements.next.disabled = true;

        elements.results.hidden = true;
        elements.container.hidden = false;

        elements.score.textContent = String(state.score);

        updateProgress();

        elements.question.focus({ preventScroll: true });
    }

    async function checkAnswer() {
        if (state.answered || state.checking) {
            return;
        }

        const selected = elements.options.querySelector(
            'input[name="quiz-answer"]:checked'
        );

        if (!selected) {
            elements.feedback.hidden = false;
            elements.feedback.className = "quiz-feedback is-warning";
            elements.feedbackTitle.textContent = "Choose an answer first.";
            elements.feedbackExplanation.textContent =
                "Select one of the options above before checking your answer.";

            return;
        }

        state.selectedAnswer = Number(selected.value);

        const question = state.questions[state.currentIndex];
        let correct;

        // Block repeated clicks while the answer is being checked.
        state.checking = true;
        elements.submit.disabled = true;

        try {
            const response = await fetch("/api/quiz/answers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    questionId: question.id,
                    selectedAnswer: state.selectedAnswer
                })
            });

            if (!response.ok) {
                throw new Error("Answer checking API unavailable");
            }

            const result = await response.json();

            correct = result.correct;
            question.answer = result.correctAnswer;
            question.explanation = result.explanation;
        } catch (error) {
            console.warn("Backend unavailable; checking answer locally.", error);

            const localQuestion = data.quizQuestions.find(function (item) {
                return item.id === question.id;
            });

            if (!localQuestion) {
                showError("Could not check the answer. Please try again.");
                return;
            }

            correct = state.selectedAnswer === localQuestion.answer;
            question.answer = localQuestion.answer;
            question.explanation = localQuestion.explanation;
        } finally {
            state.checking = false;
            elements.submit.disabled = false;
        }

        state.answered = true;

        if (correct) {
            state.score += 1;
        }

        elements.score.textContent = String(state.score);

        const optionLabels = elements.options.querySelectorAll(".quiz-option");

        optionLabels.forEach(function (label, index) {
            const input = label.querySelector("input");

            input.disabled = true;
            label.classList.remove("is-selected");

            if (index === question.answer) {
                label.classList.add("is-correct");
            } else if (index === state.selectedAnswer && !correct) {
                label.classList.add("is-incorrect");
            }
        });

        elements.feedback.hidden = false;
        elements.feedback.className = correct
            ? "quiz-feedback is-correct"
            : "quiz-feedback is-incorrect";

        elements.feedbackTitle.textContent = correct
            ? "Correct! Excellent discovery."
            : "Not quite — keep exploring.";

        elements.feedbackExplanation.textContent =
            question.explanation ||
            "Continue exploring the Curio Museum to learn more about this topic.";

        elements.submit.hidden = true;
        elements.next.hidden = false;
        elements.next.disabled = false;

        const isLastQuestion =
            state.currentIndex === state.questions.length - 1;

        elements.next.innerHTML = isLastQuestion
            ? 'View your results <span aria-hidden="true">→</span>'
            : 'Next question <span aria-hidden="true">→</span>';

        elements.next.focus({ preventScroll: true });
    }

    function nextQuestion() {
        if (!state.answered) {
            return;
        }

        if (state.currentIndex < state.questions.length - 1) {
            state.currentIndex += 1;
            renderQuestion();
            return;
        }

        showResults();
    }

    function showResults() {
        const total = state.questions.length;
        const percentage = Math.round((state.score / total) * 100);

        elements.container.hidden = true;
        elements.results.hidden = false;

        if (elements.finalScore) {
            elements.finalScore.textContent = String(state.score);
        }

        if (elements.finalTotal) {
            elements.finalTotal.textContent = String(total);
        }

        if (elements.finalPercentage) {
            elements.finalPercentage.textContent =
                percentage + "% correct";
        }

        if (elements.resultsTitle) {
            if (percentage === 100) {
                elements.resultsTitle.textContent =
                    "An extraordinary mind!";
            } else if (percentage >= 70) {
                elements.resultsTitle.textContent =
                    "A remarkable explorer!";
            } else if (percentage >= 40) {
                elements.resultsTitle.textContent =
                    "Your curiosity is growing.";
            } else {
                elements.resultsTitle.textContent =
                    "Every expert starts with curiosity.";
            }
        }

        if (elements.resultsDescription) {
            elements.resultsDescription.textContent =
                "You answered " + state.score + " out of " + total +
                " questions correctly. " +
                (percentage >= 70
                    ? "Wonderful work. Keep discovering new things."
                    : "Explore more exhibits and return to challenge yourself again.");
        }

        elements.progressFill.style.width = "100%";
        elements.progressTrack.setAttribute("aria-valuenow", "100");
        elements.progressPercentage.textContent = "100%";
        elements.progressText.textContent = "Challenge complete";

        elements.results.scrollIntoView({
            behavior: window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches ? "auto" : "smooth",
            block: "start"
        });

        elements.restart.focus({ preventScroll: true });
    }

    function restartQuiz() {
        state.questions = shuffleQuestions(questionBank);
        state.currentIndex = 0;
        state.score = 0;
        state.answered = false;
        state.selectedAnswer = null;

        renderQuestion();

        elements.container.scrollIntoView({
            behavior: window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches ? "auto" : "smooth",
            block: "start"
        });
    }

    elements.submit.addEventListener("click", checkAnswer);
    elements.next.addEventListener("click", nextQuestion);
    elements.restart.addEventListener("click", restartQuiz);

    elements.options.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !state.answered) {
            const target = event.target;

            if (target.matches('input[name="quiz-answer"]')) {
                event.preventDefault();
                checkAnswer();
            }
        }
    });

    loadQuizQuestions();
});