/// <reference path="./types/index.d.ts" />

const mainMenu = new MainMenu('mainmenu');
const gamePlay = new GamePlay('gameplay');
const deathScene = new DeathScene('death');

const game = new Phaser.Game({
    width: 800,
    height: 600,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    type: Phaser.AUTO, // CANVAS, WEBGL, AUTO
    scene: [gamePlay, deathScene]
});