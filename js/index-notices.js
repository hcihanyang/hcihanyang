// index.html 메인 페이지 탭 섹션 렌더링

function initializeIndexPage() {
    // ── News ──
    const newsList = document.getElementById('home-news-list');
    if (newsList) {
        if (newsData && newsData.length > 0) {
            const sorted = [...newsData].sort((a, b) => b.id - a.id).slice(0, 5);
            newsList.innerHTML = sorted.map(n => `
                <li class="home-notice-item">
                    <span class="notice-badge ${n.isNew ? 'new' : ''}">${n.isNew ? 'NEW' : 'Notice'}</span>
                    <a href="community/notice-detail.html?id=${n.id}" class="notice-title">${n.title}</a>
                    <span class="notice-date">${n.date}</span>
                </li>
            `).join('');
        } else {
            newsList.innerHTML = '<li class="home-notice-item" style="color:#999;justify-content:center;">No news yet.</li>';
        }
    }

    // ── Events ──
    const eventsList = document.getElementById('home-events-list');
    if (eventsList) {
        if (eventsData && eventsData.length > 0) {
            const sorted = [...eventsData].sort((a, b) => b.id - a.id).slice(0, 5);
            eventsList.innerHTML = sorted.map(n => `
                <li class="home-notice-item">
                    <span class="notice-badge ${n.isNew ? 'new' : ''}">Event</span>
                    <a href="community/news-detail.html?id=${n.id}" class="notice-title">${n.title}</a>
                    <span class="notice-date">${n.date}</span>
                </li>
            `).join('');
        } else {
            eventsList.innerHTML = '<li class="home-notice-item" style="color:#999;justify-content:center;">No events yet.</li>';
        }
    }

    // ── Gallery ──
    const galleryGrid = document.getElementById('home-gallery-grid');
    if (galleryGrid) {
        if (galleryData && galleryData.length > 0) {
            const sorted = [...galleryData].sort((a, b) => b.id - a.id).slice(0, 3);
            galleryGrid.innerHTML = sorted.map(g => `
                <div class="home-gallery-item">
                    <img src="${g.thumbnail}" alt="${g.title}" loading="lazy">
                </div>
            `).join('');
        } else {
            galleryGrid.innerHTML = '<p style="color:#999;grid-column:1/-1;text-align:center;padding:40px 0;">No gallery items yet.</p>';
        }
    }
}

window.addEventListener('dataLoaded', initializeIndexPage);
