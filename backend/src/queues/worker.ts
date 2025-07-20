// import { Worker, Job } from 'bullmq';
// import axios from 'axios';
// import { PaymentSession } from '../models/paymentSessionModel';
// import { connection } from './paymentQueue';
// import { paymentSuccessEmail,paymentTimeoutEmail } from '../utils/mailer'; // uncomment if used

// // Define the expected job data shape
// interface PaymentCheckJob {
//   sessionId: string;
//   address: string;
//   expectedAmount: string;
//   vendorEmail: string;
//   expiresAt: string;
// }

// // Define type for log structure from tx logs
// interface Log {
//   events: {
//     type: string;
//     attributes: {
//       key: string;
//       value: string;
//     }[];
//   }[];
// }

// // Start the worker
// new Worker<PaymentCheckJob>(
//   'payment-checker',
//   async (job: Job<PaymentCheckJob>) => {
//     const { sessionId, address, expectedAmount, vendorEmail, expiresAt} = job.data;

//     const pollInterval = 5000;
//     const timeoutAt = new Date(expiresAt).getTime();
//     const seenTxs = new Set<string>();
    
//     while (Date.now() < timeoutAt) {
//       const session = await PaymentSession.findOne({ sessionId });
//       if (!session || session.status !== 'pending') return;
      
//       try {
//         const url = `https://api.xion-testnet-2.burnt.com/cosmos/tx/v1beta1/txs?events=transfer.recipient='${address}'`;
//         const { data } = await axios.get(url);
//         const txs = data.tx_responses || [];

//         for (const tx of txs) {
//           if (seenTxs.has(tx.txhash)) continue;
//           seenTxs.add(tx.txhash);

//           const matched = (tx.logs as Log[]).some((log) =>
//             log.events.some((event) =>
//               event.type === 'transfer' &&
//               event.attributes.some(
//                 (attr) =>
//                   attr.key === 'amount' && attr.value.startsWith(expectedAmount)
//               )
//             )
//           );

//           if (matched) {
//             session.status = 'completed';
//             session.txHash = tx.txhash;
//             await session.save();

//             await paymentSuccessEmail(
//               vendorEmail,
//               expectedAmount,
//               txs[0].txhash,
//               sessionId
//             );
//             await paymentSuccessEmail(
//               session.customerEmail || '',
//               expectedAmount,
//               txs[0].txhash,
//               sessionId
//             );
//             return;
//           }
//         }
//       } catch (e: any) {
//         console.error('Polling error:', e.message || e);
//       }

//       await new Promise((res) => setTimeout(res, pollInterval));
//     }

//     // If timed out
//     await PaymentSession.updateOne({ sessionId }, { status: 'expired' });

//     await paymentTimeoutEmail(
//         vendorEmail,
//         expectedAmount,
//         sessionId
//     );
//   },
//   { connection }
// );
