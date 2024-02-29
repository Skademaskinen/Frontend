

async function doVisit(){
    fetch((await getBackend())+"/admin/visit", {
        method:"get"
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
        fetch((await getBackend())+"/admin/session", {
            method:"post"
        }).then(response => response.text().then(token => {
            var date = new Date()
            var tomorrow = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59)
            document.cookie = "session="+ token + "; expires = "+tomorrow.toUTCString()
            doVisit()
        }))
    }
    else{
        doVisit(getCookie("session"))
    }
}
getSessionToken()
commit_history()