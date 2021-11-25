const spaceShip= new starShip(9,19);
const bullets= [], ufoBullets= [];
const enemies= [];
let enemyShot="";//i save here the array index for the enemy who is shooting
let t,gameStart=false;
let wave=false;
let x=0, y=0, count=0, score=0, difficoult=100, autofire=false;

const randomMinMax = (min,max) => (Math.floor(Math.random()*(max-min)+min));

/**objects */
//starship
function starShip(x,y){
    this.x=x;
    this.y=y;
    this.kind="starShip";
    this.collided = () => enemies.some((element) => (element.x==this.x && element.y==this.y))||ufoBullets.some((element) => (element.x==this.x && element.y==this.y));
}
//bullet
function bullet(x,y){
    this.x=x;
    this.y=y;
    this.kind="bullet";
}
//enemy
function enemy(x,y){
    this.x=x;
    this.y=y;
    this.kind="enemy";
    this.collided = () => {return(this.x==spaceShip.x && this.y==spaceShip.y)};
}
function ufoBullet(x,y){
    this.x=x;
    this.y=y;
    this.kind="ufoBullet";
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

    //with autofire add a bullet per round
    if(autofire==true){
        bullets.push(new bullet(spaceShip.x,spaceShip.y-1));
    }

    //check if the enemy hit us and moves the projectiles
    if(count%5){
        ufoBullets.forEach((element,index,array)=>{
            drawcell(element.x,element.y,element.kind,"remove");//delete the bullet last position
            if(element.y!=19){
                element.y+=1;
                drawcell(element.x,element.y,element.kind,"add");//draw bullet new position
                if(spaceShip.collided()){
                    endGame();
                }
            }else{
                array.splice(index,1);
            }
        });
    }

    //check if we hit the enemy
    for(let i=0;i<bullets.length;i++){
        drawcell(bullets[i].x,bullets[i].y,bullets[i].kind,"remove");
        if(bullets[i].y!=0){
            bullets[i].y-=1;
            drawcell(bullets[i].x,bullets[i].y,bullets[i].kind,"add");
            for(let t=0;t<enemies.length;t++){
                if(bullets[i].x==enemies[t].x&&bullets[i].y==enemies[t].y){
                    drawcell(bullets[i].x,bullets[i].y,bullets[i].kind,"remove");
                    drawcell(enemies[t].x,enemies[t].y,enemies[t].kind,"remove");
                    enemies.splice(t,1);
                    bullets.splice(i,1);
                    score++;
                    document.getElementById("score").innerHTML=score;
                    if(enemies.length==0){
                        if(difficoult>60){
                            difficoult-=10;
                        }
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

    if(count%5==0 && count%10!=0){//conditions for zig zag moving
        if(enemies[0].x%2==0){
            for(let i=0;i<enemies.length;i++){
                drawcell(enemies[i].x,enemies[i].y,enemies[i].kind,"remove");//delete old ufo position
                enemies[i].x+=1;
                if(enemies[i].y==20){//check if the ufo reached the bottom line
                    endGame();
                }
                if(enemies[i].collided()){endGame();}//check if the ship impact an enemy
                drawcell(enemies[i].x,enemies[i].y,enemies[i].kind,"add");//draw new ufo position
                wave=true;
            }
        }else{
            for(let i=0;i<enemies.length;i++){
                drawcell(enemies[i].x,enemies[i].y,enemies[i].kind,"remove");//delete old ufo position
                enemies[i].x-=1;
                if(enemies[i].y==20){//check if the ufo reached the bottom line
                    endGame();
                }
                if(enemies[i].collided()){endGame();}//check if the ship impact an enemy
                drawcell(enemies[i].x,enemies[i].y,enemies[i].kind,"add");//draw new ufo position
            }
            wave=false;
        }
    }

    if(count%10==0){
        for(let i=0;i<enemies.length;i++){
            drawcell(enemies[i].x,enemies[i].y,enemies[i].kind,"remove");//delete old ufo position
            enemies[i].y+=1;
            if(enemies[i].y==20){//check if the ufo reached the bottom line
                endGame();
            }
            if(enemies[i].collided()){endGame();}//check if the ship impact an enemy
            drawcell(enemies[i].x,enemies[i].y,enemies[i].kind,"add");//draw new ufo position
        }
    }

    //check if the ufo is shooting and add the bullet
    if((randomMinMax(1,1000) / enemies.length) < 5){
        // alert(enemies.length);
        enemyShot=randomMinMax(0,(enemies.length+1));
        ufoBullets.push(new ufoBullet(enemies[enemyShot].x, enemies[enemyShot].y));
        enemyShot="";
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
        enemies.push(new enemy(x,y,"enemy"));
        drawcell(enemies[i].x,enemies[i].y,enemies[i].kind,"add");
        x+=2;
    }
    drawcell(spaceShip.x,spaceShip.y,spaceShip.kind,"add");
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
const drawcell = (x,y,kind,addRemove)=>{
    let cell=y*20+x;
    switch (kind){
        case "starShip":
            if(addRemove=="remove"){
                document.getElementsByClassName("cell")[cell].classList.value="cell";  
            }else if(addRemove=="add"){
                document.getElementsByClassName("cell")[cell].classList.add("starship");
            }
            break;
        case "bullet":
            if(addRemove=="remove"){
                document.getElementsByClassName("cell")[cell].classList.value="cell";
            }else if(addRemove=="add"){
                document.getElementsByClassName("cell")[cell].classList.add("bullet");
            }
            break;
        case "ufoBullet":
            if(addRemove=="remove"){
                document.getElementsByClassName("cell")[cell].classList.value="cell";
            }else if(addRemove=="add"){
                document.getElementsByClassName("cell")[cell].classList.add("ufoBullet");
            }
            break;
        case "enemy":
            if(addRemove=="remove"){
                document.getElementsByClassName("cell")[cell].classList.value="cell";
            }else if(addRemove=="add"){
                document.getElementsByClassName("cell")[cell].classList.add("enemy");
            }
            break;
        default:
            document.getElementsByClassName("cell")[cell].classList.value="cell";
            break;
    }
}

/**add an eventlistener on the page */
document.addEventListener("keydown",function(event){
    console.log(event.code);
    switch (event.code) {
        case 'ArrowLeft'://if i press arrowleft
            if(spaceShip.x>0){
                drawcell(spaceShip.x,spaceShip.y,spaceShip.kind,"remove");//delete last spaceship position
                spaceShip.x-=1;
                if(spaceShip.collided()){endGame();}//check ships collision
                drawcell(spaceShip.x,spaceShip.y,spaceShip.kind,"add");//draw new spaceship position
            }
            break;  
        case 'ArrowRight':
            if(spaceShip.x<19){
                drawcell(spaceShip.x,spaceShip.y,spaceShip.kind,"remove");//delete last spaceship position
                spaceShip.x+=1;
                if(spaceShip.collided()){endGame();}//check ships collision
                drawcell(spaceShip.x,spaceShip.y,spaceShip.kind,"add");//draw new spaceship position
            }
            break;
        case 'ArrowUp'://if i press arrowleft
            if(spaceShip.y>0){
                drawcell(spaceShip.x,spaceShip.y,spaceShip.kind,"remove");//delete last spaceship position
                spaceShip.y-=1;
                if(spaceShip.collided()){endGame();}//check ships collision
                drawcell(spaceShip.x,spaceShip.y,spaceShip.kind,"add");//draw new spaceship position
            }
            break;  
        case 'ArrowDown':
            if(spaceShip.y<19){
                drawcell(spaceShip.x,spaceShip.y,spaceShip.kind,"remove");//delete last spaceship position
                spaceShip.y+=1;
                if(spaceShip.collided()){endGame();}//check ships collision
                drawcell(spaceShip.x,spaceShip.y,spaceShip.kind,"add");//draw new spaceship position
            }
            break;
        case 'Space':
            if(autofire==false){
                bullets.push(new bullet(spaceShip.x,spaceShip.y-1,"add"));//push an object bullet in the bullets array
            }
            break;
        case 'KeyF':
            autofire=true;
            break;
        default:
            break;
    }
});

/**add event listener to button start */
document.getElementById("start").addEventListener("click", function(){
    if(gameStart==false){
        document.getElementById("start").classList.add("d-none");
        load();
        loadGameplay();
        var audio = new Audio('media/Doom_OST.mp3');
        // audio.play();
        gameStart=true;//i don't let the button be clicked multiple times because if i don't it would start a new game pressing space
    }
});