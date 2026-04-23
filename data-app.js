document.addEventListener('DOMContentLoaded', () => {

    const DataEditor = {
        musicTheory: new MusicTheory(),
        LOCAL_STORAGE_KEY: 'manic_rules_custom_data',

        init() {
            this.initTabs();
            this.populateAllTables();
            this.initExportButtons();
            this.initResetButton();
        },

        initTabs() {
            const tabsContainer = document.querySelector('.tabs');
            tabsContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('tab-link')) {
                    const tabName = e.target.dataset.tab;
                    
                    document.querySelectorAll('.tab-link').forEach(tab => tab.classList.remove('active'));
                    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

                    e.target.classList.add('active');
                    document.getElementById(`${tabName}-tab`).classList.add('active');
                }
            });
        },

        saveChange(type, id, field, value) {
            const storedData = localStorage.getItem(this.LOCAL_STORAGE_KEY);
            let customData = storedData ? JSON.parse(storedData) : {};
            
            if (!customData[type]) customData[type] = {};
            if (!customData[type][id]) customData[type][id] = {};

            customData[type][id][field] = value;
            this.musicTheory[type][id][field] = value;

            try {
                localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(customData));
                return true;
            } catch (e) {
                console.error('Error saving data:', e);
                return false;
            }
        },

        showFeedback(element, success) {
            element.classList.remove('saved', 'error');
            element.classList.add(success ? 'saved' : 'error');
            setTimeout(() => element.classList.remove('saved', 'error'), 1500);
        },

        populateAllTables() {
            this.populateIntervalTable();
            this.populateGroupedTables('chords');
            this.populateGroupedTables('scales');
        },

        populateIntervalTable() {
            const tableBody = document.getElementById('interval-table').querySelector('tbody');
            tableBody.innerHTML = '';
            const sortedIntervals = Object.entries(this.musicTheory.intervals).sort(([, a], [, b]) => a.semitones - b.semitones);
            
            sortedIntervals.forEach(([id, data], index) => {
                const row = tableBody.insertRow();
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${id}</td>
                    <td contenteditable="true">${data.name}</td>
                    <td contenteditable="true">${data.shortName}</td>
                    <td>${data.semitones}</td>
                    <td>
                      <div class="color-input-wrapper">
                        <input class="bg-color-input" type="color" value="${data.color}">
                        <span class="bg-color-text">${data.color}</span>
                      </div>
                    </td>
                    <td>
                      <div class="color-input-wrapper">
                        <input class="font-color-input" type="color" value="${data.fontColor || '#ffffff'}">
                        <span class="font-color-text">${data.fontColor || '#ffffff'}</span>
                      </div>
                    </td>
                `;
                this.addEditListener(row.cells[2], 'intervals', id, 'name');
                this.addEditListener(row.cells[3], 'intervals', id, 'shortName');
                // background color input (interval marker color)
                this.addEditListener(row.querySelector('.bg-color-input'), 'intervals', id, 'color', true);
                // font color input (text color shown on markers)
                this.addEditListener(row.querySelector('.font-color-input'), 'intervals', id, 'fontColor', true);
            });
            this.makeTableSortable(document.getElementById('interval-table'));
        },

        populateGroupedTables(type) { // 'chords' or 'scales'
            const container = document.getElementById(`${type}-tables-container`);
            const data = this.musicTheory[type];
            const groupedData = {};

            Object.entries(data).forEach(([id, itemData]) => {
                const numTones = itemData.intervals.length;
                if (!groupedData[numTones]) groupedData[numTones] = [];
                groupedData[numTones].push([id, itemData]);
            });

            container.innerHTML = '';
            const sortedToneGroups = Object.keys(groupedData).sort((a, b) => a - b);

            sortedToneGroups.forEach(numTones => {
                const group = groupedData[numTones].sort(([, a], [, b]) => a.name.localeCompare(b.name));

                const heading = document.createElement('h3');
                heading.className = 'sub-heading';
                heading.textContent = `${numTones}-Tone ${type.charAt(0).toUpperCase() + type.slice(1)}`;
                container.appendChild(heading);

                const table = document.createElement('table');
                table.className = 'data-table';
                table.id = `${type}-table-${numTones}`;
                container.appendChild(table);

                table.innerHTML = `
                    <thead>
                        <tr>
                            <th>#</th><th>ID</th><th>Name</th><th class="tones-col">Tones</th><th>Intervals</th><th>Example (C Root)</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                `;
                const tbody = table.querySelector('tbody');
                group.forEach(([id, itemData], index) => {
                    const exampleNotes = type === 'chords' 
                        ? this.musicTheory.getChordNotes('C', id) 
                        : this.musicTheory.getScaleNotes('C', id);

                    const row = tbody.insertRow();
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${id}</td>
                        <td contenteditable="true">${itemData.name}</td>
                        <td class="tones-col">${itemData.intervals.length}</td>
                        <td contenteditable="true">${itemData.intervals.join(',')}</td>
                        <td>${exampleNotes.join(' - ')}</td>
                    `;
                    this.addEditListener(row.cells[2], type, id, 'name');
                    this.addEditListener(row.cells[4], type, id, 'intervals');
                });
                this.makeTableSortable(table);
            });
        },

        addEditListener(element, type, id, field, isColorInput = false) {
            const eventType = isColorInput ? 'change' : 'blur';
            element.addEventListener(eventType, (e) => {
                let valueToSave = isColorInput ? e.target.value : e.target.textContent.trim();
                let success = false;
                
                if ((type === 'chords' || type === 'scales') && field === 'intervals') {
                    const intervalsArray = valueToSave.split(',').map(s => s.trim()).filter(Boolean);
                    if (intervalsArray.length > 0 && intervalsArray.every(int => this.musicTheory.intervals[int] || int === '1')) {
                        valueToSave = intervalsArray;
                        success = this.saveChange(type, id, field, valueToSave);
                        // Refresh tables as number of tones might have changed
                        this.populateGroupedTables(type); 
                    } else {
                        alert(`Invalid intervals for ${id}. Changes not saved.`);
                        e.target.textContent = this.musicTheory[type][id][field].join(',');
                    }
                } else {
                    success = this.saveChange(type, id, field, valueToSave);
                     if (isColorInput) {
                        e.target.nextElementSibling.textContent = valueToSave; // Update color text span
                    }
                }
                this.showFeedback(e.target.closest('td'), success);
            });

            if (!isColorInput) {
                element.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        e.target.blur();
                    }
                });
            }
        },

        makeTableSortable(table) {
            const thead = table.tHead;
            if (!thead) return;
            thead.querySelectorAll('th').forEach((header, index) => {
                header.classList.add('sortable');
                header.addEventListener('click', () => {
                    const isAsc = header.classList.contains('sort-asc');
                    thead.querySelectorAll('th').forEach(th => th.classList.remove('sort-asc', 'sort-desc'));
                    header.classList.toggle('sort-asc', !isAsc);
                    header.classList.toggle('sort-desc', isAsc);
                    this.sortTableByColumn(table, index, !isAsc);
                });
            });
        },

        sortTableByColumn(table, columnIndex, asc = true) {
            const tbody = table.tBodies[0];
            const rows = Array.from(tbody.rows);
            const dirModifier = asc ? 1 : -1;

            rows.sort((a, b) => {
                let aText = a.cells[columnIndex].textContent.trim();
                let bText = b.cells[columnIndex].textContent.trim();
                const isNumberColumn = !isNaN(parseFloat(aText)) && !isNaN(parseFloat(bText));
                
                if (isNumberColumn) {
                    return dirModifier * (parseFloat(aText) - parseFloat(bText));
                } else {
                    return dirModifier * aText.localeCompare(bText, undefined, { numeric: true });
                }
            });

            tbody.append(...rows);
        },

        initExportButtons() {
            document.getElementById('export-intervals-xlsx').addEventListener('click', () => {
                this.exportTableToXLSX('interval-table', 'Intervals', 'intervals_data.xlsx');
            });
            document.getElementById('export-all-chords-xlsx').addEventListener('click', () => {
                this.exportGroupedToXLSX('chords', 'all_chords_data.xlsx');
            });
             document.getElementById('export-all-scales-xlsx').addEventListener('click', () => {
                this.exportGroupedToXLSX('scales', 'all_scales_data.xlsx');
            });
        },

        exportTableToXLSX(tableId, sheetName, fileName) {
            const table = document.getElementById(tableId);
            if (!table) return;
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.table_to_sheet(table);
            XLSX.utils.book_append_sheet(wb, ws, sheetName);
            XLSX.writeFile(wb, fileName);
        },

        exportGroupedToXLSX(type, fileName) {
            const wb = XLSX.utils.book_new();
            const tables = document.querySelectorAll(`#${type}-tables-container .data-table`);
            tables.forEach(table => {
                const numTones = table.id.split('-').pop();
                let sheetName = `${numTones} Tone ${type.charAt(0).toUpperCase() + type.slice(1)}`;
                sheetName = sheetName.replace(/[:\\/?*[\]]/g, '').substring(0, 31);
                const ws = XLSX.utils.table_to_sheet(table);
                XLSX.utils.book_append_sheet(wb, ws, sheetName);
            });
            if (wb.SheetNames.length > 0) {
                XLSX.writeFile(wb, fileName);
            } else {
                alert(`No ${type} tables found to export.`);
            }
        },

        initResetButton() {
            document.getElementById('reset-data').addEventListener('click', () => {
                if (confirm('Are you sure you want to delete all custom changes and restore the default data? This action cannot be undone.')) {
                    localStorage.removeItem(this.LOCAL_STORAGE_KEY);
                    window.location.reload();
                }
            });
        }
    };
    
    DataEditor.init();
});