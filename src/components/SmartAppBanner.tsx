import React, { useState, useEffect } from 'react';
import { Smartphone, X, ExternalLink } from 'lucide-react';

interface SmartAppBannerProps {
  productId?: string | number | null;
  storeCode?: string | null;
  appPackage?: string;
}

export const SmartAppBanner: React.FC<SmartAppBannerProps> = ({
  productId,
  storeCode,
  appPackage = 'com.aistudio.ecommerce.qxyz'
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isAndroidOrIOS = /android|iphone|ipad|ipod/i.test(userAgent.toLowerCase());
    setIsMobile(isAndroidOrIOS);

    // If dismissed previously in this session
    const dismissed = sessionStorage.getItem('nekomart_app_banner_dismissed');
    if (dismissed === 'true') {
      setIsVisible(false);
    }
  }, []);

  if (!isVisible || !isMobile) return null;

  // Build target URI
  let targetPath = '';
  if (productId) {
    targetPath = `product/${productId}`;
  } else if (storeCode) {
    targetPath = `store/${storeCode}`;
  } else {
    targetPath = 'home';
  }

  // Custom Scheme URL & Generic Android Intent URI (without package lock to avoid Play Store redirect)
  const customSchemeUrl = `nekomart://${targetPath}`;
  const androidIntentUrl = `intent://${targetPath}#Intent;scheme=nekomart;end`;

  const handleOpenApp = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // First attempt: Direct custom scheme
    window.location.href = customSchemeUrl;
    
    // Fallback attempt with intent after short delay if custom scheme didn't launch
    setTimeout(() => {
      window.location.href = androidIntentUrl;
    }, 400);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('nekomart_app_banner_dismissed', 'true');
  };

  return (
    <div 
      id="smart-app-banner"
      className="bg-slate-900 text-white px-3 py-2 border-b border-slate-800 flex items-center justify-between shadow-lg sticky top-0 z-50 text-xs animate-in slide-in-from-top duration-200"
    >
      <div className="flex items-center space-x-2.5 min-w-0 pr-2">
        <button 
          onClick={handleDismiss} 
          className="text-slate-400 hover:text-white p-0.5 rounded-full cursor-pointer shrink-0"
          aria-label="Dismiss app banner"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center font-black text-sm text-white shrink-0 shadow-sm">
          🐱
        </div>

        <div className="min-w-0 leading-tight">
          <div className="font-bold text-white text-[12px] truncate flex items-center gap-1">
            <span>Nekomart App</span>
            <span className="bg-orange-500/20 text-orange-400 text-[9px] font-extrabold px-1 rounded">FAST</span>
          </div>
          <p className="text-[10px] text-slate-300 truncate">
            {productId ? 'Open this product in Nekomart App' : 'Get exclusive app deals & faster customs checkout'}
          </p>
        </div>
      </div>

      <a
        id="smart-app-banner-open-btn"
        href={androidIntentUrl}
        onClick={handleOpenApp}
        className="bg-orange-600 hover:bg-orange-500 active:scale-95 text-white font-extrabold text-[11px] px-3.5 py-1.5 rounded-lg shadow-md whitespace-nowrap shrink-0 flex items-center space-x-1 cursor-pointer transition-all"
      >
        <span>OPEN IN APP</span>
        <ExternalLink className="w-3 h-3 ml-0.5" />
      </a>
    </div>
  );
};
