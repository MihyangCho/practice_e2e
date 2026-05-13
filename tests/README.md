# テスト実行ガイド

## E2Eテストを実行する

```bash
npx playwright test
```

`tests/` 配下の `*.spec.ts` ファイルをすべて実行します。

特定のファイルだけ実行する場合は、ファイルパスを指定します。

```bash
npx playwright test tests/form-submit.spec.ts
```

## テスト結果を HTML レポートで確認する

```bash
npx playwright show-report
```

直近の実行結果がブラウザで開き、テストごとのステップ・スクリーンショット・トレースを一覧できます。

> `playwright.config.ts` で `reporter: 'html'` が指定されているため、`npx playwright test` 実行時に `playwright-report/` 配下にレポートが自動生成されます。`show-report` はそれを表示するコマンドです。
