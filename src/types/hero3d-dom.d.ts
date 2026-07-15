export type HeroPanelDataset = DOMStringMap & {
  panelId?: string;
  priority?: string;
  desktopVisible?: string;
  tabletVisible?: string;
  mobileVisible?: string;
  fallbackX?: string;
  fallbackY?: string;
  parallax?: string;
};

export type HeroPanelElement = HTMLAnchorElement & {
  dataset: HeroPanelDataset;
};