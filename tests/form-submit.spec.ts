import { test, expect } from '@playwright/test';

test.describe('H-1: フォーム正常送信フロー', () => {
  test('全項目入力 → Submit が成功する', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/angularpractice/');

    // ページ下部の「Two-way Data Binding」入力欄と区別するため、対象フォームを限定する
    const form = page.locator('form');
    const submitButton = page.getByRole('button', { name: 'Submit' });

    // 1. Name に「Taro Yamada」を入力
    await form.locator('input[name="name"]').fill('Taro Yamada');

    // 2. Email に「taro@example.com」を入力
    await form.locator('input[name="email"]').fill('taro@example.com');

    // 期待結果 2: 手順1〜2の入力完了後、Submit ボタンが enabled かつ btn-success (緑色) である
    await expect(submitButton).toBeEnabled();
    await expect(submitButton).toHaveClass(/btn-success/);

    // 3. Password に「password123」を入力
    await form.getByPlaceholder('Password').fill('password123');

    // 4. Check me out チェックボックスをチェック
    const agreeCheckbox = page.locator('#exampleCheck1');
    await agreeCheckbox.check();
    await expect(agreeCheckbox).toBeChecked();

    // 期待結果 1: 手順4の後、Age フィールドが画面に表示される
    // ※ 実サイトに Age フィールドは存在しないため soft アサーションで差異を記録
    const ageField = form.locator('input[name="age"], #age, label:has-text("Age") + input');
    await expect.soft(ageField).toBeVisible();

    // 5. Age フィールド入力 → 実サイトに該当要素が無いためスキップ（仕様と実装の差異）

    // 6. Gender で「Male」を選択
    await page.locator('#exampleFormControlSelect1').selectOption('Male');

    // 7. Employment Status で「Employed」を選択
    const employedRadio = page.locator('#inlineRadio2');
    await employedRadio.check();
    await expect(employedRadio).toBeChecked();

    // 8. Date of Birth に「1995-01-01」を設定
    await form.locator('input[name="bday"]').fill('1995-01-01');

    // 9. Submit ボタンをクリック
    await submitButton.click();

    // 期待結果 3: ページ上部に成功メッセージが alert-success クラスで表示される
    const successAlert = page.locator('.alert.alert-success');
    await expect(successAlert).toBeVisible();
    // ×ボタンが子要素として含まれるため、toHaveText ではなく toContainText で本文を厳密検証
    await expect(successAlert).toContainText('Success! The Form has been submitted successfully!.');

    // 期待結果 4: 成功メッセージ右上に × (close) ボタンが表示される
    const closeButton = successAlert.getByRole('link', { name: 'close' });
    await expect(closeButton).toBeVisible();
    await expect(closeButton).toHaveText('×');
  });
});
