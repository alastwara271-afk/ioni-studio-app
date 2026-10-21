import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TabType, TrialState, VoiceGenerationItem, ImageGenerationItem, ToastMessage } from '../types';
import { translations } from '../i18n/translations';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  trialState: TrialState;
  recordUsage: (type: 'voice' | 'image' | 'chat' | 'videoPlans') => void;
  hasSubscribed: boolean;
  setHasSubscribed: (val: boolean) => void;
  youtubeChannelUrl: string;
  setYoutubeChannelUrl: (url: string) => void;
  hasApiKey: boolean;
  isVercelModalOpen: boolean;
  setIsVercelModalOpen: (val: boolean) => void;
  isGateModalOpen: boolean;
  setIsGateModalOpen: (val: boolean) => void;
  voiceHistory: VoiceGenerationItem[];
  addVoiceItem: (item: VoiceGenerationItem) => void;
  removeVoiceItem: (id: string) => void;
  imageHistory: ImageGenerationItem[];
  addImageItem: (item: ImageGenerationItem) => void;
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'error' | 'info', message: string) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Language
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('ioni_lang');
    return saved === 'ar' ? 'ar' : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('ioni_lang', lang);
  };

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = translations[language];

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabType>('voice');

  // YouTube Channel Gate
  const [hasSubscribed, setHasSubscribedState] = useState<boolean>(() => {
    return localStorage.getItem('ioni_gate_unlocked') === 'true';
  });

  const setHasSubscribed = (val: boolean) => {
    setHasSubscribedState(val);
    localStorage.setItem('ioni_gate_unlocked', val ? 'true' : 'false');
  };

  const [youtubeChannelUrl, setYoutubeChannelUrl] = useState<string>(
    'https://www.youtube.com/@IONIVoiceStudio'
  );
  const [hasApiKey, setHasApiKey] = useState<boolean>(true);

  // Modals
  const [isVercelModalOpen, setIsVercelModalOpen] = useState<boolean>(false);
  const [isGateModalOpen, setIsGateModalOpen] = useState<boolean>(() => {
    return localStorage.getItem('ioni_gate_unlocked') !== 'true';
  });

  // 1-Month Free Trial tracking
  const [trialState, setTrialState] = useState<TrialState>(() => {
    const saved = localStorage.getItem('ioni_trial');
    const now = new Date();
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const end = new Date(parsed.endDate);
        const diffMs = end.getTime() - now.getTime();
        const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
        return {
          ...parsed,
          daysRemaining,
          isActive: daysRemaining > 0,
        };
      } catch {
        // fallback
      }
    }
    const end = new Date();
    end.setDate(end.getDate() + 30);
    const initial: TrialState = {
      isActive: true,
      startDate: now.toISOString(),
      endDate: end.toISOString(),
      daysRemaining: 30,
      planName: 'trial',
      usage: {
        voiceGenerations: 4,
        maxVoiceGenerations: 100,
        imageGenerations: 2,
        maxImageGenerations: 50,
        chatMessages: 7,
        maxChatMessages: 100,
        videoPlans: 1,
        maxVideoPlans: 20,
      },
    };
    localStorage.setItem('ioni_trial', JSON.stringify(initial));
    return initial;
  });

  const recordUsage = (type: 'voice' | 'image' | 'chat' | 'videoPlans') => {
    setTrialState((prev) => {
      const keyMap: Record<string, keyof TrialState['usage']> = {
        voice: 'voiceGenerations',
        image: 'imageGenerations',
        chat: 'chatMessages',
        videoPlans: 'videoPlans',
      };
      const usageKey = keyMap[type];
      const updated = {
        ...prev,
        usage: {
          ...prev.usage,
          [usageKey]: (prev.usage[usageKey] || 0) + 1,
        },
      };
      localStorage.setItem('ioni_trial', JSON.stringify(updated));
      return updated;
    });
  };

  // Voice history
  const [voiceHistory, setVoiceHistory] = useState<VoiceGenerationItem[]>(() => {
    const saved = localStorage.getItem('ioni_voice_history');
    return saved ? JSON.parse(saved) : [];
  });

  const addVoiceItem = (item: VoiceGenerationItem) => {
    setVoiceHistory((prev) => {
      const next = [item, ...prev].slice(0, 20);
      localStorage.setItem('ioni_voice_history', JSON.stringify(next));
      return next;
    });
  };

  const removeVoiceItem = (id: string) => {
    setVoiceHistory((prev) => {
      const next = prev.filter((i) => i.id !== id);
      localStorage.setItem('ioni_voice_history', JSON.stringify(next));
      return next;
    });
  };

  // Image history
  const [imageHistory, setImageHistory] = useState<ImageGenerationItem[]>(() => {
    const saved = localStorage.getItem('ioni_image_history');
    return saved ? JSON.parse(saved) : [];
  });

  const addImageItem = (item: ImageGenerationItem) => {
    setImageHistory((prev) => {
      const next = [item, ...prev].slice(0, 15);
      localStorage.setItem('ioni_image_history', JSON.stringify(next));
      return next;
    });
  };

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch server config on mount
  useEffect(() => {
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => {
        if (data.youtubeChannelUrl) setYoutubeChannelUrl(data.youtubeChannelUrl);
        if (typeof data.hasKey === 'boolean') setHasApiKey(data.hasKey);
      })
      .catch((err) => {
        console.warn('Could not fetch /api/config', err);
      });
  }, []);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        activeTab,
        setActiveTab,
        trialState,
        recordUsage,
        hasSubscribed,
        setHasSubscribed,
        youtubeChannelUrl,
        setYoutubeChannelUrl,
        hasApiKey,
        isVercelModalOpen,
        setIsVercelModalOpen,
        isGateModalOpen,
        setIsGateModalOpen,
        voiceHistory,
        addVoiceItem,
        removeVoiceItem,
        imageHistory,
        addImageItem,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
