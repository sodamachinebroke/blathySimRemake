/// <reference path="./types/index.d.ts" />

class GamePlay extends Phaser.Scene{

    constructor(title){
        super(title);
    }

    init(){

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

        //These are interaction options
        this.actions = [
            {
                key: 'Tarhálsz',
                setXY: {
                    x: 0,
                    y: 600,
                }
            },

            {
                key: 'Együttműködsz',
                setXY: {
                    x: 200,
                    y: 600
                }
            },
            {
                key: 'Menekülsz',
                setXY: {
                    x: 400,
                    y: 600
                }
            }
        ]
    };

    preload(){

    };

    create(){

        //Temporary to track certain variables
        this.cigiText = this.add.text(20, 50, `Cigi: ${this.stats.cigi}`,{
            font: '24px Arial',
            color: 'white'
        });

        this.onbText = this.add.text(20, 80, `Önbecsülés: ${this.stats.onb}`,{
            font: '24px Arial',
            color: 'white' 
        });

        
        //Debug purposes
        this.input.keyboard.on('keydown-B', () => {
            this.updateCigi(1);
        });

        this.input.keyboard.on('keydown-V', () => {
            this.updateCigi(-1);
        });


        //This is where science stopped lmao
        this.options = this.add.group(this.actions);

        Phaser.Actions.Call(this.options.getChildren(), (option) => {
            option.setInteractive();

            const index = this.options.getChildren().indexOf(option);
            option.setData('key', this.actions[index].key);

            const selectButtonTween = this.tweens.add({
                targets: option,
                alpha: 0.7,
                duration: 200,
                paused:true,
                persist: true
            });

            option.on('pointerdown', () => {

            });

            option.on('pointerover', () => {
                selectButtonTween.play();
            });

            option.on('pointerout', () => {
                selectButtonTween.pause();
                selectButtonTween.reset();
                option.alpha = 1;
            })

        });

    };

    update(){

        
        
        

    };

    //This might actually be final
    updateCigi(number){
        if (this.stats.cigi > 0){
            this.stats.cigi += number;
            this.cigiText.setText(`Cigi: ${this.stats.cigi}`);
        }
        if (this.stats.cigi <=0){
            this.gameOver();
        }
    }

    gameOver(){
        
        this.add.text(200, 200, `Meghaltál lol`, {
            font: '48px Arial',
            color: 'red'
        });
        this.restartGame();
    }

    restartGame(){

        this.restartButton = this.add.text(200, 400, 'Restart Game', {
            font: '24px Arial',
            color: 'white'
        }).setInteractive();
        
       

    }

}