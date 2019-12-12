// =============================================================================
// sprites
// =============================================================================

//
// hero sprite
//
function Hero(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'hero');
    this.anchor.set(0.5, 0.5);

    // physic properties
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
}

// inherit from Phaser.Sprite
Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;

Hero.prototype.move = function (direction) {
    const SPEED = 200;
    this.body.velocity.x = direction * SPEED;
};

Hero.prototype.jump = function () {
    const JUMP_SPEED = 600;
    let canJump = this.body.touching.down;

    if (canJump) {
        this.body.velocity.y = -JUMP_SPEED;
    }

    return canJump;
};

//
// Spider (enemy)
//
function Spider(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'spider');

    // anchor
    this.anchor.set(0.5);
    // animation
    this.animations.add('crawl', [0, 2], 8, true); // 8fps, looped
    this.animations.play('crawl');

    // physic properties
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    this.body.velocity.x = Spider.SPEED;
}

Spider.SPEED = 100;

// inherit from Phaser.Sprite
Spider.prototype = Object.create(Phaser.Sprite.prototype);
Spider.prototype.constructor = Spider;

Spider.prototype.update = function () {
    // check against walls and reverse direction if necessary
    if (this.body.touching.right || this.body.blocked.right) {
        this.body.velocity.x = -Spider.SPEED; // turn left
    }
    else if (this.body.touching.left || this.body.blocked.left) {
        this.body.velocity.x = Spider.SPEED; // turn right
    }
};

// =============================================================================
// game states
// =============================================================================

PlayState = {};

PlayState.init = function () {
    this.game.renderer.renderSession.roundPixels = true;

    this.keys = this.game.input.keyboard.addKeys({
        left: Phaser.KeyCode.LEFT,
        right: Phaser.KeyCode.RIGHT,
        up: Phaser.KeyCode.UP
    });

    this.keys.up.onDown.add(function () {
        let didJump = this.hero.jump();
        if (didJump) {
            this.sfx.jump.play();
        }
    }, this);
};

PlayState.preload = function () {
    this.game.load.json('level:1', 'data/level01.json');

    this.game.load.image('background', 'images/background.png');
    this.game.load.image('ground', 'images/ground.png');
    this.game.load.image('grass:8x1', 'images/brick_8x1.png');
    this.game.load.image('grass:6x1', 'images/brick_6x1.png');
    this.game.load.image('grass:4x1', 'images/brick_4x1.png');
    this.game.load.image('grass:2x1', 'images/brick_2x1.png');
    this.game.load.image('grass:1x1', 'images/brick_1x1.png');
    this.game.load.image('hero', 'images/rameses_right.png');
    
    this.game.load.image('invisible-wall', 'images/invisible_wall.png');

    this.game.load.spritesheet('coin', 'images/coin_animated.png', 22, 22);
    this.game.load.spritesheet('spider', 'images/frosh.png', 42, 32);

    this.game.load.audio('sfx:jump', 'audio/jump.wav');
    this.game.load.audio('sfx:coin', 'audio/coin.wav');
};

PlayState.create = function () {
    // create sound entities
    this.sfx = {
        jump: this.game.add.audio('sfx:jump'),
        coin: this.game.add.audio('sfx:coin'),
    };

    this.game.add.image(0, 0, 'background');
    this._loadLevel(this.game.cache.getJSON('level:1'));
};

PlayState.update = function () {
    this._handleCollisions();
    this._handleInput();
};

PlayState._handleCollisions = function () {
    this.game.physics.arcade.collide(this.spiders, this.platforms);
    this.game.physics.arcade.collide(this.spiders, this.enemyWalls);
    this.game.physics.arcade.collide(this.hero, this.platforms);

    this.game.physics.arcade.overlap(this.hero, this.coins, this._onHeroVsCoin,
        null, this);
};

PlayState._handleInput = function () {
    if (this.keys.left.isDown) { // move hero left
        this.hero.move(-1);
    }
    else if (this.keys.right.isDown) { // move hero right
        this.hero.move(1);
    }
    else { // stop
        this.hero.move(0);
    }
};

PlayState._loadLevel = function (data) {
    // create all the groups/layers that we need
    this.platforms = this.game.add.group();
    this.coins = this.game.add.group();
    this.spiders = this.game.add.group();
    this.enemyWalls = this.game.add.group();
    this.enemyWalls.visible = false;

    // spawn all platforms
    data.platforms.forEach(this._spawnPlatform, this);
    // spawn hero and enemies
    this._spawnCharacters({hero: data.hero, spiders: data.spiders});
    // spawn important objects
    data.coins.forEach(this._spawnCoin, this);

    // enable gravity
    const GRAVITY = 1200;
    this.game.physics.arcade.gravity.y = GRAVITY;
};

PlayState._spawnPlatform = function (platform) {
    let sprite = this.platforms.create(
        platform.x, platform.y, platform.image);

    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;

    this._spawnEnemyWall(platform.x, platform.y, 'left');
    this._spawnEnemyWall(platform.x + sprite.width, platform.y, 'right');
};

PlayState._spawnEnemyWall = function (x, y, side) {
    let sprite = this.enemyWalls.create(x, y, 'invisible-wall');
    // anchor and y displacement
    sprite.anchor.set(side === 'left' ? 1 : 0, 1);
    // physic properties
    this.game.physics.enable(sprite);
    sprite.body.immovable = true;
    sprite.body.allowGravity = false;
};

PlayState._spawnCharacters = function (data) {
    // spawn spiders
    data.spiders.forEach(function (spider) {
        let sprite = new Spider(this.game, spider.x, spider.y);
        this.spiders.add(sprite);
    }, this);

    // spawn hero
    this.hero = new Hero(this.game, data.hero.x, data.hero.y);
    this.game.add.existing(this.hero);
};

PlayState._spawnCoin = function (coin) {
    let sprite = this.coins.create(coin.x, coin.y, 'coin');
    sprite.anchor.set(0.5, 0.5);

    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;

    sprite.animations.add('rotate', [0, 1, 2, 1], 6, true); // 6fps, looped
    sprite.animations.play('rotate');
};

PlayState._onHeroVsCoin = function (hero, coin) {
    this.sfx.coin.play();
    coin.kill();
};

// =============================================================================
// entry point
// =============================================================================


startup = function(event) {
    if (($('#user').val() == "") && ($('#pass').val() != "")) {
        let x = $('#pass').val();
        let restart = (
            `
    <div class="columns is-centered" id="all">
    <div class="column is-one-quarter has-background-info">
    <div class="field">
<label class="label has-text-white" id="u">Welcome!</label>
<div class="control">
<input class="input is-danger" type="text" id="user" placeholder="username">
<p class="help is-danger has-text-weight-bold">Must enter username!</p>
</div>
</div>
<div class="field">
<div class="control">
<input class="input" type="password" id="pass" placeholder="password" value=${x}>
</div>
</div>

<div class="field is-grouped">
<div class="control">
<button class="button is-success" id="login" onclick="">Login</button>
</div>
<div class="control">
<button class="button is-link" id="sign" onclick="">Sign Up</button>
</div>
</div>
</div>
</div>
            `
        );
        $('#game').append(restart);
        $('#all').remove();
    } else if (($('#pass').val() == "") && ($('#user').val() != "")) {
        let x = $('#user').val();
        let restart = (
            `
            <div class="columns is-centered" id="all">
        <div class="column is-one-quarter has-background-info">
        <div class="field">
  <label class="label has-text-white" id="u">Welcome!</label>
  <div class="control">
    <input class="input" type="text" id="user" placeholder="username" value=${x}>
  </div>
  </div>
  <div class="field">
  <div class="control">
    <input class="input is-danger" type="password" id="pass" placeholder="password">
    <p class="help is-danger has-text-weight-bold">Must enter password!</p>
  </div>
</div>

<div class="field is-grouped">
  <div class="control">
    <button class="button is-success" id="login" onclick="">Login</button>
</div>
    <div class="control">
    <button class="button is-link" id="sign" onclick="">Sign Up</button>
  </div>
  </div>
</div>
</div>
`
        );
        $('#game').append(restart);
        $('#all').remove();
    } else if (($('#pass').val() == "") && ($('#user').val() == "")) {
        let restart = (
            `
            <div class="columns is-centered" id="all">
        <div class="column is-one-quarter has-background-info">
        <div class="field">
  <label class="label has-text-white" id="u">Welcome!</label>
  <div class="control">
    <input class="input is-danger" type="text" id="user" placeholder="username">
    <p class="help is-danger has-text-weight-bold">Must enter username!</p>
  </div>
  </div>
  <div class="field">
  <div class="control">
    <input class="input is-danger" type="password" id="pass" placeholder="password">
    <p class="help is-danger has-text-weight-bold">Must enter password!</p>
  </div>
</div>

<div class="field is-grouped">
  <div class="control">
    <button class="button is-success" id="login" onclick="">Login</button>
</div>
    <div class="control">
    <button class="button is-link" id="sign" onclick="">Sign Up</button>
  </div>
  </div>
</div>
</div>
`
        );
        $('#game').append(restart);
        $('#all').remove();
    } else {
        $('#all').remove();

        let game = new Phaser.Game(960, 600, Phaser.AUTO, 'game');
        game.state.add('play', PlayState);
        game.state.start('play');
    }
}

gamestart = function(event) {
    $('#all').remove();

    let game = new Phaser.Game(960, 600, Phaser.AUTO, 'game');
    game.state.add('play', PlayState);
    game.state.start('play');
}

sustart = function(event) {
    if (($('#pass').val() == "") && ($('#user').val() == "") && ($('#fn').val() == "") && ($('#ln').val() == "")) {
        let s = (
            `
            <div class="columns is-centered" id="all">
            <div class="column is-one-quarter has-background-info">
            <div class="field">
      <div class="control">
      <label class="label has-text-white">Firstname:</label>
        <input class="input is-danger" type="text" id="fn" placeholder="Firstname">
        <p class="help is-danger has-text-weight-bold">Must enter Firstname!</p>
        </div>
        </div>
        <div class="field">
        <div class="control">
        <label class="label has-text-white" id="n">Lastname:</label>
        <input class="input is-danger" type="text" id="ln" placeholder="Lastname">
        <p class="help is-danger has-text-weight-bold">Must enter Lastname!</p>
      </div>
      </div>
      <div class="field">
      <div class="control">
      <label class="label has-text-white" id="n">Username:</label>
        <input class="input is-danger" type="text" id="user" placeholder="username">
        <p class="help is-danger has-text-weight-bold">Must enter username!</p>
      </div>
      </div>
      <div class="field">
      <div class="control">
      <label class="label has-text-white" id="n">Password:</label>
        <input class="input is-danger" type="password" id="pass" placeholder="password">
        <p class="help is-danger has-text-weight-bold">Must enter password!</p>
      </div>
    </div>
    
    <div class="field is-grouped">
        <div class="control">
        <button class="button is-link" id="su" onclick="">Begin Game!</button>
      </div>
      </div>
    </div>
    </div>
    `
        );
        $('#game').append(s);
        $('#all').remove();
    } else {
        gamestart();
    }
}

signup = function(event) {
    let s = (
        `
        <div class="columns is-centered" id="all">
        <div class="column is-one-quarter has-background-info">
        <div class="field">
  <div class="control">
  <label class="label has-text-white">Firstname:</label>
    <input class="input" type="text" id="fn" placeholder="Firstname">
    </div>
    </div>
    <div class="field">
    <div class="control">
    <label class="label has-text-white" id="n">Lastname:</label>
    <input class="input" type="text" id="ln" placeholder="Lastname">
  </div>
  </div>
  <div class="field">
  <div class="control">
  <label class="label has-text-white" id="n">Username:</label>
    <input class="input" type="text" id="user" placeholder="username">
  </div>
  </div>
  <div class="field">
  <div class="control">
  <label class="label has-text-white" id="n">Password:</label>
    <input class="input" type="password" id="pass" placeholder="password">
  </div>
</div>

<div class="field is-grouped">
    <div class="control">
    <button class="button is-link" id="su" onclick="">Begin Game!</button>
  </div>
  </div>
</div>
</div>
`
    );
    $('#game').append(s);
    $('#all').remove();
}

window.onload = function () {
    const $game = $('#game');

    let signin = (
        `
        <div class="columns is-centered" id="all">
        <div class="column is-one-quarter has-background-info">
        <div class="field">
  <label class="label has-text-white" id="u">Welcome!</label>
  <div class="control">
    <input class="input" type="text" id="user" placeholder="username">
  </div>
  </div>
  <div class="field">
  <div class="control">
    <input class="input" type="password" id="pass" placeholder="password">
  </div>
</div>

<div class="field is-grouped">
  <div class="control">
    <button class="button is-success" id="login" onclick="">Login</button>
</div>
    <div class="control">
    <button class="button is-link" id="sign" onclick="">Sign Up</button>
  </div>
  </div>
</div>
</div>
        `
    );

    $game.append(signin);

    $game.on('click', '#login', startup);

    $game.on('click', '#sign', signup);

    $game.on('click', '#su', sustart);
};