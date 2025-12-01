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


// ---------------- TIMER UI ----------------
try {
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
} catch (error) {
    console.log("timer error", error);

}

// ===================== Fetch MULTIPLE Questions ======================
try {
    const { data, error } = await client.from('MultipleQuestion').select('*');

    if (error) console.log(error);
    else {

        data.forEach(q => {

            showQuestion.innerHTML += `
            <div class="bg-[#10233d] p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-xl mb-6 mx-auto">
                <p class="text-xl md:text-2xl font-bold mb-5 text-[#b7d1fd]">${q.Question}</p>

                <label class="flex items-center mb-3 cursor-pointer hover:bg-[#153052] p-3 rounded-lg transition-colors">
                    <input type="radio" name="mcq-${q.id}" value="${q.Option1}" class="mr-3 text-black">
                    <span class="text-white">${q.Option1}</span>
                </label>

                <label class="flex items-center mb-3 cursor-pointer hover:bg-[#153052] p-3 rounded-lg transition-colors">
                    <input type="radio" name="mcq-${q.id}" value="${q.Option2}" class="mr-3 text-black">
                    <span class="text-white">${q.Option2}</span>
                </label>

                <label class="flex items-center mb-3 cursor-pointer hover:bg-[#153052] p-3 rounded-lg transition-colors">
                    <input type="radio" name="mcq-${q.id}" value="${q.Option3}" class="mr-3 text-black">
                    <span class="text-white">${q.Option3}</span>
                </label>

                <label class="flex items-center mb-3 cursor-pointer hover:bg-[#153052] p-3 rounded-lg transition-colors">
                    <input type="radio" name="mcq-${q.id}" value="${q.Option4}" class="mr-3 text-black">
                    <span class="text-white">${q.Option4}</span>
                </label>
            </div>
        `;
        });

        showQuestion.innerHTML += `
            <button onclick="submitMcqs()"
            class="bg-[#1c75ff] hover:bg-[#0059d6] text-white font-semibold px-6 py-3 rounded-xl w-full md:max-w-xl mx-auto block mt-4 transition-all shadow-lg">
                Next
            </button>
        `;
    }

} catch (e) {
    console.log("Multiple fetch error", e);
}


// ========INSERT MCQS IN SUPABSE ==========

async function submitMcqs() {
    const { data: { user } } = await client.auth.getUser();
    const userId = user.id;
    const userName = user.user_metadata.username;
    console.log(userName);


    const { data: questions } = await client.from("MultipleQuestion").select("*");

    let allSelected = true;
    const answersToInsert = [];

    questions.forEach(async (q) => {
        const selected = document.querySelector(`input[name="mcq-${q.id}"]:checked`);

        if (!selected) {
            allSelected = false;
        } else {
            answersToInsert.push({

                user_id: userId,
                user_name: userName,
                question_id: q.id,
                selected_answer: selected.value
            })
        }
    });

    if (!allSelected) {
        alert("plzz fill all the feilds.")
        return;
    }
    const { error } = await client.from('Mcqs_selected_answer').insert(answersToInsert);

    if (error) {
        console.log("MCQS inserting error:", error);
        alert("Something went wrong while saving answers!");
        return;
    }
    alert("MCQS selected data inserted successfully!");

    goToStep(2)


}
window.submitMcqs = submitMcqs;



// ==================  TRUE/FALSE QUESTIONS ==================

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
            <button onclick="submitTrueFalse()"
            class="bg-[#1c75ff] hover:bg-[#0059d6] border-white text-white font-semibold px-6 py-3 rounded-xl w-full md:max-w-xl mx-auto block mt-4 transition-all shadow-lg">
                Next
            </button>
        `;
    }

} catch (e) {
    console.log("True/False fetch error", e);
}





// ================== COMMENT SECTION ==================
// showComment.innerHTML = `
//    <div class="bg-[#10233d] p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-xl mb-6 mx-auto">
//         <label class="font-semibold mb-2 block text-white">Add a comment</label>

//         <textarea id="dataComment" 
//         class="w-full p-3 rounded-lg bg-[#153052] text-white border border-[#2a4d77]"></textarea>

//         <p class="text-[#88a4c8] mt-3 text-sm">
//             *You can ask anything in a comment.*
//         </p>

//         <button onclick="saveComment()" 
//         class="bg-[#1c75ff] mt-4 hover:bg-[#0059d6] transition-all font-semibold py-3 px-6 rounded-lg w-full text-white">
//             Submit Comment
//         </button>
//     </div>
// `;


window.saveComment = async function () {
    window.location.href = "thankyou.html"
}

// ============fetch user in Admin page=========


const userData = document.getElementById("userData");

const { data, error } = await client
    .from('Mcqs_selected_answer')
    .select('*');

if (error) {
    console.log("user fetch in admin page error==", error);
} else {
    // 1️⃣ Sab questions ka unique list nikal lo
    const allQuestions = [...new Set(data.map(item => item.question_id))];

    // 2️⃣ Data ko user_id ke basis pe group karo
    const grouped = {};
    data.forEach(item => {
        const uid = String(item.user_id);
        if (!grouped[uid]) {
            grouped[uid] = {
                user_name: item.user_name,
                answers: {}
            };
        }
        // multiple answers overwrite na ho, array me push karo
        grouped[uid].answers[item.question_id] = item.selected_answer;
    });

    // 3️⃣ Table header dynamically
    let html = `<div class="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default">
        <table class="w-full text-sm text-left rtl:text-right text-body">
            <thead class="text-sm text-body bg-neutral-secondary-soft border-b rounded-base border-default">
                <tr>
                    <th class="px-6 py-3 font-medium">User Id</th>
                    <th class="px-6 py-3 font-medium">User Name</th>`;
    allQuestions.forEach((qId, index) => {
        html += `<th class="px-6 py-3 font-medium">Q${index + 1}</th>`;
    });
    html += `</tr></thead><tbody>`;

    // 4️⃣ Table body me users ke answers
    Object.entries(grouped).forEach(([uid, user]) => {
        html += `<tr class="bg-neutral-primary border-b border-default">
            <th class="px-6 py-4 font-medium text-heading whitespace-nowrap">${uid}</th>
            <td class="px-6 py-4">${user.user_name}</td>`;
        allQuestions.forEach(qId => {
            html += `<td class="px-6 py-4">${user.answers[qId] || ""}</td>`;
        });
        html += `</tr>`;
    });

    html += `</tbody></table></div>`;

    userData.innerHTML = html;
}
