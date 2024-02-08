/// <reference path="./types/index.d.ts" />

const diagStyle = {
    fontFamily: 'DM Mono',
    fontSize: '20px',
    color: 'black',
    wordWrap: {
        width: 600,
        useAdvancedWrap: true
    }
}

const statStyle = {
    fontFamily: 'DM Mono',
    fontSize: '20px',
    color: 'white'
}

class GamePlay extends Phaser.Scene {

    constructor(title) {
        super(title);
        this.database = {};
        this.dialogueContainer = null;
        this.currentPartner = null;
        this.action = 'intro';
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

        this.buttonsEnabled = true;
    };

    preload() {
        this.load.image("background", "assets/Pictures/bg_concrete.jpg");

        this.load.json('tempdialogue', 'assets/TEMPMestdialogue.json');

    };

    create() {
        this.database = this.cache.json.get('tempdialogue');
        this.bg = this.add.image(0, 0, "background");
        this.bg.setOrigin(0, 0);
        WebFont.load({
            //Need this, because we are using Google Fonts. This makes everything easier
            google: {
                families: ['DM Mono']
            },
            active: () => {
                
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

                this.buttonContainer = this.add.container(this.game.config.width / 4, this.game.config.height - 100);


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
                        if (this.buttonsEnabled) {
                            this.handleActionClick(text);
                        }
                    });
                    button.on("pointerover", () => {
                        if (this.buttonsEnabled) {
                            selectButtonTween.play();
                        }
                    });
                    button.on("pointerout", () => {
                        if (this.buttonsEnabled) {
                            unselectButtonTween.play();
                        }
                    });

                    this.buttonContainer.add(button);
                });

                this.writeRandomDialogueWithFixedType('intro', diagStyle, this.currentPartner);
            }
        })
    };

    writeRandomDialogueWithFixedType(type, style, id = null) {
        let dialoguesWithType = this.database.dialogues.convo.filter(dialogue => dialogue.type === type);

        if (id !== null) {
            dialoguesWithType = dialoguesWithType.filter(dialogue => dialogue.id === id);
        }
        if (dialoguesWithType.length === 0) {
            console.error("Some issue idk");
            return;
        }
        const randomIndex = Phaser.Math.Between(0, dialoguesWithType.length - 1);
        const dialogue = dialoguesWithType[randomIndex];
        if (typeof id === 'undefined') {
            id = null;
        }
        if (dialogue) {
            this.createDialogueContainer();
            this.displayDialogue(dialogue.talk, style);
            this.currentPartner = dialogue.id;
        } else {
            console.error("Dialogue not found");
        }
    }

    createDialogueContainer() {
        this.dialogueContainer = this.add.container(50, 200);
    }

    displayDialogue(text, style) {
        if (this.dialogueText) {
            this.dialogueText.destroy();
        }

        // Create a new text object to display the dialogue
        this.dialogueText = this.add.text(0, 0, text, style);
        this.dialogueContainer.add(this.dialogueText);
    }

    findDialogue(id, type) {
        const convo = this.database.dialogues.convo;
        randhelper = Phaser.Math.Between(0,1);
        for (let i = 0; i < convo.length; i++) {
            if (convo[i].id === id && convo[i].type === type) {
                return convo[i+randhelper];
            }
        }
        return null;
    }

    update() {
    };

    handleActionClick(text) {
        WebFont.load({
            google: {
                families: ['DM Mono']
            },
            active: () => {
                switch (text) {
                    case 'Tarhálsz':
                        this.writeRandomDialogueWithFixedType('tar', diagStyle, this.currentPartner);
                        break;
                    case 'Menekülsz':
                        this.writeRandomDialogueWithFixedType('men', diagStyle, this.currentPartner);
                        break;
                    case 'Együttműködsz':
                        this.writeRandomDialogueWithFixedType('egy', diagStyle, this.currentPartner);
                        break;
                    default:
                        break;
                }
            }
        });
    };

    //This might will be final someday
    updateCigi(number) {
        if (this.stats.cigi > 0) {
            this.stats.cigi += number;
            this.cigiText.setText(`Cigi: ${this.stats.cigi}`);
        }
        if (this.stats.cigi <= 0) {
            this.buttonsEnabled = false;
            this.cameras.main.fadeOut(2000);
            this.cameras.main.on(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('death');
            });
        }
    }
}