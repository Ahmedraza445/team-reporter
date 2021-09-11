const onSignup = () => {
    const userName = document.getElementById("userName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    let regBtn = document.getElementById("regBtn");
    // checking that fields are not empty
    if (userName && email && password) {
        // storing user info in obj
        const userInfo = { userName, email, password, groups: [], admin: [] }
        const users = JSON.parse(localStorage.getItem("users")) || []; // getting object from storage to check through email if user already exist?

        let userIdx = users.findIndex(val => val.email.toLowerCase() === userInfo.email.toLowerCase());

        if (userIdx === -1) {
            // this user doesn't exist
            users.push(userInfo);
            // store in storage
            localStorage.setItem("users", JSON.stringify(users));
            // redirect to login page
            location.href = "./login.html";
        }
        else { (regBtn.value = "Email Already Exist!") && regBtn.classList.add("red-btn") && regBtn.classList.remove("input-btn"); }
    }
    else { (regBtn.value = "All Fields Are Required!") && regBtn.classList.add("red-btn") && regBtn.classList.remove("input-btn"); }
    // clear state
    setTimeout(() => (regBtn.value = "Register") && regBtn.classList.remove("red-btn") && regBtn.classList.add("input-btn"), 2000);
}

const onLogin = () => {
    const email = document.getElementById("email").value, password = document.getElementById("password").value;
    let loginBtn = document.getElementById("loginBtn");
    if (email && password) {
        const user = { email, password }, users = JSON.parse(localStorage.getItem("users")) || [], /* get indx */ checkUserEmail = users.find(val => val.email.toLowerCase() === user.email.toLowerCase());
        if (checkUserEmail) {
            let currentUser = users.find(val => val.email.toLowerCase() === user.email.toLowerCase() && val.password === user.password);
            if (currentUser) {
                localStorage.setItem("user", JSON.stringify(currentUser));
                // user login
                location.href = "./dashboard.html";
            } else { (loginBtn.value = "Incorrect Password!") && loginBtn.classList.remove("input-btn") && loginBtn.classList.add("red-btn"); }
        }
        else { (loginBtn.value = "Email Not Registered!") && loginBtn.classList.remove("input-btn") && loginBtn.classList.add("red-btn"); }
    }
    else { (loginBtn.value = "All Fields Are Required!") && loginBtn.classList.remove("input-btn") && loginBtn.classList.add("red-btn"); }
    // clear state
    setTimeout(() => (loginBtn.value = "Login") && loginBtn.classList.remove("red-btn") && loginBtn.classList.add("input-btn"), 2000);
}

const loggedIn = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userName = user.userName.split(" ")[0];
    const fullName = userName.slice(0, 1) + userName.slice(1);
    const nameHead = document.getElementById("nameHead");
    nameHead.textContent = `Welcome ${fullName}!`;
}

const addTeam = () => {
    let teamName = document.getElementById("teamName").value;
    let category = document.getElementById("category").value;
    let emails = document.getElementById("emails").value;
    let saveBtn = document.getElementById("saveBtn");

    if (teamName && category && emails) {

        let user = JSON.parse(localStorage.getItem("user"));
        let users = JSON.parse(localStorage.getItem("users"));
        let teams = JSON.parse(localStorage.getItem("teams")) || [];

        let uid = Math.floor(Math.random() * 4);
        let admin = user.email;
        let adminName = user.userName;

        let teamInfo = {
            uid, teamName, category, admin, adminName,
            members: [],
            questions: [],
        }

        let userIdx = users.findIndex(value => value.email.toLowerCase() === emails.toLowerCase());

        if (userIdx !== -1) {
            // this user does exist
            teamInfo.members.push(emails);
            teams.push(teamInfo);
            // store in storage
            localStorage.setItem("teams", JSON.stringify(teams));
            // redirect to login page
            // location.href = "login.html";
        }
        else {
            saveBtn.textContent = "Incorrect Email!";
            saveBtn.classList.remove("theme-btn");
            saveBtn.classList.add("btn-danger");
        }
    }
    else {
        saveBtn.textContent = "All Fields Are Required!";
        saveBtn.classList.remove("theme-btn");
        saveBtn.classList.add("btn-danger");
    }
    setTimeout(() => {
        saveBtn.textContent = "Save changes";
        saveBtn.classList.remove("btn-danger");
        saveBtn.classList.add("theme-btn");
    }, 2000);
}

const logout = () => {
    let user = JSON.parse(localStorage.getItem("user"));
    let userName = user.userName.split(" ")[0];
    let fullName = userName.slice(0, 1) + userName.slice(1);
    let nameHead = document.getElementById("nameHead");
    nameHead.textContent = `Good Bye ${fullName} :)`;
    localStorage.removeItem("user")
    // clear state
    setTimeout(() => {
        location.href = "login.html";
    }, 2000);
}



const run = () => {
    var x = document.getElementById("start").value;
    x = x.split("-");
    x = parseInt(x[2]).toString() + parseInt(x[1]).toString() + x[0];
    console.log(x);
}