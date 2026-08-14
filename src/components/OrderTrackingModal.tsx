import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Truck, 
  Plane, 
  ShieldCheck, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Package, 
  Building,
  FileCheck,
  Globe,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Order, TrackOrderRecord, OrderShipment } from '../types';
import { TRACKING_ORDERS, findTrackingOrder, getSampleOrderNumbers } from '../data/trackingData';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  orders
}) => {
  if (!isOpen) return null;

  const sampleNumbers = getSampleOrderNumbers();
  const [searchQuery, setSearchQuery] = useState(sampleNumbers[0] || '20241008-01124401');
  const [selectedShipmentIdx, setSelectedShipmentIdx] = useState(0);

  // Look up in JSON tracking dataset first
  const foundJsonRecord: TrackOrderRecord | undefined = findTrackingOrder(searchQuery);

  // Or check user's local session orders
  const foundUserOrder = orders.find(
    (o) => o.id.toLowerCase() === searchQuery.trim().toLowerCase() || o.trackingNumber.toLowerCase() === searchQuery.trim().toLowerCase()
  );

  const activeShipments: OrderShipment[] = foundJsonRecord
    ? foundJsonRecord.shipments
    : foundUserOrder
    ? [
        {
          shipmentId: foundUserOrder.trackingNumber || 'SHIP-US-001',
          originStore: 'United States Store',
          originCode: 'US',
          destinationCountry: foundUserOrder.shippingAddress.city + ', India',
          currentStatus: 'Customs Cleared - In Domestic Transit',
          eta: foundUserOrder.estimatedDeliveryDate || '3-5 Business Days',
          items: foundUserOrder.items.map((it) => ({
            title: it.product.title,
            thumbnail: it.product.image,
            quantity: it.quantity,
            storeCode: it.product.storeCode || it.product.origin,
            storeName: it.product.storeName || `${it.product.origin} Store`
          })),
          events: [
            {
              location: 'Los Angeles International Gateway, CA, USA',
              status: 'Package exported & loaded on international cargo flight',
              time: 'Aug 11, 09:30 AM'
            },
            {
              location: 'IGI Airport Customs Terminal, New Delhi, India',
              status: 'Cleared Indian Customs (CBIC) with zero pending duties',
              time: 'Aug 13, 02:15 PM'
            },
            {
              location: `Local Courier Hub, ${foundUserOrder.shippingAddress.city}`,
              status: 'Arrived at delivery facility, preparing for final delivery',
              time: 'Aug 14, 08:00 AM'
            }
          ]
        }
      ]
    : TRACKING_ORDERS[0]?.shipments || [];

  const currentShipment = activeShipments[selectedShipmentIdx] || activeShipments[0];

  const handleSelectSample = (orderNum: string) => {
    setSearchQuery(orderNum);
    setSelectedShipmentIdx(0);
  };

  const getOriginFlag = (code: string) => {
    const c = (code || '').toUpperCase();
    if (c === 'US' || c === 'USA') return '🇺🇸';
    if (c === 'JP' || c === 'JAPAN') return '🇯🇵';
    if (c === 'UK' || c === 'GB') return '🇬🇧';
    if (c === 'CH' || c === 'CN' || c === 'CHINA' || c === 'KR' || c === 'KOREA') return '🇨🇳';
    if (c === 'HK' || c === 'HONG KONG') return '🇭🇰';
    return '🌐';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto relative text-slate-800 animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-20 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 leading-tight">
                Global Air Cargo & Customs Live Tracker
              </h2>
              <p className="text-xs text-slate-500">
                Track your cross-border shipments with verified customs & airway status
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Quick Samples */}
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Enter Order Number or AWB:</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedShipmentIdx(0);
                  }}
                  placeholder="e.g. 20241008-01124401 or NKM-IN-849201"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
              <button 
                onClick={() => setSelectedShipmentIdx(0)}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer transition-colors"
              >
                Track Shipment
              </button>
            </div>

            {/* Quick Demo Order Numbers */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[11px] font-bold text-slate-400">Sample Live Orders:</span>
              {sampleNumbers.slice(0, 4).map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleSelectSample(num)}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                    searchQuery === num
                      ? 'bg-orange-100 border-orange-400 text-orange-700 font-bold'
                      : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  #{num}
                </button>
              ))}
            </div>
          </div>

          {/* Multiple Shipments Tabs if order has > 1 packages */}
          {activeShipments.length > 1 && (
            <div className="border-b border-slate-200 flex space-x-2">
              {activeShipments.map((s, idx) => (
                <button
                  key={s.shipmentId || idx}
                  onClick={() => setSelectedShipmentIdx(idx)}
                  className={`pb-2 px-3 text-xs font-bold transition-all border-b-2 flex items-center space-x-1.5 cursor-pointer ${
                    selectedShipmentIdx === idx
                      ? 'border-orange-600 text-orange-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span>{getOriginFlag(s.originCode)}</span>
                  <span>Package #{idx + 1} ({s.originStore})</span>
                </button>
              ))}
            </div>
          )}

          {currentShipment ? (
            <>
              {/* Shipment Card Overview */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-4 text-white space-y-3 shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700 pb-2.5">
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Order / Tracking Number</div>
                    <div className="text-sm font-black font-mono text-amber-400">
                      {foundJsonRecord?.orderNumber || searchQuery}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Origin Store Hub</div>
                    <div className="text-xs font-bold text-white flex items-center space-x-1">
                      <span>{getOriginFlag(currentShipment.originCode)}</span>
                      <span>{currentShipment.originStore}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Status</div>
                    <span className="text-[11px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                      {currentShipment.currentStatus}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-between items-center text-xs gap-2">
                  <div className="text-slate-300">
                    <span>Destination: </span>
                    <span className="font-bold text-white">{currentShipment.destinationCountry}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400">Estimated Arrival: </span>
                    <span className="font-black text-amber-400">{currentShipment.eta}</span>
                  </div>
                </div>
              </div>

              {/* Package Items Included */}
              {currentShipment.items && currentShipment.items.length > 0 && (
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2">
                  <h4 className="font-bold text-xs text-slate-800 flex items-center justify-between">
                    <span>Items in this shipment ({currentShipment.items.length}):</span>
                    <span className="text-[10px] font-mono text-slate-400">AWB: {currentShipment.shipmentId}</span>
                  </h4>
                  <div className="space-y-2">
                    {currentShipment.items.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-3 bg-white p-2 rounded-lg border border-slate-200">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-12 h-12 object-contain rounded bg-slate-50 border border-slate-100 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 line-clamp-1">{item.title}</p>
                          <p className="text-[11px] text-slate-500">
                            Qty: <span className="font-bold text-slate-700">{item.quantity}</span>
                            {item.storeName && ` • Direct from ${item.storeName}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline Checkpoints */}
              <div className="space-y-4 pt-1">
                <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                  Transit & Customs Checkpoints ({currentShipment.events?.length || 0})
                </h4>

                <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {(currentShipment.events || []).map((ev, idx) => {
                    const isLatest = idx === 0;
                    return (
                      <div key={idx} className="relative flex items-start space-x-3">
                        {/* Circle marker */}
                        <div className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center ${
                          isLatest ? 'bg-orange-600 text-white ring-4 ring-orange-100' : 'bg-emerald-600 text-white'
                        }`}>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>

                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex-1 text-xs space-y-1">
                          <div className="flex items-center justify-between font-bold text-slate-900">
                            <span className="text-slate-900">{ev.status}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{ev.time}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-orange-600 shrink-0" />
                            <span>{ev.location}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-500">
              <Package className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p className="font-bold text-xs text-slate-700">No tracking records found for "{searchQuery}"</p>
              <p className="text-[11px] text-slate-400 mt-1">Please check your Order Number or select one of the sample orders above.</p>
            </div>
          )}

          {/* Footer note */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>All import duties and taxes for this order are pre-cleared by Nekomart with Indian Customs.</span>
          </div>

        </div>
      </div>
    </div>
  );
};
