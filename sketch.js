const modules = [];
let SIZE = 15;
const index = 1;

function grid(callback=function(){},gap=50,gap2){
  if(!gap2)gap2 = gap;
  for(let y=0; y<height; y+=gap2){
    for(let x=0; x<width; x+=gap){
      callback({x,y});
    }
  }
}

const settings = [
  {
    generate:()=>{
      SIZE = 8;
      background("white");
      textAlign(CENTER,CENTER);
      textStyle(BOLD);
      textSize(height*0.3);
      text("모이다",width/2,height*0.6-2-8*5);
      grid(createModule,SIZE)
    },
    setup:(m,i)=>{
      m.s = SIZE;
      m.tx = m.x;
      m.ty = m.y;
      m.x = random(width);
      m.y = random(height);
      setTimeout(()=>{
        modules.push(m);
      },i*10);
      
    },
    drawGlobal:()=>{
      background("white");
    },
    draw:(m,i)=>{
      if(i*0.5<=frameCount){
        m.x = lerp(m.x, m.tx, 0.05);
        m.y = lerp(m.y, m.ty, 0.05);
      }
      fill(0);
      noStroke();
      rectMode(CENTER);
      rect(m.x,m.y,m.s,m.s);
    },
  },
  {
    generate:()=>{
      SIZE = 20;
      background("white");
      textAlign(CENTER,CENTER);
      textStyle(BOLD);
      textSize(height*0.8);
      text("숲",width/2,height*0.5);
      gridTriangle(createModule,SIZE)
    },
    setup:(m)=>{
      m.x = m.x + random(-5,5);
      m.y = m.y + random(-5,5)
      m.s = SIZE - 2;
      modules.push(m);
    },
    drawGlobal:()=>{
      background("white");
    },
    draw:(m)=>{
      const d = dist(mouseX,mouseY,m.x,m.y);
      const _max = 150;
      const _min = 15;
      if(d < 100){
        m.s = constrain(map(d,100,0,_min,_max),_min,_max);
      }
      else{
        m.s = _min;
      }
      rectMode(CENTER);
      push();
        translate(m.x,m.y);
        scale(0.2);
        plant(m.s,_max);
      pop();
    },
  },
  {
    generate:()=>{
      SIZE = 5;
      background("white");
      textAlign(CENTER,CENTER);
      textStyle(BOLD);
      textSize(height*0.45);
      text("파도",width/2,height*0.55);
      grid(createModule,SIZE)
    },
    setup:(m)=>{
      modules.push(m);
    },
    drawGlobal:()=>{
      background("white");
    },
    draw:(m,i)=>{
      const d = dist(mouseX,mouseY,m.x,m.y);
      let move;
      let range = 150;
      if(d < range){
        move = constrain(map(d,range,0,0,SIZE*10),0,SIZE*10);
      }
      else{
        move = 0;
      }

      const off = frameCount * 0.1;
      const my1 = sin( (m.x)*0.05 + off )*move;


      noStroke();
      fill(0);
      push();
        translate(m.x,m.y);
        // ellipse(0,0,8,8);
        rect(0,my1,SIZE,SIZE)
      pop();
    },
  },
  {
    generate:()=>{
      textFont('D2Coding');
      SIZE = 12;
      background("white");
      textAlign(CENTER,CENTER);
      textStyle(BOLD);
      textSize(height*0.35);
      text("ascii",width/2,height*0.5);
      grid(createModule,SIZE/2,SIZE)
      
    },
    setup:(m)=>{
      m.s = SIZE;
      m.i = 0;
      m.speed = 0;
      modules.push(m);
    },
    drawGlobal:()=>{
      background("white");
    },
    draw:(m,i)=>{
      const d = dist(mouseX,mouseY,m.x,m.y);
      let speed = 0;
      const str = " ./:+M?=-"
      const range = 140;
      const _max = 0.8;
      if(d < range){
        speed = constrain(map(d,range,0,0,_max),0,_max);
      }
      else{
        speed = 0;
      }
      m.speed = lerp(m.speed,speed,0.05);
      m.i += m.speed;
      if(m.i>=str.length)m.i=0;

      const index = floor(m.i);
      
      fill(0);
      rectMode(CENTER);
      textStyle(BOLD);
      textSize(m.s);
      text(str[index],m.x,m.y);
    },
  },
];


function setup(){
  createCanvas(540,540);
  textFont("Noto Serif KR");
  text("a",0,0);
  setTimeout(()=>{
    settings[index].generate();
    cursor(HAND);
  },500)
}

function createModule(m){
  const c = get(m.x,m.y);
  const isBlack = brightness(c) == 0;
  if(isBlack && m.x<width && m.y<height){
    settings[index].setup(m);
  }
}

function draw(){
  settings[index].drawGlobal();
  modules.forEach(drawModule);
}

function drawModule(m,i){
  settings[index].draw(m,i);
}

function plant(h,m){
  
  // 최대크기 대비 현재 크기 비율
  let ratio = h/m;

  // 100을 기준으로 크기 설정
  let s = (h<m*0.25) ? ( h/(m*0.25) )*100 : 100;
  
  // 나무 줄기
  rectMode(CENTER);
  stroke(255);
  strokeWeight(5);
  fill(255);
  rect(0,-h/4,s*0.2+5,h/2);

  // 삼각형 잎사귀 덩어리
  fill(0);
  triangle(
    0, -h*0.5-s,
    -s*0.43, -h*0.5,
    s*0.43, -h*0.5
  );
  
  // 키가 90 이상 컸을때 삼각형 덩어리 하나 더 그리기 
  if(h>90){
    triangle(
        0, -h*0.9-s*0.6,
        -s*0.33, -h*0.9,
        s*0.33, -h*0.9
    );
  }
  
  
  // 나무 줄기
  stroke(0);
  strokeWeight(5);
  fill(255);
  rect(0,-h/4,s*0.2,h/2);


  // 삼각형 잎사귀 덩어리
  fill(0);
  noStroke();
  triangle(
    0, -h*0.5-s,
    -s*0.43, -h*0.5,
    s*0.43, -h*0.5
  );
  
  // 키가 90 이상 컸을때 삼각형 덩어리 하나 더 그리기 
  if(h>90){
     triangle(
        0, -h*0.9 - s*0.6,
        -s*0.33, -h*0.9,
        s*0.33, -h*0.9
    );
  }
}
