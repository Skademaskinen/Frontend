
async function getStatus(){
    var token = getCookie("accessToken")
    if(token != ""){
        var id = document.getElementById("id").innerHTML
        switch(id.toLowerCase()){
            case "skademaskinen":
                var api = await getBackend()+"/status"
                break
            case "home":
                var api = await getHome()+"/status"
                break
        }

        fetch(api+"?token="+token, {
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
}
getStatus()
