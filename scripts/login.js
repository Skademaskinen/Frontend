function showPassword(){
    var input = document.getElementById("password")
    if(input.type == "password"){
        input.type = "text"
    }
    else{
        input.type = "password"
    }
};

function login(){
    fetch("https://skademaskinen.win:11034/admin/auth", {
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
                    window.location.href = uri + "?" + text
                })
                break
            default:
                console.log("Error!")
                response.text().then(text => {
                    var statusLine = document.getElementById("statusLine")
                    statusLine.innerHTML = text
                    statusLine.style = "color: red;"
                })
        }
    })
}

function register(){
    fetch("https://skademaskinen.win:11034/admin/register", {
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
                    window.location.href = uri + "?" + text
                })
                break
            default:
                console.log("Error!")
                response.text().then(text => {
                    var statusLine = document.getElementById("statusLine")
                    statusLine.innerHTML = text
                    statusLine.style = "color: red;"
                })
        }
    })
}