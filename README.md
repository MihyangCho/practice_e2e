
# e2eテストについて


## 何をテストすべきか

- ユーザーが実際に操作するフローが、システム全体に対して問題なく動くこと
- ユーザーが実際に操作する標準フロー、エラーや失敗などの異常系


## Unitと結合テストとはどう分けるべきか

- **Unitテスト**：コードの最小単位（関数やメソッド）が意図した通りに動作するかを検証する
- **結合テスト**：ユニット間の連携が正しく機能するか、データ連携が正しいかを検証する
- **E2Eテスト**：システム全体の処理が正しいかを **ユーザー視点** で検証する



## 良いE2Eテストとは何か

### ① メンテナンスコストが低い

- クリティカルパスが網羅されている
  - **正常系**：動かないとビジネスが止まる標準フロー
  - **異常系**：〇〇エラー、〇〇失敗

### ② 実行環境やデータに依存しない

- データのクリーンアップ、待機処理の適切さ

### ③ 実装の詳細に依存しない

- 内部実装でテストが止まらないように

### ④ テストの目的が「1つ」に絞られている

- **粒度**：一貫した流れ
- **独立性**：他のテストの結果に依存しない
- **速度**：必要最小限のステップで完結

### ⑤ ピラミッド構造を意識している（それは本当にE2Eでやるべきか？）

- Unit、結合と使い分けられていること


# playwright 基礎について


## ① Navigation（ページ遷移）

- ブラウザのページ遷移を制御するメソッド群
- すべて `page` オブジェクトに対して使い、戻り値は `Response | null` を返す

```javascript
await page.goto('https://example.com');     // 指定URLへ移動
await page.goBack();                         // 履歴を1つ戻る
await page.goForward();                      // 履歴を1つ進む
await page.reload();                         // 現在のページを再読み込み
```



## ② Locator（要素の取得）

- ページ内の要素を特定するためのメソッド
- `getBy*` 系はユーザーから見える属性で要素を探すため推奨される
- `getBy*` 系で取れない場合のフォールバックとして `locator()` を使う

```javascript
page.getByRole('button', { name: 'Submit' });   // role属性で取得（最も推奨）
page.getByText('ログイン');                       // 表示テキストで取得
page.getByLabel('メールアドレス');                 // ラベルに紐づく入力欄を取得
page.getByTestId('submit-btn');                  // data-testid属性で取得
page.locator('.btn-primary');                    // CSS/XPathセレクタで取得（汎用）
```



## ③ Actions（要素への操作）

- Locator で取得した要素に対する操作
- すべて `await` が必要
- `fill()` は既存の値をクリアしてから入力する
- 追加入力したい場合は `pressSequentially()` を使う

```javascript
await page.getByRole('button').click();                       // クリック
await page.getByLabel('名前').fill('山田太郎');                 // 入力欄に値を入力
await page.getByRole('textbox').press('Enter');               // キー押下
await page.getByLabel('利用規約に同意').check();                // チェックボックスをON
await page.getByLabel('国').selectOption('Japan');             // <select>から選択
await page.getByRole('link', { name: 'メニュー' }).hover();    // ホバー
```



## ④ Assertions（アサーション=検証）

- テストの期待結果を検証する
- `expect()` で Locator や page をラップして使う
- **自動リトライ機能**があり、条件が満たされるまで一定時間待ってくれる

```javascript
import { expect } from '@playwright/test';

await expect(page).toHaveURL('https://example.com/dashboard');         // URL検証
await expect(page.getByRole('alert')).toBeVisible();                   // 表示されているか
await expect(page.getByLabel('名前')).toHaveValue('山田太郎');          // input要素の値
await expect(page.getByRole('listitem')).toHaveCount(3);               // 要素数
await expect(page.getByRole('heading')).toHaveText('ようこそ');         // テキスト一致を検証
```



## ⑤ Get Value（値の取得）

- 要素から値を取り出すメソッド群
- すべて Promise を返すため `await` が必要

```javascript
const text = await page.getByRole('heading').textContent();         // 表示テキスト取得
const value = await page.getByLabel('名前').inputValue();            // input/textareaの値取得
const href = await page.getByRole('link').getAttribute('href');      // 属性値取得
const texts = await page.getByRole('listitem').allTextContents();    // 複数要素のテキストを配列で取得
```

