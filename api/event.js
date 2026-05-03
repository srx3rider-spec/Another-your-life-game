export default async function handler(req, res) {

  const s = req.body;

  const prompt = `
人生シミュレーションを生成せよ。

名前:${s.name}
年齢:${s.age}
資産:${s.money}
社会:${s.social}

JSON形式で返す：

{
  "event":"文章",
  "tone":"good or bad",
  "choices":[
    {"text":"選択1","effect":{"money":0,"social":0,"luck":0}},
    {"text":"選択2","effect":{"money":0,"social":0,"luck":0}},
    {"text":"選択3","effect":{"money":0,"social":0,"luck":0}}
  ]
}
`;

  try {

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: prompt
      })
    });

    const data = await r.json();

    let text = "";

if(data.output_text){
  text = data.output_text;
}else{
  text = data.output?.[0]?.content?.[0]?.text || "";
}
    res.status(200).json(JSON.parse(text));

  } catch (e) {

    console.error(e);

    res.status(200).json({
      event: "エラー（AI応答失敗）",
      tone: "neutral",
      choices: []
    });

  }
}
