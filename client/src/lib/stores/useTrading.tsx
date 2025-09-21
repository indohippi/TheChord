import { create } from 'zustand';
import { 
  TradeOffer, 
  TradeTransaction, 
  TradeRequest, 
  TradeHistory, 
  TradeStatistics, 
  TradeMarket, 
  TradeNotification, 
  TradeSearchFilters, 
  TradeAnalytics 
} from '@shared/tradingTypes';

interface TradingStore {
  // Offers
  offers: TradeOffer[];
  myOffers: TradeOffer[];
  
  // Transactions
  transactions: TradeTransaction[];
  myTransactions: TradeTransaction[];
  
  // Requests
  requests: TradeRequest[];
  myRequests: TradeRequest[];
  
  // History
  history: TradeHistory[];
  
  // Statistics
  statistics: TradeStatistics | null;
  
  // Markets
  markets: TradeMarket[];
  activeMarket: string | null;
  
  // Notifications
  notifications: TradeNotification[];
  unreadNotifications: number;
  
  // Search
  searchResults: TradeOffer[];
  searchFilters: TradeSearchFilters;
  
  // Analytics
  analytics: TradeAnalytics[];
  
  // Actions
  createOffer: (offer: Omit<TradeOffer, 'id' | 'listingDate'>) => void;
  updateOffer: (offerId: string, updates: Partial<TradeOffer>) => void;
  cancelOffer: (offerId: string) => void;
  buyOffer: (offerId: string, quantity: number) => void;
  
  // Transaction management
  createTransaction: (transaction: Omit<TradeTransaction, 'id' | 'transactionDate'>) => void;
  updateTransactionStatus: (transactionId: string, status: string) => void;
  rateTransaction: (transactionId: string, rating: number, review: string) => void;
  
  // Request management
  createRequest: (request: Omit<TradeRequest, 'id' | 'createdAt'>) => void;
  respondToRequest: (requestId: string, response: 'accepted' | 'declined', message?: string) => void;
  cancelRequest: (requestId: string) => void;
  
  // Market management
  setActiveMarket: (marketId: string) => void;
  getMarket: (marketId: string) => TradeMarket | null;
  
  // Search and filtering
  searchOffers: (filters: TradeSearchFilters) => void;
  updateSearchFilters: (filters: Partial<TradeSearchFilters>) => void;
  clearSearch: () => void;
  
  // Notification management
  addNotification: (notification: Omit<TradeNotification, 'id' | 'createdAt'>) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  
  // Statistics
  updateStatistics: (playerId: string) => void;
  getPlayerStatistics: (playerId: string) => TradeStatistics | null;
  
  // Analytics
  getAnalytics: (marketId: string, period: string) => TradeAnalytics | null;
  
  // Utilities
  getOffersByCategory: (category: string) => TradeOffer[];
  getOffersByPlayer: (playerId: string) => TradeOffer[];
  getTransactionHistory: (playerId: string) => TradeHistory[];
  calculateFees: (offer: TradeOffer, market: TradeMarket) => number;
  validateTrade: (offer: TradeOffer, quantity: number) => { valid: boolean; reason?: string };
}

export const useTrading = create<TradingStore>((set, get) => ({
  // Initial state
  offers: [],
  myOffers: [],
  transactions: [],
  myTransactions: [],
  requests: [],
  myRequests: [],
  history: [],
  statistics: null,
  markets: [],
  activeMarket: null,
  notifications: [],
  unreadNotifications: 0,
  searchResults: [],
  searchFilters: {
    sortBy: 'date',
    sortOrder: 'desc',
    page: 1,
    limit: 20
  },
  analytics: [],

  // Create offer
  createOffer: (offerData: Omit<TradeOffer, 'id' | 'listingDate'>) => {
    const offer: TradeOffer = {
      ...offerData,
      id: `offer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      listingDate: new Date()
    };

    set(state => ({
      offers: [...state.offers, offer],
      myOffers: [...state.myOffers, offer]
    }));

    // Add notification
    get().addNotification({
      playerId: 'local_player',
      type: 'offer_listed',
      title: 'Offer Listed',
      message: `Your ${offer.itemName} has been listed for ${offer.totalPrice} ${offer.currency}`,
      data: { offerId: offer.id },
      isRead: false,
      priority: 'normal'
    });
  },

  // Update offer
  updateOffer: (offerId: string, updates: Partial<TradeOffer>) => {
    set(state => ({
      offers: state.offers.map(offer => 
        offer.id === offerId ? { ...offer, ...updates } : offer
      ),
      myOffers: state.myOffers.map(offer => 
        offer.id === offerId ? { ...offer, ...updates } : offer
      )
    }));
  },

  // Cancel offer
  cancelOffer: (offerId: string) => {
    set(state => ({
      offers: state.offers.map(offer => 
        offer.id === offerId ? { ...offer, isActive: false } : offer
      ),
      myOffers: state.myOffers.map(offer => 
        offer.id === offerId ? { ...offer, isActive: false } : offer
      )
    }));
  },

  // Buy offer
  buyOffer: (offerId: string, quantity: number) => {
    const state = get();
    const offer = state.offers.find(o => o.id === offerId);
    if (!offer) return;

    const validation = state.validateTrade(offer, quantity);
    if (!validation.valid) {
      console.error('Trade validation failed:', validation.reason);
      return;
    }

    const transaction: TradeTransaction = {
      id: `transaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      buyerId: 'local_player',
      buyerName: 'Local Player',
      sellerId: offer.sellerId,
      sellerName: offer.sellerName,
      offerId: offer.id,
      itemId: offer.itemId,
      itemName: offer.itemName,
      quantity,
      pricePerUnit: offer.pricePerUnit,
      totalPrice: offer.pricePerUnit * quantity,
      currency: offer.currency,
      currencyAmount: offer.currencyAmount,
      currencyMaterialId: offer.currencyMaterialId,
      transactionDate: new Date(),
      status: 'pending',
      deliveryStatus: 'pending',
      fees: {
        listingFee: 0,
        transactionFee: 0,
        deliveryFee: offer.deliveryCost,
        totalFees: offer.deliveryCost
      }
    };

    set(state => ({
      transactions: [...state.transactions, transaction],
      myTransactions: [...state.myTransactions, transaction],
      offers: state.offers.map(o => 
        o.id === offerId ? { ...o, quantity: o.quantity - quantity } : o
      )
    }));

    // Add notification
    get().addNotification({
      playerId: 'local_player',
      type: 'offer_sold',
      title: 'Purchase Complete',
      message: `You bought ${quantity}x ${offer.itemName} for ${transaction.totalPrice} ${offer.currency}`,
      data: { transactionId: transaction.id },
      isRead: false,
      priority: 'normal'
    });
  },

  // Create transaction
  createTransaction: (transactionData: Omit<TradeTransaction, 'id' | 'transactionDate'>) => {
    const transaction: TradeTransaction = {
      ...transactionData,
      id: `transaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      transactionDate: new Date()
    };

    set(state => ({
      transactions: [...state.transactions, transaction]
    }));
  },

  // Update transaction status
  updateTransactionStatus: (transactionId: string, status: string) => {
    set(state => ({
      transactions: state.transactions.map(t => 
        t.id === transactionId ? { ...t, status: status as any } : t
      ),
      myTransactions: state.myTransactions.map(t => 
        t.id === transactionId ? { ...t, status: status as any } : t
      )
    }));
  },

  // Rate transaction
  rateTransaction: (transactionId: string, rating: number, review: string) => {
    set(state => ({
      transactions: state.transactions.map(t => 
        t.id === transactionId ? { ...t, buyerRating: rating, buyerReview: review } : t
      ),
      myTransactions: state.myTransactions.map(t => 
        t.id === transactionId ? { ...t, buyerRating: rating, buyerReview: review } : t
      )
    }));
  },

  // Create request
  createRequest: (requestData: Omit<TradeRequest, 'id' | 'createdAt'>) => {
    const request: TradeRequest = {
      ...requestData,
      id: `request_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date()
    };

    set(state => ({
      requests: [...state.requests, request],
      myRequests: [...state.myRequests, request]
    }));
  },

  // Respond to request
  respondToRequest: (requestId: string, response: 'accepted' | 'declined', message?: string) => {
    set(state => ({
      requests: state.requests.map(r => 
        r.id === requestId ? { 
          ...r, 
          status: response, 
          respondedAt: new Date(),
          responseMessage: message
        } : r
      ),
      myRequests: state.myRequests.map(r => 
        r.id === requestId ? { 
          ...r, 
          status: response, 
          respondedAt: new Date(),
          responseMessage: message
        } : r
      )
    }));
  },

  // Cancel request
  cancelRequest: (requestId: string) => {
    set(state => ({
      requests: state.requests.map(r => 
        r.id === requestId ? { ...r, status: 'cancelled' } : r
      ),
      myRequests: state.myRequests.map(r => 
        r.id === requestId ? { ...r, status: 'cancelled' } : r
      )
    }));
  },

  // Set active market
  setActiveMarket: (marketId: string) => {
    set({ activeMarket: marketId });
  },

  // Get market
  getMarket: (marketId: string) => {
    const state = get();
    return state.markets.find(m => m.id === marketId) || null;
  },

  // Search offers
  searchOffers: (filters: TradeSearchFilters) => {
    const state = get();
    let results = [...state.offers];

    // Apply filters
    if (filters.category) {
      results = results.filter(offer => offer.tags.includes(filters.category!));
    }

    if (filters.minPrice !== undefined) {
      results = results.filter(offer => offer.pricePerUnit >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      results = results.filter(offer => offer.pricePerUnit <= filters.maxPrice!);
    }

    if (filters.currency) {
      results = results.filter(offer => offer.currency === filters.currency);
    }

    if (filters.quality && filters.quality.length > 0) {
      results = results.filter(offer => filters.quality!.includes(offer.quality));
    }

    if (filters.condition && filters.condition.length > 0) {
      results = results.filter(offer => filters.condition!.includes(offer.condition));
    }

    if (filters.sellerRating !== undefined) {
      results = results.filter(offer => offer.sellerRating >= filters.sellerRating!);
    }

    if (filters.location) {
      results = results.filter(offer => offer.location === filters.location);
    }

    if (filters.deliveryMethod && filters.deliveryMethod.length > 0) {
      results = results.filter(offer => filters.deliveryMethod!.includes(offer.deliveryMethod));
    }

    if (filters.tags && filters.tags.length > 0) {
      results = results.filter(offer => 
        filters.tags!.some(tag => offer.tags.includes(tag))
      );
    }

    // Sort results
    if (filters.sortBy) {
      results.sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (filters.sortBy) {
          case 'price':
            aValue = a.pricePerUnit;
            bValue = b.pricePerUnit;
            break;
          case 'date':
            aValue = a.listingDate.getTime();
            bValue = b.listingDate.getTime();
            break;
          case 'rating':
            aValue = a.sellerRating;
            bValue = b.sellerRating;
            break;
          case 'popularity':
            aValue = a.sellerReviewCount;
            bValue = b.sellerReviewCount;
            break;
          default:
            return 0;
        }

        if (filters.sortOrder === 'asc') {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      });
    }

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    results = results.slice(startIndex, endIndex);

    set({ 
      searchResults: results,
      searchFilters: { ...state.searchFilters, ...filters }
    });
  },

  // Update search filters
  updateSearchFilters: (filters: Partial<TradeSearchFilters>) => {
    set(state => ({
      searchFilters: { ...state.searchFilters, ...filters }
    }));
  },

  // Clear search
  clearSearch: () => {
    set({ 
      searchResults: [],
      searchFilters: {
        sortBy: 'date',
        sortOrder: 'desc',
        page: 1,
        limit: 20
      }
    });
  },

  // Add notification
  addNotification: (notificationData: Omit<TradeNotification, 'id' | 'createdAt'>) => {
    const notification: TradeNotification = {
      ...notificationData,
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date()
    };

    set(state => ({
      notifications: [...state.notifications, notification],
      unreadNotifications: state.unreadNotifications + 1
    }));
  },

  // Mark notification read
  markNotificationRead: (notificationId: string) => {
    set(state => ({
      notifications: state.notifications.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      ),
      unreadNotifications: Math.max(0, state.unreadNotifications - 1)
    }));
  },

  // Mark all notifications read
  markAllNotificationsRead: () => {
    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, isRead: true })),
      unreadNotifications: 0
    }));
  },

  // Clear notifications
  clearNotifications: () => {
    set({ 
      notifications: [],
      unreadNotifications: 0
    });
  },

  // Update statistics
  updateStatistics: (playerId: string) => {
    const state = get();
    const playerTransactions = state.history.filter(h => h.playerId === playerId);
    
    const statistics: TradeStatistics = {
      playerId,
      totalTransactions: playerTransactions.length,
      totalVolume: playerTransactions.reduce((sum, t) => sum + t.totalPrice, 0),
      averageRating: playerTransactions.reduce((sum, t) => sum + t.rating, 0) / playerTransactions.length || 0,
      totalReviews: playerTransactions.filter(t => t.review).length,
      buyCount: playerTransactions.filter(t => t.type === 'buy').length,
      sellCount: playerTransactions.filter(t => t.type === 'sell').length,
      exchangeCount: 0,
      favoriteCategories: [],
      mostTradedItems: [],
      tradingPartners: [],
      monthlyStats: [],
      reputation: {
        level: 1,
        title: 'Novice Trader',
        benefits: ['Basic trading access'],
        requirements: {
          transactions: 0,
          volume: 0,
          rating: 0
        }
      }
    };

    set({ statistics });
  },

  // Get player statistics
  getPlayerStatistics: (playerId: string) => {
    const state = get();
    return state.statistics?.playerId === playerId ? state.statistics : null;
  },

  // Get analytics
  getAnalytics: (marketId: string, period: string) => {
    const state = get();
    return state.analytics.find(a => a.marketId === marketId && a.period === period) || null;
  },

  // Get offers by category
  getOffersByCategory: (category: string) => {
    const state = get();
    return state.offers.filter(offer => offer.tags.includes(category));
  },

  // Get offers by player
  getOffersByPlayer: (playerId: string) => {
    const state = get();
    return state.offers.filter(offer => offer.sellerId === playerId);
  },

  // Get transaction history
  getTransactionHistory: (playerId: string) => {
    const state = get();
    return state.history.filter(h => h.playerId === playerId);
  },

  // Calculate fees
  calculateFees: (offer: TradeOffer, market: TradeMarket) => {
    const listingFee = market.fees.listingFee;
    const transactionFee = market.fees.transactionFee;
    const deliveryFee = offer.deliveryCost;
    
    return listingFee + transactionFee + deliveryFee;
  },

  // Validate trade
  validateTrade: (offer: TradeOffer, quantity: number) => {
    if (!offer.isActive) {
      return { valid: false, reason: 'Offer is not active' };
    }

    if (quantity > offer.quantity) {
      return { valid: false, reason: 'Insufficient quantity available' };
    }

    if (offer.expiryDate && new Date() > offer.expiryDate) {
      return { valid: false, reason: 'Offer has expired' };
    }

    if (offer.isPrivate && !offer.allowedBuyers?.includes('local_player')) {
      return { valid: false, reason: 'You are not authorized to buy this item' };
    }

    return { valid: true };
  }
}));