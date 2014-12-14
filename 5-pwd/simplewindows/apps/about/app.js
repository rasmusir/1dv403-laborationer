
function main(handler)
{
    var w = new LegacyWindow(handler);
    w.setSize(400,400);
    w.setResize(true);
    w.show();
    
    w.loadURL("../4-thequiz/index.html");
}