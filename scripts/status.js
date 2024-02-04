var token = getCookie("accessToken")
if(token != ""){
    
    fetch("https://skademaskinen.win:11034/admin/status?id="+document.getElementById("id").innerHTML+"&token="+token, {
        method:"get"
    }).then(response => {
        switch(response.status){
            case 200:
                response.text().then(text => {
                    console.log("got text")
                    var data = JSON.parse(text)
                    var systemctl = document.getElementById("systemctl")
                    systemctl.innerHTML = data["systemctl"].replaceAll("\n", "<br>")
                    var update = document.getElementById("update")
                    update.innerHTML = data["update"].replaceAll("\n", "<br>")
                    var lsblk = document.getElementById("lsblk")
                    lsblk.innerHTML = data["lsblk"].replaceAll("\n", "<br>")
                    var errors = document.getElementById("errors")
                    errors.innerHTML = data["errors"].replaceAll("\n", "<br>")
                })
                break;
            default:
                console.log("Error!")
        }
    })
}