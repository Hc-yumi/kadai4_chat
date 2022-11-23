    // ----------使用してない！！！！(script.jsに組み込み済み！)---------------------//

    // 初期化
    let canvas_mouse_event = false;
    let oldX = 0; //ひとつ前の座業に代入
    let ildY = 0; //ひとつ前の座標に代入
    let bold_line = 5; //lineの太さ 最初の値

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
      color = $("#color").val();
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

    var dataImage = localStorage.getItem('save_2');
    console.log(dataImage);

    let str_img = `  
            <img src="${dataImage}">
             `
    
   $("#tabletest").append(str_img);    
    
      
    });
