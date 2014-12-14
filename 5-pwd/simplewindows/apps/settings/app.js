function main(handler)
{
    var w = new Window(handler);
    
    w.setTitle("Settings For SimpleWindows");
    w.setSize(500,300);
    
    w.setResize(true);
    
    w.show();
    
    w = new Window(handler);
    
    w.setTitle("Another window");
    w.setSize(500,100);
    
    w.show();
}