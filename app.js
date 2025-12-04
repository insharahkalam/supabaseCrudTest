const projectUrl = 'https://dfvwocgwsdylslkcpirr.supabase.co'
const projectKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmdndvY2d3c2R5bHNsa2NwaXJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NzMwMTAsImV4cCI6MjA4MDA0OTAxMH0.4fRihdMX5lO8TNQXQdksFHDqy0OuxAunYD_argcSgy4'

const { createClient } = supabase;
const client = createClient(projectUrl, projectKey)
console.log(createClient);
console.log(client);

// ==========signup========

const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const btn = document.getElementById("btn");

btn && btn.addEventListener("click", async (e) => {
    e.preventDefault();

    const user = username.value.trim();
    const mail = email.value.trim();
    const pass = password.value.trim();

    // ---------------- VALIDATION ----------------

    // Username check
    if (!user || !mail || !pass) {
        Swal.fire({
            title: "Error!",
            text: "All Fields Required.",
            icon: "error",
        });
        return;
    }

    // Email format check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(mail)) {
        Swal.fire({
            title: "Invalid Email Format!",
            text: "Please enter a valid email address.",
            icon: "error",
        });
        return;
    }

    // Password length check
    if (pass.length < 6) {
        Swal.fire({
            title: "Weak Password!",
            text: "Password must be at least 6 characters or long.",
            icon: "error",
        });
        return;
    }

    // ---------------- SUPABASE SIGNUP ----------------
    const { data, error } = await client.auth.signUp({
        email: mail,
        password: pass,
        options: {
            data: {
                username: user,
            },
        },
    });

    // Signup error
    if (error) {
        Swal.fire({
            title: "Signup Failed!",
            text: error.message,
            icon: "error",
        });
        return;
    }

    // Signup success
    if (data) {
        const userdata = data.user.user_metadata;

        // Insert into AllUserData table
        const insertUser = await client
            .from('AllUserData')
            .insert({
                user_id: data.user.id,
                name: userdata.username,
                email: userdata.email,
            });

        if (insertUser.error) {
            console.log("Insert error", insertUser.error);
        }

        Swal.fire({
            title: "Signup Successful!",
            text: "Your account has been created.",
            icon: "success",
        }).then(() => {
            username.value = "";
            email.value = "";
            password.value = "";
            window.location.href = "login.html";
        });
    }
});

// =========LOGIN===========

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginBtn = document.getElementById("loginBtn");

loginBtn && loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();

    // ----------- EMPTY FIELDS CHECK -----------
    if (!email || !password) {
        Swal.fire({
            title: "Missing Info!",
            text: "Both Email And password required.",
            icon: "warning",
        });
        return;
    }

    // ----------- PASSWORD LENGTH CHECK -----------
    if (password.length < 6) {
        Swal.fire({
            title: "Weak Password!",
            text: "Password must be at least 6 characters or long.",
            icon: "error",
        });
        return;
    }

    // ----------- ADMIN CHECK -----------
    if (email === "insharah@gmail.com" && password === "insharah123") {
        Swal.fire({
            title: "Admin Login Successfully!",
            icon: "success",
        }).then(() => {
            window.location.href = "admin.html";
        });
        return;
    }

    // ----------- SUPABASE LOGIN TRY -----------
    const { data, error } = await client.auth.signInWithPassword({
        email: email,
        password: password,
    });

    // ----------- WRONG LOGIN (Supabase Error) -----------
    if (error) {
        Swal.fire({
            title: "Login Failed!",
            text: "Invalid Login Credentials.",
            icon: "error",
        });
        return;
    }

    // ----------- NORMAL USER LOGIN SUCCESS -----------
    Swal.fire({
        title: "Login Successful!",
        text: "Welcome! You’re successfully logged in.",
        icon: "success",
    }).then(() => {
        loginEmail.value = "";
        loginPassword.value = "";
        window.location.href = "home.html";
    });

});


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
        console.log(q, "showdata");

        showQuestion.innerHTML += `
            <div class="bg-[#10233d] p-6 md:p-8 rounded-2xl shadow-xl mb-6">
                <p class="text-xl font-bold text-[#b7d1fd]"> ${q.Question}</p>
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

    // --- FETCH DATA ---
    const { data: mcqsData, error: mcqsErr } = await client
        .from("Mcqs_selected_answer")
        .select("*");
    const { data: tfData, error: tfErr } = await client
        .from("True-false_Answer")
        .select("*");
    const { data: commentData, error: commentErr } = await client
        .from("User_comments")
        .select("*");

    const { data: correctMcq, error: mcqCorrErr } = await client
        .from("MultipleQuestion")
        .select("id, CorrectAnswer");

    const { data: correctTF, error: tfCorrErr } = await client
        .from("Ture-False")
        .select("id, CorrectAnswer");

    if (mcqsErr || tfErr || commentErr || mcqCorrErr || tfCorrErr) {
        console.log("Fetch error:", mcqsErr || tfErr || commentErr || mcqCorrErr || tfCorrErr);
        return;
    }

    // --- CREATE CORRECT ANSWER MAPS ---
    const correctMcqMap = {};
    correctMcq.forEach(q => correctMcqMap[q.id] = q.CorrectAnswer);


    const correctTFMap = {};
    correctTF.forEach(q => correctTFMap[q.id] = q.CorrectAnswer);

    // --- UNIQUE QUESTIONS ---
    const mcqsQuestions = [...new Set(mcqsData.map(i => i.question_id))];
    const tfQuestions = [...new Set(tfData.map(i => i.question_id))];

    // --- GROUP USER ANSWERS ---
    const grouped = {};

    mcqsData.forEach(i => {
        if (!grouped[i.user_id]) grouped[i.user_id] = { user_name: i.user_name, mcqs: {}, tf: {}, comment: "", result: "" };
        grouped[i.user_id].mcqs[i.question_id] = i.selected_answer;
    });

    tfData.forEach(i => {
        if (!grouped[i.user_id]) grouped[i.user_id] = { user_name: i.user_name, mcqs: {}, tf: {}, comment: "", result: "" };
        grouped[i.user_id].tf[i.question_id] = i.selected_answer;
    });

    commentData.forEach(i => {
        if (!grouped[i.user_id]) grouped[i.user_id] = { user_name: i.user_name, mcqs: {}, tf: {}, comment: "", result: "" };
        grouped[i.user_id].comment = i.comments;
    });

    // --- CALCULATE PASS/FAIL ---
    Object.entries(grouped).forEach(([uid, user]) => {
        let total = 0;
        let correct = 0;

        mcqsQuestions.forEach(qid => {
            total++;
            String(user.mcqs[qid]).trim().toLowerCase() === String(correctMcqMap[qid]).trim().toLowerCase()
        });

        tfQuestions.forEach(qid => {
            total++;
            // user.tf[qid] string ho sakta hai "true"/"false" → convert to boolean
            const userAnswer = (user.tf[qid] === "true" || user.tf[qid] === true); // convert string "true" to boolean
            if (userAnswer === correctTFMap[qid]) correct++;
        });

        user.result = correct >= total / 2 ? "Pass" : "Fail"; // 50% pass criteria
    });

    // --- UPDATE CARD COUNT ---
    const userAnswerCount = document.getElementById("userAnswerCount");
    const userCount = Object.keys(grouped).length;
    if (userAnswerCount) userAnswerCount.innerText = userCount;

    // --- BUILD TABLE ---
    let html = `
    <div class="backdrop-blur-xl bg-white/10 border border-white/10 shadow-2xl rounded-2xl p-7">
        <h1 class="text-3xl font-bold mb-6">User Submitted Answers</h1>
        <div class="overflow-x-auto rounded-xl border border-white/10 shadow-xl">
            <table class="w-full text-sm">
                <thead class="bg-white/20 text-gray-200">
                    <tr>
                        <th class="px-4 py-3 font-bold">User ID</th>
                        <th class="px-4 py-3 font-bold">Name</th>`;

    mcqsQuestions.forEach((qid, i) => html += `<th class="px-4 py-3 font-bold">MCQ ${i + 1}</th>`);
    tfQuestions.forEach((qid, i) => html += `<th class="px-4 py-3 font-bold">T/F ${i + 1}</th>`);

    html += `<th class="px-4 py-3 font-bold">Comment</th>
             <th class="px-4 py-3 font-bold">Result</th>
             </tr></thead><tbody>`;

    Object.entries(grouped).forEach(([uid, user]) => {
        html += `
        <tr class="border-b border-gray-700/40 hover:bg-white/20 cursor-pointer transition">
            <td class="px-4 py-3">${uid}</td>
            <td class="px-4 py-3">${user.user_name}</td>`;

        mcqsQuestions.forEach(qid => html += `<td class="px-4 py-3">${user.mcqs[qid] || "-"}</td>`);
        tfQuestions.forEach(qid => html += `<td class="px-4 py-3">${user.tf[qid] || "-"}</td>`);

        html += `<td class="px-4 py-3">${user.comment || "-"}</td>`;
        html += `<td class="px-4 py-3 font-bold "><button class="${user.result === "Pass" ? "text-green-500 hover:text-white hover:bg-green-500 border border-green-500" : "text-red-500 hover:text-white hover:bg-red-500 border border-red-500"} rounded-xl px-5 py-2">${user.result}</button></td>`;
        html += `</tr>`;
    });

    html += `</tbody></table></div></div>`;
    userData.innerHTML = html;
}

loadMergedData();


// ======== Show ALl USERS (Beautiful UI) ========
try {
    const showAllUsers = document.getElementById("showAllUsers");

    const { data, error } = await client
        .from('AllUserData')
        .select('*')

    if (error) {
        console.log("error in fetching users data", error);
    } else {

        let tableHTML = `
    <div class="backdrop-blur-xl bg-white/10 p-6 rounded-2xl shadow-2xl border border-white/10">
        <h1 class="text-2xl font-bold mb-5">All Registered Users</h1>

        <div class="overflow-x-auto rounded-xl border border-white/10">
            <table class="w-full text-sm">
                <thead class="bg-white/20 text-gray-200">
                    <tr>
                        <th class="text-start ps-8 py-3 text-lg font-bold">User ID</th>
                        <th class="text-start ps-8 py-3 text-lg font-bold">Email</th>
                        <th class="text-start ps-8 py-3 text-lg font-bold">Username</th>
                        <th class="text-start ps-8 py-3 text-lg font-bold text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
    `;

        data.forEach(showuser => {
            tableHTML += `
            <tr class="border-b border-gray-700/50  hover:bg-white/20 cursor-pointer transition">
                <td class="text-start ps-8 py-3">${showuser.user_id}</td>
                <td class="text-start ps-8 py-3">${showuser.email}</td>
                <td class="text-start ps-8 py-3">${showuser.name}</td>
                <td class="text-start ps-8 py-3 text-center">
                    <button onclick="deleteUser('${showuser.user_id}')"
                        class="bg-red-600 hover:bg-red-800 font-bold transition px-6 me-4 md:me-0 py-2 rounded-lg text-white shadow-lg">
                        Delete
                    </button>
                </td>
            </tr>
        `;
        });

        tableHTML += `
                </tbody>
            </table>
        </div>
    </div>
    `;

        showAllUsers.innerHTML = tableHTML;
    }

} catch (error) {
    console.log(error);
}


// ======== Delete User ========

async function deleteUser(userId) {
    console.log("Deleting row:", userId);

    const { error } = await client
        .from("AllUserData")
        .delete()
        .eq("user_id", userId);

    if (error) {
        console.log("Delete error:", error);
        alert("Delete failed");
        return;
    }

    alert("User deleted successfully!");
    location.reload();
}

window.deleteUser = deleteUser;


// =========ALL USER COUNT========
try {

    async function showUserCount() {
        const userCount = document.getElementById("userCount");

        const { count, error } = await client
            .from("AllUserData")
            .select("*", { count: "exact", head: true });

        if (error) {
            console.log("Error fetching count:", error);
            return;
        }

        console.log("Total Users:", count);
        userCount.textContent = count;
    }
    showUserCount()

} catch (error) {
    console.log(error, "count error");
}

// =====show 5 user in  admin page======
try {
    const userTable = document.getElementById("userTable")
    const { data, error } = await client
        .from("AllUserData")
        .select("*")
        .limit(5);
    if (error) {
        console.log("Error fetching users:", error);
    }

    userTable.innerHTML = '';
    data.forEach(user => {
        userTable.innerHTML += `
            <tr class="hover:bg-gray-200">
                <td class="p-2 border">${user.user_id}</td>
                <td class="p-2 border">${user.name}</td>
                <td class="p-2 border">${user.email}</td>
            </tr>
        `;
    });

} catch (error) {
    console.log(error, "show 5 users erroe");
}

// =========ALL MCQS COUNT========
try {

    async function mcqsCountData() {
        const mcqsCount = document.getElementById("mcqsCount");

        const { count, error } = await client
            .from("MultipleQuestion")
            .select("*", { count: "exact", head: true });

        if (error) {
            console.log("Error fetching count:", error);
            return;
        }

        console.log("Total Users:", count);
        mcqsCount.textContent = count;
    }
    mcqsCountData()

} catch (error) {
    console.log(error, "count error");
}


// =========ALL TRUE/FALSE COUNT========
try {

    async function tfCountData() {
        const tfCount = document.getElementById("tfCount");

        const { count, error } = await client
            .from("Ture-False")
            .select("*", { count: "exact", head: true });

        if (error) {
            console.log("Error fetching count:", error);
            return;
        }

        console.log("Total Users:", count);
        tfCount.textContent = count;
    }
    tfCountData()

} catch (error) {
    console.log(error, "count error");
}

// ==========ADMIN LOGOUT=========

const adminLogout = document.getElementById("adminLogout")

adminLogout && adminLogout.addEventListener("click", () => {
    alert("Logout Successfully!")
    window.location.href = "login.html"
})