// index.html 메인 페이지 공지사항 로드

function initializeIndexPage() {
    // 공지사항 섹션 처리
    if (noticesData && noticesData.length > 0) {
        // ID 기준 내림차순 정렬 (최신 글이 위로)
        const sortedNotices = [...noticesData].sort((a, b) => b.id - a.id);

        // 최신 5개만 표시
        const recentNotices = sortedNotices.slice(0, 5);

        // 공지사항 목록 업데이트
        const noticeList = document.querySelector('.notice-list');
        if (noticeList) {
            noticeList.innerHTML = recentNotices.map(notice => `
                <li class="notice-item">
                    <span class="notice-badge ${notice.isNew ? 'new' : ''}">${notice.isNew ? 'NEW' : '공지'}</span>
                    <a href="community/notice-detail.html?id=${notice.id}" class="notice-title">${notice.title}</a>
                    <span class="notice-date">${notice.date}</span>
                </li>
            `).join('');
        }
    } else {
        console.warn('공지사항 데이터가 없습니다.');
        const noticeList = document.querySelector('.notice-list');
        if (noticeList) {
            noticeList.innerHTML = '<li class="notice-item" style="text-align: center; color: #999;">등록된 공지사항이 없습니다.</li>';
        }
    }

    // 뉴스 섹션 - newsData 사용 (외부 링크)
    if (newsData && newsData.length > 0) {
        const sortedNews = [...newsData].sort((a, b) => b.id - a.id);
        const recentNews = sortedNews.slice(0, 2);

        const newsGrid = document.querySelector('.news-grid');
        if (newsGrid) {
            newsGrid.innerHTML = recentNews.map(news => `
                <article class="news-card">
                    <div class="news-thumbnail">
                        <a href="${news.link}" target="_blank" rel="noopener noreferrer">
                            <img src="${news.thumbnail}" alt="${news.title}">
                        </a>
                    </div>
                    <div class="news-content">
                        <h3><a href="${news.link}" target="_blank" rel="noopener noreferrer">${news.title}</a></h3>
                        <p>${news.summary}</p>
                        <span class="news-date">${news.date}</span>
                    </div>
                </article>
            `).join('');
        }
    }
}

// 데이터 로드 완료 후 실행
window.addEventListener('dataLoaded', initializeIndexPage);
