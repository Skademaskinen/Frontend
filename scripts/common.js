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
    document.cookie = name + "=" + ""
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
        console.log(e)
        return "https://skademaskinen.win:11034"
    })
}
// general shit
async function getHome(){
    return fetch(uri + "/.debugdata.json", {
        method: "get",
    }).then(response => response.json().then(json => {
        return json["home"]
    })).catch(e => {
        console.log(e)
        return "https://skademaskinen.win:40455"
    })
}



var favicon = document.createElement("link")
favicon.rel = "icon"
favicon.href = uri + "/assets/favicon.ico"
document.getElementById("body").appendChild(favicon)

// header
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
sections.forEach(data => {
    var a = document.createElement("a")
    a.href = data[1]
    a.innerHTML = "<p class='header_i'>\> </p><p class='header_link'>" + data[0] + "</p>"
    dropdown_content.appendChild(a)
})
dropdown.appendChild(dropdown_content)
header.appendChild(dropdown)
console.log("Added interests dropdown menu")

header.appendChild(document.createElement("br"))
header.appendChild(document.createElement("hr"))
header.appendChild(document.createElement("br"))

body.prepend(header)
console.log("Finished executing header")

// footer

// send visitor information