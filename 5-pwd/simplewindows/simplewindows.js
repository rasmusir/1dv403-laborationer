var sw;

window.addEventListener("load",function()
{
    sw = new Desktop();
    
    var w = new Window(sw);
    
    w.setPosition(100,100);
    w.show();
});

function Desktop()
{
    this.desktopElement = document.createElement("div");
    this.desktopElement.classList.add("desktop");
    
    this.blurCanvas = document.createElement("canvas");
    this.blur = this.blurCanvas.getContext("2d");
    this.background = new Image();
    this.background.src = "simplewindows/swirl_pattern.png";
    
    this.appbar = document.createElement("div");
    this.appbar.classList.add("appbar");
    
    this.desktopElement.appendChild(this.appbar);
    document.body.appendChild(this.desktopElement);
}

Desktop.prototype.updateBackground = function()
{
    this.blur.width = 50;
    this.blur.height = 50;
    this.blurCanvas.width = 50;
    this.blurCanvas.height = 50;
    this.blur.drawImage(this.background,0,0,50,50);
    
    this.appbar.style.backgroundImage = "url(" + this.blurCanvas.toDataURL() + ")";
};



function Window(handler)
{
    this.handler = handler;
    this.element = document.createElement("div");
    this.element.classList.add("window");
    this.top = document.createElement("div");
    this.top.classList.add("top");
    this.close = document.createElement("div");
    this.close.classList.add("close");
    this.content = document.createElement("div");
    this.content.classList.add("content");
    
    this.top.appendChild(this.close);
    this.element.appendChild(this.top);
    this.element.appendChild(this.content);
}

Window.prototype.show = function()
{
    this.handler.desktopElement.appendChild(this.element);
};

Window.prototype.setPosition = function(x,y)
{
    this.element.style.left = x+"px";
    this.element.style.top = y+"px";
};