
function main(handler)
{
    var w = new Window(handler);
    
    var p = document.createElement("p");
    p.innerHTML = "Hello, world!";
    p.innerHTML += "\nMy id is: "+__instance.id;
    
    w.appendChild(p);
    w.show();
}
