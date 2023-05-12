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
    const json = get_json("https://about.skademaskinen.win/layout.json")
    json.then(data => {
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
        select.addEventListener("change", function(){console.log(select.value)})
        test1 = document.createElement("option")
        test1.text = "test1"
        test2 = document.createElement("option")
        test2.text = "test2"
        select.add(test1)
        select.add(test2)


        div.appendChild(select)

        div.appendChild(document.createElement("hr"))

        master.appendChild(div)
        divE = document.querySelector("div")
        divE.classList.add("center")


})
}

async function get_json(url){
    const request = new Request(url)
    const response = await fetch(request)
    return await response.json()
}

header()
footer()
