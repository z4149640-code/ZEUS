import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';
import { routing } from '@/lib/i18n-navigation';

export default getRequestConfig(async (params: any) => {
  // next-intl v3 passes { locale }, v4 passes { requestLocale: Promise<string> }
  let loc = params.locale;
  if (!loc && params.requestLocale) {
    loc = await params.requestLocale;
  }
  if (!loc) loc = 'en';

  // Validate that the incoming `locale` parameter is valid
  if (!routing.locales.includes(loc as any)) notFound();

  return {
    locale: loc,
    messages: (await import(`./messages/${loc}.json`)).default
  };
});
