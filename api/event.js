export default async function handler(req, res) {
  try {
    const s = req.body;

    const prompt = `
あなたは人生シミュレーションゲームのイベント生成AIです。

以下の人物に対して、
「必ず変化があるイベント」と「選択肢3つ」を作ってください。

【条件】
・何も起きないは禁止
・イベントは1〜2文
・選択肢ごとに結果が変わる
・effectは -5〜+5 の整数
・必ずJSONのみ出力

【人物】
名前:${s.name}
年齢:${s.age}
資産:${s.money}
社会:${s.social}

【出力形式】
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

    let text = "";

    if (data.output_text) {
      text = data.output_text;
    } else if (data.output?.[0]?.content?.[0]?.text) {
      text = data.output[0].content[0].text;
    }

    // ▼ JSON抽出（壊れても拾う）
    const match = text.match(/\{[\s\S]*\}/);

    if (match) {
      try {
        const json = JSON.parse(match[0]);

        // ▼ 安全補正（壊れ対策）
        if (!json.event) json.event = "思わぬ出来事が起きた";
        if (!json.tone) json.tone = "neutral";
        if (!Array.isArray(json.choices)) {
          json.choices = [];
        }

        // ▼ choicesが足りない時の補完
        while (json.choices.length < 3) {
          json.choices.push({
            text: "様子を見る",
            effect: { money: 0, social: 0, luck: 0 }
          });
        }

        res.status(200).json(json);
        return;

      } catch {
        // JSON壊れてた場合
      }
    }

    // ▼ fallback（絶対止まらない）
    res.status(200).json({
      event: text || "突然、予想外の出来事が起きた",
      tone: "neutral",
      choices: [
        { text: "行動する", effect: { money: 2, social: 1, luck: 1 } },
        { text: "慎重に様子を見る", effect: { money: 0, social: 0, luck: 1 } },
        { text: "無視する", effect: { money: -1, social: -1, luck: 0 } }
      ]
    });

  } catch (e) {
    console.error(e);

    res.status(200).json({
      event: "重大なトラブルが発生した",
      tone: "bad",
      choices: [
        { text: "対処する", effect: { money: -2, social: 0, luck: 1 } },
        { text: "逃げる", effect: { money: -1, social: -2, luck: 0 } },
        { text: "誰かに頼る", effect: { money: -1, social: 2, luck: 1 } }
      ]
    });
  }
}
if (e.tone === "good") body.className = "good";
if (e.tone === "bad") body.className = "bad";
if (Math.random() < 0.05) {
  event = "人生が大きく変わる出来事が起きた";
}
state.history.push(event);
