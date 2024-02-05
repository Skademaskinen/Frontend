

async function doVisit(token){
    fetch((await getBackend())+"/admin/visit", {
        method:"post",
        body: JSON.stringify({
            token: token,
            time: Date.now()/1000
        }),
        headers: {
            "Content-Type":"application/json"
        }
    }).then(response => {
        switch(response.status){
            case 200:
                response.text().then(text => {
                    var visitor_counter = document.getElementById("visitor-counter")
                    var data = JSON.parse(text)
                    var total = data["total"]
                    var today = data["today"]
                    var yesterday = data["yesterday"]
                    visitor_counter.appendChild(document.createTextNode("Visitor counter"))
                    visitor_counter.appendChild(document.createElement("br"))
                    visitor_counter.appendChild(document.createElement("hr"))
                    visitor_counter.appendChild(document.createTextNode("Today: "+today))
                    visitor_counter.appendChild(document.createElement("br"))
                    visitor_counter.appendChild(document.createTextNode("Yesterday: "+yesterday))
                    visitor_counter.appendChild(document.createElement("br"))
                    visitor_counter.appendChild(document.createTextNode("Total: "+total))

                })
                break;
            default:
                console.log("WTF happened? ...")
        }
    })
}
async function getSessionToken(){
    if(getCookie("session") == ""){
        fetch((await getBackend())+"/admin/session", {
            method:"get"
        }).then(response => {
            switch(response.status){
                case 200:
                    response.text().then(text => {
                        document.cookie = "session=" + text + "; expires=" + (new Date(Date.now() + 604800000)).toUTCString()
                        doVisit(text)
                    })
                    break;
                default:
                    console.log("WTF, exiting...")
            }
        })
    }
    else{
        doVisit(getCookie("session"))
    }
}
getSessionToken()