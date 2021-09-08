/**write the grid */
function load(){
    document.getElementById("main-grid").innerHTML="";
    for(let i=0; i<400 ;i++){
        document.getElementById("main-grid").innerHTML+=`<div class="cell"></div>`;
    }
    /**drawenemies */
    var t= setInterval(function(){
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
                        if(enemies.length==0){
                            alert("you win");
                            clearInterval(t);
                        }
                    }
                }
            }
            else{
                bullets.splice(i,1);
            }
        }
        if(count%10==0){
            for(let i=0;i<enemies.length;i++){
                drawcell(enemies[i].x,enemies[i].y,enemies[i].kind);
                enemies[i].y+=1;
                if(enemies[i].y==20){
                    clearInterval(t);
                    alert("you lost");   
                }
                drawcell(enemies[i].x,enemies[i].y,enemies[i].kind);
            }
        }
        count++;
    }, 80);
};

/**a function that draw the ship in a cell based on it's kind */
function drawcell(x,y,kind){
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

/**add an eventlistener on the page */
document.addEventListener("keydown",function(event){
    switch (event.code) {
        case 'ArrowLeft':
            if(spaceShip.x>0){
                drawcell(spaceShip.x,spaceShip.y,spaceShip.kind);
                spaceShip.x-=1;
                drawcell(spaceShip.x,spaceShip.y,spaceShip.kind);
            }
            break;  
        case 'ArrowRight':
            if(spaceShip.x<19){
                drawcell(spaceShip.x,spaceShip.y,spaceShip.kind);
                spaceShip.x+=1;
                drawcell(spaceShip.x,spaceShip.y,spaceShip.kind);
            }
            break;
        case 'Space':
            console.log("shot");
            bullets.push(new bullet(spaceShip.x,spaceShip.y-1));
            console.log(bullets);
            break;
        default:
            break;
    }
});

load();
var spaceShip= new starShip(1,18);
var bullets= [];
var enemies= [];
var count=0;
let x=0, y=0;
for(let i=0;i<20;i++){
    if(x>19){
        x-=20;
        y+=2;
    }
    enemies.push(new enemy(x,y,"left"));
    drawcell(enemies[i].x,enemies[i].y,enemies[i].kind);
    x+=2
}
console.log(enemies);
drawcell(spaceShip.x,spaceShip.y,spaceShip.kind);