export default async function handler(req, res) {
  try {
    const s = req.body;

    const prompt = `
人生シミュレーションを生成せよ。

名前:${s.name}
年齢:${s.age}
資産:${s.money}
社会:${s.social}

必ずJSONのみ出力。他の文章は禁止。

{
 "event":"...",
 "tone":"good|neutral|bad",
 "choices":[
  {"text":"...", "effect":{"money":0,"social":0,"luck":0}},
  {"text":"...", "effect":{"money":0,"social":0,"luck":0}},
  {"text":"...", "effect":{"money":0,"social":0,"luck":0}}
 ]
}
`;

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

    // ▼ 安全にテキスト取り出し
    let text = "";

    if (data.output_text) {
      text = data.output_text;
    } else if (data.output?.[0]?.content?.[0]?.text) {
      text = data.output[0].content[0].text;
    }

    // ▼ JSON部分だけ抽出
    const match = text.match(/\{[\s\S]*\}/);

    if (match) {
      const json = JSON.parse(match[0]);
      res.status(200).json(json);
    } else {
      res.status(200).json({
        event: "エラー（JSON抽出失敗）",
        tone: "neutral",
        choices: []
      });
    }

  } catch (e) {
    console.error(e);

    res.status(200).json({
      event: "エラー（API失敗）",
      tone: "neutral",
      choices: []
    });
  }
}
