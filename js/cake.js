document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const cakeElement = document.querySelector('.cake');
    const toggleCandleBtn = document.getElementById('toggleCandle');
    const cutCakeBtn = document.getElementById('cutCake');
    const decorateBtn = document.getElementById('decorateCake');
    const resetCakeBtn = document.getElementById('resetCake');
    const decorationOptions = document.querySelector('.decoration-options');
    const decorationItems = document.querySelectorAll('.decoration-option');
    const cancelDesignBtn = document.getElementById('cancelDesign');
    const saveDesignBtn = document.getElementById('saveDesign');
    const cakeMessage = document.querySelector('.cake-message');
    const wishConfetti = document.querySelector('.wish-confetti');
    const submitWishBtn = document.getElementById('submitWish');
    const wishText = document.getElementById('wishText');
    const cakeToppings = document.querySelector('.cake-toppings');
    
    // State
    let candleLit = true;
    let cakeCut = false;
    let currentCakeColor = '#f8c9d1';
    let currentToppings = [];
    
    // Initialize cake
    initCake();
    
    function initCake() {
        // Set initial cake colors
        document.querySelector('.layer-bottom').style.backgroundColor = currentCakeColor;
        document.querySelector('.layer-middle').style.backgroundColor = shadeColor(currentCakeColor, -20);
        document.querySelector('.layer-top').style.backgroundColor = shadeColor(currentCakeColor, -40);
        document.querySelectorAll('.drip').forEach(drip => {
            drip.style.backgroundColor = shadeColor(currentCakeColor, -40);
        });

        // Create notification element
        const notification = document.createElement('div');
        notification.id = 'wish-notification';
        notification.className = 'wish-notification hidden';
        document.body.appendChild(notification);
    }
    
    // Helper function to shade colors
    function shadeColor(color, percent) {
        let R = parseInt(color.substring(1,3), 16);
        let G = parseInt(color.substring(3,5), 16);
        let B = parseInt(color.substring(5,7), 16);

        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);

        R = (R<255)?R:255;  
        G = (G<255)?G:255;  
        B = (B<255)?B:255;  

        R = Math.round(R);
        G = Math.round(G);
        B = Math.round(B);

        const RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
        const GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
        const BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

        return "#"+RR+GG+BB;
    }
    
    // Show custom notification
    function showNotification(message, type = 'success') {
        const notification = document.getElementById('wish-notification');
        notification.textContent = message;
        notification.className = `wish-notification ${type}`;
        
        // Show notification
        setTimeout(() => {
            notification.classList.remove('hidden');
        }, 10);
        
        // Hide after 3 seconds
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 3000);
    }
    
    // Candle toggle functionality
    toggleCandleBtn.addEventListener('click', function() {
        candleLit = !candleLit;
        const flame = document.querySelector('.flame');
        
        if (candleLit) {
            // Relight candle
            flame.classList.remove('out');
            flame.style.animation = 'flicker 1s infinite alternate';
            toggleCandleBtn.innerHTML = '<i class="fas fa-fire"></i><span class="btn-text">Blow Out Candle</span>';
            
            // Hide wish message
            cakeMessage.classList.remove('active');
            wishConfetti.innerHTML = '';
        } else {
            // Blow out candle
            flame.classList.add('out');
            flame.style.animation = 'none';
            toggleCandleBtn.innerHTML = '<i class="fas fa-magic"></i><span class="btn-text">Light Candle</span>';
            
            // Show wish message with confetti
            cakeMessage.classList.add('active');
            createConfetti(wishConfetti);
            
            // Confetti effect
            party.confetti(flame, {
                count: 100,
                spread: 30,
                size: 1.5
            });
            
            // Play sound effect
            playSound('blow');
        }
    });
    
    // Cut cake functionality
    cutCakeBtn.addEventListener('click', function() {
        if (cakeCut) return;
        
        cakeCut = true;
        cakeElement.classList.add('cut');
        cutCakeBtn.disabled = true;
        
        // Play sound effect
        playSound('cut');
        
        // Confetti effect
        party.confetti(cakeElement, {
            count: 50,
            size: 1.5
        });
        
        // Create cake crumbs
        createCrumbs();
    });
    
    // Create cake crumbs effect
    function createCrumbs() {
        for (let i = 0; i < 15; i++) {
            const crumb = document.createElement('div');
            crumb.className = 'crumb';
            crumb.style.left = `${50 + (Math.random() * 30 - 15)}%`;
            crumb.style.bottom = `${50 + (Math.random() * 30 - 15)}%`;
            crumb.style.backgroundColor = shadeColor(currentCakeColor, -40);
            crumb.style.width = `${5 + Math.random() * 10}px`;
            crumb.style.height = `${5 + Math.random() * 10}px`;
            crumb.style.transform = `rotate(${Math.random() * 360}deg)`;
            crumb.style.animation = `fall ${1 + Math.random() * 2}s forwards`;
            
            document.querySelector('.cake').appendChild(crumb);
            
            // Remove after animation
            setTimeout(() => {
                crumb.remove();
            }, 3000);
        }
    }
    
    // Decorate cake functionality
    decorateBtn.addEventListener('click', function() {
        decorationOptions.classList.toggle('hidden');
    });
    
    cancelDesignBtn.addEventListener('click', function() {
        decorationOptions.classList.add('hidden');
    });
    
    // Handle decoration selection
    decorationItems.forEach(item => {
        item.addEventListener('click', function() {
            const color = this.getAttribute('data-color');
            const topping = this.getAttribute('data-topping');
            
            if (color) {
                // Change cake color
                currentCakeColor = color;
                document.querySelector('.layer-bottom').style.backgroundColor = color;
                document.querySelector('.layer-middle').style.backgroundColor = shadeColor(color, -20);
                document.querySelector('.layer-top').style.backgroundColor = shadeColor(color, -40);
                document.querySelectorAll('.drip').forEach(drip => {
                    drip.style.backgroundColor = shadeColor(color, -40);
                });
                
                // Play sound effect
                playSound('color');
            }
            
            if (topping) {
                // Add topping
                addTopping(topping);
                
                // Play sound effect
                playSound('sprinkle');
                
                // Sparkle effect
                party.sparkles(this, {
                    count: 30,
                    speed: 100,
                    size: 1.5
                });

                // Show notification
                showNotification(`Added ${topping} to your cake!`, 'success');
            }
        });
    });
    
    // Add topping to cake
    function addTopping(type) {
        // Add to current toppings
        currentToppings.push(type);
        
        // Create visual topping elements
        for (let i = 0; i < 5; i++) {
            const topping = document.createElement('div');
            topping.className = 'topping';
            topping.style.backgroundImage = `url('assets/${type}.png')`;
            
            // Random position on cake
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 60;
            const x = 50 + Math.cos(angle) * radius;
            const y = 50 + Math.sin(angle) * radius;
            
            topping.style.left = `${x}%`;
            topping.style.top = `${y}%`;
            topping.style.animationDelay = `${Math.random() * 2}s`;
            
            // Random size
            const size = 15 + Math.random() * 15;
            topping.style.width = `${size}px`;
            topping.style.height = `${size}px`;
            
            cakeToppings.appendChild(topping);
        }
    }
    
    // Save design
    saveDesignBtn.addEventListener('click', function() {
        decorationOptions.classList.add('hidden');
        
        // Confetti celebration
        party.confetti(cakeElement, {
            count: 50,
            size: 1.5,
            spread: 20
        });
        
        // Play sound effect
        playSound('success');

        // Show notification
        showNotification('Cake design saved successfully!', 'success');
    });
    
    // Reset cake
    resetCakeBtn.addEventListener('click', function() {
        // Reset cake colors
        currentCakeColor = '#f8c9d1';
        document.querySelector('.layer-bottom').style.backgroundColor = currentCakeColor;
        document.querySelector('.layer-middle').style.backgroundColor = shadeColor(currentCakeColor, -20);
        document.querySelector('.layer-top').style.backgroundColor = shadeColor(currentCakeColor, -40);
        document.querySelectorAll('.drip').forEach(drip => {
            drip.style.backgroundColor = shadeColor(currentCakeColor, -40);
        });
        
        // Reset candle if blown out
        if (!candleLit) {
            candleLit = true;
            const flame = document.querySelector('.flame');
            flame.classList.remove('out');
            flame.style.animation = 'flicker 1s infinite alternate';
            toggleCandleBtn.innerHTML = '<i class="fas fa-fire"></i><span class="btn-text">Blow Out Candle</span>';
        }
        
        // Reset cut state
        if (cakeCut) {
            cakeCut = false;
            cakeElement.classList.remove('cut');
            cutCakeBtn.disabled = false;
        }
        
        // Clear toppings
        currentToppings = [];
        cakeToppings.innerHTML = '';
        
        // Hide message
        cakeMessage.classList.remove('active');
        wishConfetti.innerHTML = '';
        
        // Confetti effect
        party.confetti(this, {
            count: 30,
            spread: 20
        });
        
        // Play sound effect
        playSound('reset');

        // Show notification
        showNotification('Cake has been reset!', 'info');
    });
    
    // Submit wish
    submitWishBtn.addEventListener('click', function() {
        if (wishText.value.trim() === '') {
            showNotification('Please enter your wish before submitting!', 'error');
            return;
        }
        
        // Show custom notification
        showNotification('✨ Your wish has been sent to the universe! ✨', 'success');
        
        // Clear the textarea
        wishText.value = '';
        
        // Confetti celebration
        party.confetti(submitWishBtn, {
            count: 100,
            spread: 30
        });
        
        // Play sound effect
        playSound('magic');
    });
    
    // Create confetti effect
    function createConfetti(container) {
        if (!container) return;
        container.innerHTML = '';
        
        const colors = ['#ff6b6b', '#ff8e8e', '#ffb8b8', '#ffde59', '#ff9e7d', '#a5ffd6', '#88d8b0'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 2 + 's';
            container.appendChild(confetti);
        }
    }
    
    // Play sound effects
    function playSound(type) {
        const sounds = {
            blow: 'assets/sounds/blow.mp3',
            cut: 'assets/sounds/cut.mp3',
            color: 'assets/sounds/color.mp3',
            sprinkle: 'assets/sounds/sprinkle.mp3',
            success: 'assets/sounds/success.mp3',
            reset: 'assets/sounds/reset.mp3',
            magic: 'assets/sounds/magic.mp3'
        };
        
        if (sounds[type]) {
            const audio = new Audio(sounds[type]);
            audio.volume = 0.3;
            audio.play().catch(e => console.log('Audio play failed:', e));
        }
    }
    
    // Add CSS for crumbs and notification
    const customStyle = document.createElement('style');
    customStyle.textContent = `
        .crumb {
            position: absolute;
            border-radius: 50%;
            z-index: 5;
            animation-timing-function: cubic-bezier(0.1, 0.8, 0.9, 1);
        }
        
        @keyframes fall {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100px) rotate(180deg); opacity: 0; }
        }
        
        .wish-notification {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 25px;
            border-radius: 30px;
            color: white;
            font-weight: 600;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            opacity: 0;
            transition: all 0.3s ease;
            text-align: center;
            max-width: 80%;
            pointer-events: none;
        }
        
        .wish-notification.success {
            background-color: #4CAF50;
        }
        
        .wish-notification.error {
            background-color: #F44336;
        }
        
        .wish-notification.info {
            background-color: #2196F3;
        }
        
        .wish-notification:not(.hidden) {
            opacity: 1;
            transform: translateX(-50%) translateY(10px);
        }
    `;
    document.head.appendChild(customStyle);
});