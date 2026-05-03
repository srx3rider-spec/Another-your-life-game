export default async function handler(req, res) {

  const s = req.body;

const prompt = `
あなたは「人生シミュレーションエンジン」です。

以下の人物の人生を、リアルかつドラマ性を持って生成してください。

条件：
・ありきたり禁止
・感情と葛藤を必ず入れる
・現実的だが予想外の展開
・短くても印象的に（1〜2行）

出力はJSONのみ：

{
 "event":"",
 "tone":"good|neutral|bad",
 "choices":[
  {"text":"","effect":{"money":0,"social":0,"luck":0}},
  {"text":"","effect":{"money":0,"social":0,"luck":0}},
  {"text":"","effect":{"money":0,"social":0,"luck":0}}
 ]
}

人物：
名前:${s.name}
年齢:${s.age}
資産:${s.money}
社会性:${s.social}
運:${s.luck}
`;
  

