var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var JAFBC;
(function (JAFBC) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Boot.prototype.init = function () {
            this.input.maxPointers = 1;
            this.stage.disableVisibilityChange = true;
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            if (this.game.device.desktop) {
                this.scale.pageAlignHorizontally = true;
            }
            else {
                this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                this.scale.setMinMax(320, 480, 960, 1440);
                this.scale.forceLandscape = false;
                this.scale.pageAlignHorizontally = true;
            }
        };
        Boot.prototype.preload = function () {
            this.load.image('preloadBar', 'assets/loader.png');
        };
        Boot.prototype.create = function () {
            this.game.state.start('Preloader');
        };
        return Boot;
    }(Phaser.State));
    JAFBC.Boot = Boot;
})(JAFBC || (JAFBC = {}));
var JAFBC;
(function (JAFBC) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            var _this = _super.call(this, 320, 480, Phaser.AUTO, 'content', null) || this;
            _this.state.add('Boot', JAFBC.Boot, false);
            _this.state.add('Preloader', JAFBC.Preloader, false);
            _this.state.add('Menu', JAFBC.Menu, false);
            _this.state.add('GameState', JAFBC.GameState, false);
            _this.state.start('Boot');
            return _this;
        }
        return Game;
    }(Phaser.Game));
    JAFBC.Game = Game;
})(JAFBC || (JAFBC = {}));
var JAFBC;
(function (JAFBC) {
    var GameState = (function (_super) {
        __extends(GameState, _super);
        function GameState() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.score = 0;
            _this.scrollSpeed = 150;
            return _this;
        }
        GameState.prototype.create = function () {
            var _this = this;
            this.background = this.add.tileSprite(0, -56, this.game.width, this.game.height, 'bg');
            this.gates = this.game.add.group();
            for (var i = 0; i < 3; i++) {
                var g = new JAFBC.Gate(this.game);
                this.gates.add(g);
                g.kill();
            }
            this.ground = this.add.tileSprite(0, this.game.height - 112, this.game.width, 112, 'ground');
            this.game.physics.enable(this.ground);
            this.ground.body.immovable = true;
            this.player = new JAFBC.Player(this.game, this.game.width / 3, this.world.centerY);
            this.player.body.onCollide = new Phaser.Signal();
            this.player.body.onCollide.add(this.onGameOver, this);
            this.GOLabel = this.add.sprite(this.world.centerX, -200, 'go-label');
            this.GOLabel.anchor.setTo(0.5, 0.5);
            this.GOPanel = this.add.sprite(this.world.centerX, this.game.height + 100, 'go-panel');
            this.GOPanel.anchor.setTo(0.5, 0.5);
            this.scoreText = this.game.add.bitmapText(this.game.world.centerX, 20, 'digits', '0');
            this.bestScoreText = this.game.add.bitmapText(this.world.centerX + 70, this.world.centerY + 20, 'digits', GameState.bestScore.toString());
            this.bestScoreText.alpha = 0;
            this.restartButton = this.game.add.button(this.game.world.centerX, this.game.height + 100, 'play', function () { _this.onRestart(); }, 0, 0);
            this.restartButton.anchor.set(0.5, 0.5);
            this.restartButton.x = this.world.centerX;
            this.reviveGate(this.gates.getFirstDead(), this.game.width * 1.5, this.game.rnd.integerInRange(50, 200));
        };
        GameState.prototype.onRestart = function () {
            this.scrollSpeed = 150;
            this.player.position.set(130, this.world.centerY);
            this.updateScore(0);
            this.game.state.start('GameState');
        };
        GameState.prototype.updateScore = function (s) {
            this.score = s;
            if (this.score > GameState.bestScore) {
                GameState.bestScore = this.score;
                this.bestScoreText.text = this.score.toString();
            }
            this.scoreText.text = this.score.toString();
        };
        GameState.prototype.onGameOver = function (player, obstacle) {
            this.scrollSpeed = 0;
            this.player.collided = true;
            this.player.body.velocity.x = 0;
            this.player.animations.stop();
            this.scoreText.x = this.game.world.centerX + 70;
            this.scoreText.y = this.game.world.centerY - 25;
            this.scoreText.alpha = 0;
            this.add.tween(this.GOLabel).to({ y: 120 }, 1000, Phaser.Easing.Elastic.Out, true);
            var panelTween = this.add.tween(this.GOPanel).to({ y: this.game.world.centerY }, 1000, Phaser.Easing.Elastic.Out, true);
            panelTween.onComplete.add(this.showFinalScore, this);
            this.add.tween(this.restartButton).to({ y: this.game.world.centerY + 70 }, 1000, Phaser.Easing.Elastic.Out, true);
        };
        GameState.prototype.showFinalScore = function () {
            this.add.tween(this.scoreText).to({ y: this.game.world.centerY - 30, alpha: 1 }, 1000, Phaser.Easing.Cubic.Out, true);
            this.add.tween(this.bestScoreText).to({ y: this.game.world.centerY + 15, alpha: 1 }, 1000, Phaser.Easing.Cubic.Out, true);
        };
        GameState.prototype.update = function () {
            var _this = this;
            this.ground.tilePosition.x -= this.scrollSpeed * this.game.time.physicsElapsed;
            this.game.physics.arcade.collide(this.player, this.ground);
            this.gates.forEachAlive(function (gate) {
                if (!_this.player.collided) {
                    if (gate.alive) {
                        gate.x -= _this.scrollSpeed * _this.game.time.physicsElapsed;
                        _this.game.physics.arcade.collide(_this.player, gate);
                    }
                    if (!gate.passed && gate.alive && _this.player.right > gate.centerX) {
                        gate.passed = true;
                        _this.updateScore(++_this.score);
                    }
                    if (!gate.triggered && gate.alive && gate.centerX < _this.game.world.centerX) {
                        gate.triggered = true;
                        var g = _this.gates.getFirstDead();
                        if (g) {
                            _this.reviveGate(g, _this.game.width, _this.game.rnd.integerInRange(50, 200));
                        }
                    }
                    if (gate.right < 0) {
                        gate.x = _this.game.width;
                        gate.passed = false;
                        gate.triggered = false;
                        gate.kill();
                    }
                }
            });
        };
        GameState.prototype.reviveGate = function (g, x, gapY) {
            g.revive();
            g.setParams(x, gapY);
        };
        GameState.prototype.render = function () {
        };
        GameState.bestScore = 0;
        return GameState;
    }(Phaser.State));
    JAFBC.GameState = GameState;
})(JAFBC || (JAFBC = {}));
var JAFBC;
(function (JAFBC) {
    var Gate = (function (_super) {
        __extends(Gate, _super);
        function Gate(game) {
            var _this = _super.call(this, game) || this;
            _this.passed = false;
            _this.triggered = false;
            _this.upperTube = new JAFBC.Tube(game, 0, 0, true);
            _this.lowerTube = new JAFBC.Tube(game, 0, 0, false);
            _this.add(_this.upperTube);
            _this.add(_this.lowerTube);
            return _this;
        }
        Gate.prototype.setParams = function (x, gapY) {
            this.x = x;
            this.upperTube.position.set(0, gapY);
            this.lowerTube.position.set(0, gapY + Gate.GAP);
        };
        Gate.prototype.update = function () {
        };
        Gate.GAP = 100;
        return Gate;
    }(Phaser.Group));
    JAFBC.Gate = Gate;
})(JAFBC || (JAFBC = {}));
var JAFBC;
(function (JAFBC) {
    var Menu = (function (_super) {
        __extends(Menu, _super);
        function Menu() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Menu.prototype.create = function () {
            var _this = this;
            this.background = this.add.tileSprite(0, -56, this.game.width, this.game.height, 'bg');
            this.ground = this.add.tileSprite(0, this.game.height - 112, this.game.width, 112, 'ground');
            this.logo = this.add.sprite(this.world.centerX, -300, 'logo');
            this.logo.anchor.setTo(0.5, 0.5);
            this.startButton = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 55, 'play', function () { _this.fadeOut(); }, 0, 0, 0);
            this.startButton.anchor.set(0.5, 0.5);
            this.startButton.x = this.world.centerX;
            this.startButton.alpha = 0;
            this.add.tween(this.background).to({ alpha: 1 }, 1000, Phaser.Easing.Bounce.InOut, true);
            this.add.tween(this.logo).to({ y: 150 }, 1000, Phaser.Easing.Cubic.Out, true);
            this.add.tween(this.startButton).to({ y: this.game.world.centerY + 50, alpha: 1 }, 1000, Phaser.Easing.Cubic.Out, true);
        };
        Menu.prototype.fadeOut = function () {
            var tween = this.add.tween(this.logo).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            this.add.tween(this.startButton).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startGame, this);
        };
        Menu.prototype.startGame = function () {
            this.game.state.start('GameState', true, false);
        };
        return Menu;
    }(Phaser.State));
    JAFBC.Menu = Menu;
})(JAFBC || (JAFBC = {}));
var JAFBC;
(function (JAFBC) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(game, x, y) {
            var _this = _super.call(this, game, x, y, 'flappy', 0) || this;
            _this.isFalling = false;
            _this.collided = false;
            _this.game.physics.arcade.enableBody(_this);
            _this.body.acceleration.y = 500;
            _this.body.maxVelocity.y = 400;
            _this.isFalling = false;
            _this.collided = false;
            _this.anchor.setTo(0.5, 0.5);
            _this.animations.add('fly', [0, 1, 2, 1], 10, true);
            _this.animations.play('fly');
            game.add.existing(_this);
            game.input.onTap.add(_this.onTap, _this);
            return _this;
        }
        Player.prototype.onTap = function () {
            if (!this.collided) {
                console.log("tap");
                this.body.velocity.y = -240;
            }
        };
        Player.prototype.update = function () {
        };
        return Player;
    }(Phaser.Sprite));
    JAFBC.Player = Player;
})(JAFBC || (JAFBC = {}));
var JAFBC;
(function (JAFBC) {
    var Preloader = (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.ready = false;
            return _this;
        }
        Preloader.prototype.preload = function () {
            this.preloadBar = this.add.sprite(0, this.game.world.centerY, 'preloadBar');
            this.load.setPreloadSprite(this.preloadBar);
            this.load.image('bg', 'assets/bg-light.png');
            this.load.image('logo', 'assets/logo.png');
            this.load.spritesheet('flappy', 'assets/flappy-yellow.png', 34, 24, 3);
            this.load.image('ground', 'assets/ground.png');
            this.load.image('tube', 'assets/tube.png');
            this.load.bitmapFont('digits', 'assets/font/font.png', 'assets/font/font.xml');
            this.load.image('go-label', 'assets/gameover-label.png');
            this.load.image('go-panel', 'assets/gameover-panel.png');
            this.load.image('play', 'assets/play.png');
        };
        Preloader.prototype.create = function () {
            this.game.state.start('Menu');
        };
        return Preloader;
    }(Phaser.State));
    JAFBC.Preloader = Preloader;
})(JAFBC || (JAFBC = {}));
var JAFBC;
(function (JAFBC) {
    var Tube = (function (_super) {
        __extends(Tube, _super);
        function Tube(game, x, y, isUpper) {
            var _this = _super.call(this, game, x, y, 'tube', 0) || this;
            _this.passed = false;
            _this.anchor.setTo(0, 1);
            if (!isUpper)
                _this.scale.y = -1;
            _this.game.physics.arcade.enableBody(_this);
            _this.body.immovable = true;
            _this.isUpper = isUpper;
            return _this;
        }
        Tube.prototype.update = function () {
        };
        return Tube;
    }(Phaser.Sprite));
    JAFBC.Tube = Tube;
})(JAFBC || (JAFBC = {}));
//# sourceMappingURL=game.js.map