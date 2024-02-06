var modal = document.getElementById("modal")
var closeButton = 

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
            var devicesDiv = document.getElementById("devices")
            devicesDiv.className = "devices"
            var deviceDiv = document.createElement("div")
            deviceDiv.className = "device"
            var button = document.createElement("button")
            button.id = "device-" + device.mac
            button.innerHTML = "Boot"
            button.className = "device-button"
            var setAlias = document.createElement("button")
            setAlias.innerHTML = "Set Name"
            setAlias.onclick = () => {
                if(modal.style.display == "block"){
                    modal.style.display = "none"
                    console.log("closed modal")
                }
                else{
                    modal.style.display = "block"
                    console.log("opened modal")
                    var mac = document.getElementById("mac")
                    mac.innerHTML = device.mac
                    var confirmButton = document.getElementById("set-name-confirm")
                    confirmButton.onclick = async () => {
                        modal.style.display = "none"
                        fetch((await getHome())+"/setalias", {
                            method:"post",
                            body:JSON.stringify({
                                token:getCookie("accessToken"),
                                mac:device.mac,
                                alias:document.getElementById("set-name-input").value
                            })
                        }).then(_ => {
                            document.getElementById("set-name-input").value = ""
                            window.location.reload()
                        })
                    }
                }
            }
            var aliasH = document.createElement("h3")
            aliasH.innerHTML = device.alias
            var macP = document.createElement("p")
            macP.innerHTML = "Mac Address: " + device.mac
            deviceDiv.appendChild(aliasH)
            deviceDiv.appendChild(macP)
            deviceDiv.appendChild(button)
            deviceDiv.appendChild(setAlias)
            devicesDiv.appendChild(deviceDiv)
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