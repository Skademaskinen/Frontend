var header = document.getElementById("thread-header")
var description = document.getElementById("thread-description")
var container = document.getElementById("posts-container")
var id = getCookie("currentThread")

async function setGeneral(){
    fetch((await getBackend()) + "/admin/thread?id="+id, {
        method: "get"
    }).then(response => response.json().then(json => {
        header.innerHTML = json.name
        description.innerHTML = json.description
    }))
}
async function setPosts(){
    fetch((await getBackend()) + "/admin/posts?id="+id, {
        method: "get"
    }).then(response => response.json().then(ids => {
        ids.forEach(id1 => {
            var div = document.createElement("div")
            div.id = id1
            div.className = "post"
            container.appendChild(div)
        })
        ids.forEach(async id1 => {
            fetch((await getBackend()) + "/admin/post?id="+id1, {
                method: "get"
            }).then(response1 => response1.json().then(async json => {
                var div = document.getElementById(id1)
                div.innerHTML = json.content
                div.appendChild(document.createElement("br"))
                container.appendChild(div)
                fetch((await getBackend()) + "/admin/verify", {
                    method: "post",
                    body: JSON.stringify({
                        token:getCookie("accessToken")
                    })
                }).then(response => {
                    if(response.status == 200){
                        var button = document.createElement("button")
                        button.id = "delete-button-"+id1
                        button.innerHTML = "Delete"
                        button.onclick = async () => {
                            fetch((await getBackend()) + "/admin/post", {
                                method: "delete", 
                                body: JSON.stringify({
                                    token: getCookie("accessToken"),
                                    id: id1
                                })
                            }).then(_ => window.location.reload())
                        }
                        div.appendChild(button)
                    }
                })
            }))
        })
    }))
}
async function addButtonsIfAdmin(){
    fetch((await getBackend()) + "/admin/verify", {
        method: "post",
        body: JSON.stringify({
            token:getCookie("accessToken")
        })
    }).then(response => {
        if(response.status == 200){
            document.getElementById("create-button").style.display = "inline"
            document.getElementById("delete-button").style.display = "inline"
        }
    })
}

setGeneral()
setPosts()
addButtonsIfAdmin()

document.getElementById("create-button").onclick = () => {
    if(document.getElementById("new-post").style.display == "block"){
        document.getElementById("new-post").style.display = "none"
    }
    else{
        document.getElementById("new-post").style.display = "block"
    }
}

document.getElementById("delete-button").onclick = async () => {
    fetch((await getBackend()) + "/admin/thread", {
        method:"delete",
        body: JSON.stringify({
            token:getCookie("accessToken"),
            id: id
        })
    }).then(_ => window.location.href = uri + "/index.html")
}

document.getElementById("post-button").onclick = async () => {
    var html = document.getElementById("new-post-content").value
    fetch((await getBackend()) + "/admin/post", {
        method: "post",
        body: JSON.stringify({
            token: getCookie("accessToken"),
            html: html,
            id: id
        })
    }).then(_ => window.location.reload())
}