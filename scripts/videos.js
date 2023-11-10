var sections = [
    {
        "header":"Arcaea",
        "text":"I play the rythm game arcaea, heres some videos",
        "videos":[
            "https://youtube.com/embed/dWY_PbvahK8",
            "https://youtube.com/embed/3A5-TKMXHqE",
            "https://youtube.com/embed/5kLDeERwdHg",
            "https://youtube.com/embed/hjZhdCZe1zE",
            "https://youtube.com/embed/SaBbS78OKyA",
            "https://youtube.com/embed/WLQ6Z-sbgsU",
            "https://youtube.com/embed/g6_StTRmcFY",
            "https://youtube.com/embed/mLFeXf1Od_Y",
            "https://youtube.com/embed/QV9qlTUvoT4",
            "https://youtube.com/embed/kEOuyjZK4o8",
            "https://youtube.com/embed/R9ljSASz6Qo",
            "https://youtube.com/embed/olb1ZZKb3q8",
            "https://youtube.com/embed/_I5xazgC_DY",
            "https://youtube.com/embed/h2R1faSYXC8",
            "https://youtube.com/embed/hSuJD0OcsHo",
            "https://youtube.com/embed/_7ZQtgx3PBw",
            "https://youtube.com/embed/inc1ww8Sz0I",
            "https://youtube.com/embed/RWXlSlXA62A"
        ],
        "index":0
    },{
        "header":"osu!mania",
        "text":"I used to play a lot of osu!mania",
        "videos":[
            "https://youtube.com/embed/XzWAQS1N2Uk",
            "https://youtube.com/embed/nLxny7q7w3k",
            "https://youtube.com/embed/q3jtp5_PYqU",
            "https://youtube.com/embed/54mVOqvGxaQ",
            "https://youtube.com/embed/793PC3QTc1U",
            "https://youtube.com/embed/kx_cyxxUR6Y",
            "https://youtube.com/embed/yDFWws8SYi4",
            "https://youtube.com/embed/gFEAMMrw2e4",
            "https://youtube.com/embed/-99OlEigvao",
            "https://youtube.com/embed/I5_SiWR0b3Q",
            "https://youtube.com/embed/41g4WieIVNA",
            "https://youtube.com/embed/9L5Bi5Jx_dI",
            "https://youtube.com/embed/nYyCZ42npPI",
            "https://youtube.com/embed/gYkt-XtTm9M",
            "https://youtube.com/embed/2oiRveYgZHQ"
        ],
        "index":0
    },{
        "header":"Souls",
        "text":"I also play a lot of souls games",
        "videos":[
            "https://youtube.com/embed/YA2GsBEoXiE",
            "https://youtube.com/embed/QaFckRerl-A",
            "https://youtube.com/embed/AE_EGtkLLRk",
            "https://youtube.com/embed/KEBb0DSb5tg",
            "https://youtube.com/embed/VLxAAO0jUuM",
            "https://youtube.com/embed/X_YVjT6vo7Q",
            "https://youtube.com/embed/W0zcKH5BfAo",
            "https://youtube.com/embed/ykEh-K4vkdw",
            "https://youtube.com/embed/nU-wVMtWOjA",
            "https://youtube.com/embed/eLDrdH0bWhY",
            "https://youtube.com/embed/VK_qqK7zs-8",
            "https://youtube.com/embed/mphA7fhATh8",
            "https://youtube.com/embed/189VChlnAK4"
        ],
        "index":0

    }
]

master = document.getElementById("master")
sections.forEach(section => {
    console.log(section.header)
    console.log(section.text)
    console.log(section.videos)

    // video title
    headerObject = document.createElement("h2")
    headerObject.innerHTML = section.header
    master.appendChild(headerObject)

    // video description
    textObject = document.createElement("p")
    textObject.innerHTML = section.text
    master.appendChild(textObject)
    
    // player
    playerContainer = document.createElement("div")
    master.appendChild(playerContainer)
    player = document.createElement("iframe")
    player.id = "player:"+section.header
    player.src = section.videos[section.index]
    player.width = "960px"
    player.height = "540px"
    player.allow = "fullscreen"
    playerContainer.appendChild(player)

    //buttons
    buttonContainer = document.createElement("div")
    master.appendChild(buttonContainer)
    previous = document.createElement("button")
    previous.innerHTML = "Previous"
    previous.id = section.header
    previous.onclick = event => {
        document.getElementById(section.header+section.index).style = "background:black"
        if(section.index != 0) section.index -= 1
        else section.index = section.videos.length -1
        document.getElementById(section.header+section.index).style = "background:red"
        document.getElementById("player:"+event.target.id).src = section.videos[section.index]
        console.log("NEW VIDEO FOR PLAYER: "+ event.target.id + " WITH ID: " + section.index)
        console.log(player.src)
    }
    buttonContainer.appendChild(previous)
    next = document.createElement("button")
    next.innerHTML = "Next"
    next.id = section.header
    next.onclick = event => {
        document.getElementById(section.header+section.index).style = "background:black"
        if(section.index != section.videos.length-1) section.index += 1
        else section.index = 0
        document.getElementById(section.header+section.index).style = "background:red"

        document.getElementById("player:"+event.target.id).src = section.videos[section.index]
        console.log("NEW VIDEO FOR PLAYER: "+ event.target.id + " WITH ID: "+section.index)
        console.log(player.src)
    }
    buttonContainer.appendChild(next)
    directButtonContainer = document.createElement("section")
    master.appendChild(directButtonContainer)
    for(var index = 0; index < section.videos.length; index++){
        button = document.createElement("button")
        button.id = section.header + index
        button.index = index
        button.style = section.index == index ? "background: red" : "background: black"
        button.onclick = event => {
            event.target.style = "background: red"
            console.log("EVENT: "+section.header + section.index)
            if((section.index != event.target.index)) document.getElementById(section.header + section.index).style = "background:black"
            document.getElementById("player:"+section.header).src = section.videos[event.target.index]
            section.index = event.target.index
        }
        button.innerHTML = "video #"+index
        directButtonContainer.appendChild(button)
    }
})