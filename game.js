// =========================
// 状態
// =========================

let state = {
    age:15,
    money:50,
    love:0,
    hp:100,

    partner:null,
    married:false,
    affairPartner:null,

    flags:{}
};

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
    state.age++;

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
    condition:s=>s.age===15,
    text:s=>"進路を考える",
    choices:[
        {
            text:"勉強する",
            effect:s=>{s.love+=5;}
        },
        {
            text:"遊ぶ",
            effect:s=>{s.money+=10;}
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
    condition:s=>true,
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
    return valid[Math.floor(Math.random()*valid.length)];
}

// =========================
// 開始
// =========================

draw();
