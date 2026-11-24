export const initialPlans = [
  {
    id: 'plan-monthly',
    name: 'Monthly Standard',
    tagline: 'Ideal for hostellers staying full semester',
    price: 3000,
    period: '30 Days',
    mealCount: 90,
    costPerMeal: 33.3,
    isPopular: true,
    features: [
      'Up to 90 meals across 30 days',
      'Valid for Breakfast, Lunch & Dinner',
      'Roll-over of up to 5 skipped meals',
      'Priority time-slot allocation',
      'Instant anti-fraud QR access',
      'Zero cancellation charge before cut-off'
    ],
    color: 'from-orange/10 to-orange/5 border-orange/40 dark:border-orange/30'
  },
  {
    id: 'plan-weekly',
    name: 'Weekly Flexi',
    tagline: 'Great for students testing the mess or short stays',
    price: 800,
    period: '7 Days',
    mealCount: 21,
    costPerMeal: 38.0,
    isPopular: false,
    features: [
      'Up to 21 meals in 7 days',
      'Flexible any-meal consumption',
      'Meal skip option up to 1 hr before cut-off',
      'Real-time crowd meter alerts',
      'Fast counter QR verification'
    ],
    color: 'from-blue-500/10 to-blue-500/5 border-blue-200 dark:border-blue-900/40'
  },
  {
    id: 'plan-ppm',
    name: 'Pay-Per-Meal (Wallet)',
    tagline: 'Best for day scholars & faculty guests',
    price: 60,
    period: 'Per Meal Token',
    mealCount: 1,
    costPerMeal: 60.0,
    isPopular: false,
    features: [
      'Single meal instant ticket',
      'Recharge wallet anytime via UPI',
      'Choose any meal of the day',
      'No fixed commitment or expiry',
      'Instant coupon issuance'
    ],
    color: 'from-emerald-500/10 to-emerald-500/5 border-emerald-200 dark:border-emerald-900/40'
  }
];
