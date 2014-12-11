function main(handler)
{
    var w = new Window(handler);
    w.setTitle("Task Manager");
    
    var div = document.createElement("div");
    
    w.appendChild(div);
    
    
    var not = new Notification(handler);
    
    not.show();
    
    w.show();
}