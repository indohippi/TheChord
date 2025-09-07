export interface TradeOffer {
  id: string;
  sellerId: string;
  sellerName: string;
  itemId: string;
  itemName: string;
  itemDescription: string;
  itemIcon: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  currency: 'gold' | 'echoes' | 'materials';
  currencyAmount?: number;
  currencyMaterialId?: string;
  condition: 'new' | 'used' | 'damaged' | 'broken';
  quality: 'normal' | 'fine' | 'superior' | 'epic' | 'legendary';
  enchantments?: {
    id: string;
    name: string;
    level: number;
    description: string;
  }[];
  listingDate: Date;
  expiryDate?: Date;
  isActive: boolean;
  isPrivate: boolean;
  allowedBuyers?: string[];
  minimumLevel?: number;
  minimumReputation?: number;
  tags: string[];
  location: string;
  deliveryMethod: 'pickup' | 'mail' | 'instant';
  deliveryCost: number;
  sellerRating: number;
  sellerReviewCount: number;
}

export interface TradeTransaction {
  id: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  offerId: string;
  itemId: string;
  itemName: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  currency: 'gold' | 'echoes' | 'materials';
  currencyAmount?: number;
  currencyMaterialId?: string;
  transactionDate: Date;
  status: 'pending' | 'completed' | 'cancelled' | 'disputed' | 'refunded';
  deliveryStatus: 'pending' | 'shipped' | 'delivered' | 'failed';
  deliveryDate?: Date;
  trackingNumber?: string;
  buyerRating?: number;
  sellerRating?: number;
  buyerReview?: string;
  sellerReview?: string;
  disputeReason?: string;
  refundAmount?: number;
  fees: {
    listingFee: number;
    transactionFee: number;
    deliveryFee: number;
    totalFees: number;
  };
}

export interface TradeRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  targetId: string;
  targetName: string;
  type: 'buy' | 'sell' | 'exchange';
  items: {
    itemId: string;
    itemName: string;
    quantity: number;
    pricePerUnit?: number;
    notes?: string;
  }[];
  currency?: {
    type: 'gold' | 'echoes' | 'materials';
    amount: number;
    materialId?: string;
  };
  message: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired' | 'cancelled';
  createdAt: Date;
  expiresAt: Date;
  respondedAt?: Date;
  responseMessage?: string;
}

export interface TradeHistory {
  id: string;
  playerId: string;
  transactionId: string;
  type: 'buy' | 'sell';
  itemId: string;
  itemName: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  currency: 'gold' | 'echoes' | 'materials';
  currencyAmount?: number;
  currencyMaterialId?: string;
  transactionDate: Date;
  counterpartyId: string;
  counterpartyName: string;
  rating: number;
  review: string;
  tags: string[];
}

export interface TradeStatistics {
  playerId: string;
  totalTransactions: number;
  totalVolume: number;
  averageRating: number;
  totalReviews: number;
  buyCount: number;
  sellCount: number;
  exchangeCount: number;
  favoriteCategories: string[];
  mostTradedItems: {
    itemId: string;
    itemName: string;
    quantity: number;
    totalValue: number;
  }[];
  tradingPartners: {
    playerId: string;
    playerName: string;
    transactionCount: number;
    totalValue: number;
    averageRating: number;
  }[];
  monthlyStats: {
    month: string;
    transactions: number;
    volume: number;
    rating: number;
  }[];
  reputation: {
    level: number;
    title: string;
    benefits: string[];
    requirements: {
      transactions: number;
      volume: number;
      rating: number;
    };
  };
}

export interface TradeMarket {
  id: string;
  name: string;
  description: string;
  location: string;
  type: 'local' | 'regional' | 'global' | 'specialized';
  categories: string[];
  fees: {
    listingFee: number;
    transactionFee: number;
    premiumListingFee: number;
    instantSaleFee: number;
  };
  restrictions: {
    levelRequirement: number;
    reputationRequirement: number;
    guildRequirement?: string;
    itemLevelRequirement?: number;
    bannedItems: string[];
    restrictedCategories: string[];
  };
  features: {
    instantBuy: boolean;
    auctions: boolean;
    exchanges: boolean;
    bulkTrading: boolean;
    escrow: boolean;
    insurance: boolean;
    delivery: boolean;
  };
  operatingHours: {
    open: string;
    close: string;
    timezone: string;
    closedDays: string[];
  };
  isActive: boolean;
  popularity: number;
  averageTransactionTime: number;
  totalListings: number;
  totalVolume: number;
}

export interface TradeNotification {
  id: string;
  playerId: string;
  type: 'offer_listed' | 'offer_sold' | 'offer_expired' | 'trade_request' | 'trade_accepted' | 'trade_declined' | 'delivery_complete' | 'dispute_opened' | 'refund_processed';
  title: string;
  message: string;
  data: any;
  isRead: boolean;
  createdAt: Date;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  actions?: {
    label: string;
    action: string;
    data: any;
  }[];
}

export interface TradeSearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  currency?: 'gold' | 'echoes' | 'materials';
  quality?: string[];
  condition?: string[];
  sellerRating?: number;
  location?: string;
  deliveryMethod?: string[];
  tags?: string[];
  sortBy?: 'price' | 'date' | 'rating' | 'popularity';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface TradeAnalytics {
  marketId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  metrics: {
    totalListings: number;
    totalSales: number;
    totalVolume: number;
    averagePrice: number;
    averageTransactionTime: number;
    topCategories: {
      category: string;
      listings: number;
      sales: number;
      volume: number;
    }[];
    topItems: {
      itemId: string;
      itemName: string;
      listings: number;
      sales: number;
      volume: number;
      averagePrice: number;
    }[];
    priceTrends: {
      date: string;
      averagePrice: number;
      volume: number;
    }[];
    sellerStats: {
      totalSellers: number;
      newSellers: number;
      topSellers: {
        playerId: string;
        playerName: string;
        sales: number;
        volume: number;
        rating: number;
      }[];
    };
    buyerStats: {
      totalBuyers: number;
      newBuyers: number;
      topBuyers: {
        playerId: string;
        playerName: string;
        purchases: number;
        volume: number;
      }[];
    };
  };
}