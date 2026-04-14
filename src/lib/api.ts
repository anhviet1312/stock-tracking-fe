export interface StockTrackingInfo {
  boardId: string;
  isin: string;
  adminStatus: string;
  caStatus?: string;
  ceiling: number;
  companyNameEn: string;
  companyNameVi: string;
  corporateEvents: any[];
  couponRate: number;
  coveredWarrantType: string;
  exchange: string;
  exercisePrice: number;
  firstTradingDate: string;
  floor: number;
  issuerName: string;
  lastTradingDate: string;
  market: string;
  maturityDate: string;
  parValue: number;
  permaHalt: boolean;
  refPrice: number;
  stockSymbol: string;
  stockType: string;
  tradingCurrencyISOCode: string;
  tradingDate: string;
  tradingStatus: string;
  tradingUnit: number;
  contractMultiplier: number;
  priorClosePrice: number;
  productId: string;
  lastMFSeq: number;
  remainForeignQtty: number;
  best1Bid: number;
  best1BidVol: number;
  best1Offer: number;
  best1OfferVol: number;
  best2Bid: number;
  best2BidVol: number;
  best2Offer: number;
  best2OfferVol: number;
  best3Bid: number;
  best3BidVol: number;
  best3Offer: number;
  best3OfferVol: number;
  expectedLastUpdate: number;
  expectedMatchedPrice: number;
  expectedMatchedVolume: number;
  expectedPriceChange: number;
  expectedPriceChangePercent: number;
  lastMESeq: number;
  avgPrice: number;
  highest: number;
  lowest: number;
  matchedPrice: number;
  matchedVolume: number;
  nmTotalTradedQty: number;
  nmTotalTradedValue: number;
  openPrice: number;
  priceChange: number;
  priceChangePercent: number;
  stockBUVol: number;
  stockVol: number;
  stockSDVol: number;
  buyForeignQtty: number;
  buyForeignValue: number;
  lastMTSeq: number;
  sellForeignQtty: number;
  sellForeignValue: number;
  session: string;
  oddSession: string;
  sessionPt: string;
  oddSessionPt: string;
  sessionRt: string;
  oddSessionRt: string;
  oddSessionRtStart: number;
  sessionRtStart: number;
  sessionStart: number;
  oddSessionStart: number;
  exchangeSession: string;
  isPreSessionPrice: boolean;
  clientName: string;
  clientNameEn: string;
}

const API_BASE_URL = 'http://localhost:8080/api/v1';

function scalePrices(stock: StockTrackingInfo): StockTrackingInfo {
  if (!stock) return stock;
  const d = (v: number) => typeof v === 'number' && v !== 0 ? v / 1000 : v;
  return {
    ...stock,
    ceiling: d(stock.ceiling),
    floor: d(stock.floor),
    refPrice: d(stock.refPrice),
    openPrice: d(stock.openPrice),
    highest: d(stock.highest),
    lowest: d(stock.lowest),
    avgPrice: d(stock.avgPrice),
    matchedPrice: d(stock.matchedPrice),
    expectedMatchedPrice: d(stock.expectedMatchedPrice),
    priorClosePrice: d(stock.priorClosePrice),
    best1Bid: d(stock.best1Bid),
    best2Bid: d(stock.best2Bid),
    best3Bid: d(stock.best3Bid),
    best1Offer: d(stock.best1Offer),
    best2Offer: d(stock.best2Offer),
    best3Offer: d(stock.best3Offer),
    priceChange: d(stock.priceChange),
    expectedPriceChange: d(stock.expectedPriceChange),
  };
}

export async function fetchStockGroup(group: string = 'VN30'): Promise<StockTrackingInfo[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/stocks/group/${group}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch stocks for group ${group}`);
    }
    const json = await response.json();
    return (json?.data || []).map(scalePrices);
  } catch (error) {
    console.error('Error fetching stock group:', error);
    return [];
  }
}

export async function fetchStockExchange(exchange: string): Promise<StockTrackingInfo[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/stocks/exchange/${exchange}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch stocks for exchange ${exchange}`);
    }
    const json = await response.json();
    return (json?.data || []).map(scalePrices);
  } catch (error) {
    console.error('Error fetching stock exchange:', error);
    return [];
  }
}

export async function fetchStockInfo(symbol: string): Promise<StockTrackingInfo | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/stocks/info/${symbol}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch stock info for ${symbol}`);
    }
    const json = await response.json();
    return json?.data ? scalePrices(json.data) : null;
  } catch (error) {
    console.error('Error fetching stock info:', error);
    return null;
  }
}

// ======================= AUTH DATA STRUCTURES =======================

export interface User {
  id: string;
  first_name?: string;
  last_name?: string;
  username: string;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  first_name?: string;
  last_name?: string;
  username: string;
  password?: string;
  email: string;
}

export interface LoginRequest {
  username: string;
  password?: string;
}

// ======================= FAVOURITE STOCKS ENDPOINTS =======================

export async function getFavouriteStocks(): Promise<StockTrackingInfo[]> {
  const token = localStorage.getItem('auth_token');
  if (!token) throw new Error("Unauthorized");
  
  const response = await fetch(`${API_BASE_URL}/protected/stocks/favourite`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const json = await response.json();
  if (!response.ok || (json?.code && json.code !== 'SUCCESS')) {
    throw new ApiError(json?.message || 'Failed to fetch favourite stocks', json?.code);
  }
  
  const list = json?.data || [];
  
  const promises = list.map(async (item: any) => {
    const sym = item.symbol || (item.stock_info && item.stock_info.symbol) || item.StockInfo?.Symbol;
    if (sym) {
      const rtStock = await fetchStockInfo(sym);
      if (rtStock) return rtStock;
    }
    
    // Fallback if real-time fetch fails
    const raw = item.stock_info || item.StockInfo || {};
    return scalePrices({
      stockSymbol: sym || '',
      companyNameEn: raw.company_name_en || raw.CompanyNameEn || '',
      companyNameVi: raw.company_name_vi || raw.CompanyNameVi || '',
      exchange: raw.exchange || raw.Exchange || '',
      matchedPrice: 0,
      priceChange: 0,
      priceChangePercent: 0,
      nmTotalTradedValue: 0,
    } as any);
  });

  return Promise.all(promises);
}

export async function getFavouriteSymbols(): Promise<string[]> {
  const token = localStorage.getItem('auth_token');
  if (!token) return [];
  
  const response = await fetch(`${API_BASE_URL}/protected/stocks/favourite`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const json = await response.json();
  if (!response.ok || (json?.code && json.code !== 'SUCCESS')) {
    return [];
  }
  
  const list = json?.data || [];
  return list.map((item: any) => item.symbol || (item.stock_info && item.stock_info.symbol) || item.StockInfo?.Symbol || '');
}

export async function removeFavouriteStock(symbol: string): Promise<void> {
  const token = localStorage.getItem('auth_token');
  if (!token) throw new Error("Unauthorized");
  
  const response = await fetch(`${API_BASE_URL}/protected/stocks/favourite/${symbol}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const json = await response.json();
  if (!response.ok || (json?.code && json.code !== 'SUCCESS')) {
    throw new ApiError(json?.message || 'Failed to remove favourite stock', json?.code);
  }
}

export async function addFavouriteStock(symbol: string): Promise<void> {
  const token = localStorage.getItem('auth_token');
  if (!token) throw new Error("Unauthorized");
  
  const response = await fetch(`${API_BASE_URL}/protected/stocks/favourite`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify({ symbol })
  });
  
  const json = await response.json();
  if (!response.ok || (json?.code && json.code !== 'SUCCESS')) {
    throw new ApiError(json?.message || 'Failed to add favourite stock', json?.code);
  }
}

// ======================= AUTH ENDPOINTS =======================

export class ApiError extends Error {
  code?: string;
  constructor(message: string, code?: string) {
    super(message);
    this.code = code;
    this.name = 'ApiError';
  }
}

export async function loginUser(req: LoginRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req)
  });
  
  const json = await response.json();
  if (!response.ok || (json?.code && json.code !== 'SUCCESS')) {
    throw new ApiError(json?.message || 'Login failed', json?.code);
  }
  return json.data;
}

export async function registerUser(req: RegisterRequest): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req)
  });

  const json = await response.json();
  if (!response.ok || (json?.code && json.code !== 'SUCCESS')) {
    throw new ApiError(json?.message || 'Registration failed', json?.code);
  }
  return json.data;
}
