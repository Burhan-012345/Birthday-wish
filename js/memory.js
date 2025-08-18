document.addEventListener('DOMContentLoaded', function() {
    // Game elements
    const welcomeScreen = document.getElementById('welcome-screen');
    const gameContainer = document.getElementById('game-container');
    const gameBoard = document.getElementById('game-board');
    const restartButton = document.getElementById('restart-btn');
    const newGameButton = document.getElementById('new-game-btn');
    const startButton = document.getElementById('start-btn');
    const scoreElement = document.getElementById('score');
    const movesElement = document.getElementById('moves');
    const timeElement = document.getElementById('time');
    const difficultySelect = document.getElementById('difficulty');
    const highScoreElement = document.getElementById('high-score').querySelector('span');
    const confettiContainer = document.getElementById('confetti-container');
    const balloonContainer = document.getElementById('balloon-container');
    const celebrationOverlay = document.getElementById('celebration-overlay');
    
    // Countdown elements
    const countdownDays = document.getElementById('countdown-days');
    const countdownHours = document.getElementById('countdown-hours');
    const countdownMinutes = document.getElementById('countdown-minutes');
    const countdownSeconds = document.getElementById('countdown-seconds');
    
    // Audio elements
    const cardFlipSound = document.getElementById('card-flip-sound');
    const matchSound = document.getElementById('match-sound');
    const winSound = document.getElementById('win-sound');
    const celebrationSound = document.getElementById('celebration-sound');

    // Game state
    let cards = [];
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let score = 0;
    let moves = 0;
    let timer;
    let seconds = 0;
    let matchedPairs = 0;
    let totalPairs = 0;
    let highScore = localStorage.getItem('madamJiiMemoryHighScore') || 0;
    let currentFinalScore = 0;
    
    // Madam Jii's birthday (September 16)
    const birthday = new Date();
    birthday.setMonth(8); // September (0-indexed)
    birthday.setDate(16);
    
    // If birthday has passed this year, set for next year
    if (birthday < new Date()) {
        birthday.setFullYear(birthday.getFullYear() + 1);
    }

    // Birthday-themed card icons
    const cardIcons = [
        'fa-birthday-cake', 'fa-gift', 'fa-balloon', 'fa-glass-cheers',
        'fa-crown', 'fa-music', 'fa-star', 'fa-heart',
        'fa-candy-cane', 'fa-ice-cream', 'fa-champagne-glasses', 'fa-party-horn',
        'fa-bell', 'fa-trophy', 'fa-sparkles', 'fa-face-laugh-beam'
    ];

    // Start the game
    startButton.addEventListener('click', function() {
        welcomeScreen.style.opacity = '0';
        setTimeout(() => {
            welcomeScreen.style.display = 'none';
            gameContainer.classList.add('show');
            initGame();
        }, 500);
        
        // Create celebration balloons
        createCelebrationBalloons(30);
    });

    // Initialize a new game
    function initGame() {
        // Reset game state
        score = 0;
        moves = 0;
        seconds = 0;
        matchedPairs = 0;
        scoreElement.textContent = score;
        movesElement.textContent = moves;
        timeElement.textContent = seconds;
        
        // Clear any existing timer
        clearInterval(timer);
        
        // Load high score
        highScore = localStorage.getItem('madamJiiMemoryHighScore') || 0;
        highScoreElement.textContent = highScore;
        
        // Show loading state
        gameBoard.innerHTML = `
            <div class="loader">
                <div class="loader-spinner"></div>
                <p>Preparing your birthday game...</p>
            </div>
        `;
        
        // Set default difficulty to easy (4x4)
        difficultySelect.value = 'easy';
        
        // Determine grid size based on difficulty
        let gridSize;
        switch(difficultySelect.value) {
            case 'easy':
                gridSize = 4;
                break;
            case 'hard':
                gridSize = 8;
                break;
            default:
                gridSize = 6;
        }
        
        totalPairs = (gridSize * gridSize) / 2;
        
        // Create cards after a short delay (for loading effect)
        setTimeout(() => {
            createCards(gridSize);
        }, 1000);
    }

    // Create the card grid
    function createCards(gridSize) {
        // Clear the board
        gameBoard.innerHTML = '';
        
        // Create memory grid
        const memoryGrid = document.createElement('div');
        memoryGrid.className = 'memory-grid';
        memoryGrid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        
        // Determine how many unique icons we need
        const uniqueIcons = cardIcons.slice(0, totalPairs);
        
        // Duplicate icons to create pairs
        const cardContents = [...uniqueIcons, ...uniqueIcons];
        
        // Shuffle the cards
        cardContents.sort(() => Math.random() - 0.5);
        
        // Create card elements
        cards = [];
        cardContents.forEach((icon, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.icon = icon;
            card.dataset.index = index;
            
            card.innerHTML = `
                <div class="card-face card-back">
                    <i class="fas fa-question"></i>
                </div>
                <div class="card-face card-front">
                    <i class="fas ${icon}"></i>
                </div>
            `;
            
            card.addEventListener('click', flipCard);
            memoryGrid.appendChild(card);
            cards.push(card);
        });
        
        gameBoard.appendChild(memoryGrid);
        
        // Start the timer when first card is clicked
        cards.forEach(card => {
            card.addEventListener('click', startTimer, { once: true });
        });
    }

    // Flip a card
    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;
        if (this.classList.contains('matched')) return;
        
        // Play card flip sound
        cardFlipSound.currentTime = 0;
        cardFlipSound.play();
        
        this.classList.add('flip');
        
        if (!hasFlippedCard) {
            // First click
            hasFlippedCard = true;
            firstCard = this;
            return;
        }
        
        // Second click
        secondCard = this;
        moves++;
        movesElement.textContent = moves;
        
        checkForMatch();
    }

    // Check if cards match
    function checkForMatch() {
        const isMatch = firstCard.dataset.icon === secondCard.dataset.icon;
        
        if (isMatch) {
            // Match found
            disableCards();
            score += 10 * (difficultySelect.value === 'easy' ? 1 : difficultySelect.value === 'hard' ? 3 : 2);
            scoreElement.textContent = score;
            matchedPairs++;
            
            // Play match sound
            matchSound.play();
            
            // Mini celebration for each match
            createMiniCelebration();
            
            // Check if game is complete
            if (matchedPairs === totalPairs) {
                endGame();
            }
        } else {
            // No match
            lockBoard = true;
            unflipCards();
        }
    }

    // Disable matched cards
    function disableCards() {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        
        resetBoard();
    }

    // Unflip unmatched cards
    function unflipCards() {
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            
            resetBoard();
        }, 1000);
    }

    // Reset board state
    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    // Start the game timer
    function startTimer() {
        // Only start timer once
        cards.forEach(card => {
            card.removeEventListener('click', startTimer);
        });
        
        timer = setInterval(() => {
            seconds++;
            timeElement.textContent = seconds;
        }, 1000);
    }

    // End the game
    function endGame() {
        clearInterval(timer);
        
        // Calculate final score (higher score for faster completion)
        const timeBonus = Math.max(0, 300 - seconds) * (difficultySelect.value === 'easy' ? 0.5 : difficultySelect.value === 'hard' ? 1.5 : 1);
        const movesBonus = Math.max(0, (totalPairs * 2) - moves) * 2;
        currentFinalScore = score + timeBonus + movesBonus;
        
        // Update high score if current score is higher
        if (currentFinalScore > highScore) {
            highScore = Math.round(currentFinalScore);
            localStorage.setItem('madamJiiMemoryHighScore', highScore);
            highScoreElement.textContent = highScore;
        }
        
        // Play win sounds
        winSound.play();
        celebrationSound.play();
        
        // Big celebration
        showConfetti();
        createCelebrationBalloons(100);
        
        // Show celebration overlay
        showCelebrationOverlay(currentFinalScore);
    }

    // Create mini celebration for matches
    function createMiniCelebration() {
        for (let i = 0; i < 5; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            confetti.style.animationDuration = `${Math.random() * 2 + 1}s`;
            confetti.style.animationDelay = `${Math.random() * 0.5}s`;
            
            // Random shape
            if (Math.random() > 0.5) {
                confetti.style.borderRadius = '50%';
            }
            
            confettiContainer.appendChild(confetti);
            
            // Remove after animation
            setTimeout(() => {
                confetti.remove();
            }, 2000);
        }
    }

    // Show celebration overlay
    function showCelebrationOverlay(finalScore) {
        celebrationOverlay.innerHTML = `
            <div class="celebration-content">
                <h2>🎉 You Did It! 🎉</h2>
                <p>You've matched all the birthday pairs Madam Jii!</p>
                
                <div class="stats-container">
                    <div class="stat-item">
                        <span>Final Score:</span>
                        <strong>${Math.round(finalScore)}</strong>
                    </div>
                    <div class="stat-item">
                        <span>Time:</span>
                        <strong>${seconds} seconds</strong>
                    </div>
                    <div class="stat-item">
                        <span>Moves:</span>
                        <strong>${moves}</strong>
                    </div>
                    <div class="stat-item">
                        <span>High Score:</span>
                        <strong>${highScore}</strong>
                    </div>
                </div>
                
                <p>Wishing Madam Jii a wonderful birthday celebration!</p>
                
                <div class="share-buttons">
                    <button class="share-btn whatsapp" onclick="shareScore('whatsapp')">
                        <i class="fab fa-whatsapp"></i> Share
                    </button>
                    <button class="share-btn instagram" onclick="shareScore('instagram')">
                        <i class="fab fa-instagram"></i> Share
                    </button>
                </div>
                
                <button id="close-celebration" class="btn" style="margin-top: 1.5rem;">
                    <i class="fas fa-thumbs-up"></i> Awesome!
                </button>
            </div>
        `;
        
        celebrationOverlay.classList.add('show');
        
        document.getElementById('close-celebration').addEventListener('click', () => {
            celebrationOverlay.classList.remove('show');
        });
    }

    // Show celebration confetti
    function showConfetti() {
        confettiContainer.innerHTML = '';
        
        // Create different shapes of confetti
        const shapes = ['circle', 'rect', 'triangle'];
        const colors = [
            '#ff6b6b', '#ff8e8e', '#ffb8b8', 
            '#ff85a2', '#a162e8', '#57c4e5',
            '#ffde59', '#a5ffd6', '#9c27b0'
        ];
        
        for (let i = 0; i < 200; i++) {
            const confetti = document.createElement('div');
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            const size = Math.random() * 10 + 5;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            confetti.style.backgroundColor = color;
            confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
            confetti.style.animationDelay = `${Math.random() * 0.5}s`;
            
            // Apply different shapes
            if (shape === 'circle') {
                confetti.style.borderRadius = '50%';
            } else if (shape === 'triangle') {
                confetti.style.width = '0';
                confetti.style.height = '0';
                confetti.style.backgroundColor = 'transparent';
                confetti.style.borderLeft = `${size/2}px solid transparent`;
                confetti.style.borderRight = `${size/2}px solid transparent`;
                confetti.style.borderBottom = `${size}px solid ${color}`;
            }
            
            confettiContainer.appendChild(confetti);
        }
        
        setTimeout(() => {
            confettiContainer.innerHTML = '';
        }, 5000);
    }

    // Create celebration balloons
    function createCelebrationBalloons(count) {
        balloonContainer.innerHTML = '';
        const colors = ['#ff6b6b', '#ff85a2', '#a162e8', '#57c4e5', '#ffde59', '#a5ffd6'];
        
        for (let i = 0; i < count; i++) {
            const balloon = document.createElement('div');
            balloon.className = 'balloon';
            balloon.style.left = `${Math.random() * 100}vw`;
            balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            balloon.style.animationDuration = `${Math.random() * 10 + 10}s`;
            balloon.style.animationDelay = `${Math.random() * 5}s`;
            
            // Random size
            const size = Math.random() * 20 + 30;
            balloon.style.width = `${size}px`;
            balloon.style.height = `${size * 1.2}px`;
            
            balloonContainer.appendChild(balloon);
            
            // Remove after animation
            setTimeout(() => {
                balloon.remove();
            }, 15000);
        }
    }

    // Create balloons for welcome screen
    function createBalloons(count) {
        const colors = ['#ff6b6b', '#ff85a2', '#a162e8', '#57c4e5', '#ffde59', '#a5ffd6'];
        
        for (let i = 0; i < count; i++) {
            const balloon = document.createElement('div');
            balloon.className = 'balloon';
            balloon.style.left = `${Math.random() * 100}vw`;
            balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            balloon.style.animationDuration = `${Math.random() * 10 + 10}s`;
            balloon.style.animationDelay = `${Math.random() * 5}s`;
            
            // Random size
            const size = Math.random() * 20 + 30;
            balloon.style.width = `${size}px`;
            balloon.style.height = `${size * 1.2}px`;
            
            document.querySelector('.balloons').appendChild(balloon);
        }
    }
    
    // Update birthday countdown
    function updateCountdown() {
        const now = new Date();
        const diff = birthday - now;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        countdownDays.textContent = days;
        countdownHours.textContent = hours.toString().padStart(2, '0');
        countdownMinutes.textContent = minutes.toString().padStart(2, '0');
        countdownSeconds.textContent = seconds.toString().padStart(2, '0');
    }
    
    // Event listeners
    restartButton.addEventListener('click', initGame);
    newGameButton.addEventListener('click', function() {
        // Reset game with new difficulty
        initGame();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Space or Enter to restart game
        if ((e.key === ' ' || e.key === 'Enter') && celebrationOverlay.classList.contains('show')) {
            document.getElementById('close-celebration')?.click();
        }
    });

    // Global function for social sharing
    window.shareScore = function(platform) {
        const message = `I scored ${Math.round(currentFinalScore)} points in Madam Jii's Birthday Memory Match! Can you beat my score?`;
        
        if (platform === 'whatsapp') {
            // Redirect to specific WhatsApp number with score message
            window.open(`https://wa.me/7019670262?text=${encodeURIComponent(message)}`, '_blank');
        } else if (platform === 'instagram') {
            // Redirect to specific Instagram profile (note: can't pre-fill message in URL)
            window.open('https://www.instagram.com/obito_x_failure_', '_blank');
            
            // Show message for Instagram since we can't pre-fill it
            setTimeout(() => {
                alert(`Copy this message to share on Instagram:\n\n${message}`);
            }, 1000);
        }
    };
    
    // Initialize countdown and balloons
    setInterval(updateCountdown, 1000);
    updateCountdown();
    createBalloons(15);
});