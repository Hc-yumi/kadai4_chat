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
// チャットボットと自動で会話できる


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

// ここから（チャットボットを機能させるには）
  //------------------- 送信処理-------------------//
  $("#send").on('click', function(){
      // id="text"の場所を取得します
      const text = $('#chat-input').val(); //.val()[0]

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
      $("#chat-input").val("");

      //最初のカーソルをunameに戻す（操作性の問題）
      $("#chat-input").focus();
      //send送信イベント この下消さない

  });


  // 送信処理2
  $("#chat-input").on("keydown",function(e){
    console.log(e);
    if(e.keyCode == 13){

      // const icon = char_img.val();// 既存画像の方
      const icon = dataImage.val(); //作成したiconの方
      const text = $('#chat-input').val(); //.val()[0]
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

  

    // 送信後に、入力欄を空に
    $("#chat-input").val("");
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

/* <div class="container_inner">  
</div>  */
      let str = `
            <div class="chat-ul"> 
              <div class="chat-right">
                  <li class="right">                                
                    <img src="${msg_ju.charbox}" class="chat_icon"> 
                  </li>
                

                  <li class="right_text">                              
                    <p class="delete_show" id="delete_show">${msg_ju.textbox}</p>
                  </li>

                  <li class="right">
                    <p id="time">${msg_ju.timebox}</p>
                  </li>

                  <li class="right">
                    <p data-a=${key} id="delete"></p>  
                  </li>  

                </ul> 
              </div>
            </div>              
      ` ;

      $("#chat-ul").append(str);
      $("#chat-ul").addClass("chat-right");

      // ---スクロールトップ--//
      const output = document.getElementById('chat-ul');
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


  // ここまで（チャットボットを機能させるには）
// ここ
//   // ---------------チャットボット----------------------------//
//   // ロボットの返答内容
  const chat = [
    'こんにちは！ぼくはAI(あい)くん。よろしくね。',
    'まずはあなたのアイコンを作成してね！できたら話しかけてね。',
    'あなたのお名前はなんですか？',
    '今日の調子はどう?',
    ['いいね!', 'さすが!', 'Ok!']// ランダムな返答
  ];


  // ロボットの返信の合計回数（最初は0）
  // これを利用して、自分が送信ボタンを押したときの相手の返答を配列から指定する
  let chatCount = 0;


  // 画面への出力
  // valはメッセージ内容，personは誰が話しているか
  function output(val, person) {
    // 一番下までスクロール
    const field = document.getElementById('field');
    field.scroll(0, field.scrollHeight - field.clientHeight);

    const ul = document.getElementById('chat-ul');
    const li = document.createElement('li');
    // このdivにテキストを指定
    const div = document.createElement('div');
    div.textContent = val;
    
    if (person === 'me') { // 自分
        div.classList.add('chat-right');
        li.classList.add('right');
        ul.appendChild(li);
        li.appendChild(div);
    }else if (person === 'robot') { // 相手
        // ロボットが2個連続で返信してくる時、その間は返信不可にする
        // なぜなら、自分の返信を複数受け取ったことになり、その全てに返信してきてしまうから
        // 例："Hi!〇〇!"を複数など
        // （今回のロボットの連続返信は2個以内とする）
        chatBtn.disabled = true;
        setTimeout( ()=> {
            chatBtn.disabled = false;
            li.classList.add('left');
            div.classList.add('chat-left');
            ul.appendChild(li);
            li.appendChild(div);
            // ロボットのトークの合計数に1足す
            chatCount++;
        }, 1000); 
    }
  }


  const chatBtn = document.getElementById('send');
  const inputText = document.getElementById('chat-input');


  // 送信ボタンを押した時の処理

  $("#send").on("click",function(){
  
  // function btnFunc() {
    if (!inputText.value) return false;
    // 自分のテキストを送信
    output(inputText.value, 'me');

    setTimeout( ()=> {
        // 入力内を空欄にする
        // 一瞬の間でvalueを取得し、ロボットの"こんにちは、〇〇!"の返信に利用
        // 送信ボタンを押した瞬間にvalueを消したら、やまびこに失敗した
        inputText.value = '';
    }, 1);

    //ロボットの送信の合計回数に応じて次の返信を指定
    switch(chatCount) {
        // ロボットのトーク数が2個の時に送信ボタンが押されたら、
        // 名前のやまびこと、chat配列の2（3個目）が返信
        case 2:
          output('上手に描けたね！','robot');
          setTimeout( ()=> {
            output(chat[2], 'robot');
        }, 2000);
        break;

        case 4:
            output('こんにちは、' + inputText.value + ' さん!', 'robot');
            setTimeout( ()=> {
                output(chat[3], 'robot');
            }, 2000);
            break;
        
        // もしロボットのトーク数が4個の時に送信ボタンが押されたら、
        // chat配列の3（4個目）のランダム番目が返信
        case 6:
            output(chat[4][Math.floor(Math.random() * chat[4].length)], 'robot');
            break;
        
        // それ以降はやまびこ
        default:
            output(inputText.value, 'robot');
            break;
    }
  // }
})


  // 最初に2つロボットから話しかけられる
  output(chat[0], 'robot');

  setTimeout( ()=> {
    output(chat[1], 'robot');
  }, 2000);

// ここ







