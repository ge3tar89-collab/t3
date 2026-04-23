class Fretboard {
    constructor(containerId, musicTheory) {
        this.container = document.getElementById(containerId);
        this.musicTheory = musicTheory;
        this.svg = null;
        
        this.dimensions = {
            width: 1000,
            height: 250,
            margin: { top: 30, right: 30, bottom: 40, left: 100 },
            fretSpacing: 80,
            stringSpacing: 30
        };
        
        this.settings = {
            tuning: ['E', 'A', 'D', 'G', 'B', 'E'],
            startFret: 0,
            endFret: 12,
            stringHeight: 2,
            fretWidth: 2,
            displayMode: 'intervals',
            colorTheme: 'default',
            customColors: {},
            fretNumbersPlacement: 'below',
            fretNumbersPosition: 'center',
            fretNumbersSize: 12,
            fretNumbersOffset: 0,
            fretNumbersShape: 'none',
            fretMarkersPlacement: 'on',
            fretMarkersOffset: 0,
            noteSize: 15,
            noteShape: 'circle',
            noteFont: 'Arial',
            noteFontSize: 12,
            noteEffect: 'none',
            noteGradient: false,
            noteOffset: 0,
            stringStyle: 'solid',
            stringGradient: false,
            stringEffect: 'none',
            stringSpacing: 30,
            stringOpacity: 1,
            visibleStrings: [],
            stringStartFrets: [],
            stringEndFrets: [],
            fretStyle: 'solid'
        };
        
        this.currentKey = 'C';
        this.currentPatternType = 'scale';
        this.currentPattern = 'major';
        this.activeNotes = [];
        this.activePositions = [];
        this.selectedMarkers = [];
        
        this.resizeTimeout = null;
        window.addEventListener('resize', () => {
            if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => this.draw && this.draw(), 250);
        });
    }

    updateSettings(newSettings) {
        if (!newSettings) return;
        this.settings = { ...this.settings, ...newSettings };
        
        // Synchronize mismatched naming between UI and logic
        if (this.settings.fretThickness !== undefined) this.settings.fretWidth = this.settings.fretThickness;
        if (this.settings.stringThickness !== undefined) this.settings.stringHeight = this.settings.stringThickness;

        if (this.settings.stringSpacing && this.dimensions) {
            this.dimensions.stringSpacing = this.settings.stringSpacing;
        }
        if (this.draw) this.draw();
    }

    updatePattern(key, patternType, pattern) {
        this.currentKey = key;
        this.currentPatternType = patternType;
        this.currentPattern = pattern;
        this.activePositions = [];
        
        if (patternType === 'scale') {
            this.activeNotes = this.musicTheory.getScaleNotes(key, pattern);
        } else if (patternType === 'chord') {
            this.activeNotes = this.musicTheory.getChordNotes(key, pattern);
        } else if (patternType === 'interval') {
            const targetNote = this.musicTheory.getNoteFromInterval(key, pattern);
            this.activeNotes = [key, targetNote];
        } else if (patternType === 'custom') {
            this.activeNotes = this.musicTheory.getCustomNotes(key, pattern);
        } else if (patternType === 'gamut') {
            const gamutData = this.musicTheory.gamuts && this.musicTheory.gamuts[pattern];
            if (gamutData) {
                this.activePositions = gamutData.positions;
            }
            this.activeNotes = [];
        } else {
            this.activeNotes = [];
        }
        
        if (this.draw) this.draw();
    }

    clearSelectedMarkers() {
        this.selectedMarkers.forEach(mg => {
            mg.classList.remove('selected');
            const marker = mg.querySelector('.note-marker');
            if (marker) {
                marker.setAttribute('stroke', '#000');
                marker.setAttribute('stroke-width', 1);
            }
        });
        this.selectedMarkers = [];
    }

    getCurrentInfo() {
        return {
            tuning: this.settings.tuning.join('-'),
            key: this.currentKey,
            patternType: this.currentPatternType,
            pattern: this.currentPattern
        };
    }

    async exportImage(filename) {
        let dataUrl;
        if (typeof Exporter !== 'undefined' && Exporter.getFretboardImageBase64) {
            const base64 = await Exporter.getFretboardImageBase64({ fretboard: this });
            dataUrl = 'data:image/jpeg;base64,' + base64;
        } else if (typeof html2canvas !== 'undefined') {
            const canvas = await html2canvas(this.container);
            dataUrl = canvas.toDataURL('image/jpeg');
        } else {
            alert('Export requires Exporter or html2canvas library');
            return;
        }
        
        const link = document.createElement('a');
        link.download = filename || 'fretboard.jpg';
        link.href = dataUrl;
        link.click();
    }

    getThemeColors() {
        const theme = this.settings?.colorTheme || 'default';
        const defaultColors = {
            background: '#FFFFFF',
            strings: '#888888',
            frets: '#444444',
            markers: '#333333',
            intervals: {}
        };

        if (theme === 'custom' && this.settings?.customColors) {
            return {
                background: this.settings.customColors.background || defaultColors.background,
                strings: this.settings.customColors.strings || defaultColors.strings,
                frets: this.settings.customColors.frets || defaultColors.frets,
                markers: this.settings.customColors.markers || defaultColors.markers,
                intervals: this.settings.customColors.intervals || defaultColors.intervals
            };
        }
        
        const palette = (this.musicTheory?.colorThemes?.[theme]) || (this.musicTheory?.colorThemes?.default) || defaultColors;
        return { ...defaultColors, ...palette };
    }

    debouncedRedrawNotes() {
        if (this.redrawTimeout) clearTimeout(this.redrawTimeout);
        this.redrawTimeout = setTimeout(() => this.drawNotes && this.drawNotes(), 50);
    }

    lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const B = (num >> 8 & 0x00FF) + amt;
        const G = (num & 0x0000FF) + amt;
        return '#' + (
            0x1000000 + 
            (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + 
            (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 + 
            (G < 255 ? G < 1 ? 0 : G : 255)
        ).toString(16).slice(1);
    }

    applyGlowEffect(element, color) {
        const filterId = 'glow-' + Math.random().toString(36).substr(2, 9);
        const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        filter.setAttribute('id', filterId);
        filter.innerHTML = `
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        `;
        let defs = this.svg.querySelector('defs');
        if (!defs) {
            defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            this.svg.prepend(defs);
        }
        defs.appendChild(filter);
        element.setAttribute('filter', `url(#${filterId})`);
    }

    applyShadowEffect(element) {
        const filterId = 'shadow-' + Math.random().toString(36).substr(2, 9);
        const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        filter.setAttribute('id', filterId);
        filter.innerHTML = `
            <feDropShadow dx="2" dy="2" stdDeviation="2" flood-opacity="0.5"/>
        `;
        let defs = this.svg.querySelector('defs');
        if (!defs) {
            defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            this.svg.prepend(defs);
        }
        defs.appendChild(filter);
        element.setAttribute('filter', `url(#${filterId})`);
    }

    applyMetallicEffect(element, y, x1, x2, color) {
        element.setAttribute('stroke', color);
    }

    getProperNoteSpelling(note, key, patternType, pattern) {
        let expectedNotes = [];
        if (patternType === 'scale') {
            expectedNotes = this.musicTheory.getScaleNotes(key, pattern);
        } else if (patternType === 'chord') {
            expectedNotes = this.musicTheory.getChordNotes(key, pattern);
        } else if (patternType === 'interval') {
            let degree = 1;
            if (pattern.includes('2')) degree = 2;
            else if (pattern.includes('3')) degree = 3;
            else if (pattern.includes('4')) degree = 4;
            else if (pattern.includes('5')) degree = 5;
            else if (pattern.includes('6')) degree = 6;
            else if (pattern.includes('7')) degree = 7;
            
            let expectedLetter = this.musicTheory.getExpectedNoteForDegree(key, degree)[0];
            if (note[0] === expectedLetter) return note;
            const enharmonic = this.musicTheory.enharmonicPairs[note];
            if (enharmonic && enharmonic[0] === expectedLetter) return enharmonic;
            return note;
        } else {
            return note;
        }

        if (expectedNotes.includes(note)) return note;
        const enharmonic = this.musicTheory.enharmonicPairs[note];
        if (enharmonic && expectedNotes.includes(enharmonic)) return enharmonic;
        return note;
    }
    
    getContrastColor(hexColor) {
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
    }
    
    showNoteEditMenu(markerGroup, marker, text, x, y, color) {
        if (typeof FretboardMenu !== 'undefined') {
            FretboardMenu.showNoteEditMenu(this, markerGroup, marker, text, x, y, color);
        }
    }
    
    showMultiNoteEditMenu(markerGroups, x, y) {
        if (typeof FretboardMenu !== 'undefined') {
            FretboardMenu.showMultiNoteEditMenu(this, markerGroups, x, y);
        }
    }
}