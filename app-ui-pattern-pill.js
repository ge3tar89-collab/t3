/**
 * UI Pattern Pill Orchestrator
 */
if (typeof App !== 'undefined') {
    App.prototype.updateCurrentPatternDisplay = function(disp) {
        disp.innerHTML = '';
        
        const keySelect = typeof this.createInlineKeySelect === 'function' ? this.createInlineKeySelect() : document.createElement('select');
        const patternTypeSelect = typeof this.createInlineTypeSelect === 'function' ? this.createInlineTypeSelect() : document.createElement('select');
        const patternSelectInline = typeof this.createInlinePatternSelect === 'function' ? this.createInlinePatternSelect() : document.createElement('select');
        
        const syncPatternSelect = (type, val) => {
            if(typeof this.populateInlinePatternSelect === 'function') {
                this.populateInlinePatternSelect(patternSelectInline, type, val);
            }
        };

        syncPatternSelect(patternTypeSelect.value, document.getElementById('pattern-select')?.value);
        
        patternTypeSelect.addEventListener('change', e => syncPatternSelect(e.target.value, null));
        const uiPatternSelect = document.getElementById('pattern-select');
        if (uiPatternSelect) {
            uiPatternSelect.addEventListener('change', () => syncPatternSelect(patternTypeSelect.value, uiPatternSelect.value));
        }

        const actionBtns = typeof this.createInlineActionButtons === 'function' ? this.createInlineActionButtons(disp) : [];
        const cycleBtns = typeof this.createInlineCycleControls === 'function' ? this.createInlineCycleControls(disp) : [];

        const container = document.createElement('div');
        container.className = 'consolidated-selector-pill';
        container.style.display = 'inline-flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.style.gap = '4px';
        container.style.background = 'var(--card-bg)';
        container.style.border = '1px solid var(--border-color)';
        container.style.borderRadius = '30px';
        container.style.padding = '4px 18px';
        container.style.boxShadow = '0 3px 10px rgba(0,0,0,0.08)';
        container.style.margin = '0 auto';

        const createSep = () => {
            const sep = document.createElement('span');
            sep.textContent = '·';
            sep.style.color = 'var(--border-color)';
            sep.style.fontWeight = '900';
            sep.style.fontSize = '1.4em';
            sep.style.padding = '0 4px';
            return sep;
        };

        container.appendChild(keySelect);
        container.appendChild(createSep());
        container.appendChild(patternTypeSelect);
        container.appendChild(createSep());
        container.appendChild(patternSelectInline);

        // Capo inline pill (checkbox + small number input)
        const capoWrapper = document.createElement('span');
        capoWrapper.style.display = 'inline-flex';
        capoWrapper.style.alignItems = 'center';
        capoWrapper.style.gap = '6px';
        capoWrapper.style.marginLeft = '6px';
        capoWrapper.style.padding = '4px 8px';
        capoWrapper.style.borderRadius = '20px';
        capoWrapper.style.background = 'transparent';
        capoWrapper.style.border = '1px solid var(--border-color)';
        
        const capoCheckbox = document.createElement('input');
        capoCheckbox.type = 'checkbox';
        capoCheckbox.id = 'inline-capo-enable';
        capoCheckbox.title = 'Enable capo (inline)';
        capoCheckbox.style.width = '16px';
        capoCheckbox.style.height = '16px';
        
        const capoInput = document.createElement('input');
        capoInput.type = 'number';
        capoInput.id = 'inline-capo-fret';
        capoInput.min = '0';
        capoInput.max = '24';
        capoInput.value = '0';
        capoInput.style.width = '56px';
        capoInput.style.padding = '2px 6px';
        capoInput.style.borderRadius = '12px';
        capoInput.style.border = '1px solid var(--input-border)';
        capoInput.title = 'Capo fret';
        
        // Synchronize inline capo with bottom controls if present
        capoCheckbox.addEventListener('change', (e) => {
            const bottomChk = document.getElementById('capo-enable');
            if (bottomChk) bottomChk.checked = e.target.checked;
            const app = window.app;
            if (app && typeof app.updateFretboard === 'function') app.updateFretboard();
        });
        capoInput.addEventListener('change', (e) => {
            const bottomInput = document.getElementById('capo-fret');
            if (bottomInput) bottomInput.value = e.target.value;
            const app = window.app;
            if (app && typeof app.updateFretboard === 'function') app.updateFretboard();
        });

        // Keep bottom inputs in sync to inline
        document.addEventListener('change', (ev) => {
            if (ev.target && ev.target.id === 'capo-enable' && document.getElementById('inline-capo-enable')) {
                document.getElementById('inline-capo-enable').checked = ev.target.checked;
            }
            if (ev.target && ev.target.id === 'capo-fret' && document.getElementById('inline-capo-fret')) {
                document.getElementById('inline-capo-fret').value = ev.target.value;
            }
        });

        capoWrapper.appendChild(capoCheckbox);
        const lbl = document.createElement('span');
        lbl.textContent = 'Capo';
        lbl.style.fontSize = '0.9em';
        lbl.style.fontWeight = '700';
        lbl.style.color = 'var(--secondary-color)';
        capoWrapper.appendChild(lbl);
        capoWrapper.appendChild(capoInput);

        container.appendChild(capoWrapper);
        
        actionBtns.forEach(btn => container.appendChild(btn));
        cycleBtns.forEach(btn => container.appendChild(btn));

        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.justifyContent = 'center';
        wrapper.style.width = '100%';
        wrapper.appendChild(container);
        
        disp.appendChild(wrapper);
    };
}