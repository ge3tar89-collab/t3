/**
 * UI Layout Extension for App
 * Handles sidebar visibility and collapsible sections
 */

if (typeof App !== 'undefined') {
    /**
     * Move control buttons below theory info panel
     */
    App.prototype.moveControlButtons = function() {
        const playButton = document.getElementById('play-pattern');
        const addToSlideshowButton = document.getElementById('add-to-slideshow');
        const exportDiagramButton = document.getElementById('export-diagram');
        const musicTheorySection = document.querySelector('.music-theory');
        if (!musicTheorySection) return;
        
        if (playButton) playButton.remove();
        if (addToSlideshowButton) addToSlideshowButton.remove();
        if (exportDiagramButton) exportDiagramButton.remove();
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        const tempoDiv = document.createElement('div');
        tempoDiv.className = 'tempo-control';
        const label = document.createElement('label');
        label.textContent = 'Tempo:';
        label.setAttribute('for', 'tempo-range');
        const input = document.createElement('input');
        input.type = 'range';
        input.id = 'tempo-range';
        input.min = '40';
        input.max = '240';
        input.value = this.tempo.toString();
        const valueDisplay = document.createElement('span');
        valueDisplay.id = 'tempo-value';
        valueDisplay.textContent = this.tempo.toString();
        const bpmLabel = document.createElement('span');
        bpmLabel.textContent = 'BPM';
        tempoDiv.appendChild(label);
        tempoDiv.appendChild(input);
        tempoDiv.appendChild(valueDisplay);
        tempoDiv.appendChild(bpmLabel);
        const newPlayButton = document.createElement('button');
        newPlayButton.id = 'play-pattern';
        newPlayButton.textContent = 'Play Pattern';
        const newAddButton = document.createElement('button');
        newAddButton.id = 'add-to-slideshow';
        newAddButton.textContent = 'Add to Slideshow';
        
        const simpleInfoDiv = document.createElement('div');
        simpleInfoDiv.className = 'tempo-control';
        simpleInfoDiv.style.justifyContent = 'center';
        simpleInfoDiv.innerHTML = `<input type="checkbox" id="export-simple-info" style="width:auto;"><label for="export-simple-info" style="margin-bottom:0; cursor:pointer; font-size: 0.9em; white-space:nowrap;" title="Show just Key and Pattern Name when exporting (e.g. C - Major Scale)">Simple Export Text</label>`;
        
        const newExportButton = document.createElement('button');
        newExportButton.id = 'export-diagram';
        newExportButton.textContent = 'Export Diagram';
        
        buttonContainer.appendChild(tempoDiv);
        buttonContainer.appendChild(newPlayButton);
        buttonContainer.appendChild(newAddButton);
        buttonContainer.appendChild(simpleInfoDiv);
        buttonContainer.appendChild(newExportButton);
        musicTheorySection.after(buttonContainer);
    };

    App.prototype.toggleSidebar = function() {
        const sidebar = document.querySelector('.sidebar');
        const backdrop = document.querySelector('.sidebar-backdrop');
        
        if (this.sidebarVisible) {
            sidebar.classList.remove('sidebar-visible');
            if (backdrop) backdrop.classList.remove('visible');
            document.getElementById('sidebar-toggle').setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        } else {
            sidebar.classList.add('sidebar-visible');
            if (backdrop) backdrop.classList.add('visible');
            document.getElementById('sidebar-toggle').setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }
        
        this.sidebarVisible = !this.sidebarVisible;
        localStorage.setItem('sidebarVisible', this.sidebarVisible ? 'true' : 'false');
    };

    App.prototype.setupCollapsibleSections = function() {
        const sectionHeadings = document.querySelectorAll('.sidebar-heading');
        
        sectionHeadings.forEach(heading => {
            let content = [];
            let nextEl = heading.nextElementSibling;
            while (nextEl && !nextEl.classList.contains('sidebar-heading')) {
                content.push(nextEl);
                nextEl = nextEl.nextElementSibling;
            }
            
            const sectionContainer = document.createElement('div');
            sectionContainer.className = 'sidebar-section';
            const sectionName = heading.textContent.trim().toLowerCase().replace(/\s+/g, '-');
            
            if (this.collapsedSections[sectionName]) {
                sectionContainer.classList.add('collapsed');
                heading.classList.add('collapsed');
            }
            
            content.forEach(el => sectionContainer.appendChild(el));
            heading.after(sectionContainer);
            
            heading.addEventListener('click', () => {
                sectionContainer.classList.toggle('collapsed');
                heading.classList.toggle('collapsed');
                this.collapsedSections[sectionName] = sectionContainer.classList.contains('collapsed');
                localStorage.setItem('collapsedSections', JSON.stringify(this.collapsedSections));
            });
        });
    };
}