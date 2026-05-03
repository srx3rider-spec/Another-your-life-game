export default async function handler(req, res) {
  try {
    const s = req.body;

    const prompt = `
人生ゲームのイベントを作れ。

必ずJSONのみで返せ。

{
 "event":"出来事",
 "tone":"good|neutral|bad",
 "choices":[
  {"text":"行動1","effect":{"money":0,"social":0,"luck":0}},
  {"text":"行動2","effect":{"money":0,"social":0,"luck":0}},
  {"text":"行動3","effect":{"money":0,"social":0,"luck":0}}
 ]
}

何も起きないは禁止。
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

    // 🔥 安全にテキスト取得（これが重要）
    let text = "";

    if (typeof data.output_text === "string") {
      text = data.output_text;
    } else if (Array.isArray(data.output)) {
      text = data.output
        .flatMap(o => o.content || [])
        .map(c => c.text || "")
        .join("");
    }

    // 🔥 JSON抽出
    const match = text.match(/\{[\s\S]*\}/);

    if (match) {
      try {
        const json = JSON.parse(match[0]);

        res.status(200).json(json);
        return;

      } catch (e) {
        console.log("JSON parse失敗", e);
      }
    }

    // 🔥 fallback（絶対止まらない）
    res.status(200).json({
      event: "予想外の出来事が起きた",
      tone: "neutral",
      choices: [
        { text: "行動する", effect: { money: 2, social: 1, luck: 1 } },
        { text: "様子を見る", effect: { money: 0, social: 0, luck: 1 } },
        { text: "無視する", effect: { money: -1, social: -1, luck: 0 } }
      ]
    });

  } catch (e) {
    console.error("完全エラー:", e);

    res.status(200).json({
      event: "大きなトラブルが起きた",
      tone: "bad",
      choices: [
        { text: "対処する", effect: { money: -2, social: 1, luck: 1 } },
        { text: "逃げる", effect: { money: -1, social: -2, luck: 0 } },
        { text: "誰かに頼る", effect: { money: -1, social: 2, luck: 1 } }
      ]
    });
  }
}
