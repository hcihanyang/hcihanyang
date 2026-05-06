// News 상세 페이지 스크립트

function getNoticeIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

function loadNoticeDetail() {
    const noticeId = getNoticeIdFromURL();

    if (!noticeId) {
        displayError('Invalid access.');
        return;
    }

    if (!newsData || newsData.length === 0) {
        displayError('Could not load news data.');
        return;
    }

    const notice = newsData.find(n => n.id === parseInt(noticeId));

    if (!notice) {
        displayError('This news item could not be found.');
        return;
    }

    displayNoticeDetail(notice);
}

function displayNoticeDetail(notice) {
    document.getElementById('notice-title').textContent = notice.title;
    document.getElementById('notice-author').textContent = notice.author;
    document.getElementById('notice-date').textContent = notice.date;

    const contentHtml = typeof marked !== 'undefined'
        ? marked.parse(notice.content)
        : notice.content.replace(/\n/g, '<br>');

    document.getElementById('notice-content').innerHTML = contentHtml;

    const existingAttachments = document.querySelector('.notice-attachments');
    if (existingAttachments) existingAttachments.remove();

    if (notice.attachments && notice.attachments.length > 0) {
        const attachmentsHtml = `
            <div class="notice-attachments">
                <h3>📎 Attachments</h3>
                <ul class="attachment-list">
                    ${notice.attachments.map(file => `
                        <li class="attachment-item">
                            <a href="${file.url}" target="_blank" rel="noopener noreferrer" download>
                                <span class="file-icon">📄</span>
                                <span class="file-name">${file.name}</span>
                            </a>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
        const actionsElement = document.querySelector('.notice-detail-actions');
        if (actionsElement) actionsElement.insertAdjacentHTML('beforebegin', attachmentsHtml);
    }

    document.title = `${notice.title} - HY HCI Group`;
}

function displayError(message) {
    document.getElementById('notice-title').textContent = 'Error';
    document.getElementById('notice-author').textContent = '-';
    document.getElementById('notice-date').textContent = '-';
    document.getElementById('notice-content').innerHTML = `
        <div style="text-align: center; padding: 60px 20px; color: #999;">
            <p style="font-size: 1.2rem; margin-bottom: 20px;">${message}</p>
            <a href="notice.html" class="btn btn-primary">Back to List</a>
        </div>
    `;
}

window.addEventListener('dataLoaded', loadNoticeDetail);
