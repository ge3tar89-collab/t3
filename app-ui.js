/**
 * UI Builder Extension for App
 * Contains methods to build UI controls
 */
if (typeof App !== 'undefined') {
    /**
     * Update pattern select options based on the selected pattern type
     */
    App.prototype.updatePatternSelect = function() {
        const patternType = document.getElementById('pattern-type').value;
        const patternSelect = document.getElementById('pattern-select');
        patternSelect.innerHTML = '';
        let patterns;
        switch (patternType) {
            case 'scale':
                patterns = this.musicTheory.scales;
                break;
            case 'chord':
                patterns = this.musicTheory.chords;
                break;
            case 'interval':
                patterns = {};
                if (this.musicTheory && this.musicTheory.intervals) {
                    const intervalEntries = Object.entries(this.musicTheory.intervals)
                        .sort(([, a], [, b]) => {
                            if (a.semitones === b.semitones) return (a.name || '').localeCompare(b.name || '');
                            return a.semitones - b.semitones;
                        });
                    for (const [id, data] of intervalEntries) {
                        patterns[id] = data;
                    }
                }
                break;
            case 'gamut':
                patterns = this.musicTheory.gamuts || {};
                break;
            case 'lesson':
                for (let i = 0; i < this.lessons.length; i++) {
                    const option = document.createElement('option');
                    option.value = i;
                    option.textContent = this.lessons[i].title;
                    patternSelect.appendChild(option);
                }
                return;
            case 'chord_progression':
                patterns = this.chordProgressionPatterns;
                break;
            case 'grid':
                for (let i = 0; i <= 13; i++) {
                    const option = document.createElement('option');
                    option.value = i;
                    option.textContent = `Positions ${i}-${i+2}`;
                    patternSelect.appendChild(option);
                }
                return;
            case 'grid2':
                for (let i = 0; i <= 14; i++) {
                    const option = document.createElement('option');
                    option.value = i;
                    option.textContent = `Positions ${i}-${i+1}`;
                    patternSelect.appendChild(option);
                }
                return;
            case 'custom':
                patterns = this.musicTheory.customPatterns || {};
                break;
            default:
                patterns = {};
        }
        
        if (patternType === 'custom' && Object.keys(patterns).length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No custom patterns yet';
            patternSelect.appendChild(option);
            return;
        }

        for (const [id, data] of Object.entries(patterns)) {
            const option = document.createElement('option');
            if (patternType === 'chord_progression') {
                option.value = data.id;
                option.textContent = data.name;
            } else {
                option.value = id;
                option.textContent = data.name;
            }
            patternSelect.appendChild(option);
        }
    };

    /**
     * Populate theme dropdowns dynamically
     */
    App.prototype.populateThemeDropdowns = function() {
        const colorThemeSelect = document.getElementById('color-theme');
        if (colorThemeSelect && typeof THEMES_DATA !== 'undefined') {
            const options = Array.from(colorThemeSelect.options);
            colorThemeSelect.innerHTML = '';
            colorThemeSelect.appendChild(options.find(o => o.value === 'default') || new Option('Default', 'default'));
            
            Object.keys(THEMES_DATA).forEach(theme => {
                if (theme !== 'default') {
                    const opt = new Option(theme.charAt(0).toUpperCase() + theme.slice(1).replace(/([A-Z])/g, ' $1'), theme);
                    colorThemeSelect.appendChild(opt);
                }
            });
            colorThemeSelect.appendChild(options.find(o => o.value === 'custom') || new Option('Custom', 'custom'));
            
            if (this.settings && this.settings.colorTheme) {
                colorThemeSelect.value = this.settings.colorTheme;
            }
        }
        
        const pageThemeSelect = document.getElementById('page-theme');
        if (pageThemeSelect) {
            const pageThemes = ['dark-mode', 'light-mode', 'night-owl', 'sepia', 'forest', 'ocean', 'sunset', 'monochrome', 'high-contrast', 'pastel', 'neon', 'cyberpunk', 'retro', 'minimal', 'vintage'];
            const defaultOpt = pageThemeSelect.options[0];
            pageThemeSelect.innerHTML = '';
            pageThemeSelect.appendChild(defaultOpt || new Option('Default', 'default'));
            pageThemes.forEach(theme => {
                const name = theme.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                pageThemeSelect.appendChild(new Option(name, theme));
            });
            const savedTheme = localStorage.getItem('pageTheme');
            if (savedTheme) pageThemeSelect.value = savedTheme;
        }
    };

    App.prototype.addFretNumberOptions = function() {
        const appearanceSection = document.querySelector('.appearance');
        
        const fretNumbersSection = document.createElement('div');
        fretNumbersSection.innerHTML = '<h3>Fret Numbers</h3>';
        appearanceSection.appendChild(fretNumbersSection);
        
        const placementGroup = document.createElement('div');
        placementGroup.className = 'control-group';
        
        const placementLabel = document.createElement('label');
        placementLabel.textContent = 'Placement:';
        placementLabel.setAttribute('for', 'fret-numbers-placement');
        
        const placementSelect = document.createElement('select');
        placementSelect.id = 'fret-numbers-placement';
        
        const placementOptions = [
            { value: 'below', text: 'Below Diagram' },
            { value: 'above', text: 'Above Diagram' }
        ];
        
        placementOptions.forEach(option => {
            const optElement = document.createElement('option');
            optElement.value = option.value;
            optElement.textContent = option.text;
            placementSelect.appendChild(optElement);
        });
        
        placementGroup.appendChild(placementLabel);
        placementGroup.appendChild(placementSelect);
        fretNumbersSection.appendChild(placementGroup);
        
        const positionGroup = document.createElement('div');
        positionGroup.className = 'control-group';
        
        const positionLabel = document.createElement('label');
        positionLabel.textContent = 'Alignment:';
        positionLabel.setAttribute('for', 'fret-numbers-position');
        
        const positionSelect = document.createElement('select');
        positionSelect.id = 'fret-numbers-position';
        
        const positionOptions = [
            { value: 'center', text: 'Centered' },
            { value: 'left', text: 'Left' },
            { value: 'right', text: 'Right' }
        ];
        
        positionOptions.forEach(option => {
            const optElement = document.createElement('option');
            optElement.value = option.value;
            optElement.textContent = option.text;
            positionSelect.appendChild(optElement);
        });
        
        positionGroup.appendChild(positionLabel);
        positionGroup.appendChild(positionSelect);
        fretNumbersSection.appendChild(positionGroup);
        
        const sizeGroup = document.createElement('div');
        sizeGroup.className = 'control-group';
        
        const sizeLabel = document.createElement('label');
        sizeLabel.textContent = 'Size (px):';
        sizeLabel.setAttribute('for', 'fret-numbers-size');
        
        const sizeInput = document.createElement('input');
        sizeInput.type = 'number';
        sizeInput.id = 'fret-numbers-size';
        sizeInput.min = '8';
        sizeInput.max = '24';
        sizeInput.value = '12';
        
        sizeGroup.appendChild(sizeLabel);
        sizeGroup.appendChild(sizeInput);
        fretNumbersSection.appendChild(sizeGroup);

        const fretNumberOffsetGroup = document.createElement('div');
        fretNumberOffsetGroup.className = 'control-group';
        
        const fretNumberOffsetLabel = document.createElement('label');
        fretNumberOffsetLabel.textContent = 'Vertical Offset (px):';
        fretNumberOffsetLabel.setAttribute('for', 'fret-numbers-offset');
        
        const fretNumberOffsetInput = document.createElement('input');
        fretNumberOffsetInput.type = 'range';
        fretNumberOffsetInput.id = 'fret-numbers-offset';
        fretNumberOffsetInput.min = '-20';
        fretNumberOffsetInput.max = '20';
        // Default to the minimum offset value
        fretNumberOffsetInput.value = fretNumberOffsetInput.min;
        fretNumberOffsetInput.addEventListener('change', () => this.updateFretboard());
        
        fretNumberOffsetGroup.appendChild(fretNumberOffsetLabel);
        fretNumberOffsetGroup.appendChild(fretNumberOffsetInput);
        fretNumbersSection.appendChild(fretNumberOffsetGroup);

        const markerPlacementGroup = document.createElement('div');
        markerPlacementGroup.className = 'control-group';
        
        const markerPlacementLabel = document.createElement('label');
        markerPlacementLabel.textContent = 'Fret Marker Placement:';
        markerPlacementLabel.setAttribute('for', 'fret-markers-placement');
        
        const markerPlacementSelect = document.createElement('select');
        markerPlacementSelect.id = 'fret-markers-placement';
        
        const markerPlacementOptions = [
            { value: 'on', text: 'On Fretboard' },
            { value: 'above', text: 'Above Fretboard' },
            { value: 'below', text: 'Below Fretboard' }
        ];
        
        markerPlacementOptions.forEach(option => {
            const optElement = document.createElement('option');
            optElement.value = option.value;
            optElement.textContent = option.text;
            markerPlacementSelect.appendChild(optElement);
        });
        
        markerPlacementGroup.appendChild(markerPlacementLabel);
        markerPlacementGroup.appendChild(markerPlacementSelect);
        fretNumbersSection.appendChild(markerPlacementGroup);
        
        const fretMarkerOffsetGroup = document.createElement('div');
        fretMarkerOffsetGroup.className = 'control-group';
        
        const fretMarkerOffsetLabel = document.createElement('label');
        fretMarkerOffsetLabel.textContent = 'Marker Offset (px):';
        fretMarkerOffsetLabel.setAttribute('for', 'fret-markers-offset');
        
        const fretMarkerOffsetInput = document.createElement('input');
        fretMarkerOffsetInput.type = 'range';
        fretMarkerOffsetInput.id = 'fret-markers-offset';
        fretMarkerOffsetInput.min = '-20';
        fretMarkerOffsetInput.max = '20';
        fretMarkerOffsetInput.value = '0';
        fretMarkerOffsetInput.addEventListener('change', () => this.updateFretboard());
        
        fretMarkerOffsetGroup.appendChild(fretMarkerOffsetLabel);
        fretMarkerOffsetGroup.appendChild(fretMarkerOffsetInput);
        fretNumbersSection.appendChild(fretMarkerOffsetGroup);
        
        markerPlacementSelect.addEventListener('change', () => this.updateFretboard());
    };

    // removed App.prototype.addNoteAppearanceOptions() -> moved to app-ui-appearance.js
    // removed App.prototype.addStringAppearanceOptions() -> moved to app-ui-appearance.js
    // removed App.prototype.addFretAppearanceOptions() -> moved to app-ui-appearance.js
}