
// let canvas = document.getElementById('canvas1');
    //flags 
    // let up = false;
    // let right = false;
    // let left = false;

    // let initalX = -1 ;
    // let initalY = 125;

    // let speed = 6;


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

    // function draw(){
    //     if(up){
    //         initalY-=speed;
    //     }
    //     if(left){
    //         initalX-=speed;
    //     }
    //     if(right){
    //         initalX+=speed;
    //     }
    // }
    // window.requestAnimationFrame(draw);


    // let context = canvas.getContext("2d");

    // canvas.width=  250;
   // canvas.height = 180;

    let background = new Image();
    let ramses = new Image();
    let artsyGhost = new Image();

    let scrollSpeed = 5;
    let imgWidth = 250;

    background.src="/backgrounds/Trees.png";
    ramses.src = "/characters/ramsesRight.png";
    artsyGhost.src = "/characters/artsyGhost.png";

    background.onload = function(){
        context.drawImage(background,0,0);
        context.drawImage(ramses,0,0,ramses.width,ramses.height,-1,142,50,40);
        // context.drawImage(artsyGhost,0,0,artsyGhost.width,artsyGhost.height,-1,125,50,60);
                               //0,0 is the position in its own rectangle   //-1 is the space on the left
                                                                            //125 is moving down 
                                                                            //50 and 60 are width and hieght respectively
        //artsyGhost.controller();
    }    

    function getLeft(){return this.x};


    $(document).ready(function(){

        $(document).keydown(function(e){
            //works for ramses that is in the html but not the canvas loaded Ramses
            let position = $("#ramses").offset();
            let min = 0;
            let max = $('#root').width();
            let move_amt = 10;
            let key = e.keyCode;
            if ( key == 37  ){
                console.log("left");
                let newLeft = ((position.left-move_amt < min)?min:position.left-move_amt);
                $("#ramses").attr("src",'/characters/ramsesLeft.png');
                $("#ramses").offset({left:newLeft});
                
            } else if (key == 38){
                console.log("up");
                $("#ramses").animate({ top: "-=10"},0);
            } else if (key == 39){
                console.log("right");
                var newRight = ((position.left+move_amt > max) ? max : position.left+move_amt);
                $("#ramses").attr("src",'/characters/ramsesRight.png');
                $("#ramses").offset({ left: newRight});
            }
            else if (key == 40){
                console.log("down");
                $("#ramses").animate({ top: "+=10"},0);
            }
            else if (key == 32){
                console.log("spacebar?");
               $("#ramses").attr("src",'/characters/ramsesRightJump.png');
               if($("#ramses").animate({top:"-=60"} <= "-=61")){
                $("#ramses").animate({ top: "-=60"},{duration:4},{complete:$("#ramses").attr("src",'/characters/ramsesRightJump.png')});
            };
               //$("#ramses").animate({top:"-=60"},{always:$("#ramses").attr("src",'/characters/ramsesRightJump.png')});

                // $("#ramses").animate({ top: "-=60"},{duration:4},{complete:$("#ramses").attr("src",'/characters/ramsesRightJump.png')});


            }
        });
        $(document).keyup(function(e){
            //works for ramses that is in the html but not the canvas loaded Ramses

            let key = e.keyCode;
            
          if (key == 32){
                console.log("spacebar release?");
               $("#ramses").attr("src",'/characters/ramsesRight.png');
              $("#ramses").animate({top:"+=60"});

                // $("#ramses").animate({ top: "-=60"},{duration:4},{complete:$("#ramses").attr("src",'/characters/ramsesRightJump.png')});


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





