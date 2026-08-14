import React, { useState } from 'react';
import { X, MapPin, Check } from 'lucide-react';

interface PincodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPincode: string;
  currentCity: string;
  onSaveLocation: (pincode: string, city: string) => void;
}

const POPULAR_CITIES = [
  { city: 'New Delhi', pin: '110001', state: 'Delhi NCR' },
  { city: 'Mumbai', pin: '400001', state: 'Maharashtra' },
  { city: 'Bengaluru', pin: '560001', state: 'Karnataka' },
  { city: 'Hyderabad', pin: '500001', state: 'Telangana' },
  { city: 'Chennai', pin: '600001', state: 'Tamil Nadu' },
  { city: 'Kolkata', pin: '700001', state: 'West Bengal' },
  { city: 'Pune', pin: '411001', state: 'Maharashtra' },
  { city: 'Ahmedabad', pin: '380001', state: 'Gujarat' }
];

export const PincodeModal: React.FC<PincodeModalProps> = ({
  isOpen,
  onClose,
  currentPincode,
  currentCity,
  onSaveLocation
}) => {
  if (!isOpen) return null;

  const [pincode, setPincode] = useState(currentPincode);
  const [city, setCity] = useState(currentCity);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length >= 6) {
      onSaveLocation(pincode, city || 'India');
      onClose();
    }
  };

  const handleSelectQuick = (c: { city: string; pin: string }) => {
    setPincode(c.pin);
    setCity(c.city);
    onSaveLocation(c.pin, c.city);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative text-slate-800 animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-orange-600" />
            <h2 className="font-extrabold text-sm text-slate-900">
              Choose Indian Delivery Location
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-slate-500">
            Delivery options and air cargo transit speeds vary based on your Indian destination PIN code.
          </p>

          <form onSubmit={handleSave} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="Enter 6-digit PIN Code"
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                disabled={pincode.length < 6}
                className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer transition-colors"
              >
                Apply PIN
              </button>
            </div>
          </form>

          {/* Quick Major Cities */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Popular Cities in India
            </div>

            <div className="grid grid-cols-2 gap-2">
              {POPULAR_CITIES.map((c) => {
                const isSelected = currentPincode === c.pin;
                return (
                  <button
                    key={c.pin}
                    onClick={() => handleSelectQuick(c)}
                    className={`p-2 rounded-lg border text-left text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50 text-orange-700 font-bold'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div>
                      <div>{c.city}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{c.pin}</div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-orange-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
