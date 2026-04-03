export const normalizeMarketplaceName = (name: string): string => {
  if (!name) return '';
  
  // Handle common variations and misspellings
  const normalized = name
  
  // Map of variations to standard names
  const variations: Record<string, string> = {
    'shopfiy': 'shopify',
    'shopify': 'shopify',
    'woocommerce': 'woocommerce',
    'woo': 'woocommerce',
    'ebay': 'ebay',
    'e bay': 'ebay',
    'amazon': 'amazon',
    'etsy': 'etsy',
    'tiktok': 'tiktok',
    'tik tok': 'tiktok',
  };
  
  return variations[normalized] || normalized;
};