module JAFBC {

	export class Game extends Phaser.Game {

		constructor() {
			
			super(320, 480, Phaser.AUTO, 'content', null);

			this.state.add('Boot', Boot, false);
			this.state.add('Preloader', Preloader, false);
			this.state.add('Menu', Menu, false);
			this.state.add('GameState', GameState, false);

			this.state.start('Boot');
		}

	}

}