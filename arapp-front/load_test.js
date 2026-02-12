import http from 'k6/http';
import { check, sleep } from 'k6';


const FLASHCARD_IDS = [
    257, 255, 256, 258, 204, 153, 59, 1301, 1851, 1901,
    202, 1801, 1551, 1601, 1401, 1651, 259, 1151, 154,
    1351, 1451, 253, 1501, 1201, 252, 1751, 1251, 254,
    152, 205, 1701
];

export const options = {

    stages: [
        { duration: '20s', target: 39 },
        { duration: '60s', target: 150 },
        { duration: '10s', target: 0 },
    ],

    // thresholds: {
    //     http_req_failed: ['rate<0.01'],   // Mniej niż 1% błędów
    //     http_req_duration: ['p(95)<300'], // 95% zapytań poniżej 300ms
    // },
};

const BASE_URL = 'http://localhost:8080';

export function setup() {
    const loginUrl = `${BASE_URL}/api/auth/login`;

    const payload = JSON.stringify({
        email: 'galuszpl+123@gmail.com',
        password: '123',
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.post(loginUrl, payload, params);

    check(res, {
        'login successful': (r) => r.status === 200,
    });

    const jwtCookie = res.cookies.jwt[0].value;
    console.log(`Zalogowano pomyślnie. Token zdobyty!`);

    return { token: jwtCookie };
}


export default function (data) {

    const randomId = FLASHCARD_IDS[Math.floor(Math.random() * FLASHCARD_IDS.length)];

    // 3. Losujemy jakość (0-5)
    const randomQuality = Math.floor(Math.random() * 6);

    const protectedUrl = `${BASE_URL}/api/flashcards/review/${randomId}?quality=${randomQuality}`;


    // // const protectedUrl = `${BASE_URL}/api/chapters/published`;
    // const protectedUrl = `${BASE_URL}/api/lessons/2?includeFlashcardInfo=true`;
    // // const protectedUrl = `${BASE_URL}/api/lessons/1/details`;

    const params = {
        cookies: {
            jwt: data.token,
        },
    };

    // const res = http.get(protectedUrl, params);
    const res = http.post(protectedUrl, null, params);
    check(res, {
        'status is 200': (r) => r.status === 200,
    });

    sleep(1);
}