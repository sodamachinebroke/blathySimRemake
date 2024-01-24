/// <reference path="./types/index.d.ts" />

class GamePlay extends Phaser.Scene {

    constructor(title) {
        super(title);
    }

    init() {

        //Basic statistics
        this.stats = {
            cigi: 1,
            onb: 1
        }

        //Requirements to win, these are temporary
        this.winReqs = {
            cigi: 10,
            onb: 10
        }

    };

    preload() {

    };

    create() {
        

        //Temporary to track certain variables
        this.cigiText = this.add.text(0, 0, `Cigi: ${this.stats.cigi}`, {
            font: '24px Arial',
            color: 'white'
        });
        this.cigiText.setOrigin(0,0);

        this.onbText = this.add.text(0, 30, `Önbecsülés: ${this.stats.onb}`, {
            font: '24px Arial',
            color: 'white'
        });

        this.onbText.setOrigin(0,0);

        //Final-ish stat-tracking container here
        this.statContainer = this.add.container(10, 10);
        const statBG = this.add.rectangle(0,0,360, 150, 0x848484,1);

        this.statContainer.add(statBG);
        this.statContainer.add(this.cigiText);
        this.statContainer.add(this.onbText);

        

        /*const buttonTexts = ['Tarhálsz', 'Menekülsz', 'Együttműködsz'];
        buttonTexts.forEach((text, index) =>{
            const button = this.add.text(
                200,
                10 + index 
                )
        })*/

        this.createTextButton(this, this.game.config.width / 6, this.game.config.height - 100, 'Tarhálsz', () => this.updateCigi(1));
        this.createTextButton(this, 3 * this.game.config.width / 6, this.game.config.height - 100, 'Menekülsz', () => this.updateCigi(-1));
        this.createTextButton(this, 5 * this.game.config.width / 6, this.game.config.height - 100, 'Együttműködsz', () => this.updateCigi(-1));
    };

    createTextButton(scene, x, y, label, onClick) {
        this.textButton = scene.add.text(x, y, label, {
            font: '24px Arial',
            color: 'white',
        })
            .setOrigin(0.5)
            .setPadding(20)
            .setInteractive({ useHandCursor: true });

        //Tween for button hovered over
        const selectButtonTween = this.tweens.add({
            targets: [this.textButton],
            alpha: 0.7,
            scale: 1.5,
            duration: 200,
            paused: true,
            persist: true,
        });

        const unselectButtonTween = this.tweens.add({
            targets: [this.textButton],
            alpha: 1,
            scale: 1,
            duration: 300,
            paused: true,
            persist: true,
        })
        this.textButton
            .on('pointerdown', () => {
                onClick();
            })
            .on('pointerover', () => {
                selectButtonTween.play();
            })
            .on('pointerout', () => {
                unselectButtonTween.play();

                this.textButton.alpha = 1;
            });

        return this.textButton;
    }

    update() {

    };

    //This might will be final someday
    updateCigi(number) {
        if (this.stats.cigi > 0) {
            this.stats.cigi += number;
            this.cigiText.setText(`Cigi: ${this.stats.cigi}`);
        }
        if (this.stats.cigi <= 0) {
            this.cameras.main.fadeOut(2000);

            this.cameras.main.on(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('death');
            });
        }
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
        }).setInteractive({ useHandCursor: true });

        const selectButtonTween = this.tweens.add({
            targets: [this.restartButton],
            alpha: 0.7,
            duration: 200,
            paused: true,
            persist: true
        });


    }

}