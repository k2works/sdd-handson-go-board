import { After, AfterAll, Before, BeforeAll, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, type Browser, type BrowserContext } from 'playwright';
import { createServer, type ViteDevServer } from 'vite';
import type { GoBoardWorld } from './world';

setDefaultTimeout(30_000);

let server: ViteDevServer;
let browser: Browser;
let context: BrowserContext;

BeforeAll(async function () {
  server = await createServer({ server: { port: 0, strictPort: false }, logLevel: 'error' });
  await server.listen();
  // PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH を指定すると、そのブラウザで実行する（Playwright のブラウザを入れていない環境向け）。
  try {
    browser = await chromium.launch({
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
    });
  } catch (error) {
    await server.close();
    throw new Error(
      '受け入れテスト用の Chromium を起動できません。先に `npm run test:acceptance:setup` を実行してください。' +
        `\n${error instanceof Error ? error.message : String(error)}`,
    );
  }
});

Before(async function (this: GoBoardWorld) {
  const url = server.resolvedUrls?.local[0];
  if (!url) {
    throw new Error('開発サーバーの URL を取得できません');
  }
  this.baseUrl = url;
  context = await browser.newContext();
  this.page = await context.newPage();
});

After(async function () {
  await context?.close();
});

AfterAll(async function () {
  await browser?.close();
  await server?.close();
});
