async function bootDevice(mac){
    fetch((await getHome())+"/boot", {
        method: "post",
        body: JSON.stringify({
            mac: mac,
            token: getCookie("accessToken")

        })
    }).then(response => response.text().then(text => document.getElementById("statusline").innerHTML = text))
}


async function generateDeviceButtons(){
    fetch((await getHome())+"/devices?token="+getCookie("accessToken"), {
        method: "get"
    }).then(response => response.json().then(devices => {
        devices.forEach(device => {
            var deviceDiv = document.getElementById("devices")
            var button = document.createElement("button")
            button.id = "device-" + device.mac
            if(!(device.alias == null)){
                button.innerHTML = device.alias
            }
            else {
                button.innerHTML = "device #" + device.mac
            }
            deviceDiv.appendChild(button)
            button.onclick = () => bootDevice(device.mac)
        })
    }))
}

async function scan(){
    fetch((await getHome())+"/scan", {
        method: "post",
        body: JSON.stringify({
            token: getCookie("accessToken")
        })
    })
}


generateDeviceButtons()
document.getElementById("scan-button").onclick = scan