function main(handler)
{
    var w = new Window(handler);
    w.setTitle("Task Manager");
    
    var div = document.createElement("div");
    w.setColor("rgba(255,0,0,0.6");
    w.appendChild(div);
    
    
    var not = new Notification(handler,"Task manager is experimental, use with care.");
    not.show();
    
    w.show();
}