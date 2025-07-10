// Firebase 관련 모듈들을 가져옵니다.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyCIdDH-9l80GCu_PRz7LPyQmKvcIL6nPyg",
  authDomain: "team-h20.firebaseapp.com",
  projectId: "team-h20",
  storageBucket: "team-h20.appspot.com",
  messagingSenderId: "845558888214",
  appId: "1:845558888214:web:73959e7ab377fd03620237",
  measurementId: "G-KZ1MQMH2EK",
};

// Firebase 앱 초기화 및 주요 서비스 내보내기
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
