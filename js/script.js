document.addEventListener('DOMContentLoaded', function() {
    // First hide the loader initially to prevent flash
    const loader = document.querySelector('.loader');
    if (loader) loader.style.opacity = 0;

    // Initialize WebGL background
    const initWebGLBackground = () => {
        try {
            const canvas = document.getElementById('webglBackground');
            if (!canvas) return;
            
            const renderer = new THREE.WebGLRenderer({ 
                canvas, 
                alpha: true,
                antialias: true 
            });
            renderer.setSize(window.innerWidth, window.innerHeight);
            
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 5;
            
            const particlesGeometry = new THREE.BufferGeometry();
            const particleCount = 1500;
            
            const posArray = new Float32Array(particleCount * 3);
            for(let i = 0; i < particleCount * 3; i++) {
                posArray[i] = (Math.random() - 0.5) * 10;
            }
            
            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
            
            const particlesMaterial = new THREE.PointsMaterial({
                size: 0.02,
                color: getComputedStyle(document.documentElement).getPropertyValue('--primary-color'),
                transparent: true,
                opacity: 0.8
            });
            
            const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
            scene.add(particlesMesh);
            
            function animate() {
                requestAnimationFrame(animate);
                particlesMesh.rotation.x += 0.0002;
                particlesMesh.rotation.y += 0.0003;
                renderer.render(scene, camera);
            }
            animate();
            
            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });
        } catch (error) {
            console.error('WebGL initialization error:', error);
        }
    };

    // Initialize Lottie animations
    const initLottieAnimations = () => {
        try {
            if (document.getElementById('lottieLoader')) {
                lottie.loadAnimation({
                    container: document.getElementById('lottieLoader'),
                    renderer: 'svg',
                    loop: true,
                    autoplay: true,
                    path: 'https://assets9.lottiefiles.com/packages/lf20_5njp3vgg.json'
                });
            }
            
            if (document.getElementById('lottieHeart')) {
                lottie.loadAnimation({
                    container: document.getElementById('lottieHeart'),
                    renderer: 'svg',
                    loop: true,
                    autoplay: true,
                    path: 'https://assets1.lottiefiles.com/packages/lf20_5njp3vgg.json'
                });
            }
        } catch (error) {
            console.error('Lottie initialization error:', error);
        }
    };

    // 3D Gift Box interaction
    const initGiftBox = () => {
        const giftBox = document.getElementById('giftBox');
        if (!giftBox) return;
        
        let isOpen = false;
        
        giftBox.addEventListener('click', () => {
            isOpen = !isOpen;
            
            if (isOpen) {
                gsap.to('.gift-lid', { 
                    rotationX: -60,
                    duration: 1,
                    ease: "elastic.out(1, 0.5)"
                });
                
                party.confetti(giftBox, {
                    count: 100,
                    spread: 30,
                    size: 1.5
                });
                
                const audio = new Audio('gift-open.mp3');
                audio.volume = 0.3;
                audio.play().catch(e => console.log('Audio play failed:', e));
            } else {
                gsap.to('.gift-lid', { 
                    rotationX: 0,
                    duration: 0.5,
                    ease: "back.out(2)"
                });
            }
        });
        
        giftBox.addEventListener('mouseenter', () => {
            gsap.to('.gift-bow', {
                y: -5,
                duration: 0.5,
                repeat: 1,
                yoyo: true,
                ease: "sine.inOut"
            });
        });
    };

    // Theme selector functionality
    const initThemeSelector = () => {
        const updateThemeColors = (theme) => {
            const root = document.documentElement;
            switch(theme) {
                case 'purple':
                    root.style.setProperty('--primary-color', '#9c27b0');
                    root.style.setProperty('--secondary-color', '#ba68c8');
                    root.style.setProperty('--accent-color', '#e1bee7');
                    break;
                case 'blue':
                    root.style.setProperty('--primary-color', '#2196f3');
                    root.style.setProperty('--secondary-color', '#64b5f6');
                    root.style.setProperty('--accent-color', '#bbdefb');
                    break;
                case 'gold':
                    root.style.setProperty('--primary-color', '#ff9800');
                    root.style.setProperty('--secondary-color', '#ffb74d');
                    root.style.setProperty('--accent-color', '#ffe0b2');
                    break;
                case 'dark':
                    root.style.setProperty('--primary-color', '#6b21a8');
                    root.style.setProperty('--secondary-color', '#9333ea');
                    root.style.setProperty('--accent-color', '#c084fc');
                    root.style.setProperty('--dark-color', '#f3f4f6');
                    root.style.setProperty('--light-color', '#1f2937');
                    document.body.style.backgroundColor = '#111827';
                    break;
                default:
                    root.style.setProperty('--primary-color', '#ff6b6b');
                    root.style.setProperty('--secondary-color', '#ff8e8e');
                    root.style.setProperty('--accent-color', '#ffb8b8');
                    root.style.setProperty('--dark-color', '#333');
                    root.style.setProperty('--light-color', '#fff');
                    document.body.style.backgroundColor = '#f9f9f9';
            }
        };

        document.querySelectorAll('.theme-option').forEach(button => {
            button.addEventListener('click', function() {
                const theme = this.getAttribute('data-theme');
                document.body.className = theme;
                localStorage.setItem('selectedTheme', theme);
                updateThemeColors(theme);
                
                party.sparkles(this, {
                    count: 30,
                    speed: 100,
                    size: 1.5
                });
            });
        });

        const savedTheme = localStorage.getItem('selectedTheme') || 'default';
        document.body.className = savedTheme;
        updateThemeColors(savedTheme);
    };

    // Balloon interactions
    const initBalloons = () => {
        const balloons = document.querySelectorAll('.balloon');
        balloons.forEach(balloon => {
            const speed = parseFloat(balloon.getAttribute('data-speed')) || 1;
            gsap.to(balloon, {
                y: -20,
                duration: 3 * speed,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });

            balloon.addEventListener('click', function() {
                if (this.classList.contains('popped')) return;
                this.classList.add('popped');
                
                party.confetti(this, {
                    count: 40,
                    spread: 20,
                    size: 1.2
                });
                
                const audio = new Audio('balloon-pop.mp3');
                audio.volume = 0.2;
                audio.play().catch(e => console.log('Audio play failed:', e));
                
                gsap.to(this, {
                    y: -1000,
                    opacity: 0,
                    duration: 3,
                    ease: "power1.out",
                    onComplete: () => this.remove()
                });
            });
        });
    };

    // Poem Generator
    const initPoemGenerator = () => {
        const poemDatabase = [
            {
                title: "Celebration Time",
                lines: [
                    "The candles glow, the cake is sweet,",
                    "This birthday makes our lives complete.",
                    "Your presence is a gift so rare,",
                    "Showing us all how much you care.",
                    "May all your dreams take flight this year,",
                    "Filled with love and lots of cheer!"
                ],
                mood: "happy"
            },
            {
                title: "Special Day",
                lines: [
                    "Another year, another rhyme,",
                    "Celebrating you, it's always the right time!",
                    "Your wisdom shines, your heart so pure,",
                    "Of your wonderful spirit, we're all sure.",
                    "May happiness follow wherever you go,",
                    "And your life continue to beautifully grow."
                ],
                mood: "inspirational"
            },
            {
                title: "Joyful Wishes",
                lines: [
                    "Today we celebrate your light,",
                    "That makes the whole world shine so bright.",
                    "Your kindness touches every heart,",
                    "Setting you wonderfully apart.",
                    "May this year be your best one yet,",
                    "Filled with joy you'll never forget!"
                ],
                mood: "joyful"
            }
        ];

        function displayPoem(poem) {
            const poemContainer = document.getElementById('poemText');
            if (!poemContainer) return;
            
            poemContainer.innerHTML = '';
            
            const title = document.createElement('h3');
            title.className = `poem-title ${poem.mood}`;
            title.textContent = poem.title;
            poemContainer.appendChild(title);
            
            const linesContainer = document.createElement('div');
            linesContainer.className = 'poem-lines-container';
            
            poem.lines.forEach(line => {
                const lineElement = document.createElement('p');
                lineElement.className = 'poem-line';
                lineElement.textContent = line;
                linesContainer.appendChild(lineElement);
            });
            
            poemContainer.appendChild(linesContainer);
            
            gsap.from(title, { 
                duration: 0.6, 
                opacity: 0, 
                y: -20, 
                ease: "back.out(1.7)" 
            });
            
            gsap.from(".poem-line", { 
                duration: 0.5, 
                opacity: 0, 
                y: 20, 
                stagger: 0.15, 
                ease: "power2.out", 
                delay: 0.3 
            });
            
            const moodColor = poem.mood === 'happy' ? 'var(--secondary-color)' : 
                            poem.mood === 'inspirational' ? 'var(--accent-color)' : 'var(--primary-color)';
            
            gsap.to('.poem-card', {
                duration: 1,
                boxShadow: `0 10px 30px ${moodColor}44`,
                ease: "sine.out"
            });
        }

        const generateBtn = document.getElementById('generatePoem');
        if (generateBtn) {
            generateBtn.addEventListener('click', function() {
                gsap.to(this, {
                    scale: 0.9,
                    duration: 0.2,
                    yoyo: true,
                    repeat: 1,
                    ease: "power2.inOut"
                });
                
                const poemContainer = document.getElementById('poemText');
                poemContainer.innerHTML = `
                    <div class="loader-poem">
                        <div class="dot-flashing"></div>
                        <p>Generating your personalized poem...</p>
                    </div>
                `;
                
                setTimeout(() => {
                    const randomPoem = poemDatabase[Math.floor(Math.random() * poemDatabase.length)];
                    displayPoem(randomPoem);
                    
                    party.confetti(poemContainer, {
                        count: 30,
                        spread: 20
                    });
                }, 800);
            });
            
            setTimeout(() => {
                const randomPoem = poemDatabase[Math.floor(Math.random() * poemDatabase.length)];
                displayPoem(randomPoem);
            }, 500);
        }
    };

    // Guestbook functionality
    const initGuestbook = () => {
        const entries = JSON.parse(localStorage.getItem('guestbookEntries')) || [];
        const entriesContainer = document.getElementById('guestbookEntries');
        const submitBtn = document.getElementById('submitGuestbook');
        
        if (!entriesContainer || !submitBtn) return;
        
        function renderEntries() {
            entriesContainer.innerHTML = '';
            
            entries.slice().reverse().forEach(entry => {
                const entryEl = document.createElement('div');
                entryEl.className = 'guestbook-entry';
                entryEl.innerHTML = `
                    <h4>${entry.name}</h4>
                    <p>${entry.message}</p>
                    <small>${new Date(entry.date).toLocaleString()}</small>
                `;
                entriesContainer.appendChild(entryEl);
            });
        }
        
        submitBtn.addEventListener('click', function() {
            const nameInput = document.getElementById('guestName');
            const messageInput = document.getElementById('guestMessage');
            const name = nameInput.value.trim();
            const message = messageInput.value.trim();
            
            if (name && message) {
                const newEntry = {
                    name,
                    message,
                    date: new Date().toISOString()
                };
                
                entries.push(newEntry);
                localStorage.setItem('guestbookEntries', JSON.stringify(entries));
                
                renderEntries();
                
                nameInput.value = '';
                messageInput.value = '';
                
                party.sparkles(this, {
                    count: 30,
                    speed: 50
                });
                
                const audio = new Audio('message-sent.mp3');
                audio.volume = 0.3;
                audio.play().catch(e => console.log('Audio play failed:', e));
            }
        });
        
        renderEntries();
    };

    // AR Viewer Implementation
    const initARViewer = () => {
        const openAR = document.getElementById('openAR');
        if (!openAR) return;

        openAR.addEventListener('click', async () => {
            try {
                // Create AR overlay
                const arOverlay = document.getElementById('arOverlay');
                arOverlay.innerHTML = `
                    <div class="ar-loading">
                        <div class="ar-spinner"></div>
                        <p>Loading AR experience...</p>
                    </div>
                `;
                arOverlay.style.display = 'block';

                // Load required AR scripts
                await loadARScripts();
                
                // Create AR scene
                createARScene();
            } catch (error) {
                console.error('AR initialization failed:', error);
                const arOverlay = document.getElementById('arOverlay');
                if (arOverlay) {
                    arOverlay.innerHTML = `
                        <div class="ar-error">
                            <i class="fas fa-exclamation-triangle"></i>
                            <p>Failed to load AR viewer</p>
                            <p>Please try again later or check if your device supports AR</p>
                            <button id="closeAR" class="ar-close-btn">
                                <i class="fas fa-times"></i> Close
                            </button>
                        </div>
                    `;
                    document.getElementById('closeAR').addEventListener('click', () => {
                        arOverlay.style.display = 'none';
                    });
                }
            }
        });

        // Load AR scripts dynamically
        const loadARScripts = () => {
            return new Promise((resolve, reject) => {
                if (window.AFRAME) {
                    resolve();
                    return;
                }

                const aframeScript = document.createElement('script');
                aframeScript.src = 'https://aframe.io/releases/1.2.0/aframe.min.js';
                aframeScript.onload = () => {
                    const arjsScript = document.createElement('script');
                    arjsScript.src = 'https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js';
                    arjsScript.onload = resolve;
                    arjsScript.onerror = reject;
                    document.body.appendChild(arjsScript);
                };
                aframeScript.onerror = reject;
                document.body.appendChild(aframeScript);
            });
        };

        // Create AR scene
        const createARScene = () => {
            const arOverlay = document.getElementById('arOverlay');
            if (!arOverlay) return;

            arOverlay.innerHTML = `
                <div class="ar-container">
                    <a-scene embedded arjs="sourceType: webcam; debugUIEnabled: false;" vr-mode-ui="enabled: false">
                        <a-assets>
                            <a-asset-item id="birthdayModel" src="models/birthday-card.glb"></a-asset-item>
                        </a-assets>
                        <a-marker preset="hiro">
                            <a-entity 
                                position="0 0.5 0"
                                scale="0.5 0.5 0.5"
                                gltf-model="#birthdayModel"
                                animation-mixer="clip: *; timeScale: 0.5">
                            </a-entity>
                        </a-marker>
                        <a-entity camera></a-entity>
                    </a-scene>
                </div>
                <button id="closeAR" class="ar-close-btn">
                    <i class="fas fa-times"></i>
                </button>
                <div class="ar-instructions">
                    <p>Point your camera at a flat surface to view the AR card</p>
                </div>
            `;

            document.getElementById('closeAR').addEventListener('click', () => {
                arOverlay.style.display = 'none';
            });
        };
    };

    // Social Sharing with Platform Redirects
    const initSocialSharing = () => {
        const shareBtn = document.getElementById('shareBtn');
        const socialButtons = document.querySelectorAll('.social-btn');
        
        if (shareBtn) {
            shareBtn.addEventListener('click', async () => {
                try {
                    await navigator.share({
                        title: 'Happy Birthday Madam Jii!',
                        text: 'Check out this beautiful birthday website!',
                        url: window.location.href
                    });
                } catch (err) {
                    const shareUrl = `https://twitter.com/intent/tweet?text=Check%20out%20this%20beautiful%20birthday%20website%20for%20Madam%20Jii!&url=${encodeURIComponent(window.location.href)}`;
                    window.open(shareUrl, '_blank');
                }
            });
        }
        
        socialButtons.forEach(button => {
            button.addEventListener('click', function() {
                const platform = this.classList.contains('facebook') ? 'facebook' :
                               this.classList.contains('twitter') ? 'twitter' : 'whatsapp';
                
                let shareUrl = '';
                const shareText = 'Check out this beautiful birthday website for Madam Jii!';
                const currentUrl = encodeURIComponent(window.location.href);
                
                switch(platform) {
                    case 'facebook':
                        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;
                        break;
                    case 'twitter':
                        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${currentUrl}`;
                        break;
                    case 'whatsapp':
                        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${window.location.href}`)}`;
                        break;
                }
                
                const redirectMessage = document.createElement('div');
                redirectMessage.className = 'social-redirect-message';
                redirectMessage.innerHTML = `
                    <p>Redirecting to ${platform.charAt(0).toUpperCase() + platform.slice(1)}...</p>
                    <p>If you're not redirected automatically, <a href="${shareUrl}" target="_blank">click here</a></p>
                `;
                
                const socialContainer = document.querySelector('.social-sharing');
                if (socialContainer) {
                    const existingMessage = document.querySelector('.social-redirect-message');
                    if (existingMessage) {
                        existingMessage.remove();
                    }
                    socialContainer.appendChild(redirectMessage);
                }
                
                setTimeout(() => {
                    window.open(shareUrl, '_blank');
                }, 500);
            });
        });
    };

    // Music player controls
    const initMusicPlayer = () => {
        const musicFrame = document.getElementById('musicFrame');
        if (!musicFrame) return;
        
        let musicPlayerReady = false;
        let musicInitialized = false;
        
        window.addEventListener('message', (e) => {
            if (e.data.action === 'musicPlayerReady') {
                musicPlayerReady = true;
                updateMusicButton();
            } else if (e.data.action === 'musicStatus') {
                updateMusicButton(e.data.playing);
            }
        });
        
        if (!document.getElementById('musicToggle')) {
            const musicToggle = document.createElement('button');
            musicToggle.id = 'musicToggle';
            musicToggle.className = 'music-toggle control-btn';
            musicToggle.innerHTML = '<i class="fas fa-music"></i> <span>Music: Loading...</span>';
            document.body.appendChild(musicToggle);
            
            musicToggle.addEventListener('click', toggleMusic);
        }
        
        function updateMusicButton(playing) {
            const musicToggle = document.getElementById('musicToggle');
            if (!musicToggle) return;
            
            if (playing === undefined) {
                const wasPlaying = localStorage.getItem('musicPlaying') === 'true';
                musicToggle.innerHTML = wasPlaying 
                    ? '<i class="fas fa-pause"></i> <span>Music: On</span>'
                    : '<i class="fas fa-play"></i> <span>Music: Off</span>';
            } else {
                musicToggle.innerHTML = playing
                    ? '<i class="fas fa-pause"></i> <span>Music: On</span>'
                    : '<i class="fas fa-play"></i> <span>Music: Off</span>';
                localStorage.setItem('musicPlaying', playing);
            }
        }
        
        function toggleMusic() {
            if (!musicPlayerReady) {
                if (!musicInitialized) {
                    musicInitialized = true;
                    musicFrame.contentWindow.postMessage({action: 'play'}, '*');
                }
                return;
            }
            
            musicFrame.contentWindow.postMessage({action: 'toggle'}, '*');
        }
        
        updateMusicButton();
    };

    // Initialize animations for elements when they come into view
    const initScrollAnimations = () => {
        const wishCard = document.querySelector('.wish-card');
        if (wishCard) {
            const animateWishCard = () => {
                if (wishCard.getBoundingClientRect().top < window.innerHeight * 0.75) {
                    wishCard.classList.add('animated');
                    window.removeEventListener('scroll', animateWishCard);
                }
            };
            window.addEventListener('scroll', animateWishCard);
            animateWishCard();
        }
    };

    // Floating hearts animation
    const initFloatingHearts = () => {
        const heartsContainer = document.querySelector('.floating-hearts');
        if (!heartsContainer) return;
        
        for (let i = 0; i < 15; i++) {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.style.left = `${Math.random() * 100}vw`;
            heart.style.top = `${Math.random() * 100}vh`;
            heart.style.opacity = Math.random() * 0.5 + 0.1;
            heart.style.transform = `scale(${Math.random() * 0.5 + 0.5})`;
            heart.style.animationDuration = `${Math.random() * 10 + 10}s`;
            heart.style.animationDelay = `${Math.random() * 5}s`;
            heartsContainer.appendChild(heart);
        }
    };

    // Main initialization sequence with fixed loader issue
    const initAll = () => {
        // Show loader initially
        if (loader) {
            loader.style.display = 'flex';
            gsap.to(loader, { opacity: 1, duration: 0.3 });
        }

        // Initialize all components
        initWebGLBackground();
        initLottieAnimations();
        initGiftBox();
        initThemeSelector();
        initBalloons();
        initPoemGenerator();
        initGuestbook();
        initARViewer();
        initSocialSharing();
        initMusicPlayer();
        initScrollAnimations();
        initFloatingHearts();

        // Hide loader after everything is initialized
        const hideLoader = () => {
            if (loader) {
                gsap.to(loader, {
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => {
                        loader.style.display = 'none';
                    }
                });
            }
        };

        // Set minimum load time (1.5 seconds)
        setTimeout(hideLoader, 1500);
    };

    // Start the initialization
    initAll();
});