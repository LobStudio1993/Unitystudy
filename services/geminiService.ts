import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System instructions tailored to the specific rules
const BASE_SYSTEM_INSTRUCTION = `
あなたはUnity技術メンターです。学生の自己解決能力を伸ばすことを最優先します。
すぐに答えを教えるのではなく、ヒントを与えたり、考え方を導いたりしてください。
以下のプロジェクトルールを厳守してください：

1. **命名規則**: クラス/メソッドはPascalCase、変数はcamelCase。
2. **変数公開**: public変数は禁止。Inspector設定用は必ず [SerializeField] private を推奨。
3. **パフォーマンス**: Update内でのGetComponent/Findは禁止。Cacheを推奨。
4. **日本語**: コード識別子に日本語禁止。コメントはOK。
5. **ドキュメント**: 「空のシーンから検証できる」手順を重視。

回答はMarkdown形式で行ってください。
`;

const REVIEW_SYSTEM_INSTRUCTION = `
あなたはUnityコードレビュアーです。
ユーザーから提出されたC#スクリプトを、以下の厳格なルールに基づいてチェックしてください。
問題点がある場合のみ指摘し、修正案を提示してください。

**チェックリスト**:
- [ ] public フィールドが使われていないか？ (全て [SerializeField] private にすべき)
- [ ] クラス名、メソッド名は PascalCase か？
- [ ] 変数名は camelCase か？
- [ ] Update() 内で GetComponent や Find などの重い処理を行っていないか？
- [ ] 識別子(変数名など)に日本語が含まれていないか？

褒める必要はありません。淡々と修正点と、なぜそうすべきかの理由（「他から書き換えられるリスクがあるため」など）を伝えてください。
`;

const DOC_GENERATOR_INSTRUCTION = `
あなたはUnityドキュメント作成アシスタントです。
渡されたC#スクリプトをもとに、「他人が空のシーンから検証できる」ドキュメントのドラフトを作成してください。

**必須フォーマット**:
1. **概要**: 1行で何をするスクリプトか。
2. **セットアップ手順 (重要)**:
   - どのGameObjectを作るか (Create Emptyなど)
   - どのコンポーネントをアタッチするか
   - Inspectorでどの変数に何を入れるか (スクリプトの[SerializeField]を見て推測する)
3. **動作確認**: 実行したらどうなるか。

出力はMarkdownで、ユーザーがそのままコピペして使えるようにしてください。
`;

const SPEC_DESIGN_INSTRUCTION = `
あなたは経験豊富なゲームプランナー兼Unityエンジニアです。
学生（企画者・デザイナー）からの「ゲーム仕様」に関する相談に乗り、プログラマーに伝わりやすい形に言語化するサポートをしてください。

**あなたの役割**:
1. **具体化**: 「なんとなくこんな感じ」というアイデアに対し、「その場合、Aのときはどう動く？」「Bの制限はどうする？」と質問し、仕様の穴を埋める。
2. **実装可能性の示唆**: Unityで実装する際に難易度が高すぎる仕様や、矛盾している仕様があれば優しく指摘し、代替案を出す。
3. **構造化**: 最終的に「仕様書」として使えるように、Markdownで整理して出力する。

**意識すべき点**:
- ユーザー（プレイヤー）の操作と、それに対するフィードバックを明確にする。
- 「例外処理（エッジケース）」を洗い出す（例：HP0で回復した時、画面外に出た時など）。
- プログラマーが読んで「変数」や「ステート」がイメージできる表現を使う。
`;

export const chatWithGemini = async (message: string, mode: 'general' | 'review' | 'docs' | 'spec' = 'general', imageBase64?: string): Promise<string> => {
    try {
        let systemInstruction = BASE_SYSTEM_INSTRUCTION;
        // Use gemini-3-pro-preview for all modes to ensure high quality responses
        const modelId = 'gemini-3-pro-preview';

        if (mode === 'review') {
            systemInstruction = REVIEW_SYSTEM_INSTRUCTION;
        } else if (mode === 'docs') {
            systemInstruction = DOC_GENERATOR_INSTRUCTION;
        } else if (mode === 'spec') {
            systemInstruction = SPEC_DESIGN_INSTRUCTION;
        }

        let contents: any = message;

        // If image is provided, construct a multimodal request
        if (imageBase64) {
            // Extract the actual base64 data and mime type from the data URL
            // Format example: "data:image/png;base64,iVBORw0KGgo..."
            const matches = imageBase64.match(/^data:(.+);base64,(.+)$/);
            if (matches) {
                const mimeType = matches[1];
                const data = matches[2];

                contents = {
                    parts: [
                        {
                            inlineData: {
                                mimeType: mimeType,
                                data: data
                            }
                        },
                        {
                            text: message
                        }
                    ]
                };
            }
        }

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: modelId,
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
            }
        });

        return response.text || "申し訳ありません。応答を生成できませんでした。";

    } catch (error) {
        console.error("Gemini API Error:", error);
        return "エラーが発生しました。APIキーまたはネットワーク接続を確認してください。";
    }
};