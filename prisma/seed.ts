// Prisma Database Seed Script
// Populates FitFlow with members, trainers, plans, exercises, and admin accounts

export const SEED_DATA = {
  users: [
    {
      id: 'usr-admin-01',
      name: 'Sarah Jenkins',
      email: 'admin@fitflow.io',
      role: 'ADMIN',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    },
    {
      id: 'usr-trainer-01',
      name: 'Marcus Vance',
      email: 'marcus.vance@fitflow.io',
      role: 'TRAINER',
      avatarUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=250',
    },
    {
      id: 'usr-trainer-02',
      name: 'Chloe Bennett',
      email: 'chloe.bennett@fitflow.io',
      role: 'TRAINER',
      avatarUrl: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=250',
    },
    {
      id: 'usr-member-01',
      name: 'Dhanush',
      email: 'dhanushj2007@gmail.com',
      role: 'MEMBER',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    },
  ],
  plans: [
    {
      name: 'Basic',
      priceMonthly: 49.0,
      priceYearly: 490.0,
      features: ['Full gym floor access', 'Standard locker room access', 'FitFlow mobile app tracking', '1 free fitness assessment'],
    },
    {
      name: 'Premium',
      priceMonthly: 89.0,
      priceYearly: 890.0,
      isPopular: true,
      features: ['All Basic Tier features', 'Unlimited group fitness classes', 'Sauna & cold plunge access', '2 monthly 1-on-1 PT sessions', 'Complimentary towel service'],
    },
    {
      name: 'Pro',
      priceMonthly: 139.0,
      priceYearly: 1390.0,
      features: ['All Premium Tier features', 'Weekly 1-on-1 personal coaching', 'Custom biometric nutrition design', 'VIP locker with laundry service', 'Quarterly body DEXA scan'],
    },
  ],
};

console.log('FitFlow Seed script ready for `npx prisma db seed`.');
