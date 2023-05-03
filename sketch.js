var balloon, balloonImage;
var background, backgroundImage;
var obsTop, obsTop1, obsTop2, topObstacleGroup;
var obsBottom, obsBottom1, obsBottom2, obsBottom3, bottomObstacleGroup;
var bottomGround, topGround;
var jumpSound, dieSound;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var bar, barGroup;
var score = 0;
var restart, gameOver, restartImage, gameOverImage;

function preload(){
    balloonImage = loadAnimation("assets/balloon1.png", "assets/balloon2.png", "assets/balloon3.png");
    backgroundImage = loadImage("assets/bg.png");
    obsTop1 = loadImage("assets/obsTop1.png");
    obsTop2 = loadImage("assets/obsTop2.png");
    obsBottom1 = loadImage("assets/obsBottom1.png");
    obsBottom2 = loadImage("assets/obsBottom2.png");
    obsBottom3 = loadImage("assets/obsBottom3.png");
    jumpSound = loadSound("assets/jump.mp3");
    dieSound = loadSound("assets/die.mp3");
    restartImage = loadImage("assets/restart.png");
    gameOverImage = loadImage("assets/gameOver.png");
}

function setup(){
    createCanvas(1000,800);

    background = createSprite(1000,800, 100,100);
    background.addImage(backgroundImage);
    background.scale = 2.3;

    balloon = createSprite(150, 400, 100,100);
    balloon.addAnimation("balloon", balloonImage); 
    balloon.scale = 0.3; 
    
    bottomGround = createSprite(500,780, 1000, 20);
    bottomGround.visible = false;
    topGround = createSprite(500,10,1000,20);
    topGround.visible = false;

    bottomObstacleGroup = new Group();
    topObstacleGroup = new Group();
    barGroup = new Group();

    gameOver = createSprite(500,300);
    gameOver.addImage(gameOverImage);
    gameOver.scale = 0.8;
    gameOver.visible = false;

    restart = createSprite(500,400)
    restart.addImage(restartImage);
    restart.scale = 0.8;
    restart.visible = false;
}

function draw() {
    if(gameState === PLAY){

        if(keyDown("space")){
            balloon.velocityY = -0.5;
            jumpSound.play();
        }
       // add gravity to code
        balloon.velocityY = balloon.velocityY+0.15;

        spawnObstaclesBottom();
        spawnObstaclesTop();
        Bar();

        if(bottomObstacleGroup.isTouching(balloon)|| topObstacleGroup.isTouching(balloon) || balloon.isTouching(topGround)|| balloon.isTouching(bottomGround)){
            gameState = END;
            dieSound.play();
        }
    }

    if(gameState === END){
        gameOver.visible = true;
        gameOver.depth = gameOver.depth + 1
        restart.visible = true;
        restart.depth = restart.depth + 1

        //all sprites should stop moving
        balloon.velocityX = 0;
        balloon.velocityY = 0;
        bottomObstacleGroup.setVelocityXEach(0);
        topObstacleGroup.setVelocityXEach(0);
        barGroup.setVelocityXEach(0);

        //setting life time to obstacles
        topObstacleGroup.setLifetimeEach(-1);
        bottomObstacleGroup.setLifetimeEach(-1);
        balloon.y = 200;

        if(mousePressedOver(restart)){
            reset();
        }
    }

  drawSprites();
  Score();
}

function reset(){
    gameState = PLAY;
    gameOver.visible = false;
    restart.visible = false;
    topObstacleGroup.destroyEach();
    bottomObstacleGroup.destroyEach();
    score = 0;
}

function spawnObstaclesBottom(){
    if(frameCount % 60 === 0){
        obsBottom = createSprite(1050,400,50,50);
        obsBottom.velocityX = -4;
        obsBottom.y = Math.round(random(500,750));
        var rand = Math.round(random(1,3));
            switch(rand){
                case 1: obsBottom.addImage(obsBottom1);
                        break;
                case 2: obsBottom.addImage(obsBottom2);
                        break;
                case 3: obsBottom.addImage(obsBottom3);
                        break;
                default : break;
            }
        obsBottom.scale = 0.15;

       
        balloon.depth = obsBottom.depth;
        balloon.depth = balloon.depth + 1;
        obsBottom.lifeTime = 100;
        bottomObstacleGroup.add(obsBottom);
    }
}

function spawnObstaclesTop(){
    if(frameCount % 60 === 0){
        obsTop = createSprite(1050, 200, 50, 50);
        obsTop.velocityX = -5;
        obsTop.y = Math.round(random(50,200));
        var rand = Math.round(random(1,2));
            switch(rand){
                case 1: obsTop.addImage(obsTop1);
                    break;
                case 2: obsTop.addImage(obsTop2);
                    break;
                default : break;
            }
            obsTop.scale = 0.15
            balloon.depth = obsTop.depth;
            balloon.depth = balloon.depth+1;
            obsTop.lifeTime = 100;
            topObstacleGroup.add(obsTop);

    }
}

function Bar(){
    if(frameCount % 60 === 0){
        bar = createSprite(900,300,10,80);
        bar.velocityX = -4;
        bar.depth = balloon.depth;
        bar.visible = false;
        barGroup.add(bar);
    }
}

function Score(){
    if(balloon.isTouching(barGroup)){
         score = score + 1;
    }
    textFont("algerian");
    textSize(30);
    fill("yellow");
    text("score: " + score, 850,80)
}