# Uploads 폴더

이 폴더는 게시물에 첨부할 파일들(PDF, 이미지 등)을 저장하는 공간입니다.

## 사용 방법

1. 파일을 이 폴더에 업로드
2. 마크다운 파일에서 링크 추가:

```markdown
---
id: 1
title: "게시물 제목"
attachments:
  - name: "첨부파일.pdf"
    url: "/data/uploads/첨부파일.pdf"
---
```

또는 본문에 직접 링크:

```markdown
[다운로드: 첨부파일.pdf](/data/uploads/첨부파일.pdf)
```
