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
        let userdata = data.user.user_metadata
        console.log(userdata);
        // ====insert user to supabase======
        const { error } = await client
            .from('AllUserData')
            .insert({ user_id: data.user.id, name: userdata.username, email: userdata.email })

        if (error) {
            console.log("user show error", error);
        } else {
            alert("User insert in supabase")
        }
        console.log(data);
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

try {
    let step = 1;

    const showQuestion = document.getElementById("showQuestion");
    const showtruefalseQuestion = document.getElementById("showtruefalseQuestion");
    const showComment = document.getElementById("showComment");

    // Check if elements exist before using them
    if (!showQuestion || !showtruefalseQuestion || !showComment) {
        console.warn("Step control elements not found!");
    } else {
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
    }

} catch (error) {
    console.error("Step control error:", error);
}

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

// ================= FETCH AND DISPLAY QUESTIONS =================

async function loadMCQS() {
    const { data } = await client.from('MultipleQuestion').select("*");
    data.forEach(q => {
        showQuestion.innerHTML += `
            <div class="bg-[#10233d] p-6 md:p-8 rounded-2xl shadow-xl mb-6">
                <p class="text-xl font-bold text-[#b7d1fd]">${q.Question}</p>
                ${['Option1', 'Option2', 'Option3', 'Option4'].map(opt => `
                    <label class="flex items-center mb-3 cursor-pointer hover:bg-[#153052] p-3 rounded-lg transition-colors">
                        <input type="radio" name="mcq-${q.id}" value="${q[opt]}" class="mr-3 text-black">
                        <span class="text-white">${q[opt]}</span>
                    </label>
                `).join('')}
            </div>
        `;
    });
    showQuestion.innerHTML += `<button onclick="submitMcqs()" class="bg-[#1c75ff] text-white font-semibold px-6 py-3 rounded-xl w-full block mt-4">Next</button>`;
}
loadMCQS();

async function loadTF() {
    const { data } = await client.from('Ture-False').select("*");
    data.forEach(tf => {
        showtruefalseQuestion.innerHTML += `
            <div class="bg-[#10233d] p-6 md:p-8 rounded-2xl shadow-xl mb-6">
                <p class="text-xl font-bold text-[#b7d1fd]">${tf.Question}</p>
                <div class="flex gap-6">
                    <label class="flex items-center cursor-pointer p-3 rounded-lg hover:bg-[#153052]">
                        <input type="radio" name="tf-${tf.id}" value="true" class="mr-3 w-5 h-5 text-black">
                        <span class="text-white">TRUE</span>
                    </label>
                    <label class="flex items-center cursor-pointer p-3 rounded-lg hover:bg-[#153052]">
                        <input type="radio" name="tf-${tf.id}" value="false" class="mr-3 w-5 h-5 text-black">
                        <span class="text-white">FALSE</span>
                    </label>
                </div>
            </div>
        `;
    });
    showtruefalseQuestion.innerHTML += `<button onclick="submitTFAnswer()" class="bg-[#1c75ff] text-white font-semibold px-6 py-3 rounded-xl w-full block mt-4">Next</button>`;
}
loadTF();

// ================= COMMENT SECTION =================
document.addEventListener("DOMContentLoaded", () => {
    if (!showComment) return;
    showComment.innerHTML = `
       <div class="bg-[#10233d] p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-xl mb-6 mx-auto">
            <label class="font-semibold mb-2 block text-white">Add a comment</label>
            <textarea id="dataComment" class="w-full p-3 rounded-lg bg-[#153052] text-white border border-[#2a4d77]"></textarea>
            <p class="text-[#88a4c8] mt-3 text-sm">*You can ask anything in a comment.*</p>
            <button onClick="saveComment()" class="bg-[#1c75ff] mt-4 font-semibold py-3 px-6 rounded-lg w-full text-white">Submit Comment</button>
        </div>
    `;
});


window.saveComment = async function () {
    const commentText = document.getElementById("dataComment").value.trim();
    if (!commentText) return alert("Please write a comment!");

    const { data: { user } } = await client.auth.getUser();
    if (!user) return alert("You must be logged in!");

    const user_id = user.id;
    const { error } = await client.from("User_comments").insert([{ user_id, comments: commentText }]);
    if (error) return alert("Error saving comment!");

    window.location.href = "thankyou.html";
};

// ================= INSERT MCQS =================

async function submitMcqs() {
    const { data: { user } } = await client.auth.getUser();
    const userId = user.id;
    const userName = user.user_metadata.username;

    const questions = await client.from("MultipleQuestion").select("*").then(res => res.data);

    const answersToInsert = [];
    let allSelected = true;

    questions.forEach(q => {
        const selected = document.querySelector(`input[name="mcq-${q.id}"]:checked`);
        if (!selected) allSelected = false;
        else answersToInsert.push({
            user_id: userId,
            user_name: userName,
            question_id: q.id,
            selected_answer: selected.value
        });
    });

    if (!allSelected) return alert("Please answer all MCQS!");

    const { error } = await client.from('Mcqs_selected_answer').insert(answersToInsert);
    if (error) return alert("Error saving MCQS answers!");

    // Go to step 2
    goToStep(2);
}
window.submitMcqs = submitMcqs;

// ================= INSERT TRUE/FALSE =================

async function submitTFAnswer() {
    const { data: { user } } = await client.auth.getUser();
    const userId = user.id;

    const tfquestions = await client.from("Ture-False").select("*").then(res => res.data);

    const answersToInsert = [];
    let allSelected = true;

    tfquestions.forEach(tf => {
        const selected = document.querySelector(`input[name="tf-${tf.id}"]:checked`);
        if (!selected) allSelected = false;
        else answersToInsert.push({
            user_id: userId,
            question_id: tf.id,
            selected_answer: selected.value
        });
    });

    if (!allSelected) return alert("Please answer all True/False questions!");

    const { error } = await client.from('True-false_Answer').insert(answersToInsert);
    if (error) return alert("Error saving True/False answers!");

    // Go to step 3
    goToStep(3);
}
window.submitTFAnswer = submitTFAnswer;

// ============fetch user in Admin page=========

async function loadMergedData() {
    const userData = document.getElementById("userData");

    // 1️⃣ Fetch MCQS answers
    const { data: mcqsData, error: mcqsErr } = await client
        .from("Mcqs_selected_answer")
        .select("*");

    // 2️⃣ Fetch True/False answers
    const { data: tfData, error: tfErr } = await client
        .from("True-false_Answer")
        .select("*");

    // 3️⃣ Fetch Comments
    const { data: commentData, error: commentErr } = await client
        .from("User_comments")
        .select("*");

    if (mcqsErr || tfErr || commentErr) {
        console.log("Fetch error:", mcqsErr || tfErr || commentErr);
        return;
    }

    // 4️⃣ Unique questions
    const mcqsQuestions = [...new Set(mcqsData.map(i => i.question_id))];
    const tfQuestions = [...new Set(tfData.map(i => i.question_id))];

    // 5️⃣ Group by user_id
    const grouped = {};

    // MCQS
    mcqsData.forEach(item => {
        const uid = item.user_id;
        if (!grouped[uid]) grouped[uid] = { user_name: item.user_name || "Anonymous", mcqs: {}, tf: {}, comment: "" };
        grouped[uid].mcqs[item.question_id] = item.selected_answer;
    });

    // True/False
    tfData.forEach(item => {
        const uid = item.user_id;
        if (!grouped[uid]) grouped[uid] = { user_name: item.user_name || "Anonymous", mcqs: {}, tf: {}, comment: "" };
        grouped[uid].tf[item.question_id] = item.selected_answer;
        if (!grouped[uid].user_name) grouped[uid].user_name = item.user_name || "Anonymous";
    });

    // Comments
    commentData.forEach(item => {
        const uid = item.user_id;
        if (!grouped[uid]) grouped[uid] = { user_name: item.user_name || "Anonymous", mcqs: {}, tf: {}, comment: "" };
        grouped[uid].comment = item.comments || "";
        if (!grouped[uid].user_name) grouped[uid].user_name = item.user_name || "Anonymous";
    });

    // 6️⃣ Build HTML Table
    let html = `<div class="relative overflow-x-auto shadow rounded">
        <table class="w-full text-sm text-left">
        <thead class="bg-gray-900">
        <tr>
            <th class="px-4 py-2">User ID</th>
            <th class="px-4 py-2">User Name</th>`;

    mcqsQuestions.forEach((qid, i) => html += `<th class="px-4 py-2">MCQ's A${i + 1}</th>`);
    tfQuestions.forEach((qid, i) => html += `<th class="px-4 py-2">T/F A${i + 1}</th>`);
    html += `<th class="px-4 py-2">Comment</th>`;
    html += `</tr></thead><tbody>`;

    // 7️⃣ Table rows
    Object.entries(grouped).forEach(([uid, user]) => {
        html += `<tr class="border-b">
            <td class="px-4 py-2">${uid}</td>
            <td class="px-4 py-2">${user.user_name}</td>`;

        mcqsQuestions.forEach(qid => html += `<td class="px-4 py-2">${user.mcqs[qid] || ""}</td>`);
        tfQuestions.forEach(qid => html += `<td class="px-4 py-2">${user.tf[qid] || ""}</td>`);
        html += `<td class="px-4 py-2">${user.comment || ""}</td>`;
        html += `</tr>`;
    });

    html += `</tbody></table></div>`;

    userData.innerHTML = html;
}

loadMergedData();


// ========Show ALl USERS========

const showAllUsers = document.getElementById("showAllUsers")



const { data, error } = await client
    .from('AllUserData')
    .select('*')

if (error) {
    console.log("error in fetching users data", error);
} else {
    data.forEach((showuser) => {
        console.log(showuser);
        
        showAllUsers.innerHTML = `
        
        <div class="relative overflow-x-auto shadow rounded">
        <table class="w-full text-sm text-left">
        <thead class="bg-gray-900">
        <tr>
            <th class="px-4 py-2">User ID</th>
            <th class="px-4 py-2">Email</th>
            <th class="px-4 py-2">Username</th>
        </tr>
        </thead><tbody>

        <tr>
            <td class="px-4 py-2">${showuser.user_id}</td>
            <td class="px-4 py-2">${showuser.email}</td>
            <td class="px-4 py-2">${showuser.name}</td>
            <td class="px-4 py-2"><button class="rounded-xl border px-3 py-2">Delete</button></td>
            
       </tr>
        </tbody></table></div>
        `
    })
}