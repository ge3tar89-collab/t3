/**
 * Melodic Pattern Playback Extension
 */
if (typeof App !== 'undefined') {
    App.prototype.playMelodicPattern = async function () {
        if (!this.synth && typeof this.initSynth === 'function') await this.initSynth();
        const patternSelect = document.getElementById('melodic-pattern-select');
        const lengthSelect = document.getElementById('melodic-pattern-length');
        if (!patternSelect) return;

        let rawString = '';
        if (lengthSelect && lengthSelect.value !== 'preset') {
            rawString = lengthSelect.value === 'custom' ? document.getElementById('melodic-custom-length')?.value : lengthSelect.value.split('').join(' ');
        } else {
            rawString = patternSelect.value === 'custom' ? document.getElementById('custom-pattern')?.value : patternSelect.value;
        }

        if (!rawString) return;
        const pattern = rawString.split(/[\s,]+/).filter(Boolean).map(p => parseInt(p, 10)).filter(n => !isNaN(n) && n > 0);
        if (!pattern.length) return;

        this.stopMelodicPattern();
        document.getElementById('play-melodic-pattern').style.display = 'none';
        document.getElementById('stop-melodic-pattern').style.display = 'inline-block';
        this.isPlayingPattern = true;

        const key = document.getElementById('key-select')?.value || 'C';
        const scaleType = document.getElementById('pattern-select')?.value || 'major';
        const scaleNotes = this.musicTheory.getScaleNotes(key, scaleType);
        if (!scaleNotes.length) return;

        const beatDurationSec = 60 / (this.tempo || 120);
        const endFret = parseInt(this.settings?.endFret || 12, 10);
        const startFret = parseInt(this.settings?.startFret || 0, 10);
        let extrapolated = this.extrapolatePattern(pattern, scaleNotes.length, Math.max(8, (endFret - startFret + 1) * 4));
        
        if (document.getElementById('melodic-pattern-reverse')?.checked) {
            extrapolated = extrapolated.reverse();
        }

        let noteIndex = 0;
        this.patternPlayer = setInterval(() => {
            if (!this.isPlayingPattern) return;
            if (noteIndex >= extrapolated.length) noteIndex = 0;
            const deg = extrapolated[noteIndex++];
            const note = scaleNotes[deg % scaleNotes.length];
            const frequency = this.musicTheory.getNoteFrequency(note, 4 + Math.floor(deg / scaleNotes.length));
            if (frequency && this.synth) this.synth.triggerAttackRelease(frequency, beatDurationSec / 2);
            this.visualizeNotePlayback(key, note, beatDurationSec, 'melodic-pattern-anim', 'playing-pattern');
        }, Math.round(beatDurationSec * 1000));
    };

    App.prototype.extrapolatePattern = function (pattern, scaleLength, maxNotes) {
        const zeroBased = pattern.map(n => Number(n) - 1);
        const result = [];
        let currentDegree = 0;
        while (result.length < maxNotes) {
            const val = zeroBased[result.length % zeroBased.length];
            result.push(currentDegree + (Number.isFinite(val) ? val : 0));
            if ((result.length % zeroBased.length) === 0) currentDegree += 1;
        }
        return result;
    };

    App.prototype.stopMelodicPattern = function () {
        if (this.patternPlayer) clearInterval(this.patternPlayer);
        this.patternPlayer = null;
        this.isPlayingPattern = false;
        if (document.getElementById('play-melodic-pattern')) document.getElementById('play-melodic-pattern').style.display = 'inline-block';
        if (document.getElementById('stop-melodic-pattern')) document.getElementById('stop-melodic-pattern').style.display = 'none';
    };

    App.prototype.visualizeNotePlayback = function(key, note, beatDurationSec, animSelectId, fallbackAnim) {
        try {
            const markers = Array.from(this.fretboard.container.querySelectorAll('.note-marker'));
            const matches = markers.filter(m => {
                const txt = m.nextSibling?.textContent;
                const interval = this.musicTheory.getInterval(key, note);
                const compare = (this.fretboard.settings.displayMode === 'intervals' && interval) ? this.musicTheory.intervals[interval]?.shortName : note;
                return txt === compare || txt === note;
            });
            const anim = document.getElementById(animSelectId)?.value || fallbackAnim;
            matches.forEach(m => {
                m.classList.add(anim);
                setTimeout(() => m.classList.remove(anim), (beatDurationSec * 1000) / 2);
            });
        } catch (e) {}
    };

    App.prototype.playMelodicPatternVariant = async function () {
        // Implementation logic similar to primary with patternPlayer2...
    };

    App.prototype.stopMelodicPatternVariant = function () {
        if (this.patternPlayer2) clearInterval(this.patternPlayer2);
        this.patternPlayer2 = null;
        this.isPlayingPattern2 = false;
        // Button toggle logic...
    };

    App.prototype.stepMelodicPattern = async function () {
        // Logic for single step trigger...
    };
}