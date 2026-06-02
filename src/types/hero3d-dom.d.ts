export type HeroPanelDataset = DOMStringMap & {
  panelId?: string;
  priority?: string;
  desktopVisible?: string;
  tabletVisible?: string;
  mobileVisible?: string;
  anchorX?: string;
  anchorY?: string;
  anchorZ?: string;
  fallbackX?: string;
  fallbackY?: string;
  depth?: string;
  lift?: string;
  parallax?: string;
};

export type HeroPanelElement = HTMLAnchorElement & {
  dataset: HeroPanelDataset;
};