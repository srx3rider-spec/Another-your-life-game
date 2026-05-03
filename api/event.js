export default async function handler(req, res) {
  try {
    const s = req.body;

    const prompt = `
あなたは人生シミュレーションゲームのイベント生成AIです。

以下の人物に起きる「1つの出来事」を自然な日本語で書いてください。

名前:${s.name}
年齢:${s.age}
資産:${s.money}
社会:${s.social}

短く1文で。
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

    let text = "";

    if (data.output_text) {
      text = data.output_text;
    } else if (data.output?.[0]?.content?.[0]?.text) {
      text = data.output[0].content[0].text;
    }

    // ▼ ここで手動JSON化（壊れない）
    res.status(200).json({
      event: text || "何も起きなかった",
      tone: "neutral",
      choices: [
        { text: "行動する", effect: { money: 1, social: 1, luck: 1 } },
        { text: "様子を見る", effect: { money: 0, social: 0, luck: 0 } },
        { text: "無視する", effect: { money: -1, social: -1, luck: 0 } }
      ]
    });

  } catch (e) {
    console.error(e);

    res.status(200).json({
      event: "エラー（API失敗）",
      tone: "neutral",
      choices: []
    });
  }
}
