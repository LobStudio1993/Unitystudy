import { Terminal, FileCode, Users, BookOpen, AlertTriangle } from 'lucide-react';
import { RuleSection } from './types';

export const APP_NAME = "Unity DevMate";

export const PHILOSOPHY_POINTS = [
    {
        title: "自己解決能力の向上",
        desc: "「自分たちより詳しい人はいない」前提で動く。まずは自分で手を動かし、調査する。",
        icon: Users
    },
    {
        title: "相談は「見える場所」で",
        desc: "DM禁止。知識は全員で共有する。ただし、最初から一緒にコードを書かず、まずは個人の力で挑む。",
        icon: Terminal
    },
    {
        title: "再現性の徹底",
        desc: "ドキュメントは「空のシーンから検証できる」状態を作る。他人が再現できなければ意味がない。",
        icon: BookOpen
    }
];

export const CODING_RULES: RuleSection[] = [
    {
        id: 'naming',
        title: '命名規則 (Naming)',
        icon: FileCode,
        content: 'コードの可読性を保つための基本ルールです。',
        items: [
            'クラス名 / メソッド名: PascalCase (例: SlidePanel, HandleClick)',
            '変数名 / 引数: camelCase (例: slideDistance, targetPanel)',
            '日本語使用禁止: ファイル名・クラス名・変数名は必ず英語。コメントやDebug.Logは日本語OK。'
        ]
    },
    {
        id: 'safety',
        title: '安全設計 (Safety)',
        icon: AlertTriangle,
        content: 'バグを防ぎ、堅牢な設計にします。',
        items: [
            'public変数の禁止: インスペクタ設定用変数は [SerializeField] private を使用する。',
            '他スクリプトからの予期せぬ書き換えを防ぐため。'
        ]
    },
    {
        id: 'performance',
        title: 'パフォーマンス (Performance)',
        icon: Terminal,
        content: 'モバイル実機でも快適に動作させるための鉄則です。',
        items: [
            'Update内で重い処理をしない: GetComponent, Find等はStart/Awakeでキャッシュする。',
            'Debug.Logの管理: 検証終了後は削除またはコメントアウト。'
        ]
    }
];

export const DOC_TEMPLATE = `
# [ClassName] セットアップ手順

## 目的
[このスクリプトが何をするものか簡潔に]

## 手順 (空のシーンからの再現手順)
1. Hierarchy で右クリック > Create Empty を作成し、名前を "[ObjectName]" に変更。
2. Inspector で Add Component > "[ClassName]" をアタッチ。
3. Inspector の設定項目:
    - **Speed**: 5 に設定
    - **Target**: シーン上の Cube をドラッグ＆ドロップ
4. 実行して [期待される動作] を確認。

## トラブルシュート
- 動かない場合は [X] を確認してください。
`;