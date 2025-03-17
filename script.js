const BOT_TOKEN = "7511284981:AAHtfAInClOnPffJ4AayqQWby5kbehk_k2E";  
const CHAT_ID = "7784370236";      

const questions = [
    { text: "Siapa sepuh coding di Eberardos?", options: ["Arya", "Ikram", "Ardi", "Faiz"], correct: 2 },
    { text: "Siapa yang paling jomok di Eberardos?", options: ["Faiz", "Ikram", "Ardan", "Haekal"], correct: 0 },
    { text: "Apa mata uang Eberardos?", options: ["YEN", "USD", "WON", "DEB"], correct: 3 },
    { text: "Siapa yang dibenci di Eberardos?", options: ["Salma", "Ikram", "Salmon"], correct: 0 },
    { text: "Berapa bounty Ikram?", options: ["1,650.344 Deb", "5,320.654 Deb", "7,810.282 Deb", "9,745.000 Deb"], correct: 2 },
    { text: "Siapa pendiri Eberardos?", options: ["Arya", "Ikram", "Ardi", "Faiz"], correct: 0 },
    { text: "Berapa umur Eberardos?", options: ["1 Tahun", "2 Tahun", "3 Tahun", "4 Tahun"], correct: 3 },
    { text: "Apa misi utama Eberardos?", options: ["Bantai salma", "Basmi jomok", "Bantai ikram😹"], correct: 0 },
    { text: "Siapa yang dikenal dengan julukan 'Si Tukang DDoS' di Eberardos?", options: ["Faiz", "Ikram", "Ardi", "Ardan"], correct: 1 },
    { text: "Siapa yang suka hapus pesan kalau Eberardos lagi ramai?", options: ["Ikram😹", "Jelas ikram lah", "Ikram sih😠", "Si negro tuh Ikram", "Ikrom cik"], correct: 0 }
];

// Mengecek apakah jumlah soal di Local Storage berbeda dengan jumlah soal sekarang
let savedAnswers = JSON.parse(localStorage.getItem("userAnswers"));
if (!savedAnswers || savedAnswers.length !== questions.length) {
    localStorage.removeItem("userAnswers");
    localStorage.removeItem("currentQuestion");
}

// Mengambil data dari Local Storage atau inisialisasi ulang
let userName = localStorage.getItem("userName") || "";
let currentQuestion = parseInt(localStorage.getItem("currentQuestion")) || 0;
let userAnswers = JSON.parse(localStorage.getItem("userAnswers")) || new Array(questions.length).fill(null);

const nameScreen = document.getElementById("name-screen");
const quizScreen = document.getElementById("quiz-screen");
const userNameInput = document.getElementById("user-name");
const startBtn = document.getElementById("start-btn");
const questionNumber = document.getElementById("question-number");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const loadingScreen = document.getElementById("loading-screen");

if (userName) {
    nameScreen.style.display = "none";
    quizScreen.style.display = "block";
}

startBtn.addEventListener("click", () => {
    userName = userNameInput.value.trim();
    if (userName === "") {
        Swal.fire({
            icon: "warning",
            title: "Nama Kosong!",
            text: "Harap masukkan nama sebelum mulai kuis.",
            confirmButtonText: "OK"
        });
    } else {
        localStorage.setItem("userName", userName);
        nameScreen.style.display = "none";
        quizScreen.style.display = "block";
        loadQuestion();
    }
});

function saveProgress() {
    localStorage.setItem("currentQuestion", currentQuestion);
    localStorage.setItem("userAnswers", JSON.stringify(userAnswers));
}

function loadQuestion() {
    loadingScreen.style.display = "flex";
    setTimeout(() => {
        loadingScreen.style.display = "none";

        const q = questions[currentQuestion];
        questionNumber.textContent = `Soal ${currentQuestion + 1}/${questions.length}`; 
        questionText.textContent = q.text;
        optionsContainer.innerHTML = "";

        q.options.forEach((option, index) => {
            const optionDiv = document.createElement("div");
            optionDiv.classList.add("option");
            if (userAnswers[currentQuestion] === index) {
                optionDiv.classList.add("selected");
            }
            optionDiv.innerHTML = `<div class="option-circle">${String.fromCharCode(65 + index)}</div> ${option}`;
            optionDiv.onclick = () => selectAnswer(index);
            optionsContainer.appendChild(optionDiv);
        });

        prevBtn.style.display = currentQuestion === 0 ? "none" : "inline-block";
        nextBtn.textContent = currentQuestion === questions.length - 1 ? "Kirim" : ">";
    }, 500);
}

function selectAnswer(index) {
    userAnswers[currentQuestion] = index;
    document.querySelectorAll(".option").forEach(opt => opt.classList.remove("selected"));
    document.querySelectorAll(".option")[index].classList.add("selected");
    saveProgress();
}

nextBtn.addEventListener("click", () => {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        saveProgress();
        loadQuestion();
    } else {
        if (userAnswers.includes(null)) {
            Swal.fire({
                icon: "warning",
                title: "Jawaban Belum Lengkap!",
                text: "Harap isi semua soal sebelum mengirim.",
                confirmButtonText: "OK"
            });
        } else {
            submitQuiz();
        }
    }
});

prevBtn.addEventListener("click", () => {
    if (currentQuestion > 0) {
        currentQuestion--;
        saveProgress();
        loadQuestion();
    }
});

function submitQuiz() {
    let message = `📢 *Eberardos Quiz Submission*\n\n👤 *Nama:* ${userName}\n\n`;

    questions.forEach((q, i) => {
        const userAnswer = userAnswers[i] !== null ? q.options[userAnswers[i]] : "❌ Belum Dijawab";
        const correctAnswer = q.options[q.correct];
        const isCorrect = userAnswers[i] === q.correct ? "✅" : "❌";

        message += `*Soal ${i + 1}:* ${q.text}\n`;
        message += `🔹 *Jawaban Kamu:* ${userAnswer} ${isCorrect}\n`;
        message += `✔️ *Jawaban Benar:* ${correctAnswer}\n\n`;
    });

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const params = {
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "Markdown"
    };

    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params)
    })
    .then(() => {
        Swal.fire({
            icon: "success",
            title: "Jawaban Terkirim!",
            text: `Terima kasih, ${userName}!`,
            confirmButtonText: "OK"
        }).then(() => {
            localStorage.clear();
            location.reload();
        });
    })
    .catch(() => {
        Swal.fire({
            icon: "error",
            title: "Gagal Mengirim!",
            text: "Terjadi kesalahan, coba lagi nanti.",
            confirmButtonText: "OK"
        });
    });
}