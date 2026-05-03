export default async function handler(req, res) {
  try {
    const s = req.body;

    const prompt = `
人生シミュレーションを生成せよ。

名前:${s.name}
年齢:${s.age}
資産:${s.money}
社会:${s.social}

JSON形式で出力:
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

    // ★ここが重要（安全に取り出す）
    let text = "";

    if (data.output_text) {
      text = data.output_text;
    } else if (data.output?.[0]?.content?.[0]?.text) {
      text = data.output[0].content[0].text;
    }

    // JSON変換（失敗防止）
    try {
      const json = JSON.parse(text);
      res.status(200).json(json);
    } catch {
      res.status(200).json({
        event: "エラー（AI応答解析失敗）",
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
