var videos = [
    ["https://www.youtube.com/embed/inc1ww8Sz0I", "https://www.youtube.com/embed/_7ZQtgx3PBw", "https://www.youtube.com/embed/3A5-TKMXHqE", "https://www.youtube.com/embed/5kLDeERwdHg"],
    ["https://youtube.com/embed/YA2GsBEoXiE", "https://youtube.com/embed/QaFckRerl-A", "https://youtube.com/embed/AE_EGtkLLRk", "https://youtube.com/embed/KEBb0DSb5tg", "https://youtube.com/embed/VLxAAO0jUuM", "https://youtube.com/embed/X_YVjT6vo7Q", "https://youtube.com/embed/W0zcKH5BfAo", "https://youtube.com/embed/ykEh-K4vkdw", "https://youtube.com/embed/nU-wVMtWOjA", "https://youtube.com/embed/eLDrdH0bWhY", "https://youtube.com/embed/VK_qqK7zs-8", "https://youtube.com/embed/mphA7fhATh8", "https://youtube.com/embed/189VChlnAK4",]]
document.getElementById("player0").src = videos[0][0]
document.getElementById("player1").src = videos[1][0]
current = [0, 0]
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
for (var i = 0; i < videos.length; i++) {
    for (var j = 0; j < videos[i].length; j++) {
        button = document.createElement("button")
        console.log(videos[j])
        button.id = "button" + i + j
        button.onclick = event => {
            var player_id = event.target.id.substring(6, 7)
            var index = event.target.id.substring(7)
            console.log(event.target.id)
            console.log(player_id, index)
            document.getElementById("player" + player_id).src = videos[player_id][index]
            current[i] = index
        }
        button.innerHTML = "video #" + j
        document.getElementById("parent" + i).appendChild(button)
    }
}