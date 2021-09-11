const onSignup = () => {
    // getting values from HTML
    const userName = document.getElementById("userName").value, email = document.getElementById("email").value, password = document.getElementById("password").value;

    // getting button to show error messages
    let regButton = document.getElementById("regButton");
    
    // checking that fields are not empty
    if (userName && email && password) {

        // getting or creating new main object in localstorage
        let teamReporter = JSON.parse(localStorage.getItem("teamReporter")) || {};
        
        // getting or creating new sub object from main object in localstorage
        teamReporter.users = teamReporter.users || {};

        // getting all users uid in array
        let validation = Object.keys(teamReporter.users);
        
        // checking user if already exist or not
        let userIdx = validation.findIndex(val => teamReporter.users[val]["email"].toLowerCase() === email.toLowerCase());

        if (userIdx === -1) {
        
            // this user doesn't exist
            // creating uid for new user
            let uid = new Date().getTime();
        
            // setting user through his uid as child object of object user, child of main object
            teamReporter.users[uid] = {
                uid, userName, email, password,
                admin: [],
                members: []
            }
        
            // store in storage
            localStorage.setItem("teamReporter", JSON.stringify(teamReporter));fcwwwwwwwwassssssssssssswwwwwwwwwwwwwwwdddd
        
            // redirect to login page
            location.href = "./login.html";
        }
        
        else {
            regButton.value = "Email exists!";
            regButton.classList.add("red-btn");
            regButton.classList.remove("input-btn");
        }
    }

    else {
        regButton.value = "All fields are required!";
        regButton.classList.add("red-btn");
        regButton.classList.remove("input-btn");
    }

    // clear state
    setTimeout(() => {
        regButton.value = "Register";
        regButton.classList.remove("red-btn");
        regButton.classList.add("input-btn");
    });
}

const onLogin = () => {
    // getting values from HTML
    const email = document.getElementById("email").value, password = document.getElementById("password").value;

    // getting button to show error messages
    let loginButton = document.getElementById("loginBtn");

    // checking that fields are not empty
    if (email && password) {
        // getting main object to see if user exist?
        const teamReporter = JSON.parse(localStorage.getItem("teamReporter"));

        // getting all users uid in array
        let validation = Object.keys(teamReporter.users);

        // checking in all users, if that email exist?
        let userIdx = validation.find(val => teamReporter.users[val]["email"].toLowerCase() === email.toLowerCase());

        if (userIdx) {
            // user email exist
            // checking if that email exist with this password?
            let currentUser = validation.find(val => teamReporter.users[val].email.toLowerCase() === email.toLowerCase() && teamReporter.users[val].password === password);

            if (currentUser) {
                // correct email password
                // setting current user in LS
                localStorage.setItem("user", JSON.stringify(teamReporter.users[currentUser]));
                // redirecting to login page
                location.href = "./dashboard.html";
            } 
            
            else {
                loginButton.value = "Password is incorrect!";
                loginButton.classList.remove("input-btn");
                loginButton.classList.add("red-btn");
            }
        }
        
        else {
            loginButton.value = "Email is not registered!";
            loginButton.classList.remove("input-btn");
            loginButton.classList.add("red-btn");
        }
    }

    else {
        loginButton.value = "All fields are required!";
        loginButton.classList.remove("input-btn");
        loginButton.classList.add("red-btn");
    }

    // clear state
    setTimeout(() => {
        loginButton.value = "Login";
        loginButton.classList.remove("red-btn");
        loginButton.classList.add("input-btn");
    }, 2000);
}

const locationCheck = () => {
    // getting current user object from LS
    const user = JSON.parse(localStorage.getItem("user"));

    // if present, redirecting to dashboard
    if (user) {
        location.href = "./dashboard.html";
    }
}

const loggedIn = () => {
    localStorage.removeItem("currentTeam");
    // getting current user object from LS
    let user = JSON.parse(localStorage.getItem("user"));
    // getting main app object from LS
    let teamReporter = JSON.parse(localStorage.getItem("teamReporter"));
    // checking if user is logged in?

    if (user) {
        // Welcoming user in header
        const userName = user.userName.split(" ")[0];
        const fullName = userName.slice(0, 1).toUpperCase() + userName.slice(1).toLowerCase();
        const nameHead = document.getElementById("nameHead");
        nameHead.style.cursor = "default"
        nameHead.textContent = `Welcome ${fullName}!`;

        // checking if user is admin of any team?
        if (user.admin.length !== 0) {
            let Team_CardHolder = document.getElementById("Team_CardHolder");
            Team_CardHolder.style.display = "block";

            user.admin.find(val => {
                // <div class="m-2 alert alert-success" role="alert">
                //     <h4 class="alert-heading">Category</h4>
                //     <p class="mb-0">Whenever you need to, be sure to use margin utilities to keep things nice and tidy.</p>
                // </div>

                let anchorTag = Team_CardHolder.appendChild(document.createElement("a"))
                anchorTag.setAttribute("href", "./teamManager.html");
                anchorTag.setAttribute("id", val);

                let div = anchorTag.appendChild(document.createElement("div"))
                div.classList.add("m-2", "alert", "alert-success");
                div.setAttribute("role", "alert");
                div.setAttribute("onclick", `currentTeam(${val})`);
                div.style.cursor = "pointer"

                let h4 = div.appendChild(document.createElement("h4"));
                h4.classList.add("alert-heading");
                h4.textContent = teamReporter.teams[val].category;

                let mark = div.appendChild(document.createElement("mark"));
                mark.classList.add("alert-success")
                mark.innerText = "Members: "
                mark.style.fontWeight = "bold";

                let small = div.appendChild(document.createElement("small"));
                small.classList.add("mb-0");

                let count = 0;
                teamReporter.teams[val].members.find(members => {
                    let memberName = teamReporter.users[members].userName;

                    if (teamReporter.teams[val].members.length == 1) {
                        small.textContent = memberName
                    }
                    // else if (teamReporter.teams[val].members.length == 2) {
                    //     small.textContent += memberName;
                    //     if (teamReporter.teams[val].members.length == teamReporter.teams[val].members.length - 1) {
                    //         small.textContent += ' & ';
                    //     }
                    // }

                    else if (teamReporter.teams[val].members.length > 1) {
                        small.textContent += memberName;

                        if (count < teamReporter.teams[val].members.length - 2) {
                            small.textContent += ', ';
                        }

                        else if (count == teamReporter.teams[val].members.length - 2) {
                            small.textContent += ' & ';
                        }
                    }

                    count++;
                })
            })

            // <h1 class="display-4 text-center" style="color: teal;">Teams you own</h1>
            let h1 = Team_CardHolder.appendChild(document.createElement("h1"));
            h1.classList.add("display-4", "text-center", "teal");
            h1.textContent = "Teams, you own.";
            h1.style.cursor = "default"
        }

        if (user.members.length !== 0) {
            let Team_memberCardHolder = document.getElementById("memberTeamCardHolder");
            Team_memberCardHolder.style.display = "block";

            user.members.find(val => {
                // <div class="m-2 alert alert-success" role="alert">
                //     <h4 class="alert-heading">Category</h4>
                //     <p class="mb-0">Whenever you need to, be sure to use margin utilities to keep things nice and tidy.</p>
                // </div>

                let anchorTag = Team_memberCardHolder.appendChild(document.createElement("a"))
                anchorTag.setAttribute("href", "./response.html");

                let div = anchorTag.appendChild(document.createElement("div"))
                div.classList.add("m-2", "alert", "alert-success");
                div.setAttribute("role", "alert");
                div.setAttribute("onclick", `currentTeam(${val})`);
                div.style.cursor = "pointer"

                let h4 = div.appendChild(document.createElement("h4"));
                h4.classList.add("alert-heading");
                h4.textContent = teamReporter.teams[val].category;

                let mark = div.appendChild(document.createElement("mark"));
                mark.classList.add("alert-success")
                mark.innerText = "Members: "
                mark.style.fontWeight = "bold";

                let small = div.appendChild(document.createElement("small"));
                small.classList.add("mb-0");

                let count = 0;
                teamReporter.teams[val].members.find(members => {
                    let memberName = teamReporter.users[members].userName;

                    if (teamReporter.teams[val].members.length == 1) {
                        small.textContent = memberName
                    }
                    // else if (teamReporter.teams[val].members.length == 2) {
                    //     small.textContent += memberName;
                    //     if (teamReporter.teams[val].members.length == teamReporter.teams[val].members.length - 1) {
                    //         small.textContent += ' & ';
                    //     }
                    // }
                    else if (teamReporter.teams[val].members.length > 1) {
                        small.textContent += memberName;

                        if (count < teamReporter.teams[val].members.length - 2) {
                            small.textContent += ', ';
                        }

                        else if (count == teamReporter.teams[val].members.length - 2) {
                            small.textContent += ' & ';
                        }
                    }

                    count++;
                })

            })

            // <h1 class="display-4 text-center" style="color: teal;">Teams you own</h1>
            let h1 = memberTeamCardHolder.appendChild(document.createElement("h1"));
            h1.classList.add("display-4", "text-center", "teal");
            h1.textContent = "Teams, you are part of,";
            h1.style.cursor = "default"
        }
    }

    else {
        location.href = "./login.html"
    }
}

const addTeam = () => {
    // getting current user object from LS
    let user = JSON.parse(localStorage.getItem("user"));

    if (user) {
        // getting values from HTML
        let teamName = document.getElementById("teamName").value;
        let category = document.getElementById("category").value;
        let mail = document.getElementById("emails").value;
        // getting button to show error messages
        let saveButton = document.getElementById("saveButton");

        // checking that fields are not empty
        if (teamName && category && mail) {
            // getting main app object from LS
            let teamReporter = JSON.parse(localStorage.getItem("teamReporter"));
            teamReporter.users = teamReporter.users;
            // checking if input team member email is not current user's email
            let checkAdmin = user.email.toLowerCase() !== mail.toLowerCase();

            if (checkAdmin) {
                // checking if input team member email is registered user's email
                let validation = Object.keys(teamReporter.users);
                let userUId = validation.find(val => teamReporter.users[val]["email"].toLowerCase() === emails.toLowerCase());

                if (userUId) {
                    // this user exist 
                    // getting or creating sub object of main app object
                    teamReporter.teams = teamReporter.teams || {};

                    let uid = new Date().getTime();

                    // setting sub object of object teams(child of main app object) through uid
                    teamReporter.teams[uid] = {
                        uid,
                        admin: user.email,
                        adminName: user.userName,
                        teamName, category,
                        members: [],
                        questions: [],
                    }

                    // setting member uid in team object's property member(array)
                    teamReporter.teams[uid].members.push(userUId);

                    // setting team uid in current users main object property admin(array)
                    teamReporter.users[user.uid].admin.push(uid);

                    
                    // setting team uid in member's object's (sub object of users object) property member(array)
                    teamReporter.users[userUId].members.push(uid);
                    user = teamReporter.users[user.uid];
                    
                    // store in storage
                    localStorage.setItem("teamReporter", JSON.stringify(teamReporter));
                    localStorage.setItem("user", JSON.stringify(user));
                    
                    // redirect to Dashboard page
                    location.href = "./dashboard.html";
                }

                else {
                    saveButton.textContent = "Email is incorrect!";
                    saveButton.classList.remove("theme-btn");
                    saveButton.classList.add("btn-danger");
                }
            }

            else {
                saveButton.textContent = "This is an Admin Email!";
                saveButton.classList.remove("theme-btn");
                saveButton.classList.add("btn-danger");
            }
        }

        else {
            saveButton.textContent = "All fields are required!";
            saveButton.classList.remove("theme-btn");
            saveButton.classList.add("btn-danger");
        }

        setTimeout(() => {
            saveButton.textContent = "Save changes";
            saveButton.classList.remove("btn-danger");
            saveButton.classList.add("theme-btn");
        }, 2000);
    }
    
    else {
        location.href = "./login.html"
    }
}

const currentTeam = e => localStorage.setItem("currentTeam", e);

const teamSetting = () => {
    // getting current user object from LS
    let user = JSON.parse(localStorage.getItem("user"));
    // team setting page dealing with member's email
    const selectedTeam = localStorage.getItem("currentTeam");
    const teamReporter = JSON.parse(localStorage.getItem("teamReporter"));

    if (user) {
        // <div class="members ms-4 my-2">abc@gmail.com<div class="cross" onclick="removeMember(${mem},this)>X</div>
        let membersBox = document.getElementById("membersBox");
        teamReporter.teams[selectedTeam].members.find(member => {
            membersBox.innerHTML += ` <div class="members ms-4 my-2">${teamReporter.users[member].email}<div class="cross" onclick="removeMember(${member},this)">X</div>`
        });

        // creating dropdown of member's name
        let Name_Of_member = document.getElementById("Name_Of_member")
        teamReporter.teams[selectedTeam].members.find(member => {
            // <option class="nav-font bg-white" value="All Member">4 Member</option>
            let Name_Of_memberList = Name_Of_member.appendChild(document.createElement("option"));
            Name_Of_memberList.classList.add("nav-font", "bg-white")
            Name_Of_memberList.innerText = teamReporter.users[member].userName;
            Name_Of_memberList.value = member;
        });

        // display existing questions
        if (teamReporter.teams[selectedTeam].questions != []) {
            if (teamReporter.teams[selectedTeam].questions[0] != null) {
                document.getElementById("question1").placeholder = teamReporter.teams[selectedTeam].questions[0];
            }

            if (teamReporter.teams[selectedTeam].questions[1] != null) {
                document.getElementById("question2").placeholder = teamReporter.teams[selectedTeam].questions[1];
            }

            if (teamReporter.teams[selectedTeam].questions[2] != null) {
                document.getElementById("question3").placeholder = teamReporter.teams[selectedTeam].questions[2];
            }
        }

    }
    else {
        location.href = "./login.html";
    }
}

const addMember = () => {
    let mail = document.getElementById("addMemberField").value;
    let addButton = document.getElementById("addBtn");

    if (mail) {
        // getting main app object from LS
        let teamReporter = JSON.parse(localStorage.getItem("teamReporter"));
        teamReporter.users = teamReporter.users;
    
        // getting current user object from LS
        let user = JSON.parse(localStorage.getItem("user"));
    
        // checking if input team member email is not current user's email
        let checkAdmin = user.email.toLowerCase() !== mail.toLowerCase();

        if (checkAdmin) {
            // checking if input team member email is registered user's email
            let validation = Object.keys(teamReporter.users);
            let userUId = validation.find(val => teamReporter.users[val]["email"].toLowerCase() === mail.toLowerCase());

            if (userUId) {
                // this user exist 
                // setting member uid in team object's property member(array)
                const uid = localStorage.getItem("currentTeam");

                let existUser = teamReporter.teams[uid].members.find(e => e == userUId);
    
                if (!existUser) {
                    teamReporter.teams[uid].members.push(userUId);
    
                    // setting team uid in member's object's (sub object of users object) property member(array)
                    teamReporter.users[userUId].members.push(uid);
    
                    // store in storage
                    localStorage.setItem("teamReporter", JSON.stringify(teamReporter));
    
                    let membersBox = document.getElementById("membersBox");
                    membersBox.innerHTML += ` <div class="members ms-4 my-2">${mail}<div class="cross" onclick="removeMember(${uid},this)">X</div>`
    
                    // emails = "";
                    document.getElementById("addMemberField").value = "";
                }
    
                else {
                    addButton.classList.remove("member-btn");
                    addButton.classList.add("delete-btn");
                    addButton.textContent = "Email exists!";
                }
            }
    
            else {
                addButton.classList.remove("member-btn");
                addButton.classList.add("delete-btn");
                addButton.textContent = "Email is registered!";
            }
        }
    
        else {
            addButton.classList.remove("member-btn");
            addButton.classList.add("delete-btn");
            addButton.textContent = "Admin Email!";
        }
    }
    
    else {
        addButton.classList.remove("member-btn");
        addButton.classList.add("delete-btn");
        addButton.textContent = "Empty Field!"
    }
    
    // clear state
    setTimeout(() => {
        addButton.classList.remove("delete-btn");
        addButton.classList.add("member-btn");
        addButton.textContent = "Add"
    }, 2000);
}

const removeMember = (e, f) => {
    // team setting page dealing with deleting member's email
    let userUID = e;
    const teamReporter = JSON.parse(localStorage.getItem("teamReporter"));
    const selectedTeam = localStorage.getItem("currentTeam");

    // removing team uid from user object
    let teamIdx = teamReporter.users[e].members.findIndex(e => e == selectedTeam);
    teamReporter.users[e].members.splice(teamIdx, 1);
    
    // removing user uid from team object
    let userIdx = teamReporter.teams[selectedTeam].members.findIndex(e => e == userUID);
    teamReporter.teams[selectedTeam].members.splice(userIdx, 1);
    localStorage.setItem("teamReporter", JSON.stringify(teamReporter));
    f.parentNode.remove();
    // localStorage.setItem("user",JSON.stringify(teamReporter.users[e]));
}

const addQuestions = () => {
    // getting questions field
    let question1 = document.getElementById("question1").value;
    let question2 = document.getElementById("question2").value;
    let question3 = document.getElementById("question3").value;

    // getting button to show error
    let addQuestionsButton = document.getElementById("addQuestionsButton");

    if (question1 || question2 || question3) {
        const teamReporter = JSON.parse(localStorage.getItem("teamReporter"));
        const currentTeam = localStorage.getItem("currentTeam");

        // setting questions
        if (question1) {
            teamReporter.teams[currentTeam].questions[0] = question1;
            document.getElementById("question1").placeholder = question1;
            // question1 = "";
            document.getElementById("question1").value = "";
        }

        if (question2) {
            teamReporter.teams[currentTeam].questions[1] = question2;
            document.getElementById("question2").placeholder = question2;
            // question2 = "";
            document.getElementById("question2").value = "";
        }

        if (question3) {
            teamReporter.teams[currentTeam].questions[2] = question3;
            document.getElementById("question3").placeholder = question3;
            // question3 = "";
            document.getElementById("question3").value = "";
        }

        localStorage.setItem("teamReporter", JSON.stringify(teamReporter));
    }

    else {
        addQuestionsButton.classList.remove("member-btn");
        addQuestionsButton.classList.add("delete-btn");
        addQuestionsButton.textContent = "Empty Fields!"
    }

    // clear state
    setTimeout(() => {
        addQuestionsButton.classList.remove("delete-btn");
        addQuestionsButton.classList.add("member-btn");
        addQuestionsButton.textContent = "Save Changes"
    }, 2000);
}

const deleteTeam = () => {
    const teamReporter = JSON.parse(localStorage.getItem("teamReporter"));
    const selectedTeam = localStorage.getItem("currentTeam");
    const user = JSON.parse(localStorage.getItem("user"));

    // removing team uid from admin object
    const adminIdx = teamReporter.users[user.uid].admin.findIndex(e => e == selectedTeam);
    teamReporter.users[user.uid].admin.splice(adminIdx, 1);

    // removing team uid from member users objects
    const memberUid = teamReporter.teams[selectedTeam].members;

    for (let i = 0; i < memberUid.length; i++) {
        let memberIdx = teamReporter.users[memberUid[i]].members.findIndex(e => e == selectedTeam);
        teamReporter.users[memberUid[i]].members.splice(memberIdx, 1);
    }

    // deleting team object
    delete teamReporter.teams[selectedTeam];
    localStorage.setItem("user", JSON.stringify(teamReporter.users[user.uid]));
    localStorage.setItem("teamReporter", JSON.stringify(teamReporter));
    location.href = "./dashboard.html";
    // setTimeout(_ => document.getElementById(selectedTeam).remove(),500);
}

const responsePage = () => {
    // member side
    // setting display date
    let date = new Date().getDate();
    let month = new Date().getMonth();
    const year = new Date().getFullYear();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    month = monthNames[month];
    
    const currentDate = `${date} ${month} ${year}`
    let displayDate = document.getElementById("date");
    displayDate.innerHTML = currentDate;
    
    // setting display questions
    const teamReporter = JSON.parse(localStorage.getItem("teamReporter"));
    const currentTeam = localStorage.getItem("currentTeam");

    if (teamReporter.teams[currentTeam].questions.length != 0) {
    
        if (teamReporter.teams[currentTeam].questions[0]) {
            let question1 = document.getElementById("question_1");
            let answer1 = document.getElementById("answer1");
            question1.innerHTML = `Q. ${teamReporter.teams[currentTeam].questions[0]}`;
            question1.style.display = "block";
            answer1.style.display = "block";
        }

        if (teamReporter.teams[currentTeam].questions[1]) {
            let question2 = document.getElementById("question_2");
            let answer2 = document.getElementById("answer2");
            question2.innerHTML = `Q. ${teamReporter.teams[currentTeam].questions[1]}`;
            question2.style.display = "block";
            answer2.style.display = "block";
        }

        if (teamReporter.teams[currentTeam].questions[2]) {
            let question3 = document.getElementById("question_3");
            let answer3 = document.getElementById("answer3");
            question3.innerHTML = `Q. ${teamReporter.teams[currentTeam].questions[2]}`;
            question3.style.display = "block";
            answer3.style.display = "block";
        }
    }
    
    else {
        document.getElementById("submit").setAttribute("disabled", "disabled");
    }
    
    const today = new Date().getDate().toString() + (new Date().getMonth() + 1).toString() + new Date().getFullYear().toString();
    const user = JSON.parse(localStorage.getItem("user"));
    let getAnswers = teamReporter.response[today][currentTeam] || false;

    if (getAnswers) {
        getAnswers = teamReporter.response[today][currentTeam][user.uid] || false;

        if (getAnswers) {

            if (teamReporter.response[today][currentTeam][user.uid][0] != null) {
                document.getElementById("answer1").placeholder = teamReporter.response[today][currentTeam][user.uid][0][1];
            }

            if (teamReporter.response[today][currentTeam][user.uid][1] != null) {
                document.getElementById("answer2").placeholder = teamReporter.response[today][currentTeam][user.uid][1][1];
            }

            if (teamReporter.response[today][currentTeam][user.uid][2] != null) {
                document.getElementById("answer3").placeholder = teamReporter.response[today][currentTeam][user.uid][2][1];
            }
        }
    }
}

const submitResponse = () => {
    const teamReporter = JSON.parse(localStorage.getItem("teamReporter"));
    teamReporter.response = teamReporter.response || {};

    const today = new Date().getDate().toString() + (new Date().getMonth() + 1).toString() + new Date().getFullYear().toString();
    const currentTeam = localStorage.getItem("currentTeam");
    const user = JSON.parse(localStorage.getItem("user"));
    teamReporter.response[today] = teamReporter.response[today] || {};
    teamReporter.response[today][currentTeam] = teamReporter.response[today][currentTeam] || {};
    teamReporter.response[today][currentTeam][user.uid] = teamReporter.response[today][currentTeam][user.uid] || [];
    
    let answer1 = document.getElementById("answer1");
    let answer2 = document.getElementById("answer2");
    let answer3 = document.getElementById("answer3");
    let submit = document.getElementById("submit");
    teamReporter.response[today][currentTeam][user.uid][3] = document.getElementById("date").textContent;
    
    if (answer1.style.display == "block" && teamReporter.response[today][currentTeam][user.uid][0] == null) {
    
        if (answer1.value) {
            teamReporter.response[today][currentTeam][user.uid][0] = [teamReporter.teams[currentTeam].questions[0], answer1.value];
            localStorage.setItem("teamReporter", JSON.stringify(teamReporter));
            answer1.placeholder = answer1.value;
            answer1.value = "";
        }
    }
    
    else{
        answer1.placeholder = "Submitted";
    }
    
    if (answer2.style.display == "block" && teamReporter.response[today][currentTeam][user.uid][1] == null) {
    
        if (answer2.value) {
            teamReporter.response[today][currentTeam][user.uid][1] = [teamReporter.teams[currentTeam].questions[1], answer2.value];
            localStorage.setItem("teamReporter", JSON.stringify(teamReporter));
            answer2.placeholder = answer2.value;
            answer2.value = "";
        }
    }
    
    else{
        answer2.placeholder = "Submitted";
    }
    
    if (answer3.style.display == "block" && teamReporter.response[today][currentTeam][user.uid][2] == null) {
    
        if (answer3.value) {
            teamReporter.response[today][currentTeam][user.uid][2] = [teamReporter.teams[currentTeam].questions[2], answer3.value];
            localStorage.setItem("teamReporter", JSON.stringify(teamReporter));
            answer3.placeholder = answer3.value;
            answer3.value = "";
        }
    }
    
    else{
        answer3.placeholder = "Submitted";
    }
    
    setTimeout(() => {
        submit.classList.remove("delete-btn");
        submit.classList.add("member-btn");
        submit.textContent = "Submit"
    }, 2000);
}

const getResponse = () => {
    document.getElementById("allMemberResponses").style.display = "none";
    const teamReporter = JSON.parse(localStorage.getItem("teamReporter"));
    const currentTeam = localStorage.getItem("currentTeam");

    let responseDate = document.getElementById("start").value
    responseDate = responseDate.split("-");
    responseDate = parseInt(responseDate[2]).toString() + parseInt(responseDate[1]).toString() + responseDate[0];
    
    let memberNamesList = document.getElementById("memberNames");
    let memberUid = memberNamesList.options[memberNamesList.selectedIndex].value;
    let responseData = teamReporter.response[responseDate] || false;
    
    if (memberUid == "All Members") {
        allMembersResponse(responseDate, currentTeam);
    }
    
    else {
        console.log(memberUid);
    
        if (responseData) {
            responseData = teamReporter.response[responseDate][currentTeam] || false;
    
            if (responseData) {
                responseData = teamReporter.response[responseDate][currentTeam][memberUid] || false;
    
                if (responseData) {
                    document.getElementById("noResponse").style.display = "none";
                    document.getElementById("memberResponses").style.display = "block";
    
                    // setting display date
                    let displayDate = document.getElementById("responseDate")
                    displayDate.textContent = responseData[3];
    
                    // setting questions
                    let responded_Q1 = document.getElementById("respondedQ1");
                    let responded_Q2 = document.getElementById("respondedQ2");
                    let responded_Q3 = document.getElementById("respondedQ3");
                    
                    let responded_Ans1 = document.getElementById("responded_Ans1");
                    let responded_Ans2 = document.getElementById("responded_Ans2");
                    let responded_Ans3 = document.getElementById("responded_Ans3");
    
                    if (responseData[0][1] != null) {
                        responded_Q1.textContent = `Q. ${responseData[0][0]}`;
                        responded_Ans1.textContent = `A. ${responseData[0][1]}`;
                    }
    
                    else {
                        responded_Q1.style.display = "none"
                        responded_Ans1.textContent = "No response submitted yet!"
                    }
    
                    if (responseData[1] != null) {
                        responded_Q2.textContent = `Q. ${responseData[1][0]}`;
                        responded_Ans2.textContent = `A. ${responseData[1][1]}`;

                    }
    
                    else {
                        responded_Q2.style.display = "none"
                        responded_Ans2.textContent = "No response submitted yet!"
                    }
    
                    if (responseData[2] != null) {
                        responded_Q3.textContent = `Q. ${responseData[2][0]}`;
                        responded_Ans3.textContent = `A. ${responseData[2][1]}`;
                    }
    
                    else {
                        responded_Q3.style.display = "none"
                        responded_Ans3.textContent = "No response submitted yet!"
                    }
                }
    
                else {
                    document.getElementById("memberResponses").style.display = "none";
                    document.getElementById("noResponse").style.display = "block";
                }
            }
    
            else {
                document.getElementById("memberResponses").style.display = "none";
                document.getElementById("noResponse").style.display = "block";
            }
        }
    
        else {
            document.getElementById("memberResponses").style.display = "none";
            document.getElementById("noResponse").style.display = "block";
        }
    }

}

const allMembersResponse = (responseDate, teamID) => {
    let allMemberResponsesDiv = document.getElementById("allMemberResponses");
    document.getElementById("memberResponses").style.display = "none";
    document.getElementById("noResponse").style.display = "none";

    const teamReporter = JSON.parse(localStorage.getItem("teamReporter"));
    let responseData = teamReporter.response[responseDate] || false;
    
    if (responseData) {
        responseData = teamReporter.response[responseDate][teamID] || false;
    
        if (responseData) {
            let totalMembersResponse = Object.keys(teamReporter.response[responseDate][teamID]);
            // <h2 class="mt-3 mx-3 display-6 fs-1">Filling for: <span></span></h2>
            /* <div class="m-5">
            <h3 class="mt-4 display-6 fs-2"></h3>
            <h3 class="mt-2 display-6 fs-3"></h3>
            <h3 class="mt-4 display-6 fs-2"></h3>
            <h3 class="mt-2 display-6 fs-3"></h3>
            <h3 class="mt-4 display-6 fs-2"></h3>
            <h3 class="mt-2 display-6 fs-3"></h3>
            </div> */
            console.log(responseData);
    
            allMemberResponsesDiv.innerHTML = `<h2 class="mt-3 mx-3 display-6 fs-1">Filling for: <span>${teamReporter.response[responseDate][teamID][totalMembersResponse[0]][3]}</span></h2>`
            totalMembersResponse.find(e => {
    
                allMemberResponsesDiv.innerHTML += `<h2 class="mt-3 mx-3 display-6 fs-2">${teamReporter.users[e].userName}</h2>`
                const responseArray = responseData[e]
    
                if (responseArray[0] != null) {
                    allMemberResponsesDiv.innerHTML += `<h3 class="mt-4 ms-5 display-6 fs-2">Q. ${responseArray[0][0]}</h3>
                    <h3 class="mt-2  ms-5 display-6 fs-3">A. ${responseArray[0][1]}</h3>`
                }
    
                else {
                    allMemberResponsesDiv.innerHTML += `<h3 class="mt-4 ms-5 display-6 fs-2">No Response Found!</h3>`
                }
    
                if (responseArray[1] != null) {
                    allMemberResponsesDiv.innerHTML += `<h3 class="mt-4 ms-5 display-6 fs-2">Q. ${responseArray[1][0]}</h3>
                    <h3 class="mt-2  ms-5 display-6 fs-3">A. ${responseArray[1][1]}</h3>`;
                }
    
                else {
                    allMemberResponsesDiv.innerHTML += `<h3 class="mt-4 ms-5 display-6 fs-2">No Response Found!</h3>`
                }
    
                if (responseArray[2] != null) {
                    allMemberResponsesDiv.innerHTML += `<h3 class="mt-4 ms-5 display-6 fs-2">Q. ${responseArray[2][0]}</h3>
                    <h3 class="mt-2 ms-5 display-6 fs-3">A. ${responseArray[2][1]}</h3>`
                }
    
                else {
                    allMemberResponsesDiv.innerHTML += `<h3 class="mt-4 ms-5 display-6 fs-2">No Response Found!</h3>`
                }
            })
    
            if (teamReporter.teams[teamID].members.length != totalMembersResponse.length) {
                const unsubmittedMembers = teamReporter.teams[teamID].members.filter(e => e != totalMembersResponse);
                unsubmittedMembers.find(e => {
                    allMemberResponsesDiv.innerHTML += `<h3 class="mt-3 fw-normal ms-5 display-6 fs-2">${teamReporter.users[e].userName} didn't submitted</h3>`
                })
            }
    
            allMemberResponsesDiv.style.display = "block";
        }
    
        else {
            allMemberResponsesDiv.style.display = "none";
            document.getElementById("noResponse").style.display = "block";
        }
    }
    
    else {
        allMemberResponsesDiv.style.display = "none";
        document.getElementById("noResponse").style.display = "block";
    }
}

const logout = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userName = user.userName.split(" ")[0];
    const fullName = userName.slice(0, 1).toUpperCase() + userName.slice(1).toLowerCase();
    const nameHead = document.getElementById("nameHead");
    alert("Good Bye!")
    localStorage.removeItem("user")

    // clear state
    setTimeout(() => {
        location.href = "login.html";
    });
}