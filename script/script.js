const spaceShip= new starShip(9,19);
const bullets= [];
const enemies= [];
let t,gameStart=false;
let wave=false;
let x=0, y=0, count=0, score=0, difficoult=100;

/**objects */
//starship
function starShip(x,y){
    this.x=x;
    this.y=y;
    this.kind="starShip";
}
//bullet
function bullet(x,y){
    this.x=x;
    this.y=y;
    this.kind="bullet";
}
//enemy
function enemy(x,y,oscillation){
    this.x=x;
    this.y=y;
    this.kind="enemy";
}

/**endgame */
const endGame =()=>{
    clearInterval(t);
    document.getElementsByClassName("info")[0].innerHTML="";
    document.getElementById("score").parentElement.classList.add("backgroundRed");
    document.getElementById("score").classList.add("backgroundRed");
    document.getElementById("main-grid").innerHTML=`<div class="underlay"><button id="reload">Rigioca!</button></div>`;
    document.getElementById("reload").addEventListener("click",()=>location.reload());
}

/**gameplay function */
const gamePlay= () => {
    for(let i=0;i<bullets.length;i++){
        drawcell(bullets[i].x,bullets[i].y,bullets[i].kind);
        if(bullets[i].y==spaceShip.y-2){
            drawcell(bullets[i].x,bullets[i].y+1,bullets[i].kind);
        }
        if(bullets[i].y!=0){
            bullets[i].y-=1;
            drawcell(bullets[i].x,bullets[i].y,bullets[i].kind);
            for(let t=0;t<enemies.length;t++){
                if(bullets[i].x==enemies[t].x&&bullets[i].y==enemies[t].y){
                    drawcell(bullets[i].x,bullets[i].y,);
                    enemies.splice(t,1);
                    bullets.splice(i,1);
                    score++;
                    document.getElementById("score").innerHTML=score;
                    if(enemies.length==0){
                        // alert("you win");
                        difficoult-=10;
                        clearInterval(t);
                        reloadGameplay();
                    }
                }
            }
        }
        else{
            bullets.splice(i,1);
        }
    }
    if(count%5==0 && count%10!=0){
        if(enemies[0].x%2==0){
            for(let i=0;i<enemies.length;i++){
                drawcell(enemies[i].x,enemies[i].y,enemies[i].kind);
                enemies[i].x+=1;
                if(enemies[i].y==20){
                    endGame();
                }
                drawcell(enemies[i].x,enemies[i].y,enemies[i].kind);
                wave=true;
            }
        }else{
            for(let i=0;i<enemies.length;i++){
                drawcell(enemies[i].x,enemies[i].y,enemies[i].kind);
                enemies[i].x-=1;
                if(enemies[i].y==20){
                    endGame();
                }
                drawcell(enemies[i].x,enemies[i].y,enemies[i].kind);
            }
            wave=false;
        }
    }
    if(count%10==0){
        for(let i=0;i<enemies.length;i++){
            drawcell(enemies[i].x,enemies[i].y,enemies[i].kind);
            enemies[i].y+=1;
            if(enemies[i].y==20){
                endGame();
            }
            drawcell(enemies[i].x,enemies[i].y,enemies[i].kind);
        }
    }
    count++;
}

/**load the gameframe */
const load = () => {
    document.getElementById("main-grid").innerHTML="";
    for(let i=0; i<400 ;i++){
        document.getElementById("main-grid").innerHTML+=`<div class="cell"></div>`;
    }
}

/**load spaceships  and start the game*/
const loadGameplay = ()=>{
    for(let i=0;i<20;i++){
        if(x>19){
            x-=20;
            y+=2;
        }
        enemies.push(new enemy(x,y,"left"));
        drawcell(enemies[i].x,enemies[i].y,enemies[i].kind);
        x+=2
    }
    drawcell(spaceShip.x,spaceShip.y,spaceShip.kind);
    t = setInterval(function(){
        gamePlay();
    }, difficoult);
}

const reloadGameplay = ()=>{
    let y=0,x=0;
    for(let i=0;i<20;i++){
        if(x>19){
            x-=20;
            y+=2;
        }
        enemies.push(new enemy(x,y,"left"));
        drawcell(enemies[i].x,enemies[i].y,enemies[i].kind);
        x+=2;
    }
    t = setInterval(function(){
        gamePlay();
    }, difficoult);
}

/**a function that draw the ship in a cell based on it's kind */
const drawcell = (x,y,kind)=>{
    let cell=y*20+x;
    switch (kind){
        case "starShip":
            document.getElementsByClassName("cell")[cell].classList.toggle("starship");
            break;
        case "bullet":
            document.getElementsByClassName("cell")[cell].classList.toggle("bullet");
            break;
        case "enemy":
            document.getElementsByClassName("cell")[cell].classList.toggle("enemy");
            break;
        default:
            document.getElementsByClassName("cell")[cell].classList.value="cell";
            break;
    }
}

/**add an eventlistener on the page */
document.addEventListener("keydown",function(event){
    switch (event.code) {
        case 'ArrowLeft'://if i press arrowleft
            if(spaceShip.x>0){
                drawcell(spaceShip.x,spaceShip.y,spaceShip.kind);//delete last spaceship position
                spaceShip.x-=1;
                drawcell(spaceShip.x,spaceShip.y,spaceShip.kind);//draw new spaceship position
            }
            break;  
        case 'ArrowRight':
            if(spaceShip.x<19){
                drawcell(spaceShip.x,spaceShip.y,spaceShip.kind);//delete last spaceship position
                spaceShip.x+=1;
                drawcell(spaceShip.x,spaceShip.y,spaceShip.kind);//draw last spaceship position
            }
            break;
        case 'Space':
            bullets.push(new bullet(spaceShip.x,spaceShip.y-1));//push an object bullet in the bullets array
            break;
        default:
            break;
    }
});

/**add event listener to button start */
document.getElementById("start").addEventListener("click", function(){
    if(gameStart==false){
        // document.getElementById("start").innerHTML="";
        document.getElementById("start").classList.add("d-none");
        load();
        loadGameplay();
        var audio = new Audio('media/Doom_OST.mp3');
        audio.play();
        gameStart=true;//i don't let the button be clicked multiple times because if i don't it would start a new game pressing space
    }
});


