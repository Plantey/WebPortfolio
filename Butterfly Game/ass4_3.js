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

//18 total colours for everything to choose from
var allColours = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340];

var butt = {
    x: canvw/2, //xpos
    y: canvh/2,  //ypos
    c: getColour(allColours), //colour 
    a: 0.75,  //alpha
    rwings: 0, //randomness for wing size
    rpos: 0, //randomness for position
    lw: 1, //line width
    change:{x:0, y:0, c:0, a: 0, rwings:0, rpos:0, lw:0,} //change values for update properties
}
console.log("buttefly colour -", butt.c)



//EXECUTABLE CODE
setUpCanvas();
//get mousemove info
document.getElementById("canvas").onmousemove = onmousemove;

animationLoop();


//FUNCTION DECLARATIONS
//animation loop function
function animationLoop(){
    clear();

    butterfly(butt);
    updateProperties_butt(butt);

    requestAnimationFrame(animationLoop);
}
//interaction functions
function onmousemove(event){
    //move butterfly to the mouse cursor position
    butt.x = event.offsetX;
    butt.y = event.offsetY;

    //log movement x and y values of cursor
    //console.log("move", event.offsetX, event.offsetY);
}
//createData functions
function createData_circles(num, array){
    for(var i=0;i<num;i++){
        array.push({
            x: rand(canvw),
            y: rand(canvh),
            r: 10,
            w:50,//width and height are illrelevent properites for circle functions, but withw and h we can use rect functions on it
            h:50,
            c: 40,
            a: 0.75,
            random: 0,
            change: {x: randn(10), y: randn(10),r: 0, c: 0, a: 0, random: 0}
        })
    }
        
}
function createData_rect(num, array){
    for(var i=0;i<num;i++){
        array.push({ //pushing an object into our array, s1 object
            x: canvw/2,
            y: canvh/2,
            w: 100,
            h: 100,
            c: 240,
            a: 0.75,
            random: 0,
            change: {x: randn(10), y: randn(10), w: 0, h: 0, c: 0, a: 0, random: 0}
        })
    }
        
}
//collision functions
function collision_all(o, array){
    for(var i=0; i<array.length;i++){
        // console.log(o == array[i]);
        if(o != array[i]){//checks to see if o is being compared against itself, if not, proceed with collision
         collision_circle_remove(o, array[i], array); // comparing object to all other in the array to check for collsion
        }
    }
}
function collision_circle_remove(o1, o2, array){
    var differenceX = Math.abs(o1.x-o2.x);
    var differenceY = Math.abs(o1.y-o2.y);
    //using the two distances of x and y to create a hypotenuse difference variable
    var hdif = Math.sqrt(differenceX*differenceX + differenceY*differenceY);

    var index;
    if(hdif < o1.r+o2.r){ //when distance between centers is less than radius of circle 1 and circle 2 added together
        index = array.indexOf(o2); //arbitrarily choosing to remove only o2 on collision
        array.splice(index, 1); //remove whatever the index of o2 is
    }
}
function collision_circle_bounce(o1, o2){
    var differenceX = Math.abs(o1.x-o2.x);
    var differenceY = Math.abs(o1.y-o2.y);
    //using the two distances of x and y to create a hypotenuse difference variable
    var hdif = Math.sqrt(differenceX*differenceX + differenceY*differenceY);
    //console.log(differenceX, differenceY);
    //console.log(hdif);
    if(hdif < o1.r+o2.r){ //when distance between centers is less than radius of circle 1 and circle 2 added together
        if(differenceX > differenceY){ //if x positions difference are further than y positions, bounce away on x
            o1.change.x *= -1; //change direction on collision
            o2.change.x *= -1;

        }else{ //if y positions are greather than x positions, bounce on y
            o1.change.y *= -1;
            o2.change.y *= -1;
        }
    }
}
function collision_circle_stop(o1, o2){
    var differenceX = Math.abs(o1.x-o2.x);
    var differenceY = Math.abs(o1.y-o2.y);
    //using the two distances of x and y to create a hypotenuse difference variable
    var hdif = Math.sqrt(differenceX*differenceX + differenceY*differenceY);
    //console.log(differenceX, differenceY);
    console.log(hdif);
    if(hdif < o1.r+o2.r){ //when distance between centers is less than radius of circle 1 and circle 2 added together
        stop(o1, o2);
        console.log("collision");
    }
}
function collision_rect_response_exploration(o1, o2){
    if(
        o1.x+o1.w/2 > o2.x-o2.w/2 && //o1 right side greater than o2 left side
        o1.x-o1.w/2 < o2.x+o2.w/2 && //o1 left side less than o2 right side
        o1.y+o1.h/2 > o2.y-o2.h/2 && //o1 bottom greater than o2 top
        o1.y-o1.h/2 < o2.y+o2.h/2 //o1 top less than o2 bottom
    ){
        console.log("collision?");
        //shrink on collision
        o1.w+=-1;
        o2.w+=-1;
        o1.h+=-1;
        o2.h+=-1;
        //change colour on collision
        o1.c++;
        o2.c++;
        //increase randomness on collision
        o1.random+= 0.1;
        o2.random+= 0.1;
    }
}
function collision_rect_bounce(o1, o2){
    var differenceX;
    var differenceY;
    if(
        o1.x+o1.w/2 > o2.x-o2.w/2 && //o1 right side greater than o2 left side
        o1.x-o1.w/2 < o2.x+o2.w/2 && //o1 left side less than o2 right side
        o1.y+o1.h/2 > o2.y-o2.h/2 && //o1 bottom greater than o2 top
        o1.y-o1.h/2 < o2.y+o2.h/2 //o1 top less than o2 bottom
    ){
        differenceX = Math.abs(o1.x-o2.x); //difference between o1 and o2 x position
        differenceY = Math.abs(o1.y-o2.y); //difference between y positions
        console.log(differenceX, differenceY);

        if(differenceX > differenceY){ //if x positions difference are further than y positions, bounce away on x
            o1.change.x *= -1; //change direction on collision
            o2.change.x *= -1;

        }else{ //if y positions are greather than x positions, bounce on y
            o1.change.y *= -1;
            o2.change.y *= -1;
        }
    }
}
function collision_rect_stop(o1, o2){
    if(
        o1.x+o1.w/2 > o2.x-o2.w/2 && //o1 right side greater than o2 left side
        o1.x-o1.w/2 < o2.x+o2.w/2 && //o1 left side less than o2 right side
        o1.y+o1.h/2 > o2.y-o2.h/2 && //o1 bottom greater than o2 top
        o1.y-o1.h/2 < o2.y+o2.h/2 //o1 top less than o2 bottom
    ){
        stop(o1,o2);
    }
}
function stop(o1, o2){
    o1.change.x = 0;
    o2.change.x = 0;
    o1.change.y = 0;
    o2.change.y = 0;
}
//canvas functions
function toriod(o){ //wraps s1 around canvas
    if(o.x > canvw){ //if pos x is greater than canvas length set xpos back to 0 (wrap around screen)
        o.x = 0;
    }else if(o.x < 0){ //if less than canvas width, set xpos to max canvas width
        o.x = canvw;
    }else if (o.y > canvh){
        o.y = 0;
    }else if (o.y < 0){
        o.y = canvh;
    }
}
function bounce(o){ //bounces s1 off side of canvas
    if(o.x > canvw || o.x < 0){ //if posx is greater than canvas or less than canvas
        o.change.x *= -1 //multiply by negative one. reverses the number coming in.
        //console.log("bonk");
    }else if(o.y > canvh || o.y < 0){
        o.change.y *= -1 //reverses y value when top or bottom border is hit
        //console.log("bonk");
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
function randi(range){
    var floatResult = Math.random()*range; //gets random # (0-1) and multiplies by range
    var integerResult = Math.floor(floatResult); //result is then rounded down, and integerResult is returned
    return integerResult;
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