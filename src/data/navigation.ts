import type { Locale } from "../i18n/config";
import {
  getAlternatePaths,
  getLocalizedPath,
  getStaticRouteParams,
  navigationRouteKeys,
  routeAlternates
} from "../i18n/routes";
import type { LocalizedRoute, RouteKey } from "../i18n/routes";

export type { LocalizedRoute, RouteKey };

export {
  getAlternatePaths,
  getLocalizedPath,
  getStaticRouteParams,
  navigationRouteKeys,
  routeAlternates
};

export type NavigationItem = {
  key: RouteKey;
  label: Record<Locale, string>;
  href: Record<Locale, string>;
};

export const navigationItems: NavigationItem[] = navigationRouteKeys.map((routeKey) => ({
  key: routeKey,
  label: routeAlternates[routeKey].label,
  href: routeAlternates[routeKey].path
}));