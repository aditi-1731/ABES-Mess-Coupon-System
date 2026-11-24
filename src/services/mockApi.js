import { initialUsers } from '../data/users';
import { initialPlans } from '../data/plans';
import { initialMenu } from '../data/menu';
import { initialBookings } from '../data/bookings';
import { initialHistory } from '../data/history';
import { initialNotifications } from '../data/notifications';
import { initialFeedback } from '../data/feedback';
import { initialStats } from '../data/stats';
import { parseCouponToken, isTokenExpired } from '../utils/generateToken';
import { getTodayDateString } from '../utils/formatDate';

const STORAGE_KEYS = {
  USERS: 'abes_users',
  PLANS: 'abes_plans',
  MENU: 'abes_menu',
  BOOKINGS: 'abes_bookings',
  HISTORY: 'abes_history',
  NOTIFICATIONS: 'abes_notifications',
  FEEDBACK: 'abes_feedback',
  STATS: 'abes_stats',
  SESSION: 'abes_session'
};

// Simulated network latency
const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

// Broadcast storage changes for cross-tab sync
function notifyStorageChange(key) {
  try {
    window.dispatchEvent(new Event('storage'));
  } catch {
    // ignore
  }
}

// LocalStorage helpers
function getItem(key, defaultValue) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return defaultValue;
  }
}

function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifyStorageChange(key);
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
}

// Initialize default data if not present
export function initLocalStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    setItem(STORAGE_KEYS.USERS, initialUsers);
  } else {
    // Ensure primary student is updated to aditi.24b0101070@abes.ac.in
    const users = getItem(STORAGE_KEYS.USERS, []);
    const idx = users.findIndex(u => u.id === 'usr-student-1' || u.email === 'aarav@abes.ac.in');
    if (idx !== -1 && users[idx].email !== 'aditi.24b0101070@abes.ac.in') {
      users[idx] = { ...users[idx], ...initialUsers[0] };
      setItem(STORAGE_KEYS.USERS, users);
    }
  }
  if (!localStorage.getItem(STORAGE_KEYS.PLANS)) setItem(STORAGE_KEYS.PLANS, initialPlans);
  if (!localStorage.getItem(STORAGE_KEYS.MENU)) setItem(STORAGE_KEYS.MENU, initialMenu);
  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) setItem(STORAGE_KEYS.BOOKINGS, initialBookings);
  if (!localStorage.getItem(STORAGE_KEYS.HISTORY)) setItem(STORAGE_KEYS.HISTORY, initialHistory);
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) setItem(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
  if (!localStorage.getItem(STORAGE_KEYS.FEEDBACK)) setItem(STORAGE_KEYS.FEEDBACK, initialFeedback);
  if (!localStorage.getItem(STORAGE_KEYS.STATS)) setItem(STORAGE_KEYS.STATS, initialStats);
}

// Automatically seed on load
initLocalStorage();

// ==========================================
// AUTHENTICATION & USER MANAGEMENT
// ==========================================

// future: POST /auth/login
export async function login(email, password) {
  await delay(450);
  const users = getItem(STORAGE_KEYS.USERS, initialUsers);
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    throw new Error('No user found with this email address.');
  }

  if (user.password !== password) {
    throw new Error('Incorrect password. Please verify and try again.');
  }

  if (user.status === 'inactive') {
    throw new Error('Your account has been deactivated by administrator.');
  }

  // Safe user without password
  const { password: _, ...safeUser } = user;
  setItem(STORAGE_KEYS.SESSION, safeUser);
  return safeUser;
}

// future: POST /auth/register
export async function register(userData) {
  await delay(500);
  const users = getItem(STORAGE_KEYS.USERS, initialUsers);

  if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
    throw new Error('An account with this email already exists.');
  }

  if (userData.rollNo && users.some(u => u.rollNo === userData.rollNo)) {
    throw new Error('An account with this Roll Number is already registered.');
  }

  const newUser = {
    id: `usr-student-${Date.now()}`,
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: 'student',
    rollNo: userData.rollNo,
    department: userData.department,
    batch: userData.batch || '2023 - 2027',
    hostelType: userData.hostelType || 'Hosteller',
    hostelName: userData.hostelName || 'Vivekananda Boys Hostel',
    phone: userData.phone || '+91 98765 00000',
    dietaryPreference: userData.dietaryPreference || 'veg',
    mealsLeft: 0,
    currentPlanId: null,
    planExpiry: null,
    avatar: userData.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
    status: 'active',
    joinedDate: getTodayDateString()
  };

  users.push(newUser);
  setItem(STORAGE_KEYS.USERS, users);

  const { password: _, ...safeUser } = newUser;
  return safeUser;
}

// future: GET /auth/me
export async function getCurrentUser() {
  await delay(200);
  const session = getItem(STORAGE_KEYS.SESSION, null);
  if (!session) return null;

  const users = getItem(STORAGE_KEYS.USERS, initialUsers);
  const user = users.find(u => u.id === session.id);
  if (!user) return null;

  const { password: _, ...safeUser } = user;
  return safeUser;
}

// future: PUT /users/:id/profile
export async function updateProfile(userId, updateData) {
  await delay(400);
  const users = getItem(STORAGE_KEYS.USERS, initialUsers);
  const idx = users.findIndex(u => u.id === userId);

  if (idx === -1) throw new Error('User not found.');

  users[idx] = { ...users[idx], ...updateData };
  setItem(STORAGE_KEYS.USERS, users);

  const session = getItem(STORAGE_KEYS.SESSION, null);
  if (session && session.id === userId) {
    const { password: _, ...safeUser } = users[idx];
    setItem(STORAGE_KEYS.SESSION, safeUser);
  }

  return users[idx];
}

// ==========================================
// MEAL PLANS & SUBSCRIPTIONS
// ==========================================

// future: GET /plans
export async function getPlans() {
  await delay(300);
  return getItem(STORAGE_KEYS.PLANS, initialPlans);
}

// future: POST /subscriptions/buy
export async function buySubscription(userId, planId, paymentDetails) {
  await delay(600);
  const users = getItem(STORAGE_KEYS.USERS, initialUsers);
  const plans = getItem(STORAGE_KEYS.PLANS, initialPlans);

  const userIdx = users.findIndex(u => u.id === userId);
  if (userIdx === -1) throw new Error('User not found.');

  const plan = plans.find(p => p.id === planId);
  if (!plan) throw new Error('Plan not found.');

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + (plan.id === 'plan-weekly' ? 7 : 30));

  users[userIdx].currentPlanId = plan.id;
  users[userIdx].mealsLeft = (users[userIdx].mealsLeft || 0) + plan.mealCount;
  users[userIdx].planExpiry = expiryDate.toISOString().split('T')[0];

  setItem(STORAGE_KEYS.USERS, users);

  // Update session
  const session = getItem(STORAGE_KEYS.SESSION, null);
  if (session && session.id === userId) {
    const { password: _, ...safeUser } = users[userIdx];
    setItem(STORAGE_KEYS.SESSION, safeUser);
  }

  // Add notification
  await addNotification({
    userId,
    title: `Subscription Activated: ${plan.name} 🎉`,
    message: `Your account has been credited with ${plan.mealCount} meals. Valid till ${users[userIdx].planExpiry}.`,
    type: 'plan',
    link: '/student/plans'
  });

  return {
    success: true,
    user: users[userIdx],
    plan,
    transactionId: `TXN-${Date.now().toString().slice(-8)}`,
    amountPaid: plan.price,
    paymentMethod: paymentDetails?.method || 'UPI',
    timestamp: new Date().toISOString()
  };
}

// ==========================================
// MENU MANAGEMENT
// ==========================================

// future: GET /menu
export async function getMenu(dayFilter = null) {
  await delay(300);
  const menu = getItem(STORAGE_KEYS.MENU, initialMenu);
  if (!dayFilter) return menu;
  return menu.filter(m => m.day.toLowerCase() === dayFilter.toLowerCase());
}

// future: POST /menu/dishes
export async function addDish(dishData) {
  await delay(400);
  const menu = getItem(STORAGE_KEYS.MENU, initialMenu);
  const newDish = {
    ...dishData,
    id: `menu-${Date.now()}`,
    rating: 4.8
  };
  menu.push(newDish);
  setItem(STORAGE_KEYS.MENU, menu);
  return newDish;
}

// future: PUT /menu/dishes/:id
export async function updateDish(dishId, dishData) {
  await delay(400);
  const menu = getItem(STORAGE_KEYS.MENU, initialMenu);
  const idx = menu.findIndex(m => m.id === dishId);
  if (idx === -1) throw new Error('Menu item not found.');

  menu[idx] = { ...menu[idx], ...dishData };
  setItem(STORAGE_KEYS.MENU, menu);
  return menu[idx];
}

// future: DELETE /menu/dishes/:id
export async function deleteDish(dishId) {
  await delay(350);
  let menu = getItem(STORAGE_KEYS.MENU, initialMenu);
  menu = menu.filter(m => m.id !== dishId);
  setItem(STORAGE_KEYS.MENU, menu);
  return { success: true };
}

// ==========================================
// BOOKINGS & COUPON VERIFICATION
// ==========================================

// future: GET /bookings
export async function getBookings(userId = null, dateFilter = null) {
  await delay(350);
  let bookings = getItem(STORAGE_KEYS.BOOKINGS, initialBookings);
  if (userId) {
    bookings = bookings.filter(b => b.userId === userId);
  }
  if (dateFilter) {
    bookings = bookings.filter(b => b.date === dateFilter);
  }
  return bookings;
}

// future: POST /bookings
export async function bookMeal(userId, bookingData) {
  await delay(500);
  const users = getItem(STORAGE_KEYS.USERS, initialUsers);
  const user = users.find(u => u.id === userId);

  if (!user) throw new Error('User not found.');
  if (user.mealsLeft <= 0) {
    throw new Error('No meals left in your plan! Please buy a subscription or recharge wallet.');
  }

  const bookings = getItem(STORAGE_KEYS.BOOKINGS, initialBookings);
  const date = bookingData.date || getTodayDateString();

  // Check if already booked
  const existing = bookings.find(
    b => b.userId === userId && b.date === date && b.mealType === bookingData.mealType && b.status !== 'Cancelled'
  );

  if (existing) {
    throw new Error(`You have already booked ${bookingData.mealType} for ${date}.`);
  }

  const newBooking = {
    id: `bk-${Date.now()}`,
    userId,
    studentName: user.name,
    rollNo: user.rollNo,
    date,
    mealType: bookingData.mealType,
    menuId: bookingData.menuId,
    menuName: bookingData.menuName,
    slot: bookingData.slot || '12:30 - 13:00',
    status: 'Active',
    bookedAt: new Date().toISOString(),
    servedAt: null,
    servedBy: null,
    couponToken: null
  };

  bookings.push(newBooking);
  setItem(STORAGE_KEYS.BOOKINGS, bookings);

  return newBooking;
}

// future: PATCH /bookings/:id/skip
export async function skipMeal(userId, bookingId) {
  await delay(400);
  const bookings = getItem(STORAGE_KEYS.BOOKINGS, initialBookings);
  const idx = bookings.findIndex(b => b.id === bookingId && b.userId === userId);

  if (idx === -1) throw new Error('Booking not found.');

  bookings[idx].status = 'Skipped';
  setItem(STORAGE_KEYS.BOOKINGS, bookings);

  // Add history record for skipped meal
  const history = getItem(STORAGE_KEYS.HISTORY, initialHistory);
  history.unshift({
    id: `hist-${Date.now()}`,
    userId,
    studentName: bookings[idx].studentName,
    date: bookings[idx].date,
    mealType: bookings[idx].mealType,
    menuName: bookings[idx].menuName,
    slot: bookings[idx].slot,
    status: 'Skipped',
    servedAt: null,
    counter: null,
    rating: null,
    review: 'Skipped by student'
  });
  setItem(STORAGE_KEYS.HISTORY, history);

  return bookings[idx];
}

// future: DELETE /bookings/:id
export async function cancelBooking(userId, bookingId) {
  await delay(350);
  let bookings = getItem(STORAGE_KEYS.BOOKINGS, initialBookings);
  const booking = bookings.find(b => b.id === bookingId && b.userId === userId);

  if (!booking) throw new Error('Booking not found.');

  bookings = bookings.filter(b => b.id !== bookingId);
  setItem(STORAGE_KEYS.BOOKINGS, bookings);

  return { success: true };
}

// future: POST /coupons/verify (Counter Staff Scanner)
export async function verifyCoupon(tokenOrBookingId, counterName = 'Counter 1 - Main Hall') {
  await delay(450);
  const bookings = getItem(STORAGE_KEYS.BOOKINGS, initialBookings);
  const users = getItem(STORAGE_KEYS.USERS, initialUsers);
  const history = getItem(STORAGE_KEYS.HISTORY, initialHistory);

  // Check if simulated token flags were passed
  if (tokenOrBookingId === 'SIMULATE_EXPIRED') {
    return {
      status: 'EXPIRED',
      message: 'QR Token has expired (refresh limit exceeded). Please ask student to show a live coupon.',
      student: null,
      booking: null
    };
  }

  if (tokenOrBookingId === 'SIMULATE_ALREADY_USED') {
    return {
      status: 'ALREADY_USED',
      message: 'This coupon has already been redeemed today!',
      usedAt: new Date(Date.now() - 15 * 60 * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
      servedBy: 'Counter 1 - Main Hall',
      student: { name: 'Rohit Verma', rollNo: '2200320100088' },
      booking: { mealType: 'Lunch', menuName: 'Dal Makhani & Jeera Rice' }
    };
  }

  // Parse structured token
  let parsed = parseCouponToken(tokenOrBookingId);
  let targetBooking = null;

  if (parsed) {
    // Check expiration (60s token age check)
    // For demo convenience, allow recent tokens
    targetBooking = bookings.find(b => b.id === parsed.couponId);
    if (!targetBooking) {
      targetBooking = bookings.find(b => b.userId === parsed.studentId && b.status === 'Active');
    }
  } else {
    // Direct booking ID search
    targetBooking = bookings.find(b => b.id === tokenOrBookingId || b.userId === tokenOrBookingId);
  }

  if (!targetBooking) {
    return {
      status: 'NOT_BOOKED',
      message: 'No active meal booking found for this student.',
      student: null,
      booking: null
    };
  }

  if (targetBooking.status === 'Used') {
    const user = users.find(u => u.id === targetBooking.userId);
    return {
      status: 'ALREADY_USED',
      message: 'This coupon was already redeemed.',
      usedAt: targetBooking.servedAt ? new Date(targetBooking.servedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'Earlier today',
      servedBy: targetBooking.servedBy || counterName,
      student: user || { name: targetBooking.studentName, rollNo: targetBooking.rollNo },
      booking: targetBooking
    };
  }

  if (targetBooking.status === 'Expired' || targetBooking.status === 'Skipped') {
    return {
      status: 'EXPIRED',
      message: `Coupon status is ${targetBooking.status}. Not eligible for meal pickup.`,
      student: { name: targetBooking.studentName, rollNo: targetBooking.rollNo },
      booking: targetBooking
    };
  }

  // Coupon is VALID! Mark it as Used
  const now = new Date().toISOString();
  targetBooking.status = 'Used';
  targetBooking.servedAt = now;
  targetBooking.servedBy = counterName;
  setItem(STORAGE_KEYS.BOOKINGS, bookings);

  // Decrement student meals left
  const userIdx = users.findIndex(u => u.id === targetBooking.userId);
  let remainingMeals = 0;
  if (userIdx !== -1) {
    if (users[userIdx].mealsLeft > 0) {
      users[userIdx].mealsLeft -= 1;
    }
    remainingMeals = users[userIdx].mealsLeft;
    setItem(STORAGE_KEYS.USERS, users);

    // Sync session if logged in student is this user
    const session = getItem(STORAGE_KEYS.SESSION, null);
    if (session && session.id === targetBooking.userId) {
      const { password: _, ...safeUser } = users[userIdx];
      setItem(STORAGE_KEYS.SESSION, safeUser);
    }
  }

  // Add record to History
  history.unshift({
    id: `hist-${Date.now()}`,
    userId: targetBooking.userId,
    studentName: targetBooking.studentName,
    date: targetBooking.date,
    mealType: targetBooking.mealType,
    menuName: targetBooking.menuName,
    slot: targetBooking.slot,
    status: 'Served',
    servedAt: now,
    counter: counterName,
    rating: null,
    review: null
  });
  setItem(STORAGE_KEYS.HISTORY, history);

  // Send notification to student
  await addNotification({
    userId: targetBooking.userId,
    title: 'Meal Served! 🍽️',
    message: `Your ${targetBooking.mealType} was verified at ${counterName}. Enjoy your meal!`,
    type: 'coupon',
    link: '/student/history'
  });

  return {
    status: 'VALID',
    message: 'Meal coupon verified successfully! Serve meal.',
    student: users[userIdx] || { name: targetBooking.studentName, rollNo: targetBooking.rollNo, mealsLeft: remainingMeals },
    booking: targetBooking,
    remainingMeals,
    servedAt: now
  };
}

// ==========================================
// HISTORY & EXPORT
// ==========================================

// future: GET /history
export async function getHistory(userId = null, filters = {}) {
  await delay(300);
  let history = getItem(STORAGE_KEYS.HISTORY, initialHistory);

  if (userId) {
    history = history.filter(h => h.userId === userId);
  }

  if (filters.mealType && filters.mealType !== 'all') {
    history = history.filter(h => h.mealType.toLowerCase() === filters.mealType.toLowerCase());
  }

  if (filters.status && filters.status !== 'all') {
    history = history.filter(h => h.status.toLowerCase() === filters.status.toLowerCase());
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    history = history.filter(h =>
      h.menuName.toLowerCase().includes(q) ||
      h.mealType.toLowerCase().includes(q) ||
      h.date.includes(q)
    );
  }

  return history;
}

// future: PATCH /history/:id/rate
export async function rateMeal(historyId, rating, review) {
  await delay(350);
  const history = getItem(STORAGE_KEYS.HISTORY, initialHistory);
  const idx = history.findIndex(h => h.id === historyId);

  if (idx !== -1) {
    history[idx].rating = rating;
    history[idx].review = review;
    setItem(STORAGE_KEYS.HISTORY, history);
    return history[idx];
  }
  throw new Error('History record not found.');
}

// ==========================================
// FEEDBACK & COMPLAINTS
// ==========================================

// future: GET /feedback
export async function getFeedback(filters = {}) {
  await delay(300);
  let feedback = getItem(STORAGE_KEYS.FEEDBACK, initialFeedback);

  if (filters.type && filters.type !== 'all') {
    feedback = feedback.filter(f => f.type === filters.type);
  }
  if (filters.userId) {
    feedback = feedback.filter(f => f.userId === filters.userId);
  }

  return feedback;
}

// future: POST /feedback
export async function submitFeedback(feedbackData) {
  await delay(450);
  const feedback = getItem(STORAGE_KEYS.FEEDBACK, initialFeedback);
  const newEntry = {
    ...feedbackData,
    id: `fb-${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  if (newEntry.type === 'complaint' && !newEntry.ticketNumber) {
    newEntry.ticketNumber = `TKT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    newEntry.status = 'Open';
  }

  feedback.unshift(newEntry);
  setItem(STORAGE_KEYS.FEEDBACK, feedback);
  return newEntry;
}

// future: PATCH /feedback/tickets/:id
export async function replyComplaint(ticketId, managerReply, newStatus = 'Resolved') {
  await delay(400);
  const feedback = getItem(STORAGE_KEYS.FEEDBACK, initialFeedback);
  const idx = feedback.findIndex(f => f.id === ticketId || f.ticketNumber === ticketId);

  if (idx === -1) throw new Error('Ticket not found.');

  feedback[idx].managerReply = managerReply;
  feedback[idx].status = newStatus;
  setItem(STORAGE_KEYS.FEEDBACK, feedback);

  if (feedback[idx].userId) {
    await addNotification({
      userId: feedback[idx].userId,
      title: `Update on Ticket ${feedback[idx].ticketNumber}`,
      message: `Manager response: "${managerReply}"`,
      type: 'feedback',
      link: '/student/feedback'
    });
  }

  return feedback[idx];
}

// ==========================================
// NOTIFICATIONS
// ==========================================

// future: GET /notifications
export async function getNotifications(userId) {
  await delay(250);
  const notifs = getItem(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
  return notifs.filter(n => n.userId === userId || n.userId === 'all');
}

// future: POST /notifications
export async function addNotification(notificationData) {
  const notifs = getItem(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
  const newNotif = {
    id: `notif-${Date.now()}`,
    ...notificationData,
    timestamp: new Date().toISOString(),
    isRead: false
  };
  notifs.unshift(newNotif);
  setItem(STORAGE_KEYS.NOTIFICATIONS, notifs);
  return newNotif;
}

// future: PATCH /notifications/:id/read
export async function markNotificationRead(notifId) {
  const notifs = getItem(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
  const idx = notifs.findIndex(n => n.id === notifId);
  if (idx !== -1) {
    notifs[idx].isRead = true;
    setItem(STORAGE_KEYS.NOTIFICATIONS, notifs);
  }
  return { success: true };
}

// future: PATCH /notifications/mark-all-read
export async function markAllNotificationsRead(userId) {
  const notifs = getItem(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
  notifs.forEach(n => {
    if (n.userId === userId || n.userId === 'all') {
      n.isRead = true;
    }
  });
  setItem(STORAGE_KEYS.NOTIFICATIONS, notifs);
  return { success: true };
}

// ==========================================
// REPORTS & ANALYTICS
// ==========================================

// future: GET /reports/summary
export async function getReportsSummary() {
  await delay(350);
  return getItem(STORAGE_KEYS.STATS, initialStats);
}

// ==========================================
// ADMIN USER & SYSTEM SETTINGS
// ==========================================

// future: GET /admin/users
export async function getUsers(filters = {}) {
  await delay(350);
  let users = getItem(STORAGE_KEYS.USERS, initialUsers);

  if (filters.role && filters.role !== 'all') {
    users = users.filter(u => u.role === filters.role);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    users = users.filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.rollNo && u.rollNo.includes(q))
    );
  }

  return users;
}

// future: POST /admin/users
export async function addUser(userData) {
  await delay(450);
  const users = getItem(STORAGE_KEYS.USERS, initialUsers);

  const newUser = {
    ...userData,
    id: `usr-${userData.role}-${Date.now()}`,
    avatar: userData.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
    status: 'active',
    joinedDate: getTodayDateString()
  };

  users.push(newUser);
  setItem(STORAGE_KEYS.USERS, users);
  return newUser;
}

// future: PUT /admin/users/:id
export async function updateUser(userId, userData) {
  await delay(400);
  const users = getItem(STORAGE_KEYS.USERS, initialUsers);
  const idx = users.findIndex(u => u.id === userId);

  if (idx === -1) throw new Error('User not found.');

  users[idx] = { ...users[idx], ...userData };
  setItem(STORAGE_KEYS.USERS, users);
  return users[idx];
}

// future: DELETE /admin/users/:id
export async function deleteUser(userId) {
  await delay(350);
  let users = getItem(STORAGE_KEYS.USERS, initialUsers);
  users = users.filter(u => u.id !== userId);
  setItem(STORAGE_KEYS.USERS, users);
  return { success: true };
}

// future: PATCH /admin/users/:id/status
export async function toggleUserStatus(userId) {
  await delay(300);
  const users = getItem(STORAGE_KEYS.USERS, initialUsers);
  const user = users.find(u => u.id === userId);
  if (!user) throw new Error('User not found.');

  user.status = user.status === 'active' ? 'inactive' : 'active';
  setItem(STORAGE_KEYS.USERS, users);
  return user;
}

// future: POST /admin/reset
export async function resetDemoData() {
  await delay(600);
  localStorage.removeItem(STORAGE_KEYS.USERS);
  localStorage.removeItem(STORAGE_KEYS.PLANS);
  localStorage.removeItem(STORAGE_KEYS.MENU);
  localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
  localStorage.removeItem(STORAGE_KEYS.HISTORY);
  localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
  localStorage.removeItem(STORAGE_KEYS.FEEDBACK);
  localStorage.removeItem(STORAGE_KEYS.STATS);

  initLocalStorage();
  return { success: true };
}
