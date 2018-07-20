module JAFBC {

	export class Tube extends Phaser.Sprite { //Replace with Gate class (pair of tubes)

        passed: boolean = false;
        isUpper: boolean;

		constructor(game: Phaser.Game, x:number, y:number, isUpper:boolean) {

            super(game, x, y, 'tube', 0);
            this.anchor.setTo(0, 1);
            if (!isUpper)
                this.scale.y = -1;
                
            this.game.physics.arcade.enableBody(this);
            this.body.immovable = true;
            this.isUpper = isUpper;
        }

		update() {
        }

	}

}