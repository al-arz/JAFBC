module JAFBC {

	export class Preloader extends Phaser.State {

		preloadBar: Phaser.Sprite;
		background: Phaser.Sprite;
		ready: boolean = false;

		preload() {

			//	These are the assets we loaded in Boot.js
			this.preloadBar = this.add.sprite(0, this.game.world.centerY, 'preloadBar');

			//	This sets the preloadBar sprite as a loader sprite.
			//	What that does is automatically crop the sprite from 0 to full-width
			//	as the files below are loaded in.
			this.load.setPreloadSprite(this.preloadBar);

			//	Here we load the rest of the assets our game needs.
			//	As this is just a Project Template I've not provided these assets, swap them for your own.
			this.load.image('bg', 'assets/bg-light.png');
			this.load.image('logo', 'assets/logo.png');
			this.load.spritesheet('flappy', 'assets/flappy-yellow.png', 34, 24, 3);
			this.load.image('ground', 'assets/ground.png');
			this.load.image('tube', 'assets/tube.png');
			this.load.bitmapFont('digits', 'assets/font/font.png', 'assets/font/font.xml');
			this.load.image('go-label', 'assets/gameover-label.png');
			this.load.image('go-panel', 'assets/gameover-panel.png');
			this.load.image('play', 'assets/play.png');
			
			/*
			this.load.audio('die', 'assets/sfx/die.ogg', true);
			this.load.audio('wing', 'assets/sfx/wing.ogg', true);
			this.load.audio('hit', 'assets/sfx/hit.ogg', true);
			this.load.audio('swoosh', 'assets/sfx/swoosh.ogg', true);
			this.load.audio('point', 'assets/sfx/point.ogg', true);
			*/
		}

		create() {
			this.game.state.start('Menu');
		}
	}
}