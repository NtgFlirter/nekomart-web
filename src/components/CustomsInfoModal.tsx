import React from 'react';
import { X, ShieldCheck, FileCheck, CheckCircle2, Plane, AlertTriangle, Building2, HelpCircle } from 'lucide-react';

interface CustomsInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomsInfoModal: React.FC<CustomsInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative text-slate-800 animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-20 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 leading-tight">
                Indian Customs Clearance & Duty Transparency
              </h2>
              <p className="text-xs text-slate-500">
                How Nekomart handles 100% of the cross-border import clearance for you
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

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-slate-700 leading-relaxed">
          
          {/* Key Guarantee */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-800 font-extrabold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Zero Surprise Fees at Your Doorstep</span>
            </div>
            <p className="text-slate-600 text-[11px]">
              Unlike unmanaged international shipments where couriers demand unexpected custom duties at delivery, Nekomart calculates and pre-pays all Indian Basic Customs Duty (BCD), Integrated GST (IGST), and clearance fees at checkout.
            </p>
          </div>

          {/* How it works */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900">
              The 4-Step Cross-Border Import Process:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-orange-600 flex items-center space-x-1">
                  <span>1. Overseas Dispatch</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Item is packed and inspected at our US / Tokyo / London / Seoul fulfillment warehouses.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-sky-600 flex items-center space-x-1">
                  <span>2. Priority Air Transit</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Flown via DHL Express or FedEx air cargo flights to Delhi IGI Airport / Mumbai Cargo terminal.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-emerald-600 flex items-center space-x-1">
                  <span>3. Instant Customs KYC Clearance</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Electronic clearance with Indian Customs (CBIC) using your pre-verified PAN / Aadhaar details.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-purple-600 flex items-center space-x-1">
                  <span>4. Doorstep Indian Delivery</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Handed over to local tier-1 express couriers for direct, safe delivery to your home or office.
                </p>
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <h4 className="font-bold text-slate-900">Frequently Asked Questions:</h4>

            <div className="space-y-2">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <p className="font-bold text-slate-800">Why is a PAN or Aadhaar card required?</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Indian Customs courier import guidelines mandate KYC identification to prevent unauthorized commercial imports under personal names.
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <p className="font-bold text-slate-800">Are items 100% authentic and original?</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Yes, Nekomart exclusively sources directly from authorized overseas brand stores and manufacturers with full warranty support.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2 rounded-xl cursor-pointer"
            >
              Understood
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
