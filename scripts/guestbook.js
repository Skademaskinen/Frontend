console.log("Initialized guestbook")


async function post(){
    if(getCookie("hasposted") == "yes"){
        alert("Failed to post message! \nMaybe you just posted? (7 day timer)")
        return
    }
    var message = document.getElementById("guestbook-text").value
    var name = document.getElementById("guestbook-name").value
    var time = Date.now()
    console.log(message)
    console.log(name)
    console.log(time)
    fetch((await getBackend())+"/guestbook/new", {
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
                document.cookie = "hasposted=yes"
                window.location.reload()
                break;
            default:
                alert("Failed to post message! \nMaybe you just posted? (7 day timer)")
                console.log("Failed to post message!")
                break;
        }
    })
}

async function generateEntry(id){
    await fetch((await getBackend())+"/guestbook/get?id="+id, {
        method: "get"
    }).then(response => {
        switch(response.status){
            case 200:
                response.text().then(text => {
                    var messageData = JSON.parse(text)
                    console.log("id: " + messageData["id"])
                    var inner = document.getElementById("guestbook-entry-"+messageData["id"])
                    console.log("name: "+messageData["name"])
                    console.log("time: "+messageData["time"])
                    console.log("message: "+messageData["message"])
                    var name = document.createElement("p")
                    name.className = "guestbook-entry-name"
                    name.innerHTML = messageData["name"]
                    inner.appendChild(name)
                    inner.appendChild(document.createElement("br"))
                    var time = document.createElement("p")
                    time.className = "guestbook-entry-time"
                    var date = new Date(messageData["time"])
                    time.innerHTML = date.toDateString() + " - " + date.toLocaleTimeString().substring(0,5).replaceAll(".", ":")
                    inner.appendChild(time)
                    inner.appendChild(document.createElement("hr"))
                    inner.appendChild(document.createElement("br"))
                    var message = document.createElement("p")
                    message.innerHTML = messageData["message"]
                    inner.appendChild(message)
                    inner.appendChild(document.createElement("br"))
                })
            default:
                console.log("Error!")
        }
    })
}

async function generateGuestbook(data){
    console.log("generating guestbook")
    var container = document.getElementById("guestbook-history")

    await data.reverse().forEach(id => {
        var inner = document.createElement("div")
        inner.className = "guestbook-entry"
        container.appendChild(inner)
        container.appendChild(document.createElement("br"))
        inner.id = "guestbook-entry-"+id
        console.log("Fetching for id: " + id)

        generateEntry(id)
    })
}
async function doGuestbook(){

    fetch((await getBackend())+"/guestbook/ids", {
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
}

doGuestbook()
console.log("finished generating guestbook")