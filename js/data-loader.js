// CMS에서 관리되는 데이터를 로드하는 스크립트
// build-data.js 스크립트가 빌드 시 통합 JSON 파일을 생성함

// News 데이터 로드
async function loadNewsData() {
    try {
        const timestamp = new Date().getTime();
        const response = await fetch(`/data/news-data.json?t=${timestamp}`);
        if (!response.ok) throw new Error('News 데이터 로드 실패');
        return await response.json();
    } catch (error) {
        console.error('News 데이터 로드 오류:', error);
        return [];
    }
}

// Events 데이터 로드
async function loadEventsData() {
    try {
        const timestamp = new Date().getTime();
        const response = await fetch(`/data/events-data.json?t=${timestamp}`);
        if (!response.ok) throw new Error('Events 데이터 로드 실패');
        return await response.json();
    } catch (error) {
        console.error('Events 데이터 로드 오류:', error);
        return [];
    }
}

// 갤러리 데이터 로드
async function loadGalleryData() {
    try {
        const timestamp = new Date().getTime();
        const response = await fetch(`/data/gallery-data.json?t=${timestamp}`);
        if (!response.ok) throw new Error('갤러리 데이터 로드 실패');
        return await response.json();
    } catch (error) {
        console.error('갤러리 데이터 로드 오류:', error);
        return [];
    }
}

// 전역 변수
let newsData = [];
let eventsData = [];
let galleryData = [];

// 데이터 초기화
async function initializeData() {
    newsData = await loadNewsData();
    eventsData = await loadEventsData();
    galleryData = await loadGalleryData();

    window.dispatchEvent(new CustomEvent('dataLoaded', {
        detail: { newsData, eventsData, galleryData }
    }));
}

// 페이지 로드 시 데이터 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeData);
} else {
    initializeData();
}
