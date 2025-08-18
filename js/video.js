document.addEventListener('DOMContentLoaded', function() {
    // Initialize all video players and controls
    const videoPlayers = document.querySelectorAll('.video-player');
    const playButtons = document.querySelectorAll('.video-play-btn');
    const downloadButtons = document.querySelectorAll('.video-download-btn');
    const fullscreenButtons = document.querySelectorAll('.video-fullscreen-btn');
    const volumeButtons = document.querySelectorAll('.video-volume-btn');
    const volumeSliders = document.querySelectorAll('.volume-slider');
    const progressBars = document.querySelectorAll('.video-progress');
    const timeDisplays = document.querySelectorAll('.time-display');
    const speedSelects = document.querySelectorAll('.speed-select');
    const playOverlayButtons = document.querySelectorAll('.play-overlay-btn');
    const videoOverlays = document.querySelectorAll('.video-overlay');
    const videoContainers = document.querySelectorAll('.video-container');
    const videoCards = document.querySelectorAll('.video-card');

    // Format time from seconds to MM:SS
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    // Update time display
    function updateTimeDisplay(video, currentTimeEl, durationEl) {
        currentTimeEl.textContent = formatTime(video.currentTime);
        durationEl.textContent = formatTime(video.duration);
    }

    // Initialize each video player
    videoPlayers.forEach((video, index) => {
        const playBtn = playButtons[index];
        const progressBar = progressBars[index];
        const timeDisplay = timeDisplays[index];
        const currentTimeEl = timeDisplay.querySelector('.current-time');
        const durationEl = timeDisplay.querySelector('.duration');
        const volumeSlider = volumeSliders[index];
        const speedSelect = speedSelects[index];
        const playOverlayBtn = playOverlayButtons[index];
        const videoOverlay = videoOverlays[index];
        const videoContainer = videoContainers[index];
        const videoCard = videoCards[index];

        // Set video duration once metadata is loaded
        video.addEventListener('loadedmetadata', function() {
            durationEl.textContent = formatTime(video.duration);
            
            // Animate the progress bar
            gsap.from(progressBar, {
                width: 0,
                duration: 0.8,
                ease: "power2.out",
                delay: 0.3
            });
        });

        // Update progress bar as video plays
        video.addEventListener('timeupdate', function() {
            const progress = (video.currentTime / video.duration) * 100;
            progressBar.value = progress;
            updateTimeDisplay(video, currentTimeEl, durationEl);
        });

        // Click on progress bar to seek
        progressBar.addEventListener('click', function(e) {
            const percent = e.offsetX / this.offsetWidth;
            video.currentTime = percent * video.duration;
            
            // Add animation feedback
            gsap.to(progressBar, {
                scaleY: 1.5,
                duration: 0.2,
                yoyo: true,
                ease: "power2.out"
            });
        });

        // Play/Pause functionality
        playBtn.addEventListener('click', function() {
            togglePlay(video, playBtn, videoOverlay);
            
            // Button animation
            gsap.to(this, {
                scale: 1.2,
                duration: 0.2,
                yoyo: true,
                ease: "power2.out"
            });
        });

        // Play/Pause from overlay button
        playOverlayBtn.addEventListener('click', function() {
            togglePlay(video, playBtn, videoOverlay);
            
            // Ripple effect animation
            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            playOverlayBtn.appendChild(ripple);
            
            gsap.to(ripple, {
                scale: 3,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out",
                onComplete: () => ripple.remove()
            });
        });

        // Click on video container to toggle play/pause
        videoContainer.addEventListener('click', function() {
            togglePlay(video, playBtn, videoOverlay);
        });

        // Video ended event
        video.addEventListener('ended', function() {
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            videoOverlay.classList.remove('playing');
            
            // Celebration animation
            gsap.to(videoCard, {
                boxShadow: `0 0 30px ${getComputedStyle(document.documentElement).getPropertyValue('--primary-color')}`,
                duration: 1,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut"
            });
        });

        // Volume control
        volumeButtons[index].addEventListener('click', function() {
            video.muted = !video.muted;
            this.innerHTML = video.muted ? 
                '<i class="fas fa-volume-mute"></i>' : 
                '<i class="fas fa-volume-up"></i>';
            
            if (!video.muted) {
                video.volume = volumeSlider.value;
            }
            
            // Button animation
            gsap.to(this, {
                rotation: 360,
                duration: 0.5,
                ease: "back.out(2)"
            });
        });

        // Volume slider
        volumeSlider.addEventListener('input', function() {
            video.volume = this.value;
            video.muted = false;
            volumeButtons[index].innerHTML = '<i class="fas fa-volume-up"></i>';
            
            // Update icon based on volume level
            if (this.value == 0) {
                volumeButtons[index].innerHTML = '<i class="fas fa-volume-mute"></i>';
            } else if (this.value < 0.5) {
                volumeButtons[index].innerHTML = '<i class="fas fa-volume-down"></i>';
            } else {
                volumeButtons[index].innerHTML = '<i class="fas fa-volume-up"></i>';
            }
            
            // Slider animation
            gsap.to(this, {
                '--thumb-scale': 1.3,
                duration: 0.2,
                yoyo: true,
                ease: "power2.out"
            });
        });

        // Playback speed control
        speedSelect.addEventListener('change', function() {
            video.playbackRate = parseFloat(this.value);
            
            // Dropdown animation
            gsap.to(this, {
                y: -5,
                duration: 0.2,
                yoyo: true,
                ease: "power2.out"
            });
        });

        // Hover effects for video card
        videoCard.addEventListener('mouseenter', function() {
            gsap.to(this, {
                y: -10,
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                duration: 0.5,
                ease: "power2.out"
            });
            
            gsap.to(videoOverlay, {
                backgroundColor: 'rgba(0,0,0,0.5)',
                duration: 0.3
            });
        });
        
        videoCard.addEventListener('mouseleave', function() {
            gsap.to(this, {
                y: 0,
                boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                duration: 0.5,
                ease: "power2.out"
            });
            
            gsap.to(videoOverlay, {
                backgroundColor: 'rgba(0,0,0,0.3)',
                duration: 0.3
            });
        });

        // Show volume slider on hover (handled in CSS)
    });

    // Toggle play/pause function
    function togglePlay(video, playBtn, videoOverlay) {
        if (video.paused) {
            video.play();
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            videoOverlay.classList.add('playing');
            
            // Play animation
            gsap.fromTo(videoOverlay, 
                { opacity: 1, scale: 1 },
                { opacity: 0, scale: 1.2, duration: 0.5, ease: "power2.out" }
            );
            
            // Pause other videos
            videoPlayers.forEach((otherVideo, otherIndex) => {
                if (otherVideo !== video && !otherVideo.paused) {
                    otherVideo.pause();
                    playButtons[otherIndex].innerHTML = '<i class="fas fa-play"></i>';
                    videoOverlays[otherIndex].classList.remove('playing');
                    
                    // Pause animation
                    gsap.to(videoOverlays[otherIndex], {
                        opacity: 1,
                        scale: 1,
                        duration: 0.3
                    });
                }
            });
        } else {
            video.pause();
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            videoOverlay.classList.remove('playing');
            
            // Pause animation
            gsap.fromTo(videoOverlay, 
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
            );
        }
    }

    // Fixed Download functionality
    downloadButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const video = videoPlayers[index];
            const videoSource = video.querySelector('source').src;
            
            // Extract filename from the source
            const videoFilename = videoSource.split('/').pop();
            
            // Create temporary anchor element
            const a = document.createElement('a');
            a.href = videoSource;
            a.download = videoFilename || 'birthday-video.mp4';
            
            // Trigger download
            document.body.appendChild(a);
            a.click();
            
            // Clean up
            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(videoSource);
            }, 100);
            
            // Visual feedback with animation
            const originalHTML = button.innerHTML;
            const originalBG = button.style.backgroundColor;
            
            gsap.to(button, {
                backgroundColor: '#4CAF50',
                scale: 1.2,
                duration: 0.3,
                ease: "power2.out",
                onComplete: function() {
                    button.innerHTML = '<i class="fas fa-check"></i>';
                    gsap.to(button, {
                        scale: 1,
                        delay: 1,
                        duration: 0.3,
                        onComplete: function() {
                            button.innerHTML = originalHTML;
                            button.style.backgroundColor = originalBG;
                        }
                    });
                }
            });
        });
    });

    // Fullscreen functionality
    fullscreenButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const video = videoPlayers[index];
            
            // Button animation
            gsap.to(button, {
                rotation: 360,
                duration: 0.5,
                ease: "back.out(2)"
            });
            
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.webkitRequestFullscreen) {
                video.webkitRequestFullscreen();
            } else if (video.msRequestFullscreen) {
                video.msRequestFullscreen();
            }
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        const focusedVideo = document.querySelector('.video-player:focus');
        if (!focusedVideo) return;

        const index = Array.from(videoPlayers).indexOf(focusedVideo);
        if (index === -1) return;

        const playBtn = playButtons[index];
        const videoOverlay = videoOverlays[index];

        switch(e.code) {
            case 'Space':
                e.preventDefault();
                togglePlay(focusedVideo, playBtn, videoOverlay);
                
                // Visual feedback
                gsap.to(playBtn, {
                    scale: 1.2,
                    duration: 0.2,
                    yoyo: true,
                    ease: "power2.out"
                });
                break;
            case 'KeyF':
                e.preventDefault();
                if (focusedVideo.requestFullscreen) {
                    focusedVideo.requestFullscreen();
                } else if (focusedVideo.webkitRequestFullscreen) {
                    focusedVideo.webkitRequestFullscreen();
                } else if (focusedVideo.msRequestFullscreen) {
                    focusedVideo.msRequestFullscreen();
                }
                break;
            case 'ArrowRight':
                e.preventDefault();
                focusedVideo.currentTime += 5;
                
                // Visual feedback
                gsap.to(timeDisplays[index], {
                    x: 10,
                    duration: 0.2,
                    yoyo: true,
                    ease: "power2.out"
                });
                break;
            case 'ArrowLeft':
                e.preventDefault();
                focusedVideo.currentTime -= 5;
                
                // Visual feedback
                gsap.to(timeDisplays[index], {
                    x: -10,
                    duration: 0.2,
                    yoyo: true,
                    ease: "power2.out"
                });
                break;
            case 'ArrowUp':
                e.preventDefault();
                focusedVideo.volume = Math.min(focusedVideo.volume + 0.1, 1);
                volumeSliders[index].value = focusedVideo.volume;
                
                // Visual feedback
                gsap.to(volumeButtons[index], {
                    y: -5,
                    duration: 0.2,
                    yoyo: true,
                    ease: "power2.out"
                });
                break;
            case 'ArrowDown':
                e.preventDefault();
                focusedVideo.volume = Math.max(focusedVideo.volume - 0.1, 0);
                volumeSliders[index].value = focusedVideo.volume;
                
                // Visual feedback
                gsap.to(volumeButtons[index], {
                    y: 5,
                    duration: 0.2,
                    yoyo: true,
                    ease: "power2.out"
                });
                break;
            case 'KeyM':
                e.preventDefault();
                focusedVideo.muted = !focusedVideo.muted;
                volumeButtons[index].innerHTML = focusedVideo.muted ? 
                    '<i class="fas fa-volume-mute"></i>' : 
                    '<i class="fas fa-volume-up"></i>';
                
                // Visual feedback
                gsap.to(volumeButtons[index], {
                    rotation: 360,
                    duration: 0.5,
                    ease: "back.out(2)"
                });
                break;
        }
    });

    // GSAP animations for scroll-triggered effects
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate video cards on scroll
    gsap.utils.toArray(".video-card").forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 80%",
                toggleActions: "play none none none",
                once: true
            },
            opacity: 0,
            y: 100,
            rotationX: 20,
            duration: 0.8,
            delay: i * 0.1,
            ease: "back.out(1.7)",
            transformOrigin: "center bottom"
        });
    });

    // Animate hero section elements
    gsap.from(".hero h1", {
        duration: 1.5,
        y: 50,
        opacity: 0,
        ease: "back.out(1.7)",
        delay: 0.3
    });

    gsap.from(".subtitle", {
        duration: 1.5,
        y: 30,
        opacity: 0,
        ease: "power3.out",
        delay: 0.6
    });

    // Create floating confetti
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.top = `${Math.random() * 100}%`;
        confetti.style.backgroundColor = getRandomColor();
        confetti.style.width = `${gsap.utils.random(8, 15)}px`;
        confetti.style.height = confetti.style.width;
        document.querySelector('.floating-confetti').appendChild(confetti);
        
        gsap.to(confetti, {
            x: gsap.utils.random(-100, 100),
            y: gsap.utils.random(-100, 100),
            rotation: gsap.utils.random(0, 360),
            duration: gsap.utils.random(3, 6),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: gsap.utils.random(0, 2)
        });
    }

    // Create floating hearts
    for (let i = 0; i < 10; i++) {
        createFloatingHeart();
    }

    // Show volume slider on mobile when button is clicked
    if (window.innerWidth <= 480) {
        volumeButtons.forEach((btn, index) => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const sliderContainer = this.nextElementSibling;
                sliderContainer.classList.toggle('show');
                
                // Animation
                if (sliderContainer.classList.contains('show')) {
                    gsap.from(sliderContainer, {
                        opacity: 0,
                        height: 0,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });
        });
    }

    // Helper function to generate random colors
    function getRandomColor() {
        const colors = [
            getComputedStyle(document.documentElement).getPropertyValue('--primary-color'),
            getComputedStyle(document.documentElement).getPropertyValue('--secondary-color'),
            getComputedStyle(document.documentElement).getPropertyValue('--accent-color'),
            '#ff6b6b',
            '#ff8e8e',
            '#ffb8b8'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Create floating hearts animation
    function createFloatingHeart() {
        const heart = document.createElement('div');
        heart.innerHTML = '❤';
        heart.className = 'floating-heart';
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.top = `${Math.random() * 100}%`;
        heart.style.fontSize = `${gsap.utils.random(15, 30)}px`;
        heart.style.opacity = gsap.utils.random(0.2, 0.6);
        heart.style.color = getRandomColor();
        document.querySelector('.floating-hearts').appendChild(heart);
        
        gsap.to(heart, {
            y: `-=${gsap.utils.random(100, 200)}`,
            x: `+=${gsap.utils.random(-50, 50)}`,
            rotation: gsap.utils.random(0, 360),
            opacity: 0,
            duration: gsap.utils.random(10, 20),
            ease: "none",
            onComplete: function() {
                heart.remove();
                createFloatingHeart();
            }
        });
    }

    // Add ripple effect style dynamically
    const style = document.createElement('style');
    style.textContent = `
        .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.4);
            transform: scale(0);
            pointer-events: none;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
        }
        
        .floating-heart {
            position: absolute;
            pointer-events: none;
            z-index: -1;
            animation: floatHeart ${gsap.utils.random(15, 25)}s linear infinite;
        }
    `;
    document.head.appendChild(style);
});