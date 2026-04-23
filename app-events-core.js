/**
 * Core UI Event Listeners
 */
if (typeof App !== 'undefined') {
    App.prototype.setupCoreEvents = function() {
        document.getElementById('sidebar-toggle').addEventListener('click', () => this.toggleSidebar());
        document.getElementById('sidebar-toggle').setAttribute('aria-expanded', this.sidebarVisible ? 'true' : 'false');

        const resetBtn = document.getElementById('reset-settings');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (!confirm('Reset all application settings and data? This will clear custom colors, favorites, defaults and collapsed/visibility state.')) return;
                try {
                    const keysToRemove = [
                        'manic_rules_custom_data', 'favoriteScales', 'defaultKey',
                        'defaultDisplayMode', 'defaultPatternType', 'defaultPattern',
                        'pageTheme', 'pageFontSize', 'collapsedSections', 'sidebarVisible', 'lessons'
                    ];
                    keysToRemove.forEach(k => localStorage.removeItem(k));
                    Object.keys(localStorage).forEach(k => {
                        if (k && (k.startsWith('default') || k.endsWith('Theme') || k.includes('manic_rules') || k.includes('favorite') || k.includes('lessons') || k === 'sidebarVisible' || k === 'collapsedSections')) {
                            try { localStorage.removeItem(k); } catch (e) { }
                        }
                    });
                } catch (e) {
                    console.error('Error clearing storage:', e);
                }
                window.location.reload();
            });
        }
        
        const toggleBottomBtn = document.getElementById('toggle-bottom');
        if (toggleBottomBtn) {
            toggleBottomBtn.addEventListener('click', () => {
                const bottom = document.getElementById('controls-bottom');
                const exportFooter = document.getElementById('export-footer');
                const appearanceFooter = document.getElementById('appearance-footer');
                const instrumentFooter = document.getElementById('instrument-footer');
                if (!bottom) return;
                const isHidden = bottom.style.display === 'none' || window.getComputedStyle(bottom).display === 'none';
                if (isHidden) {
                    bottom.style.display = '';
                    if (exportFooter) exportFooter.style.display = '';
                    if (appearanceFooter) appearanceFooter.style.display = '';
                    if (instrumentFooter) instrumentFooter.style.display = '';
                    toggleBottomBtn.textContent = '👁';
                    toggleBottomBtn.setAttribute('aria-label', 'Hide bottom controls');
                } else {
                    bottom.style.display = 'none';
                    if (exportFooter) exportFooter.style.display = 'none';
                    if (appearanceFooter) appearanceFooter.style.display = 'none';
                    if (instrumentFooter) instrumentFooter.style.display = 'none';
                    toggleBottomBtn.textContent = '🙈';
                    toggleBottomBtn.setAttribute('aria-label', 'Show bottom controls');
                }
            });
            toggleBottomBtn.setAttribute('aria-label', 'Toggle bottom controls');
        }
        
        document.getElementById('instrument-select')?.addEventListener('change', () => document.dispatchEvent(new Event('instrument-changed')));
        document.getElementById('tuning-preset')?.addEventListener('change', () => document.dispatchEvent(new Event('tuning-changed')));
        
        document.getElementById('string-count')?.addEventListener('change', e => {
            const count = parseInt(e.target.value);
            if (count >= 1 && count <= 20) {
                const defaultTuning = this.musicTheory.getDefaultTuning(count);
                this.updateTuningInputs(defaultTuning);
                if (typeof this.flipStringOrder === 'function') this.flipStringOrder();
                else this.updateFretboard();
            }
        });
        
        const basicUpdaters = [
            'start-fret', 'end-fret', 'string-height', 'fret-width',
            'note-size', 'note-shape', 'note-font', 'note-font-size', 'note-effect', 'note-gradient', 'note-offset',
            'string-thickness', 'string-style', 'string-gradient', 'string-effect', 'string-spacing', 'string-opacity',
            'fret-style', 'fret-thickness', 'fret-numbers-placement', 'fret-numbers-position', 'fret-numbers-size', 
            'fret-numbers-offset', 'fret-markers-placement', 'show-fret-numbers', 'fret-numbers-shape', 'fret-markers-offset'
        ];
        
        basicUpdaters.forEach(id => {
            document.getElementById(id)?.addEventListener('change', () => this.updateFretboard());
        });
        
        document.getElementById('key-select')?.addEventListener('change', () => {
            this.updateFretboard();
            this.updateTheoryInfo();
        });
        
        document.getElementById('display-mode')?.addEventListener('change', () => {
            this.updateFretboard();
            this.updateTheoryInfo();
        });
        
        document.getElementById('pattern-type')?.addEventListener('change', (e) => {
            const grp = document.getElementById('custom-pattern-import-group');
            if (grp) grp.style.display = (e.target.value === 'custom') ? 'flex' : 'none';
            this.updatePatternSelect();
            this.updateFretboard();
            this.updateTheoryInfo();
        });

        document.getElementById('pattern-select')?.addEventListener('change', () => {
            this.updateFretboard();
            this.updateTheoryInfo();
        });
        
        document.getElementById('color-theme')?.addEventListener('change', e => {
            const cc = document.getElementById('custom-colors');
            if (cc) cc.style.display = e.target.value === 'custom' ? 'block' : 'none';
            this.updateFretboard();
        });

        document.addEventListener('change', e => {
            if (['export-simple-info', 'export-simple-info-sidebar', 'export-simple-info-pill'].includes(e.target.id)) {
                const isChecked = e.target.checked;
                ['export-simple-info', 'export-simple-info-sidebar', 'export-simple-info-pill'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el && el !== e.target) el.checked = isChecked;
                });
            }
        });
        
        document.querySelectorAll('.theory-info-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateTheoryInfo());
        });
        document.querySelector('#hide-about-section')?.addEventListener('change', () => this.updateTheoryInfo());

        document.getElementById('btn-delete-all-custom')?.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete all custom patterns? This cannot be undone.')) {
                this.musicTheory.customPatterns = {};
                localStorage.removeItem('customPatterns');
                this.updatePatternSelect();
                this.updateFretboard();
                this.updateTheoryInfo();
                alert('All custom patterns have been deleted.');
            }
        });
    };
}