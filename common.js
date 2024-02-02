//data 
var links = [
    ["home", "index.html"],
    ["code", "code.html"],
    ["interests", "interests.html"],
    ["contact", "contact.html"]
]

// header
var body = document.getElementById("body")
var header = document.createElement("div")
// links to other places
links.forEach(data => {
    var name = data[0];
    var addr = data[1];
    var link = document.createElement("a")
    link.style = "padding: unset;"
    link.href = addr
    var header_i = document.createElement("p")
    header_i.className = "header_i"
    header_i.innerHTML = "> "
    var name_p = document.createElement("p")
    name_p.className = "header_link"
    name_p.innerHTML = name
    link.appendChild(header_i)
    link.appendChild(name_p)
    header.appendChild(link)
    header.appendChild(document.createTextNode(" "))
})
header.appendChild(document.createElement("br"))
header.appendChild(document.createElement("hr"))
header.appendChild(document.createElement("br"))

body.prepend(header)
console.log("Finished executing header")

// footer