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
            var outerDiv = document.createElement("div")
            div.id = id1
            outerDiv.id = "outer-"+id1
            div.className = "post"
            outerDiv.appendChild(div)
            container.appendChild(outerDiv)
        })
        ids.forEach(async id1 => {
            fetch((await getBackend()) + "/admin/post?id="+id1, {
                method: "get"
            }).then(response1 => response1.json().then(async json => {
                var div = document.getElementById(id1)
                var outerDiv = document.getElementById("outer-"+id1)
                div.innerHTML = json.content
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
                        outerDiv.appendChild(button)
                        var editButton = document.createElement("button")
                        editButton.id = "edit-button-"+id1
                        editButton.innerHTML = "Edit"
                        editButton.onclick = async () => {
                            var editDiv = document.getElementById("edit-post-div")
                            editDiv.style.display = editDiv.style.display == "block" ? "none" : "block"
                            document.cookie = "postEditing="+id1
                            document.getElementById("edit-post-content").value = document.getElementById(id1).innerHTML
                        }
                        outerDiv.appendChild(editButton)
                        outerDiv.appendChild(div)
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
            document.getElementById("edit-button").style.display = "inline"
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

document.getElementById("edit-button").onclick = async () => {
    var editDiv = document.getElementById("edit-div")
    editDiv.style.display = editDiv.style.display == "block" ? "none" : "block"
    document.getElementById("edit-thread-name").value = document.getElementById("thread-header").innerHTML
    document.getElementById("edit-thread-description").value = document.getElementById("thread-description").innerHTML
}

document.getElementById("edit-post-button").onclick = async () => {
    fetch((await getBackend()) + "/admin/editpost", {
        method: "post",
        body: JSON.stringify({
            html: document.getElementById("edit-post-content").value,
            token: getCookie("accessToken"),
            id:getCookie("postEditing")
        })
    }).then(_ => window.location.reload())

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

document.getElementById("edit-confirm").onclick = async () => {
    var name = document.getElementById("edit-thread-name").value
    var description = document.getElementById("edit-thread-description").value
    fetch((await getBackend()) + "/admin/editthread", {
        method: "post",
        body: JSON.stringify({
            id: id,
            name:name,
            description:description,
            token:getCookie("accessToken")
        })
    }).then(_ => window.location.reload())
}