import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCof-tvVD_DaxBNPDamAqYJvFmnjYvhCtA",
  authDomain: "company-analysis-5b938.firebaseapp.com",
  projectId: "company-analysis-5b938",
  storageBucket: "company-analysis-5b938.appspot.com",
  messagingSenderId: "261790223359",
  appId: "1:261790223359:web:733de825db9a85d18335ca",
  measurementId: "G-09JPS9QKCF",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };
