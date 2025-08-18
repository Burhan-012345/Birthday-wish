document.addEventListener('DOMContentLoaded', function() {
    // Theme selector functionality
    document.querySelectorAll('.theme-option').forEach(button => {
        button.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            document.body.className = theme;
            localStorage.setItem('selectedTheme', theme);
            updateThemeColors(theme);
            
            // Animate theme change
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

    // Media toggle functionality
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const galleries = document.querySelectorAll('.image-gallery, .video-gallery');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            
            // Update active state of buttons
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show the selected gallery
            galleries.forEach(gallery => gallery.classList.remove('active'));
            document.getElementById(target).classList.add('active');
            
            // Animation
            gsap.from(`#${target}`, {
                opacity: 0,
                y: 20,
                duration: 0.5,
                ease: "power2.out"
            });
        });
    });

    // Video player functionality
    const videoPlayers = document.querySelectorAll('.video-player');
    const playButtons = document.querySelectorAll('.video-play-btn');
    const fullscreenButtons = document.querySelectorAll('.video-fullscreen-btn');
    const volumeButtons = document.querySelectorAll('.video-volume-btn');
    const volumeSliders = document.querySelectorAll('.volume-slider');
    const progressBars = document.querySelectorAll('.video-progress');
    const timeDisplays = document.querySelectorAll('.time-display');
    const playOverlayButtons = document.querySelectorAll('.play-overlay-btn');
    const videoOverlays = document.querySelectorAll('.video-overlay');
    const videoContainers = document.querySelectorAll('.video-container');

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
        const playOverlayBtn = playOverlayButtons[index];
        const videoOverlay = videoOverlays[index];
        const videoContainer = videoContainers[index];

        // Set video duration once metadata is loaded
        video.addEventListener('loadedmetadata', function() {
            durationEl.textContent = formatTime(video.duration);
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
        });

        // Play/Pause functionality
        playBtn.addEventListener('click', function() {
            togglePlay(video, playBtn, videoOverlay);
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
        });

        // Volume slider
        volumeSlider.addEventListener('input', function() {
            video.volume = this.value;
            video.muted = false;
            
            // Update icon based on volume level
            if (this.value == 0) {
                volumeButtons[index].innerHTML = '<i class="fas fa-volume-mute"></i>';
            } else if (this.value < 0.5) {
                volumeButtons[index].innerHTML = '<i class="fas fa-volume-down"></i>';
            } else {
                volumeButtons[index].innerHTML = '<i class="fas fa-volume-up"></i>';
            }
        });

        // Fullscreen functionality
        fullscreenButtons[index].addEventListener('click', function(e) {
            e.stopPropagation();
            const video = videoPlayers[index];
            
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.webkitRequestFullscreen) {
                video.webkitRequestFullscreen();
            } else if (video.msRequestFullscreen) {
                video.msRequestFullscreen();
            }
        });
    });

    // Toggle play/pause function
    function togglePlay(video, playBtn, videoOverlay) {
        if (video.paused) {
            video.play();
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            videoOverlay.classList.add('playing');
            
            // Pause other videos
            videoPlayers.forEach((otherVideo, otherIndex) => {
                if (otherVideo !== video && !otherVideo.paused) {
                    otherVideo.pause();
                    playButtons[otherIndex].innerHTML = '<i class="fas fa-play"></i>';
                    videoOverlays[otherIndex].classList.remove('playing');
                }
            });
        } else {
            video.pause();
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            videoOverlay.classList.remove('playing');
        }
    }

    // Show volume slider on mobile when button is clicked
    if (window.innerWidth <= 480) {
        volumeButtons.forEach((btn, index) => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const sliderContainer = this.nextElementSibling;
                sliderContainer.classList.toggle('show');
            });
        });
    }

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

    // GSAP animations for scroll-triggered effects
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate cards on scroll
    gsap.utils.toArray(".image-card, .video-card").forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 80%",
                toggleActions: "play none none none",
                once: true
            },
            opacity: 0,
            y: 100,
            duration: 0.8,
            delay: i * 0.1,
            ease: "back.out(1.7)"
        });
    });

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
        heart.className = 'floating-heart';
        heart.innerHTML = '❤';
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
});