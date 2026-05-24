// Leaderboards page — dynamically built from JSON files
document.addEventListener('DOMContentLoaded', function () {
    const MAX_RANKS = 10;

    const maps = [
        { id: 'acres_fields', file: 'leaderboards/acres_fields.json' },
        { id: 'beta_center', file: 'leaderboards/beta_center.json' }
    ];

    const categoryNames = {
        'best_lap': 'Best Lap'
    };

    const rankClasses = { 1: 'gold', 2: 'silver', 3: 'bronze' };

    const container = document.getElementById('leaderboards-container');

    function buildRow(rank, entry) {
        const cls = rankClasses[rank] ? ` ${rankClasses[rank]}` : '';
        if (entry) {
            return `<tr>
                <td class="lb-rank-cell"><span class="rank-badge${cls}">${rank}</span></td>
                <td>${entry.player}</td>
                <td class="lb-time">${entry.time}</td>
                <td>${entry.car}</td>
                <td>${entry.date}</td>
            </tr>`;
        }
        return `<tr>
            <td class="lb-rank-cell"><span class="rank-badge${cls}">${rank}</span></td>
            <td class="lb-empty">\u2014</td>
            <td class="lb-time lb-empty">\u2014</td>
            <td class="lb-empty">\u2014</td>
            <td class="lb-empty">\u2014</td>
        </tr>`;
    }

    function buildTable(entries) {
        const lookup = {};
        if (entries) {
            entries.forEach(e => { lookup[e.rank] = e; });
        }
        let rows = '';
        for (let i = 1; i <= MAX_RANKS; i++) {
            rows += buildRow(i, lookup[i] || null);
        }
        return `<table class="leaderboard-table">
            <thead>
                <tr>
                    <th class="lb-rank-cell">Rank</th>
                    <th>Player</th>
                    <th>Time</th>
                    <th>Car</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>`;
    }

    function buildModeAccordion(categoryId, entries) {
        const name = categoryNames[categoryId] || categoryId;
        return `<div class="mode-accordion">
            <button class="mode-accordion-toggle">
                <span>${name}</span>
                <span class="accordion-icon">+</span>
            </button>
            <div class="mode-accordion-content">
                ${buildTable(entries)}
            </div>
        </div>`;
    }

    function buildMapAccordion(id, data) {
        let modesHtml = '';
        for (const catId of Object.keys(categoryNames)) {
            modesHtml += buildModeAccordion(catId, data.categories[catId] || []);
        }
        return `<div class="map-accordion active" id="${id}">
            <button class="map-accordion-toggle">
                <span class="map-accordion-title">${data.map_name}</span>
                <span class="accordion-icon">+</span>
            </button>
            <div class="map-accordion-content">
                ${modesHtml}
            </div>
        </div>`;
    }

    function bindAccordions() {
        document.querySelectorAll('.map-accordion-toggle').forEach(toggle => {
            toggle.addEventListener('click', () => {
                toggle.closest('.map-accordion').classList.toggle('active');
            });
        });
        document.querySelectorAll('.mode-accordion-toggle').forEach(toggle => {
            toggle.addEventListener('click', () => {
                toggle.closest('.mode-accordion').classList.toggle('active');
            });
        });
    }

    Promise.all(maps.map(m =>
        fetch(m.file)
            .then(r => r.json())
            .then(data => ({ id: m.id, data }))
    )).then(results => {
        results.forEach(({ id, data }) => {
            container.insertAdjacentHTML('beforeend', buildMapAccordion(id, data));
        });
        bindAccordions();
    });
});
