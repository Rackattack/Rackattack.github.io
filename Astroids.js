//astroids java script
//object definitions
function Ship()
{
    this.x = 250;//middle of canvas
    this.y = 250;//canvas = 500X500
    this.direction = 0;
    this.dx = 0;
    this.dy = 0;
    this.shipImg = new Image();
    this.shipImg.src = "Ship1.png";
}
function Alien()
{
    this.x;
    this.y;
    this.dx;
    this.dy;
    this.alienImg = new Image();
    this.alienImg.src = "AlienShip.png"
    //may need a bool to figure out if it should be visible or not.
}
function Laser()
{
    this.x = 0;
    this.y= 0;
    this.dx=0;
    this.dy=0;
    this.direction=0;
    this.life = 35;
    this.laserImg = new Image();
    this.laserImg.src = "Laser.png"
}
function Astroid(type)
{
    this.x=0;
    this.y=0;
    this.dx=0;
    this.dy=0;
    this.path = type;
    this.astroidImg = new Image();
    this.astroidImg.src = this.path;
    this.alien = false;
}

//Global Variables!!!!!!!!!!!!!!!!!!!!

var ship = new Ship();
var alien = new Alien();
var laser;
var astroid;
lasers = new Array();
astroids = new Array();
var canvas;
var ctx;
var gameLoop;//this will be used to determine if the start page or the game loop need to be used
var level = 1;//this will decide the level of the game and number of astroids.
var points = 0;
var lives = 3;
var astroid1 = "Astroid1.png";
var astroid2 = "Astroid2.png";
var astroid3 = "Astroid3.png";//biggest
var leftkey = false;//these bool are used to determine key up events and allow for 
var rightkey = false;//2 buttons to be pressed at once 
var upKey = false;
var s = false;
var shipspeed = 0;
var thrustDirection = 0;
var laserTimer = 0;
var gameInProgress = false;//needs to be false on level changes and on no lives left.
var shipExplodable = true;
var explodableTimer = 0;

//these must be switched when done testing -----------------------------------------------------------

var newLevel = false;
var menu = true;
var gameovertimer = 100;
var newleveltimer = 70;
var alienShootTimer = 20;




// init function
function init()
{
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    window.addEventListener("keydown",keydown,false);
    window.addEventListener("keyup",function(evt){
          if(evt.keyCode == 39)
            {
                rightkey = false;
            }
        if(evt.keyCode == 37)
            {
                leftkey = false;
            }
        if(evt.keyCode == 38)
            {
                upKey = false;
            }
        if(evt.keyCode == 83)
            {
                s = false;
            }
        if(evt.keyCode == 13)
           {
               menu = false;
               newLevel = true;
           }
    },false);
    animFrame();
}
//requesting animation
function animFrame()
{
    requestAnimationFrame(animFrame,canvas);
    game();
}



//actual game loop
function game()
{
    if(gameInProgress)
        {   
            if(astroids.length == 0)
                {
                    newleveltimer--;
                    ctx.strokeText("Cleared level!",150,270);
                    if(newleveltimer == 0)
                    {
                        gameInProgress = false;
                        newLevel = true;
                        newleveltimer = 70;
                        level ++;
                    }
                }
            if(lives <= 0)
            {
                gameovertimer--;
                ctx.strokeText("Game Over",230,270);
                ship.shipImg.src = "Ship1.png";
                if(gameovertimer == 0)
                    {
                        menu = true;
                        gameovertimer = 100;
                        gameInProgress = false;
                    }
            }
            else
                {
                    if(explodableTimer==0)
                        {
                            shipExplodable = true;
                            ship.shipImg.src = "Ship1.png";
                        }
                    else
                        {
                            explodableTimer--;
                        }
                    ctx.clearRect(0,0,canvas.width,canvas.height);
                    drawShip(ship.direction);
                    moveShip();//function that handles all moving of the ship object
                    if(laserTimer == 0)
                    {
                        if(s)
                            {
                                //add laser if shoot button (s) is pressed
                                createNewLaser(ship.x,ship.y,ship.direction);
                            }
                        laserTimer = 10;
                    }
                    for(a =0; a < astroids.length; a++)
                        {
                            alienShootTimer--;
                            if(alienShootTimer == 0)
                                {
                                    if(astroids[a].alien)
                                        {
                                            createNewLaser(astroids[a].x,astroids[a].y,-ship.direction+ (2*Math.random()));
                                        }
                                    alienShootTimer = 100;
                                }
                        }
                    drawLasers();

                    if(laserTimer != 0)
                        {
                            laserTimer--;
                        }
                    moveLasers();

                    //drawAstroids
                    for(a of astroids)
                        {
                            ctx.drawImage(a.astroidImg,a.x,a.y);
                        }

                    //move astroids
                    moveAstroids();

                    //check collisions
                    checkCollisions();
                    //show score
                    ctx.strokeStyle= "red";
                    ctx.font = "20px Ariel";
                    ctx.strokeText("Score: "+points,5,25);
                    ctx.strokeText("Lives: "+ lives,5,50);
                        }
        }
    else//gameover bool to display menu page //newlevel bool to create new astroids 
            {
                if(newLevel)
                    {
                        initAstroids();
                        gameInProgress = true;
                        newLevel = false;
                    }
                else if(menu)
                    {
                        lives = 3;
                        points = 0;
                        ship.dx = 0;
                        ship.dy = 0;
                        level = 0;
                        ctx.strokeStyle= "red";
                        ctx.font = "20px Ariel";
                        ctx.strokeText("To Begin press enter",120,120); 
                        //set up a listener for enter if menu = true
                    }
            }
    
}//gameloop


//check collisions
function checkCollisions()
{
    for(l of lasers)
                {
                    var tempArray = astroids;
                    if(l.life<31)
                        {
                            for(a of tempArray)
                                {
                                    if(l.x <= a.x + a.astroidImg.width+5 && l.x >= a.x && l.y >= a.y-10 && l.y <= a.y+ a.astroidImg.height-10 
                                      || l.x+l.laserImg.width <= a.x + a.astroidImg.width+5 && l.x+l.laserImg.width >= a.x && l.y >= a.y-10 && l.y<=a.y+ a.astroidImg.height  || l.x <= a.x + a.astroidImg.width+5 && l.x >= a.x && l.y + l.laserImg.height >= a.y-10 && l.y + l.laserImg.height <= a.y + a.astroidImg.height || l.x+l.laserImg.width <= a.x + a.astroidImg.width+5 && l.x+l.laserImg.width >= a.x && l.y + l.laserImg.height >= a.y-10 && l.y + l.laserImg.height <= a.y + a.astroidImg.height-10)
                                        {
                                            var hitIndex = lasers.indexOf(l);
                                            lasers.splice(hitIndex,1);
                                            var removeIndex;
                                            if(a.path == astroid3)
                                                {
                                                    //remove astroids that get hit
                                                    var north = new Astroid(astroid2);
                                                    var south = new Astroid(astroid2);
                                                    var randomShip = Math.floor(10*Math.random());
                                                    if(randomShip ==1 || randomShip == 3)
                                                        {
                                                            north.astroidImg.src = "AlienShip.png";
                                                            north.alien = true;
                                                        }
                                                    north.x = a.x;
                                                    north.y = a.y; 
                                                    if(a.alien)points+=500;
                                                    north.dx = 4*Math.random()-2;
                                                    north.dy = 4*Math.random()-2;
                                                    south.x = a.x;
                                                    south.y = a.y; 
                                                    south.dx = 4*Math.random()-2;
                                                    south.dy = 4*Math.random()-2;
                                                    removeIndex = astroids.indexOf(a);
                                                    astroids.splice(removeIndex,1);
                                                    astroids.push(south);
                                                    astroids.push(north);
                                                    points += 20;
                                                }
                                            else if(a.path == astroid2)
                                                {
                                                    //remove astroids that get hit
                                                    var north = new Astroid(astroid1);
                                                    var south = new Astroid(astroid1);
                                                    north.x = a.x;
                                                    north.y = a.y; 
                                                    var randomShip = Math.floor(10*Math.random());
                                                    if(randomShip ==1 || randomShip == 3)
                                                        {
                                                            north.astroidImg.src = "AlienShip.png";
                                                            north.alien = true;
                                                        }
                                                    north.dx = 4*Math.random()-2;
                                                    north.dy = 4*Math.random()-2;
                                                    south.x = a.x;
                                                    south.y = a.y; 
                                                    if(a.alien) points+=500;
                                                    south.dx = 4*Math.random()-2;
                                                    south.dy = 4*Math.random()-2;
                                                    removeIndex = astroids.indexOf(a);
                                                    astroids.splice(removeIndex,1);
                                                    astroids.push(south);
                                                    astroids.push(north);
                                                    points +=50;
                                                }
                                            else if(a.path == astroid1)
                                                {
                                                    removeIndex = astroids.indexOf(a);
                                                    if(a.alien) points+=500;
                                                    astroids.splice(removeIndex,1);
                                                    points+=100;
                                                }
                                        }
                                }
                        }
                    //check laser collisions with ship
                    if(shipExplodable)
                        {
                            if(l.life<25)
                                {
                                    if(l.x <= ship.x + ship.shipImg.width+5 && l.x >= ship.x && l.y >= ship.y && l.y <= ship.y+ ship.shipImg.height 
                                              || l.x+l.laserImg.width <= ship.x + ship.shipImg.width && l.x+l.laserImg.width >= ship.x && l.y >= ship.y && l.y<=ship.y+ ship.shipImg.height  || l.x <= ship.x + ship.shipImg.width && l.x >= ship.x && l.y + l.laserImg.height >= ship.y && l.y + l.laserImg.height <= ship.y + ship.shipImg.height || l.x+l.laserImg.width <= ship.x + ship.shipImg.width && l.x+l.laserImg.width >= ship.x && l.y + l.laserImg.height >= ship.y && l.y + l.laserImg.height <= ship.y + ship.shipImg.height)
                                        {
                                            //ship changed to explosion set timer in game loop
                                            //lives --
                                            //ship location chagned to 250 250
                                            //shipExplodable = false;
                                            //set timer to make it explodable again soon
                                            ship.x = 250;
                                            ship.y = 250;
                                            ship.dx = 0;
                                            ship.dy = 0;
                                            shipExplodable = false;
                                            ship.shipImg.src = "Explosion.png";
                                            explodableTimer = 100;
                                            lives--;
                                        }
                                }
                        }
                }
            var tempArray2 = astroids;
            //if asteroids and ship collide
            if(shipExplodable)
                {
                    for(a of tempArray2)
                    {
                        if(a.x <= ship.x + ship.shipImg.width+5 && a.x >= ship.x && a.y >= ship.y && a.y <= ship.y+ ship.shipImg.height 
                                      || a.x+a.astroidImg.width <= ship.x + ship.shipImg.width+5 && a.x+a.astroidImg.width >= ship.x && a.y >= ship.y && a.y<=ship.y+ ship.shipImg.height  || a.x <= ship.x + ship.shipImg.width+5 && a.x >= ship.x && a.y + a.astroidImg.height >= ship.y && a.y + a.astroidImg.height <= ship.y + ship.shipImg.height || a.x+a.astroidImg.width <= ship.x + ship.shipImg.width+5 && a.x+a.astroidImg.width >= ship.x && a.y + a.astroidImg.height >= ship.y && a.y + a.astroidImg.height <= ship.y + ship.shipImg.height)
                                {

                                    //ship changed to explosion set timer in game loop
                                    //lives --
                                    //ship location chagned to 250 250
                                    //shipExplodable = false;
                                    //set timer to make it explodable again soon
                                            var removeIndex;
                                            if(a.path == astroid3)
                                                {
                                                    //remove astroids that get hit
                                                    var north = new Astroid(astroid2);
                                                    var south = new Astroid(astroid2);
                                                    north.x = a.x;
                                                    north.y = a.y; 
                                                    north.dx = 4*Math.random()-2;
                                                    north.dy = 4*Math.random()-2;
                                                    south.x = a.x;
                                                    south.y = a.y; 
                                                    south.dx = 4*Math.random()-2;
                                                    south.dy = 4*Math.random()-2;
                                                    removeIndex = astroids.indexOf(a);
                                                    astroids.splice(removeIndex,1);
                                                    astroids.push(south);
                                                    astroids.push(north);
                                                }
                                            if(a.path == astroid2)
                                                {
                                                    //remove astroids that get hit
                                                    var north = new Astroid(astroid1);
                                                    var south = new Astroid(astroid1);
                                                    north.x = a.x;
                                                    north.y = a.y; 
                                                    north.dx = 4*Math.random()-2;
                                                    north.dy = 4*Math.random()-2;
                                                    south.x = a.x;
                                                    south.y = a.y; 
                                                    south.dx = 4*Math.random()-2;
                                                    south.dy = 4*Math.random()-2;
                                                    removeIndex = astroids.indexOf(a);
                                                    astroids.splice(removeIndex,1);
                                                    astroids.push(south);
                                                    astroids.push(north);
                                                }
                                            if(a.path == astroid1)
                                                {
                                                    removeIndex = astroids.indexOf(a);
                                                    astroids.splice(removeIndex,1);
                                                }
                                    ship.x = 250;
                                    ship.y = 250;
                                    ship.dx = 0;
                                    ship.dy = 0;
                                    shipExplodable = false;
                                    ship.shipImg.src = "Explosion.png";
                                    explodableTimer = 100;
                                    lives--;
                                }    
                    }
                }
            
}
//move astroids
function moveAstroids()
{
    for(i = 0; i < astroids.length;i++)
                {
                    astroids[i].x += astroids[i].dx;
                    astroids[i].y += astroids[i].dy;
                    //wrap the astroids on the x  10 is half the size of the image
                    if(astroids[i].x > 505)
                        {
                            astroids[i].x = -5;
                        }
                    if(astroids[i].x < -5)
                        {
                            astroids[i].x = 505;
                        }

                    //wrap the astroids on the y  10 is half the size of the image
                    if(astroids[i].y > 505)
                        {
                            astroids[i].y = -5;
                        }
                    if(astroids[i].y < -10)
                        {
                            astroids[i].y = 505;
                        }
                }
}
//initAstroids
function initAstroids()
{
    if(astroids.length > 0)
                    {
                        for(k = 0; k<astroids.length;k++)
                            {
                                astroids.pop();
                            }
                    }
                for(i=0; i < 3+level; i++)
                    {
                        astroid = new Astroid(astroid3);
                        var whereSpawn = Math.floor(2*Math.random()) +1;
                        if(whereSpawn == 1)//x on screen y off
                            {
                                astroid.x =  Math.floor(500*Math.random());
                                var rand = 2*Math.random();
                                if(rand < 1)
                                    {
                                        astroid.y = -5;
                                    }
                                else{
                                    astroid.y = 490;
                                }
                            }
                        else{//y on screen x off
                            astroid.y =  Math.floor(500*Math.random());
                                var rand = 2*Math.random();
                                if(rand < 1)
                                    {
                                        astroid.x = -5;
                                    }
                                else{
                                    astroid.x = 490;
                                }
                        }
                        astroid.dx = 4*Math.random()-2;
                        astroid.dy = 4*Math.random()-2;
                        astroids[i] = astroid;
                    }
}
//move lasers
function moveLasers()
{
    if(lasers.length != 0)
        {
            for(l of lasers)
                {
                    l.x += l.dx;
                    l.y+=l.dy;
                    if(l.x > 505)
                        {
                            l.x = -5;
                        }
                    if(l.x < -5)
                        {
                            l.x = 505;
                        }

                    //wrap the laser on the y  10 is half the size of the image
                    if(l.y > 505)
                        {
                            l.y = -5;
                        }
                    if(l.y < -10)
                        {
                            l.y = 505;
                        }
                }
        }
}


// draw lasers
function drawLasers()
{
    if(lasers.length != 0)
        {
            for(l of lasers)
                {
                    ctx.save();
                    ctx.translate(l.x-10,l.y+15);
                    ctx.translate(10,10)//width and height of the ship picture
                    ctx.rotate(l.direction);
                    ctx.drawImage(l.laserImg,0,-20);
                    ctx.restore();
                    if(l.life == 0)
                        {
                            var index = lasers.indexOf(l);
                            lasers.splice(index,1);
                        }
                    else{
                        l.life--;
                    }
                }
        }
}
//createNewLaser
function createNewLaser(x,y,direction)
{
    laser = new Laser();
    laser.direction = direction;
    laser.x = x+7;
    laser.y = y-25;
    laser.dx = 10*Math.cos(laser.direction + 3*Math.PI/2);
    laser.dy = 10*Math.sin(laser.direction + 3*Math.PI/2);
    lasers.push(laser);
}
//move ship
function moveShip(){
    //move the ship using dx and dy
    ship.x += ship.dx;
    ship.y += ship.dy;
    
    {
        ship.dx += shipspeed*Math.cos(thrustDirection+3*Math.PI/2);
        ship.dy += shipspeed*Math.sin(thrustDirection+3*Math.PI/2);  
        shipspeed = shipspeed/2;
            if(ship.dy < 0)
                {
                    ship.dy = 49*ship.dy / 50;
                }
            else if(ship.dy > 0)
            {
                ship.dy = 49*ship.dy / 50;
            }
        if(ship.dx < 0)
                {
                    ship.dx = 49*ship.dx / 50;
                }
            else if(ship.dx > 0)
            {
                ship.dx = 49*ship.dx / 50;
            }
    }
    
    
    
    //wrap the ship on the x  10 is half the size of the image
    if(ship.x > 505)
        {
            ship.x = -5;
        }
    if(ship.x < -5)
        {
            ship.x = 505;
        }
    
    //wrap the ship on the y  10 is half the size of the image
    if(ship.y > 505)
        {
            ship.y = -5;
        }
    if(ship.y < -10)
        {
            ship.y = 505;
        }
    
    
    //checking arrow key combinations
    if(leftkey && upKey)
        {
            if(shipspeed < 5)
                {
                    shipspeed+=.1;
                }
            ship.direction+=.1;
            thrustDirection = ship.direction;
        }
    else if(rightkey && upKey)
        {
            if(shipspeed < 5)
                {
                    shipspeed+=.1;
                }
            ship.direction-=.1;
            thrustDirection = ship.direction;
        }
    
    //using the arrow keys to move
    else if(rightkey)
        {
            ship.direction-=.1;
        }
    else if(leftkey)
        {
            ship.direction+=.1;
        }
    else if(upKey)
        {
            if(shipspeed < 5)
                {
                    shipspeed+=.1;
                }
            thrustDirection = ship.direction;
        }
}


//draw ship
function drawShip(angle)
{
    ctx.save();
    ctx.translate(ship.x,ship.y);
    ctx.translate(10,10)//width and height of the ship picture
    ctx.rotate(angle);
    ctx.drawImage(ship.shipImg,-10,-10);
    ctx.restore();
}
function keydown(evt)
{
    if(evt.keyCode == 37)//left rotate
        {
            leftkey = true;
        }
    if(evt.keyCode == 38)//move forward
        {
            upKey = true;
        }
    if(evt.keyCode == 39)//right rotate
        {
            rightkey = true;
        }
    if(evt.keyCode == 83)//s shoot
        {
            s = true;
        }
}