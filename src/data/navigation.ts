import type { Locale } from "../i18n/config";
import type { RouteKey } from "../i18n/routes";
import { navigationRouteKeys, routeAlternates } from "../i18n/routes";

export type NavigationItem = {
  key: RouteKey;
  href: Record<Locale, string>;
  label: Record<Locale, string>;
};

export const navigationItems: NavigationItem[] = navigationRouteKeys.map((routeKey) => {
  const route = routeAlternates[routeKey];

  return {
    key: route.key,
    href: route.path,
    label: route.label
  };
});
