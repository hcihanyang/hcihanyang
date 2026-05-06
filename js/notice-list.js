// News 목록 페이지 스크립트

const itemsPerPage = 10;
let currentPage = 1;

function loadNotices() {
    if (!newsData || newsData.length === 0) {
        document.getElementById('notice-list').innerHTML = `
            <div class="notice-row" style="display: block; text-align: center; padding: 40px; color: #999; grid-column: 1 / -1;">
                No news registered yet.
            </div>
        `;
        return;
    }

    newsData.sort((a, b) => b.id - a.id);
    displayNotices(currentPage);
    displayPagination();
}

function displayNotices(page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = newsData.slice(startIndex, endIndex);

    const container = document.getElementById('notice-list');

    if (pageItems.length === 0) {
        container.innerHTML = `
            <div class="notice-row" style="display: block; text-align: center; padding: 40px; color: #999; grid-column: 1 / -1;">
                No news registered yet.
            </div>
        `;
        return;
    }

    container.innerHTML = pageItems.map(item => `
        <div class="notice-row">
            <div class="notice-num">
                ${item.isNew ? '<span class="badge-new">NEW</span>' : item.id}
            </div>
            <div class="notice-subject">
                <a href="notice-detail.html?id=${item.id}">${item.title}</a>
            </div>
            <div class="notice-author">${item.author}</div>
            <div class="notice-date-col">${item.date}</div>
        </div>
    `).join('');
}

function displayPagination() {
    const totalPages = Math.ceil(newsData.length / itemsPerPage);
    const container = document.getElementById('pagination');

    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let html = '';

    if (currentPage > 1)
        html += `<a href="#" onclick="changePage(${currentPage - 1}); return false;">&laquo;</a>`;

    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    for (let i = startPage; i <= endPage; i++) {
        html += `<a href="#" class="${i === currentPage ? 'active' : ''}" onclick="changePage(${i}); return false;">${i}</a>`;
    }

    if (currentPage < totalPages)
        html += `<a href="#" onclick="changePage(${currentPage + 1}); return false;">&raquo;</a>`;

    container.innerHTML = html;
}

function changePage(page) {
    currentPage = page;
    displayNotices(currentPage);
    displayPagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('dataLoaded', loadNotices);
