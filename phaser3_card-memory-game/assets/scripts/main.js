let scene = new GameScene();

let config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    scale: {
        mode: Phaser.Scale.ENVELOP,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    levels: {
        1: {
            rows: 1,
            cols: 4,
            cards: [1, 12],
            timer: 5,
        },
        2: {
            rows: 2,
            cols: 3,
            cards: [3,11, 2],
            timer: 10,
        },
        3: {
            rows: 2,
            cols: 4,
            cards: [1, 11, 3, 2],
            timer: 13,
        },
        4: {
            rows: 2,
            cols: 5,
            cards: [1, 2, 11, 4, 3],
            timer: 17,
        },
        5: {
            rows: 3,
            cols: 4,
            cards: [1, 2, 3, 4, 5, 11],
            timer: 20,
        },
        6: {
            rows: 3,
            cols: 6,
            cards: [1, 2, 3, 4, 5, 6, 7, 8, 11],
            timer: 35,
        },
        7: {
            rows: 4,
            cols: 6,
            cards: [11, 2, 3, 4, 5, 6, 7, 8, 9],
            timer: 35,
        },
        8: {
            rows: 4,
            cols: 7,
            cards: [11, 10, 3, 4, 5, 6, 7, 8, 9],
            timer: 35,
        },
        9: {
            rows: 4,
            cols: 8,
            cards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
            timer: 80,
        },
    },
    level: 1,
    allCards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    scene: new GameScene(),
};

let game = new Phaser.Game(config);
