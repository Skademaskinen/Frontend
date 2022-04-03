var videos = [
    ["https://www.youtube.com/embed/inc1ww8Sz0I", "https://www.youtube.com/embed/_7ZQtgx3PBw", "https://www.youtube.com/embed/3A5-TKMXHqE", "https://www.youtube.com/embed/5kLDeERwdHg"],
    ["https://youtube.com/embed/YA2GsBEoXiE", "https://youtube.com/embed/QaFckRerl-A", "https://youtube.com/embed/AE_EGtkLLRk", "https://youtube.com/embed/KEBb0DSb5tg", "https://youtube.com/embed/VLxAAO0jUuM", "https://youtube.com/embed/X_YVjT6vo7Q", "https://youtube.com/embed/W0zcKH5BfAo", "https://youtube.com/embed/ykEh-K4vkdw", "https://youtube.com/embed/nU-wVMtWOjA", "https://youtube.com/embed/eLDrdH0bWhY", "https://youtube.com/embed/VK_qqK7zs-8", "https://youtube.com/embed/mphA7fhATh8", "https://youtube.com/embed/189VChlnAK4"],
    ["https://youtube.com/embed/XzWAQS1N2Uk", "https://youtube.com/embed/nLxny7q7w3k", "https://youtube.com/embed/q3jtp5_PYqU", "https://youtube.com/embed/54mVOqvGxaQ", "https://youtube.com/embed/793PC3QTc1U", "https://youtube.com/embed/kx_cyxxUR6Y", "https://youtube.com/embed/yDFWws8SYi4", "https://youtube.com/embed/gFEAMMrw2e4", "https://youtube.com/embed/-99OlEigvao", "https://youtube.com/embed/I5_SiWR0b3Q", "https://youtube.com/embed/41g4WieIVNA", "https://youtube.com/embed/9L5Bi5Jx_dI", "https://youtube.com/embed/nYyCZ42npPI", "https://youtube.com/embed/gYkt-XtTm9M", "https://youtube.com/embed/2oiRveYgZHQ",]]
var current = []
for (var i = 0; i < videos.length; i++) {
    current[i] = 0
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
        var master = document.getElementById("section" + i)
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
gen_page()