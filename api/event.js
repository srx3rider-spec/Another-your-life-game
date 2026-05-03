export default async function handler(req,res){
  const events=[
    "仕事でトラブルが発生した",
    "魅力的な人物と出会った",
    "思わぬ出費が発生した",
    "体調を崩した",
    "新しいチャンスが舞い込んだ"
  ];

  res.status(200).json({
    event:events[Math.floor(Math.random()*events.length)],
    choices:[
      {text:"行動する",effect:{money:1,social:1}},
      {text:"様子を見る",effect:{}},
      {text:"無視する",effect:{social:-1}}
    ]
  });
}
