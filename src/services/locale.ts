// services/locale.ts
import { cookies, headers } from 'next/headers';

// 支持的语言白名单（可根据实际需求扩展）
const SUPPORTED_LOCALES = new Set(['en', 'zh', 'fr', 'de', 'ja']);

/**
 * 解析 Accept-Language 头部（符合 RFC 7231 规范）
 * @param header accept-language 头部值
 * @returns 标准化后的语言代码
 */
function parseAcceptLanguage(header: string): string {
  return header
    ?.trim()
    .split(/[,;]/)[0]        // 同时处理逗号和分号分隔符
    .trim()                  // 处理分割后的空格（如 "fr ; q=0.8"）
    .toLowerCase()           // 统一小写处理（如 "EN-US"）
    .split('-')[0];          // 提取主语言代码
}

/**
 * 获取用户首选语言（生产级实现）
 * 1. 优先读取 Cookie
 * 2. 其次解析 Accept-Language
 * 3. 默认 en 兜底
 * 4. 白名单校验
 */
export async function getUserLocale(): Promise<string> {
  try {
    // 优先从 Cookie 获取（带白名单校验）
    const cookieLocale = (await cookies()).get('NEXT_LOCALE')?.value;
    if (cookieLocale && SUPPORTED_LOCALES.has(cookieLocale)) {
      return cookieLocale;
    }

    // 解析 Accept-Language 头部
    const acceptLanguage = (await headers()).get('accept-language');
    if (acceptLanguage) {
      const parsedLocale = parseAcceptLanguage(acceptLanguage);
      if (SUPPORTED_LOCALES.has(parsedLocale)) {
        return parsedLocale;
      }
    }
  } catch (error) {
    console.error('Locale detection error:', error);
  }

  // 最终兜底（含白名单过滤）
  return SUPPORTED_LOCALES.has('en') ? 'en' : Array.from(SUPPORTED_LOCALES)[0];
}
