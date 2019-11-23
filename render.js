
let canvas = document.getElementById('canvas1');
    //flags 
    let up = false;
    let right = false;
    let left = false;

    let initalX = -1 ;
    let initalY = 125;

    let speed = 6;


    // canvas.addEventListener('keydown',function(event){
    //     event.preventDefault();
    //     console.log(event.key,event.keyCode);
    //     if(event.keyCode === 38){
    //         up = true;
    //     }
    //     if(event.keyCode === 39){
    //         right = true;
    //     }
    //     if(event.keyCode === 37){
    //         left = true;
    //     }
    // });

    
    // canvas.addEventListener('keyup',function(event){
    //     event.preventDefault();
    //     console.log(event.key,event.keyCode);
    //     if(event.keyCode === 38){
    //         up = false;
    //     }
    //     if(event.keyCode === 39){
    //         right = false;
    //     }
    //     if(event.keyCode === 37){
    //         left = false;
    //     }
    // });

    function draw(){
        if(up){
            initalY-=speed;
        }
        if(left){
            initalX-=speed;
        }
        if(right){
            initalX+=speed;
        }
    }
    window.requestAnimationFrame(draw);


    let context = canvas.getContext("2d");

    canvas.width=  250;
    canvas.height = 180;

    let background = new Image();
    let ramses = new Image();
    let artsyGhost = new Image();

    let scrollSpeed = 5;
    let imgWidth = 250;

    background.src="/backgrounds/Trees.png";
    ramses.src = "/characters/ramses.png";
    artsyGhost.src = "/characters/artsyGhost.png";

    background.onload = function(){
        context.drawImage(background,0,0);
        // context.drawImage(ramses,100,100);
        context.drawImage(artsyGhost,0,0,artsyGhost.width,artsyGhost.height,-1,125,50,60);
                               //0,0 is the position in its own rectangle   //-1 is the space on the left
                                                                            //125 is moving down 
                                                                            //50 and 60 are width and hieght respectively
        //artsyGhost.controller();
    }
    canvas.focus();
    

    $(document).ready(function(){

        $(document).keydown(function(e){
            var key = e.keyCode;
            if ( key == 37  ){
                left = true;
                console.log("left");
                artsyGhost.style.left = parseInt(artsyGhost.style.left) - 5;
            } else if (key == 38){
                up = true;
                console.log("up");
            } else if (key == 39){
                right = true;
                console.log("right");
            }
        });
        
    });

 

    //* this loop function moves the trees as a weird staggard image --> correct direection but wrong implementation
      //  also we want to change it so it moves on a move not just an animation */
      
    // function loop(){
    //     context.drawImage(background,imgWidth,0);
    //     context.drawImage(background,imgWidth-canvas.width,0);

    //     imgWidth += scrollSpeed;
    //    // if(move == right){
    //     if(imgWidth == canvas.width)
    //         imgWidth = 0;
    //         window.requestAnimationFrame(loop); 
    //   //  }
    // }
    // loop();





