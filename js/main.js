//ログインページの実装

//--------------------- 以下Firebase--------------------- //

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js"; //ver.合わせる！

import { getDatabase, ref, push, set, onChildAdded, remove,onChildRemoved, serverTimestamp}               //ver.合わせる！
from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";

import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged}               //ver.合わせる！
from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";


// Your web app's Firebase configuration
const firebaseConfig = { 
  apiKey: "AIzaSyChxU8kuWHwcRO6xHdX-Duy47a_4LO2j70",
  authDomain: "kadai4chat-44f1c.firebaseapp.com",
  databaseURL: "https://kadai4chat-44f1c-default-rtdb.firebaseio.com",
  projectId: "kadai4chat-44f1c",
  storageBucket: "kadai4chat-44f1c.appspot.com",
  messagingSenderId: "327560358192",
  appId: "1:327560358192:web:292e0ab88067fdcab6c0f5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


//---------------------googleauth(認証用)--------------------- //
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
const auth = getAuth();


//--------------------- ログイン--------------------- //
  //新規登録処理
  // register.addEventListener('click', function(e) {
  //   var mailAddress = document.getElementById('mailAddress').value;
  //   var password = document.getElementById('password').value;
    
  //   firebase.auth().createUserWithEmailAndPassword(mailAddress, password)
  //   .catch(function(error) {
  //     alert('登録できません（' + error.message + '）');
  //   });
  // });

//-----google-----//
  $("#login").on("click",function(){
    //Google認証完了後の処理
    signInWithPopup(auth, provider).then((result) => {
        //Login後のページ遷移
        location.href="index.html";  
    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
    });
});