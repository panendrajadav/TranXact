// Wallet address to name mapping for private greetings
const WALLET_GREETINGS: Record<string, string> = {
  'ZRQWVCEG4DT7KPRSERG6OOZAK6YMOJEBR6FEV253FAWWW6FCZQXEQT3EMY': 'Thanuj',
  'XG2SGTDHQMMGZECHVU3CH3WXFBLLDNYJIAZ3C2VOGP774IYJMNJ4MEDWAY': 'Panendra Jadav',
  'TKGFF4H6JDORXE52EMHSE4RQBS6Q2AN7ONIP3HY2NSIH2EH2WDJMXY4QMM': 'Phani Jadav'
};

export function getWalletGreeting(walletAddress: string | null): string | null {
  if (!walletAddress) return null;
  return WALLET_GREETINGS[walletAddress] || null;
}