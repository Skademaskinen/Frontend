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
        fetch("https://skademaskinen.win:11034/admin/guestbook?id="+id, {
            method: "get"
        }).then(response => {
            switch(response.status){
                case 200:
                    response.text().then(text => {
                        console.log("name: "+messageData["name"])
                        console.log("time: "+messageData["time"])
                        console.log("message: "+messageData["message"])
                        var messageData = JSON.parse(text)
                        var name = document.createElement("p")
                        name.innerHTML = messageData["name"]
                        container.appendChild(name)
                        var time = document.createElement("p")
                        time.innerHTML = new Date(messageData["time"])
                        container.appendChild(time)
                        container.appendChild(document.createElement("br"))
                        var message = document.createElement("p")
                        message.innerHTML = messageData["message"]
                        container.appendChild(message)
                        container.appendChild(document.createElement("br"))
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