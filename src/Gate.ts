module JAFBC {

	export class Gate extends Phaser.Group {

        upperTube: Tube;
        lowerTube: Tube;
        passed: boolean = false;
        triggered: boolean = false;
        static readonly GAP: number = 100;

		constructor(game: Phaser.Game) {

            super(game);
            this.upperTube = new Tube(game, 0, 0, true);
            this.lowerTube = new Tube(game, 0, 0, false);
            this.add(this.upperTube);
            this.add(this.lowerTube);

        }
        
        //gapY is a bottom of the upper tube
        setParams(x: number, gapY: number) {
            this.x = x;
            this.upperTube.position.set(0, gapY);
            this.lowerTube.position.set(0, gapY + Gate.GAP);
        }

		update() {
            
        }
	}

}