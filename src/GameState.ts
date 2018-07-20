module JAFBC {

	export class GameState extends Phaser.State {

        background: Phaser.TileSprite;
        ground: Phaser.TileSprite;
        gates: Phaser.Group;
        player: JAFBC.Player;
        static bestScore: number = 0;

        score: number = 0;
        scoreText: Phaser.BitmapText;
        bestScoreText: Phaser.BitmapText;
        scrollSpeed: number = 150;
        GOLabel: Phaser.Sprite;
        GOPanel: Phaser.Sprite;
        restartButton: Phaser.Button;

        //Settings are hardcoded because I'm lazy (in a bad sense).
		create() {

            this.background = this.add.tileSprite(0, -56, this.game.width, this.game.height, 'bg');

            this.gates = this.game.add.group();
            for (var i=0; i<3; i++) {
                var g = new Gate(this.game);
                this.gates.add(g);
                g.kill();
            }

            this.ground = this.add.tileSprite(0, this.game.height-112, this.game.width, 112, 'ground');
            this.game.physics.enable(this.ground);
            this.ground.body.immovable = true;

            this.player = new Player(this.game, this.game.width/3, this.world.centerY);
            this.player.body.onCollide = new Phaser.Signal();
            this.player.body.onCollide.add(this.onGameOver, this);

            this.GOLabel = this.add.sprite(this.world.centerX, -200, 'go-label');
            this.GOLabel.anchor.setTo(0.5, 0.5);
            this.GOPanel = this.add.sprite(this.world.centerX, this.game.height + 100, 'go-panel');
            this.GOPanel.anchor.setTo(0.5, 0.5);

            this.scoreText = this.game.add.bitmapText(this.game.world.centerX, 20, 'digits', '0');
            this.bestScoreText = this.game.add.bitmapText(
                this.world.centerX + 70,
                this.world.centerY + 20, 'digits',  GameState.bestScore.toString());
            this.bestScoreText.alpha = 0;
            
            this.restartButton = this.game.add.button(
                this.game.world.centerX, this.game.height+100, 'play',
                //omg https://github.com/Microsoft/TypeScript/wiki/%27this%27-in-TypeScript#red-flags-for-this
                () => {this.onRestart()},
                0, 0, 
            );
            this.restartButton.anchor.set(0.5, 0.5);
            this.restartButton.x = this.world.centerX;

            this.reviveGate(
                this.gates.getFirstDead(), this.game.width*1.5, 
                this.game.rnd.integerInRange(50, 200)
            );
        }

        onRestart() {
            //console.log('restarting');
            this.scrollSpeed = 150;
            this.player.position.set(130, this.world.centerY);
            this.updateScore(0);
            this.game.state.start('GameState');
        }

        updateScore(s: number) {
            this.score = s;
            if (this.score > GameState.bestScore) {
                GameState.bestScore = this.score;
                this.bestScoreText.text = this.score.toString();
            }
            this.scoreText.text = this.score.toString();
        }
        
        onGameOver(player: Phaser.Sprite, obstacle: Phaser.Sprite) {
            this.scrollSpeed = 0;
            this.player.collided = true;
            this.player.body.velocity.x = 0;
            this.player.animations.stop();
            this.scoreText.x = this.game.world.centerX + 70
            this.scoreText.y = this.game.world.centerY - 25;
            this.scoreText.alpha = 0;
        
            this.add.tween(this.GOLabel).to({ y: 120 }, 1000, Phaser.Easing.Elastic.Out, true);
            var panelTween = this.add.tween(this.GOPanel).to({ y: this.game.world.centerY }, 1000, Phaser.Easing.Elastic.Out, true);
            panelTween.onComplete.add(this.showFinalScore, this)
            this.add.tween(this.restartButton).to({ y: this.game.world.centerY + 70 }, 1000, Phaser.Easing.Elastic.Out, true);
        }

        showFinalScore() {
            this.add.tween(this.scoreText).to({ y: this.game.world.centerY - 30, alpha: 1}, 1000, Phaser.Easing.Cubic.Out, true);
            this.add.tween(this.bestScoreText).to({ y: this.game.world.centerY + 15, alpha: 1 }, 1000, Phaser.Easing.Cubic.Out, true);
        }

        update() {
            this.ground.tilePosition.x -= this.scrollSpeed*this.game.time.physicsElapsed;
            this.game.physics.arcade.collide(this.player, this.ground);

            //Yeah, that should be done with some kind of FSM. Sorry.
            this.gates.forEachAlive((gate:Gate) => {
                if (!this.player.collided) {
                    if (gate.alive) {
                        gate.x -= this.scrollSpeed*this.game.time.physicsElapsed;
                        this.game.physics.arcade.collide(this.player, gate);
                    }
                    if (!gate.passed && gate.alive && this.player.right > gate.centerX) {
                        gate.passed = true;
                        this.updateScore(++this.score);
                    }
                    if (!gate.triggered && gate.alive && gate.centerX < this.game.world.centerX) {
                        gate.triggered = true;
                        var g = this.gates.getFirstDead();
                        if (g) {
                            this.reviveGate(g, this.game.width, 
                                this.game.rnd.integerInRange(50, 200));
                        }
                    }
                    if (gate.right < 0) {
                        gate.x = this.game.width;
                        gate.passed = false;
                        gate.triggered = false;
                        gate.kill();
                    }
                }
            });
            
        }

        reviveGate(g:Gate, x:number, gapY:number) {
            g.revive();
            g.setParams(x, gapY);
        }

        render() {
            /*
            this.game.debug.body(this.player);
            this.tubes.forEach((g:Gate) => {
                this.game.debug.body(g.upperTube);
                this.game.debug.body(g.lowerTube);
            })
            this.game.debug.bodyInfo(this.player, 16, 24);
            */
        }

	}

} 