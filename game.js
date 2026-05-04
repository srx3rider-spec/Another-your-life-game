// =====================
// 状態
// =====================
let state = {
  age: 15,
  phase: "student",
  money: 50,
  hp: 100,
  love: 0,
  flags: {}
};

// =====================
// フェーズ更新
// =====================
function updatePhase() {
  if (state.age < 18) state.phase = "student";
  else if (state.age < 23) state.phase = "young";
  else state.phase = "adult";
}

// =====================
// 時間進行
// =====================
function advanceTime(years = 1) {
  state.age += years;
  updatePhase();
}

// =====================
// イベント
// =====================
const EVENTS = [
  {
    id: "student",
    condition: s => s.phase === "student",
    text: s => "学校生活の日々",
    choices: [
      {
        text: "勉強する",
        effect: s => {
          s.hp -= 5;
          advanceTime();
        }
      },
      {
        text: "遊ぶ",
        effect: s => {
          s.love += 3;
          advanceTime();
        }
      },
      {
        text: "部活に励む",
        effect: s => {
          s.hp -= 3;
          s.love += 2;
          advanceTime();
        }
      }
    ]
  },
  {
    id: "adult",
    condition: s => s.phase === "adult",
    text: s => "大人の日常",
    choices: [
      {
        text: "仕事に集中",
        effect: s => {
          s.money += 20;
          s.hp -= 10;
          advanceTime();
        }
      },
      {
        text: "休む",
        effect: s => {
          s.hp += 10;
          advanceTime();
        }
      },
      {
        text: "起業する",
        effect: s => {
          if (Math.random() < 0.5) {
            s.money += 100;
          } else {
            s.money -= 50;
          }
          advanceTime();
        }
      }
    ]
  }
];

// =====================
// イベント選択
// =====================
function pickEvent() {
  const available = EVENTS.filter(e => !e.condition || e.condition(state));

  if (available.length === 0) {
    return {
      text: () => "特に何も起きなかった",
      choices: [
        {
          text: "時間が流れる",
          effect: s => advanceTime()
        }
      ]
    };
  }

  return available[Math.floor(Math.random() * available.length)];
}

// =====================
// 描画
// =====================
function draw() {
  document.getElementById("status").innerText =
    `年齢:${state.age} 金:${state.money} 愛:${state.love} HP:${state.hp}`;

  const event = pickEvent();

  document.getElementById("event").innerText = event.text(state);

  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";

  event.choices.forEach(c => {
    const btn = document.createElement("button");
    btn.innerText = c.text;
    btn.onclick = () => {
      c.effect(state);
      draw();
    };
    choicesDiv.appendChild(btn);
  });
}

// 初期表示
draw();
