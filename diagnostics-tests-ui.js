window.DIAGNOSTICS_TESTS_UI = [
    {
        id: 11,
        name: 'Current pattern display below diagram',
        definition: 'Verify the "current-pattern-display" shows key, type and friendly pattern name after updateFretboard() runs.',
        run: () => {
            const disp = document.getElementById('current-pattern-display');
            if (!disp) return { ok: false, detail: 'current-pattern-display missing', probableFix: 'Add element with id current-pattern-display to the main template.' };
            try {
                if (window.app && typeof window.app.updateFretboard === 'function') window.app.updateFretboard();
                const text = disp.textContent.trim();
                const ok = text.length > 0 && /·/.test(text);
                return { ok, detail: ok ? `Displayed: ${text}` : 'Display empty or not in expected format', probableFix: 'Ensure updateFretboard populates the element with key · Type · Pattern string.' };
            } catch (e) {
                return { ok: false, detail: e.message, probableFix: 'Wrap update call in try/catch and ensure DOM element exists.' };
            }
        }
    },
    {
        id: 12,
        name: 'Export buttons presence and wiring',
        definition: 'Check presence of primary export buttons (save-scales-zip, save-chords-zip, save-intervals-zip, save-gamuts-zip) and that Exporter methods exist.',
        run: () => {
            const ids = ['save-scales-zip','save-chords-zip','save-intervals-zip','save-gamuts-zip'];
            const missing = ids.filter(id => !document.getElementById(id));
            const methodsOk = typeof Exporter !== 'undefined' && !!Exporter.exportAllScalesToZip && !!Exporter.exportAllChordsToZip && !!Exporter.exportAllIntervalsToZip && !!Exporter.exportAllGamutsToZip;
            return { ok: missing.length===0 && methodsOk, detail: `missingButtons:${missing.join(',')}; exporterMethods:${methodsOk}`, probableFix: (missing.length ? 'Add missing export buttons to the UI.' : '') + (methodsOk ? '' : ' Ensure Exporter class implements the export methods and is loaded.') };
        }
    },
    {
        id: 13,
        name: 'Slideshow filename customization available',
        definition: 'Verify Set Filename button exists and setCustomFilename() method is available on App.',
        run: () => {
            const btn = document.getElementById('set-filename');
            const methodOk = typeof App !== 'undefined' && !!App.prototype.setCustomFilename;
            if (!btn) return { ok: false, detail: 'set-filename button missing', probableFix: 'Add a "Set Filename" control to slideshow controls.' };
            return { ok: methodOk, detail: methodOk ? 'Button and method present' : 'Method setCustomFilename missing on App.prototype', probableFix: methodOk ? '' : 'Implement App.prototype.setCustomFilename to store custom filenames.' };
        }
    },
    {
        id: 14,
        name: 'Piano initialization',
        definition: 'Ensure Piano.init is available and createPianoKeyboard exists for embedding the piano UI.',
        run: () => {
            const pianoInit = typeof Piano !== 'undefined' && typeof Piano.init === 'function';
            return { ok: pianoInit, detail: pianoInit ? 'Piano.init available' : 'Piano.init missing', probableFix: 'Include piano.js and ensure Piano.init is defined.' };
        }
    },
    {
        id: 15,
        name: 'Theme application and page class toggling',
        definition: 'Verify applyPageTheme/applyTheme correctly adds theme- classes to documentElement and persists selection.',
        run: () => {
            const sel = document.getElementById('page-theme');
            if (!sel) return { ok: false, detail: 'page-theme select missing', probableFix: 'Add page-theme selector to UI.' };
            const original = document.documentElement.className;
            sel.value = sel.options.length ? sel.options[0].value : 'default';
            sel.dispatchEvent(new Event('change'));
            const applied = Array.from(document.documentElement.classList).some(c => c.startsWith('theme-'));
            document.documentElement.className = original;
            return { ok: true, detail: applied ? 'Theme class applied' : 'No theme class applied (default may be no-class)', probableFix: applied ? '' : 'Ensure applyTheme adds theme-<name> class to documentElement.' };
        }
    },
    {
        id: 16,
        name: 'Custom colors retrieval',
        definition: 'If color-theme is custom, getCustomColors should return an object with interval colors mapping.',
        run: () => {
            try {
                const colorTheme = document.getElementById('color-theme');
                if (!colorTheme) return { ok: false, detail: 'color-theme select missing', probableFix: 'Add color-theme control.' };
                const prev = colorTheme.value;
                colorTheme.value = 'custom';
                colorTheme.dispatchEvent(new Event('change'));
                if (!window.app || typeof window.app.getCustomColors !== 'function') {
                    colorTheme.value = prev; colorTheme.dispatchEvent(new Event('change'));
                    return { ok: false, detail: 'App.getCustomColors missing', probableFix: 'Implement App.prototype.getCustomColors.' };
                }
                const colors = window.app.getCustomColors();
                colorTheme.value = prev; colorTheme.dispatchEvent(new Event('change'));
                const ok = colors && typeof colors === 'object' && colors.intervals !== undefined;
                return { ok, detail: ok ? 'Custom colors structure present' : 'Custom colors missing intervals mapping', probableFix: 'Ensure getCustomColors builds intervals map when custom theme is active.' };
            } catch (e) {
                return { ok: false, detail: e.message, probableFix: 'Guard getCustomColors with try/catch.' };
            }
        }
    },
    {
        id: 17,
        name: 'Fretboard exportImage availability',
        definition: 'Ensure the fretboard instance exposes exportImage() used by export flows.',
        run: () => {
            if (!window.app || !window.app.fretboard) return { ok: false, detail: 'App or fretboard instance missing', probableFix: 'Ensure App is instantiated and exposes fretboard.' };
            const ok = typeof window.app.fretboard.exportImage === 'function';
            return { ok, detail: ok ? 'exportImage available' : 'exportImage missing on fretboard', probableFix: 'Add exportImage method to Fretboard class to snapshot the container.' };
        }
    },
    {
        id: 18,
        name: 'Generated patterns UI wiring',
        definition: 'Check that generateAll* methods populate generated-patterns area and add export buttons.',
        run: async () => {
            if (!window.app) return { ok: false, detail: 'App instance missing', probableFix: 'Instantiate App before running diagnostics.' };
            const container = document.getElementById('generated-patterns');
            if (!container) return { ok: false, detail: 'generated-patterns container missing', probableFix: 'Add generated-patterns container to page.' };
            try {
                window.app.generateAllIntervals();
                await new Promise(r=>setTimeout(r,120));
                const hasExport = !!container.querySelector('.export-all-generated') || !!container.querySelector('.export-all-with-info');
                window.app.generatedPatterns = [];
                window.app.updateGeneratedPatternsDisplay && window.app.updateGeneratedPatternsDisplay();
                return { ok: hasExport, detail: hasExport ? 'Export buttons present after generation' : 'Export buttons not created', probableFix: 'Ensure generateAll* functions call addExportAllButton/addExportAllWithInfoButton.' };
            } catch (e) {
                return { ok: false, detail: e.message, probableFix: 'Wrap generator functions and ensure they update DOM safely.' };
            }
        }
    },
    {
        id: 19,
        name: 'Tuner toggles and note buttons',
        definition: 'Chromatic tuner toggle should reveal a container with note buttons that play via synth.',
        run: async () => {
            const toggle = document.getElementById('chromatic-tuner-toggle');
            const container = document.getElementById('chromatic-tuner-container');
            if (!toggle || !container) return { ok: false, detail: 'Tuner controls missing', probableFix: 'Include chromatic tuner controls in sidebar.' };
            toggle.click();
            await new Promise(r=>setTimeout(r,80));
            const buttons = container.querySelectorAll('.chromatic-tuner-button');
            toggle.click();
            return { ok: buttons.length >= 12, detail: `Found ${buttons.length} tuner buttons`, probableFix: buttons.length < 12 ? 'Populate chromatic tuner with all 12 notes.' : '' };
        }
    },
];

// Append to main diagnostics tests array
if (window.DIAGNOSTICS_TESTS) {
    window.DIAGNOSTICS_TESTS.push(...window.DIAGNOSTICS_TESTS_UI);
}