/// <reference path="./types/index.d.ts" />

class GamePlay extends Phaser.Scene {

    constructor(title) {
        super(title);

        this.parsedConvos = null;
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

        //this.uiLock = false;
    };

    preload() {
        this.load.image("background", "assets/Pictures/bg_concrete.jpg");

    };

    create() {
        this.bg = this.add.image(0, 0, "background");
        this.bg.setOrigin(0, 0);
        WebFont.load({
            //Need this, because we are using Google Fonts. This makes everything easier
            google: {
                families: ['DM Mono']
            },
            active: () => {
                var statStyle = {
                    fontFamily: 'DM Mono',
                    fontSize: '20px',
                    color: 'white'
                }
                var convoStyle = {
                    fontFamily: 'DM Mono',
                    fontSize: '20px',
                    color: 'black'
                }
                this.cigiText = this.add.text(0, 0, `Cigi: ${this.stats.cigi}`, statStyle);
                this.cigiText.setOrigin(0, 0);

                this.onbText = this.add.text(0, 35, `Önbecsülés: ${this.stats.onb}`, statStyle);
                this.onbText.setOrigin(0, 0);

                //Final-ish stat-tracking container here
                this.statContainer = this.add.container(10, 10);
                const statBG = this.add.rectangle(0, 0, 360, 150, 0x848484, 1);

                this.statContainer.add(statBG);
                this.statContainer.add(this.cigiText);
                this.statContainer.add(this.onbText);

                this.buttonContainer = this.add.container(this.game.config.width / 4, this.game.config.height - 100)

                // Container for the interactable buttons
                const buttonTexts = ['Tarhálsz', 'Menekülsz', 'Együttműködsz'];
                buttonTexts.forEach((text, index) => {

                    const button = this.add.text(
                        index * this.game.config.width / 4,
                        0,
                        text,
                        {
                            font: '24px Arial',
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
                        this.handleActionClick(text);
                    });
                    button.on("pointerover", () => {
                        selectButtonTween.play();
                    });
                    button.on("pointerout", () => {
                        unselectButtonTween.play();
                    });

                    this.buttonContainer.add(button);
                });

                this.fetchAndParseJsonData('assets/TEMPdialogue.json', this.parsedConvos);
                //this.displayParsedData(this.parsedConvos,convoStyle);
            }
        })
    };

    update() {

    };

    //This one parses JSON data
    fetchAndParseJsonData(filepath, outputVar) {
        fetch(filepath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(parsedData => {
                outputVar = parsedData;

                this.displayParsedData(this.parsedConvos, {fontFamily: 'DM Mono',
                fontSize: '20px',
                color: 'black'})
            })
            .catch(error => {
                console.error('Error fetching or parsing JSON: ', error);
            });
    };

    displayParsedData(parsedjson,style) {
        if (parsedjson) {
            const introTalksContent = this.getIntroTalksContent();
            this.add.text(100, 100, introTalksContent, style);
        }
        else {
            console.error('Parsed data unavailable');
        }
    }

    getIntroTalksContent() {
        const introTalks = parsedData.dialogues.convo.filter(talk => talk.type === 'intro');
        const introTalksContent = introTalks.map(talk => talk.talk.join('\n')).join('\n\n');
    }

    handleActionClick(text) {
        switch (text) {
            case 'Tarhálsz':
                this.updateCigi(1);
                break;
            case 'Menekülsz':
                this.updateCigi(-1);
                break;
            case 'Együttműködsz':
                //this.updateCigi(-1);
                console.log("együtműdksidz");
                break;
            default:
                break;
        }
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
}