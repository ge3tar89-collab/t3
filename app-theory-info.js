/**
 * Theory Info and Lesson Extension for App
 */
if (typeof App !== 'undefined') {
    App.prototype.addTheoryInfoOptions = function() {
        const musicTheorySection = document.querySelector('.music-theory');
        if (!musicTheorySection) return;
        
        const theoryInfoOptions = document.createElement('div');
        theoryInfoOptions.className = 'control-group';
        
        const headerDiv = document.createElement('div');
        headerDiv.style.display = 'flex';
        headerDiv.style.justifyContent = 'space-between';
        headerDiv.style.alignItems = 'center';
        headerDiv.style.marginBottom = '10px';
        const heading = document.createElement('h3');
        heading.textContent = 'Theory Info Display';
        heading.style.margin = '0';
        headerDiv.appendChild(heading);
        
        const toggleTitleButton = document.createElement('button');
        toggleTitleButton.id = 'toggle-title-button';
        toggleTitleButton.textContent = 'Hide Title';
        toggleTitleButton.style.fontSize = '12px';
        toggleTitleButton.style.marginRight = '5px';
        toggleTitleButton.addEventListener('click', () => {
            this.titleVisible = !this.titleVisible;
            toggleTitleButton.textContent = this.titleVisible ? 'Hide Title' : 'Show Title';
            this.updateTheoryInfo();
        });
        
        const toggleInfoButton = document.createElement('button');
        toggleInfoButton.id = 'toggle-info-button';
        toggleInfoButton.textContent = 'Show Info Panel';
        toggleInfoButton.style.fontSize = '12px';
        this.infoVisible = false;
        toggleInfoButton.addEventListener('click', () => {
            this.infoVisible = !this.infoVisible;
            toggleInfoButton.textContent = this.infoVisible ? 'Hide Info Panel' : 'Show Info Panel';
            const panel = document.getElementById('theory-info-panel');
            if (panel) {
                panel.style.display = this.infoVisible ? 'block' : 'none';
            }
        });
        
        const buttonsDiv = document.createElement('div');
        buttonsDiv.appendChild(toggleTitleButton);
        buttonsDiv.appendChild(toggleInfoButton);
        headerDiv.appendChild(buttonsDiv);
        theoryInfoOptions.appendChild(headerDiv);
        
        const optionsContainer = document.createElement('div');
        optionsContainer.id = 'theory-info-options-container';
        
        const properties = [
            { id: 'show-name', label: 'Name', checked: true },
            { id: 'show-root', label: 'Root Note', checked: true },
            { id: 'show-spelling', label: 'Scale/Chord Spelling', checked: true },
            { id: 'show-quality', label: 'Quality', checked: true },
            { id: 'show-tonic', label: 'Tonic Function', checked: true },
            { id: 'show-dominant', label: 'Dominant Function', checked: true },
            { id: 'show-modes', label: 'Modes', checked: true },
            { id: 'show-inversions', label: 'Inversions', checked: true },
            { id: 'show-description', label: 'Description', checked: true },
            { id: 'hide-about-section', label: 'Hide About Section', checked: true }
        ];
        
        properties.forEach(prop => {
            const div = document.createElement('div');
            div.style.display = 'flex';
            div.style.alignItems = 'center';
            div.style.marginBottom = '5px';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = prop.id;
            checkbox.className = 'theory-info-checkbox';
            checkbox.checked = prop.checked;
            checkbox.style.width = 'auto';
            checkbox.style.marginRight = '10px';
            const label = document.createElement('label');
            label.htmlFor = prop.id;
            label.textContent = prop.label;
            label.style.marginBottom = '0';
            label.style.cursor = 'pointer';
            div.appendChild(checkbox);
            div.appendChild(label);
            optionsContainer.appendChild(div);
        });
        
        theoryInfoOptions.appendChild(optionsContainer);
        musicTheorySection.appendChild(theoryInfoOptions);
        
        const fretboardContainer = document.querySelector('.fretboard-container');
        const theoryInfoPanel = document.createElement('div');
        theoryInfoPanel.id = 'theory-info-panel';
        theoryInfoPanel.className = 'theory-info-panel';
        theoryInfoPanel.style.display = this.infoVisible ? 'block' : 'none';
        
        fretboardContainer.parentNode.insertBefore(theoryInfoPanel, fretboardContainer.nextSibling);
    };

    App.prototype.updateTheoryInfo = function(key = null, patternType = null, patternId = null) {
        const panel = document.getElementById('theory-info-panel');
        if (!panel) return;
        panel.style.display = this.infoVisible ? 'block' : 'none';
        key = key || document.getElementById('key-select').value;
        patternType = patternType || document.getElementById('pattern-type').value;
        patternId = patternId || document.getElementById('pattern-select').value;
        
        if (patternType === 'lesson') {
            this.renderLessonInfo(panel, key, patternId);
            return;
        } else if (patternType === 'chord_progression') {
            this.renderProgressionInfo(panel, key, patternId);
            return;
        } else if (patternType === 'grid') {
            this.renderGridInfo(panel, key, patternId, false);
            return;
        } else if (patternType === 'grid2') {
            this.renderGridInfo(panel, key, patternId, true);
            return;
        } else if (patternType === 'gamut') {
            this.renderGamutInfo(panel, key, patternId);
            return;
        }
        
        let patternData = null;
        let notes = [];
        if (patternType === 'scale') {
            patternData = this.musicTheory.scales[patternId];
            notes = this.musicTheory.getScaleNotes(key, patternId);
        } else if (patternType === 'chord') {
            patternData = this.musicTheory.chords[patternId];
            notes = this.musicTheory.getChordNotes(key, patternId);
        } else if (patternType === 'interval') {
            patternData = this.musicTheory.intervals[patternId];
            const targetNote = this.musicTheory.getNoteFromInterval(key, patternId);
            notes = [key, targetNote];
        } else if (patternType === 'custom') {
            patternData = this.musicTheory.customPatterns && this.musicTheory.customPatterns[patternId];
            if (patternData) {
                notes = this.musicTheory.getCustomNotes(key, patternId);
            }
        }
        
        if (!patternData) {
            panel.innerHTML = '<p>No information available</p>';
            return;
        }
        
        const showName = document.getElementById('show-name')?.checked;
        const showRoot = document.getElementById('show-root')?.checked;
        const showSpelling = document.getElementById('show-spelling')?.checked;
        const showQuality = document.getElementById('show-quality')?.checked;
        const showTonic = document.getElementById('show-tonic')?.checked;
        const showDominant = document.getElementById('show-dominant')?.checked;
        const showModes = document.getElementById('show-modes')?.checked;
        const showInversions = document.getElementById('show-inversions')?.checked;
        const showDescription = document.getElementById('show-description')?.checked;
        
        let title = '';
        const content = document.createElement('div');
        content.className = 'theory-info-content';
        
        if (patternType === 'scale' || patternType === 'chord' || patternType === 'interval' || patternType === 'custom') {
            title = patternData.name;
        }
        
        const titleDiv = document.createElement('div');
        titleDiv.className = 'theory-info-title';
        titleDiv.textContent = title;
        titleDiv.style.display = this.titleVisible ? 'block' : 'none';
        panel.innerHTML = '';
        panel.appendChild(titleDiv);
        
        if (showRoot) {
            this.addInfoItem(content, 'Root', key);
        }
        if (showSpelling) {
            const spelling = notes.join(' - ');
            this.addInfoItem(content, 'Spelling', spelling);
            if (patternType === 'interval') {
                this.addInfoItem(content, 'Semitones', patternData.semitones);
            }
            if (patternType === 'scale' || patternType === 'chord' || patternType === 'custom') {
                const formula = patternData.intervals.join(' - ');
                this.addInfoItem(content, 'Formula', formula);
            }
        }
        if (showQuality) {
            let quality = '';
            if (patternType === 'scale') {
                if (patternId.includes('major')) quality = 'Major';
                else if (patternId.includes('minor')) quality = 'Minor';
                else if (patternId === 'diminished') quality = 'Diminished';
                else if (patternId === 'whole_tone') quality = 'Augmented';
                else quality = 'Other';
            } else if (patternType === 'chord') {
                if (patternId === 'major') quality = 'Major';
                else if (patternId === 'minor') quality = 'Minor';
                else if (patternId.includes('diminished')) quality = 'Diminished';
                else if (patternId.includes('augmented')) quality = 'Augmented';
                else if (patternId.includes('major')) quality = 'Major-derived';
                else if (patternId.includes('minor')) quality = 'Minor-derived';
                else quality = 'Other';
            } else if (patternType === 'interval') {
                if (['1', '4', '5'].includes(patternId)) quality = 'Perfect';
                else if (['2', '3', '6', '7'].includes(patternId)) quality = 'Major';
                else if (['b2', 'b3', 'b6', 'b7'].includes(patternId)) quality = 'Minor';
            }
            if (quality) this.addInfoItem(content, 'Quality', quality);
        }
        if (showTonic && patternType === 'scale') {
            const tonicDegrees = [0, 2, 4];
            const tonicNotes = tonicDegrees.map(i => notes[i] || '').filter(n => n);
            if (tonicNotes.length > 0) this.addInfoItem(content, 'Tonic Function', tonicNotes.join(', '));
        }
        if (showDominant && patternType === 'scale') {
            const dominantDegrees = [4, 6, 1];
            const dominantNotes = dominantDegrees.map(i => notes[i] || '').filter(n => n);
            if (dominantNotes.length > 0) this.addInfoItem(content, 'Dominant Function', dominantNotes.join(', '));
        }
        if (showModes && patternType === 'scale') {
            const modes = this.musicTheory.getRelatedModes(patternId);
            if (modes.length > 0) this.addInfoItem(content, 'Related Modes', modes.join(', '));
        }
        if (showInversions && patternType === 'chord' && notes.length > 2) {
            const inversions = this.musicTheory.getChordInversions(notes);
            if (inversions.length > 0) this.addInfoItem(content, 'Inversions', inversions.join(', '));
        }
        if (showDescription) {
            let description = '';
            if (patternType === 'scale') description = this.musicTheory.getScaleDescription(patternId);
            else if (patternType === 'chord') description = this.musicTheory.getChordDescription(patternId);
            else if (patternType === 'interval') {
                const q = this.musicTheory.getIntervalQuality(patternId);
                description = `Quality: ${q}. Distance: ${patternData.semitones} semitones.`;
            }
            if (description) this.addInfoItem(content, 'Description', description, true);
        }
        panel.appendChild(content);
        this.addScaleDescription(panel, patternType, patternId, key);
    };

    // removed addScaleDescription() {} -> moved to app-theory-panel.js
    // removed addInfoItem() {} -> moved to app-theory-panel.js

    // removed App.prototype.openLessonPage() -> moved to app-theory-lessons.js
    // removed App.prototype.populateLessonTheoryDetails() -> moved to app-theory-lessons.js
}