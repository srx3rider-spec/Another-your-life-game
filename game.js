id:"idle"
condition:s=>true

// =========================
// 状態
// =========================

let state = {
    timeBuffer = 0,
    age:15,
    money:50,
    love:0,
    hp:100,

    partner:null,
    married:false,
    affairPartner:null,
　　
    flags:{}
};
advanceTime(0.2 + Math.random()*0.8);
// =========================
// UI
// =========================

function draw(){
    document.getElementById("status").innerText =
        `年齢:${state.age} 金:${state.money} 愛:${state.love} HP:${state.hp}`;

    const event = pickEvent();

    document.getElementById("event").innerText = event.text(state);

    const choicesDiv = document.getElementById("choices");
    choicesDiv.innerHTML = "";

    event.choices.forEach(c=>{
        const btn = document.createElement("button");
        btn.innerText = c.text;

        btn.onclick = ()=>{
            c.effect(state);
            nextTurn();
        };

        choicesDiv.appendChild(btn);
    });
}

// =========================
// ターン進行
// =========================

function nextTurn(){
    

    // 死亡判定
    if(state.hp <= 0){
        endGame("体力が尽きた");
        return;
    }

    if(state.age > 90){
        endGame("老衰");
        return;
    }

    draw();
}

// =========================
// 終了
// =========================

function endGame(reason){
    document.getElementById("event").innerText =
        `人生終了：${reason}`;
    document.getElementById("choices").innerHTML = "";
}

// =========================
// パートナー生成
// =========================

function createPartner(){
    const names = ["あや","ゆい","さき","みき"];
    return {name:names[Math.floor(Math.random()*names.length)]};
}

// =========================
// イベント
// =========================

const EVENTS = [

{
    id:"school",
    
{
    id:"adult_work",
    condition:s=>s.phase==="adult",

    text:s=>"日常の選択",

    choices:[
        {
            text:"仕事に集中",
            effect:s=>{
                s.money += 20;
                s.hp -= 10;
            }
        },
        {
            text:"転職を考える",
            effect:s=>{
                s.money -= 5;
                s.flags.jobChange = true;
            }
        },
        {
            text:"趣味に時間を使う",
            effect:s=>{
                s.hp += 10;
                s.love += 5;
            }
        }
        {
    text:"仕事に集中",
    effect:s=>{
        s.money += 20;
        s.hp -= 10;
        advanceTime(1);
    }
}
        {
    id:"school",
    condition:s=>s.phase==="student",

    text:s=>"学校生活",

    choices:[
        {
            text:"勉強",
            effect:s=>{
                s.social -= 5;
                s.money -= 5;
                advanceTime(1); // ←ここ
            }
        },
        {
            text:"遊ぶ",
            effect:s=>{
                s.social += 10;
                advanceTime(0.3);
            }
        },
        {
            text:"部活に励む",
            effect:s=>{
                s.social += 5;
                s.hp -= 5;
                advanceTime(0.7);
            }
        }
    ]
}
    ]
},

    {
    id:"adult_love",
    condition:s=>s.phase==="adult" && !s.partner && s.age>22,

    text:s=>"新しい出会いがあった",

    choices:[
        {
            text:"関係を深める",
            effect:s=>{
                s.partner = createPartner();
                s.love = 50;
            }
        },
        {
            text:"何もしない",
            effect:s=>{}
        }
    ]
},

    {
    id:"midlife",
    condition:s=>s.age>40 && s.age<60,

    text:s=>"人生を見つめ直す時期",

    choices:[
        {
            text:"新しい挑戦",
            effect:s=>{
                s.money -= 10;
                s.hp += 10;
            }
        },
        {
            text:"現状維持",
            effect:s=>{
                s.hp -= 5;
            }
        }
    ]
},

    {
    id:"old_life",
    condition:s=>s.age>=65,

    text:s=>"穏やかな日々",

    choices:[
        {
            text:"ゆっくり過ごす",
            effect:s=>{
                s.hp += 5;
            }
        },
        {
            text:"外出する",
            effect:s=>{
                s.hp -= 5;
                s.love += 3;
            }
        }
    ]
},
    
    {
    id:"love_start",
    condition:s=>!s.partner && s.age>18,
    text:s=>"出会いがあった",
    choices:[
        {
            text:"付き合う",
            effect:s=>{
                s.partner = createPartner();
                s.love=50;
            }
        },
        {
            text:"スルー",
            effect:s=>{}
        }
    ]
},

{
    id:"affair_meet",
    condition:s=>s.partner && !s.affairPartner,
    text:s=>"別の魅力的な人に出会った",
    choices:[
        {
            text:"スルー",
            effect:s=>{}
        },
        {
            text:"少し仲良くなる",
            effect:s=>{
                s.affairPartner = createPartner();
            }
        }
    ]
},

{
    id:"relationship_crisis",
    condition:s=>s.partner && s.love < 30,
    text:s=>{
        return `${s.partner.name}との関係が限界に近い`;
    },
    choices:[
        {
            text:"修復する",
            effect:s=>{
                s.love += 20;
            }
        },
        {
            text:"別れる",
            effect:s=>{
                s.partner = null;
                s.love = 0;
            }
        }
    ]
},

{
    id:"daily",
   condition:s=>s.phase==="adult",
    text:s=>"日常",
    choices:[
        {
            text:"仕事",
            effect:s=>{
                s.money+=10;
                s.hp-=5;
            }
        },
        {
            text:"休む",
            effect:s=>{
                s.hp+=10;
            }
        }
    ]
}

];

// =========================
// イベント抽選
// =========================

function pickEvent(){
    const valid = EVENTS.filter(e=>e.condition(state));

    if(valid.length === 0){
        return {
            text: ()=>"何も起きない",
            choices:[{text:"次へ", effect:()=>{}}]
        };
    }

    return valid.sort((a,b)=>(b.priority||0)-(a.priority||0))[0];
}
function advanceTime(years){
    state.timeBuffer += years;

    if(state.timeBuffer >= 1){
        const add = Math.floor(state.timeBuffer);
        state.age += add;
        state.timeBuffer -= add;
    }
}

// =========================
// 開始
// =========================
function updatePhase(){
    if(state.age < 18){
        state.phase = "student";
    }else{
        state.phase = "adult";
    }
}
updatePhase();
draw();
