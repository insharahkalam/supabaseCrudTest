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
        window.location.href = "login.html"
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

    if (loginEmail.value === "admin123@gmail.com" && loginPassword.value === "admin123") {
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