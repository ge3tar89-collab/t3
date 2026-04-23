/**
 * Media Integration Extension for App
 */
if (typeof App !== 'undefined') {
    App.prototype.addMp3PlayerControls = function() {
        const mainContent = document.querySelector('.main-content');
        const fretboardContainer = document.querySelector('.fretboard-container');
        
        const mp3Container = document.createElement('div');
        mp3Container.className = 'mp3-player-container';
        mp3Container.style.margin = '20px 0';
        mp3Container.style.display = 'none';
        
        const audioPlayer = document.createElement('audio');
        audioPlayer.id = 'mp3-player';
        audioPlayer.controls = true;
        audioPlayer.style.width = '100%';
        
        mp3Container.appendChild(audioPlayer);
        mainContent.insertBefore(mp3Container, fretboardContainer);
        
        const mp4Container = document.createElement('div');
        mp4Container.className = 'mp4-player-container';
        mp4Container.style.margin = '20px 0';
        mp4Container.style.display = 'none';
        
        const videoPlayer = document.createElement('video');
        videoPlayer.id = 'mp4-player';
        videoPlayer.controls = true;
        videoPlayer.style.width = '100%';
        
        mp4Container.appendChild(videoPlayer);
        mainContent.insertBefore(mp4Container, fretboardContainer);
        
        const jpgContainer = document.createElement('div');
        jpgContainer.className = 'jpg-image-container';
        jpgContainer.style.margin = '20px 0';
        jpgContainer.style.display = 'none';
        
        const imageElement = document.createElement('img');
        imageElement.id = 'jpg-image';
        imageElement.style.width = '100%';
        imageElement.style.maxHeight = '400px';
        imageElement.style.objectFit = 'contain';
        
        jpgContainer.appendChild(imageElement);
        mainContent.insertBefore(jpgContainer, fretboardContainer);
        
        const pianoContainer = document.createElement('div');
        pianoContainer.className = 'piano-container';
        pianoContainer.style.margin = '20px 0';
        pianoContainer.style.display = 'none';
        
        if (typeof this.createPianoKeyboard === 'function') {
            pianoContainer.appendChild(this.createPianoKeyboard());
        }
        mainContent.insertBefore(pianoContainer, fretboardContainer);
        
        const sidebar = document.querySelector('.sidebar');
        
        const mediaSection = document.createElement('div');
        mediaSection.className = 'media-controls-section';
        mediaSection.innerHTML = '<h2 class="sidebar-heading">Media Controls</h2>';
        mediaSection.style.marginTop = '20px';
        
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.display = 'grid';
        buttonsContainer.style.gridTemplateColumns = '1fr';
        buttonsContainer.style.gap = '10px';
        buttonsContainer.style.padding = '10px';
        
        const mp3Button = document.createElement('button');
        mp3Button.className = 'media-control-button';
        mp3Button.textContent = 'MP3 Player';
        mp3Button.addEventListener('click', () => {
            const isVisible = mp3Container.style.display !== 'none';
            mp3Container.style.display = isVisible ? 'none' : 'block';
            if (!isVisible) this.updateAudioSource();
        });
        
        const mp4Button = document.createElement('button');
        mp4Button.className = 'media-control-button';
        mp4Button.textContent = 'MP4 Player';
        mp4Button.addEventListener('click', () => {
            const isVisible = mp4Container.style.display !== 'none';
            mp4Container.style.display = isVisible ? 'none' : 'block';
            if (!isVisible) this.updateVideoSource();
        });
        
        const jpgButton = document.createElement('button');
        jpgButton.className = 'media-control-button';
        jpgButton.textContent = 'JPG Image';
        jpgButton.addEventListener('click', () => {
            const isVisible = jpgContainer.style.display !== 'none';
            jpgContainer.style.display = isVisible ? 'none' : 'block';
            if (!isVisible) this.updateImageSource();
        });
        
        const pianoButton = document.createElement('button');
        pianoButton.className = 'media-control-button';
        pianoButton.textContent = 'Piano';
        pianoButton.addEventListener('click', () => {
            const isVisible = pianoContainer.style.display !== 'none';
            pianoContainer.style.display = isVisible ? 'none' : 'block';
            if (!isVisible && typeof this.updatePianoHighlights === 'function') {
                this.updatePianoHighlights();
            }
        });
        
        buttonsContainer.appendChild(mp3Button);
        buttonsContainer.appendChild(mp4Button);
        buttonsContainer.appendChild(jpgButton);
        buttonsContainer.appendChild(pianoButton);
        
        // Prefer to place media controls in the bottom controls area when available,
        // fall back to the sidebar if the bottom area is not yet injected.
        const bottomControls = document.getElementById('controls-bottom');
        if (bottomControls) {
            // Insert a small heading wrapper so media controls integrate with bottom layout
            const wrapper = document.createElement('div');
            wrapper.style.display = 'grid';
            wrapper.style.gridTemplateColumns = '1fr';
            wrapper.style.gap = '8px';
            wrapper.style.padding = '8px 0';
            wrapper.appendChild(mediaSection);
            wrapper.appendChild(buttonsContainer);
            bottomControls.insertBefore(wrapper, bottomControls.firstChild);
        } else {
            sidebar.appendChild(mediaSection);
            sidebar.appendChild(buttonsContainer);
        }
    };

    App.prototype.getContrastColor = function(hexColor) {
        const hex = hexColor.replace(/^#/, '');
        let r, g, b;
        if (hex.length === 3) {
            r = parseInt(hex[0] + hex[0], 16);
            g = parseInt(hex[1] + hex[1], 16);
            b = parseInt(hex[2] + hex[2], 16);
        } else {
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        }
        if (isNaN(r) || isNaN(g) || isNaN(b)) return '#000000';
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 125 ? '#000000' : '#FFFFFF';
    };

    App.prototype.updateAudioSource = function() {
        console.log('updateAudioSource: Called. Implement audio source update logic as needed.');
    };

    App.prototype.updateImageSource = function() {
        console.log('updateImageSource: Called. Implement image source update logic as needed.');
    };
    
    App.prototype.updateVideoSource = function() {
        console.log('updateVideoSource: Called. Implement video source update logic as needed.');
    };
}