// Events 리스트 관리
let currentPage = 1;
const itemsPerPage = 5;

window.addEventListener('dataLoaded', function() {
    loadEvents();
});

function loadEvents() {
    if (!eventsData || eventsData.length === 0) {
        const container = document.getElementById('news-list');
        if (container) {
            container.innerHTML = '<p style="text-align: center; padding: 40px 0;">No events found.</p>';
        }
        return;
    }

    const sorted = [...eventsData].sort((a, b) => b.id - a.id);
    displayEvents(currentPage, sorted);
    displayPagination(sorted);
}

function displayEvents(page, sorted) {
    const container = document.getElementById('news-list');
    if (!container) return;

    const startIndex = (page - 1) * itemsPerPage;
    const pageItems = sorted.slice(startIndex, startIndex + itemsPerPage);

    if (pageItems.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 40px 0;">No events found.</p>';
        return;
    }

    container.innerHTML = pageItems.map(item => `
        <article class="news-item-page">
            <div class="news-thumbnail">
                <a href="${item.link}" target="_blank" rel="noopener noreferrer">
                    <img src="${item.thumbnail}" alt="${item.title}">
                </a>
            </div>
            <div class="news-info">
                <h3><a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.title}</a></h3>
                <p class="news-summary">${item.summary}</p>
                <div class="news-meta">
                    <span class="news-date">${item.date}</span>
                    <span class="news-author">Source: ${item.author}</span>
                </div>
            </div>
        </article>
    `).join('');
}

function displayPagination(sorted) {
    const container = document.getElementById('news-pagination');
    if (!container) return;

    const totalPages = Math.ceil(sorted.length / itemsPerPage);
    if (totalPages <= 1) { container.innerHTML = ''; return; }

    let html = '';
    if (currentPage > 1)
        html += `<button class="page-btn" onclick="changePage(${currentPage - 1})">이전</button>`;
    for (let i = 1; i <= totalPages; i++)
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
    if (currentPage < totalPages)
        html += `<button class="page-btn" onclick="changePage(${currentPage + 1})">다음</button>`;

    container.innerHTML = html;
}

function changePage(page) {
    currentPage = page;
    const sorted = [...eventsData].sort((a, b) => b.id - a.id);
    displayEvents(currentPage, sorted);
    displayPagination(sorted);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
