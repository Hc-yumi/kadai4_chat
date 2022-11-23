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
// 翻訳（英語・韓国語とか）transraterAPI
// MAP連携(緯度経度を取得)
// canvas（一緒に絵を書く）⇒保存で画像保存をする

// 4秒経ったらコメントの表示が消える
// 自分のキャラクターが行きたい場所に動いてくれる


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


// --リアルタイム接続---//
// let newPostRef = firebase.database().ref(); //山崎先生の動画ではあったけど無くてもいける・・？ 

// -----------icon作成に関わるコード（はじまり）-------------------------//
  //----なぞり絵を選ぶ------//
  $("#sun").on("click",function(){
    $("#drowarea").css('background-image','url(../img/sun.png)');
  })

  $("#miffy").on("click",function(){
    $("#drowarea").css('background-image','url(../img/miffy.png)');
  })

  $("#buta").on("click",function(){
    $("#drowarea").css('background-image','url(../img/buta.png)');
  })



  // 初期化
  let canvas_mouse_event = false;
  let oldX = 0; //ひとつ前の座業に代入
  let oldY = 0; //ひとつ前の座標に代入
  let bold_line = 5; //lineの太さ 最初の値
  let color = "#000";
  let dataImage = "";

  // let color = $("#color").val(); //lineの色

  //--- canvas のおまじない---//
  const can = $("#drowarea")[0];
  const ctx = can.getContext("2d");
    

  // マウスの位置情報をとる
  $(can).on("mousedown",function(e){
    // console.log(e);
    oldY = e.offsetY;
    oldX = e.offsetX;
    canvas_mouse_event = true;
    
  })

  // 色変える
  $("#color").on("change",function(){
    color = $(this).val();
  });

  //線の太さ変える
  $("#bold").on("change",function(){
    bold_line = $("#bold").val();
  });

  $(can).on("mousemove",function(e){
    // console.log(e.offsetX);
    if(canvas_mouse_event == true){
      const px = e.offsetX;
      const py = e.offsetY;
      
      //保持した色
      ctx.strokeStyle = color;
      ctx.lineWidth   = bold_line;
      ctx.lineJoin = "round";
      ctx.lineCap  = "round"; 
      ctx.beginPath();
      ctx.moveTo(oldX,oldY);
      ctx.lineTo(px,py);
      ctx.stroke();
      oldX = px;
      oldY = py;
    }
  })


  //マウス外したら描かなくなる
  $(can).on("mouseup",function(){
    canvas_mouse_event = false;
    
  })

  $(can).on("mouseover",function(){
    canvas_mouse_event = false;
  })

  //削除する
  $("#clear_btn").on("click",function(){
    ctx.beginPath();
    ctx.clearRect(0, 0, can.width, can.height);
    $("#tabletest").empty("");

  });

  // canvasを画像で保存
  $("#save").on("click",function getBase64Image(img){
  var canvas = $("#drowarea");
  canvas.width = img.width;
  canvas.height = img.height;

  var src = canvas[0].toDataURL("image/png");
  localStorage.setItem("save_2",src);

  // var dataImage = localStorage.getItem('save_2');
  dataImage = localStorage.getItem('save_2');
  console.log(dataImage);

  let str_img = `  
          <img src="${dataImage}">
          `

  $("#tabletest").append(str_img);    

  });
// -----------icon作成に関わるコード(おわり)---------------------------//



//------------チャットで使用するiconを読み込むコード（はじまり）-----//
const iconfile = dataImage;
  console.log(iconfile);
//------------チャットで使用するiconを読み込むコード（おわり）-----//



//---------チャット送信に関わるコード(はじまり)---------------------------//

  //firebaseを使う時に書くおまじない
  const db = getDatabase(app);
  const dbRef = ref(db,'kadai4Chat'); //

  //------------iconの選択-------------------------//
  // const imgfile = ["img/01.jpg", "img/02.jpg"]
  // let char_img ="";

  // $("#stich").on("click",function(){
  //   char_img = imgfile[0];
  //   console.log(char_img);
  // })

  // $("#lilo").on("click",function(){
  //   char_img = imgfile[1];
  //   console.log(char_img);
  // })


  //------------------- 送信処理-------------------//
  $("#send").on('click', function(){
      // id="text"の場所を取得します
      const text = $('#text').val(); //.val()[0]

      //---iconの取得------//
      // const icon = char_img;//既存画像の方
      const icon = dataImage; //icon作成の方
      
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


      //msgという箱にkeyと値を保存している
      const msg = {
          charbox:icon,
          textbox:text,   //右はtextという箱ををセットしている（上で定義した） カギ：値
          timebox:showTime
      }

      //firebaseに送る準備をしている
      const newPostRef = push(dbRef) //データを送信できる準備
      set(newPostRef, msg); //firebaseの登録できる場所に保存するイメージ

      //送信後に、入力欄を空にする
      $("#text").val("");

      //最初のカーソルをunameに戻す（操作性の問題）
      $("#text").focus();
      //send送信イベント この下消さない


  });

  // 送信処理2
  $("#text").on("keydown",function(e){
    console.log(e);
    if(e.keyCode == 13){

      // const icon = char_img.val();// 既存画像の方
      const icon = dataImage.val(); //作成したiconの方
      const text = $('#text').val(); //.val()[0]
      const showTime = $('#showTime').val(); //.val()[0]


       //受信用の箱
        const msg_ju = {
          charbox:icon,
          textbox:text,   //右はtextboxという箱ををセットしている（上で定義した）カギ：値
          timebox:showTime
    }

    //firebaseに送る準備をしている
    const newPostRef = push(dbRef) //データを送信できる準備
    set(newPostRef, msg_ju); //firebaseの登録できる場所に保存するイメージ

  

    // 送信後に、入力欄を空にしましょう
    $("#text").val("");
    }

  })


  // 受信処理を記載（送信の中には書かない！）
  // 受取用の変数：data
  onChildAdded(dbRef, function(data){

    //----------------- usernameとかの一致を入れる--------------------------//
      // データの取得
      const msg_ju = data.val(); //上で関数の中に入れたdataのこと
      // ユニークkey取得
      const key = data.key;//ユニークキーを取得する

      let str = `  
          <div class = "container">
            <div class="container_inner">              
              <img src="${msg_ju.charbox}" class="chat_icon"> 
              <div class="box">             
                <p class="delete_show" id="delete_show">${msg_ju.textbox}</p>
                <p id="time">${msg_ju.timebox}</p>
                <p data-a=${key} id="delete"></p>                
              </div>              
            </div>            
          </div>        
      ` ;

      $("#output").append(str);

      // ---スクロールトップ--//
      const output = document.getElementById('output');
      output.scrollTo(0, output.scrollHeight);

  })

  //削除ボタン
  $(document).on('click',"#delete_show" ,function(){
    let del = $("#delete").data("a");
    console.log(del,'カギ');
    remove(ref(db, "kadai4Chat/" + del));
    location.reload();
  })

  //---------チャット送信に関わるコード(おわり)---------------------------//





