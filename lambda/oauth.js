// Lambda에서는 node-fetch를 사용할 수 없으므로 https 모듈 사용
const https = require('https');

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

// HTTP 요청 헬퍼 함수
function httpsRequest(url, options, data) {
    return new Promise((resolve, reject) => {
        const req = https.request(url, options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    resolve(body);
                }
            });
        });
        req.on('error', reject);
        if (data) req.write(data);
        req.end();
    });
}

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));

    const { httpMethod, queryStringParameters, rawPath, path } = event;
    const requestPath = rawPath || path || '';

    // CORS 헤더
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };

    // 환경 변수 확인
    if (!CLIENT_ID || !CLIENT_SECRET) {
        console.error('Missing environment variables');
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Server configuration error',
                message: 'Missing GitHub OAuth credentials'
            })
        };
    }

    // OPTIONS 요청 (CORS preflight)
    if (httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // /auth 경로: GitHub OAuth 인증 시작
    if (requestPath.endsWith('/auth')) {
        const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo,user`;

        return {
            statusCode: 302,
            headers: {
                ...headers,
                'Location': redirectUrl
            },
            body: ''
        };
    }

    // /callback 경로: GitHub OAuth 콜백 처리
    if (requestPath.endsWith('/callback') && queryStringParameters?.code) {
        const code = queryStringParameters.code;

        try {
            console.log('Processing OAuth callback with code');

            // GitHub에서 액세스 토큰 받기
            const postData = JSON.stringify({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code: code
            });

            const tokenData = await httpsRequest(
                'https://github.com/login/oauth/access_token',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Content-Length': postData.length
                    }
                },
                postData
            );

            console.log('Token response:', tokenData);

            if (tokenData.error) {
                throw new Error(tokenData.error_description || tokenData.error);
            }

            if (!tokenData.access_token) {
                throw new Error('No access token received from GitHub');
            }

            // 성공 페이지 (Decap CMS에 토큰 전달)
            // Decap CMS는 content-type이 text/html인 응답에서 postMessage를 기대함
            const successHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Authentication Complete</title>
    <script>
        (function() {
            // Decap CMS 인증 프로토콜
            function receiveMessage(e) {
                console.log("Received message from parent:", e.data);
                // 부모로부터 메시지를 받으면 토큰 전송
                window.opener.postMessage(
                    'authorization:github:success:' + JSON.stringify({
                        token: "${tokenData.access_token}",
                        provider: "github"
                    }),
                    e.origin
                );
                window.removeEventListener("message", receiveMessage, false);
            }

            window.addEventListener("message", receiveMessage, false);

            // 1. 먼저 준비 신호 보내기
            window.opener.postMessage("authorizing:github", "*");

            // 2. 일정 시간 후에도 응답이 없으면 강제로 토큰 전송
            setTimeout(function() {
                console.log("Timeout: sending token anyway");
                window.opener.postMessage(
                    'authorization:github:success:' + JSON.stringify({
                        token: "${tokenData.access_token}",
                        provider: "github"
                    }),
                    "*"
                );
            }, 100);

            // 3. 1초 후 창 닫기
            setTimeout(function() {
                window.close();
            }, 1000);
        })();
    </script>
</head>
<body>
    <p>Authorizing...</p>
</body>
</html>
            `;

            return {
                statusCode: 200,
                headers: {
                    ...headers,
                    'Content-Type': 'text/html; charset=utf-8'
                },
                body: successHtml
            };

        } catch (error) {
            console.error('OAuth error:', error);

            return {
                statusCode: 500,
                headers: {
                    ...headers,
                    'Content-Type': 'text/html; charset=utf-8'
                },
                body: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>인증 실패</title>
                        <meta charset="UTF-8">
                    </head>
                    <body>
                        <h1>인증 실패</h1>
                        <p>${error.message}</p>
                        <p><a href="javascript:window.close()">창 닫기</a></p>
                    </body>
                    </html>
                `
            };
        }
    }

    // 기본 응답
    return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
            error: 'Not Found',
            path: requestPath,
            message: 'Use /auth to start authentication or /callback for OAuth callback'
        })
    };
};
