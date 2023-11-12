data = {
    "urls":[
        "./",
        "https://github.com/Mast3rwaf1z",
        "sauce.html",
        "https://i.skademaskinen.win",
        "guestbook.html",
        "games.html",
        "contact.html",
        "https://myanimelist.net/profile/Mast3r_waf1z"
    ],
    "names":[
        "Home",
        "Github",
        "Source",
        "Skademaskinen",
        "Guestbook",
        "Gaming",
        "Contact",
        "MyAnimeList"
    ],
    "menu":[
        {
            "name":"main",
            "value":"./"
        },
        {
            "name":"start",
            "value":"subpages/start.html"
        }
    ]
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


function header(){
    urls = data["urls"]
    names = data["names"]
    var addrs = []
    master = document.getElementById("header")
    div = document.createElement("div")
    div.id = "div"
    addrs[0] = document.createElement("a")
    addrs[0].href = urls[0]
    addrs[0].innerHTML = names[0]
    div.appendChild(addrs[0])
    for(var i = 1; i < urls.length; i++){
        //for each url in data
        div.appendChild(document.createTextNode(" | "))
        addrs[i] = document.createElement("a")
        addrs[i].href = urls[i]
        addrs[i].innerHTML = names[i]
        div.appendChild(addrs[i])
    }
    div.appendChild(document.createTextNode(" | "))
    select = document.createElement("select")
    entries = {}
    for(index in data["menu"]){
        entryName = data["menu"][index]["name"]
        entryValue = data["menu"][index]["value"]
        entries[entryName] = entryValue
        option = document.createElement("option")
        option.text = entryName
        select.add(option)
    }
    select.addEventListener("change", function(){window.location.replace(entries[select.value])})
    div.appendChild(select)
    div.appendChild(document.createElement("hr"))
    master.appendChild(div)
    divE = document.querySelector("div")
    divE.classList.add("center")


}

async function get_json(url){
    const request = new Request(url)
    const response = await fetch(request)
    return await response.json()
}

header()
footer()
