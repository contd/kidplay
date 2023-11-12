import Phaser from 'phaser'
import './main.css'

import MainScene from './MainScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 300 },
		},
	},
	scene: [MainScene],
}

export default new Phaser.Game(config)
