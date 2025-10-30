// 공지사항 상세 페이지 스크립트

// URL에서 게시물 ID 가져오기
function getNoticeIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// 공지사항 상세 정보 로드
function loadNoticeDetail() {
    const noticeId = getNoticeIdFromURL();

    if (!noticeId) {
        displayError('잘못된 접근입니다.');
        return;
    }

    // noticesData는 data-loader.js에서 로드됨
    if (!noticesData || noticesData.length === 0) {
        displayError('공지사항 데이터를 불러올 수 없습니다.');
        return;
    }

    const notice = noticesData.find(n => n.id === parseInt(noticeId));

    if (!notice) {
        displayError('해당 공지사항을 찾을 수 없습니다.');
        return;
    }

    displayNoticeDetail(notice);
    updateViewCount(noticeId);
}

// 공지사항 상세 정보 표시
function displayNoticeDetail(notice) {
    document.getElementById('notice-title').textContent = notice.title;
    document.getElementById('notice-author').textContent = notice.author;
    document.getElementById('notice-date').textContent = notice.date;

    // 마크다운을 HTML로 변환
    const contentHtml = typeof marked !== 'undefined'
        ? marked.parse(notice.content)
        : notice.content.replace(/\n/g, '<br>');

    // 본문만 notice-content에 삽입
    document.getElementById('notice-content').innerHTML = contentHtml;

    // 기존 첨부파일 섹션 제거 (있다면)
    const existingAttachments = document.querySelector('.notice-attachments');
    if (existingAttachments) {
        existingAttachments.remove();
    }

    // 첨부파일이 있으면 목록 버튼 바로 위에 삽입
    if (notice.attachments && notice.attachments.length > 0) {
        const attachmentsHtml = `
            <div class="notice-attachments">
                <h3>📎 첨부파일</h3>
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

        // notice-detail-actions 요소 찾아서 그 앞에 첨부파일 섹션 삽입
        const actionsElement = document.querySelector('.notice-detail-actions');
        if (actionsElement) {
            actionsElement.insertAdjacentHTML('beforebegin', attachmentsHtml);
        }
    }

    // 페이지 제목 변경
    document.title = `${notice.title} - 산업AI 인재양성 부트캠프 사업단`;
}

// 에러 메시지 표시
function displayError(message) {
    document.getElementById('notice-title').textContent = '오류';
    document.getElementById('notice-author').textContent = '-';
    document.getElementById('notice-date').textContent = '-';
    document.getElementById('notice-content').innerHTML = `
        <div style="text-align: center; padding: 60px 20px; color: #999;">
            <p style="font-size: 1.2rem; margin-bottom: 20px;">${message}</p>
            <a href="notice.html" class="btn btn-primary">목록으로 돌아가기</a>
        </div>
    `;
}

// 조회수 업데이트 (실제로는 서버에서 처리해야 하지만, 여기서는 시뮬레이션)
function updateViewCount(noticeId) {
    // 실제 구현에서는 서버 API 호출로 조회수를 증가시켜야 합니다
    // 현재는 JSON 파일 기반이므로 실제 업데이트는 하지 않습니다
    console.log(`공지사항 ID ${noticeId}의 조회수가 증가했습니다.`);
}

// 데이터 로드 완료 후 실행
window.addEventListener('dataLoaded', loadNoticeDetail);
