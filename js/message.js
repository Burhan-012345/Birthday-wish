document.addEventListener('DOMContentLoaded', function() {
    // Initialize GSAP and ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Create floating balloons
    function createBalloons() {
        const colors = [
            getComputedStyle(document.documentElement).getPropertyValue('--primary-color'),
            getComputedStyle(document.documentElement).getPropertyValue('--secondary-color'),
            getComputedStyle(document.documentElement).getPropertyValue('--accent-color'),
            '#ff6b6b',
            '#f4a261',
            '#2a9d8f'
        ];

        for (let i = 0; i < 8; i++) {
            const balloon = document.createElement('div');
            balloon.className = 'balloon';
            balloon.style.left = `${Math.random() * 100}%`;
            balloon.style.bottom = `-100px`;
            balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            balloon.style.animationDelay = `${Math.random() * 10}s`;
            balloon.style.animationDuration = `${15 + Math.random() * 15}s`;
            document.querySelector('.floating-balloons').appendChild(balloon);
        }
    }

    // Create floating hearts
    function createHearts() {
        for (let i = 0; i < 15; i++) {
            const heart = document.createElement('div');
            heart.innerHTML = '❤';
            heart.className = 'floating-heart';
            heart.style.left = `${Math.random() * 100}%`;
            heart.style.top = `${Math.random() * 100}%`;
            heart.style.fontSize = `${15 + Math.random() * 20}px`;
            heart.style.opacity = 0.2 + Math.random() * 0.5;
            heart.style.color = getRandomColor();
            heart.style.animationDelay = `${Math.random() * 5}s`;
            document.querySelector('.floating-hearts').appendChild(heart);
            
            gsap.to(heart, {
                y: `-=${100 + Math.random() * 100}`,
                x: `+=${Math.random() * 100 - 50}`,
                rotation: Math.random() * 360,
                opacity: 0,
                duration: 15 + Math.random() * 15,
                ease: "none",
                onComplete: function() {
                    heart.remove();
                    createHearts();
                }
            });
        }
    }

    // Initial animations
    function initAnimations() {
        // Title animations
        gsap.to(".page-title", {
            duration: 1,
            y: 0,
            opacity: 1,
            ease: "back.out(1.7)",
            delay: 0.3
        });

        gsap.to(".page-subtitle", {
            duration: 1,
            y: 0,
            opacity: 1,
            ease: "power3.out",
            delay: 0.6
        });

        // Form animations
        gsap.to(".name-form", {
            duration: 0.8,
            y: 0,
            opacity: 1,
            ease: "power2.out",
            delay: 0.9
        });

        gsap.to(".form-group", {
            duration: 0.8,
            x: 0,
            opacity: 1,
            stagger: 0.1,
            ease: "power2.out",
            delay: 1
        });

        // Button animations
        gsap.to(".animate-btn", {
            duration: 0.6,
            y: 0,
            opacity: 1,
            stagger: 0.1,
            ease: "back.out(1.7)",
            delay: function(index) {
                return 1.2 + (index * 0.1);
            }
        });

        // Navigation button animations
        gsap.to(".animate-nav", {
            duration: 0.6,
            y: 0,
            opacity: 1,
            stagger: 0.1,
            ease: "back.out(1.7)",
            delay: function(index) {
                return 1.5 + (index * 0.1);
            }
        });

        // Message paper animation
        gsap.from(".message-paper", {
            duration: 1,
            y: 50,
            opacity: 0,
            rotation: 5,
            ease: "back.out(1.7)",
            delay: 1.2
        });

        // Signature hover effect
        gsap.to(".signature", {
            keyframes: [
                { rotation: 0, scale: 1, duration: 0 },
                { rotation: -5, scale: 1.1, duration: 0.5, ease: "elastic.out(1, 0.3)" }
            ],
            scrollTrigger: {
                trigger: ".signature",
                start: "top 80%",
                toggleActions: "play none none none"
            }
        });
    }

    // DOM Elements
    const playBtn = document.getElementById('playMessage');
    const typeBtn = document.getElementById('typeMessage');
    const saveBtn = document.getElementById('saveMessage');
    const celebrateBtn = document.getElementById('celebrateBtn');
    const messageContent = document.getElementById('messageContent');
    const audioVisualizer = document.getElementById('audioVisualizer');
    const updateNamesBtn = document.getElementById('updateNames');
    const recipientNameInput = document.getElementById('recipientName');
    const senderNameInput = document.getElementById('senderName');

    // Initialize Wavesurfer for audio visualization
    let wavesurfer = null;
    if (audioVisualizer) {
        wavesurfer = WaveSurfer.create({
            container: '#audioVisualizer',
            waveColor: 'var(--primary-color)',
            progressColor: 'var(--secondary-color)',
            cursorColor: 'transparent',
            barWidth: 2,
            barRadius: 3,
            barGap: 2,
            height: 60,
            responsive: true
        });

        wavesurfer.on('ready', function() {
            gsap.to(audioVisualizer, {
                duration: 0.5,
                opacity: 1,
                scaleY: 1,
                ease: "back.out(1.7)"
            });
            audioVisualizer.classList.add('show');
        });
    }

    // Audio message playback
    const audioMessage = new Audio('assets/mine.mp3');
    audioMessage.preload = 'auto';
    
    audioMessage.addEventListener('error', function() {
        showError('Audio file not found. Please check the file exists.');
        playBtn.innerHTML = '<i class="fas fa-play"></i> Play Audio';
        playBtn.classList.remove('active');
    });

    // Load saved names
    const savedUserName = localStorage.getItem('userName');
    const savedRecipientName = localStorage.getItem('recipientName');
    
    if (savedUserName) {
        document.querySelectorAll('.sender-name').forEach(el => {
            el.textContent = savedUserName;
        });
        senderNameInput.value = savedUserName;
    }
    
    if (savedRecipientName) {
        document.querySelectorAll('.recipient-name').forEach(el => {
            el.textContent = savedRecipientName;
        });
        recipientNameInput.value = savedRecipientName;
    }

    // Update names with animation
    updateNamesBtn.addEventListener('click', function() {
        const recipientName = recipientNameInput.value.trim() || 'Madam Jii';
        const senderName = senderNameInput.value.trim() || 'Your\'s Love';
        
        // Animate name updates
        gsap.to(".recipient-name", {
            duration: 0.5,
            scale: 1.2,
            color: getComputedStyle(document.documentElement).getPropertyValue('--secondary-color'),
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut",
            onComplete: function() {
                document.querySelectorAll('.recipient-name').forEach(el => {
                    el.textContent = recipientName;
                });
            }
        });
        
        gsap.to(".sender-name", {
            duration: 0.5,
            scale: 1.3,
            rotation: -5,
            yoyo: true,
            repeat: 1,
            ease: "elastic.out(1, 0.3)",
            onComplete: function() {
                document.querySelectorAll('.sender-name').forEach(el => {
                    el.textContent = senderName;
                });
            }
        });
        
        localStorage.setItem('recipientName', recipientName);
        localStorage.setItem('userName', senderName);
        
        showConfirmation('Names updated successfully!');
    });

    // Audio message playback with enhanced animations
    if (playBtn) {
        playBtn.addEventListener('click', async function() {
            if (audioMessage.paused) {
                try {
                    // Button animation
                    gsap.to(playBtn, {
                        scale: 1.1,
                        duration: 0.2,
                        yoyo: true,
                        ease: "power2.out"
                    });
                    
                    await audioMessage.play();
                    playBtn.innerHTML = '<i class="fas fa-pause"></i> Pause Audio';
                    playBtn.classList.add('active');
                    
                    if (wavesurfer) {
                        try {
                            await wavesurfer.load('assets/music.mp3');
                            audioVisualizer.style.display = 'block';
                        } catch (wavesurferError) {
                            console.error('Wavesurfer load error:', wavesurferError);
                            audioVisualizer.style.display = 'none';
                        }
                    }
                } catch (playError) {
                    console.error('Audio playback failed:', playError);
                    showError('Could not play audio message. Please check permissions and file existence.');
                    playBtn.innerHTML = '<i class="fas fa-play"></i> Play Audio';
                    playBtn.classList.remove('active');
                }
            } else {
                audioMessage.pause();
                playBtn.innerHTML = '<i class="fas fa-play"></i> Play Audio';
                playBtn.classList.remove('active');
                if (wavesurfer) {
                    wavesurfer.stop();
                    gsap.to(audioVisualizer, {
                        duration: 0.3,
                        opacity: 0,
                        scaleY: 0,
                        ease: "power2.in"
                    });
                }
            }
        });
    }

    // Typewriter effect with enhanced animations
    if (typeBtn) {
        typeBtn.addEventListener('click', function() {
            messageContent.innerHTML = originalHTML;
            const textElements = messageContent.querySelectorAll('p, li');
            
            // Button animation
            gsap.to(typeBtn, {
                rotation: 360,
                duration: 0.5,
                ease: "back.out(2)"
            });
            
            typeBtn.disabled = true;
            typeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Typing...';
            
            textElements.forEach(el => {
                el.style.visibility = 'hidden';
                el.dataset.originalText = el.textContent;
                el.textContent = '';
            });
            
            typeElementSequentially(textElements, 0);
        });
    }

    function typeElementSequentially(elements, index) {
        if (index >= elements.length) {
            typeBtn.disabled = false;
            typeBtn.innerHTML = '<i class="fas fa-keyboard"></i> Typewriter Effect';
            
            // Final animation
            gsap.to(".wish-list li::before", {
                scale: 1.5,
                duration: 0.3,
                yoyo: true,
                repeat: 1,
                stagger: 0.1,
                ease: "elastic.out(1, 0.3)"
            });
            
            gsap.to(".signature", {
                rotation: -5,
                scale: 1.1,
                duration: 0.8,
                ease: "elastic.out(1, 0.3)"
            });
            
            return;
        }
        
        const currentElement = elements[index];
        const originalText = currentElement.dataset.originalText;
        let i = 0;
        
        currentElement.style.visibility = 'visible';
        
        function typeWriter() {
            if (i < originalText.length) {
                currentElement.textContent += originalText.charAt(i);
                i++;
                
                // Random typing sound effect
                if (i % 3 === 0) {
                    playTypeSound();
                }
                
                setTimeout(typeWriter, 20 + Math.random() * 30);
            } else {
                // Element completion animation
                gsap.from(currentElement, {
                    duration: 0.3,
                    x: 10,
                    opacity: 0,
                    ease: "power2.out"
                });
                
                typeElementSequentially(elements, index + 1);
            }
        }
        
        typeWriter();
    }

    function playTypeSound() {
        try {
            const typeSound = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU...');
            typeSound.volume = 0.1;
            typeSound.play().catch(e => console.log('Type sound error:', e));
        } catch (error) {
            console.error('Type sound failed:', error);
        }
    }

    // PDF generation with enhanced animations
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            // Button animation
            gsap.to(saveBtn, {
                keyframes: [
                    { scale: 1.1, duration: 0.2 },
                    { rotation: 360, duration: 0.5, ease: "back.out(2)" }
                ]
            });
            
            saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating PDF...';
            saveBtn.disabled = true;
            
            setTimeout(() => {
                try {
                    createPDF();
                } catch (error) {
                    console.error('PDF generation error:', error);
                    showError('Failed to generate PDF. Please try again.');
                } finally {
                    saveBtn.innerHTML = '<i class="fas fa-download"></i> Download PDF';
                    saveBtn.disabled = false;
                }
            }, 100);
        });
    }

    function createPDF() {
        if (typeof window.jspdf === 'undefined') {
            showError('PDF library not loaded. Please refresh the page.');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.setFont('helvetica', 'normal');
        
        // Add decorative elements
        doc.setDrawColor(230, 57, 70);
        doc.setFillColor(230, 57, 70);
        doc.circle(20, 15, 2, 'F');
        doc.circle(190, 15, 2, 'F');
        doc.setLineWidth(0.5);
        doc.rect(10, 10, 190, 277);
        
        // Add title
        doc.setFontSize(22);
        doc.setTextColor(230, 57, 70);
        doc.text(`Birthday Message for ${document.querySelector('.recipient-name').textContent}`, 105, 20, { align: 'center' });
        
        // Add subtitle
        doc.setFontSize(14);
        doc.setTextColor(244, 162, 97);
        doc.text('Heartfelt wishes for your special day', 105, 30, { align: 'center' });
        
        // Add decorative border
        doc.setDrawColor(244, 162, 97);
        doc.setLineWidth(0.3);
        doc.rect(15, 35, 180, 245);
        
        // Add message content
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        
        const paragraphs = messageContent.querySelectorAll('p, li');
        let yPosition = 45;
        
        paragraphs.forEach(el => {
            const isListItem = el.tagName === 'LI';
            const text = el.textContent;
            
            if (isListItem) {
                doc.setFontSize(11);
                doc.setTextColor(230, 57, 70);
                doc.text('• ', 20, yPosition);
                doc.setTextColor(0, 0, 0);
                doc.text(text, 25, yPosition);
                yPosition += 7;
            } else {
                doc.setFontSize(12);
                const lines = doc.splitTextToSize(text, 170);
                doc.text(lines, 20, yPosition);
                yPosition += lines.length * 7;
            }
            
            yPosition += 5;
            
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
        });
        
        // Add signature
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('With all my love and admiration,', 20, yPosition + 10);
        
        doc.setFontSize(18);
        doc.setTextColor(230, 57, 70);
        doc.text(document.querySelector('.sender-name').textContent, 20, yPosition + 20);
        
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text('Created with love for your special day', 105, 285, { align: 'center' });
        
        // Save the PDF with celebration
        doc.save(`Birthday_Wishes_For_${document.querySelector('.recipient-name').textContent}.pdf`);
        showConfetti(saveBtn);
        
        // Show celebration animation
        gsap.to(".message-paper", {
            keyframes: [
                { y: -10, duration: 0.3 },
                { y: 0, duration: 0.3, ease: "bounce.out" }
            ]
        });
    }

    // Celebrate button with enhanced effects
    if (celebrateBtn) {
        celebrateBtn.addEventListener('click', function() {
            // Button animation
            gsap.to(celebrateBtn, {
                keyframes: [
                    { scale: 1.2, duration: 0.2 },
                    { rotation: 360, duration: 0.8, ease: "back.out(2)" }
                ]
            });
            
            showConfetti(celebrateBtn);
            showConfirmation('Happy Birthday!');
            
            // Paper celebration effect
            gsap.to(".message-paper", {
                keyframes: [
                    { y: -20, rotation: -5, duration: 0.3 },
                    { y: 0, rotation: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" }
                ]
            });
            
            // List items celebration
            gsap.to(".wish-list li", {
                y: -10,
                duration: 0.3,
                stagger: 0.1,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut"
            });
            
            try {
                const celebrationSound = new Audio('assets/celebration.mp3');
                celebrationSound.play().catch(e => console.log('Celebration sound play failed:', e));
            } catch (error) {
                console.error('Celebration sound error:', error);
            }
        });
    }

    // Helper functions
    function showConfetti(element) {
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        confetti({
            particleCount: 150,
            spread: 90,
            origin: { x: x / window.innerWidth, y: y / innerHeight },
            colors: [
                getComputedStyle(document.documentElement).getPropertyValue('--primary-color'),
                getComputedStyle(document.documentElement).getPropertyValue('--secondary-color'),
                getComputedStyle(document.documentElement).getPropertyValue('--accent-color'),
                '#ffd166',
                '#06d6a0'
            ],
            shapes: ['circle', 'square', 'star'],
            scalar: 1.2
        });
    }

    function showConfirmation(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    function showError(message) {
        const notification = document.createElement('div');
        notification.className = 'notification error';
        notification.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }

    function getRandomColor() {
        const colors = [
            getComputedStyle(document.documentElement).getPropertyValue('--primary-color'),
            getComputedStyle(document.documentElement).getPropertyValue('--secondary-color'),
            getComputedStyle(document.documentElement).getPropertyValue('--accent-color'),
            '#ff6b6b',
            '#f4a261',
            '#2a9d8f'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Clean message content for typewriter effect
    const originalHTML = messageContent.innerHTML;

    // Initialize animations and effects
    initAnimations();
    createBalloons();
    createHearts();

    // Theme selector functionality
    document.querySelectorAll('.theme-option').forEach(button => {
        button.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            document.body.className = theme;
            localStorage.setItem('selectedTheme', theme);
            updateThemeColors(theme);
            
            // Theme change animation
            gsap.to("body", {
                backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color'),
                duration: 0.5,
                ease: "power2.inOut"
            });
        });
    });

    function updateThemeColors(theme) {
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
            default:
                root.style.setProperty('--primary-color', '#ff6b6b');
                root.style.setProperty('--secondary-color', '#ff8e8e');
                root.style.setProperty('--accent-color', '#ffb8b8');
        }
    }

    // Load saved theme
    const savedTheme = localStorage.getItem('selectedTheme') || 'default';
    document.body.className = savedTheme;
    updateThemeColors(savedTheme);
});