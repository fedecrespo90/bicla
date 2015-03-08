(function ($) {
// define variables
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var player, score, stop, ticker;
/*VARIABLES NORMAL*/
var ground = [], water = [];
/*VARIABLES ENEMIGOS Y SUSTANCIAS*/
var enemies = [], environment = [], sustancias = []; //enemies = policia ; environment = sustancias 



var Al, Fa, Pe, Me;

Al=false;
Fa=false;
Pe=false;
Me=false;

/*FIN DECLARO ARRAYS Y BOOLEANAS DE CADA SUSTANCIA*/

// platform variables
var platformHeight, platformLength, gapLength;
var platformWidth = 32;
var platformBase = canvas.height - platformWidth;  // bottom row of the game
var platformSpacer = 64;

var canUseLocalStorage = 'localStorage' in window && window.localStorage !== null;
var playSound;

// set the sound preference
if (canUseLocalStorage) {
  playSound = (localStorage.getItem('kandi.playSound') === "true")

  if (playSound) {
    $('.sound').addClass('sound-on').removeClass('sound-off');
  }
  else {
    $('.sound').addClass('sound-off').removeClass('sound-on');
  }
}

/**
 * Get a random number between range
 * @param {integer}
 * @param {integer}
 */
function rand(low, high) {
  return Math.floor( Math.random() * (high - low + 1) + low );
}

/**
 * Bound a number between range
 * @param {integer} num - Number to bound
 * @param {integer}
 * @param {integer}
 */
function bound(num, low, high) {
  return Math.max( Math.min(num, high), low);
}

/**
 * Asset pre-loader object. Loads all images
 */
var assetLoader = (function() {
  // images dictionary
  this.imgs        = {

    /* Normal */
    'bg'            : 'imgs/bg.png',
    'sky'           : 'imgs/sky.png',
    'backdrop'      : 'imgs/backdrop.png',
    'backdrop2'     : 'imgs/backdrop_ground.png',
    'grass'         : 'imgs/grass.png',
    'avatar_normal' : 'imgs/normal_walk.png',
    'water'         : 'imgs/water.png',
    'grass1'        : 'imgs/grassMid1.png',
    'grass2'        : 'imgs/grassMid2.png',
    'bridge'        : 'imgs/bridge.png',
    'plant'         : 'imgs/plant.png',
    'bush1'         : 'imgs/bush1.png',
    'bush2'         : 'imgs/bush2.png',
    'cliff'         : 'imgs/grassCliffRight.png',
    'spikes'        : 'imgs/spikes.png',
    'box'           : 'imgs/boxCoin.png',
    'slime'         : 'imgs/slime.png',
    'slimeFa'         : 'imgs/slimeFa.png',
    'slimePe'         : 'imgs/slimePe.png',
    'slimeMe'         : 'imgs/slimeMe.png',
    /*FIN  Normal */

    /* Al */
    'bgAl'            : 'imgs/al/bg.png',
    'skyAl'           : 'imgs/al/sky.png',
    'backdropAl'      : 'imgs/al/backdrop.png',
    'backdrop2Al'     : 'imgs/al/backdrop_ground.png',
    'grassAl'         : 'imgs/al/grass.png',
    'waterAl'         : 'imgs/al/water.png',
    'grass1Al'        : 'imgs/al/grassMid1.png',
    'grass2Al'        : 'imgs/al/grassMid2.png',
    'bridgeAl'        : 'imgs/al/bridge.png',
    'plantAl'         : 'imgs/al/plant.png',
    'bush1Al'         : 'imgs/al/bush1.png',
    'bush2Al'         : 'imgs/al/bush2.png',
    'cliffAl'         : 'imgs/al/grassCliffRight.png',
    'boxAl'           : 'imgs/al/boxCoin.png',
    /* FIN Al */

    /* Fa */
    'bgFa'            : 'imgs/fa/bg.png',
    'skyFa'           : 'imgs/fa/sky.png',
    'backdropFa'      : 'imgs/fa/backdrop.png',
    'backdrop2Fa'     : 'imgs/fa/backdrop_ground.png',
    'grassFa'         : 'imgs/fa/grass.png',
    'waterFa'         : 'imgs/fa/water.png',
    'grass1Fa'        : 'imgs/fa/grassMid1.png',
    'grass2Fa'        : 'imgs/fa/grassMid2.png',
    'bridgeFa'        : 'imgs/fa/bridge.png',
    'plantFa'         : 'imgs/fa/plant.png',
    'bush1Fa'         : 'imgs/fa/bush1.png',
    'bush2Fa'         : 'imgs/fa/bush2.png',
    'cliffFa'         : 'imgs/fa/grassCliffRight.png',
    'boxFa'           : 'imgs/fa/boxCoin.png',
    /* FIN Fa */

    /* Pe */
    'bgPe'            : 'imgs/pe/bg.png',
    'skyPe'           : 'imgs/pe/sky.png',
    'backdropPe'      : 'imgs/pe/backdrop.png',
    'backdrop2Pe'     : 'imgs/pe/backdrop_ground.png',
    'grassPe'         : 'imgs/pe/grass.png',
    'waterPe'         : 'imgs/pe/water.png',
    'grass1Pe'        : 'imgs/pe/grassMid1.png',
    'grass2Pe'        : 'imgs/pe/grassMid2.png',
    'bridgePe'        : 'imgs/pe/bridge.png',
    'plantPe'         : 'imgs/pe/plant.png',
    'bush1Pe'         : 'imgs/pe/bush1.png',
    'bush2Pe'         : 'imgs/pe/bush2.png',
    'cliffPe'         : 'imgs/pe/grassCliffRight.png',
    'boxPe'           : 'imgs/pe/boxCoin.png',
    /* FIN Pe */

    /* Me */
    'bgMe'            : 'imgs/me/bg.png',
    'skyMe'           : 'imgs/me/sky.png',
    'backdropMe'      : 'imgs/me/backdrop.png',
    'backdrop2Me'     : 'imgs/me/backdrop_ground.png',
    'grassMe'         : 'imgs/me/grass.png',
    'waterMe'         : 'imgs/me/water.png',
    'grass1Me'        : 'imgs/me/grassMid1.png',
    'grass2Me'        : 'imgs/me/grassMid2.png',
    'bridgeMe'        : 'imgs/me/bridge.png',
    'plantMe'         : 'imgs/me/plant.png',
    'bush1Me'         : 'imgs/me/bush1.png',
    'bush2Me'         : 'imgs/me/bush2.png',
    'cliffMe'         : 'imgs/me/grassCliffRight.png',
    'boxMe'           : 'imgs/me/boxCoin.png'
    /* FIN Me */
  };

  // sounds dictionary
  this.sounds      = {
    'bg'            : 'sounds/bg.mp3',
    'jump'          : 'sounds/jump.mp3',
    'gameOver'      : 'sounds/gameOver.mp3',

    'bgAl'            : 'sounds/bgAl.mp3'
  };

  var assetsLoaded = 0;                                // how many assets have been loaded
  var numImgs      = Object.keys(this.imgs).length;    // total number of image assets
  var numSounds    = Object.keys(this.sounds).length;  // total number of sound assets
  this.totalAssest = numImgs;                          // total number of assets


  /**
   * Ensure all assets are loaded before using them
   * @param {number} dic  - Dictionary name ('imgs', 'sounds', 'fonts')
   * @param {number} name - Asset name in the dictionary
   */
  function assetLoaded(dic, name) {
    // don't count assets that have already loaded
    if (this[dic][name].status !== 'loading') {
      return;
    }

    this[dic][name].status = 'loaded';
    assetsLoaded++;

    // progress callback
    if (typeof this.progress === 'function') {
      this.progress(assetsLoaded, this.totalAssest);
    }

    // finished callback
    if (assetsLoaded === this.totalAssest && typeof this.finished === 'function') {
      this.finished();
    }
  }

  /**
   * Check the ready state of an Audio file.
   * @param {object} sound - Name of the audio asset that was loaded.
   */
  function _checkAudioState(sound) {
    if (this.sounds[sound].status === 'loading' && this.sounds[sound].readyState === 4) {
      assetLoaded.call(this, 'sounds', sound);
    }
  }

  /**
   * Create assets, set callback for asset loading, set asset source
   */
  this.downloadAll = function() {
    var _this = this;
    var src;

    // load images
    for (var img in this.imgs) {
      if (this.imgs.hasOwnProperty(img)) {
        src = this.imgs[img];

        // create a closure for event binding
        (function(_this, img) {
          _this.imgs[img] = new Image();
          _this.imgs[img].status = 'loading';
          _this.imgs[img].name = img;
          _this.imgs[img].onload = function() { assetLoaded.call(_this, 'imgs', img) };
          _this.imgs[img].src = src;
        })(_this, img);
      }
    }

    // load sounds
    for (var sound in this.sounds) {
      if (this.sounds.hasOwnProperty(sound)) {
        src = this.sounds[sound];

        // create a closure for event binding
        (function(_this, sound) {
          _this.sounds[sound] = new Audio();
          _this.sounds[sound].status = 'loading';
          _this.sounds[sound].name = sound;
          _this.sounds[sound].addEventListener('canplay', function() {
            _checkAudioState.call(_this, sound);
          });
          _this.sounds[sound].src = src;
          _this.sounds[sound].preload = 'auto';
          _this.sounds[sound].load();
        })(_this, sound);
      }
    }
  }

  return {
    imgs: this.imgs,
    sounds: this.sounds,
    totalAssest: this.totalAssest,
    downloadAll: this.downloadAll
  };
})();

/**
 * Show asset loading progress
 * @param {integer} progress - Number of assets loaded
 * @param {integer} total - Total number of assets
 */
assetLoader.progress = function(progress, total) {
  var pBar = document.getElementById('progress-bar');
  pBar.value = progress / total;
  document.getElementById('p').innerHTML = Math.round(pBar.value * 100) + "%";
}

/**
 * Load the main menu
 */
assetLoader.finished = function() {
  mainMenu();
}

/**
 * Creates a Spritesheet
 * @param {string} - Path to the image.
 * @param {number} - Width (in px) of each frame.
 * @param {number} - Height (in px) of each frame.
 */
function SpriteSheet(path, frameWidth, frameHeight) {
  this.image = new Image();
  this.frameWidth = frameWidth;
  this.frameHeight = frameHeight;

  // calculate the number of frames in a row after the image loads
  var self = this;
  this.image.onload = function() {
    self.framesPerRow = Math.floor(self.image.width / self.frameWidth);
  };

  this.image.src = path;
}

/**
 * Creates an animation from a spritesheet.
 * @param {SpriteSheet} - The spritesheet used to create the animation.
 * @param {number}      - Number of frames to wait for before transitioning the animation.
 * @param {array}       - Range or sequence of frame numbers for the animation.
 * @param {boolean}     - Repeat the animation once completed.
 */
function Animation(spritesheet, frameSpeed, startFrame, endFrame) {

  var animationSequence = [];  // array holding the order of the animation
  var currentFrame = 0;        // the current frame to draw
  var counter = 0;             // keep track of frame rate

  // start and end range for frames
  for (var frameNumber = startFrame; frameNumber <= endFrame; frameNumber++)
    animationSequence.push(frameNumber);

  /**
   * Update the animation
   */
  this.update = function() {

    // update to the next frame if it is time
    if (counter == (frameSpeed - 1))
      currentFrame = (currentFrame + 1) % animationSequence.length;

    // update the counter
    counter = (counter + 1) % frameSpeed;
  };

  /**
   * Draw the current frame
   * @param {integer} x - X position to draw
   * @param {integer} y - Y position to draw
   */
  this.draw = function(x, y) {
    // get the row and col of the frame
    var row = Math.floor(animationSequence[currentFrame] / spritesheet.framesPerRow);
    var col = Math.floor(animationSequence[currentFrame] % spritesheet.framesPerRow);

    ctx.drawImage(
      spritesheet.image,
      col * spritesheet.frameWidth, row * spritesheet.frameHeight,
      spritesheet.frameWidth, spritesheet.frameHeight,
      x, y,
      spritesheet.frameWidth, spritesheet.frameHeight);
  };
}

/**
 * Create a parallax background
 */
var background = (function() {
  var sky   = {};

  var skyAl   = {};
  
  var backdrop = {};
  var backdrop2 = {};

  var backdropAl = {};
  var backdrop2Al = {};

  /**
   * Draw the backgrounds to the screen at different speeds
   */
  this.draw = function() {

    // draw images side by side to loop
    if(Al){
      skyAl.x -= skyAl.speed;

      backdropAl.x -= backdropAl.speed;
      backdrop2Al.x -= backdrop2Al.speed;

      ctx.drawImage(assetLoader.imgs.bg, 0, 0);

      ctx.drawImage(assetLoader.imgs.skyAl, skyAl.x, skyAl.y);
      ctx.drawImage(assetLoader.imgs.skyAl, skyAl.x + canvas.width, skyAl.y);

      assetLoader.sounds.bgAl.play();

      assetLoader.sounds.bg.pause();

      ctx.drawImage(assetLoader.imgs.backdropAl, backdropAl.x, backdropAl.y);
      ctx.drawImage(assetLoader.imgs.backdropAl, backdropAl.x + canvas.width, backdropAl.y);

      ctx.drawImage(assetLoader.imgs.backdrop2Al, backdrop2Al.x, backdrop2Al.y);
      ctx.drawImage(assetLoader.imgs.backdrop2Al, backdrop2Al.x + canvas.width, backdrop2Al.y);

    if (skyAl.x + assetLoader.imgs.skyAl.width <= 0)
      skyAl.x = 0;
    if (backdropAl.x + assetLoader.imgs.backdropAl.width <= 0)
      backdropAl.x = 0;
    if (backdrop2Al.x + assetLoader.imgs.backdrop2Al.width <= 0)
      backdrop2Al.x = 0;

    }else if(Fa){

    }else if(Pe){

    }else if(Me){

    }else{
      // Pan background
      sky.x -= sky.speed;
      backdrop.x -= backdrop.speed;
      backdrop2.x -= backdrop2.speed;

      ctx.drawImage(assetLoader.imgs.bg, 0, 0);

      ctx.drawImage(assetLoader.imgs.sky, sky.x, sky.y);
      ctx.drawImage(assetLoader.imgs.sky, sky.x + canvas.width, sky.y);
      ctx.drawImage(assetLoader.imgs.backdrop, backdrop.x, backdrop.y);
      ctx.drawImage(assetLoader.imgs.backdrop, backdrop.x + canvas.width, backdrop.y);

      ctx.drawImage(assetLoader.imgs.backdrop2, backdrop2.x, backdrop2.y);
      ctx.drawImage(assetLoader.imgs.backdrop2, backdrop2.x + canvas.width, backdrop2.y);

      // If the image scrolled off the screen, reset
    if (sky.x + assetLoader.imgs.sky.width <= 0)
       sky.x = 0;
    if (backdrop.x + assetLoader.imgs.backdrop.width <= 0)
      backdrop.x = 0;
    if (backdrop2.x + assetLoader.imgs.backdrop2.width <= 0)
      backdrop2.x = 0;
    }
  };

  /**
   * Reset background to zero
   */
  this.reset = function()  {
    skyAl.x = 0;
    skyAl.y = 0;
    skyAl.speed = 0.2;

    sky.x = 0;
    sky.y = 0;
    sky.speed = 0.2;

    backdrop.x = 0;
    backdrop.y = 0;
    backdrop.speed = 0.4;

    backdrop2.x = 0;
    backdrop2.y = 0;
    backdrop2.speed = 0.6;

    backdropAl.x = 0;
    backdropAl.y = 0;
    backdropAl.speed = 0.4;

    backdrop2Al.x = 0;
    backdrop2Al.y = 0;
    backdrop2Al.speed = 0.6;

    Al=false;
    Fa=false;
    Pe=false;
    Me=false;
  }

  return {
    draw: this.draw,
    reset: this.reset
  };
})();

/**
 * A vector for 2d space.
 * @param {integer} x - Center x coordinate.
 * @param {integer} y - Center y coordinate.
 * @param {integer} dx - Change in x.
 * @param {integer} dy - Change in y.
 */
function Vector(x, y, dx, dy) {
  // position
  this.x = x || 0;
  this.y = y || 0;
  // direction
  this.dx = dx || 0;
  this.dy = dy || 0;
}

/**
 * Advance the vectors position by dx,dy
 */
Vector.prototype.advance = function() {
  this.x += this.dx;
  this.y += this.dy;
};

/**
 * Get the minimum distance between two vectors
 * @param {Vector}
 * @return minDist
 */
Vector.prototype.minDist = function(vec) {
  var minDist = Infinity;
  var max     = Math.max( Math.abs(this.dx), Math.abs(this.dy),
                          Math.abs(vec.dx ), Math.abs(vec.dy ) );
  var slice   = 1 / max;

  var x, y, distSquared;

  // get the middle of each vector
  var vec1 = {}, vec2 = {};
  vec1.x = this.x + this.width/2;
  vec1.y = this.y + this.height/2;
  vec2.x = vec.x + vec.width/2;
  vec2.y = vec.y + vec.height/2;
  for (var percent = 0; percent < 1; percent += slice) {
    x = (vec1.x + this.dx * percent) - (vec2.x + vec.dx * percent);
    y = (vec1.y + this.dy * percent) - (vec2.y + vec.dy * percent);
    distSquared = x * x + y * y;

    minDist = Math.min(minDist, distSquared);
  }

  return Math.sqrt(minDist);
};

/**
 * The player object
 */
var player = (function(player) {
  // add properties directly to the player imported object
  player.width     = 231.949;
  player.height    = 207.023;
  player.speed     = 6;

  // jumping
  player.gravity   = 1;
  player.dy        = 0;
  player.jumpDy    = -10;
  player.isFalling = false;
  player.isJumping = false;

  // spritesheets
  player.sheet     = new SpriteSheet('imgs/normal_walk.png', player.width, player.height);
  player.walkAnim  = new Animation(player.sheet, 3, 0, 2);
  player.jumpAnim  = new Animation(player.sheet, 8, 6, 9);
  player.fallAnim  = new Animation(player.sheet, 7, 5, 8);
  player.anim      = player.walkAnim;

  Vector.call(player, 0, 0, 0, player.dy);

  var jumpCounter = 0;  // how long the jump button can be pressed down

  /**
   * Update the player's position and animation
   */
  player.update = function() {

    // jump if not currently jumping or falling
    if (KEY_STATUS.space && player.dy === 0 && !player.isJumping) {
      player.isJumping = true;
      player.dy = player.jumpDy;
      jumpCounter = 12;
      assetLoader.sounds.jump.play();
    }

    // jump higher if the space bar is continually pressed
    if (KEY_STATUS.space && jumpCounter) {
      player.dy = player.jumpDy;
    }

    jumpCounter = Math.max(jumpCounter-1, 0);

    this.advance();

    // add gravity
    if (player.isFalling || player.isJumping) {
      player.dy += player.gravity;
    }

    // change animation if falling
    if (player.dy > 0) {
      player.anim = player.fallAnim;
    }
    // change animation is jumping
    else if (player.dy < 0) {
      player.anim = player.jumpAnim;
    }
    else {
      player.anim = player.walkAnim;
    }

    player.anim.update();
  };

  /**
   * Draw the player at it's current position
   */
  player.draw = function() {
    player.anim.draw(player.x, player.y);
  };

  /**
   * Reset the player's position
   */
  player.reset = function() {
    player.x = 64;
    player.y = 250;
  };

  return player;
})(Object.create(Vector.prototype));

/**
 * Sprites are anything drawn to the screen (ground, enemies, etc.)
 * @param {integer} x - Starting x position of the player
 * @param {integer} y - Starting y position of the player
 * @param {string} type - Type of sprite
 */
function Sprite(x, y, type) {
  this.x      = x;
  this.y      = y;
  this.width  = platformWidth;
  this.height = platformWidth;
  this.type   = type;
  Vector.call(this, x, y, 0, 0);

  /**
   * Update the Sprite's position by the player's speed
   */
  this.update = function() {
    this.dx = -player.speed;
    this.advance();
  };

  /**
   * Draw the sprite at it's current position
   */
  this.draw = function() {
    ctx.save();
    ctx.translate(0.5,0.5);
    ctx.drawImage(assetLoader.imgs[this.type], this.x, this.y);
    ctx.restore();
  };
}
Sprite.prototype = Object.create(Vector.prototype);

/**
 * Get the type of a platform based on platform height
 * @return Type of platform
 */
function getType() {
  var type;
  switch (platformHeight) {
    case 0:
    case 1:

    if(Al){
    	type = Math.random() > 0.5 ? 'grass1Al' : 'grass2Al';
    }else if(Fa){
    	type = Math.random() > 0.5 ? 'grass1Fa' : 'grass2Fa';
    }else if(Pe){
    	type = Math.random() > 0.5 ? 'grass1Pe' : 'grass2Pe';
    }else if(Me){
    	type = Math.random() > 0.5 ? 'grass1Me' : 'grass2Me';
    }else{
    	type = Math.random() > 0.5 ? 'grass1' : 'grass2';
    }

      break;

    case 2:

    if(Al){
    	type = 'grassAl';
    }else if(Fa){
    	type = 'grassFa';
    }else if(Pe){
    	type = 'grassPe';
    }else if(Me){
    	type = 'grassMe';
    }else{
    	//Normal
    	type = 'grass';
    }
      break;

    case 3:

    if(Al){
    	type = 'bridgeAl';
	}else if(Fa){
		type = 'bridgeFa';
	}else if(Pe){
		type = 'bridgePe';
	}else if(Me){
		type = 'bridgeMe';
	}else{
		//Normal
		type = 'bridge';
	}

      break;
    case 4:

    if(Al){
    	type = 'boxAl';
	}else if(Fa){
		type = 'boxFa';
	}else if(Pe){
		type = 'boxPe';
	}else if(Me){
		type = 'boxMe';
	}else{
		//Normal
		type = 'box';
	}
      break;
  }
  if (platformLength === 1 && platformHeight < 3 && rand(0, 3) === 0) {

  	if(Al){
  		type = 'cliffAl';
	}else if(Fa){
		type = 'cliffFa';
	}else if(Pe){
		type = 'cliffPe';
	}else if(Me){
		type = 'cliffMe';
	}else{
		//Normal
    	type = 'cliff';
	}

  }

  return type;
}

/**
 * Update all ground position and draw. Also check for collision against the player.
 */
function updateGround() {
  // animate ground
  player.isFalling = true;
  for (var i = 0; i < ground.length; i++) {
    ground[i].update();
    ground[i].draw();

    // stop the player from falling when landing on a platform
    var angle;
    if (player.minDist(ground[i]) <= player.height/2 + platformWidth/2 &&
        (angle = Math.atan2(player.y - ground[i].y, player.x - ground[i].x) * 180/Math.PI) > -130 &&
        angle < -50) {
      player.isJumping = false;
      player.isFalling = false;
      player.y = ground[i].y - player.height + 5;
      player.dy = 0;
    }
  }

  // remove ground that have gone off screen
  if (ground[0] && ground[0].x < -platformWidth) {
    ground.splice(0, 1);
  }
}

/**
 * Update all water position and draw.
 */
function updateWater() {
  // animate water
  for (var i = 0; i < water.length; i++) {
    water[i].update();
    water[i].draw();

  }

  // remove water that has gone off screen
  if (water[0] && water[0].x < -platformWidth) {
    var w = water.splice(0, 1)[0];
    w.x = water[water.length-1].x + platformWidth;
    water.push(w);
  }
}

function updateWaterAl() {
  // animate water
  for (var i = 0; i < waterAl.length; i++) {
    waterAl[i].update();
    waterAl[i].draw();

  }

  // remove water that has gone off screen
  if (waterAl[0] && waterAl[0].x < -platformWidth) {
    var wAl = waterAl.splice(0, 1)[0];
    wAl.x = waterAl[waterAl.length-1].x + platformWidth;
    waterAl.push(wAl);
  }
}

function updateWaterFa() {
  // animate water
  for (var i = 0; i < waterFa.length; i++) {
    waterFa[i].update();
    waterFa[i].draw();

  }

  // remove water that has gone off screen
  if (waterFa[0] && waterFa[0].x < -platformWidth) {
    var wFa = waterFa.splice(0, 1)[0];
    wFa.x = waterFa[waterFa.length-1].x + platformWidth;
    waterFa.push(wFa);
  }
}

function updateWaterPe() {
  // animate water
  for (var i = 0; i < waterPe.length; i++) {
    waterPe[i].update();
    waterPe[i].draw();

  }

  // remove water that has gone off screen
  if (waterPe[0] && waterPe[0].x < -platformWidth) {
    var wPe = waterPe.splice(0, 1)[0];
    wPe.x = waterPe[waterPe.length-1].x + platformWidth;
    waterPe.push(wPe);
  }
}

function updateWaterMe() {
  // animate water
  for (var i = 0; i < waterMe.length; i++) {
    waterMe[i].update();
    waterMe[i].draw();

  }

  // remove water that has gone off screen
  if (waterMe[0] && waterMe[0].x < -platformWidth) {
    var wMe = waterMe.splice(0, 1)[0];
    wMe.x = waterMe[waterMe.length-1].x + platformWidth;
    waterMe.push(wMe);
  }
}

/**
 * Update all environment position and draw.
 */
function updateEnvironment() {
  // animate environment
  for (var i = 0; i < environment.length; i++) {
    environment[i].update();
    environment[i].draw();
  }

  // remove environment that have gone off screen
  if (environment[0] && environment[0].x < -platformWidth) {
    environment.splice(0, 1);
  }
}


/**
 * Update all enemies position and draw. Also check for collision against the player.
 */
function updateEnemies() {
  // animate enemies
  for (var i = 0; i < enemies.length; i++) {
    enemies[i].update();
    enemies[i].draw();

    // player ran into enemy
    if (player.minDist(enemies[i])+100 <= player.width - platformWidth/2) {
      //gameOver(); SACO LA MUERTE AL COLISIONAR
      alert("MUERTE");
    }
  }

  // remove enemies that have gone off screen
  if (enemies[0] && enemies[0].x < -platformWidth) {
    enemies.splice(0, 1);
  }
}

// UPDATE SUSTANCIAS

function updateSustancias() {
  // animate sustancias
  for (var i = 0; i < sustancias.length; i++) {
    sustancias[i].update();
    sustancias[i].draw();

    // player ran into Sustancia
    if (player.minDist(sustancias[i])+100 <= player.width - platformWidth/2) {
      //gameOver(); SACO LA MUERTE AL COLISIONAR
      alert("CAMBIO DE VISTA");
    }
  }

  // remove sustancias that have gone off screen
  if (sustancias[0] && sustancias[0].x < -platformWidth) {
    sustancias.splice(0, 1);
  }
}

/**
 * Update the players position and draw
 */
function updatePlayer() {
  player.update();
  player.draw();

  // game over
  if (player.y + player.height >= canvas.height) {
    gameOver();
  }
}

/**
 * Spawn new sprites off screen
 */
function spawnSprites() {
  // increase score
  score++;

  // first create a gap
  if (gapLength > 0) {
    gapLength--;
  }
  // then create ground
  else if (platformLength > 0) {
    var type = getType();

    ground.push(new Sprite(
      canvas.width + platformWidth % player.speed,
      platformBase - platformHeight * platformSpacer,
      type
    ));
    platformLength--;

    // add random environment sprites
    spawnEnvironmentSprites();

    // add random enemies
    spawnEnemySprites();

    // add random sustancias
    spawnSustanciasSprites();
  }
  // start over
  else {
    // increase gap length every speed increase of 4
    gapLength = rand(player.speed - 2, player.speed);
    // only allow a ground to increase by 1
    platformHeight = bound(rand(0, platformHeight + rand(0, 2)), 0, 4);
    platformLength = rand(Math.floor(player.speed/2), player.speed * 4);
  }
}

/**
 * Spawn new environment sprites off screen
 */
function spawnEnvironmentSprites() {
  if (score > 40 && rand(0, 20) === 0 && platformHeight < 3) {
    if (Math.random() > 0.5) {
      environment.push(new Sprite(
        canvas.width + platformWidth % player.speed,
        platformBase - platformHeight * platformSpacer - platformWidth,
        'plant'
      ));
    }
    else if (platformLength > 2) {
      environment.push(new Sprite(
        canvas.width + platformWidth % player.speed,
        platformBase - platformHeight * platformSpacer - platformWidth,
        'bush1'
      ));
      environment.push(new Sprite(
        canvas.width + platformWidth % player.speed + platformWidth,
        platformBase - platformHeight * platformSpacer - platformWidth,
        'bush2'
      ));
    }
  }
}

/**
 * Spawn new enemy sprites off screen
 */
function spawnEnemySprites() {
  if (score > 100 && Math.random() > 0.96 && enemies.length < 3 && platformLength > 5 &&
      (enemies.length ? canvas.width - enemies[enemies.length-1].x >= platformWidth * 3 ||
       canvas.width - enemies[enemies.length-1].x < platformWidth : true)) {
    enemies.push(new Sprite(
      canvas.width + platformWidth % player.speed,
      platformBase - platformHeight * platformSpacer - platformWidth,
      Math.random() > 0.5 ? 'spikes' : 'slime', 'slimeFa'
    ));
  }
}

/**
 * Spawn new Sustancias sprites off screen
 */
function spawnSustanciasSprites() {
  if (score > 100 && Math.random() > 0.96 && sustancias.length < 3 && platformLength > 5 &&
      (sustancias.length ? canvas.width - sustancias[sustancias.length-1].x >= platformWidth * 3 ||
       canvas.width - sustancias[sustancias.length-1].x < platformWidth : true)) {
    sustancias.push(new Sprite(
      canvas.width + platformWidth % player.speed,
      platformBase - platformHeight * platformSpacer - platformWidth,
      Math.random() > 0.5 ? 'slimeAl' : 'slimeFa'
    ));
  }
}

/**
 * Game loop
 */
function animate() {
  if (!stop) {
    requestAnimFrame( animate );
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    background.draw();

    // update entities
    /*if(Al)
    {
    	updateWaterAl();
    	updateEnvironment();
	    updatePlayer();
	    updateGround();
	    updateEnemies();
    }else if(Fa)
    {
    	updateWaterFa();
    }else if(Pe)
    {
    	updateWaterPe();
    }else if(Me)
    {
    	updateWaterMe();
    }else
    {*/
    	updateWater();
	    updateEnvironment();
	    updatePlayer();
	    updateGround();
	    updateEnemies();
	    updateSustancias();

    /*}*/
    
    // draw the score
    ctx.fillText('Score: ' + score + 'm', canvas.width - 140, 30);

    // spawn a new Sprite
    if (ticker % Math.floor(platformWidth / player.speed) === 0) {
      spawnSprites();
    }

    // increase player speed only when player is jumping
    if (ticker > (Math.floor(platformWidth / player.speed) * player.speed * 20) && player.dy !== 0) {
      player.speed = bound(++player.speed, 0, 15);
      player.walkAnim.frameSpeed = Math.floor(platformWidth / player.speed) - 1;

      // reset ticker
      ticker = 0;

      // spawn a platform to fill in gap created by increasing player speed
      if (gapLength === 0) {
        var type = getType();
        ground.push(new Sprite(
          canvas.width + platformWidth % player.speed,
          platformBase - platformHeight * platformSpacer,
          type
        ));
        platformLength--;
      }
    }

    ticker++;
  }
}

/**
 * Keep track of the spacebar events
 */
var KEY_CODES = {
  32: 'space'
};
var KEY_STATUS = {};
for (var code in KEY_CODES) {
  if (KEY_CODES.hasOwnProperty(code)) {
     KEY_STATUS[KEY_CODES[code]] = false;
  }
}
document.onkeydown = function(e) {
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = true;
  }
};
document.onkeyup = function(e) {
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = false;
  }
};

/**
 * Request Animation Polyfill
 */
var requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function(callback, element){
            window.setTimeout(callback, 1000 / 60);
          };
})();

/**
 * Show the main menu after loading all assets
 */
function mainMenu() {
  for (var sound in assetLoader.sounds) {
    if (assetLoader.sounds.hasOwnProperty(sound)) {
      assetLoader.sounds[sound].muted = !playSound;
    }
  }

  $('#progress').hide();
  $('#main').show();
  $('#menu').addClass('main');
  $('.sound').show();
}

/**
 * Start the game - reset all variables and entities, spawn ground and water.
 */
function startGame() {
  document.getElementById('game-over').style.display = 'none';
  ground = [];
  water = [];
  environment = [];
  enemies = [];
  player.reset();
  ticker = 0;
  stop = false;
  score = 0;
  platformHeight = 2;
  platformLength = 15;
  gapLength = 0;

  ctx.font = '16px arial, sans-serif';

  for (var i = 0; i < 30; i++) {
    ground.push(new Sprite(i * (platformWidth-3), platformBase - platformHeight * platformSpacer, 'grass'));
  }

  for (i = 0; i < canvas.width / 32 + 2; i++) {
    water.push(new Sprite(i * platformWidth, platformBase, 'water'));
  }

  background.reset();

  animate();

  assetLoader.sounds.gameOver.pause();
  assetLoader.sounds.bg.currentTime = 0;
  assetLoader.sounds.bg.loop = true;
  assetLoader.sounds.bg.play();

  assetLoader.sounds.bgAl.currentTime = 0;
  assetLoader.sounds.bgAl.loop = true;

}

/**
 * End the game and restart
 */
function gameOver() {
  stop = true;
  $('#score').html(score);
  $('#game-over').show();
  assetLoader.sounds.bg.pause();

  if (Al) {
    assetLoader.sounds.bgAl.pause();
  };

  assetLoader.sounds.gameOver.currentTime = 0;
  assetLoader.sounds.gameOver.play();

  $(document).keypress(function(e) {
    if(e.which == 13) {
        alert('You pressed enter!');
  	}
});
}

/**
 * Click handlers for the different menu screens
 */
$('.credits').click(function() {
  $('#main').hide();
  $('#credits').show();
  $('#menu').addClass('credits');
});
$('.back').click(function() {
  $('#credits').hide();
  $('#main').show();
  $('#menu').removeClass('credits');
});
$('.sound').click(function() {
  var $this = $(this);
  // sound off
  if ($this.hasClass('sound-on')) {
    $this.removeClass('sound-on').addClass('sound-off');
    playSound = false;
  }
  // sound on
  else {
    $this.removeClass('sound-off').addClass('sound-on');
    playSound = true;
  }

  if (canUseLocalStorage) {
    localStorage.setItem('kandi.playSound', playSound);
  }

  // mute or unmute all sounds
  for (var sound in assetLoader.sounds) {
    if (assetLoader.sounds.hasOwnProperty(sound)) {
      assetLoader.sounds[sound].muted = !playSound;
    }
  }
});
$('.play').click(function() {
  $('#menu').hide();
  startGame();
});


$('.restart').click(function() {
  $('#game-over').hide();
  startGame();
});

assetLoader.downloadAll();
})(jQuery);