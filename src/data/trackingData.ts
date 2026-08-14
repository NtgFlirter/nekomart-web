import rawTrackOrders from '../../assets/trackorder.json';
import { TrackOrderRecord, OrderShipment } from '../types';

export const TRACKING_ORDERS: TrackOrderRecord[] = (rawTrackOrders as any[]).map((entry) => ({
  orderNumber: String(entry.orderNumber),
  shipments: Array.isArray(entry.shipments)
    ? entry.shipments.map((s: any) => ({
        shipmentId: s.shipmentId || 'N/A',
        originStore: s.originStore || 'Global Store',
        originCode: s.originCode || 'US',
        destinationCountry: s.destinationCountry || 'India',
        currentStatus: s.currentStatus || 'In Transit',
        eta: s.eta || '3-5 Business Days',
        items: Array.isArray(s.items)
          ? s.items.map((it: any) => ({
              title: it.title ? String(it.title).replace(/\\n/g, ' ') : 'Imported Item',
              thumbnail: it.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
              quantity: it.quantity || 1,
              storeCode: it.storeCode,
              storeName: it.storeName
            }))
          : [],
        events: Array.isArray(s.events)
          ? s.events.map((ev: any) => ({
              location: ev.location || 'Hub',
              status: ev.status || 'Updated',
              time: ev.time || ''
            }))
          : []
      }))
    : []
}));

export function findTrackingOrder(orderNumber: string): TrackOrderRecord | undefined {
  const clean = orderNumber.trim().replace(/^#/, '').toLowerCase();
  return TRACKING_ORDERS.find(
    (o) => o.orderNumber.toLowerCase() === clean || o.orderNumber.includes(clean)
  );
}

export function getSampleOrderNumbers(): string[] {
  return TRACKING_ORDERS.slice(0, 10).map((o) => o.orderNumber);
}
