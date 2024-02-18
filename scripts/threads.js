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
    }).then(response => response.json().then(ids => ids.forEach(async id1 => {
        fetch((await getBackend()) + "/admin/post?id="+id1, {
            method: "get"
        }).then(response1 => response1.json().then(json => {
            var div = document.createElement("div")
            div.innerHTML = json.content
            container.appendChild(div)
        }))
    })))
}


setGeneral()
setPosts()