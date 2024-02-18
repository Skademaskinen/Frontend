

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

async function commit_history(){
    fetch("https://api.github.com/repos/Mast3rwaf1z/Mast3rwaf1z.github.io/commits", {
        method: "get"
    }).then(response => response.json().then(data => {
        data.forEach(commit => {
            //console.log(commit.commit.message)
            var div = document.getElementById("commit-history")
            var msg = document.createElement("a")
            msg.href = commit.html_url
            msg.innerHTML = commit.commit.message
            div.appendChild(msg)
            var date = document.createElement("p")
            date.innerHTML = commit.commit.committer.date
            date.className = "commit-date"
            div.appendChild(date)
        })
    }))
}

async function getSessionToken(){
    if(getCookie("session") == ""){
        fetch((await getBackend())+"/admin/session?time="+Date.now()/1000, {
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
commit_history()