// チャット自分+相手のアイコンを入れる
// 画像を送付できるようにする
// 名前を入れるコンポーネント
// データが更新される
// slackを再現？（決まった時間を検索してとってくる）
// bot機能を入れる
// 新しいメッセージは下に入れる
// キャラクターがふわふわ浮かんでそこから吹き出しが出るようにする
// eキーで送信できるようにする ⇒ OK!!
// メッセージを消す機能
// 名前+日時+メッセージ
// overflow:autoでスクロール
// アイコン選択？
// 翻訳（英語・韓国語とか）transraterAPI
// MAP連携(緯度経度を取得)
// canvas（一緒に絵を書く）⇒保存で画像保存をする

// 4秒経ったらコメントの表示が消える
// 自分のキャラクターが行きたい場所に動いてくれる



// 11/17に完了すること！
//ログインページ
//時間の取得            ⇒OK!!
//消す操作              ⇒OK!!
//文字を両端に寄せる！  ⇒OK!!


//--------------------- 以下Firebase--------------------- //

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js"; //ver.合わせる！
import { getDatabase, ref, push, set, onChildAdded, remove,onChildRemoved, serverTimestamp}               //ver.合わせる！
from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";

import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChxU8kuWHwcRO6xHdX-Duy47a_4LO2j70",
  authDomain: "kadai4chat-44f1c.firebaseapp.com",
  projectId: "kadai4chat-44f1c",
  storageBucket: "kadai4chat-44f1c.appspot.com",
  messagingSenderId: "327560358192",
  appId: "1:327560358192:web:292e0ab88067fdcab6c0f5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// //--------------------- ログインページ--------------------- //
//   //新規登録処理
//   register.addEventListener('click', function(e) {
//     var mailAddress = document.getElementById('mailAddress').value;
//     var password = document.getElementById('password').value;
    
//     firebase.auth().createUserWithEmailAndPassword(mailAddress, password)
//     .catch(function(error) {
//       alert('登録できません（' + error.message + '）');
//     });
//   });



// --リアルタイム接続---//
// let newPostRef = firebase.database().ref(); //山崎先生の動画ではあったけど無くてもいける・・？ 


//------------loginしたら動く--------------------//
// onAuthStateChanged(auth, (user) => {
//   if (user) {
//       // User is signed in, see docs for a list of available properties
//       // https://firebase.google.com/docs/reference/js/firebase.User
//       const uid = user.uid;
//       //ユーザー情報取得できます
//       if (user !== null) {
//           user.providerData.forEach((profile) => {
//               //Login情報取得
//               $("#uname").text(profile.displayName);
//               // $("#prof").attr("src",profile.photoURL);
//               // console.log("Sign-in provider: " + profile.providerId);
//               // console.log("Provider-specific UID: " + profile.uid);
//               // console.log("Email: " + profile.email);
//               // console.log("Photo URL: " + profile.photoURL);
//           });
//           // $("#status").fadeOut(500);
//       }


// } else {
//   _redirect();  // User is signed out
// }
// });


// //---------logout--------------------//
// ("#out").on("click", function () {
//   // signInWithRedirect(auth, provider);
//   signOut(auth).then(() => {
//       // Sign-out successful.
//       _redirect();
//   }).catch((error) => {
//       // An error happened.
//       console.error(error);
//   });
// });


// //--------リダイレクト---------//

// function _redirect(){
//   location.href="login.html";
// }




//---------以下チャット送信に関わるコード---------------------------//

  //firebaseを使う時に書くおまじない
  const db = getDatabase(app);
  const dbRef = ref(db,'kadai4Chat'); //
  
  // const myname = $('#name').val(); //.val()[0]
  // console.log(uname,'unameの確認');



  // 送信処理
  $("#send").on('click', function(){
      // id="uname" の場所を取得します
      const myname = $('#name').val(); //.val()[0]
      // console.log(uname,'unameの確認');

      // id="text"の場所を取得します
      const text = $('#text').val(); //.val()[0]
      console.log(text,'textの確認');
      
      // ------送信時間の表示-----------//
      // $(function(){
      // setInterval(function(){        
        let time = new Date();
        let y = time.getFullYear();
        let m = time.getMonth() + 1;
        let d = time.getDate();
        // let w = time.getDay();
        let h = time.getHours();
        let mi = time.getMinutes();
        let s = time.getSeconds();
        // 逆から数える sliceで指定した順番の要素だけ取得する。下から2番目まで
        let mm = ('0' + m).slice(-2);
        let dd = ('0' + d).slice(-2);
        let hh = ('0' + h).slice(-2);
        let mmi = ('0' + mi).slice(-2);
        let ss = ('0' + s).slice(-2);

        // const showTime = `${y}/${mm}/${dd} ${hh}:${mmi}`;
        const showTime = `${mm}/${dd} ${hh}:${mmi}`;
        console.log(showTime, "ff");

        // $('#time').text(y+ '/' + m + '/'+ d + ' ' + h + ':' + mi);
        // }, 1000);
    // });

      // time = $("#time").val();
      // console.log(time,'時間の確認');


      //msgという箱にkeyと値を保存している
      const msg = {
          keyname:myname, //右はmynameという箱をセットしている（上で定義した） カギ：値
          textbox:text,   //右はtextという箱ををセットしている（上で定義した） カギ：値
          timebox:showTime
      }


      //firebaseに送る準備をしている
      const newPostRef = push(dbRef) //データを送信できる準備
      set(newPostRef, msg); //firebaseの登録できる場所に保存するイメージ


      //送信後に、入力欄を空にする
      $('#uname').val("");
      $("#text").val("");

      //最初のカーソルをunameに戻す（操作性の問題）
      $("#uname").focus();

      //send送信イベント この下消さない
  });

  // 送信処理2
  $("#text").on("keydown",function(e){
    console.log(e);
    if(e.keyCode == 13){
       // id="myname" の場所を取得します
       const myname = $('#name').val(); //.val()[0]
       console.log(myname,'mynameの確認');
 
       // id="text"の場所を取得します
       const text = $('#text').val(); //.val()[0]
       console.log(text,'textの確認');

       // id="showTime"の場所を取得します
       const showTime = $('#showTime').val(); //.val()[0]
       console.log(showTime,'showTimeの確認');

       
       //受信用の箱をつくった
       const msg_ju = {
        keyname:myname, //右はmynameという箱をセットしている（上で定義した） カギ：値
        textbox:text,   //右はtextboxという箱ををセットしている（上で定義した）カギ：値
        timebox:showTime
    }

    //firebaseに送る準備をしている
    const newPostRef = push(dbRef) //データを送信できる準備
    set(newPostRef, msg_ju); //firebaseの登録できる場所に保存するイメージ

    //スクロールトップ？
    $('#out').scrollTop($('#output').height());

    //送信後に、入力欄を空にしましょう
    $('#name').val("");
    $("#text").val("");
    }

  })

 
  // 受信処理を記載（送信の中には書かない！）
  // 受取用の変数：data
  onChildAdded(dbRef, function(data){

    //----------------- usernameとかの一致を入れる--------------------------//

    // // var messageField = $('#messageInput');
    // var nameField = $('#name');
    // var messageList = $('#text');

      //ここからが受信処理

      //登録されたデータを取得します
      // データの取得
      const msg_ju = data.val(); //上で関数の中に入れたdataのこと
      // console.log(msg_ju, '取得したデータの塊');
      // ユニークkey取得
      const key = data.key;//ユニークキーを取得する
      // console.log(key, 'データの塊にアクセス');

      // es6のテンプレートリテラル
      //チャットページへ書き込み
      let str = `  
          <div class = "container">
            <div class="container_inner">
              <p id="icon">${msg_ju.keyname}</p>
              <p class="delete_show" id="delete_show">${msg_ju.textbox}</p>  
              <p id="time">${msg_ju.timebox}</p>
              <p data-a=${key} id="delete"></p>
            <div>             
          </div>        
      ` ;
      //htmlに埋め込みましょう
      //append();というjqueryのおまじない
      

      $("#output").append(str);

  })

  //削除ボタン
  $(document).on('click',"#delete_show" ,function(){
    let del = $("#delete").data("a");
    console.log(del,'カギ');
    remove(ref(db, "kadai4Chat/" + del));
    location.reload();
  })





