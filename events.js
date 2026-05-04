const EVENTS = [
  {
    id: "school_life",
    phase: "student",
    text: "今日はどうする？",
    choices: [
      {
        text: "勉強する",
        effect: (s) => {
          s.intellect += 5;
          s.hp -= 2;
        }
      },
      {
        text: "遊ぶ",
        effect: (s) => {
          s.happiness += 5;
          s.intellect -= 1;
        }
      },
      {
        text: "部活に励む",
        effect: (s) => {
          s.hp -= 3;
          s.happiness += 3;
        }
      }
    ]
  },

  {
    id: "adult_work",
    phase: "adult",
    text: "日常の選択",
    choices: [
      {
        text: "仕事に集中",
        effect: (s) => {
          s.money += 20;
          s.hp -= 5;
        }
      },
      {
        text: "休む",
        effect: (s) => {
          s.hp += 10;
        }
      },
      {
        text: "起業する",
        effect: (s) => {
          s.money -= 50;
          s.flags.business = true;
        }
      }
    ]
  },

  {
    id: "child_event",
    phase: "adult",
    condition: (s) => s.children.length > 0,
    text: (s) => `${s.children[0].name}がどう過ごす？`,
    choices: [
      {
        text: "習い事させる",
        effect: (s) => {
          s.money -= 10;
          s.children[0].skill += 5;
        }
      },
      {
        text: "放置する",
        effect: (s) => {
          s.children[0].rebellion += 5;
        }
      }
    ]
  }
];
