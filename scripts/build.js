var mouseX = 0
var mouseY = 0
down = false

function clicked() {
    move()
}

function move() {
    document.getElementById("btn").style.left = mouseX + "px"
    document.getElementById("btn").style.top = mouseY + "px"
    console.log("moved button to ", mouseX, mouseY)
    window.setTimeout(function () { }, 100)
    console.log("finished")
}

var div = document.getElementById("btn");
onmousemove = function (e) { mouseX = e.clientX; mouseY = e.clientY; }