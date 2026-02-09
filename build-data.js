#!/usr/bin/env node

// CMS의 개별 JSON/MD 파일들을 통합 JSON 파일로 병합하는 빌드 스크립트

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// 디렉토리의 모든 JSON 및 MD 파일 읽기
function readAllDataFiles(dir) {
    if (!fs.existsSync(dir)) {
        console.warn(`디렉토리가 존재하지 않습니다: ${dir}`);
        return [];
    }

    const files = fs.readdirSync(dir);
    const allData = [];

    files.forEach(file => {
        const ext = path.extname(file);

        if (ext === '.json') {
            // JSON 파일 처리
            try {
                const filePath = path.join(dir, file);
                const content = fs.readFileSync(filePath, 'utf-8');
                const data = JSON.parse(content);
                allData.push(data);
            } catch (error) {
                console.error(`JSON 파일 읽기 실패: ${file}`, error.message);
            }
        } else if (ext === '.md') {
            // Markdown 파일 처리
            try {
                const filePath = path.join(dir, file);
                const content = fs.readFileSync(filePath, 'utf-8');
                const { data, content: markdownContent } = matter(content);

                // frontmatter의 데이터와 본문 병합
                const postData = {
                    ...data,
                    content: markdownContent.trim()
                };

                // summary가 없으면 content를 summary로 사용 (뉴스용)
                if (!postData.summary && postData.content) {
                    postData.summary = postData.content;
                }

                allData.push(postData);
            } catch (error) {
                console.error(`MD 파일 읽기 실패: ${file}`, error.message);
            }
        }
    });

    return allData;
}

// 뉴스 데이터 통합
console.log('뉴스 데이터 통합 중...');
const newsDir = path.join(__dirname, 'data', 'news');
const newsData = readAllDataFiles(newsDir);

// ID로 정렬 (최신순)
newsData.sort((a, b) => b.id - a.id);

const newsOutputPath = path.join(__dirname, 'data', 'news-data.json');
fs.writeFileSync(newsOutputPath, JSON.stringify(newsData, null, 2));
console.log(`✓ 뉴스 ${newsData.length}개 통합 완료: ${newsOutputPath}`);

// 공지사항 데이터 통합
console.log('공지사항 데이터 통합 중...');
const noticesDir = path.join(__dirname, 'data', 'notices');
const noticesData = readAllDataFiles(noticesDir);

// ID로 정렬 (최신순)
noticesData.sort((a, b) => b.id - a.id);

const noticesOutputPath = path.join(__dirname, 'data', 'notices-data.json');
fs.writeFileSync(noticesOutputPath, JSON.stringify(noticesData, null, 2));
console.log(`✓ 공지사항 ${noticesData.length}개 통합 완료: ${noticesOutputPath}`);

// 갤러리 데이터 통합
console.log('갤러리 데이터 통합 중...');
const galleryDir = path.join(__dirname, 'data', 'gallery');
const galleryData = readAllDataFiles(galleryDir);

// ID로 정렬 (최신순)
galleryData.sort((a, b) => b.id - a.id);

const galleryOutputPath = path.join(__dirname, 'data', 'gallery-data.json');
fs.writeFileSync(galleryOutputPath, JSON.stringify(galleryData, null, 2));
console.log(`✓ 갤러리 ${galleryData.length}개 통합 완료: ${galleryOutputPath}`);

console.log('\n빌드 완료!');
