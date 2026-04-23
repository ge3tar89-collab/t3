/**
 * Scales Page Application Logic
 */
document.addEventListener('DOMContentLoaded', () => {
    const musicTheory = new MusicTheory();
    const scaleListContainer = document.getElementById('scale-list');
    const intervalFilterListContainer = document.getElementById('interval-filter-list');
    const clearFiltersButton = document.getElementById('clear-filters');
    const showFavoritesCheckbox = document.getElementById('show-favorites-only');
    const searchInput = document.getElementById('scale-search');
    const toneCountSelect = document.getElementById('tone-count-filter');
    const resultsCountDisplay = document.getElementById('results-count');

    // Load favorites from localStorage
    let favoriteScales = JSON.parse(localStorage.getItem('favoriteScales') || '{}');

    // Get scales and intervals from MusicTheory class
    const scales = musicTheory.scales;
    const intervals = musicTheory.intervals;

    // Store all created scale item elements and their associated data
    let allScaleData = [];

    // Function to populate the scale list
    function populateScales() {
        scaleListContainer.innerHTML = '';
        allScaleData = [];
        
        const sortedScaleEntries = Object.entries(scales).sort(([, a], [, b]) => a.name.localeCompare(b.name));

        sortedScaleEntries.forEach(([id, data]) => {
            const scaleItemElement = document.createElement('div');
            scaleItemElement.className = 'scale-item';
            
            const details = document.createElement('div');
            details.className = 'scale-details';

            // Scale Name Heading
            const nameHeading = document.createElement('h3');
            nameHeading.textContent = data.name;
            details.appendChild(nameHeading);

            // Formula Display
            const formulaPara = document.createElement('p');
            formulaPara.innerHTML = `<strong>Formula:</strong> <span class="scale-notes">${data.intervals.join(' - ')}</span>`;
            details.appendChild(formulaPara);

            // Example Spelling (C Root)
            const exampleNotes = musicTheory.getScaleNotes('C', id);
            const notesPara = document.createElement('p');
            notesPara.innerHTML = `<strong>Example (C Root):</strong> <span class="scale-notes">${exampleNotes.join(' - ')}</span>`;
            details.appendChild(notesPara);

            // Related Modes (if available via logic)
            const relatedModes = (typeof musicTheory.getRelatedModes === 'function') ? musicTheory.getRelatedModes(id) : [];
            if (relatedModes && relatedModes.length > 0) {
                const modesPara = document.createElement('p');
                modesPara.innerHTML = `<strong>Related Modes:</strong> ${relatedModes.join(', ')}`;
                details.appendChild(modesPara);
            }

            // Description
            const description = (typeof musicTheory.getScaleDescription === 'function') ? musicTheory.getScaleDescription(id) : '';
            if (description) {
                const descPara = document.createElement('p');
                descPara.innerHTML = `<strong>About:</strong> ${description}`;
                details.appendChild(descPara);
            }

            // Buttons Container
            const buttonPairContainer = document.createElement('div');
            buttonPairContainer.className = 'button-pair-container';

            // Hear Scale Button
            const hearBtn = document.createElement('button');
            hearBtn.className = 'hear-scale-button';
            hearBtn.textContent = 'Hear Scale';
            hearBtn.addEventListener('click', () => {
                window.location.href = `index.html?key=C&patternType=scale&pattern=${encodeURIComponent(id)}&action=play`;
            });

            // View on Fretboard Button
            const showBtn = document.createElement('button');
            showBtn.className = 'view-diagram-button';
            showBtn.textContent = 'Fretboard';
            showBtn.addEventListener('click', () => {
                window.location.href = `index.html?key=C&patternType=scale&pattern=${encodeURIComponent(id)}`;
            });

            buttonPairContainer.appendChild(hearBtn);
            buttonPairContainer.appendChild(showBtn);
            details.appendChild(buttonPairContainer);

            scaleItemElement.appendChild(details);

            // Favorite Star Toggle
            const favButton = document.createElement('button');
            favButton.className = 'favorite-button';
            favButton.innerHTML = favoriteScales[id] ? '★' : '☆';
            if (favoriteScales[id]) favButton.classList.add('favorited');
            favButton.title = 'Toggle Favorite';
            favButton.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFavorite(id, favButton, scaleItemElement);
            });
            scaleItemElement.appendChild(favButton);

            scaleListContainer.appendChild(scaleItemElement);
            allScaleData.push({ id, data, element: scaleItemElement });
        });
    }

    // Populate Interval Checkboxes with 3-state logic: None -> Include -> Exclude
    function populateIntervalFilters() {
        intervalFilterListContainer.innerHTML = '';
        const sortedIntervals = Object.entries(intervals).sort(([, a], [, b]) => a.semitones - b.semitones);
        
        sortedIntervals.forEach(([id, data]) => {
            const filterItem = document.createElement('div');
            filterItem.className = 'interval-filter-item';
            filterItem.dataset.id = id;
            filterItem.dataset.state = 'none'; // none, include, exclude
            
            // We use the wrapper for clicking to cycle states
            filterItem.addEventListener('click', (e) => {
                e.preventDefault();
                let currentState = filterItem.dataset.state;
                
                if (currentState === 'none') {
                    filterItem.dataset.state = 'include';
                    filterItem.classList.add('selected');
                    filterItem.classList.remove('excluded');
                } else if (currentState === 'include') {
                    filterItem.dataset.state = 'exclude';
                    filterItem.classList.remove('selected');
                    filterItem.classList.add('excluded');
                } else {
                    filterItem.dataset.state = 'none';
                    filterItem.classList.remove('selected');
                    filterItem.classList.remove('excluded');
                }
                filterAndSortScales();
            });
            
            const label = document.createElement('label');
            label.textContent = data.shortName;
            label.title = data.name; 
            
            filterItem.appendChild(label);
            intervalFilterListContainer.appendChild(filterItem);
        });
    }

    // Toggle Favorite Function
    function toggleFavorite(scaleId, buttonElement, itemElement) {
        if (favoriteScales[scaleId]) {
            delete favoriteScales[scaleId];
            buttonElement.classList.remove('favorited');
            buttonElement.innerHTML = '☆';
        } else {
            favoriteScales[scaleId] = true;
            buttonElement.classList.add('favorited');
            buttonElement.innerHTML = '★';
        }
        localStorage.setItem('favoriteScales', JSON.stringify(favoriteScales));
        filterAndSortScales();
    }

    // Filter Logic
    function filterAndSortScales() {
        const includeIntervals = Array.from(intervalFilterListContainer.querySelectorAll('.interval-filter-item.selected'))
                                       .map(item => item.dataset.id);
        const excludeIntervals = Array.from(intervalFilterListContainer.querySelectorAll('.interval-filter-item.excluded'))
                                       .map(item => item.dataset.id);
                                       
        const showOnlyFavorites = showFavoritesCheckbox.checked;
        const searchText = (searchInput.value || '').toLowerCase().trim();
        const toneCount = toneCountSelect.value;

        let visibleCount = 0;

        allScaleData.forEach(item => {
            const matchesInclude = includeIntervals.length === 0 || 
                                   includeIntervals.every(int => item.data.intervals.includes(int));
            
            const matchesExclude = excludeIntervals.length === 0 ||
                                   !excludeIntervals.some(int => item.data.intervals.includes(int));

            const matchesFavorite = !showOnlyFavorites || favoriteScales[item.id];
            const formulaStr = item.data.intervals.join(' ').toLowerCase();
            const formulaCompact = item.data.intervals.join('').toLowerCase();
            const notesStr = musicTheory.getScaleNotes('C', item.id).join(' ').toLowerCase();
            
            const matchesSearch = !searchText || 
                                  item.data.name.toLowerCase().includes(searchText) ||
                                  formulaStr.includes(searchText) ||
                                  formulaCompact.includes(searchText) ||
                                  notesStr.includes(searchText);
            const matchesTones = !toneCount || item.data.intervals.length === parseInt(toneCount);
            
            if (matchesInclude && matchesExclude && matchesFavorite && matchesSearch && matchesTones) {
                item.element.classList.remove('hidden');
                visibleCount++;
            } else {
                item.element.classList.add('hidden');
            }
        });

        // Update results display
        if (visibleCount === allScaleData.length) {
            resultsCountDisplay.textContent = `Showing all ${allScaleData.length} scales`;
        } else {
            resultsCountDisplay.textContent = `Found ${visibleCount} match${visibleCount === 1 ? '' : 'es'}`;
        }
    }

    // Clear Filters
    clearFiltersButton.addEventListener('click', () => {
        intervalFilterListContainer.querySelectorAll('.interval-filter-item').forEach(item => {
            item.dataset.state = 'none';
            item.classList.remove('selected', 'excluded');
        });
        showFavoritesCheckbox.checked = false;
        searchInput.value = '';
        toneCountSelect.value = '';
        filterAndSortScales();
    });

    showFavoritesCheckbox.addEventListener('change', filterAndSortScales);
    searchInput.addEventListener('input', filterAndSortScales);
    toneCountSelect.addEventListener('change', filterAndSortScales);

    // Initial load
    populateScales();
    populateIntervalFilters();
    filterAndSortScales();
});