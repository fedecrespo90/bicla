/* 
DOCUMENTACION LOCAL:

file:///var/www/html/phaser-master/docs/index.html

 */


var dudeW = 231.949; dudeH = 202.023;
var game = new Phaser.Game(960, 640, Phaser.AUTO, '', { preload: preload, create: create, update: update });



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

    //  Now let's create two ledges
    var ledge = platforms.create(600, 300, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(150, 430, 'ground');
    ledge.body.immovable = true;

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
    
}

function update() {

    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    game.physics.arcade.overlap(player, stars, collectStar, null, this);

    //  Reset the players velocity (movement)
    //player.body.velocity.x = 0;

    player.body.velocity.x = 200;
    player.animations.play('right');


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
        player.body.velocity.y = -350;
    }

}

function collectStar (player, star) {
    
    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;

}