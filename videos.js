var videos = []
var headings = []
var texts = []
var current = []
const json = get_json()
json.then(data => {
    videos = data["videos"]
    headings = data["headings"]
    texts = data["text"]
    for (var i = 0; i < videos.length; i++) {
        current[i] = 0
    }
    gen_page()
})

//functions
async function get_json() {
    const request_url = "https://about.skademaskinen.win/videos.json"
    const request = new Request(request_url)
    const response = await fetch(request)
    return await response.json()
}
function next(index) {
    if (current[index] != videos[index].length - 1) {
        current[index] = current[index] + 1
    }
    else {
        current[index] = 0
    }
    document.getElementById("player" + index).src = videos[index][current[index]]
}
function previous(index) {
    if (current[index] != 0) {
        current[index] = current[index] - 1
    }
    else {
        current[index] = videos[index].length - 1
    }
    document.getElementById("player" + index).src = videos[index][current[index]]
}

function gen_page() {
    for (var i = 0; i < videos.length; i++) {
        //create stuff there is only one of, ie prev, next buttons and video player
        var master = document.getElementById("master")
        heading = document.createElement("h2")
        heading.innerHTML = headings[i]
        heading.style = "text-align: center; color: white; font-family: Arial, Helvetica, sans-serif; width: 50%; margin: auto; "
        master.appendChild(heading)
        text = document.createElement("p")
        text.innerHTML = texts[i]
        text.style = "text-align: center; color: white; font-family: Arial, Helvetica, sans-serif; width: 50%; margin: auto; "
        master.appendChild(text)
        player_div = document.createElement("div")
        player_div.style = "text-align: center"
        master.appendChild(player_div)
        player = document.createElement("iframe")
        player.id = "player" + i
        player.src = videos[i][current[i]]
        player.width = "1280px"
        player.height = "720px"
        player.style = "text-align: center"
        player.allow = "fullscreen"
        player_div.appendChild(player)
        btn_div = document.createElement("div")
        btn_div.style = "text-align: center"
        master.appendChild(btn_div)
        prev_btn = document.createElement("button")
        prev_btn.id = i
        prev_btn.onclick = event => {
            next(event.target.id)
        }
        prev_btn.innerHTML = "Previous"
        btn_div.appendChild(prev_btn)
        next_btn = document.createElement("button")
        next_btn.id = i
        next_btn.onclick = event => {
            next(event.target.id)
        }
        next_btn.innerHTML = "Next"
        btn_div.appendChild(next_btn)
        btn_sec = document.createElement("section")
        btn_sec.id = "parent" + i
        btn_sec.style = "text-align:center"
        master.appendChild(btn_sec)
        br = document.createElement("br")
        master.appendChild(br)
        for (var j = 0; j < videos[i].length; j++) {
            //create stuff there is multiple of
            button = document.createElement("button")
            button.id = "button" + i + j
            button.onclick = event => {
                var player_id = event.target.id.substring(6, 7)
                var index = event.target.id.substring(7)
                document.getElementById("player" + player_id).src = videos[player_id][index]
                current[i] = index
            }
            button.innerHTML = "video #" + j
            btn_sec.appendChild(button)
        }
    }
}