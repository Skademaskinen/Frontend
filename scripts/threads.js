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
    // fuckit rewrite
    fetch((await getBackend()) + "/admin/posts?id="+id, {
        method: "get"
    }).then(response => response.json().then(ids => ids.forEach(async postId => {
        var div = document.createElement("div")
        div.className = "post"
        container.insertChildAtIndex(div, postId)
        fetch((await getBackend()) + "/admin/post?id="+postId, {method:"get"}).then(response1 => response1.json().then(json => {
            var inner = document.createElement("div")
            div.appendChild(inner)
            div.appendChild(document.createElement("br"))
            inner.id = postId
            inner.innerHTML = json.content
        }))
        if(await verify()){
            var deleteButton = document.createElement("button")
            deleteButton.innerHTML = "Delete"
            deleteButton.onclick = async () => {
                fetch((await getBackend()), {
                    method: "delete",
                    body: JSON.stringify({
                        token: getCookie("accessToken"),
                        id: postId
                    })
                }).then(_ => window.location.reload())
            }
            div.appendChild(deleteButton)
            div.appendChild(document.createTextNode(" "))
            var editButton = document.createElement("button")
            editButton.innerHTML = "Edit"
            editButton.onclick = async _ => {
                var editDiv = document.getElementById("edit-post-div")
                editDiv.style.display = editDiv.style.display == "block" ? "none" : "block"
                document.cookie = "postEditing="+postId
                document.getElementById("edit-post-content").value = document.getElementById(postId).innerHTML
            }
            div.appendChild(editButton)
        }
    }))) 
}    

async function addButtonsIfAdmin(){
    if(await verify()){
        document.getElementById("top-editor").style.display = "inline"
        var imagesContainer = document.getElementById("images")
        fetch((await getBackend()) + "/admin/images", {
            method: "get",
        }).then(response => response.json().then(json => json.forEach(async path => {
            var imageContainer = document.createElement("div")
            var button = document.createElement("button")
            button.innerHTML = "Delete"
            imageContainer.appendChild(button)
            var a = document.createElement("a")
            var path = (await getBackend()) + "/admin/images/"+path

            a.innerHTML =  " "+path
            a.href = path
            imageContainer.appendChild(a)
            imageContainer.style.padding = "5px"
            button.onclick = async () => {
                fetch((await getBackend()) + "/admin/images", {
                    method: "delete",
                    body: JSON.stringify({
                        token: getCookie("accessToken"),
                        file: path
                    })
                }).then(_ => window.location.reload())
            }
            imagesContainer.appendChild(imageContainer)
        })))
    }
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

document.getElementById("image-upload-button").onclick = async () => {
    var file = document.getElementById("image-upload").files[0]
    if(["image/png", "image/jpg", "image/jpeg", "image/gif"].includes(file.type)){
        document.getElementById("image-upload-status").innerHTML = "uploading..."
        fetch((await getBackend()) + "/admin/image?token="+getCookie("accessToken")+"&filename="+file.name, {
            method: "put",
            body: file
        }).finally(_ => {
            document.getElementById("image-upload-status").innerHTML = "finished upload"
        })
    }
}

makeDraggable(document.getElementById("new-post"))
makeDraggable(document.getElementById("edit-div"))
makeDraggable(document.getElementById("edit-post-div"))
