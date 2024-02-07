/// <reference path="./types/index.d.ts" />

class MainMenu extends Phaser.Scene {
    create(){
        this.scene.start('gameplay');
    };
}