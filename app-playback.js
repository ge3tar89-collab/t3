/**
 * Playback Extension for App
 */
if (typeof App !== 'undefined') {
    App.prototype.initSynth = async function() {
        await Tone.start();
        this.reverb = new Tone.Freeverb(0.7, 2000).toDestination();
        this.synth = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: "triangle" },
            envelope: { attack: 0.01, decay: 0.3, sustain: 0.2, release: 1.2 }
        }).connect(this.reverb);
        this.synth.volume.value = -8;
        console.log('Audio synthesizer with reverb initialized');
    };

    App.prototype.playCurrentPattern = async function() {
        if (!this.synth) {
            await this.initSynth();
        }
        
        const key = document.getElementById('key-select').value;
        const patternType = document.getElementById('pattern-type').value;
        const pattern = document.getElementById('pattern-select').value;
        let notes = [];
        
        if (patternType === 'scale') {
            notes = this.musicTheory.getScaleNotes(key, pattern);
        } else if (patternType === 'chord') {
            notes = this.musicTheory.getChordNotes(key, pattern);
        } else if (patternType === 'interval') {
            const interval = pattern;
            const targetNote = this.musicTheory.getNoteFromInterval(key, interval);
            notes = [key, targetNote];
        } else if (patternType === 'custom') {
            notes = this.musicTheory.getCustomNotes(key, pattern);
        }
        
        if (notes.length === 0) {
            console.error('No notes to play');
            return;
        }
        
        this.updateTheoryInfo(key, patternType, pattern);
        
        const markers = this.fretboard.container.querySelectorAll('.note-marker');
        const noteElements = [];
        
        markers.forEach(marker => {
            if (marker.nextSibling && marker.nextSibling.tagName === 'text') {
                noteElements.push({
                    marker,
                    textElement: marker.nextSibling,
                    note: marker.nextSibling.textContent
                });
            }
        });
        
        const beatDuration = 60 / this.tempo;
        
        const noteFrequencies = notes.map(note => {
            return this.musicTheory.getNoteFrequency(note, 4);
        }).filter(freq => freq !== null);
        
        if (patternType === 'chord' || patternType === 'interval') {
            noteElements.forEach(element => {
                this.animateNoteMarker(element.marker);
            });
            this.synth.triggerAttackRelease(noteFrequencies, beatDuration * 2);
        } else {
            const now = Tone.now();
            for (let i = 0; i < noteFrequencies.length; i++) {
                const freq = noteFrequencies[i];
                const note = notes[i];
                
                const noteMarkers = noteElements.filter(el => {
                    const intervals = this.musicTheory.intervals;
                    const interval = this.musicTheory.getInterval(key, note);
                    return el.note === (this.fretboard.settings.displayMode === 'intervals' && interval ? 
                        intervals[interval].shortName : note);
                });
                
                this.synth.triggerAttackRelease(freq, beatDuration / 2, now + i * beatDuration);
                
                if (noteMarkers.length > 0) {
                    setTimeout(() => {
                        noteMarkers.forEach(el => this.animateNoteMarker(el.marker));
                    }, i * beatDuration * 1000);
                }
            }
            
            if ((patternType === 'scale' || patternType === 'custom') && noteFrequencies.length > 2) {
                const descendingFreqs = [...noteFrequencies].reverse().slice(1);
                const descendingNotes = [...notes].reverse().slice(1);
                
                descendingFreqs.forEach((freq, i) => {
                    const note = descendingNotes[i];
                    const offset = noteFrequencies.length + i;
                    
                    const noteMarkers = noteElements.filter(el => {
                        const intervals = this.musicTheory.intervals;
                        const interval = this.musicTheory.getInterval(key, note);
                        return el.note === (this.fretboard.settings.displayMode === 'intervals' && interval ? 
                            intervals[interval].shortName : note);
                    });
                    
                    this.synth.triggerAttackRelease(freq, beatDuration / 2, now + offset * beatDuration);
                    
                    if (noteMarkers.length > 0) {
                        setTimeout(() => {
                            noteMarkers.forEach(el => this.animateNoteMarker(el.marker));
                        }, (offset) * beatDuration * 1000);
                    }
                });
            }
        }
    };

    App.prototype.animateNoteMarker = function(marker) {
        marker.classList.add('playing-note-pulse');
        marker.style.transformBox = 'fill-box';
        marker.style.transformOrigin = 'center';
        
        setTimeout(() => {
            marker.classList.remove('playing-note-pulse');
            marker.style.transformBox = '';
            marker.style.transformOrigin = '';
        }, 600); // Extended for smoother decay
    };

    App.prototype.setupChromaticTuner = function() {
        const toggleButton = document.getElementById('chromatic-tuner-toggle');
        const tunerContainer = document.getElementById('chromatic-tuner-container');
        const tunerButtonsContainer = tunerContainer ? tunerContainer.querySelector('.chromatic-tuner-buttons') : null;

        if (!toggleButton || !tunerContainer || !tunerButtonsContainer) {
            return;
        }

        tunerButtonsContainer.innerHTML = '';
        
        // Add Octave Selector
        const octaveControls = document.createElement('div');
        octaveControls.style.marginBottom = '10px';
        octaveControls.style.display = 'flex';
        octaveControls.style.alignItems = 'center';
        octaveControls.style.justifyContent = 'center';
        octaveControls.style.gap = '10px';
        
        const octaveLabel = document.createElement('label');
        octaveLabel.textContent = 'Octave:';
        octaveLabel.style.margin = '0';
        octaveLabel.style.fontSize = '0.9em';
        
        const octaveSelect = document.createElement('select');
        octaveSelect.id = 'tuner-octave-select';
        octaveSelect.style.width = 'auto';
        octaveSelect.style.padding = '2px 5px';
        [2, 3, 4, 5, 6].forEach(oct => {
            const opt = document.createElement('option');
            opt.value = oct;
            opt.textContent = oct;
            if (oct === 4) opt.selected = true;
            octaveSelect.appendChild(opt);
        });
        
        octaveControls.appendChild(octaveLabel);
        octaveControls.appendChild(octaveSelect);
        tunerButtonsContainer.appendChild(octaveControls);

        const notesGrid = document.createElement('div');
        notesGrid.style.display = 'flex';
        notesGrid.style.flexWrap = 'wrap';
        notesGrid.style.justifyContent = 'center';

        this.musicTheory.notes.forEach(note => {
            const noteButton = document.createElement('button');
            noteButton.textContent = note;
            noteButton.className = 'chromatic-tuner-button';
            noteButton.style.padding = '10px 12px';
            noteButton.style.margin = '2px';
            noteButton.style.fontSize = '1em';
            noteButton.style.fontWeight = 'bold';
            noteButton.style.flexGrow = '1';
            noteButton.style.border = '1px solid var(--border-color)';
            noteButton.style.borderRadius = '4px';
            noteButton.style.backgroundColor = note.includes('#') ? '#333' : '#f9f9f9';
            noteButton.style.color = note.includes('#') ? '#fff' : '#333';
            noteButton.style.cursor = 'pointer';
            noteButton.style.transition = 'all 0.1s';
            noteButton.addEventListener('click', async () => {
                if (!this.synth) {
                    await this.initSynth();
                }
                
                const origBg = noteButton.style.backgroundColor;
                const origCol = noteButton.style.color;
                const origTransform = noteButton.style.transform;
                noteButton.style.backgroundColor = 'var(--accent-color)';
                noteButton.style.color = '#fff';
                noteButton.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    noteButton.style.backgroundColor = origBg;
                    noteButton.style.color = origCol;
                    noteButton.style.transform = origTransform || 'scale(1)';
                }, 150);

                const selectedOctave = parseInt(octaveSelect.value) || 4;
                const frequency = this.musicTheory.getNoteFrequency(note, selectedOctave);
                if (frequency && this.synth) {
                    this.synth.triggerAttackRelease(frequency, '2n'); // Longer sustain for tuning
                }
            });
            notesGrid.appendChild(noteButton);
        });
        tunerButtonsContainer.appendChild(notesGrid);

        toggleButton.addEventListener('click', () => {
            const isVisible = tunerContainer.style.display !== 'none';
            tunerContainer.style.display = isVisible ? 'none' : 'block';
            toggleButton.textContent = isVisible ? 'Show Chromatic Tuner' : 'Hide Chromatic Tuner';
        });
    };

    // removed Cof loop methods -> moved to app-playback-cof.js
}