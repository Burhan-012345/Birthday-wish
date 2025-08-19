document.addEventListener('DOMContentLoaded', function() {
    // Initialize GSAP and ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Custom cursor
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    if (cursor && cursorFollower) {
        document.addEventListener('mousemove', function(e) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        });

        // Hover effects
        const hoverElements = document.querySelectorAll('button, a, input, [contenteditable="true"]');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                cursorFollower.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                cursorFollower.classList.remove('hover');
            });
        });

        // Click effects
        document.addEventListener('mousedown', () => {
            cursor.classList.add('click');
        });
        document.addEventListener('mouseup', () => {
            cursor.classList.remove('click');
        });
    }

    // Initialize particles
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: "#e63946" },
                shape: { type: "circle" },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#f4a261",
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "repulse" },
                    onclick: { enable: true, mode: "push" },
                    resize: true
                }
            },
            retina_detect: true
        });
    }

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

        // Scroll animations
        const scrollElements = document.querySelectorAll('.scroll-animate');
        scrollElements.forEach(el => {
            gsap.to(el, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            });
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
    const flipCardBtn = document.getElementById('flipCard');
    const messageCard = document.querySelector('.message-card');
    const recordBtn = document.getElementById('recordBtn');
    const stopRecordBtn = document.getElementById('stopRecordBtn');
    const playRecordedBtn = document.getElementById('playRecordedBtn');
    const recorderStatus = document.getElementById('recorderStatus');
    const recordingIndicator = document.querySelector('.recording-indicator');
    const encryptBtn = document.getElementById('encryptMessage');
    const decryptBtn = document.getElementById('decryptMessage');
    const encryptionKeyInput = document.getElementById('encryptionKey');
    const fontIncreaseBtn = document.getElementById('fontIncrease');
    const fontDecreaseBtn = document.getElementById('fontDecrease');
    const highContrastBtn = document.getElementById('highContrast');
    const readAloudBtn = document.getElementById('readAloud');
    const langButtons = document.querySelectorAll('.lang-btn');

    // Audio recording variables
    let audioRecorder;
    let recordedBlob;
    let recordedAudio;

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

    // 3D Card Flip
    flipCardBtn.addEventListener('click', function() {
        messageCard.classList.toggle('flipped');
        
        // Button animation
        gsap.to(flipCardBtn, {
            rotation: '+=360',
            duration: 0.5,
            ease: "back.out(2)"
        });
    });

    // Audio recording functionality
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        recordBtn.addEventListener('click', function() {
            navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function(stream) {
                audioRecorder = RecordRTC(stream, {
                    type: 'audio',
                    mimeType: 'audio/webm',
                    recorderType: StereoAudioRecorder,
                    desiredSampRate: 16000,
                    numberOfAudioChannels: 1,
                    timeSlice: 1000,
                    ondataavailable: function(blob) {
                        // Handle data available if needed
                    }
                });
                
                audioRecorder.startRecording();
                
                // Update UI
                recordBtn.disabled = true;
                stopRecordBtn.disabled = false;
                recorderStatus.style.display = 'none';
                recordingIndicator.style.display = 'flex';
                
                showConfirmation('Recording started');
            })
            .catch(function(err) {
                showError('Recording error: ' + err.message);
            });
        });

        stopRecordBtn.addEventListener('click', function() {
            if (audioRecorder) {
                audioRecorder.stopRecording(function() {
                    recordedBlob = audioRecorder.getBlob();
                    recordedAudio = URL.createObjectURL(recordedBlob);
                    
                    // Update UI
                    recordBtn.disabled = false;
                    stopRecordBtn.disabled = true;
                    playRecordedBtn.disabled = false;
                    recorderStatus.style.display = 'block';
                    recordingIndicator.style.display = 'none';
                    recorderStatus.textContent = 'Recording complete';
                    
                    showConfirmation('Recording stopped');
                    
                    // Save to localStorage
                    const reader = new FileReader();
                    reader.readAsDataURL(recordedBlob);
                    reader.onloadend = function() {
                        const base64data = reader.result;
                        localStorage.setItem('recordedMessage', base64data);
                    };
                });
            }
        });

        playRecordedBtn.addEventListener('click', function() {
            if (recordedAudio) {
                const audio = new Audio(recordedAudio);
                audio.play();
                
                // Button animation
                gsap.to(playRecordedBtn, {
                    scale: 1.1,
                    duration: 0.2,
                    yoyo: true,
                    ease: "power2.out"
                });
            }
        });

        // Load saved recording if exists
        const savedRecording = localStorage.getItem('recordedMessage');
        if (savedRecording) {
            fetch(savedRecording)
            .then(res => res.blob())
            .then(blob => {
                recordedBlob = blob;
                recordedAudio = URL.createObjectURL(blob);
                playRecordedBtn.disabled = false;
                recorderStatus.textContent = 'Recording saved';
            });
        }
    } else {
        recordBtn.disabled = true;
        stopRecordBtn.disabled = true;
        recorderStatus.textContent = 'Recording not supported in your browser';
    }

    // Message encryption/decryption
    encryptBtn.addEventListener('click', function() {
        const key = encryptionKeyInput.value.trim();
        if (!key) {
            showError('Encryption key is required');
            return;
        }
        
        const message = messageContent.innerHTML;
        const encrypted = CryptoJS.AES.encrypt(message, key).toString();
        
        // Save to localStorage
        localStorage.setItem('encryptedMessage', encrypted);
        
        // Update UI
        messageContent.innerHTML = '<p style="text-align:center;color:#888;font-style:italic;">Message encrypted</p>';
        
        showConfirmation('Message encrypted successfully');
    });

    decryptBtn.addEventListener('click', function() {
        const key = encryptionKeyInput.value.trim();
        if (!key) {
            showError('Encryption key is required');
            return;
        }
        
        const encrypted = localStorage.getItem('encryptedMessage');
        if (!encrypted) {
            showError('No encrypted message found');
            return;
        }
        
        try {
            const decrypted = CryptoJS.AES.decrypt(encrypted, key).toString(CryptoJS.enc.Utf8);
            
            if (!decrypted) {
                showError('Decryption failed. Check your key.');
                return;
            }
            
            messageContent.innerHTML = decrypted;
            showConfirmation('Message decrypted');
        } catch (error) {
            showError('Decryption error');
        }
    });

    // Accessibility features
    fontIncreaseBtn.addEventListener('click', function() {
        const currentSize = parseFloat(getComputedStyle(document.body).fontSize);
        document.body.style.fontSize = (currentSize + 1) + 'px';
        showConfirmation('Font size increased');
    });

    fontDecreaseBtn.addEventListener('click', function() {
        const currentSize = parseFloat(getComputedStyle(document.body).fontSize);
        document.body.style.fontSize = (currentSize - 1) + 'px';
        showConfirmation('Font size decreased');
    });

    highContrastBtn.addEventListener('click', function() {
        document.body.classList.toggle('high-contrast');
        const isHighContrast = document.body.classList.contains('high-contrast');
        localStorage.setItem('highContrast', isHighContrast);
        showConfirmation(isHighContrast ? 'High contrast mode on' : 'High contrast mode off');
    });

    // Text-to-speech with male voice
    readAloudBtn.addEventListener('click', function() {
        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();
            
            const speech = new SpeechSynthesisUtterance();
            speech.text = messageContent.textContent;
            speech.volume = 1;
            speech.rate = 0.9; // Slightly slower for more natural male voice
            speech.pitch = 0.8; // Lower pitch for male voice
            
            // Try to get a male voice
            const voices = window.speechSynthesis.getVoices();
            let maleVoice = null;
            
            // First try to find a specifically male voice
            maleVoice = voices.find(voice => 
                voice.name.includes('Male') || 
                voice.name.includes('male') || 
                voice.name.includes('David') || 
                voice.name.includes('Google UK English Male') ||
                voice.name.includes('Microsoft David') ||
                voice.name.includes('Alex')
            );
            
            // If no specifically male voice found, use a lower-pitched voice
            if (!maleVoice) {
                maleVoice = voices.find(voice => 
                    voice.lang.includes('en') && 
                    !voice.name.includes('Female') && 
                    !voice.name.includes('female') && 
                    !voice.name.includes('Zira') && 
                    !voice.name.includes('Samantha')
                );
            }
            
            // If still no voice found, use the first available voice
            if (!maleVoice && voices.length > 0) {
                maleVoice = voices[0];
            }
            
            if (maleVoice) {
                speech.voice = maleVoice;
                speech.lang = maleVoice.lang;
            } else {
                speech.lang = document.documentElement.lang || 'en-US';
            }
            
            // Button animation
            gsap.to(readAloudBtn, {
                scale: 1.1,
                duration: 0.2,
                yoyo: true,
                ease: "power2.out"
            });
            
            window.speechSynthesis.speak(speech);
            showConfirmation('Reading aloud');
            
            // Change button appearance while speaking
            readAloudBtn.innerHTML = '<i class="fas fa-pause"></i> Stop Reading';
            readAloudBtn.classList.add('active');
            
            // Reset button when speech ends
            speech.onend = function() {
                readAloudBtn.innerHTML = '<i class="fas fa-volume-up"></i> Read Aloud';
                readAloudBtn.classList.remove('active');
            };
        } else {
            showError('Speech synthesis not supported');
        }
    });

    // Language support
    const translations = {
        en: {
            specialMessage: "Special Message",
            heartfeltWishes: "Heartfelt wishes for your special day",
            recipientsName: "Recipient's Name:",
            yourName: "Your Name:",
            updateNames: "Update Names",
            playAudioMessage: "Play Audio Message",
            typewriterEffect: "Typewriter Effect",
            downloadPDF: "Download PDF",
            celebrate: "Celebrate!",
            backToVideos: "Back to Videos",
            returnToHome: "Return to Home",
            birthdayGame: "Birthday Game",
            flipCard: "Flip Card",
            personalVoiceMessage: "Personal Voice Message",
            recordMessage: "Record Message",
            stopRecording: "Stop Recording",
            playRecording: "Play Recording",
            readyToRecord: "Ready to record",
            recording: "Recording",
            encryptionKey: "Encryption Key:",
            encryptMessage: "Encrypt Message",
            decryptMessage: "Decrypt Message",
            namesUpdated: "Names updated successfully!",
            recordingStarted: "Recording started",
            recordingStopped: "Recording stopped",
            recordingComplete: "Recording complete",
            recordingError: "Recording error",
            recordingNotSupported: "Recording not supported in your browser",
            recordingSaved: "Recording saved",
            encryptionKeyRequired: "Encryption key is required",
            messageEncrypted: "Message encrypted",
            messageEncryptedSuccess: "Message encrypted successfully",
            decryptionFailed: "Decryption failed. Check your key.",
            noEncryptedMessage: "No encrypted message found",
            messageDecrypted: "Message decrypted",
            decryptionError: "Decryption error",
            fontSizeIncreased: "Font size increased",
            fontSizeDecreased: "Font size decreased",
            highContrastOn: "High contrast mode on",
            highContrastOff: "High contrast mode off",
            readingAloud: "Reading aloud",
            speechNotSupported: "Speech synthesis not supported",
            pdfError: "Failed to generate PDF. Please try again.",
            pdfLibraryError: "PDF library not loaded. Please refresh the page.",
            pdfCreated: "PDF created successfully",
            happyBirthday: "Happy Birthday!",
            pauseAudio: "Pause Audio",
            creatingPDF: "Creating PDF...",
            typing: "Typing...",
            stopReading: "Stop Reading",
            readAloud: "Read Aloud"
        },
        es: {
            specialMessage: "Mensaje Especial",
            heartfeltWishes: "Deseos sinceros para tu día especial",
            recipientsName: "Nombre del destinatario:",
            yourName: "Tu nombre:",
            updateNames: "Actualizar Nombres",
            playAudioMessage: "Reproducir mensaje de audio",
            typewriterEffect: "Efecto máquina de escribir",
            downloadPDF: "Descargar PDF",
            celebrate: "¡Celebrar!",
            backToVideos: "Volver a Videos",
            returnToHome: "Volver a Inicio",
            birthdayGame: "Juego de Cumpleaños",
            flipCard: "Voltear Tarjeta",
            personalVoiceMessage: "Mensaje de Voz Personal",
            recordMessage: "Grabar Mensaje",
            stopRecording: "Detener Grabación",
            playRecording: "Reproducir Grabación",
            readyToRecord: "Listo para grabar",
            recording: "Grabando",
            encryptionKey: "Clave de encriptación:",
            encryptMessage: "Encriptar Mensaje",
            decryptMessage: "Desencriptar Mensaje",
            namesUpdated: "Nombres actualizados con éxito",
            recordingStarted: "Grabación iniciada",
            recordingStopped: "Grabación detenida",
            recordingComplete: "Grabación completada",
            recordingError: "Error de grabación",
            recordingNotSupported: "Grabación no compatible con tu navegador",
            recordingSaved: "Grabación guardada",
            encryptionKeyRequired: "Se requiere clave de encriptación",
            messageEncrypted: "Mensaje encriptado",
            messageEncryptedSuccess: "Mensaje encriptado con éxito",
            decryptionFailed: "Error al desencriptar. Verifica tu clave.",
            noEncryptedMessage: "No se encontró mensaje encriptado",
            messageDecrypted: "Mensaje desencriptado",
            decryptionError: "Error de desencriptación",
            fontSizeIncreased: "Tamaño de fuente aumentado",
            fontSizeDecreased: "Tamaño de fuente disminuido",
            highContrastOn: "Modo alto contraste activado",
            highContrastOff: "Modo alto contraste desactivado",
            readingAloud: "Leyendo en voz alta",
            speechNotSupported: "Síntesis de voz no compatible",
            pdfError: "Error al generar PDF. Por favor, inténtalo de nuevo.",
            pdfLibraryError: "Biblioteca PDF no cargada. Por favor, actualiza la página.",
            pdfCreated: "PDF creado con éxito",
            happyBirthday: "¡Feliz Cumpleaños!",
            pauseAudio: "Pausar Audio",
            creatingPDF: "Creando PDF...",
            typing: "Escribiendo...",
            stopReading: "Dejar de Leer",
            readAloud: "Leer en Voz Alta"
        },
        fr: {
            specialMessage: "Message Spécial",
            heartfeltWishes: "Vœux sincères pour votre jour spécial",
            recipientsName: "Nom du destinataire :",
            yourName: "Votre nom :",
            updateNames: "Mettre à jour les noms",
            playAudioMessage: "Lire le message audio",
            typewriterEffect: "Effet machine à écrire",
            downloadPDF: "Télécharger PDF",
            celebrate: "Célébrer !",
            backToVideos: "Retour aux Vidéos",
            returnToHome: "Retour à l'Accueil",
            birthdayGame: "Jeu d'Anniversaire",
            flipCard: "Retourner la Carte",
            personalVoiceMessage: "Message Vocal Personnel",
            recordMessage: "Enregistrer le Message",
            stopRecording: "Arrêter l'Enregistrement",
            playRecording: "Lire l'Enregistrement",
            readyToRecord: "Prêt à enregistrer",
            recording: "Enregistrement en cours",
            encryptionKey: "Clé de chiffrement :",
            encryptMessage: "Chiffrer le Message",
            decryptMessage: "Déchiffrer le Message",
            namesUpdated: "Noms mis à jour avec succès",
            recordingStarted: "Enregistrement démarré",
            recordingStopped: "Enregistrement arrêté",
            recordingComplete: "Enregistrement terminé",
            recordingError: "Erreur d'enregistrement",
            recordingNotSupported: "Enregistrement non pris en charge par votre navigateur",
            recordingSaved: "Enregistrement sauvegardé",
            encryptionKeyRequired: "La clé de chiffrement est requise",
            messageEncrypted: "Message chiffré",
            messageEncryptedSuccess: "Message chiffré avec succès",
            decryptionFailed: "Échec du déchiffrement. Vérifiez votre clé.",
            noEncryptedMessage: "Aucun message chiffré trouvé",
            messageDecrypted: "Message déchiffré",
            decryptionError: "Erreur de déchiffrement",
            fontSizeIncreased: "Taille de police augmentée",
            fontSizeDecreased: "Taille de police diminuée",
            highContrastOn: "Mode contraste élevé activé",
            highContrastOff: "Mode contraste élevé désactivé",
            readingAloud: "Lecture à voix haute",
            speechNotSupported: "Synthèse vocale non prise en charge",
            pdfError: "Échec de la génération du PDF. Veuillez réessayer.",
            pdfLibraryError: "Bibliothèque PDF non chargée. Veuillez actualiser la page.",
            pdfCreated: "PDF créé avec succès",
            happyBirthday: "Joyeux Anniversaire !",
            pauseAudio: "Mettre en pause",
            creatingPDF: "Création du PDF...",
            typing: "En train d'écrire...",
            stopReading: "Arrêter la Lecture",
            readAloud: "Lire à Haute Voix"
        },
        hi: {
            specialMessage: "विशेष संदेश",
            heartfeltWishes: "आपके विशेष दिन के लिए हार्दिक शुभकामनाएं",
            recipientsName: "प्राप्तकर्ता का नाम:",
            yourName: "आपका नाम:",
            updateNames: "नाम अपडेट करें",
            playAudioMessage: "ऑडियो संदेश चलाएं",
            typewriterEffect: "टाइपराइटर प्रभाव",
            downloadPDF: "PDF डाउनलोड करें",
            celebrate: "जश्न मनाएं!",
            backToVideos: "वीडियो पर वापस जाएं",
            returnToHome: "होम पर वापस जाएं",
            birthdayGame: "जन्मदिन का खेल",
            flipCard: "कार्ड फ्लिप करें",
            personalVoiceMessage: "व्यक्तिगत आवाज संदेश",
            recordMessage: "संदेश रिकॉर्ड करें",
            stopRecording: "रिकॉर्डिंग रोकें",
            playRecording: "रिकॉर्डिंग चलाएं",
            readyToRecord: "रिकॉर्ड करने के लिए तैयार",
            recording: "रिकॉर्डिंग हो रही है",
            encryptionKey: "एन्क्रिप्शन कुंजी:",
            encryptMessage: "संदेश एन्क्रिप्ट करें",
            decryptMessage: "संदेश डिक्रिप्ट करें",
            namesUpdated: "नाम सफलतापूर्वक अपडेट किए गए",
            recordingStarted: "रिकॉर्डिंग शुरू हुई",
            recordingStopped: "रिकॉर्डिंग रोक दी गई",
            recordingComplete: "रिकॉर्डिंग पूर्ण हुई",
            recordingError: "रिकॉर्डिंग त्रुटि",
            recordingNotSupported: "आपके ब्राउज़र में रिकॉर्डिंग समर्थित नहीं है",
            recordingSaved: "रिकॉर्डिंग सहेजी गई",
            encryptionKeyRequired: "एन्क्रिप्शन कुंजी आवश्यक है",
            messageEncrypted: "संदेश एन्क्रिप्ट किया गया",
            messageEncryptedSuccess: "संदेश सफलतापूर्वक एन्क्रिप्ट किया गया",
            decryptionFailed: "डिक्रिप्शन विफल। अपनी कुंजी जांचें।",
            noEncryptedMessage: "कोई एन्क्रिप्टेड संदेश नहीं मिला",
            messageDecrypted: "संदेश डिक्रिप्ट किया गया",
            decryptionError: "डिक्रिप्शन त्रुटि",
            fontSizeIncreased: "फ़ॉन्ट आकार बढ़ाया गया",
            fontSizeDecreased: "फ़ॉन्ट आकार घटाया गया",
            highContrastOn: "उच्च कंट्रास्ट मोड चालू",
            highContrastOff: "उच्च कंट्रास्ट मोड बंद",
            readingAloud: "जोर से पढ़ना",
            speechNotSupported: "स्पीच सिंथेसिस समर्थित नहीं है",
            pdfError: "PDF जेनरेट करने में विफल। कृपया पुनः प्रयास करें।",
            pdfLibraryError: "PDF लाइब्रेरी लोड नहीं हुई। कृपया पृष्ठ को ताज़ा करें।",
            pdfCreated: "PDF सफलतापूर्वक बनाया गया",
            happyBirthday: "जन्मदिन मुबारक हो!",
            pauseAudio: "ऑडियो रोकें",
            creatingPDF: "PDF बनाया जा रहा है...",
            typing: "टाइप हो रहा है...",
            stopReading: "पढ़ना बंद करें",
            readAloud: "जोर से पढ़ें"
        }
    };

    function getTranslation(key) {
        const lang = document.documentElement.lang || 'en';
        return translations[lang][key] || translations['en'][key] || key;
    }

    function updatePageLanguage(lang) {
        document.documentElement.lang = lang;
        
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = getTranslation(key);
            
            // Handle placeholders for input elements
            if (element.placeholder) {
                element.placeholder = getTranslation(key);
            }
        });
        
        // Update active language button
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            }
        });
        
        // Save language preference
        localStorage.setItem('preferredLanguage', lang);
        
        showConfirmation(getTranslation('languageChanged'));
    }

    // Language button event listeners
    langButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            updatePageLanguage(lang);
        });
    });

    // Load saved language preference
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    updatePageLanguage(savedLanguage);

    // Load high contrast preference
    const highContrast = localStorage.getItem('highContrast') === 'true';
    if (highContrast) {
        document.body.classList.add('high-contrast');
    }

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
                    playBtn.innerHTML = '<i class="fas fa-pause"></i> ' + getTranslation('pauseAudio');
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
                    showError(getTranslation('playbackError'));
                    playBtn.innerHTML = '<i class="fas fa-play"></i> ' + getTranslation('playAudioMessage');
                    playBtn.classList.remove('active');
                }
            } else {
                audioMessage.pause();
                playBtn.innerHTML = '<i class="fas fa-play"></i> ' + getTranslation('playAudioMessage');
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
            typeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + getTranslation('typing');
            
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
            typeBtn.innerHTML = '<i class="fas fa-keyboard"></i> ' + getTranslation('typewriterEffect');
            
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

    // PDF generation with enhanced animations - FIXED VERSION
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            // Button animation
            gsap.to(saveBtn, {
                keyframes: [
                    { scale: 1.1, duration: 0.2 },
                    { rotation: 360, duration: 0.5, ease: "back.out(2)" }
                ]
            });
            
            saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + getTranslation('creatingPDF');
            saveBtn.disabled = true;
            
            setTimeout(() => {
                try {
                    createPDF();
                } catch (error) {
                    console.error('PDF generation error:', error);
                    showError(getTranslation('pdfError'));
                } finally {
                    saveBtn.innerHTML = '<i class="fas fa-download"></i> ' + getTranslation('downloadPDF');
                    saveBtn.disabled = false;
                }
            }, 100);
        });
    }

    function createPDF() {
        // Check if jsPDF is loaded correctly
        if (typeof window.jspdf === 'undefined' || !window.jspdf.jsPDF) {
            showError(getTranslation('pdfLibraryError'));
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Set document properties
        doc.setProperties({
            title: `Birthday Message for ${document.querySelector('.recipient-name').textContent}`,
            subject: 'Birthday Wishes',
            author: document.querySelector('.sender-name').textContent,
            keywords: 'birthday, wishes, message',
            creator: 'Special Message Web App'
        });
        
        // Set font
        doc.setFont("helvetica");
        
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
        doc.text(getTranslation('heartfeltWishes'), 105, 30, { align: 'center' });
        
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
                
                // Add page border
                doc.setDrawColor(244, 162, 97);
                doc.rect(15, 15, 180, 265);
            }
        });
        
        // Add signature
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('With all my love and admiration,', 20, yPosition + 10);
        
        doc.setFontSize(18);
        doc.setTextColor(230, 57, 70);
        doc.text(document.querySelector('.sender-name').textContent, 20, yPosition + 20);
        
        // Add decorative elements at the bottom
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text('Created with love for your special day', 105, 285, { align: 'center' });
        
        // Add page numbers if multiple pages
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
        }
        
        // Save the PDF with celebration
        const fileName = `Birthday_Wishes_For_${document.querySelector('.recipient-name').textContent}.pdf`;
        doc.save(fileName);
        showConfetti(saveBtn);
        
        // Show celebration animation
        gsap.to(".message-paper", {
            keyframes: [
                { y: -10, duration: 0.3 },
                { y: 0, duration: 0.3, ease: "bounce.out" }
            ]
        });
        
        showConfirmation(getTranslation('pdfCreated'));
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
            showConfirmation(getTranslation('happyBirthday'));
            
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
            
            // Particle explosion effect
            if (typeof particlesJS !== 'undefined') {
                particlesJS('particles-js', {
                    particles: {
                        number: { value: 200, density: { enable: true, value_area: 800 } },
                        color: { value: "#e63946" },
                        shape: { type: "circle" },
                        opacity: { value: 0.5, random: true },
                        size: { value: 3, random: true },
                        line_linked: { enable: false },
                        move: {
                            enable: true,
                            speed: 6,
                            direction: "none",
                            random: true,
                            straight: false,
                            out_mode: "out",
                            bounce: false
                        }
                    },
                    interactivity: {
                        detect_on: "canvas",
                        events: {
                            onhover: { enable: false },
                            onclick: { enable: false },
                            resize: true
                        }
                    },
                    retina_detect: true
                });
                
                // Reset after 2 seconds
                setTimeout(() => {
                    particlesJS('particles-js', {
                        particles: {
                            number: { value: 80, density: { enable: true, value_area: 800 } },
                            color: { value: "#e63946" },
                            shape: { type: "circle" },
                            opacity: { value: 0.5, random: true },
                            size: { value: 3, random: true },
                            line_linked: {
                                enable: true,
                                distance: 150,
                                color: "#f4a261",
                                opacity: 0.4,
                                width: 1
                            },
                            move: {
                                enable: true,
                                speed: 2,
                                direction: "none",
                                random: true,
                                straight: false,
                                out_mode: "out",
                                bounce: false
                            }
                        },
                        interactivity: {
                            detect_on: "canvas",
                            events: {
                                onhover: { enable: true, mode: "repulse" },
                                onclick: { enable: true, mode: "push" },
                                resize: true
                            }
                        },
                        retina_detect: true
                    });
                }, 2000);
            }
            
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

    // Add scroll animations to elements
    const scrollElements = document.querySelectorAll('.message-paper, .name-form, .control-btn, .nav-btn');
    scrollElements.forEach(el => {
        el.classList.add('scroll-animate');
    });
});