function showPassword(){
    var input = document.getElementById("password")
    if(input.type == "password"){
        input.type = "text"
    }
    else{
        input.type = "password"
    }
};

async function login(){
    fetch((await getBackend())+"/admin/users/verify", {
        method: "post",
        body: JSON.stringify({
            username: document.getElementById("username").value,
            password: document.getElementById("password").value
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => {
        switch(response.status){
            case 200:
                console.log("Successfully Logged in!")
                response.text().then(text => {
                    console.log(text)
                    document.cookie = "accessToken=" + text + "; expires=" + (new Date(Date.now() + 604800000)).toUTCString() + ";SameSite=strict"
                    document.cookie = "username=" + document.getElementById("username").value + "; expires=" + (new Date(Date.now() + 604800000)).toUTCString() + ";SameSite=strict"
                    window.location.href = uri + "/backend/index.html"
                })
                break
            default:
                console.log("Error!")
                response.text().then(text => {
                    var statusLine = document.getElementById("statusLine")
                    statusLine.innerHTML = "Denied!"
                    statusLine.style = "color: red;"
                })
        }
    })
}

async function register(){
    fetch((await getBackend())+"/admin/users/register", {
        method: "post",
        body: JSON.stringify({
            username: document.getElementById("username").value,
            password: document.getElementById("password").value
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => {
        switch(response.status){
            case 200:
                console.log("Successfully registered user!")
                response.text().then(text => {
                    console.log(text)
                    document.cookie = "accessToken=" + text + "; expires=" + (new Date(Date.now() + 604800000)).toUTCString()
                    window.location.href = uri + "/backend/index.html"
                })
                break
            default:
                console.log("Error!")
                response.text().then(text => {
                    var statusLine = document.getElementById("statusLine")
                    statusLine.innerHTML = "Denied!"
                    statusLine.style = "color: red;"
                })
        }
    })
}

var token = getCookie("accessToken")
if(token != ""){
    window.location.href = "backend/index.html"
}
