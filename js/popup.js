// 팝업 관리 스크립트

(function() {
    // 오늘 날짜를 YYYY-MM-DD 형식으로 가져오기
    function getTodayDate() {
        const today = new Date();
        return today.toISOString().split('T')[0];
    }

    // 로컬 스토리지에서 팝업 숨김 여부 확인
    function shouldShowPopup() {
        const hideUntil = localStorage.getItem('popupHideUntil');
        if (!hideUntil) return true;

        const today = getTodayDate();
        return hideUntil < today;
    }

    // 팝업 표시
    function showPopup() {
        if (!shouldShowPopup()) {
            return;
        }

        const popupOverlay = document.getElementById('popup-overlay');
        if (popupOverlay) {
            // 약간의 지연 후 팝업 표시 (페이지 로드 후)
            setTimeout(() => {
                popupOverlay.classList.add('active');
            }, 500);
        }
    }

    // 팝업 닫기
    function closePopup() {
        const popupOverlay = document.getElementById('popup-overlay');
        const noShowCheckbox = document.getElementById('popup-no-show-today');

        if (popupOverlay) {
            popupOverlay.classList.remove('active');
        }

        // "오늘 하루 보지 않기" 체크되어 있으면 로컬 스토리지에 저장
        if (noShowCheckbox && noShowCheckbox.checked) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowDate = tomorrow.toISOString().split('T')[0];
            localStorage.setItem('popupHideUntil', tomorrowDate);
        }
    }

    // DOM 로드 완료 후 실행
    document.addEventListener('DOMContentLoaded', function() {
        const popupOverlay = document.getElementById('popup-overlay');
        const popupClose = document.getElementById('popup-close');

        if (!popupOverlay) return;

        // 팝업 표시
        showPopup();

        // 닫기 버튼 클릭
        if (popupClose) {
            popupClose.addEventListener('click', closePopup);
        }

        // 오버레이 클릭 시 닫기 (모달 외부 클릭)
        popupOverlay.addEventListener('click', function(e) {
            if (e.target === popupOverlay) {
                closePopup();
            }
        });

        // ESC 키로 닫기
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && popupOverlay.classList.contains('active')) {
                closePopup();
            }
        });
    });
})();
