/// <reference path="./types/index.d.ts" />

class MainMenu extends Phaser.Scene {

    constructor(title) {
        super(title);
    }

    init(){
        this.buttonsEnabled = true;
    }

    preload(){
        this.load.image("mainmenu","../assets/Pictures/blathy.png");
    };

    create(){
        this.bg = this.add.image(0, 0, "mainmenu");
        this.bg.setOrigin(0, 0);

        WebFont.load({
            //Need this, because we are using Google Fonts. This makes everything easier
            google: {
                families: ['Honk']
            },
            active: () => {
                var titleStyle = {
                    fontFamily: 'Honk',
                    fontSize: '100px',
                    align: 'center'
                }

                this.titleText = this.add.text(this.game.config.width / 2, this.game.config.height - 750, `Bláthy Sim:\nRelive The Horrors`, titleStyle);
                this.titleText.setOrigin(0.5);

                this.buttonContainer = this.add.container(this.game.config.width / 2, this.game.config.height - 200);
                const buttonTexts = ['Játék'];
                buttonTexts.forEach((text, index) => {

                    const button = this.add.text(
                        index * this.game.config.width / 4,
                        0,
                        text,
                        {
                            font: '32px Arial',
                            color: 'white',
                            fill: "#000",
                            strokeThickness: 10
                        }
                    )
                    .setInteractive({ useHandCursor: true })
                    .setOrigin(0.5)
                    .setPadding(20);

                    //Tween for button hovered over
                    const selectButtonTween = this.tweens.add({
                        targets: button,
                        scale: 1.5,
                        duration: 200,

                        paused: true,
                        persist: true,
                    });
                    const unselectButtonTween = this.tweens.add({
                        targets: button,
                        scale: 1,
                        duration: 200,
                        paused: true,
                        persist: true,
                    });

                    button.on("pointerdown", () => {
                        if (this.buttonsEnabled) {
                            this.buttonsEnabled = false;
                            this.cameras.main.fadeOut(1000);
                            this.cameras.main.on(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                            this.scene.start("gameplay"); 
                            });
                        } 
                    });
                    button.on("pointerover", () => {
                        selectButtonTween.play();   
                    });
                    button.on("pointerout", () => {
                        unselectButtonTween.play();   
                    });

                    this.buttonContainer.add(button);
                });
            }
        });
    };

    update() {
    };
}