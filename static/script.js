(() => {
    'use strict';

    // ── State ──────────────────────────────────────────────────────────────
    let selectedMovie = null;
    let activeIndex   = -1;
    let allMovies     = [];

    // ── DOM refs ───────────────────────────────────────────────────────────
    const searchInput      = document.getElementById('movie-search');
    const dropdown         = document.getElementById('dropdown-list');
    const pillContainer    = document.getElementById('selected-pill-container');
    const recommendBtn     = document.getElementById('recommend-btn');
    const resultsSection   = document.getElementById('results-section');
    const moviesGrid       = document.getElementById('movies-grid');
    const loader           = document.getElementById('loader');
    const likedMovieName   = document.getElementById('liked-movie-name');
    const resultsBadge     = document.getElementById('results-count-badge');

    // ── Bootstrap data ─────────────────────────────────────────────────────
    try {
        const raw = document.getElementById('movies-data').textContent;
        allMovies = JSON.parse(raw) || [];
    } catch (e) {
        console.warn('Could not parse movie list:', e);
    }

    // ── Helpers ────────────────────────────────────────────────────────────
    function escapeHtml(str) {
        return str.replace(/[&<>"']/g, m => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[m]));
    }

    function highlightMatch(title, query) {
        if (!query) return escapeHtml(title);
        const idx  = title.toLowerCase().indexOf(query.toLowerCase());
        if (idx === -1) return escapeHtml(title);
        return escapeHtml(title.slice(0, idx))
            + '<mark>' + escapeHtml(title.slice(idx, idx + query.length)) + '</mark>'
            + escapeHtml(title.slice(idx + query.length));
    }

    function closeDropdown() {
        dropdown.classList.remove('open');
        dropdown.innerHTML = '';
        activeIndex = -1;
    }

    // ── Autocomplete ───────────────────────────────────────────────────────
    function renderDropdown(query) {
        if (!query || query.length < 1) { closeDropdown(); return; }

        const matches = allMovies
            .filter(m => m.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 8);

        if (matches.length === 0) { closeDropdown(); return; }

        dropdown.innerHTML = matches
            .map((m, i) =>
                `<li class="dropdown__item" role="option" data-index="${i}" data-value="${escapeHtml(m)}">
                    ${highlightMatch(m, query)}
                </li>`)
            .join('');

        dropdown.classList.add('open');
        activeIndex = -1;
    }

    // ── Keyboard navigation ────────────────────────────────────────────────
    searchInput.addEventListener('keydown', e => {
        const items = dropdown.querySelectorAll('.dropdown__item');
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            activeIndex = Math.min(activeIndex + 1, items.length - 1);
            highlightItem(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeIndex = Math.max(activeIndex - 1, 0);
            highlightItem(items);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeIndex >= 0 && items[activeIndex]) {
                selectMovie(items[activeIndex].dataset.value);
            } else if (dropdown.classList.contains('open') && items.length > 0) {
                selectMovie(items[0].dataset.value);
            }
        } else if (e.key === 'Escape') {
            closeDropdown();
        }
    });

    function highlightItem(items) {
        items.forEach(el => el.classList.remove('active'));
        if (items[activeIndex]) {
            items[activeIndex].classList.add('active');
            items[activeIndex].scrollIntoView({ block: 'nearest' });
        }
    }

    // ── Input event ────────────────────────────────────────────────────────
    searchInput.addEventListener('input', () => {
        renderDropdown(searchInput.value.trim());
    });

    // ── Dropdown click ─────────────────────────────────────────────────────
    dropdown.addEventListener('click', e => {
        const item = e.target.closest('.dropdown__item');
        if (item) selectMovie(item.dataset.value);
    });

    // ── Outside click ──────────────────────────────────────────────────────
    document.addEventListener('click', e => {
        if (!e.target.closest('#input-wrapper')) closeDropdown();
    });

    // ── Select a movie ─────────────────────────────────────────────────────
    function selectMovie(title) {
        selectedMovie = title;
        searchInput.value = title;
        closeDropdown();
        renderPill(title);
        recommendBtn.disabled = false;
        recommendBtn.focus();
    }

    // ── Pill ───────────────────────────────────────────────────────────────
    function renderPill(title) {
        pillContainer.innerHTML = `
            <div class="movie-pill">
                <span class="movie-pill__icon">🎬</span>
                <span>${escapeHtml(title)}</span>
                <button class="pill-remove" id="pill-remove-btn" aria-label="Remove ${escapeHtml(title)}" title="Clear selection">✕</button>
            </div>`;

        document.getElementById('pill-remove-btn').addEventListener('click', () => {
            clearSelection();
        });
    }

    function clearSelection() {
        selectedMovie = null;
        searchInput.value = '';
        pillContainer.innerHTML = '';
        recommendBtn.disabled = true;
        searchInput.focus();
    }

    // ── Recommend ─────────────────────────────────────────────────────────
    recommendBtn.addEventListener('click', () => {
        if (!selectedMovie) return;
        fetchRecommendations(selectedMovie);
    });

    function fetchRecommendations(movie) {
        // Show results section, show loader
        resultsSection.classList.remove('hidden');
        loader.classList.remove('hidden');
        moviesGrid.innerHTML = '';
        likedMovieName.textContent = movie;
        resultsBadge.textContent   = '5 movies';

        // Smooth scroll to results
        setTimeout(() => {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);

        fetch('/recommend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `movie=${encodeURIComponent(movie)}`
        })
        .then(res => res.json())
        .then(data => {
            loader.classList.add('hidden');
            if (data.error) { showError(data.error); return; }
            renderCards(data.recommendations || []);
        })
        .catch(() => {
            loader.classList.add('hidden');
            showError('An error occurred. Please try again.');
        });
    }

    // ── Render Cards ───────────────────────────────────────────────────────
    const RANK_LABELS = ['#1 Best Match', '#2 Top Pick', '#3 Recommended', '#4 You May Like', '#5 Also Great'];
    const STAR_COUNTS = [5, 5, 4, 4, 4]; // visual star ratings per rank

    function buildStars(count) {
        return Array.from({ length: 5 }, (_, i) =>
            `<span class="star${i < count ? ' star--filled' : ''}">★</span>`
        ).join('');
    }

    function renderCards(recs) {
        resultsBadge.textContent = `${recs.length} movie${recs.length !== 1 ? 's' : ''}`;

        if (recs.length === 0) {
            moviesGrid.innerHTML = '<p class="empty-state">No recommendations found yet. Try a different movie.</p>';
            return;
        }

        moviesGrid.innerHTML = recs.map((rec, i) => `
            <article class="movie-card" style="animation-delay:${i * 0.09}s">
                <div class="card__poster-wrap">
                    <img
                        src="${escapeHtml(rec.poster)}"
                        alt="${escapeHtml(rec.title)} poster"
                        class="card__poster"
                        loading="lazy"
                        onerror="this.onerror=null;this.src='https://placehold.co/300x450/1a1d27/555e72?text=No+Poster';"
                    >
                    <div class="card__poster-overlay">
                        <span class="card__rank-badge">${i + 1}</span>
                    </div>
                </div>
                <div class="card__body">
                    <p class="card__rank">${RANK_LABELS[i] ?? `#${i + 1}`}</p>
                    <h3 class="card__title">${escapeHtml(rec.title)}</h3>
                    <div class="card__stars" aria-label="${STAR_COUNTS[i]} out of 5 stars">
                        ${buildStars(STAR_COUNTS[i])}
                    </div>
                </div>
            </article>
        `).join('');
    }

    function showError(msg) {
        moviesGrid.innerHTML = `<p class="empty-state">${escapeHtml(msg)}</p>`;
    }

})();
