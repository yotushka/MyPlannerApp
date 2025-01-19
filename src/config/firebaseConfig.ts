import { initializeApp } from "firebase/app";
// TODO: Додайте імпорти для інших Firebase SDK, якщо вони вам потрібні

// Конфігурація Firebase вашого проєкту
const firebaseConfig = {
  apiKey: "AIzaSyB6wby0pcnTXFlZ5du2Vk5E7DcsZsddWvg",
  authDomain: "myplannerapp-73346.firebaseapp.com",
  projectId: "myplannerapp-73346",
  storageBucket: "myplannerapp-73346.appspot.com",
  messagingSenderId: "362690762689",
  appId: "1:362690762689:web:c785353de71da002340140",
  measurementId: "G-7SDL58G13Z",
};

// Ініціалізуємо Firebase
const app = initializeApp(firebaseConfig);

export default app;
