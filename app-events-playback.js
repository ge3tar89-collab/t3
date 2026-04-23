/**
 * Playback Event Listeners
 */
if (typeof App !== 'undefined') {
    App.prototype.setupPlaybackEvents = function() {
        document.getElementById('tempo-range')?.addEventListener('input', (e) => {
            this.tempo = parseInt(e.target.value);
            const tv = document.getElementById('tempo-value');
            if (tv) tv.textContent = this.tempo;
        });

        document.getElementById('play-pattern')?.addEventListener('click', () => this.playCurrentPattern());
        
        document.getElementById('melodic-pattern-select')?.addEventListener('change', e => {
            const cpc = document.getElementById('custom-pattern-container');
            if (cpc) cpc.style.display = e.target.value === 'custom' ? 'block' : 'none';
        });
        
        document.getElementById('play-melodic-pattern')?.addEventListener('click', () => this.playMelodicPattern());
        document.getElementById('stop-melodic-pattern')?.addEventListener('click', () => this.stopMelodicPattern());

        const cofDurationInput = document.getElementById('cof-duration');
        const playCofBtn = document.getElementById('play-cof-loop');
        const stopCofBtn = document.getElementById('stop-cof-loop');
        if (playCofBtn) {
            playCofBtn.addEventListener('click', async () => {
                const durationSec = parseFloat(cofDurationInput?.value) || 2;
                try {
                    await this.playCircleOfFifthsLoop(durationSec);
                    playCofBtn.style.display = 'none';
                    if (stopCofBtn) stopCofBtn.style.display = 'inline-block';
                } catch (err) { console.warn('Play Cof Loop failed:', err); }
            });
        }
        if (stopCofBtn) {
            stopCofBtn.addEventListener('click', () => {
                this.stopCircleOfFifthsLoop();
                stopCofBtn.style.display = 'none';
                if (playCofBtn) playCofBtn.style.display = 'inline-block';
            });
        }

        const playCof4Btn = document.getElementById('play-cof4-loop');
        const stopCof4Btn = document.getElementById('stop-cof4-loop');
        if (playCof4Btn) {
            playCof4Btn.addEventListener('click', async () => {
                const durationSec = parseFloat(cofDurationInput?.value) || 2;
                try {
                    await this.playCircleOfFourthsLoop(durationSec);
                    playCof4Btn.style.display = 'none';
                    if (stopCof4Btn) stopCof4Btn.style.display = 'inline-block';
                } catch (err) { console.warn('Play Cof4ths Loop failed:', err); }
            });
        }
        if (stopCof4Btn) {
            stopCof4Btn.addEventListener('click', () => {
                this.stopCircleOfFourthsLoop();
                stopCof4Btn.style.display = 'none';
                if (playCof4Btn) playCof4Btn.style.display = 'inline-block';
            });
        }
    };
}