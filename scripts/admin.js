if (getCookie("accessToken") == ""){
    window.location.href = "../login.html"
}

var username = document.getElementById("username")
console.log(document.cookie)
username.innerHTML = getCookie("username")

async function toggleAuth(username){
    fetch((await getBackend()) +"/users/authorize", {
        method: "post",
        body: JSON.stringify({
            username: username,
            token: getCookie("accessToken")
        })
    }).then(_ => window.location.reload())
}

async function deleteUser(username){
    fetch((await getBackend())+"/users/delete", {
        method: "delete",
        body: JSON.stringify({
            username: username,
            token: getCookie("accessToken")
        })
    }).then(_ => window.location.reload())
}

async function getUsers(){
    console.log("getting users")
    fetch((await getBackend())+"/users/get?token="+getCookie("accessToken"), {
        method:"get"
    }).then(response => response.json().then(data => {
        var usersDiv = document.getElementById("users")
        console.log(data)
        data.forEach(user => {
            var username = user.username
            var authorized = user.authorized
            var div = document.createElement("div")
            div.className = "user"
            var usernameH = document.createElement("h3")
            usernameH.innerHTML = username
            var authorizedP = document.createElement("p")
            authorizedP.innerHTML = "authorized? " + (authorized == 1)
            var toggle = document.createElement("button")
            toggle.onclick = () => toggleAuth(username, authorized == 1)
            toggle.innerHTML = "auth/deauth"
            toggle.className = "authbutton"
            var deleteButton = document.createElement("button")
            deleteButton.onclick = () => deleteUser(username)
            deleteButton.innerHTML = "delete"
            deleteButton.className = "authbutton"
            div.appendChild(usernameH)
            div.appendChild(authorizedP)
            div.appendChild(toggle)
            div.appendChild(deleteButton)
            usersDiv.appendChild(div)
            console.log("appened user: "+username)

         })
    }))
}

var logout = document.getElementById("logoutbutton")
logout.onclick = () => {
    window.location.href = "../login.html"
    deleteCookie("accessToken")
    deleteCookie("username")
    deleteCookie("verified")
}

getUsers()
