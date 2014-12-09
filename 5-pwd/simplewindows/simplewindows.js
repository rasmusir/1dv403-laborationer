var sw;

window.addEventListener("load",function()
{
    sw = new SimpleWindows();
});

function SimpleWindows()
{
    this.desktopElement = document.createElement("div");
    this.desktopElement.classList.add("desktop");
    
    document.body.appendChild(this.desktopElement);
}