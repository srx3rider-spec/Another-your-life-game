export default async function handler(req, res) {
  try {
    const s = req.body;

    const prompt = `
あなたは人生シミュレーションゲームのエンジンです。

必ずJSONのみで答えてください。説明文は禁止。

{
 "event":"出来事",
 "tone":"good|neutral|bad",
 "choices":[
  {"text":"行動1","effect":{"money":-3～+3,"social":-3～+3,"luck":-3～+3}},
  {"text":"行動2","effect":{"money":-3～+3,"social":-3～+3,"luck":-3～+3}},
  {"text":"行動3","effect":{"money":-3～+3,"social":-3～+3,"luck":-3～+3}}
 ]
}

必ずランダムな内容にしてください。
「何も起きなかった」は禁止。
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

    // 🔥 テキスト抽出（完全対応）
    let text = "";

    if (data.output_text) {
      text = data.output_text;
    } else if (Array.isArray(data.output)) {
      text = data.output
        .flatMap(o => o.content || [])
        .map(c => c.text || "")
        .join("");
    }

    // 🔥 JSONだけ抜く
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      try {
        const json = JSON.parse(jsonMatch[0]);
        return res.status(200).json(json);
      } catch (e) {
        console.log("JSON parse失敗", e);
      }
    }

    throw new Error("JSON取れなかった");

  } catch (e) {
    console.error("エラー:", e);

    // 🔥 fallback（毎回同じにならないよう改善）
    const events = [
      "財布を落とした",
      "偶然いい出会いがあった",
      "仕事でミスをした",
      "臨時収入が入った",
      "体調を崩した"
    ];

    const randomEvent = events[Math.floor(Math.random() * events.length)];

    res.status(200).json({
      event: randomEvent,
      tone: "neutral",
      choices: [
        { text: "積極的に動く", effect: { money: 2, social: 1, luck: 1 } },
        { text: "様子を見る", effect: { money: 0, social: 0, luck: 1 } },
        { text: "無視する", effect: { money: -1, social: -1, luck: 0 } }
      ]
    });
  }
}
