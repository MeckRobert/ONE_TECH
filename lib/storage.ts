// lib/storage.ts

export interface User {
  phone: string;
  pin: string;
  businessName: string;
  businessType?: string;
  createdAt?: string;
  email?: string;
  profilePicture?: string;
  coverPhoto?: string;
  bio?: string;
  website?: string;
  address?: string;
  yearsInBusiness?: number;
  employees?: number;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export interface BusinessProfile {
  businessType: string;
  location: string;
  mobileMoneyAccount?: string;
  description?: string;
  category?: string;
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
  // User Management
  getUsers: (): User[] => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('users') || '[]');
  },
  
  saveUser: (user: User) => {
    if (typeof window === 'undefined') return;
    const users = storage.getUsers();
    const existingIndex = users.findIndex(u => u.phone === user.phone);
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem('users', JSON.stringify(users));
  },
  
  getUser: (phone: string): User | null => {
    const users = storage.getUsers();
    return users.find(u => u.phone === phone) || null;
  },
  
  updateUser: (phone: string, data: Partial<User>): void => {
    const user = storage.getUser(phone);
    if (user) {
      storage.saveUser({ ...user, ...data });
    }
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
    const newTxn = { 
      ...transaction, 
      id: Date.now().toString() + Math.random().toString(36).substring(7) 
    };
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
  },
  
  // Get all users who have consented (for network discovery)
  getUsersWithConsent: (): User[] => {
    const allUsers = storage.getUsers();
    return allUsers.filter(user => storage.getConsent(user.phone));
  },
  
  // Initialize demo data (optional)
  initDemoData: () => {
    if (typeof window === 'undefined') return;
    
    // Check if users already exist
    const existingUsers = storage.getUsers();
    if (existingUsers.length > 0) return;
    
    // Create demo users
    const demoUsers: User[] = [
      {
        phone: '+255712345678',
        pin: '1234',
        businessName: 'Tanzania Avocado Traders',
        businessType: 'Fruit Vendor',
        createdAt: new Date().toISOString(),
        email: 'avocado@example.com'
      },
      {
        phone: '+255788998877',
        pin: '1234',
        businessName: 'Kili Tech Solutions',
        businessType: 'Electronics',
        createdAt: new Date().toISOString(),
        email: 'tech@example.com'
      },
      {
        phone: '+255622112233',
        pin: '1234',
        businessName: 'Nail & Barber Elite',
        businessType: 'Barber Shop',
        createdAt: new Date().toISOString(),
        email: 'barber@example.com'
      }
    ];
    
    demoUsers.forEach(user => {
      storage.saveUser(user);
      storage.setConsent(user.phone, true);
    });
    
    // Create demo profiles
    const demoProfiles: Record<string, BusinessProfile> = {
      '+255712345678': {
        businessType: 'Fruit Vendor',
        location: 'Arusha / Dar es Salaam',
        mobileMoneyAccount: '0712345678',
        description: 'Fresh organic produce supplier'
      },
      '+255788998877': {
        businessType: 'Electronics',
        location: 'Dar es Salaam, Posta',
        mobileMoneyAccount: '0788998877',
        description: 'Tech accessories and gadgets'
      },
      '+255622112233': {
        businessType: 'Barber Shop',
        location: 'Sinza, Dar es Salaam',
        mobileMoneyAccount: '0622112233',
        description: 'Premium grooming services'
      }
    };
    
    Object.entries(demoProfiles).forEach(([phone, profile]) => {
      storage.saveProfile(phone, profile);
    });
  },

  // Synchronize local data to database
  syncWithDatabase: async (phone: string): Promise<boolean> => {
    try {
      const user = storage.getUser(phone);
      if (!user) return false;

      // 1. Sync User Profile
      const syncResponse = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: user.phone,
          pin: user.pin,
          businessName: user.businessName,
          email: user.email,
          fullName: user.businessName
        })
      });

      if (!syncResponse.ok) return false;
      const syncData = await syncResponse.json();

      if (!syncData.success) return false;

      // 2. Sync existing local transactions to database
      const txs = storage.getTransactions(phone);
      for (const tx of txs) {
        await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: phone,
            type: tx.type === 'sale' || tx.type === 'mobile_money' ? 'sale' : 'expense',
            amount: tx.amount,
            description: tx.description,
            date: tx.date
          })
        });
      }

      console.log('Successfully synchronized local data with PostgreSQL database!');
      return true;
    } catch (err) {
      console.error('Failed to sync with PostgreSQL database (offline fallback active):', err);
      return false;
    }
  },

  // Save transaction to DB + locally
  saveTransactionWithDb: async (phone: string, transaction: Omit<Transaction, 'id'>): Promise<{ success: boolean; recommendation?: any }> => {
    // Save locally first for offline-first backup
    storage.saveTransaction(phone, transaction);

    try {
      // Save to PostgreSQL database via API
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone,
          type: transaction.type === 'sale' || transaction.type === 'mobile_money' ? 'sale' : 'expense',
          amount: transaction.amount,
          description: transaction.description,
          date: transaction.date
        })
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          recommendation: data.recommendation
        };
      }
    } catch (err) {
      console.error('Failed to save transaction to database, kept local backup:', err);
    }

    return { success: false };
  }
};