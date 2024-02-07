/// <reference path="./types/index.d.ts" />

class DeathScene extends Phaser.Scene {
    constructor(title) {
        super(title);
    }
    create(){
        this.cameras.main.fadeIn(3000);
        this.gameOver();
    }
    gameOver() {

        this.add.text(200, 200, `Meghaltál lol`, {
            font: '48px Arial',
            color: 'red'
        });
        this.restartGame();
    }

    restartGame() {
        
        this.restartButton = this.add.text(200, 400, 'Restart Game', {
            font: '24px Arial',
            color: 'white'
        }).setInteractive({useHandCursor: true});

        const selectButtonTween = this.tweens.add({
            targets: [this.restartButton],
            alpha: 0.7,
            duration: 200,
            paused: true,
            persist: true
        });

        this.restartButton.on("pointerdown", () => {
            this.scene.start("mainmenu");
        });
    }
}