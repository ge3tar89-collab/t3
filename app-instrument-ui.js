/**
 * Instrument Setup UI Extension for App
 */
if (typeof App !== 'undefined') {
    App.prototype.addInstrumentDropdowns = function() {
        const instrumentSetup = document.querySelector('.instrument-setup');
        if (!instrumentSetup) return;

        const stringCountLabel = document.querySelector('label[for="string-count"]');
        if (!stringCountLabel) return;
        const stringCountGroup = stringCountLabel.parentNode;
        
        const instrumentGroup = document.createElement('div');
        instrumentGroup.className = 'control-group';
        
        const instrumentLabel = document.createElement('label');
        instrumentLabel.textContent = 'Instrument:';
        instrumentLabel.setAttribute('for', 'instrument-select');
        
        const instrumentSelect = document.createElement('select');
        instrumentSelect.id = 'instrument-select';
        
        Object.entries(this.instrumentPresets).forEach(([id, data]) => {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = data.name;
            instrumentSelect.appendChild(option);
        });
        
        instrumentGroup.appendChild(instrumentLabel);
        instrumentGroup.appendChild(instrumentSelect);
        
        const tuningPresetGroup = document.createElement('div');
        tuningPresetGroup.className = 'control-group';
        
        const tuningPresetLabel = document.createElement('label');
        tuningPresetLabel.textContent = 'Tuning Preset:';
        tuningPresetLabel.setAttribute('for', 'tuning-preset');
        
        const tuningPresetSelect = document.createElement('select');
        tuningPresetSelect.id = 'tuning-preset';
        
        const standardOption = document.createElement('option');
        standardOption.value = 'standard';
        standardOption.textContent = 'Standard';
        tuningPresetSelect.appendChild(standardOption);
        
        const alternateOption = document.createElement('option');
        const currentInstrument = this.instrumentPresets['acoustic_guitar'] || { tunings: {} };
        const alternateTuningName = currentInstrument.tunings.whole_step_down ? 'Whole-Step Down' : 
                                   (currentInstrument.tunings.half_step_down ? 'Half-Step Down' : 'Alternate');
        alternateOption.value = Object.keys(currentInstrument.tunings)[1] || 'alternate';
        alternateOption.textContent = alternateTuningName;
        tuningPresetSelect.appendChild(alternateOption);
        
        const tuningControlsRow = document.createElement('div');
        tuningControlsRow.style.display = 'flex';
        tuningControlsRow.style.gap = '5px';
        tuningControlsRow.style.alignItems = 'center';
        
        const shiftDownBtn = document.createElement('button');
        shiftDownBtn.textContent = '-';
        shiftDownBtn.title = 'Tune down half step';
        shiftDownBtn.style.padding = '4px 8px';
        shiftDownBtn.style.width = 'auto';
        shiftDownBtn.addEventListener('click', () => this.shiftTuning(-1));
        
        const shiftUpBtn = document.createElement('button');
        shiftUpBtn.textContent = '+';
        shiftUpBtn.title = 'Tune up half step';
        shiftUpBtn.style.padding = '4px 8px';
        shiftUpBtn.style.width = 'auto';
        shiftUpBtn.addEventListener('click', () => this.shiftTuning(1));
        
        tuningControlsRow.appendChild(tuningPresetSelect);
        tuningControlsRow.appendChild(shiftDownBtn);
        tuningControlsRow.appendChild(shiftUpBtn);

        tuningPresetGroup.appendChild(tuningPresetLabel);
        tuningPresetGroup.appendChild(tuningControlsRow);
        
        instrumentSetup.insertBefore(instrumentGroup, stringCountGroup);
        instrumentSetup.insertBefore(tuningPresetGroup, stringCountGroup);
        
        // Fretspan UI setup
        this.setupFretspanUI(instrumentSetup, stringCountGroup);
        
        const flipStringOrderGroup = document.createElement('div');
        flipStringOrderGroup.className = 'control-group';
        
        const flipStringOrderButton = document.createElement('button');
        flipStringOrderButton.textContent = 'Flip String Order';
        flipStringOrderButton.id = 'flip-string-order';
        flipStringOrderButton.addEventListener('click', () => this.flipStringOrder());
        
        flipStringOrderGroup.appendChild(flipStringOrderButton);
        instrumentSetup.appendChild(flipStringOrderGroup);
        
        instrumentSelect.addEventListener('change', () => {
            const instrumentId = instrumentSelect.value;
            const instrument = this.instrumentPresets[instrumentId];
            const stringCountInput = document.getElementById('string-count');
            stringCountInput.value = instrument.strings;
            
            tuningPresetSelect.innerHTML = '';
            Object.entries(instrument.tunings).forEach(([tuningId, tuningData]) => {
                const option = document.createElement('option');
                option.value = tuningId;
                let displayName = 'Standard';
                if (tuningId === 'whole_step_down') displayName = 'Whole-Step Down';
                else if (tuningId === 'half_step_down') displayName = 'Half-Step Down';
                else if (tuningId !== 'standard') displayName = 'Alternate';
                option.textContent = displayName;
                tuningPresetSelect.appendChild(option);
            });
            this.applyTuningPreset(instrumentId, tuningPresetSelect.value);

            // After loading the new instrument/tuning setup, flip the string order
            // so the freshly applied configuration is inverted (e.g., for lefty view).
            if (typeof this.flipStringOrder === 'function') {
                // Small timeout to ensure DOM-created inputs are present before flipping
                setTimeout(() => {
                    try {
                        this.flipStringOrder();
                    } catch (e) { console.warn('flipStringOrder failed after instrument change', e); }
                }, 0);
            }
        });
        
        tuningPresetSelect.addEventListener('change', () => {
            this.applyTuningPreset(instrumentSelect.value, tuningPresetSelect.value);
            // Ensure the newly applied tuning UI is built before flipping string order
            if (typeof this.flipStringOrder === 'function') {
                setTimeout(() => {
                    try {
                        this.flipStringOrder();
                    } catch (e) { console.warn('flipStringOrder failed after tuning preset change', e); }
                }, 0);
            }
        });
    };
}