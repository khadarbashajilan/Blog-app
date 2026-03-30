import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BlogProvider } from './context/blogContext.tsx'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRMs5ld7iU1uUE-jJg_lyUcM7LsnZ1cJQ",
  authDomain: "blog-app-mern-45587.firebaseapp.com",
  projectId: "blog-app-mern-45587",
  storageBucket: "blog-app-mern-45587.firebasestorage.app",
  messagingSenderId: "859218607718",
  appId: "1:859218607718:web:ca895de284816cc11637a7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BlogProvider>
      <App />
    </BlogProvider>
  </StrictMode>,
)
