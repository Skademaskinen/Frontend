// utils
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function deleteCookie(name){
    document.cookie = name + "=" + getCookie(name)+";path=/;max-age=0;"
}


//data 
if(window.location.origin == "null"){
    // dev environment
    var uri = "file:///home/mast3r/git/Mast3rwaf1z.github.io"
}
else{
    // live environment
    var uri = window.location.origin
}
console.log("URI: " + uri)

var links = [
    ["home", uri + "/index.html"],
    ["login", uri + "/login.html"],
    ["source", "https://github.com/Mast3rwaf1z/Mast3rwaf1z.github.io"],
    ["contact", uri + "/contact.html"],
    ["guestbook", uri + "/guestbook.html"]
]
var sections = [
    ["anime", uri + "/sections/anime.html"], 
    ["gaming", uri + "/sections/gaming.html"], 
    ["music", uri + "/sections/music.html"], 
    ["programming", uri + "/sections/programming.html"], 
    ["linux", uri + "/sections/linux.html"],
    ["warhammer", uri +  "/sections/warhammer.html"]
]


// general shit
async function getBackend(){
    return fetch(uri + "/.debugdata.json", {
        method: "get",
    }).then(response => response.json().then(json => {
        return json["backend"]
    })).catch(e => {
        return "https://skademaskinen.win:11034"
    })
}
async function getHome(){
    return fetch(uri + "/.debugdata.json", {
        method: "get",
    }).then(response => response.json().then(json => {
        return json["home"]
    })).catch(e => {
        return "https://skademaskinen.win:40455"
    })
}



var favicon = document.createElement("link")
favicon.rel = "icon"
favicon.href = uri + "/assets/favicon.ico"
document.getElementById("body").appendChild(favicon)

// header
async function makeHeader(){
    var body = document.getElementById("body")
    var header = document.createElement("div")
    // links to other places
    links.forEach(data => {
        var name = data[0];
        var addr = data[1];
        var link = document.createElement("a")
        link.style = "padding: unset;"
        link.href = addr
        var header_i = document.createElement("p")
        header_i.className = "header_i"
        header_i.innerHTML = "> "
        var name_p = document.createElement("p")
        name_p.className = "header_link"
        name_p.innerHTML = name
        link.appendChild(header_i)
        link.appendChild(name_p)
        header.appendChild(link)
        header.appendChild(document.createTextNode(" | "))
    })
    console.log("Added general tabs")

    // interests dropdown
    var dropdown = document.createElement("div")
    dropdown.className = "dropdown"
    var button = document.createElement("button")
    button.className = "dropbtn"
    button.innerHTML = "<p class='header_i'>\> </p><p class='header_link'>interests</p>"
    dropdown.appendChild(button)
    var dropdown_content = document.createElement("div")
    dropdown_content.className = "dropdown-content"
    // shitty workaround
    var newThreadButtonContainer = document.createElement("div")
    dropdown_content.appendChild(newThreadButtonContainer)

    fetch((await getBackend())+"/admin/threads", {
        method:"get"
    }).then(response => response.json().then(ids => {
        ids.forEach(id => {
            var button = document.createElement("button")
            button.id = "entryButton-"+id
            dropdown_content.appendChild(button)
        })
        ids.forEach(async id => {
            fetch((await getBackend())+"/admin/thread?id="+id, {
                method:"get"
            }).then(response1 => response1.json().then(json => {
                var name = json["name"]
                var entryButton = document.getElementById("entryButton-"+id)
                entryButton.style = "all:unset; padding: 5px; display: block"
                entryButton.onclick = () => {
                    window.location.href = uri + "/threads.html"
                    document.cookie = "currentThread="+id + "; path=/"
                    console.log(getCookie("currentThread"))
                }
                entryButton.innerHTML = "<p class='header_i'>\> </p><p class='header_link'>" + name + "</p>"
                console.log("added entry to dropdown")
            }))
        })
    })).finally(async _ => {
        // here we add the admin button
        if(await verify()){
            var button = document.createElement("button")
            button.innerHTML = "New"
            button.onclick = () => {
                var modal = document.getElementById("new-thread-modal")
                modal.style.display = modal.style.display == "block" ? "none" : "block"
            }
            newThreadButtonContainer.appendChild(button)

        }
    })
    dropdown.appendChild(dropdown_content)
    header.appendChild(dropdown)
    console.log("Added interests dropdown menu")

    header.appendChild(document.createElement("br"))
    header.appendChild(document.createElement("hr"))
    header.appendChild(document.createElement("br"))

    // new thread modal
    var newThreadModal = document.createElement("div")
    newThreadModal.className = "modal"
    newThreadModal.id = "new-thread-modal"
    makeDraggable(newThreadModal)
    var newThreadModalName = document.createElement("input")
    newThreadModalName.type = "text"
    newThreadModalName.className = "modal-input"
    newThreadModalName.id = "new-thread-name"
    var newThreadModalDescription = document.createElement("textarea")
    newThreadModalDescription.className = "modal-textarea"
    newThreadModalDescription.id = "new-thread-description"
    var newThreadModalPostButton = document.createElement("button")
    newThreadModalPostButton.className = "modal-button"
    newThreadModalPostButton.innerHTML = "Post"
    newThreadModalPostButton.onclick = async () => {
        var name = newThreadModalName.value
        var description = newThreadModalDescription.value
        fetch((await getBackend()) + "/admin/newthread", {
            method: "post",
            body: JSON.stringify({
                token: getCookie("accessToken"),
                name: name,
                description: description
            })
        }).then(_ => window.location.reload())
    }
    newThreadModal.appendChild(document.createTextNode("Name"))
    newThreadModal.appendChild(document.createElement("br"))
    newThreadModal.appendChild(newThreadModalName)
    newThreadModal.appendChild(document.createElement("br"))
    newThreadModal.appendChild(document.createTextNode("Description"))
    newThreadModal.appendChild(document.createElement("br"))
    newThreadModal.appendChild(newThreadModalDescription)
    newThreadModal.appendChild(document.createElement("br"))
    newThreadModal.appendChild(newThreadModalPostButton)


    body.prepend(newThreadModal)
    body.prepend(header)
    console.log("Finished executing header")
}

Element.prototype.insertChildAtIndex = function(child, index) {
    if (!index) index = 0
    if (index >= this.children.length) {
        this.appendChild(child)
    } 
    else {
        this.insertBefore(child, this.children[index])
    }
}

// draggable modals
function makeDraggable(element){
    element.onmousedown = event => {
        event = event || window.Event
        document.onmousemove = event => {
            var x = event.clientX
            var y = event.clientY
            element.style.left = (x-(element.offsetWidth/3)) + "px";
            element.style.top = (y-20) + "px";
        }
        document.onmouseup = _ => {
            document.onmousedown = null
            document.onmousemove = null
        }
    }
}

// standard easy fetches from server...
async function verify(){
    if(getCookie("verified") == "true"){
        return true
    }
    return await fetch((await getBackend()) + "/admin/verify", {
        method: "post",
        body: JSON.stringify({
            token:getCookie("accessToken")
        })
    }).then(response => {
        if(response.ok){
            document.cookie = "verified=true; path=/;"
        }
        return response.ok
    })
}


// execution order
makeHeader()

var title = document.createElement("title")
title.innerHTML = document.getElementsByTagName("h1")[0].innerHTML
document.body.appendChild(title)



// footer

// send visitor information
