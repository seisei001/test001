import Anthropic from '@anthropic-ai/sdk';

// 小説などのテキストをClaude(Anthropic API)に解析させ、朗読の断片ごとに
// 「感情」と「動作」を判定してもらい、JSON配列として返す。
//
// 重要: ブラウザから直接、ユーザー自身のAPIキーでAnthropic APIを呼び出す
// (サーバーを持たない静的サイトのため)。これは公式SDKの `dangerouslyAllowBrowser`
// オプションで意図的に有効化する機能で、有効にするとAPIキーがブラウザの
// JavaScriptから見える状態になる。個人が自分のAPIキーを自分のブラウザで
// 使うツールとしての利用を想定しており、他人と共有するページには絶対に
// 自分のAPIキーを入力しないこと。

export const AVAILABLE_EMOTIONS = ['happy', 'angry', 'sad', 'relaxed', 'surprised', 'neutral'];
export const AVAILABLE_ACTIONS = [
  'Angry', 'Blush', 'Clapping', 'Goodbye', 'Jump',
  'LookAround', 'Relax', 'Sad', 'Sleepy', 'Surprised', 'Thinking',
  'none',
];

const SYSTEM_PROMPT = `あなたは物語のテキストを分析し、朗読に合わせてVRMアバターを演技させるための演出データを作るアシスタントです。
渡されたテキストを、意味の区切りがよい短い断片(1〜3文程度)に分割し、各断片について次の3つの情報を持つオブジェクトの配列を作ってください。

- text: その断片の原文(そのまま。省略・要約しないこと)
- emotion: 次のいずれか一つ: ${AVAILABLE_EMOTIONS.join(', ')}
- action: 次のいずれか一つ: ${AVAILABLE_ACTIONS.join(', ')}(該当する動作が無ければ"none")

出力は必ずJSON配列のみとし、説明文やコードブロックの記号(\`\`\`等)を一切含めないでください。`;

function extractJsonArray(text) {
  // モデルがコードブロックで囲んでしまった場合の保険(指示はしているが念のため)
  const trimmed = text.trim();
  const match = trimmed.match(/\[[\s\S]*\]/);
  return match ? match[0] : trimmed;
}

/**
 * @param {string} apiKey - ユーザー自身のAnthropic APIキー
 * @param {string} novelText - 解析対象のテキスト
 * @returns {Promise<Array<{text:string, emotion:string, action:string}>>}
 */
export async function analyzeNovelText(apiKey, novelText) {
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const response = await client.messages.create({
    model: 'claude-opus-5',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    output_config: { effort: 'low' },
    messages: [{ role: 'user', content: novelText }],
  });

  const textBlock = response.content.find((b) => b.type === 'text');
  if (!textBlock) throw new Error('AIからテキスト応答が得られませんでした');

  let segments;
  try {
    segments = JSON.parse(extractJsonArray(textBlock.text));
  } catch (err) {
    throw new Error('AIの応答をJSONとして解析できませんでした: ' + err.message);
  }
  if (!Array.isArray(segments)) throw new Error('AIの応答がJSON配列ではありませんでした');

  return segments
    .filter((s) => s && typeof s.text === 'string' && s.text.trim())
    .map((s) => ({
      text: s.text,
      emotion: AVAILABLE_EMOTIONS.includes(s.emotion) ? s.emotion : 'neutral',
      action: AVAILABLE_ACTIONS.includes(s.action) ? s.action : 'none',
    }));
}
