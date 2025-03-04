/**
 * Audio player functionality
 */
document.addEventListener('DOMContentLoaded', function () {
    // Audio elements and controls
    const qualityDropdown = document.getElementById('quality-dropdown');
    const voiceDropdown = document.getElementById('voice-dropdown');
    const playButtons = document.querySelectorAll('.play-button');
    const progressBars = document.querySelectorAll('.progress-bar');
    const progressContainers = document.querySelectorAll('.progress-container');
    const timeDisplays = document.querySelectorAll('.time-display');
    const downloadButtons = document.querySelectorAll('.download-button');

    // State management
    let currentlyPlaying = null;
    let currentVoiceType = 'male';
    let currentQuality = 'premium';

    /**
     * Format time in MM:SS format
     * @param {number} seconds - Time in seconds
     * @returns {string} - Formatted time string
     */
    function formatTime(seconds) {
        seconds = Math.floor(seconds);
        const minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    /**
     * Initialize dropdown functionality
     */
    function initDropdowns() {
        // Toggle dropdowns
        [qualityDropdown, voiceDropdown].forEach(dropdown => {
            if (!dropdown) return;

            dropdown.addEventListener('click', function (e) {
                this.classList.toggle('active');
                e.stopPropagation();
            });
        });

        // Handle dropdown option selection
        document.querySelectorAll('.dropdown-content a').forEach(option => {
            option.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                const dropdown = this.closest('.dropdown');
                const selectedValue = this.getAttribute('data-value');

                // Update selected option text
                dropdown.querySelector('.selected-option').textContent = this.textContent;

                // Update current voice type or quality
                if (dropdown.id === 'voice-dropdown') {
                    currentVoiceType = selectedValue;
                } else if (dropdown.id === 'quality-dropdown') {
                    currentQuality = selectedValue;
                }

                // Close dropdown
                dropdown.classList.remove('active');

                // Update audio sources based on new selection
                updateAudioSources();
            });
        });

        // Close dropdowns when clicking elsewhere
        document.addEventListener('click', function () {
            if (qualityDropdown) qualityDropdown.classList.remove('active');
            if (voiceDropdown) voiceDropdown.classList.remove('active');
        });
    }

    /**
     * Update audio sources based on current selections
     */
    function updateAudioSources() {
        // If an audio is currently playing, pause it
        if (currentlyPlaying) {
            currentlyPlaying.pause();

            // Reset all play buttons
            playButtons.forEach(button => {
                button.textContent = '▶';
                button.setAttribute('aria-label', 'Play');
            });

            currentlyPlaying = null;
        }

        // Update progress bars to 0
        progressBars.forEach(bar => {
            bar.style.width = '0%';
        });

        // Reset time displays
        playButtons.forEach((button, index) => {
            const trackNumber = button.getAttribute('data-track');
            const audioId = `audio-${currentVoiceType}-${currentQuality}-${trackNumber}`;
            const audio = document.getElementById(audioId);

            if (audio) {
                if (audio.readyState >= 2) { // HAVE_CURRENT_DATA or higher
                    timeDisplays[index].textContent = `0:00 / ${formatTime(audio.duration)}`;
                } else {
                    timeDisplays[index].textContent = `0:00 / 0:00`;

                    // Update time display when metadata is loaded
                    audio.addEventListener('loadedmetadata', function () {
                        timeDisplays[index].textContent = `0:00 / ${formatTime(audio.duration)}`;
                    });
                }
            } else {
                timeDisplays[index].textContent = `0:00 / 0:00`;
                console.warn(`Audio element with ID ${audioId} not found`);
            }
        });
    }

    /**
     * Setup audio player controls
     */
    function setupAudioPlayers() {
        playButtons.forEach((button, index) => {
            const progressBar = progressBars[index];
            const progressContainer = progressContainers[index];
            const timeDisplay = timeDisplays[index];

            // Play/pause button click event
            button.addEventListener('click', function () {
                const trackNumber = this.getAttribute('data-track');
                const audioId = `audio-${currentVoiceType}-${currentQuality}-${trackNumber}`;
                const audio = document.getElementById(audioId);

                if (!audio) {
                    console.error(`Audio element with ID ${audioId} not found`);
                    return;
                }

                // Set up events for this audio element if not already set
                if (!audio._eventsSet) {
                    // Update progress bar and time display during playback
                    audio.addEventListener('timeupdate', function () {
                        const currentTime = audio.currentTime;
                        const duration = audio.duration || 0;
                        const percentage = duration > 0 ? (currentTime / duration) * 100 : 0;

                        progressBar.style.width = `${percentage}%`;
                        timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;

                        // If audio has ended, reset button
                        if (currentTime >= duration) {
                            button.textContent = '▶';
                            button.setAttribute('aria-label', 'Play');
                            currentlyPlaying = null;
                        }
                    });

                    // Handle audio errors
                    audio.addEventListener('error', function (e) {
                        console.error('Audio error:', e);
                        button.textContent = '▶';
                        button.setAttribute('aria-label', 'Play');
                        timeDisplay.textContent = 'Error loading audio';
                    });

                    // Handle audio ended event
                    audio.addEventListener('ended', function () {
                        button.textContent = '▶';
                        button.setAttribute('aria-label', 'Play');
                        currentlyPlaying = null;
                    });

                    audio._eventsSet = true;
                }

                // If there's another audio playing, pause it
                if (currentlyPlaying && currentlyPlaying !== audio) {
                    currentlyPlaying.pause();

                    // Reset the button for previously playing audio
                    playButtons.forEach(btn => {
                        btn.textContent = '▶';
                        btn.setAttribute('aria-label', 'Play');
                    });
                }

                if (audio.paused) {
                    audio.play()
                        .then(() => {
                            button.textContent = '❚❚';
                            button.setAttribute('aria-label', 'Pause');
                            currentlyPlaying = audio;
                        })
                        .catch(e => {
                            console.error('Error playing audio:', e);
                            // Show an error message to the user
                            timeDisplay.textContent = 'Playback error';
                        });
                } else {
                    audio.pause();
                    button.textContent = '▶';
                    button.setAttribute('aria-label', 'Play');
                    currentlyPlaying = null;
                }
            });

            // Click on progress bar to seek
            progressContainer.addEventListener('click', function (e) {
                const trackNumber = button.getAttribute('data-track');
                const audioId = `audio-${currentVoiceType}-${currentQuality}-${trackNumber}`;
                const audio = document.getElementById(audioId);

                if (!audio) return;

                const rect = progressContainer.getBoundingClientRect();
                const position = (e.clientX - rect.left) / rect.width;

                if (audio.duration) {
                    audio.currentTime = position * audio.duration;
                }
            });

            // Add keyboard support for progress bar
            progressContainer.tabIndex = 0;
            progressContainer.addEventListener('keydown', function (e) {
                const trackNumber = button.getAttribute('data-track');
                const audioId = `audio-${currentVoiceType}-${currentQuality}-${trackNumber}`;
                const audio = document.getElementById(audioId);

                if (!audio) return;

                // Arrow keys for seeking
                if (e.key === 'ArrowRight') {
                    audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
                    e.preventDefault();
                } else if (e.key === 'ArrowLeft') {
                    audio.currentTime = Math.max(0, audio.currentTime - 5);
                    e.preventDefault();
                }
            });
        });

        // Initialize download buttons
        downloadButtons.forEach(button => {
            button.addEventListener('click', function () {
                const trackNumber = this.getAttribute('data-track');
                const audioId = `audio-${currentVoiceType}-${currentQuality}-${trackNumber}`;
                const audio = document.getElementById(audioId);

                if (!audio) {
                    console.error(`Audio element with ID ${audioId} not found`);
                    return;
                }

                const sourceElement = audio.querySelector('source');
                if (!sourceElement) {
                    console.error('No source element found in audio');
                    return;
                }

                // Get file name from track info
                const card = this.closest('.card');
                let fileName = `audio-${trackNumber}`;

                if (card) {
                    const titleElement = card.querySelector('.card-title');
                    if (titleElement) {
                        fileName = titleElement.textContent
                            .trim()
                            .toLowerCase()
                            .replace(/[^a-z0-9]/g, '-');
                    }
                }

                // Create a temporary link and trigger download
                const link = document.createElement('a');
                link.href = sourceElement.src;
                link.download = `${fileName}-${currentVoiceType}-${currentQuality}.mp3`;

                // Append to body, click, and remove
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        });
    }

    // Initialize audio players if elements exist
    if (playButtons.length > 0) {
        initDropdowns();
        updateAudioSources();
        setupAudioPlayers();
    }
});