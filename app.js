const projectUrl = 'https://dfvwocgwsdylslkcpirr.supabase.co'
const projectKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmdndvY2d3c2R5bHNsa2NwaXJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NzMwMTAsImV4cCI6MjA4MDA0OTAxMH0.4fRihdMX5lO8TNQXQdksFHDqy0OuxAunYD_argcSgy4'

const { createClient } = supabase;
const client = createClient(projectUrl, projectKey)
console.log(createClient);
console.log(client);



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




// =========LOGIN============


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



// ========data comment=======

const dataComment = document.getElementById("dataComment")
const saveBtn2 = document.getElementById("saveBtn2")
saveBtn2 && saveBtn2.addEventListener("click", async (e) => {
    e.preventDefault()



    const { error } = await client
        .from('AddComment')
        .insert({ Description: dataComment.value })

    if (error) {
        console.log(error, "data error");
    } else {
        alert("data added")
        dataComment.value = ""
    }

})


// ============FETCH DATA===========


const showQuestion = document.getElementById("showQuestion")
const showtruefalseQuestion = document.getElementById("showtruefalseQuestion")

const { data, error } = await client
    .from('MultipleQuestion')
    .select('*')


const { data1, error1 } = await client
    .from('Ture-False')
    .select('*')
data1.forEach(truequiz => {

    showQuestion.innerHTML += `
    
 <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
    <p id="question" class="text-lg font-semibold mb-6">${quiz.Question}</p>

    <div class="mb-4">
      <label class="flex items-center mb-2">
        <input type="radio" name="answer" value="Paris" class="mr-2">
        ${quiz.Option1}
      </label>
      <label class="flex items-center mb-2">
        <input type="radio" name="answer" value="London" class="mr-2">
        ${quiz.Option2}
      </label>
      <label class="flex items-center mb-2">
        <input type="radio" name="answer" value="Rome" class="mr-2">
        ${quiz.Option3}
      </label>
      <label class="flex items-center mb-2">
        <input type="radio" name="answer" value="Berlin" class="mr-2">
        ${quiz.Option4}
      </label>
    </div>

    <button onclick="checkAnswer()" class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded w-full">
      Submit
    </button>

    `
});