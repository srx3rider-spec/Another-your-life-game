let state = {
  age: 15,
  money: 50,
  hp: 100,
  happiness: 50,
  intellect: 0,

  phase: "student",

  children: [],
  flags: {}
};

// 年齢進行（ランダム）
function advanceTime() {
  const delta = Math.random() * 2; // 0〜2年
  state.age += delta;

  if (state.age >= 22) state.phase = "adult";
}

// イベント選択（安全版）
function pickEvent() {
  const valid = EVENTS.filter(e => {
    if (e.phase && e.phase !== state.phase) return false;
    if (e.condition && !e.condition(state)) return false;
    return true;
  });

  if (valid.length === 0) {
    return {
      text: () => "何も起きなかった",
      choices: [{
        text: "次へ",
        effect: () => advanceTime()
      }]
    };
  }

  return valid[Math.floor(Math.random() * valid.length)];
}

// 描画（壊れない）
function draw() {
  const event = pickEvent();

  document.getElementById("status").innerText =
    `年齢:${Math.floor(state.age)} 金:${state.money} HP:${state.hp}`;

  document.getElementById("event").innerText =
    typeof event.text === "function" ? event.text(state) : event.text;

  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";

  event.choices.forEach(c => {
    const btn = document.createElement("button");
    btn.innerText = c.text;

    btn.onclick = () => {
      c.effect(state);
      advanceTime();
      draw();
    };

    choicesDiv.appendChild(btn);
  });
}

// 初回
draw();
