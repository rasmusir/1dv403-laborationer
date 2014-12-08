"use strict";

function Minesweeper(bombs)
{
    this.element = document.createElement("div");
    this.table = document.createElement("table");
    this.element.classList.add("minesweeper");
    
    this.tiles = new Array(20);
    
    this.bombsleft = 0;
    this.bombs = bombs || 50;
    
    var self = this;
    
    
    for( var y = 0; y<20; y++)
    {
        var tr = document.createElement("tr");
        this.tiles[y] = new Array(20);
        for (var x = 0; x<20; x++)
        {
            var td = document.createElement("td");
            var content = document.createElement("div");
            content.classList.add("content");
            var element = document.createElement("div");
            element.classList.add("tile");
            this.tiles[y][x] = {
                tile: element,
                cell: td,
                content: content,
                x: x,
                y: y,
                bomb: false,
                bombs: 0,
                cleared: false,
                flagged: false,
                flags: 0
            };
            td.appendChild(content);
            td.appendChild(element);
            tr.appendChild(td);
        }
        this.table.appendChild(tr);
    }
    
    this.populate(this.bombs);
    
    this.element.appendChild(this.table);
    
    this.table.addEventListener("click",function(e)
    {
        e.preventDefault();
        var x = e.clientX, y = e.clientY;
        x -= self.table.offsetLeft;
        y -= self.table.offsetTop;
        x = Math.floor(x/self.table.clientWidth*20);
        y = Math.floor(y/self.table.clientHeight*20);
        
        self.trigger(x,y,true);
    });
    
    this.table.addEventListener("contextmenu",function(e)
    {
        e.preventDefault();
        var x = e.clientX, y = e.clientY;
        x -= self.table.offsetLeft;
        y -= self.table.offsetTop;
        x = Math.floor(x/self.table.clientWidth*20);
        y = Math.floor(y/self.table.clientHeight*20);
        
        self.plant(x,y);
    });
    
    this.table.addEventListener("dblclick",function(e)
    {
        e.preventDefault();
        var x = e.clientX, y = e.clientY;
        x -= self.table.offsetLeft;
        y -= self.table.offsetTop;
        x = Math.floor(x/self.table.clientWidth*20);
        y = Math.floor(y/self.table.clientHeight*20);
        
        self.check(x,y);
    });
}

Minesweeper.prototype.populate = function(ammount)
{
    this.bombsleft = 0;
    
    do
    {
        var x = Math.floor(Math.random()*20);
        var y = Math.floor(Math.random()*20);
        var b = this.tiles[y][x];
        if (!b.bomb)
        {
            this.bombsleft++;
            b.bomb = true;
            var txmin = Math.max(x-1,0);
            var txmax = Math.min(x+1,19);
            var tymin = Math.max(y-1,0);
            var tymax = Math.min(y+1,19);
            
            for (var ax = txmin; ax<=txmax; ax++)
            {
                for (var ay = tymin; ay<=tymax; ay++)
                {
                    var ab = this.tiles[ay][ax];
                    if (ab!=b)
                    {
                        ab.bombs++;
                        ab.content.innerHTML = ab.bombs;
                    }
                }
            }
        }
    }
    while (this.bombsleft<ammount)
};

Minesweeper.prototype.trigger = function(x,y,direct)
{
    var tile = this.tiles[y][x];
    
    if (!tile.bomb && !tile.cleared && !tile.flagged)
    {
        tile.tile.style.background = "transparent";
        tile.tile.style.transform = "scale(0,1)";
        tile.cleared = true;
    
        var txmin = Math.max(x-1,0);
        var txmax = Math.min(x+1,19);
        var tymin = Math.max(y-1,0);
        var tymax = Math.min(y+1,19);
        
        if (tile.bombs === 0 || direct)
        for (var ax = txmin; ax<=txmax; ax++)
        {
            for (var ay = tymin; ay<=tymax; ay++)
            {
                var ab = this.tiles[ay][ax];
                if (ab != tile)
                {
                    this.trigger(ax,ay,false);
                }
            }
        }
    }
};

Minesweeper.prototype.plant = function (x,y)
{
    var tile = this.tiles[y][x];
    var u = false;
    if (!tile.flagged)
    {
        if (this.bombsleft > 0)
        {
            tile.tile.classList.add("flagged");
            tile.flagged = true;
            this.bombsleft--;
            u = true;
        }
    }
    else
    {
        tile.tile.classList.remove("flagged");
        tile.flagged = false;
        this.bombsleft++;
        u = true;
    }
    
    var txmin = Math.max(x-1,0);
    var txmax = Math.min(x+1,19);
    var tymin = Math.max(y-1,0);
    var tymax = Math.min(y+1,19);
    
    if (u)
    for (var ax = txmin; ax<=txmax; ax++)
    {
        for (var ay = tymin; ay<=tymax; ay++)
        {
            var ab = this.tiles[ay][ax];
            if (ab != tile)
            {
                ab.flags += tile.flagged ? 1:-1;
            }
        }
    }
};

Minesweeper.prototype.check = function(x,y)
{
    var tile = this.tiles[y][x];
    if (tile.cleared)
    {
        if (tile.flags == tile.bombs)
        {
            var txmin = Math.max(x-1,0);
            var txmax = Math.min(x+1,19);
            var tymin = Math.max(y-1,0);
            var tymax = Math.min(y+1,19);
            for (var ax = txmin; ax<=txmax; ax++)
            {
                for (var ay = tymin; ay<=tymax; ay++)
                {
                    var ab = this.tiles[ay][ax];
                    if (ab != tile)
                    {
                        this.trigger(ax,ay,false);
                    }
                }
            }
        }
    }
};