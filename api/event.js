export default async function handler(req, res) {

  const s = req.body;

  const prompt = `
人生シミュレーションを生成せよ。

名前:${s.name}
年齢:${s.age}
資産:${s.money}
社会:${s.social}

現実的で感情が動くイベントを1つ作れ。

JSONで返せ:
{
 "event":"",
 "tone":"good|neutral|bad",
 "choices":[
  {"text":"","effect":{"money":0,"social":0,"luck":0}},
  {"text":"","effect":{"money":0,"social":0,"luck":0}},
  {"text":"","effect":{"money":0,"social":0,"luck":0}}
 ]
}
`;

  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization":`Bearer ${process.env.OPENAI_API_KEY}`
    },
    body:JSON.stringify({
      model:"gpt-4o-mini",
      messages:[{role:"user",content:prompt}]
    })
  });

  const data = await r.json();
  const txt = data.choices[0].message.content;

  try{
    res.json(JSON.parse(txt));
  }catch{
    res.json({event:"エラー",tone:"neutral",choices:[]});
  }
}
