/*
Diagnostics helper for Scales Thesaurus
- Adds detailed numbered automated checks (DOM, UI behavior, data integrity, audio, export libs)
- Shows a modal report with step number, test definition, result, details and probable fixes
*/

(function () {
    function createModal(html) {
        const existing = document.getElementById('diagnostics-modal');
        if (existing) existing.remove();
        const modal = document.createElement('div');
        modal.id = 'diagnostics-modal';
        modal.style.position = 'fixed';
        modal.style.inset = '0';
        modal.style.zIndex = 30000;
        modal.style.background = 'rgba(0,0,0,0.6)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        const card = document.createElement('div');
        card.style.width = '92%';
        card.style.maxWidth = '980px';
        card.style.maxHeight = '86vh';
        card.style.overflow = 'auto';
        card.style.background = 'var(--card-bg, #fff)';
        card.style.color = 'var(--text-color, #111)';
        card.style.borderRadius = '8px';
        card.style.padding = '14px';
        card.style.boxShadow = '0 8px 30px rgba(0,0,0,0.3)';
        const close = document.createElement('button');
        close.textContent = 'Close';
        close.style.float = 'right';
        close.style.background = '#e74c3c';
        close.style.color = '#fff';
        close.style.border = 'none';
        close.style.padding = '6px 10px';
        close.style.borderRadius = '6px';
        close.style.cursor = 'pointer';
        close.addEventListener('click', () => modal.remove());
        card.appendChild(close);
        const heading = document.createElement('h2');
        heading.textContent = 'Diagnostics Report';
        heading.style.marginTop = '0';
        card.appendChild(heading);
        const content = document.createElement('div');
        content.innerHTML = html;
        card.appendChild(content);
        modal.appendChild(card);
        document.body.appendChild(modal);
    }

    function passFailRow(stepNo, name, ok, detail, probableFix) {
        return `<div style="padding:10px;border-bottom:1px solid var(--border-color);">
            <div style="display:flex;justify-content:space-between;align-items:center;">
                <div style="max-width:78%"><strong>${stepNo}. ${escapeHtml(name)}</strong>
                    <div style="color:var(--secondary-color);font-size:0.95em;margin-top:6px">${escapeHtml(detail || '')}</div>
                </div>
                <div style="font-size:1.05em">${ok ? '<span style="color:var(--accent-color);font-weight:700">PASS</span>' : '<span style="color:#e74c3c;font-weight:700">FAIL</span>'}</div>
            </div>
            ${probableFix ? `<div style="margin-top:8px;font-size:0.9em;color:#444"><em>Probable fix:</em> ${escapeHtml(probableFix)}</div>` : ''}
        </div>`;
    }

    function escapeHtml(s) {
        if (!s) return '';
        return s.replace(/[&<>"']/g, function (m) {
            return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];
        });
    }

    async function runChecks() {
        const results = [];
        console.group('Diagnostics run');

        // removed diagnostics tests array -> moved to diagnostics-tests.js
        const tests = window.DIAGNOSTICS_TESTS || [];

        // Execute tests sequentially and collect report rows
        for (const t of tests) {
            try {
                const res = await (typeof t.run === 'function' ? t.run() : { ok: false, detail: 'No runner' });
                const ok = !!res.ok;
                const detail = res.detail || t.definition;
                const probableFix = res.probableFix || '';
                results.push({ step: t.id, name: t.name, ok, detail, probableFix });
            } catch (err) {
                results.push({ step: t.id, name: t.name, ok: false, detail: 'Exception: ' + (err && err.message ? err.message : String(err)), probableFix: 'See console for stack trace' });
            }
        }

        // Build HTML with numbered steps, definitions, results and probable fixes
        let html = '<div style="border:1px solid var(--border-color);border-radius:6px;overflow:hidden;">';
        for (const r of results) {
            html += passFailRow(r.step, r.name, r.ok, r.detail, r.probableFix);
        }
        html += '</div>';

        createModal(html);
        console.groupEnd();
        return results;
    }

    // Attach event listener to button (delegated init safe)
    document.addEventListener('click', function (e) {
        if (e.target && e.target.id === 'run-diagnostics') {
            // Run checks and show loading state
            const btn = e.target;
            const prev = btn.textContent;
            btn.textContent = '⏳';
            btn.disabled = true;
            runChecks().finally(() => {
                btn.textContent = prev;
                btn.disabled = false;
            });
        }
    });

    // Expose to window for programmatic runs
    window.runAppDiagnostics = runChecks;
})();