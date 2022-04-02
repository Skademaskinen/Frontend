var videos = ["https://www.youtube.com/embed/inc1ww8Sz0I", "https://www.youtube.com/embed/_7ZQtgx3PBw", "https://www.youtube.com/embed/3A5-TKMXHqE", "https://www.youtube.com/embed/5kLDeERwdHg"]
document.getElementById("player").src = videos[0]
current = 0
function next() {
    if (current != videos.length - 1) {
        current = current + 1
    }
    else {
        current = 0
    }
    document.getElementById("player").src = videos[current]
}
function previous() {
    if (current != 0) {
        current = current - 1
    }
    else {
        current = videos.length - 1
    }
    document.getElementById("player").src = videos[current]
}

for (var i = 0; i < videos.length; i++) {
    button = document.createElement("button")
    console.log(videos[i])
    button.onclick = event => {
        var index = event.target.innerHTML.substring(7)
        console.log(index)
        document.getElementById("player").src = videos[index]
        current = index
    }
    button.innerHTML = "video #" + i
    document.getElementById("parent").appendChild(button)
}