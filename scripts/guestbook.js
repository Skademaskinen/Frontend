console.log("Initialized guestbook")

function post(){
    var message = document.getElementById("guestbook-text").value
    var name = document.getElementById("guestbook-name").value
    var time = Date.now()
    console.log(message)
    console.log(name)
    console.log(time)
    fetch("https://skademaskinen.win:11034/admin/guestbook", {
        method: "post",
        body: JSON.stringify({
            message: message,
            name: name,
            time: time
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => {
        switch(response.status){
            case 200:
                console.log("Successfully posted message!")
                window.location.reload()
                break;
            default:
                alert("Failed to post message! \nMaybe you just posted? (7 day timer)")
                console.log("Failed to post message!")
                break;
        }
    })
}

function generateGuestbook(data){
    console.log("generating guestbook")
    var container = document.getElementById("guestbook-history")
    data.forEach(id => {
        console.log("Fetching for id: " + id)
        innerContainer = document.createElement("div")
        innerContainer.className = "guestbook-entry"
        container.appendChild(innerContainer)
        fetch("https://skademaskinen.win:11034/admin/guestbook?id="+id, {
            method: "get"
        }).then(response => {
            switch(response.status){
                case 200:
                    response.text().then(text => {
                        var messageData = JSON.parse(text)
                        console.log("name: "+messageData["name"])
                        console.log("time: "+messageData["time"])
                        console.log("message: "+messageData["message"])
                        var name = document.createElement("p")
                        name.className = "guestbook-entry-name"
                        name.innerHTML = messageData["name"]
                        innerContainer.appendChild(name)
                        innerContainer.appendChild(document.createElement("br"))
                        var time = document.createElement("p")
                        time.className = "guestbook-entry-time"
                        time.innerHTML = (new Date(messageData["time"])).toUTCString()
                        innerContainer.appendChild(time)
                        innerContainer.appendChild(document.createElement("br"))
                        var message = document.createElement("p")
                        message.innerHTML = messageData["message"]
                        innerContainer.appendChild(message)
                        innerContainer.appendChild(document.createElement("br"))
                    })
                default:
                    console.log("Error!")
            }
        })
    })
}

fetch("https://skademaskinen.win:11034/admin/guestbook", {
    method: "get"
}).then(response => {
    switch(response.status){
        case 200:
            response.text().then(text => {
                data = JSON.parse(text)// should be like [1,2,3,4,5,6,...]
                generateGuestbook(data)
                console.log(data)
            })
            break;
        default:
            console.log("Error! WTF just happened???")
            return;
    }
})

console.log("finished generating guestbook")