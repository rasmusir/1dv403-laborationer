"use strict";

function Messageboard(name)
{
    var template = document.querySelector("#boardtemplate").content.querySelector(".board");
    var self = this;
    this.board = template.cloneNode(true);
    this.scroll = null;
    
    
    this.elements = {
        messagebox: this.board.querySelector(".messages"),
        text: this.board.querySelector(".input .text"),
        post: this.board.querySelector(".input .post")
    };
    
    this.elements.text.addEventListener("keydown", function(e) {
        if (e.keyCode == 13)
        {
            self.addMessage(new Message(self.elements.text.value));
        }
    });

    this.elements.post.addEventListener("click",function(){
        self.addMessage(new Message(self.elements.text.value));
    });
    
    this.scrollFunc = function()
    {
        var speed = (self.elements.messagebox.scrollHeight - (self.elements.messagebox.scrollTop + self.elements.messagebox.clientHeight))/5;
        speed = Math.max(1,speed);
        self.elements.messagebox.scrollTop += speed;
        var sb = self.elements.messagebox.scrollTop + self.elements.messagebox.clientHeight;
        var s = self.elements.messagebox.scrollHeight;
        if (s - sb <= 1)
        {
            self.elements.messagebox.scrollTop = self.elements.messagebox.scrollHeight;
            window.clearInterval(self.scroll);
        }
    };
    
}
Messageboard.prototype.addMessage = function(m)
{
    this.elements.messagebox.appendChild(m.element);
    if (this.scroll)
        window.clearInterval(this.scroll);
    this.scroll = window.setInterval(this.scrollFunc, 10);
};

function Message(content)
{
    var template = document.querySelector("#boardtemplate").content.querySelector(".message");
    this.element = template.cloneNode(true);
    this.element.innerHTML = content;
    
    Object.defineProperty(this,"text",
    {
        get: function()
        {
            return this.element.innerHTML;
        },
        set: function(x)
        {
            this.element.innerHTML = x;
        }
    });
}