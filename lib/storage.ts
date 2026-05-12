export interface User {
  phone: string;
  pin: string;
  businessName: string;
}

export interface BusinessProfile {
  businessType: string;
  location: string;
  mobileMoneyAccount: string;
}

export interface Transaction {
  id: string;
  type: 'sale' | 'expense' | 'mobile_money';
  amount: number;
  date: string;
  description: string;
}

// In-memory mock or local storage wrapper
export const storage = {
  getUsers: (): User[] => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('users') || '[]');
  },
  saveUser: (user: User) => {
    if (typeof window === 'undefined') return;
    const users = storage.getUsers();
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
  },
  getUser: (phone: string): User | undefined => {
    return storage.getUsers().find(u => u.phone === phone);
  },
  
  // Current logged in user
  setCurrentUser: (phone: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('currentUser', phone);
  },
  getCurrentUser: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('currentUser');
  },
  logout: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('currentUser');
  },

  // Business Profile
  saveProfile: (phone: string, profile: BusinessProfile) => {
    if (typeof window === 'undefined') return;
    const profiles = JSON.parse(localStorage.getItem('profiles') || '{}');
    profiles[phone] = profile;
    localStorage.setItem('profiles', JSON.stringify(profiles));
  },
  getProfile: (phone: string): BusinessProfile | null => {
    if (typeof window === 'undefined') return null;
    const profiles = JSON.parse(localStorage.getItem('profiles') || '{}');
    return profiles[phone] || null;
  },

  // Transactions
  getTransactions: (phone: string): Transaction[] => {
    if (typeof window === 'undefined') return [];
    const txns = JSON.parse(localStorage.getItem('transactions') || '{}');
    return txns[phone] || [];
  },
  saveTransaction: (phone: string, transaction: Omit<Transaction, 'id'>) => {
    if (typeof window === 'undefined') return;
    const txns = JSON.parse(localStorage.getItem('transactions') || '{}');
    if (!txns[phone]) txns[phone] = [];
    const newTxn = { ...transaction, id: Math.random().toString(36).substring(7) };
    txns[phone].push(newTxn);
    localStorage.setItem('transactions', JSON.stringify(txns));
  },

  // Consent
  setConsent: (phone: string, granted: boolean) => {
    if (typeof window === 'undefined') return;
    const consents = JSON.parse(localStorage.getItem('consents') || '{}');
    consents[phone] = granted;
    localStorage.setItem('consents', JSON.stringify(consents));
  },
  getConsent: (phone: string): boolean => {
    if (typeof window === 'undefined') return false;
    const consents = JSON.parse(localStorage.getItem('consents') || '{}');
    return consents[phone] || false;
  }
};
