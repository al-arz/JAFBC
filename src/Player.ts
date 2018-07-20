module JAFBC {

	export class Player extends Phaser.Sprite {

		isFalling:boolean = false;
		collided:boolean = false;

		constructor(game: Phaser.Game, x: number, y: number) {

			super(game, x, y, 'flappy', 0);

			this.game.physics.arcade.enableBody(this);
			this.body.acceleration.y = 500;
			this.body.maxVelocity.y = 400;
			this.isFalling = false;
			this.collided = false;
			
			this.anchor.setTo(0.5, 0.5);

			this.animations.add('fly', [0, 1, 2, 1], 10, true);
			this.animations.play('fly');

			game.add.existing(this);

			//this.inputEnabled = true;
			//this.events.onInputDown.add(this.onTap, this);
			game.input.onTap.add(this.onTap, this);
		}

		onTap() {
			if (!this.collided) {
				console.log("tap");
				this.body.velocity.y = -240;
			}
		}

		update() {
		}
	}

}