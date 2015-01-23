//http://examples.phaser.io/

/* main_app */

var game = new Phaser.Game(960, 640, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var dudeW = 231.949; dudeH = 202.023; //agrego

var vivo = false; //agrego

var pantalla = ["cargando","inicio","juego","gameOver", "pausa"];
var vista = "juego"; //VISTA INICIO


function preload() {

    game.load.image('sky', 'assets/background.png');
    game.load.image('cloud', 'assets/cloud.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', dudeW, dudeH);

}

var player;
var platforms;
var cursors;

var stars;
var score = 0;
var scoreText;

function create() {



    game.add.tileSprite(0, 0, 1920, 1920, 'sky');

    game.world.setBounds(0, 0, 1920, 1920); //EL PLANO QUE MUESTRA AL PRINCIPIO

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    game.add.sprite(250, 50, 'cloud');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground / platforms
    var ground = platforms.create(0, game.world.height - 50, 'ground'); 

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(0, 0);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    /* OBSTACULOS */

    //  Now let's create two ledges

    var ledge = platforms.create(150, 700, 'ground');
    ledge.body.immovable = true;


    ledge[0] = platforms.create(Math.floor((Math.random() * 1100) + 150), Math.floor((Math.random() * 900) + 700), 'ground');
    ledge[0].body.immovable = true;

    ledge[1] = platforms.create(Math.floor((Math.random() * 1100) + 150), Math.floor((Math.random() * 900) + 700), 'ground');
    ledge[1].body.immovable = true;

    ledge[2] = platforms.create(Math.floor((Math.random() * 1100) + 150), Math.floor((Math.random() * 900) + 700), 'ground');
    ledge[2].body.immovable = true;

    ledge[3] = platforms.create(Math.floor((Math.random() * 1100) + 150), Math.floor((Math.random() * 900) + 700), 'ground');
    ledge[3].body.immovable = true;

    ledge[4] = platforms.create(Math.floor((Math.random() * 1100) + 150), Math.floor((Math.random() * 900) + 700), 'ground');
    ledge[4].body.immovable = true;

    ledge[5] = platforms.create(Math.floor((Math.random() * 1100) + 150), Math.floor((Math.random() * 900) + 700), 'ground');
    ledge[5].body.immovable = true;

    ledge[6] = platforms.create(Math.floor((Math.random() * 1100) + 150), Math.floor((Math.random() * 900) + 700), 'ground');
    ledge[6].body.immovable = true;

    ledge[7] = platforms.create(Math.floor((Math.random() * 1100) + 150), Math.floor((Math.random() * 900) + 700), 'ground');
    ledge[7].body.immovable = true;

    ledge[8] = platforms.create(Math.floor((Math.random() * 1100) + 150), Math.floor((Math.random() * 900) + 700), 'ground');
    ledge[8].body.immovable = true;

    /* FIN OBSTACULOS */


   // The player and its settings
    player = game.add.sprite(dudeW, dudeH, 'dude');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    //player.animations.add('left', [0, 1, 2, 3,4], 20, true);
    player.animations.add('right', [0, 1, 2, 3,4], 20, true);

    //  Finally some stars to collect
    stars = game.add.group();

    //  We will enable physics for any star that is created in this group
    stars.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = stars.create(i * 70, 0, 'star');

        //  Let gravity do its thing
        star.body.gravity.y = 300;

        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

    //  The score
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();

    game.camera.follow(player);

    
}   


function update() {

    /* PANTALLAS */
    switch(vista) {
    case pantalla[0]:
        i = 0;
        document.write("cargando");
        //llamo a un archivo js
        break;
    case pantalla[1]:

        document.write("inicio");
        //llamo a archivo js
        break;
    case pantalla[2]:
        vivo = true;
        //llamo a archivo js
        break;
    case pantalla[3]:

        document.write("gameOver");
        //llamo a archivo js
        break;
    case pantalla[4]:

        document.write("pausa");
        //llamo a archivo js
        break;
        
} 
    /* FIN PANTALLAS */

    if(vivo){

    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    game.physics.arcade.overlap(player, stars, collectStar, null, this);

    //  Reset the players velocity (movement)
    //player.body.velocity.x = 0;

    player.body.velocity.x = 300;
    player.animations.play('right');

    }


    if (cursors.left.isDown)
    {
        //  Move to the left
        //player.body.velocity.x = -150;


        //player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {

        //  Move to the right
        //player.body.velocity.x = 200;

        //player.animations.play('right');
    }
    else
    {
        //  Stand still
        //player.animations.stop();

        //PERSONAJE DE FRENTE: FRAME 4
        //player.frame = 4;
        //player.frame = 1;
    }
    
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350; //ALTURA / VELOCIDAD DEL SALTO

    }



}

function collectStar (player, star) {
    
    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;

}

function render() {

    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(player, 32, 500);

}

/* fin main_app */