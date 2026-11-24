export const APP_NAME = 'ABES Mess Coupon System';
export const COLLEGE_NAME = 'ABES Engineering College, Ghaziabad';

export const MEAL_TYPES = {
  BREAKFAST: 'Breakfast',
  LUNCH: 'Lunch',
  SNACKS: 'Snacks',
  DINNER: 'Dinner'
};

//shows the rush time of the meals
export const MEAL_TIMINGS = {
  [MEAL_TYPES.BREAKFAST]: { start: '07:30', end: '09:30', cutoff: '06:30', display: '7:30 AM - 9:30 AM' },
  [MEAL_TYPES.LUNCH]: { start: '12:30', end: '14:30', cutoff: '11:00', display: '12:30 PM - 2:30 PM' },
  [MEAL_TYPES.SNACKS]: { start: '17:00', end: '18:00', cutoff: '16:00', display: '5:00 PM - 6:00 PM' },
  [MEAL_TYPES.DINNER]: { start: '19:30', end: '21:30', cutoff: '18:30', display: '7:30 PM - 9:30 PM' },
};

// times slots where user book the slot
export const TIME_SLOTS = {
  [MEAL_TYPES.BREAKFAST]: ['07:30 - 08:00', '08:00 - 08:30', '08:30 - 09:00', '09:00 - 09:30'],
  [MEAL_TYPES.LUNCH]: ['12:30 - 13:00', '13:00 - 13:30', '13:30 - 14:00', '14:00 - 14:30'],
  [MEAL_TYPES.SNACKS]: ['17:00 - 17:20', '17:20 - 17:40', '17:40 - 18:00'],
  [MEAL_TYPES.DINNER]: ['19:30 - 20:00', '20:00 - 20:30', '20:30 - 21:00', '21:00 - 21:30'],
};

export const USER_ROLES = {
  STUDENT: 'student',
  STAFF: 'staff',
  MANAGER: 'manager',
  ADMIN: 'admin'
};

export const COUPON_STATUS = {
  ACTIVE: 'Active',
  USED: 'Used',
  EXPIRED: 'Expired',
  SKIPPED: 'Skipped',
  BOOKED: 'Booked'
};

export const QR_REFRESH_INTERVAL = 60; // seconds
export const IS_DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';
