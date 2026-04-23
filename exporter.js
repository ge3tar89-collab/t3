class Exporter {
    static async getFretboardImageBase64(app) {
        try {
            const svg = app.fretboard.container.querySelector('svg');
            if (svg) {
                const clone = svg.cloneNode(true);
                const styleEl = document.createElement('style');
                styleEl.textContent = `
                    .string { stroke: #888; stroke-linecap: round; }
                    .fret { stroke: #444; stroke-linecap: butt; }
                    .fret-marker { fill: #333; }
                    .note-marker { stroke: ${getComputedStyle(document.documentElement).getPropertyValue('--marker-color') || '#333'}; stroke-width: 1; }
                    .note-marker[points] { stroke-linejoin: round; }
                    .fret-number { font-size: 12px; text-anchor: middle; fill: #666; font-family: sans-serif; }
                    .string-label { font-size: 12px; text-anchor: end; fill: #666; font-family: sans-serif; }
                `;
                clone.insertBefore(styleEl, clone.firstChild);

                const serializer = new XMLSerializer();
                let source = serializer.serializeToString(clone);
                if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
                    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
                }

                return await new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        const viewBox = clone.getAttribute('viewBox');
                        if (viewBox) {
                            const parts = viewBox.split(' ');
                            canvas.width = parseFloat(parts[2]);
                            canvas.height = parseFloat(parts[3]);
                        } else {
                            canvas.width = parseFloat(clone.getAttribute('width')) || 1000;
                            canvas.height = parseFloat(clone.getAttribute('height')) || 250;
                        }
                        const ctx = canvas.getContext('2d');
                        // Use fretboard's actual background color from settings/theme
                        let bgColor = '#ffffff';
                        if (app.fretboard && app.fretboard.getThemeColors) {
                            bgColor = app.fretboard.getThemeColors().background || '#ffffff';
                        }
                        ctx.fillStyle = bgColor;
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(img, 0, 0);

                        // Optional: Include Key - Pattern Type - Pattern text in the image
                        const simpleInfo = document.getElementById('export-simple-info')?.checked || 
                                           document.getElementById('export-simple-info-sidebar')?.checked ||
                                           document.getElementById('export-simple-info-pill')?.checked;
                        const includeInfo = document.getElementById('export-include-info')?.checked || simpleInfo;
                        if (includeInfo && app.fretboard) {
                            const key = app.fretboard.currentKey || '';
                            const type = app.fretboard.currentPatternType || '';
                            const patternId = app.fretboard.currentPattern || '';
                            
                            let patternName = patternId;
                            if (type === 'scale' && app.musicTheory.scales?.[patternId]) patternName = app.musicTheory.scales[patternId].name;
                            else if (type === 'chord' && app.musicTheory.chords?.[patternId]) patternName = app.musicTheory.chords[patternId].name;
                            else if (type === 'interval' && app.musicTheory.intervals?.[patternId]) patternName = app.musicTheory.intervals[patternId].name;
                            else if (type === 'gamut' && app.musicTheory.gamuts?.[patternId]) patternName = app.musicTheory.gamuts[patternId].name;
                            else if (type === 'custom' && app.musicTheory.customPatterns?.[patternId]) patternName = app.musicTheory.customPatterns[patternId].name;
                            
                            // Build intervals text depending on pattern type
                            let intervalsText = '';
                            try {
                                if (type === 'scale' && app.musicTheory.scales?.[patternId]) {
                                    intervalsText = (app.musicTheory.scales[patternId].intervals || []).join(' - ');
                                } else if (type === 'chord' && app.musicTheory.chords?.[patternId]) {
                                    intervalsText = (app.musicTheory.chords[patternId].intervals || []).join(' - ');
                                } else if (type === 'interval' && app.musicTheory.intervals?.[patternId]) {
                                    const iv = app.musicTheory.intervals[patternId];
                                    intervalsText = iv.shortName ? `${iv.shortName} · ${iv.semitones} semitones` : `${iv.semitones} semitones`;
                                } else if (type === 'custom' && app.musicTheory.customPatterns?.[patternId]) {
                                    intervalsText = (app.musicTheory.customPatterns[patternId].intervals || []).join(' - ');
                                } else {
                                    intervalsText = '';
                                }
                            } catch (e) {
                                intervalsText = '';
                            }
                            
                            const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
                            const tuningText = app.fretboard.settings.tuning.join('-');
                            let instrumentName = '';
                            const instSelect = document.getElementById('instrument-select');
                            if (instSelect && instSelect.options[instSelect.selectedIndex]) {
                                instrumentName = instSelect.options[instSelect.selectedIndex].text + " | ";
                            }
                            
                            let infoString = '';
                            if (simpleInfo) {
                                infoString = `${key} - ${patternName}`;
                                if (type === 'scale' && !patternName.toLowerCase().includes('scale')) {
                                    infoString += ' Scale';
                                } else if (type === 'chord' && !patternName.toLowerCase().includes('chord')) {
                                    infoString += ' Chord';
                                }
                            } else {
                                infoString = intervalsText ? `${instrumentName}${tuningText} | ${key} - ${typeLabel} - ${patternName} - ${intervalsText}` : `${instrumentName}${tuningText} | ${key} - ${typeLabel} - ${patternName}`;
                            }
                            
                            ctx.font = 'bold 16px sans-serif';
                            const textMetrics = ctx.measureText(infoString);
                            const textWidth = textMetrics.width;
                            
                            // Draw nice rounded pill background for text readability
                            const paddingX = 16;
                            const paddingY = 6;
                            const rectX = (canvas.width / 2) - (textWidth / 2) - paddingX;
                            const rectY = canvas.height - 30;
                            const rectW = textWidth + (paddingX * 2);
                            const rectH = 24 + paddingY;
                            
                            ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
                            if (ctx.roundRect) {
                                ctx.beginPath();
                                ctx.roundRect(rectX, rectY, rectW, rectH, 8);
                                ctx.fill();
                            } else {
                                ctx.fillRect(rectX, rectY, rectW, rectH);
                            }
                            
                            ctx.fillStyle = '#FFFFFF';
                            ctx.textAlign = 'center';
                            ctx.fillText(infoString, canvas.width / 2, canvas.height - 10);
                        }

                        resolve(canvas.toDataURL('image/jpeg', 0.85).split(',')[1]);
                    };
                    img.onerror = reject;
                    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source);
                });
            }
        } catch (e) {
            console.warn('SVG direct render failed, falling back to html2canvas', e);
        }
        
        // Fallback to html2canvas
        const canvas = await html2canvas(app.fretboard.container, { logging: false });
        return canvas.toDataURL('image/jpeg', 0.85).split(',')[1];
    }

    // removed exportAllScalesToZip() {} -> moved to exporter-scales.js
    // removed exportAllChordsToZip() {} -> moved to exporter-chords.js
    // removed exportAllIntervalsToZip() {} -> moved to exporter-intervals.js
    // removed exportAllGamutsToZip() {} -> moved to exporter-gamuts.js

    // removed bulk and CoF export methods -> moved to exporter-bulk.js and exporter-cof.js
}