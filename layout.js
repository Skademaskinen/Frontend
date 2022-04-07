function header() {//make smarter with json later
    master = document.getElementById("header")
    div = document.createElement("div")
    index = document.createElement("a")
    repo = document.createElement("a")
    skademaskinen = document.createElement("a")
    moerbot = document.createElement("a")
    shitgame = document.createElement("a")
    rp = document.createElement("a")
    guestbook = document.createElement("a")
    gaming = document.createElement("a")
    contact = document.createElement("a")
    hr = document.createElement("hr")
    div.id = "div"
    index.href = "./"
    index.innerHTML = "Home"
    repo.href = "https://github.com/Mast3rwaf1z/Mast3rwaf1z.github.io"
    repo.innerHTML = "Source"
    skademaskinen.href = "https://i.skademaskinen.win"
    skademaskinen.innerHTML = "Skademaskinen"
    moerbot.href = "https://github.com/Mast3rwaf1z/Moer-bot"
    moerbot.innerHTML = "Mørbot"
    shitgame.href = "https://github.com/Mast3rwaf1z/scrap"
    shitgame.innerHTML = "Shitgame"
    rp.href = "https://github.com/Mast3rwaf1z/rp"
    rp.innerHTML = "RP"
    guestbook.href = "http://skademaskinen.win:27676/guestbook"
    guestbook.innerHTML = "Guestbook"
    gaming.href = "games.html"
    gaming.innerHTML = "Gaming"
    contact.href = "contact.html"
    contact.innerHTML = "Contact"


    div.appendChild(index)
    div.appendChild(document.createTextNode(" | "))
    div.appendChild(repo)
    div.appendChild(document.createTextNode(" | "))
    div.appendChild(skademaskinen)
    div.appendChild(document.createTextNode(" | "))
    div.appendChild(moerbot)
    div.appendChild(document.createTextNode(" | "))
    div.appendChild(shitgame)
    div.appendChild(document.createTextNode(" | "))
    div.appendChild(rp)
    div.appendChild(document.createTextNode(" | "))
    div.appendChild(guestbook)
    div.appendChild(document.createTextNode(" | "))
    div.appendChild(gaming)
    div.appendChild(document.createTextNode(" | "))
    div.appendChild(contact)
    div.appendChild(hr)
    master.appendChild(div)
    divE = document.querySelector("div")
    divE.classList.add("center")
}

function footer() {
    master = document.getElementById("footer")
    div = document.createElement("div")
    hr = document.createElement("hr")
    txt = document.createTextNode("Please note that this website is entirely for fun and should not be taken seriously unless its obvious.")
    div.style = "color: gray; background-color: black;"
    div.appendChild(hr)
    div.appendChild(txt)
    master.appendChild(div)
}


function smarter_header(){
    const json = get_json("https://about.skademaskinen.win/layout.json")
    json.then(data => {
        urls = data["urls"]
        names = data["names"]
        for (var i = 0; i < videos.length; i++) {
            current[i] = 0
        }
        gen_page()
})
}

function get_json(url){
    const request = new Request(url)
    const response = await fetch(request)
    return await response.json()
}


header()
footer()
