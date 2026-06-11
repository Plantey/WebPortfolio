console.log("Assignment #4: Interactive Artwork - Josh Plante");
//PROJECT BREAKDOWN
    //1. butterfly shape random colour (protagonist) that follows the cursor on the canvas
    //2. a circle array will generate circles of different sizes and colours
    //2.5. if the player (butterfly) is over (colliding with) a circle and presses [space], the butterfly will change to match the circles colour
    //3. waves of coloured bars spanning the width of the canvas threaten to squish the player, by matching the colour of this bar, the player can safely pass through
    //NOTES: a.use colour array, pick 20 colours instead of the 360 that hsla allows b.

//GLOBAL VARIABLE & OBJECT DECLARATIONS
var canvas;
var ctx;
var canvw = 1000;
var canvh = 700;

//18 total colours for everything to choose from, this is a game design descision that keeps things fair for players, too many colours would be nearly impossible to defferentiate
var allColours = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340];

//main butterfly the player controls
var butt = {
    x: canvw/2, //xpos
    y: canvh/2,  //ypos
    c: getColour(allColours), //colour 
    a: 100,  //alpha
    rwings: 0, //randomness for wing size
    rpos: 0, //randomness for position
    lw: 1, //line width
    r: 30, //radius, used for circle collision detection
    w: 30, //width used for rect collision detection
    h: 30, //height used for rect collision detection
    change:{x:0, y:0, c:0, a: 0, rwings:0, rpos:0, lw:0, r:0, w: 0, h: 0} //change values for update properties
}
var allCircles = [];
var allRects = [];

var state = {
    space: false,
    spawnRects: false,
} 

var score = 0;
var gameSpeed = 10000; //10 seconds, in milliseconds

//EXECUTABLE CODE
setUpCanvas();
//get mousemove info    
document.getElementById("canvas").onmousemove = onmousemove;
//get keyboard info
document.onkeydown = keydown;
document.onkeyup = keyup;

//create circles
createData_circles(30, allCircles);

//create rectangles, wait three seconds, then start spawning rectangles every x seconds
setTimeout(function(){
    state.spawnRects = true;  //starts rect spawning after giving the player x seconds of "tutorial time"
    console.log("Game start");
},1);

//uses nested setTimeouts to spawn in rectangles based on a dynamic value
spawnRects();
animationLoop();


//FUNCTION DECLARATIONS
//animation loop function
function animationLoop(){
    clear();
    //animating circles
    for (var i=0; i<allCircles.length;i++){
        circle(allCircles[i]);
        updateProperties_circle(allCircles[i]);
        toriod_circles(allCircles[i]);
        collision_all_circles(butt, allCircles);
    }
    //animating butterfly
    butterfly(butt);
    updateProperties_butt(butt);
 
    //animating rectangles
    for (var i=0; i<allRects.length;i++){
        rect(allRects[i]);
        updateProperties_rect(allRects[i]);
        collision_all_rects(butt, allRects);
    }
    
    requestAnimationFrame(animationLoop);
}
//interaction functions
function onmousemove(event){
    //move butterfly to the mouse cursor position
    butt.x = event.offsetX;
    butt.y = event.offsetY;
    //use if statements here to restrict mouse movement with the rectangle bars
    if(butt.y < allRects.y){
        butt.y = allRects.y-10;
    }
}
function keydown(event){ 
    if(event.key == " " && event.target == document.body){ //if spacebar is pressed, and it is within the body og my html document, where the canvas is.
        state.space = true;
        //console.log(state.space);
        event.preventDefault();//citation #2 here, just a user experiance code line that greatly imporoves my testing and user experiance, space noramlly scrolls the page down which is annoying when its part of my game. this line disables that
        if(butt.y < allRects.y){ //safeguard to prevent players from cheating
        butt.y = allRects.y-10;
    }
    }
}
function keyup(event){
    if(event.key == " "){ //if spacebar is released
        state.space = false;
        //console.log(state.space);
    }
}
//createData functions
function createData_circles(num, array){
    for(var i=0;i<num;i++){
        array.push({
            x: rand(canvw),
            y: rand(canvh),
            r: 9+rand(16), //random between 10 and 25
            c: getColour(allColours),
            a: 100,
            random: 1+rand(2),
            change: {x: randn(4), y: randn(4),r: 0, c: 0, a: 0, random: 0}
        })
    }
        
}
function createData_rect(num, array){
    for(var i=0;i<num;i++){
        array.push({ //pushing an object into our array, s1 object
            x: canvw/2,
            y: canvh+20, //spawns from the top (20 is half of height)
            w: canvw,
            h: 40,
            c: getColour(allColours),
            a: 1,
            random: 0,
            change: {x: 0, y: -0.5, w: 0, h: 0, c: 0, a: 0, random: 0}
        })
    }
        
}
function createRect(){
    if(state.spawnRects == true){
        createData_rect(1, allRects);
    }
}
//citation 4 here, helped me construct this function
function spawnRects(){
    createRect();
    //increasing gamespeed when as the player scores more points, 13000 slowest at the start, 3000 highest speed at x points earned.
    if(score == 3){
        gameSpeed = 9000;
        console.log("speed increase 1", gameSpeed)
    }else if(score == 6){
        gameSpeed = 7000;
        console.log("speed increase 2", gameSpeed)
    }else if(score == 9){
        gameSpeed = 5000;
        console.log("speed increase 3", gameSpeed)
    }else if(score == 12){
        gameSpeed = 4500;
        console.log("speed increase 4", gameSpeed)
    }
    else if(score == 15){
        gameSpeed = 4000;
        console.log("speed increase 5", gameSpeed)
    }
    else if(score == 18){
        gameSpeed = 3000;
        console.log("speed increase 6", gameSpeed)
    }else if(score == 40){
        gameSpeed = 2700;
        console.log("speed increase 7", gameSpeed)
    }else if(score == 70){
        gameSpeed = 2400;
        console.log("speed increase max", gameSpeed)
    }
    setTimeout(spawnRects, gameSpeed)
}
//collision functions
function collision_all_circles(o, array){ //butterfly i parameter one, allCircles is parameter two
    for(var i=0; i<array.length;i++){
        collision_spacebar(o, array[i], array); //runs collision function on all array  objects
    }
}
function collision_all_rects(o, array){ //butterfly i parameter one, allCircles is parameter two
    for(var i=0; i<array.length;i++){
        collision_rects(o, array[i], array); //runs collision function on all array  objects
    }
}
function collision_spacebar(o1, o2, array){
    var differenceX = Math.abs(o1.x-o2.x); //gets x fifference
    var differenceY = Math.abs(o1.y-o2.y); //gets y difference
    var hdif = Math.sqrt(differenceX*differenceX + differenceY*differenceY); //calculates hypoteneuse (line/distance) between objects

    if(hdif < o1.r+o2.r && state.space == true){ //if objects are colliding and space is pressed
        index = array.indexOf(o2); //finding index of circle
        //console.log("space pressed on circle"); //logging collision interaction to console
        o1.c = array[index].c; 
        //console.log("butterfly colour -", butt.c);
    }
}
function collision_rects(o1, o2){
    for (var i=0; i<allRects.length;i++){
        if(//butts bottom is less than rects top & the colours are NOT equal
            o1.y+o1.h/2 > o2.y-o2.h/2 &&
            o1.c != o2.c
        ){//set y to o2's ypos and add (go up even higher) 10
            o1.y = o2.y - 10;
        }else if(//if colours match on collision
            butt.y+butt.h/2 > allRects[i].y-allRects[i].h/2 &&
            butt.c == allRects[i].c
        ){ //remove rect from canvas and increase score
            allRects.splice(allRects[i], 1);
            score++;
            console.log("score:", score);
        } else if(allRects[i].y+allRects[i].h/2 < -10){ //if bottom of rect (+half of height) rect goes above canvas
                allRects.splice(allRects[i], 1);
                console.log("rectangle reached top: game over");//logs square removal to canvas, use this for score??
        }
    } 
}
//canvas functions
function toriod_circles(o){ //when a circle wraps around canvas, choose anew colour from the colour array
    if(o.x > canvw){ //if pos x is greater than canvas length set xpos back to 0 (wrap around screen)
        o.x = 0;
        o.c = getColour(allColours);
    }else if(o.x < 0){ //if less than canvas width, set xpos to max canvas width
        o.x = canvw;
        o.c = getColour(allColours);
    }else if (o.y > canvh){
        o.y = 0;
        o.c = getColour(allColours);
    }else if (o.y < 0){
        o.y = canvh;
        o.c = getColour(allColours);
    }
}
function clear(){ //clears the canvas
    ctx.clearRect(0, 0, canvw, canvh);
}
function setUpCanvas(){
    canvas = document.getElementById("canvas");
    canvas.style.border = "4px solid darkgreen"
    canvas.width = canvw;
    canvas.height = canvh;
    ctx = canvas.getContext("2d");
}
//shape functions
function rect(obj){

    var x = obj.x;
    var y = obj.y;
    obj.x = obj.x - obj.w/2;//centers our rectangle horizontally (along x) by dividing the width in halh and starting the drawing from there as x
    obj.y = obj.y - obj.h/2;//centers rectangle on y axis 

    ctx.beginPath();
    ctx.moveTo(obj.x +randn(obj.random), obj.y +randn(obj.random)); 
    ctx.lineTo(obj.x+obj.w+randn(obj.random), obj.y+randn(obj.random)); 
    ctx.lineTo(obj.x+obj.w+randn(obj.random), obj.y+obj.h+randn(obj.random)); 
    ctx.lineTo(obj.x+randn(obj.random), obj.y+obj.h+randn(obj.random)); 
    ctx.closePath();

    //hue:0-360, saturation:0-100%, lightness:0-100%, alpha:0-1
    ctx.fillStyle = "hsla(" + obj.c + ", 100%, 50%, " + obj.a + ")";
    ctx.fill();

    obj.x = x;//centering values for for loops
    obj.y = y;

}
function circle(o){
    var oneDegree = 2*Math.PI/360;
    var angle = 0;
    var sides = 360 //number of sides we want in our circle ... 90 is quarter, 180 is half, 360 is full circle
    //console.log(angle*oneDegree);
    var cx = o.r*Math.cos(angle*oneDegree);
    var cy = o.r*Math.sin(angle*oneDegree);
    ctx.beginPath();
    ctx.moveTo(o.x+cx+randn(o.random), o.y+cy+randn(o.random));

    for(var i=0; i<sides;i++){ //draws a tiny line for each degree of the circle
        angle += 360/sides;
        var cx = o.r*Math.cos(angle*oneDegree); //changes x by 1 degree
        var cy = o.r*Math.sin(angle*oneDegree); //changes y by one degree

        ctx.lineTo(o.x+cx+randn(o.random), o.y+cy+randn(o.random));
    }
    ctx.fillStyle = "hsla(" + o.c + ", 100%, 50%, " + o.a + ")" ;
    ctx.fill();
}
function butterfly(o){   
    //BUTTERFLY DRAWING
        
    //BEGIN PATH
    //head
    ctx.beginPath();
    ctx.arc(o.x+randn(o.rpos), o.y+randn(o.rpos)-8, 8, 0, 2*Math.PI);
    //abdomen
    ctx.moveTo(o.x+randn(o.rpos), o.y+randn(o.rpos));
    ctx.quadraticCurveTo(o.x-13, o.y, o.x+randn(o.rpos), o.y+rand(o.rpos)+40);
    ctx.quadraticCurveTo(o.x+13, o.y, o.x+rand(o.rpos), o.y+randn(o.rpos));
    //top left wing
    ctx.quadraticCurveTo(o.x-20, o.y , o.x+randn(o.rpos)-30-rand(o.rwings), o.y+randn(o.rpos)-25-rand(o.rwings));
    ctx.quadraticCurveTo(o.x, o.y-20 , o.x+randn(o.rpos), o.y+randn(o.rpos));
    //top right wing
    ctx.quadraticCurveTo(o.x, o.y-20, o.x+randn(o.rpos)+30+rand(o.rwings), o.y+randn(o.rpos)-25-rand(o.rwings));
    ctx.quadraticCurveTo(o.x+20, o.y, o.x+randn(o.rpos), o.y+randn(o.rpos));
    //bottom left wing 
    ctx.quadraticCurveTo(o.x-15, o.y , o.x+randn(o.rpos)-25-rand(o.rwings), o.y+randn(o.rpos)+25+rand(o.rwings));
    ctx.quadraticCurveTo(o.x, o.y+15 , o.x+randn(o.rpos), o.y+randn(o.rpos));
    //bottom right wing
    ctx.quadraticCurveTo(o.x+15, o.y , o.x+randn(o.rpos)+25+rand(o.rwings), o.y+randn(o.rpos)+25+rand(o.rwings));
    ctx.quadraticCurveTo(o.x, o.y+15 , o.x+randn(o.rpos), o.y+randn(o.rpos));
    ctx.closePath();
    //END PATH

    //fill and stroke
    ctx.fillStyle = "hsla(" + o.c + ", 100%, 50%, " + o.a + ")";
    ctx.strokeStyle = "hsla(" + o.c + ", 100%, 0%, " + o.a + ")";
    ctx.lineWidth = o.lw; //variable line width
    ctx.fill();
    ctx.stroke();
}
//updating properties functions
function updateProperties_circle(o){
    o.x += o.change.x;
    o.y += o.change.y;
    o.r += o.change.r;
    o.c += o.change.c;
    o.a += o.change.a;
    o.random += o.change.random;
}
function updateProperties_rect(o){
    o.x += o.change.x;
    o.y += o.change.y;
    o.w += o.change.w;
    o.h += o.change.h;
    o.c += o.change.c;
    o.a += o.change.a;
    o.random += o.change.random;
}
function updateProperties_butt(o){
    o.x += o.change.x;
    o.y += o.change.y;
    o.c += o.change.c;
    o.a += o.change.a;
    o.rwings += o.change.rwings;
    o.rpos += o.change.rpos;
    o.lw += o.change.lw;
    o.random += o.change.random;
}
//randomness functions
function randn(range){
    var result = Math.random()*range - range/2; // gives us positive and negative numubers 
    return result;
}
function rand(range){
    var result = Math.random()*range;//variable result is a random number with the range parameter
    return result //returns result
}
//other functions
function getColour(array){
    var randomIndex = Math.floor(Math.random()*array.length); //citation 1 references this line, one line of code to randomly find an array index position then return it
    return allColours[randomIndex];
}