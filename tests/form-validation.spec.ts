// Homeページ異常系
import { test, expect } from '@playwright/test';

test.describe('H-2: バリデーションエラー表示確認', () => {
  test('Name/Email の必須・最小長エラー表示と Submit 状態', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/angularpractice/');

    const form = page.locator('form');
    const nameInput = form.locator('input[name="name"]');
    const emailInput = form.locator('input[name="email"]');
    const submitButton = page.getByRole('button', { name: 'Submit' });

    // エラーメッセージは入力欄と同じ .form-group 配下に動的挿入される
    const nameError = form.locator('.form-group:has(> input[name="name"]) .alert.alert-danger');
    const emailError = form.locator('.form-group:has(> input[name="email"]) .alert.alert-danger');

    // 1. Name フィールドをクリックしてフォーカス
    await nameInput.click();

    // 2. 何も入力せず Tab で blur（実ユーザー操作と等価で Angular の ng-touched が確実に付く）
    await page.keyboard.press('Tab');

    // 期待結果 1: 「Name is required」が alert alert-danger で表示される
    await expect(nameError).toBeVisible();
    await expect(nameError).toHaveText('Name is required');

    // 3. Name に「A」と1文字だけ入力
    await nameInput.fill('A');

    // 期待結果 2: メッセージが「Name must be at least 2 characters long」に変化する
    // ※ 実装は「Name should be at least 2 characters」のためシナリオ通り厳密一致で失敗する想定
    // soft アサーションで失敗を記録しつつ後続検証を続行する
    await expect.soft(nameError).toHaveText('Name must be at least 2 characters long');

    // 4. Email フィールドをクリックしてフォーカス
    await emailInput.click();

    // 5. 何も入力せず Tab で blur
    await page.keyboard.press('Tab');

    // 期待結果 3: 「Email is required」が alert alert-danger で表示される
    await expect(emailError).toBeVisible();
    await expect(emailError).toHaveText('Email is required');

    // 6. Submit ボタンの状態を確認
    // 期待結果 4: Submit ボタンは disabled
    // ※ 実装には disabled バインディングが無いためシナリオ通りに書くと失敗する想定
    // soft アサーションで仕様と実装の差異を記録
    await expect.soft(submitButton).toBeDisabled();
  });
});
