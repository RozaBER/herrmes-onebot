/**
 * puppeteer-core 类型声明
 * 仅包含本项目使用到的类型
 */

declare module "puppeteer-core" {
  export interface Viewport {
    width: number;
    height: number;
    deviceScaleFactor?: number;
    isMobile?: boolean;
    hasTouch?: boolean;
    isLandscape?: boolean;
  }

  export interface ScreenshotOptions {
    path?: string;
    type?: "png" | "jpeg" | "webp";
    quality?: number;
    fullPage?: boolean;
    clip?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    encoding?: "base64" | "binary";
    captureBeyondViewport?: boolean;
  }

  export interface Page {
    setViewport(viewport: Viewport): Promise<void>;
    setContent(html: string, options?: { waitUntil?: string | string[] }): Promise<void>;
    evaluateHandle(pageFunction: (...args: unknown[]) => unknown): Promise<unknown>;
    evaluate<T>(pageFunction: (...args: unknown[]) => T): Promise<T>;
    screenshot(options?: ScreenshotOptions): Promise<string | Buffer>;
    close(): Promise<void>;
  }

  export interface Browser {
    newPage(): Promise<Page>;
    close(): Promise<void>;
  }

  export interface LaunchOptions {
    executablePath?: string;
    headless?: boolean | "new";
    args?: string[];
    defaultViewport?: Viewport;
    ignoreHTTPSErrors?: boolean;
    slowMo?: number;
  }

  export function launch(options?: LaunchOptions): Promise<Browser>;
}
