var token = getCookie("accessToken")
if(token != ""){
    
    fetch("https://skademaskinen.win:11034/admin/status?id="+document.getElementById("id")+"&token="+token, {
        method:"get"
    }).then(response => {
        switch(response.status){
            case 200:
                response.text().then(text => {
                    var data = JSON.parse(text)
                    var systemctl = document.getElementById("systemctl")
                    systemctl.innerHTML = data["systemctl"]
                    var update = document.getElementById("update")
                    update.innerHTML = data["update"]
                    var lsblk = document.getElementById("lsblk")
                    lsblk.innerHTML = data["lsblk"]
                    var errors = document.getElementById("errors")
                    errors.innerHTML = data["errors"]
                })
                break;
            default:
                console.log("Error!")
        }
    })
}