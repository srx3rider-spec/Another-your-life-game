// ========================
// STATE
// ========================
let state = {
  age:15,
  money:50,
  love:0,
  hp:100,
　gender: Math.random()<0.5 ? "男" : "女",
  partner:null,
  affairPartner:null,
　child:null,
　grandchild:false,
  currentEvent: null,
  flags:{}
};

// ========================
// 時間進行（リアル化）
// ========================
function advanceTime(){
  const delta = 0.2 + Math.random()*1.0;
  state.age += delta;
}

// ========================
// フェーズ
// ========================
function getPhase(){
  if(state.age < 18) return "student";
  if(state.age < 30) return "young";
  if(state.age < 60) return "adult";
  return "old";
}

// ========================
// イベント
// ========================
const EVENTS = [

/* ================= 学生 ================= */

{
  id:"school",
  condition:s=>getPhase()==="student",

  text:s=>"学校生活",

  choices:[
    {
      text:"勉強する",
      effect:s=>{
        s.money -= 5;
        s.love -= 2;
        advanceTime();
      }
    },
    {
      text:"遊ぶ",
      effect:s=>{
        s.love += 5;
        advanceTime();
      }
    },
    {
      text:"部活に励む",
      effect:s=>{
        s.hp += 5;
        s.love += 2;
        advanceTime();
      }
    }
  ]
},

/* ================= 出会い ================= */

{
  id:"meet",
  condition:s=>!s.partner && Math.random()<0.3,

  text:s=>"魅力的な人と出会った",

  choices:[
    {
      text:"話しかける",
      effect:s=>{
        s.partner = {name:"恋人"};
        s.love += 10;
        advanceTime();
      }
    },
    {
      text:"見送る",
      effect:s=>{
        advanceTime();
      }
    }
  ]
},

/* ================= 恋人イベント ================= */

{
  id:"dating",
  condition:s=>s.partner && !s.married,

  text:s=>`${s.partner.name}との時間`,

  choices:[
    {
      text:"デートする",
      effect:s=>{
        s.love += 5;
        advanceTime();
      }
    },
    {
      text:"仕事優先",
      effect:s=>{
        s.money += 10;
        s.love -= 3;
        advanceTime();
      }
    }
  ]
},

/* ================= 結婚 ================= */

{
  id:"marriage",
  condition:s=>s.partner && !s.married && s.love > 30,

  text:s=>`${s.partner.name}と結婚を考えている`,

  choices:[
    {
      text:"結婚する",
      effect:s=>{
        s.married = true;
        s.partner.name = "妻";
        advanceTime();
      }
    },
    {
      text:"まだ早い",
      effect:s=>{
        s.love -= 5;
        advanceTime();
      }
    }
  ]
},

/* ================= 仕事 ================= */

{
  id:"work",
  condition:s=>getPhase()!=="student",

  text:s=>"日常の選択",

  choices:[
    {
      text:"仕事に集中",
      effect:s=>{
        s.money += 20;
        s.hp -= 10;
        advanceTime();
      }
    },
    {
      text:"休む",
      effect:s=>{
        s.hp += 10;
        advanceTime();
      }
    },
    {
      text:"趣味に時間",
      effect:s=>{
        s.love += 3;
        advanceTime();
      }
    }
  ]
},

/* ================= 浮気 ================= */

{
  id:"affair",
  condition:s=>s.married && Math.random()<0.2,

  text:s=>"危険な出会い",

  choices:[
    {
      text:"関係を持つ",
      effect:s=>{
        s.affairPartner = {name:"浮気相手"};
        s.love += 10;
        advanceTime();
      }
    },
    {
      text:"断る",
      effect:s=>{
        advanceTime();
      }
    }
  ]
},

/* ================= 修羅場 ================= */

{
  id:"crisis",
  condition:s=>s.married && s.affairPartner,

  text:s=>"関係が崩れかけている",

  choices:[
    {
      text:"妻を選ぶ",
      effect:s=>{
        s.affairPartner = null;
        s.love -= 5;
        advanceTime();
      }
    },
    {
      text:"浮気を続ける",
      effect:s=>{
        s.love -= 10;
        advanceTime();
      }
    }
  ]
}
{
  id:"child_birth",
  condition:s=>s.married && !s.child && Math.random()<0.3,

  text:s=>"子供が生まれた",

  choices:[
    {
      text:"喜ぶ",
      effect:s=>{
        s.child = {
  age:0,
  gender: Math.random()<0.5 ? "男" : "女",
  rebellious:false,
  withdrawn:false,
  success:false,
  married:false
};
        s.love += 10;
        advanceTime();
      }
    }
  ]
},

    {
  id:"child_grow",
  condition:s=>s.child && Math.random()<0.6,

  text:s=>`${s.child.gender}の子供は${Math.floor(s.child.age)}歳になった`,

  choices:[
    {
      text:"見守る",
      effect:s=>{
        s.child.age += 1;
        advanceTime();
      }
    }
  ]
},

        {
  id:"child_lesson",
  condition:s=>s.child && s.child.age >=5 && !s.child.withdrawn,

  text:s=>"子供に習い事をさせるか？",

  choices:[
    {
      text:"させる",
      effect:s=>{
        s.money -= 10;
        s.child.age += 0.5;
        advanceTime();
      }
    },
    {
      text:"させない",
      effect:s=>{
        advanceTime();
      }
    }
  ]
},
{
  id:"child_rebel",
  condition:s=>s.child && s.child.age >=13 && !s.child.rebellious && Math.random()<0.3,

  text:s=>"子供が反抗的になってきた",

  choices:[
    {
      text:"厳しくする",
      effect:s=>{
        s.child.rebellious = true;
        s.love -= 5;
        advanceTime();
      }
    },
    {
      text:"理解しようとする",
      effect:s=>{
        s.love += 2;
        advanceTime();
      }
    }
  ]
},
    {
  id:"child_withdraw",
  condition:s=>s.child && s.child.rebellious && Math.random()<0.3,

  text:s=>"子供が部屋から出てこなくなった",

  choices:[
    {
      text:"放っておく",
      effect:s=>{
        s.child.withdrawn = true;
        advanceTime();
      }
    },
    {
      text:"向き合う",
      effect:s=>{
        s.child.withdrawn = false;
        s.love -= 3;
        advanceTime();
      }
    }
  ]
},
        {
  id:"child_sick",
  condition:s=>s.child && Math.random()<0.3,

  text:s=>"子供が体調を崩した",

  choices:[
    {
      text:"病院へ連れていく",
      effect:s=>{
        s.money -= 10;
        advanceTime();
      }
    },
    {
      text:"様子を見る",
      effect:s=>{
        s.hp -= 5;
        advanceTime();
      }
    }
  ]
}
{
  id:"child_future",
  condition:s=>s.child && s.child.age >=18 && !s.child.success,

  text:s=>"子供の将来が決まった",

  choices:[
    {
      text:"成功する",
      effect:s=>{
        s.child.success = true;
        s.money += 30;
        advanceTime();
      }
    },
    {
      text:"うまくいかない",
      effect:s=>{
        s.child.success = false;
        s.money -= 10;
        advanceTime();
      }
    }
  ]
},            
{
  id:"child_marriage",
  condition:s=>s.child && s.child.age >=22 && !s.child.married,

  text:s=>`${s.child.gender}の子供が結婚することになった`,

  choices:[
    {
      text:"祝福する",
      effect:s=>{
        s.child.married = true;

        if(s.child.gender === "女"){
          s.money -= 30; // 結婚費用
        }else{
          if(s.child.success){
            s.money += 20; // 仕送り
          }
        }

        advanceTime();
      }
    }
  ]
},
    {
  id:"grandchild",
  condition:s=>s.child && s.child.married && !s.grandchild && Math.random()<0.5,

  text:s=>"孫が生まれた",

  choices:[
    {
      text:"喜ぶ",
      effect:s=>{
        s.grandchild = true;
        s.love += 10;
        advanceTime();
      }
    }
  ]
}
{
  id:"career_choice",

  condition:s=>getPhase()!=="student",

  text:s=>"働き方をどうするか考えている",

  choices:[
    {
      text:"フルタイムで働く",
      effect:s=>{
        s.money += 25;
        s.hp -= 10;
        advanceTime();
      }
    },
    {
      text:"パートで働く",
      effect:s=>{
        s.money += 10;
        s.hp -= 3;
        advanceTime();
      }
    },
    {
      text:"起業する",
      effect:s=>{
        if(Math.random()<0.5){
          s.money += 50;
        }else{
          s.money -= 20;
        }
        advanceTime();
      }
    }
  ]
},
   {
  id:"return_work",

  condition:s=>s.child && s.child.age >=5 && Math.random()<0.5,

  text:s=>"子供が成長し、働き方を見直す時期になった",

  choices:[
    {
      text:"復職する",
      effect:s=>{
        s.money += 20;
        s.hp -= 5;
        advanceTime();
      }
    },
    {
      text:"今のままでいる",
      effect:s=>{
        s.love += 5;
        advanceTime();
      }
    },
    {
      text:"新しい挑戦（起業）",
      effect:s=>{
        if(Math.random()<0.4){
          s.money += 60;
        }else{
          s.money -= 15;
        }
        advanceTime();
      }
    }
  ]
},
       {
  id:"career_return",

  condition:s=>s.child && s.child.age >= 6, // ←ここ

  text:s=>"子供が成長し、働き方を見直す時期",

  choices:[
    {
      text:"フルタイム復帰",
      effect:s=>{
        s.money += 25;
        s.hp -= 8;
        advanceTime();
      }
    },
    {
      text:"パート継続",
      effect:s=>{
        s.money += 12;
        advanceTime();
      }
    },
    {
      text:"起業に挑戦",
      effect:s=>{
        if(Math.random()<0.5){
          s.money += 50;
        }else{
          s.money -= 20;
        }
        advanceTime();
      }
    }
  ]
}
{
  id:"child_career_small",

  condition:s=>s.child && s.child.age < 3,

  text:s=>"子供がまだ小さい。働き方をどうする？",

  choices:[
    {
      text:"パートで働く",
      effect:s=>{
        s.money += 10;
        s.hp -= 2;
        advanceTime();
      }
    },
    {
      text:"専業で育てる",
      effect:s=>{
        s.love += 5;
        advanceTime();
      }
    },
    {
      text:"無理してフルタイム",
      effect:s=>{
        s.money += 20;
        s.hp -= 10;
        advanceTime();
      }
    }
  ]
}, 
];

// ========================
// イベント選択
// ========================
function pickEvent(){
  const valid = EVENTS.filter(e => !e.condition || e.condition(state));

  console.log("valid:", valid);

  // シャッフル（これが重要）
  const shuffled = valid.sort(() => Math.random() - 0.5);

  return shuffled[0];
}
// ========================
// 描画
// ========================

function draw(){

  // 👇ここ追加
  if (!state.currentEvent) {
    state.currentEvent = pickEvent();
  }

  const event = state.currentEvent;

  document.getElementById("event").innerText = event.text(state);

  const div = document.getElementById("choices");
  div.innerHTML = "";

  event.choices.forEach(c=>{
    const btn = document.createElement("button");
    btn.innerText = c.text;

    btn.onclick = ()=>{
      c.effect(state);

      // 👇これが超重要
      state.currentEvent = null;

      draw();
    };

    div.appendChild(btn);
  });
}
// ========================
draw();
