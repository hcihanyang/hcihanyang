#!/bin/bash

# AWS S3 배포 스크립트 with Cache-Control 헤더 설정
# 사용법: ./deploy.sh

set -e

# 변수 설정
BUCKET_NAME="aibootcamp.hanyang.ac.kr"
PROFILE="default"  # AWS CLI profile (필요시 변경)

echo "======================================"
echo "산업AI 부트캠프 웹사이트 배포 시작"
echo "======================================"

# 1. 데이터 빌드
echo ""
echo "[1/5] 데이터 통합 중..."
node build-data.js

# 2. HTML 파일 업로드 (캐시 안함)
echo ""
echo "[2/5] HTML 파일 업로드 중..."
aws s3 sync . s3://${BUCKET_NAME}/ \
  --profile ${PROFILE} \
  --exclude "*" \
  --include "*.html" \
  --cache-control "no-cache, must-revalidate" \
  --acl public-read \
  --delete

# 3. CSS 파일 업로드 (5분 캐시)
echo ""
echo "[3/5] CSS 파일 업로드 중..."
aws s3 cp styles.css s3://${BUCKET_NAME}/styles.css \
  --profile ${PROFILE} \
  --cache-control "public, max-age=300, must-revalidate" \
  --acl public-read

# 4. JavaScript 파일 업로드 (10분 캐시)
echo ""
echo "[4/5] JavaScript 파일 업로드 중..."
aws s3 sync . s3://${BUCKET_NAME}/ \
  --profile ${PROFILE} \
  --exclude "*" \
  --include "*.js" \
  --exclude "node_modules/*" \
  --cache-control "public, max-age=600, must-revalidate" \
  --acl public-read \
  --delete

# 5. JSON 데이터 파일 업로드 (1분 캐시)
echo ""
echo "[5/5] 데이터 파일 업로드 중..."
aws s3 sync ./data s3://${BUCKET_NAME}/data/ \
  --profile ${PROFILE} \
  --exclude "*" \
  --include "*.json" \
  --cache-control "public, max-age=60, must-revalidate" \
  --acl public-read \
  --delete

# 6. 이미지 및 기타 자산 업로드 (1일 캐시)
echo ""
echo "[6/7] 이미지 및 자산 파일 업로드 중..."
aws s3 sync ./assets s3://${BUCKET_NAME}/assets/ \
  --profile ${PROFILE} \
  --cache-control "public, max-age=86400" \
  --acl public-read \
  --delete

# 7. 나머지 파일 업로드
echo ""
echo "[7/7] 나머지 파일 업로드 중..."
aws s3 sync . s3://${BUCKET_NAME}/ \
  --profile ${PROFILE} \
  --exclude "*.html" \
  --exclude "*.css" \
  --exclude "*.js" \
  --exclude "*.json" \
  --exclude "assets/*" \
  --exclude "node_modules/*" \
  --exclude ".git/*" \
  --exclude "deploy.sh" \
  --exclude "build-data.js" \
  --exclude "package*.json" \
  --exclude "README.md" \
  --exclude ".DS_Store" \
  --acl public-read \
  --delete

echo ""
echo "======================================"
echo "배포 완료!"
echo "======================================"
echo ""
echo "웹사이트: http://${BUCKET_NAME}.s3-website.ap-northeast-2.amazonaws.com/"
echo ""
echo "참고:"
echo "- HTML 파일: 캐시 안함 (항상 최신)"
echo "- CSS 파일: 5분 캐시"
echo "- JS 파일: 10분 캐시"
echo "- JSON 데이터: 1분 캐시"
echo "- 이미지: 1일 캐시"
echo ""
