# HY HCI Group 웹사이트

한양대학교 HY HCI Group 공식 웹사이트입니다.

## 콘텐츠 관리 방법

### 공지사항 추가하기

1. `data/notices/` 폴더에 새로운 JSON 파일을 추가합니다.
   - 파일명 형식: `YYYY-MM-DD-notice-숫자.json`
   - 예시: `2025-10-30-notice-1.json`

2. JSON 파일 형식:
   ```json
   {
     "id": 1,
     "title": "공지사항 제목",
     "author": "작성자",
     "date": "2025.10.30",
     "thumbnail": "/images/thumbnail.jpg",
     "summary": "간단한 요약",
     "content": "상세 내용 (Markdown 지원)",
     "link": ""
   }
   ```

3. 데이터 동기화:
   ```bash
   # 방법 1: npm 명령어 사용
   npm run sync

   # 방법 2: 쉘 스크립트 사용
   ./sync-data.sh

   # 방법 3: 직접 실행
   node build-data.js
   ```

4. 웹사이트를 새로고침하면 새로운 공지사항이 표시됩니다.

### 뉴스/보도자료 추가하기

1. `data/news/` 폴더에 새로운 JSON 파일을 추가합니다.
   - 파일명 형식: `YYYY-MM-DD-news-숫자.json`

2. JSON 파일 형식은 공지사항과 동일합니다.

3. 데이터 동기화 명령어를 실행합니다.

## 중요!

**개별 JSON 파일만 관리하세요!**
- `data/notices/` 또는 `data/news/` 폴더에 파일을 추가/수정/삭제만 하세요.
- `notices-data.json`과 `news-data.json` 파일은 자동으로 생성됩니다.
- 동기화 명령어를 실행하면 자동으로 통합 파일이 업데이트됩니다.