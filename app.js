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



// // ===========MLTIPLE CHOOSE======

// const multipleQuestions = document.getElementById("multipleQuestions")
// const optionA = document.getElementById("optionA")
// const optionB = document.getElementById("optionB")
// const optionC = document.getElementById("optionC")
// const optionD = document.getElementById("optionD")
// const multipleCorrect = document.getElementById("multipleCorrect")
// const saveBtn = document.getElementById("saveBtn")

// if (multipleForm) {
//     console.log(multipleForm);
    
//     saveBtn && saveBtn.addEventListener("click", async (e) => {
//         e.preventDefault()

//         const { error } = await client
//             .from('MultipleQuestion')
//             .insert({ Question: multipleQuestions.value, Option1: optionA.value, Option2: optionB.value, Option3: optionC.value, Option4: optionD.value, CorrectAnswer: multipleCorrect.value })

//         if (error) {
//             console.log("multiple error", error);
//         } else {
//             alert("data insert seccessfully!");
//             multipleQuestions.value = ""
//             optionA.value = ""
//             optionB.value = ""
//             optionC.value = ""
//             optionD.value = ""
//             multipleCorrect.value = ""

//         }
//     })

// }
// else if (tfForm) {
//     // =========true/false=======
//     const truefalseQuestion = document.getElementById("truefalseQuestion")
//     const tfCorrect = document.getElementById("tfCorrect")
//     const trueSaveBtn = document.getElementById("saveBtn")


//     trueSaveBtn && trueSaveBtn.addEventListener("click", async (e) => {
//         e.preventDefault()


//         const { error } = await client
//             .from('Ture-False')
//             .insert({ Question: truefalseQuestion.value, CorrectAnswer: tfCorrect.value })


//         if (error) {
//             console.log(error, "true false error");
//         } else {
//             alert("true false added successfully!!")
//             truefalseQuestion.value = ""
//             tfCorrect.value = ""
//         }



//     })

// } else {

//     // ========data comment=======

//     const dataComment = document.getElementById("dataComment")
//     const dataBtn = dataBtn.getElementById("saveBtn")
//     dataBtn && dataBtn.addEventListener("click", async (e) => {
//         e.preventDefault()



//         const { error } = await client
//             .from('AddComment')
//             .insert({ Description: dataComment.value })

//         if (error) {
//             console.log(error, "data error");
//         } else {
//             alert("data added")
//         }

//     })
// }




// =========== MULTIPLE CHOICE ==========

const multipleForm = document.getElementById("multipleForm")
if (multipleForm) {

    const multipleQuestions = document.getElementById("multipleQuestions")
    const optionA = document.getElementById("optionA")
    const optionB = document.getElementById("optionB")
    const optionC = document.getElementById("optionC")
    const optionD = document.getElementById("optionD")
    const multipleCorrect = document.getElementById("multipleCorrect")
    const saveMultipleBtn = document.getElementById("saveMultipleBtn")

   saveMultipleBtn&& saveMultipleBtn.addEventListener("click", async (e) => {
        e.preventDefault()

        const { error } = await client
            .from('MultipleQuestion')
            .insert({
                Question: multipleQuestions.value,
                Option1: optionA.value,
                Option2: optionB.value,
                Option3: optionC.value,
                Option4: optionD.value,
                CorrectAnswer: multipleCorrect.value
            })

        if (error) {
            console.log("multiple error", error)
        } else {
            alert("Multiple choice inserted successfully!")
            multipleQuestions.value = ""
            optionA.value = ""
            optionB.value = ""
            optionC.value = ""
            optionD.value = ""
            multipleCorrect.value = ""
        }
    })
}


// ============= TRUE / FALSE =============

const tfForm = document.getElementById("tfForm")
if (tfForm) {

    const truefalseQuestion = document.getElementById("truefalseQuestion")
    const tfCorrect = document.getElementById("tfCorrect")
    const saveTfBtn = document.getElementById("saveTfBtn")

   saveTfBtn&& saveTfBtn.addEventListener("click", async (e) => {
        e.preventDefault()

        const { error } = await client
            .from('TrueFalse')
            .insert({
                Question: truefalseQuestion.value,
                CorrectAnswer: tfCorrect.value
            })

        if (error) {
            console.log("TF error", error)
        } else {
            alert("True/False added successfully!")
            truefalseQuestion.value = ""
            tfCorrect.value = ""
        }
    })
}


// ============ COMMENT FORM ============

const commentForm = document.getElementById("commentForm")
if (commentForm) {

    const dataComment = document.getElementById("dataComment")
    const saveCommentBtn = document.getElementById("saveCommentBtn")

   saveCommentBtn&& saveCommentBtn.addEventListener("click", async (e) => {
        e.preventDefault()

        const { error } = await client
            .from('AddComment')
            .insert({ Description: dataComment.value })

        if (error) {
            console.log("comment error", error)
        } else {
            alert("Comment added!")
            dataComment.value = ""
        }
    })
}
