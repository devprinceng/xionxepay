// import cron from 'node-cron';
// import { PaymentSession } from '../models/paymentSessionModel';

// cron.schedule('0 * * * *', async () => {
//   const result = await PaymentSession.deleteMany({
//     status: { $ne: 'completed' },
//     expiresAt: { $lt: new Date() },
//   });
//   console.log(`Deleted ${result.deletedCount} expired sessions.`);
// });