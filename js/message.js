document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const playBtn = document.getElementById("playMessage");
  const typeBtn = document.getElementById("typeMessage");
  const celebrateBtn = document.getElementById("celebrateBtn");
  const messageContent = document.getElementById("messageContent");
  const audioVisualizer = document.getElementById("audioVisualizer");
  const updateNamesBtn = document.getElementById("updateNames");
  const recipientNameInput = document.getElementById("recipientName");
  const senderNameInput = document.getElementById("senderName");
  const flipCardBtn = document.getElementById("flipCard");
  const messageCard = document.querySelector(".message-card");
  const recordBtn = document.getElementById("recordBtn");
  const stopRecordBtn = document.getElementById("stopRecordBtn");
  const playRecordedBtn = document.getElementById("playRecordedBtn");
  const recorderStatus = document.getElementById("recorderStatus");
  const recordingIndicator = document.querySelector(".recording-indicator");
  const encryptBtn = document.getElementById("encryptMessage");
  const decryptBtn = document.getElementById("decryptMessage");
  const encryptionKeyInput = document.getElementById("encryptionKey");
  const fontIncreaseBtn = document.getElementById("fontIncrease");
  const fontDecreaseBtn = document.getElementById("fontDecrease");
  const highContrastBtn = document.getElementById("highContrast");
  const readAloudBtn = document.getElementById("readAloud");
  const langButtons = document.querySelectorAll(".lang-btn");

  // Audio recording variables
  let audioRecorder;
  let recordedBlob;
  let recordedAudio;

  // Audio message playback
  const audioMessage = new Audio("assets/mine.mp3");
  audioMessage.preload = "auto";

  audioMessage.addEventListener("error", function () {
    showError("Audio file not found. Please check the file exists.");
    if (playBtn) {
      playBtn.innerHTML = '<i class="fas fa-play"></i> Play Audio';
      playBtn.classList.remove("active");
    }
  });

  // Load saved names
  const savedUserName = localStorage.getItem("userName");
  const savedRecipientName = localStorage.getItem("recipientName");

  if (savedUserName) {
    document.querySelectorAll(".sender-name").forEach((el) => {
      el.textContent = savedUserName;
    });
    if (senderNameInput) senderNameInput.value = savedUserName;
  }

  if (savedRecipientName) {
    document.querySelectorAll(".recipient-name").forEach((el) => {
      el.textContent = savedRecipientName;
    });
    if (recipientNameInput) recipientNameInput.value = savedRecipientName;
  }

  // Update names
  if (updateNamesBtn) {
    updateNamesBtn.addEventListener("click", function () {
      const recipientName = recipientNameInput.value.trim() || "Madam Jii";
      const senderName = senderNameInput.value.trim() || "Your's Love";

      document.querySelectorAll(".recipient-name").forEach((el) => {
        el.textContent = recipientName;
      });

      document.querySelectorAll(".sender-name").forEach((el) => {
        el.textContent = senderName;
      });

      localStorage.setItem("recipientName", recipientName);
      localStorage.setItem("userName", senderName);

      showConfirmation("Names updated successfully!");
    });
  }

  // 3D Card Flip
  if (flipCardBtn && messageCard) {
    flipCardBtn.addEventListener("click", function () {
      messageCard.classList.toggle("flipped");
    });
  }

  // Audio recording functionality
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    if (recordBtn) {
      recordBtn.addEventListener("click", function () {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then(function (stream) {
            audioRecorder = RecordRTC(stream, {
              type: "audio",
              mimeType: "audio/webm",
              recorderType: StereoAudioRecorder,
              desiredSampRate: 16000,
              numberOfAudioChannels: 1,
              timeSlice: 1000,
              ondataavailable: function (blob) {
                // Handle data available if needed
              },
            });

            audioRecorder.startRecording();

            // Update UI
            recordBtn.disabled = true;
            if (stopRecordBtn) stopRecordBtn.disabled = false;
            if (recorderStatus) recorderStatus.style.display = "none";
            if (recordingIndicator) recordingIndicator.style.display = "flex";

            showConfirmation("Recording started");
          })
          .catch(function (err) {
            showError("Recording error: " + err.message);
          });
      });
    }

    if (stopRecordBtn) {
      stopRecordBtn.addEventListener("click", function () {
        if (audioRecorder) {
          audioRecorder.stopRecording(function () {
            recordedBlob = audioRecorder.getBlob();
            recordedAudio = URL.createObjectURL(recordedBlob);

            // Update UI
            if (recordBtn) recordBtn.disabled = false;
            if (stopRecordBtn) stopRecordBtn.disabled = true;
            if (playRecordedBtn) playRecordedBtn.disabled = false;
            if (recorderStatus) {
              recorderStatus.style.display = "block";
              recorderStatus.textContent = "Recording complete";
            }
            if (recordingIndicator) recordingIndicator.style.display = "none";

            showConfirmation("Recording stopped");

            // Save to localStorage
            const reader = new FileReader();
            reader.readAsDataURL(recordedBlob);
            reader.onloadend = function () {
              const base64data = reader.result;
              localStorage.setItem("recordedMessage", base64data);
            };
          });
        }
      });
    }

    if (playRecordedBtn) {
      playRecordedBtn.addEventListener("click", function () {
        if (recordedAudio) {
          const audio = new Audio(recordedAudio);
          audio.play();
        }
      });
    }

    // Load saved recording if exists
    const savedRecording = localStorage.getItem("recordedMessage");
    if (savedRecording && playRecordedBtn) {
      fetch(savedRecording)
        .then((res) => res.blob())
        .then((blob) => {
          recordedBlob = blob;
          recordedAudio = URL.createObjectURL(blob);
          playRecordedBtn.disabled = false;
          if (recorderStatus) recorderStatus.textContent = "Recording saved";
        });
    }
  } else {
    if (recordBtn) recordBtn.disabled = true;
    if (stopRecordBtn) stopRecordBtn.disabled = true;
    if (recorderStatus)
      recorderStatus.textContent = "Recording not supported in your browser";
  }

  // Message encryption/decryption
  if (encryptBtn) {
    encryptBtn.addEventListener("click", function () {
      const key = encryptionKeyInput.value.trim();
      if (!key) {
        showError("Encryption key is required");
        return;
      }

      const message = messageContent.innerHTML;
      const encrypted = CryptoJS.AES.encrypt(message, key).toString();

      // Save to localStorage
      localStorage.setItem("encryptedMessage", encrypted);

      // Update UI
      messageContent.innerHTML =
        '<p style="text-align:center;color:#888;font-style:italic;">Message encrypted</p>';

      showConfirmation("Message encrypted successfully");
    });
  }

  if (decryptBtn) {
    decryptBtn.addEventListener("click", function () {
      const key = encryptionKeyInput.value.trim();
      if (!key) {
        showError("Encryption key is required");
        return;
      }

      const encrypted = localStorage.getItem("encryptedMessage");
      if (!encrypted) {
        showError("No encrypted message found");
        return;
      }

      try {
        const decrypted = CryptoJS.AES.decrypt(encrypted, key).toString(
          CryptoJS.enc.Utf8
        );

        if (!decrypted) {
          showError("Decryption failed. Check your key.");
          return;
        }

        messageContent.innerHTML = decrypted;
        showConfirmation("Message decrypted");
      } catch (error) {
        showError("Decryption error");
      }
    });
  }

  // Accessibility features
  if (fontIncreaseBtn) {
    fontIncreaseBtn.addEventListener("click", function () {
      const currentSize = parseFloat(getComputedStyle(document.body).fontSize);
      document.body.style.fontSize = currentSize + 1 + "px";
      showConfirmation("Font size increased");
    });
  }

  if (fontDecreaseBtn) {
    fontDecreaseBtn.addEventListener("click", function () {
      const currentSize = parseFloat(getComputedStyle(document.body).fontSize);
      document.body.style.fontSize = currentSize - 1 + "px";
      showConfirmation("Font size decreased");
    });
  }

  if (highContrastBtn) {
    highContrastBtn.addEventListener("click", function () {
      document.body.classList.toggle("high-contrast");
      const isHighContrast = document.body.classList.contains("high-contrast");
      localStorage.setItem("highContrast", isHighContrast);
      showConfirmation(
        isHighContrast ? "High contrast mode on" : "High contrast mode off"
      );
    });
  }

  // Text-to-speech with male voice
  if (readAloudBtn) {
    readAloudBtn.addEventListener("click", function () {
      if ("speechSynthesis" in window) {
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
        maleVoice = voices.find(
          (voice) =>
            voice.name.includes("Male") ||
            voice.name.includes("male") ||
            voice.name.includes("David") ||
            voice.name.includes("Google UK English Male") ||
            voice.name.includes("Microsoft David") ||
            voice.name.includes("Alex")
        );

        // If no specifically male voice found, use a lower-pitched voice
        if (!maleVoice) {
          maleVoice = voices.find(
            (voice) =>
              voice.lang.includes("en") &&
              !voice.name.includes("Female") &&
              !voice.name.includes("female") &&
              !voice.name.includes("Zira") &&
              !voice.name.includes("Samantha")
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
          speech.lang = document.documentElement.lang || "en-US";
        }

        window.speechSynthesis.speak(speech);
        showConfirmation("Reading aloud");

        // Change button appearance while speaking
        readAloudBtn.innerHTML = '<i class="fas fa-pause"></i> Stop Reading';
        readAloudBtn.classList.add("active");

        // Reset button when speech ends
        speech.onend = function () {
          readAloudBtn.innerHTML =
            '<i class="fas fa-volume-up"></i> Read Aloud';
          readAloudBtn.classList.remove("active");
        };
      } else {
        showError("Speech synthesis not supported");
      }
    });
  }

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
      audioNotFound: "Audio file not found. Please check the file exists.",
      celebrationStarted: "Celebration started",
    },
    fr: {
      specialMessage: "Message Spécial",
      heartfeltWishes: "Vœux sincères pour votre journée spéciale",
      recipientsName: "Nom du destinataire:",
      yourName: "Votre nom:",
      updateNames: "Mettre à jour les noms",
      playAudioMessage: "Lire le message audio",
      typewriterEffect: "Effet machine à écrire",
      celebrate: "Célébrer!",
      backToVideos: "Retour aux vidéos",
      returnToHome: "Retour à l'accueil",
      birthdayGame: "Jeu d'anniversaire",
      flipCard: "Retourner la carte",
      personalVoiceMessage: "Message vocal personnel",
      recordMessage: "Enregistrer un message",
      stopRecording: "Arrêter l'enregistrement",
      playRecording: "Lire l'enregistrement",
      readyToRecord: "Prêt à enregistrer",
      recording: "Enregistrement en cours",
      encryptionKey: "Clé de chiffrement:",
      encryptMessage: "Chiffrer le message",
      decryptMessage: "Déchiffrer le message",
      namesUpdated: "Noms mis à jour avec succès!",
      recordingStarted: "Enregistrement démarré",
      recordingStopped: "Enregistrement arrêté",
      recordingComplete: "Enregistrement terminé",
      recordingError: "Erreur d'enregistrement",
      recordingNotSupported:
        "Enregistrement non pris en charge dans votre navigateur",
      recordingSaved: "Enregistrement sauvegardé",
      encryptionKeyRequired: "La clé de chiffrement est requise",
      messageEncrypted: "Message chiffré",
      messageEncryptedSuccess: "Message chiffré avec succès",
      decryptionFailed: "Échec du déchiffrement. Vérifiez votre clé.",
      noEncryptedMessage: "Aucun message chiffré trouvé",
      messageDecrypted: "Message déchiffré",
      decryptionError: "Erreur de déchiffrement",
      fontSizeIncreased: "Taille de police augmentée",
      fontSizeDecreased: "Taille de police réduite",
      highContrastOn: "Mode contraste élevé activé",
      highContrastOff: "Mode contraste élevé désactivé",
      readingAloud: "Lecture à voix haute",
      speechNotSupported: "Synthèse vocale non prise en charge",
      audioNotFound:
        "Fichier audio introuvable. Veuillez vérifier que le fichier existe.",
      celebrationStarted: "Célébration commencée",
    },
    es: {
      specialMessage: "Mensaje Especial",
      heartfeltWishes: "Deseos sinceros para tu día especial",
      recipientsName: "Nombre del destinatario:",
      yourName: "Tu nombre:",
      updateNames: "Actualizar nombres",
      playAudioMessage: "Reproducir mensaje de audio",
      typewriterEffect: "Efecto máquina de escribir",
      celebrate: "¡Celebrar!",
      backToVideos: "Volver a videos",
      returnToHome: "Volver al inicio",
      birthdayGame: "Juego de cumpleaños",
      flipCard: "Voltear tarjeta",
      personalVoiceMessage: "Mensaje de voz personal",
      recordMessage: "Grabar mensaje",
      stopRecording: "Detener grabación",
      playRecording: "Reproducir grabación",
      readyToRecord: "Listo para grabar",
      recording: "Grabando",
      encryptionKey: "Clave de cifrado:",
      encryptMessage: "Cifrar mensaje",
      decryptMessage: "Descifrar mensaje",
      namesUpdated: "¡Nombres actualizados exitosamente!",
      recordingStarted: "Grabación iniciada",
      recordingStopped: "Grabación detenida",
      recordingComplete: "Grabación completada",
      recordingError: "Error de grabación",
      recordingNotSupported: "Grabación no compatible con su navegador",
      recordingSaved: "Grabación guardada",
      encryptionKeyRequired: "Se requiere clave de cifrado",
      messageEncrypted: "Mensaje cifrado",
      messageEncryptedSuccess: "Mensaje cifrado exitosamente",
      decryptionFailed: "Error al descifrar. Verifique su clave.",
      noEncryptedMessage: "No se encontró mensaje cifrado",
      messageDecrypted: "Mensaje descifrado",
      decryptionError: "Error de descifrado",
      fontSizeIncreased: "Tamaño de fuente aumentado",
      fontSizeDecreased: "Tamaño de fuente disminuido",
      highContrastOn: "Modo alto contraste activado",
      highContrastOff: "Modo alto contraste desactivado",
      readingAloud: "Leyendo en voz alta",
      speechNotSupported: "Síntesis de voz no compatible",
      audioNotFound:
        "Archivo de audio no encontrado. Por favor, verifique que el archivo exista.",
      celebrationStarted: "Celebración iniciada",
    },
  };

  // Set language
  let currentLang = localStorage.getItem("language") || "en";

  // Apply saved language
  applyLanguage(currentLang);

  // Language buttons
  langButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const lang = this.getAttribute("data-lang");
      currentLang = lang;
      localStorage.setItem("language", lang);
      applyLanguage(lang);

      // Update active button
      langButtons.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // Apply language function
  function applyLanguage(lang) {
    const t = translations[lang];
    document.documentElement.lang = lang;

    // Update all elements with data-i18n attribute
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (t[key]) {
        el.textContent = t[key];
      }
    });

    // Update button states
    langButtons.forEach((btn) => {
      if (btn.getAttribute("data-lang") === lang) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  // Theme switching
  const themeOptions = document.querySelectorAll(".theme-option");
  themeOptions.forEach((option) => {
    option.addEventListener("click", function () {
      const theme = this.getAttribute("data-theme");
      document.body.className = "";
      if (theme !== "default") {
        document.body.classList.add(`theme-${theme}`);
      }
      localStorage.setItem("theme", theme);
    });
  });

  // Apply saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme && savedTheme !== "default") {
    document.body.classList.add(`theme-${savedTheme}`);
  }

  // Audio message playback
  if (playBtn) {
    playBtn.addEventListener("click", function () {
      if (audioMessage.paused) {
        audioMessage.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i> Pause Audio';
        playBtn.classList.add("active");

        audioMessage.onended = function () {
          playBtn.innerHTML = '<i class="fas fa-play"></i> Play Audio Message';
          playBtn.classList.remove("active");
        };
      } else {
        audioMessage.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i> Play Audio Message';
        playBtn.classList.remove("active");
      }
    });
  }

  // Typewriter effect - FIXED to preserve HTML structure
  if (typeBtn) {
    typeBtn.addEventListener("click", function () {
      // Store the original HTML
      const originalHTML = messageContent.innerHTML;

      // Clear the content
      messageContent.innerHTML = "";
      messageContent.style.visibility = "visible";

      typeBtn.disabled = true;
      typeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Typing...';

      // Parse the HTML into elements
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = originalHTML;

      let elements = Array.from(tempDiv.childNodes);
      let currentElementIndex = 0;
      let currentTextIndex = 0;
      let currentElement = null;

      function typeNextCharacter() {
        // If we don't have a current element, get the next one
        if (!currentElement && currentElementIndex < elements.length) {
          currentElement = elements[currentElementIndex];

          // If it's a text node, process it
          if (currentElement.nodeType === 3) {
            const textNode = document.createTextNode("");
            messageContent.appendChild(textNode);
            currentTextIndex = 0;
          }
          // If it's an element, create a clone and add it
          else if (currentElement.nodeType === 1) {
            const clone = currentElement.cloneNode(false);
            messageContent.appendChild(clone);

            // If it has child nodes, process them recursively
            if (currentElement.childNodes.length > 0) {
              elements.splice(
                currentElementIndex + 1,
                0,
                ...Array.from(currentElement.childNodes)
              );
            }

            currentElementIndex++;
            currentElement = null;
            setTimeout(typeNextCharacter, 50);
            return;
          }
        }

        // If we have a text node to process
        if (currentElement && currentElement.nodeType === 3) {
          const textContent = currentElement.textContent;

          if (currentTextIndex < textContent.length) {
            const textNode = messageContent.lastChild;
            textNode.textContent += textContent.charAt(currentTextIndex);
            currentTextIndex++;
            setTimeout(typeNextCharacter, 20);
          } else {
            // Move to next element
            currentElementIndex++;
            currentElement = null;
            setTimeout(typeNextCharacter, 100);
          }
        }
        // If we've processed all elements
        else if (currentElementIndex >= elements.length) {
          typeBtn.disabled = false;
          typeBtn.innerHTML =
            '<i class="fas fa-keyboard"></i> Typewriter Effect';
        }
        // Otherwise, get next element
        else {
          currentElement = elements[currentElementIndex];

          // If it's a text node, prepare to process it
          if (currentElement.nodeType === 3) {
            const textNode = document.createTextNode("");
            messageContent.appendChild(textNode);
            currentTextIndex = 0;
            setTimeout(typeNextCharacter, 50);
          }
          // If it's an element, create it and process its children
          else if (currentElement.nodeType === 1) {
            const clone = currentElement.cloneNode(false);
            messageContent.appendChild(clone);

            // If it has child nodes, add them to the elements array
            if (currentElement.childNodes.length > 0) {
              elements.splice(
                currentElementIndex + 1,
                0,
                ...Array.from(currentElement.childNodes)
              );
            }

            currentElementIndex++;
            currentElement = null;
            setTimeout(typeNextCharacter, 50);
          }
        }
      }

      // Start the typing effect
      typeNextCharacter();
    });
  }

  // Celebration effect - FIXED to use browser confetti
  if (celebrateBtn) {
    celebrateBtn.addEventListener("click", function () {
      // Use browser's confetti function
      if (typeof confetti === "function") {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
        });

        // Add more confetti for better effect
        setTimeout(
          () =>
            confetti({
              particleCount: 100,
              angle: 60,
              spread: 55,
              origin: { x: 0 },
            }),
          250
        );

        setTimeout(
          () =>
            confetti({
              particleCount: 100,
              angle: 120,
              spread: 55,
              origin: { x: 1 },
            }),
          400
        );
      }

      // Play celebration sound if available
      try {
        const celebrationSound = new Audio("assets/celebration.mp3");
        celebrationSound.volume = 0.5;
        celebrationSound
          .play()
          .catch((e) => console.log("Could not play celebration sound:", e));
      } catch (e) {
        console.log("Celebration sound error:", e);
      }

      showConfirmation("Celebration started!");
    });
  }

  // Notification functions
  function showConfirmation(message) {
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("show");
    }, 10);

    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  function showError(message) {
    const notification = document.createElement("div");
    notification.className = "notification error";
    notification.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("show");
    }, 10);

    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  // Initialize particles
  if (typeof particlesJS !== "undefined") {
    particlesJS("particles-js", {
      particles: {
        number: { value: 30, density: { enable: true, value_area: 800 } },
        color: { value: "#e91e63" },
        shape: { type: "heart" },
        opacity: { value: 0.5, random: true },
        size: { value: 10, random: true },
        line_linked: { enable: false },
        move: {
          enable: true,
          speed: 2,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false,
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "repulse" },
          onclick: { enable: true, mode: "push" },
          resize: true,
        },
      },
      retina_detect: true,
    });
  }
});