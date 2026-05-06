function loadNewsDetail() {
    const id = parseInt(new URLSearchParams(window.location.search).get('id'));

    if (!id || !eventsData || eventsData.length === 0) {
        showError('Content not found.');
        return;
    }

    const item = eventsData.find(n => n.id === id);
    if (!item) { showError('This item could not be found.'); return; }

    document.getElementById('notice-title').textContent = item.title;
    document.getElementById('notice-author').textContent = item.author || 'Admin';
    document.getElementById('notice-date').textContent = item.date;

    const html = typeof marked !== 'undefined'
        ? marked.parse(item.content)
        : item.content.replace(/\n/g, '<br>');
    document.getElementById('notice-content').innerHTML = html;
    document.title = `${item.title} - HY HCI Group`;
}

function showError(msg) {
    document.getElementById('notice-title').textContent = 'Error';
    document.getElementById('notice-content').innerHTML =
        `<div style="text-align:center;padding:60px 20px;color:#999;">${msg}</div>`;
}

window.addEventListener('dataLoaded', loadNewsDetail);
