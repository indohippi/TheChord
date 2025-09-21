import React, { useState, useEffect } from 'react';
import { useTrading } from '@/lib/stores/useTrading';
import { useUI } from '@/lib/stores/useUI';
import { TradeOffer, TradeRequest } from '@shared/tradingTypes';

interface TradingUIProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TradingUI: React.FC<TradingUIProps> = ({ isOpen, onClose }) => {
  const {
    offers,
    myOffers,
    transactions,
    myTransactions,
    requests,
    myRequests,
    notifications,
    unreadNotifications,
    searchResults,
    searchFilters,
    createOffer,
    updateOffer,
    cancelOffer,
    buyOffer,
    createRequest,
    respondToRequest,
    searchOffers,
    updateSearchFilters,
    markNotificationRead,
    markAllNotificationsRead
  } = useTrading();

  const { addNotification } = useUI();

  const [selectedTab, setSelectedTab] = useState<'browse' | 'sell' | 'buy' | 'requests' | 'history' | 'notifications'>('browse');
  const [selectedOffer, setSelectedOffer] = useState<TradeOffer | null>(null);
  const [buyQuantity, setBuyQuantity] = useState(1);
  const [showCreateOffer, setShowCreateOffer] = useState(false);
  const [showCreateRequest, setShowCreateRequest] = useState(false);

  // Sample data for demonstration
  useEffect(() => {
    // Add some sample offers
    const sampleOffers: TradeOffer[] = [
      {
        id: 'offer_1',
        sellerId: 'player_1',
        sellerName: 'MasterSmith',
        itemId: 'iron_sword',
        itemName: 'Iron Sword',
        itemDescription: 'A well-crafted iron sword',
        itemIcon: '⚔️',
        quantity: 5,
        pricePerUnit: 150,
        totalPrice: 750,
        currency: 'gold',
        condition: 'new',
        quality: 'fine',
        listingDate: new Date(),
        isActive: true,
        isPrivate: false,
        tags: ['weapon', 'sword', 'iron'],
        location: 'whispering_woods',
        deliveryMethod: 'instant',
        deliveryCost: 0,
        sellerRating: 4.8,
        sellerReviewCount: 127
      },
      {
        id: 'offer_2',
        sellerId: 'player_2',
        sellerName: 'AlchemistPro',
        itemId: 'health_potion',
        itemName: 'Health Potion',
        itemDescription: 'Restores 100 health points',
        itemIcon: '🧪',
        quantity: 20,
        pricePerUnit: 25,
        totalPrice: 500,
        currency: 'gold',
        condition: 'new',
        quality: 'normal',
        listingDate: new Date(),
        isActive: true,
        isPrivate: false,
        tags: ['consumable', 'potion', 'health'],
        location: 'mystic_garden',
        deliveryMethod: 'instant',
        deliveryCost: 0,
        sellerRating: 4.6,
        sellerReviewCount: 89
      },
      {
        id: 'offer_3',
        sellerId: 'player_3',
        sellerName: 'EnchanterElite',
        itemId: 'enchanted_ring',
        itemName: 'Ring of Power',
        itemDescription: 'A ring imbued with magical energy',
        itemIcon: '💍',
        quantity: 1,
        pricePerUnit: 500,
        totalPrice: 500,
        currency: 'echoes',
        currencyAmount: 50,
        condition: 'new',
        quality: 'epic',
        enchantments: [
          {
            id: 'enchant_1',
            name: 'Strength Boost',
            level: 3,
            description: 'Increases strength by 15'
          }
        ],
        listingDate: new Date(),
        isActive: true,
        isPrivate: false,
        tags: ['accessory', 'ring', 'enchanted'],
        location: 'ancient_temple',
        deliveryMethod: 'mail',
        deliveryCost: 10,
        sellerRating: 4.9,
        sellerReviewCount: 203
      }
    ];

    sampleOffers.forEach(offer => {
      createOffer(offer);
    });
  }, [createOffer]);

  if (!isOpen) return null;

  const handleBuyOffer = () => {
    if (!selectedOffer) return;

    buyOffer(selectedOffer.id, buyQuantity);
    addNotification({
      title: 'Purchase Successful',
      message: `You bought ${buyQuantity}x ${selectedOffer.itemName}`,
      type: 'success'
    });
    setSelectedOffer(null);
  };

  const handleCreateOffer = (offerData: any) => {
    createOffer(offerData);
    setShowCreateOffer(false);
    addNotification({
      title: 'Offer Created',
      message: 'Your item has been listed for sale',
      type: 'success'
    });
  };

  const handleCreateRequest = (requestData: any) => {
    createRequest(requestData);
    setShowCreateRequest(false);
    addNotification({
      title: 'Request Sent',
      message: 'Your trade request has been sent',
      type: 'info'
    });
  };

  const handleSearch = () => {
    searchOffers(searchFilters);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-2 border-blue-500 rounded-lg p-6 w-11/12 max-w-7xl h-5/6 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">
            Trading Market
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-4">
          {(['browse', 'sell', 'buy', 'requests', 'history', 'notifications'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors relative ${
                selectedTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'notifications' && unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="h-full overflow-y-auto">
          {selectedTab === 'browse' && (
            <div className="space-y-6">
              {/* Search Filters */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-white mb-4">Search Items</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-white text-sm mb-1">Category</label>
                    <select
                      value={searchFilters.category || ''}
                      onChange={(e) => updateSearchFilters({ category: e.target.value })}
                      className="w-full p-2 bg-gray-700 text-white rounded-lg border border-gray-600"
                    >
                      <option value="">All Categories</option>
                      <option value="weapon">Weapons</option>
                      <option value="armor">Armor</option>
                      <option value="consumable">Consumables</option>
                      <option value="accessory">Accessories</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white text-sm mb-1">Min Price</label>
                    <input
                      type="number"
                      value={searchFilters.minPrice || ''}
                      onChange={(e) => updateSearchFilters({ minPrice: parseInt(e.target.value) || undefined })}
                      className="w-full p-2 bg-gray-700 text-white rounded-lg border border-gray-600"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm mb-1">Max Price</label>
                    <input
                      type="number"
                      value={searchFilters.maxPrice || ''}
                      onChange={(e) => updateSearchFilters({ maxPrice: parseInt(e.target.value) || undefined })}
                      className="w-full p-2 bg-gray-700 text-white rounded-lg border border-gray-600"
                      placeholder="1000"
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm mb-1">Currency</label>
                    <select
                      value={searchFilters.currency || ''}
                      onChange={(e) => updateSearchFilters({ currency: e.target.value as any })}
                      className="w-full p-2 bg-gray-700 text-white rounded-lg border border-gray-600"
                    >
                      <option value="">All Currencies</option>
                      <option value="gold">Gold</option>
                      <option value="echoes">Echoes</option>
                      <option value="materials">Materials</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleSearch}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                >
                  Search
                </button>
              </div>

              {/* Search Results */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Available Items ({searchResults.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.map((offer) => (
                    <div
                      key={offer.id}
                      className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-blue-500 transition-colors cursor-pointer"
                      onClick={() => setSelectedOffer(offer)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{offer.itemIcon}</span>
                        <span className="text-green-400 font-semibold">
                          {offer.pricePerUnit} {offer.currency}
                        </span>
                      </div>
                      <h4 className="text-white font-semibold mb-1">{offer.itemName}</h4>
                      <p className="text-gray-400 text-sm mb-2">{offer.itemDescription}</p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Qty: {offer.quantity}</span>
                        <span className="text-gray-400">⭐ {offer.sellerRating}</span>
                      </div>
                      <div className="mt-2">
                        <span className="text-blue-400 text-sm">by {offer.sellerName}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'sell' && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-white">My Offers</h3>
                  <button
                    onClick={() => setShowCreateOffer(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                  >
                    Create Offer
                  </button>
                </div>
                
                {myOffers.length > 0 ? (
                  <div className="space-y-3">
                    {myOffers.map((offer) => (
                      <div key={offer.id} className="bg-gray-700 rounded-lg p-3 border border-gray-600">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{offer.itemIcon}</span>
                            <div>
                              <h4 className="text-white font-semibold">{offer.itemName}</h4>
                              <p className="text-gray-400 text-sm">
                                {offer.quantity} available • {offer.pricePerUnit} {offer.currency} each
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              offer.isActive ? 'bg-green-600' : 'bg-gray-600'
                            }`}>
                              {offer.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <button
                              onClick={() => cancelOffer(offer.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    No offers created yet
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedTab === 'buy' && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-white mb-4">Purchase History</h3>
                
                {myTransactions.length > 0 ? (
                  <div className="space-y-3">
                    {myTransactions.map((transaction) => (
                      <div key={transaction.id} className="bg-gray-700 rounded-lg p-3 border border-gray-600">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-white font-semibold">{transaction.itemName}</h4>
                            <p className="text-gray-400 text-sm">
                              {transaction.quantity}x • {transaction.totalPrice} {transaction.currency}
                            </p>
                            <p className="text-gray-400 text-sm">
                              from {transaction.sellerName} • {transaction.transactionDate.toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            transaction.status === 'completed' ? 'bg-green-600' :
                            transaction.status === 'pending' ? 'bg-yellow-600' :
                            'bg-gray-600'
                          }`}>
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    No purchases yet
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedTab === 'requests' && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-white">Trade Requests</h3>
                  <button
                    onClick={() => setShowCreateRequest(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  >
                    Create Request
                  </button>
                </div>
                
                {myRequests.length > 0 ? (
                  <div className="space-y-3">
                    {myRequests.map((request) => (
                      <div key={request.id} className="bg-gray-700 rounded-lg p-3 border border-gray-600">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-white font-semibold">
                              {request.type === 'buy' ? 'Buy Request' : 
                               request.type === 'sell' ? 'Sell Request' : 'Exchange Request'}
                            </h4>
                            <p className="text-gray-400 text-sm">{request.message}</p>
                            <p className="text-gray-400 text-sm">
                              to {request.targetName} • {request.createdAt.toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            request.status === 'accepted' ? 'bg-green-600' :
                            request.status === 'declined' ? 'bg-red-600' :
                            request.status === 'pending' ? 'bg-yellow-600' :
                            'bg-gray-600'
                          }`}>
                            {request.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    No requests sent yet
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedTab === 'history' && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-white mb-4">Trading History</h3>
                <div className="text-center text-gray-400 py-8">
                  Trading history will be displayed here
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'notifications' && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-white">Notifications</h3>
                  <button
                    onClick={markAllNotificationsRead}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  >
                    Mark All Read
                  </button>
                </div>
                
                {notifications.length > 0 ? (
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`rounded-lg p-3 border ${
                          notification.isRead ? 'bg-gray-700 border-gray-600' : 'bg-gray-600 border-blue-500'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-white font-semibold">{notification.title}</h4>
                            <p className="text-gray-400 text-sm">{notification.message}</p>
                            <p className="text-gray-400 text-xs">
                              {notification.createdAt.toLocaleDateString()}
                            </p>
                          </div>
                          {!notification.isRead && (
                            <button
                              onClick={() => markNotificationRead(notification.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                            >
                              Mark Read
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    No notifications
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Offer Details Modal */}
        {selectedOffer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-gray-900 border-2 border-blue-500 rounded-lg p-6 w-11/12 max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Item Details</h3>
                <button
                  onClick={() => setSelectedOffer(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-4xl">{selectedOffer.itemIcon}</span>
                  <div>
                    <h4 className="text-white font-semibold text-lg">{selectedOffer.itemName}</h4>
                    <p className="text-gray-400">{selectedOffer.itemDescription}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-400">Price:</span>
                    <span className="text-green-400 font-semibold ml-2">
                      {selectedOffer.pricePerUnit} {selectedOffer.currency}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Quantity:</span>
                    <span className="text-white ml-2">{selectedOffer.quantity}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Quality:</span>
                    <span className="text-white ml-2">{selectedOffer.quality}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Condition:</span>
                    <span className="text-white ml-2">{selectedOffer.condition}</span>
                  </div>
                </div>
                
                <div>
                  <span className="text-gray-400">Seller:</span>
                  <span className="text-white ml-2">{selectedOffer.sellerName}</span>
                  <span className="text-yellow-400 ml-2">⭐ {selectedOffer.sellerRating}</span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <label className="text-white">Quantity:</label>
                  <input
                    type="number"
                    min="1"
                    max={selectedOffer.quantity}
                    value={buyQuantity}
                    onChange={(e) => setBuyQuantity(parseInt(e.target.value) || 1)}
                    className="w-20 p-2 bg-gray-700 text-white rounded-lg border border-gray-600"
                  />
                  <span className="text-white">
                    Total: {selectedOffer.pricePerUnit * buyQuantity} {selectedOffer.currency}
                  </span>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    onClick={handleBuyOffer}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={() => setSelectedOffer(null)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};