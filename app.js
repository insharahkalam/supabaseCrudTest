const projectUrl = 'https://dfvwocgwsdylslkcpirr.supabase.co'
const projectKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmdndvY2d3c2R5bHNsa2NwaXJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NzMwMTAsImV4cCI6MjA4MDA0OTAxMH0.4fRihdMX5lO8TNQXQdksFHDqy0OuxAunYD_argcSgy4'

const { createClient } = supabase;
const client = createClient(projectUrl, projectKey)
console.log(createClient);
console.log(client);

// ==========signup========

const username = document.getElementById("username")
const email = document.getElementById("email")
const password = document.getElementById("password")
const btn = document.getElementById("btn")

btn && btn.addEventListener("click", async (e) => {
    e.preventDefault()
    const { data, error } = await client.auth.signUp({
        email: email.value,
        password: password.value,
        options: {
            data: {
                username: username.value
            }
        }
    })
    if (data) {
        console.log(data);
        alert("User registered!")
        username.value = ""
        email.value = ""
        password.value = ""
        window.location.href = "home.html"
    } else {
        console.log("User register error!====", error);
    }

})

// =========LOGIN===========

const loginEmail = document.getElementById("loginEmail")
const loginPassword = document.getElementById("loginPassword")
const loginBtn = document.getElementById("loginBtn")

loginBtn && loginBtn.addEventListener("click", async (e) => {
    e.preventDefault()
    const { data, error } = await client.auth.signInWithPassword({
        email: loginEmail.value,
        password: loginPassword.value,
    })

    if (loginEmail.value === "insharah@gmail.com" && loginPassword.value === "insharah123") {
        window.location.href = "admin.html"
    } else {
        if (data) {
            console.log(data);

            alert("User logedin successfully!")
            loginEmail.value = ""
            loginPassword.value = ""
            window.location.href = "home.html"
        } else {
            console.log("User login error!====", error);

        }
    }
})

// ===========MLTIPLE CHOOSE======

const multipleQuestions = document.getElementById("multipleQuestions")
const optionA = document.getElementById("optionA")
const optionB = document.getElementById("optionB")
const optionC = document.getElementById("optionC")
const optionD = document.getElementById("optionD")
const multipleCorrect = document.getElementById("multipleCorrect")
const saveBtn = document.getElementById("saveBtn")

saveBtn && saveBtn.addEventListener("click", async (e) => {
    e.preventDefault()

    const { error } = await client
        .from('MultipleQuestion')
        .insert({ Question: multipleQuestions.value, Option1: optionA.value, Option2: optionB.value, Option3: optionC.value, Option4: optionD.value, CorrectAnswer: multipleCorrect.value })

    if (error) {
        console.log("multiple error", error);
    } else {
        alert("data insert seccessfully!");
        multipleQuestions.value = ""
        optionA.value = ""
        optionB.value = ""
        optionC.value = ""
        optionD.value = ""
        multipleCorrect.value = ""

    }
})

// =========true/false=======
const truefalseQuestion = document.getElementById("truefalseQuestion")
const tfCorrect = document.getElementById("tfCorrect")
const saveBtn1 = document.getElementById("saveBtn1")


saveBtn1 && saveBtn1.addEventListener("click", async (e) => {
    e.preventDefault()


    const { error } = await client
        .from('Ture-False')
        .insert({ Question: truefalseQuestion.value, CorrectAnswer: tfCorrect.value })

    if (error) {
        console.log(error, "true false error");
    } else {
        alert("true false added successfully!!")
        truefalseQuestion.value = ""
        tfCorrect.value = ""
    }
})

// ---------------- TIMER UI ----------------
let timeLeft = 10 * 60; 
const timerBox = document.getElementById("timer");

function updateTimer() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;

    timerBox.innerText = `Timer: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

    timeLeft--;

    if (timeLeft < 0) {
        localStorage.removeItem("token");
        window.location.href = "login.html";
    }
}

setInterval(updateTimer, 1000);

// ---------------------- STEP CONTROL ----------------------
let step = 1;

const showQuestion = document.getElementById("showQuestion")
const showtruefalseQuestion = document.getElementById("showtruefalseQuestion")
const showComment = document.getElementById("showComment")

// Start with step 1 only visible
showQuestion.style.display = "block";
showtruefalseQuestion.style.display = "none";
showComment.style.display = "none";

function goToStep(newStep) {
    step = newStep;

    showQuestion.style.display = step === 1 ? "block" : "none";
    showtruefalseQuestion.style.display = step === 2 ? "block" : "none";
    showComment.style.display = step === 3 ? "block" : "none";
}

window.goToStep = goToStep;


// ================FETCH DATA=======================

// ========== MULTIPLE QUESTIONS =========
try {
    const { data, error } = await client.from('MultipleQuestion').select('*');

    if (error) console.log(error);
    else {
        data.forEach(q => {
            showQuestion.innerHTML += `
            <div class="bg-[#10233d] p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-xl mb-6 mx-auto">
                <p class="text-xl md:text-2xl font-bold mb-5 text-[#b7d1fd]">${q.Question}</p>

                <label class="flex items-center mb-3 cursor-pointer hover:bg-[#153052] p-3 rounded-lg transition-colors">
                    <input type="radio" name="mcq-${q.id}" class="mr-3 text-black">
                    <span class="text-white">${q.Option1}</span>
                </label>

                <label class="flex items-center mb-3 cursor-pointer hover:bg-[#153052] p-3 rounded-lg transition-colors">
                    <input type="radio" name="mcq-${q.id}" class="mr-3 text-black">
                    <span class="text-white">${q.Option2}</span>
                </label>

                <label class="flex items-center mb-3 cursor-pointer hover:bg-[#153052] p-3 rounded-lg transition-colors">
                    <input type="radio" name="mcq-${q.id}" class="mr-3 text-black">
                    <span class="text-white">${q.Option3}</span>
                </label>

                <label class="flex items-center mb-3 cursor-pointer hover:bg-[#153052] p-3 rounded-lg transition-colors">
                    <input type="radio" name="mcq-${q.id}" class="mr-3 text-black">
                    <span class="text-white">${q.Option4}</span>
                </label>
            </div>
        `;
        });

        showQuestion.innerHTML += `
            <button onclick="goToStep(2)" 
            class="bg-[#1c75ff] hover:bg-[#0059d6]  text-white font-semibold px-6 py-3 rounded-xl w-full md:max-w-xl mx-auto block mt-4 transition-all shadow-lg">
                Next 
            </button>
        `;
    }

} catch (e) {
    console.log("Multiple fetch error", e);
}

// ================== FETCH TRUE/FALSE QUESTIONS (STEP 2) ==================

try {
    const { data, error } = await client.from('Ture-False').select('*');

    if (error) console.log(error);
    else {
        data.forEach(tf => {
            showtruefalseQuestion.innerHTML += `
            <div class="bg-[#10233d] p-6 md:p-8 m-3 rounded-2xl shadow-xl w-full max-w-xl mb-6 mx-auto">
                <p class="text-xl md:text-2xl font-bold mb-5 text-[#b7d1fd]">${tf.Question}</p>

                <div class="flex gap-6">
                    <label class="flex items-center cursor-pointer p-3 rounded-lg transition-colors hover:bg-[#153052]">
                        <input type="radio" name="tf-${tf.id}" class="mr-3 w-5 h-5 text-black">
                        <span class="text-white">TRUE</span>
                    </label>
                    <label class="flex items-center cursor-pointer p-3 rounded-lg transition-colors hover:bg-[#153052]">
                        <input type="radio" name="tf-${tf.id}" class="mr-3 w-5 h-5 text-black">
                        <span class="text-white">FALSE</span>
                    </label>
                </div>
            </div>
        `;
        });

        // ADD NEXT BUTTON 
        showtruefalseQuestion.innerHTML += `
            <button onclick="goToStep(3)" 
            class="bg-[#1c75ff] hover:bg-[#0059d6] border-white text-white font-semibold px-6 py-3 rounded-xl w-full md:max-w-xl mx-auto block mt-4 transition-all shadow-lg">
                Next
            </button>
        `;
    }

} catch (e) {
    console.log("True/False fetch error", e);
}

// ================== COMMENT SECTION (STEP 3) ==================
showComment.innerHTML = `
   <div class="bg-[#10233d] p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-xl mb-6 mx-auto">
        <label class="font-semibold mb-2 block text-white">Add a comment</label>

        <textarea id="dataComment" 
        class="w-full p-3 rounded-lg bg-[#153052] text-white border border-[#2a4d77]"></textarea>

        <p class="text-[#88a4c8] mt-3 text-sm">
            *You can ask anything in a comment.*
        </p>

        <button onclick="saveComment()" 
        class="bg-[#1c75ff] mt-4 hover:bg-[#0059d6] transition-all font-semibold py-3 px-6 rounded-lg w-full text-white">
            Submit Comment
        </button>
    </div>
`;


window.saveComment = async function () {
    window.location.href = "thankyou.html"
}



//     const comment = document.getElementById("dataComment").value;

//     if (!comment.trim()) {
//         alert("Please write a comment!");
//         return;
//     }

//     // SAVE TO SUPABASE
//     const { data, error } = await client
//         .from("UserComments")
//         .insert([{ comment }]);

//     if (error) {
//         console.log("Comment save error:", error);
//         alert("Failed to save comment.");
//         return;
//     }

//     // 🔥 REDIRECT TO THANK YOU PAGE
//     window.location.href = "thankyou.html";
// }

