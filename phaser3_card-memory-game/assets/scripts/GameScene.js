let score = 0;
let gameOver = false; // Add a flag to track if the game has started

class GameScene extends Phaser.Scene {
    constructor() {
        super("Game");
        this.coins = 0;
        this.isPaused = false;
        this.isStarted = false;
    
    }

    preload() {
        this.load.image('bg', "assets/sprites/bg.png");
        this.load.image('card', "assets/sprites/card.png");
        for (let value of config.allCards) {
            this.load.image(`card${value}`, `assets/sprites/card${value}.png`);
        }
        this.load.audio('card', "assets/sounds/card.mp3");
        this.load.audio('complete', "assets/sounds/complete.mp3");
        this.load.image('pause', "assets/sprites/pause.png")
        this.load.audio('success', "assets/sounds/success.mp3");
        this.load.audio('theme', "assets/sounds/theme.mp3");
        this.load.audio('timeout', "assets/sounds/timeout.mp3");
    }

    createSounds() {
        this.sounds = {
            card: this.sound.add('card'),
            complete: this.sound.add('complete'),
            success: this.sound.add('success'),
            theme: this.sound.add('theme', { volume: 0.1 }),
            timeout: this.sound.add('timeout'),
        };
        this.sounds.theme.loop = true;
        this.sounds.theme.play();
    }

    create() {
        this.currentScore = 0;
        this.currentLevel = config.level;
        this.maxLevel = Object.keys(config.levels)[Object.keys(config.levels).length - 1];
        this.createSounds();
        this.createBackground();
        this.createPauseButton();
        this.createTimer();
        this.createText();
        this.updateScore();
        this.start();
    }

    createPauseButton() {
        this.pauseButton = this.add.image(config.width - 10, 10, 'pause')
            .setOrigin(1, 0)
            .setInteractive();

        this.pauseButton.on('pointerup', () => {
            this.togglePause();
        });
    }

     togglePause() {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            this.timer.paused = true;
            this.input.stopPropagation();
            this.scene.pause();
        } else {
            this.timer.paused = false;
            this.input.stopPropagation();
            this.scene.resume();
            if (!this.isStarted) { // Hanya mulai permainan jika belum dimulai
                this.start();
            }
        }
    }

    update() {
        if (this.isPaused) {
            return;
        }
        // Update game logic here...
    }

    


    createBackground(){
        this.add.sprite(0, 0, 'bg').setOrigin(0);
    }

    onTimerTick(){
        this.timeoutText.setText(`Time: ${this.timeout}`);
        if (this.timeout <= 0 && !gameOver) {
            gameOver = true;
            this.timer.paused = true;
            this.sounds.timeout.play();
            this.showGameOver();
        }
        else {
            this.timeout--;
        }
    }

    createTimer(){
        this.timer = this.time.addEvent({
            delay: 1000,
            callback: this.onTimerTick,
            callbackScope: this,
            loop: true,
        });
    }

    showGameOver() {
        this.add.text(config.width / 2, config.height / 2 - 75, 'Game Over', { 
            fontSize: '52px pinkchiken', 
            fill: '#ff0000' 
        }).setOrigin(0.5);
        this.scoreText = this.add.text(config.width / 2, config.height / 2, `Score: ${this.currentScore}`, { 
            fontSize: '24px pinkchiken', 
            fill: '#ffffff' 
        }).setOrigin(0.5);
    
       
        this.cards.forEach(card => {
            card.setVisible(false); 
            card.destroy(); 
        });
    
        const restartButton = this.add.text(config.width / 2, config.height / 2 + 70, 'Restart', { 
            fontSize: '24px pinkchiken', 
            fill: '#00ff00' 
        }).setOrigin(0.5);
        restartButton.setInteractive();
        restartButton.on('pointerdown', () => {
            this.scene.restart();
        });
    }

    createText(){
        this.levelText = this.add.text(48, config.height/2 - 75, '', {
            font: '32px pinkchicken',
            fill: '#fff',
        }).setOrigin(0, 0.5);
        this.scoreText = this.add.text(48, config.height/2, '', {
            font: '32px pinkchicken',
            fill: '#fff',
        }).setOrigin(0, 0.5);
        this.timeoutText = this.add.text(48, config.height/2 + 75, '', {
            font: '32px pinkchicken',
            fill: '#fff',
        }).setOrigin(0, 0.5);
        this.coinsText = this.add.text(48, config.height/2 + 150, `Coins: ${this.coins}`, {
        font: '32px pinkchicken',
        fill: '#fff',
        }).setOrigin(0, 0.5);
    }

    updateScore(score){
        if (!score) {
            this.scoreText.setText(`Score: ${this.currentScore}`);
        }
        else {
            let newScore = Number(this.currentScore) + Number(score);
            this.currentScore = newScore;
            this.scoreText.setText(`Score: ${this.currentScore}`);
        }
    }

    start() {
        score = 0;
        this.coins = 0;
        gameOver = false;
        this.isStarted = true;
        console.log('start');
        this.config = {
            rows: config.levels[this.currentLevel].rows,
            cols: config.levels[this.currentLevel].cols,
            timeout: config.levels[this.currentLevel].timer,
            cards: config.levels[this.currentLevel].cards,
        };
        this.levelText.setText(`Level: ${this.currentLevel}/${this.maxLevel}`);
        this.createCards();
        this.initCardsPositions();
        this.timeout = this.config.timeout;
        this.timer.paused = false;
        this.openedCard = null;
        this.openedCardsCount = 0;
        this.streak = 0;
        this.mistake = false;
        this.initCards();
        this.showCards();
        this.isStarted = true; // Set the flag to indicate the game has started
    }
    
    restart(){
        if (!this.isStarted) {
            return;
        }
        this.isStarted = false;
        let count = 0;
        let onCardMoveComplete = () => {
            count++;
            if (count >= this.cards.length) {
                this.start();
            }
        };
        this.cards.forEach(card => {
            card.move({
                x: config.width + card.width,
                y: config.height + card.height,
                delay: card.position.delay,
                callback: onCardMoveComplete,
            });
        });
    }

    initCards(){
        let positions = Phaser.Utils.Array.Shuffle(this.positions);

        this.cards.forEach(card => {
            card.init(positions.pop());
        })
    }

    showCards(){
        this.cards.forEach(card => {
            card.depth = card.position.delay;
            card.move({
                x: card.position.x,
                y: card.position.y,
                delay: card.position.delay,
            })
        });
    }

    createCards(){
        this.cards = [];
        for (let value of this.config.cards) {
            for(let i = 0; i < 2; i++) {
                const card = new Card(this, value);
                if (value === 11) {
                    card.setName('card11'); // Tambahkan ini untuk memberikan nama 'card11' ke kartu 
                }
                this.cards.push(card);
            }
        }
        this.input.on("gameobjectdown", this.onCardClicked, this);
    }

    onCardClicked(pointer, card) {
        if (gameOver) {
            return; // Tidak memproses klik jika game over
        }
    
        console.log('Card clicked:', card.name);
        if (card.opened) {
            return false;
        }
    
        this.sounds.card.play();
    
        if (this.openedCard) {
            if (this.openedCard.value === card.value) {
                // Kartu cocok
                if (card.name === 'card11') {
                    this.coins++; // Tambah 1 koin jika kartu 'card11' diklik
                    console.log(`Coins: ${this.coins}`);
                    this.coinsText.setText(`Coins: ${this.coins}`);
                }
                this.sounds.success.play();
                this.openedCard = null;
                this.openedCardsCount++;
                this.streak++;
                this.mistake = false;
    
                switch (this.streak) {
                    case 1: this.updateScore(5);
                        break;
                    case 2: this.updateScore(10);
                        break;
                    case 3: this.updateScore(15);
                        break;
                    case 4: this.updateScore(20);
                        break;
                    case 5: this.updateScore(25);
                        break;
                    default: this.updateScore(30); // Perubahan pada kasus default
                }
            } else {
                // Kartu tidak cocok
                this.openedCard.close();
                this.openedCard = card;
                this.streak = 0;
                this.mistake = true;
            }
        } else {
            this.openedCard = card;
        }
        card.open();
    
        if (this.openedCardsCount === this.cards.length / 2) {
            if (this.currentLevel < this.maxLevel) {
                this.currentLevel++;
            } else {
                // Semua level telah selesai, tampilkan game over
                gameOver = true;
                this.showGameOver();
                return;
            }
            this.sounds.complete.play();
            this.restart();
            this.updateScore(25 * this.currentLevel);
        }
    }
    
    initCardsPositions(){
        let positions = [];
        let gap = 2;
        let cardTexture = this.textures.get('card').getSourceImage();
        let cardWidth = cardTexture.width + gap;
        let cardHeight = cardTexture.height + gap;
        let offsetX = (config.width - cardWidth * this.config.cols) / 2 + cardWidth / 2;
        let offsetY = (config.height - cardHeight * this.config.rows) / 2 + cardHeight / 2;
    
        let counter = 0;
        for (let row = 0; row < this.config.rows; row++) {
            for (let col = 0; col < this.config.cols; col++) {
                counter++;
                positions.push({
                    x: offsetX + col * cardWidth,
                    y: offsetY + row * cardHeight,
                    delay: counter * 100,
                })
            }
        }
    
        this.positions = positions;
    }
}
