document.getElementById("loginForm").addEventListener("submit",(event)=>{
    event.preventDefault()
})

firebase.auth().onAuthStateChanged((user)=>{
    if(user){
        location.replace("game.html")
    }
})

function login(){
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    firebase.auth().signInWithEmailAndPassword(email, password)
    .catch((error)=>{
        document.getElementById("error").innerHTML = error.message
    })
}

function signUp(){
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(cred => firestore.collection('users').doc(cred.user.uid).set(username, lastLoggedIn))
    .catch((error) => {
        document.getElementById("error").innerHTML = error.message
    });
}


function logout(){
    
}


