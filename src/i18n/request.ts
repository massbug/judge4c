import {getRequestConfig} from 'next-intl/server';
import {getUserLocale} from '@/services/locale';
import {defaultLocale} from '@/i18n/config';


export default getRequestConfig(async () => {
    // Provide a static locale, fetch a user setting,
    // read from `cookies()`, `headers()`, etc.

    let locale = await getUserLocale();
    if (!locale) {
        locale = defaultLocale;
    }

    let messages;
    try {
        // 尝试加载用户对应的国际化资源文件
        messages = (await import(`../../messages/${locale}.json`)).default;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        // 如果加载失败则回退到默认语言 'en'
        locale = defaultLocale;
        messages = (await import(`../../messages/en.json`)).default;
    }

    return {
        locale,
        messages
        //, revalidate: 3600
    };

});



