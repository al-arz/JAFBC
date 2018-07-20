module JAFBC {

	export class Menu extends Phaser.State {

		background: Phaser.TileSprite;
		ground: Phaser.TileSprite;
		logo: Phaser.Sprite;
		startButton: Phaser.Button;

		create() {

			this.background = this.add.tileSprite(0, -56, this.game.width, this.game.height, 'bg');
            this.ground = this.add.tileSprite(0, this.game.height-112, this.game.width, 112, 'ground');

			this.logo = this.add.sprite(this.world.centerX, -300, 'logo');
			this.logo.anchor.setTo(0.5, 0.5);

			//this.input.onDown.addOnce(this.fadeOut, this);
			this.startButton = this.game.add.button(
                this.game.world.centerX, this.game.world.centerY + 55, 'play',
				() => {this.fadeOut()}, 0, 0, 0
			);
			this.startButton.anchor.set(0.5, 0.5);
            this.startButton.x = this.world.centerX;
			this.startButton.alpha = 0;
			
			this.add.tween(this.background).to({ alpha: 1 }, 1000, Phaser.Easing.Bounce.InOut, true);
			this.add.tween(this.logo).to({ y: 150 }, 1000, Phaser.Easing.Cubic.Out, true);
			this.add.tween(this.startButton).to({ y: this.game.world.centerY + 50, alpha:1 }, 1000, Phaser.Easing.Cubic.Out, true);
		}

		fadeOut() {

			var tween = this.add.tween(this.logo).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
			this.add.tween(this.startButton).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
			tween.onComplete.add(this.startGame, this);

		}

		startGame() {
			
			this.game.state.start('GameState', true, false);

		}

	}

}