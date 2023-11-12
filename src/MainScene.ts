import Phaser from 'phaser'

let platforms: Phaser.Physics.Arcade.StaticGroup, 
		player: Phaser.Physics.Arcade.Sprite, 
		cursors: Phaser.Types.Input.Keyboard.CursorKeys, 
		stars: Phaser.Physics.Arcade.Group, 
		score: integer = 0, 
		scoreText: Phaser.GameObjects.Text, 
		bombs: Phaser.Physics.Arcade.Group, 
		gameOver = false

export default class MainScene extends Phaser.Scene {
	constructor() {
		super('hello-world')
	}

	preload() {
		// this.load.setBaseURL('https://labs.phaser.io')
		this.load.image('sky', 'assets/sky.png')
    this.load.image('ground', 'assets/platform.png')
    this.load.image('star', 'assets/star.png')
    this.load.image('bomb', 'assets/bomb.png')
    this.load.spritesheet('dude', 
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    )
	}

	create() {
		this.add.image(400, 300, 'sky')

		platforms = this.physics.add.staticGroup()

    platforms.create(400, 568, 'ground').setScale(2).refreshBody()

    platforms.create(600, 400, 'ground')
    platforms.create(50, 250, 'ground')
    platforms.create(750, 220, 'ground')

		player = this.physics.add.sprite(100, 450, 'dude')

		player.setBounce(0.2)
		player.setCollideWorldBounds(true)

		this.anims.create({
				key: 'left',
				frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
				frameRate: 10,
				repeat: -1
		})

		this.anims.create({
				key: 'turn',
				frames: [ { key: 'dude', frame: 4 } ],
				frameRate: 20
		})

		this.anims.create({
				key: 'right',
				frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
				frameRate: 10,
				repeat: -1
		})

		stars = this.physics.add.group({
				key: 'star',
				repeat: 15,
				setXY: { x: 12, y: 0, stepX: 50 }
		});

		stars.children.iterate((child) => {
				child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
		})
		bombs = this.physics.add.group()
		scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' })

		this.physics.add.collider(player, platforms)
		this.physics.add.collider(stars, platforms)
		this.physics.add.collider(bombs, platforms)

		this.physics.add.overlap(player, stars, this.collectStar, null, this)
		this.physics.add.collider(player, bombs, this.hitBomb, null, this)

		const x = Phaser.Math.Between(400, 800)
		const bomb = bombs.create(x, 16, 'bomb')
		bomb.setBounce(1)
		bomb.setCollideWorldBounds(true)
		bomb.setVelocity(Phaser.Math.Between(-200, 200), 20)
		bomb.allowGravity = false
	}

	update() {
		if (gameOver) {
			return
		}

		cursors = this.input.keyboard.createCursorKeys()

		if (cursors.left.isDown) {
				player.setVelocityX(-160)

				player.anims.play('left', true)
		} else if (cursors.right.isDown) {
				player.setVelocityX(160)

				player.anims.play('right', true)
		} else {
				player.setVelocityX(0)

				player.anims.play('turn')
		}

		if ((cursors.up.isDown || cursors.space.isDown) && player.body.touching.down) {
				player.setVelocityY(-330)
		}
	}

	collectStar(player: Phaser.Physics.Arcade.Sprite, star: Phaser.Physics.Arcade.Sprite) {
		star.disableBody(true, true)
		score += 5
		scoreText.setText('Score: ' + score)

		if (stars.countActive(true) === 0) {
        //  A new batch of stars to collect
        stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true)
        })
        const x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400)

        const bomb = bombs.create(x, 16, 'bomb')
        bomb.setBounce(1)
        bomb.setCollideWorldBounds(true)
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20)
        bomb.allowGravity = false
    }
	}

	hitBomb(player: Phaser.Physics.Arcade.Sprite) {
    this.physics.pause()
    player.setTint(0xff0000)
    player.anims.play('turn')
    gameOver = true
		this.gameOver()
	}

	gameOver() {
		this.scene.restart()
		return
	}
}
