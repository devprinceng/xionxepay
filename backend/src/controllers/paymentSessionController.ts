import { Request, Response } from 'express';
import { PaymentSession } from '../models/paymentSessionModel';
import { paymentSuccessEmail } from '../utils/mailer'; 
import { Vendor } from '../models/vendorModel';
// import { paymentQueue } from '../queues/paymentQueue';

export const startPaymentSession = async (req: Request, res: Response) => {
  const {transactionId, productId, expectedAmount, sessionId, memo} = req.body;
  const vendorId = req.user?._id;

  if (!transactionId||!vendorId || !productId || !expectedAmount || !sessionId || !memo) {
    res.status(400).json({ success: false, message: 'Missing required fields' });
    return;
  }
  

  await PaymentSession.create({ sessionId, vendorId, productId, expectedAmount, memo, transactionId});
  // await paymentQueue.add('poll-xion', { sessionId, address, expectedAmount, expiresAt,memo }, {
  //   attempts: 3,
  //   backoff: { type: 'exponential', delay: 10000 }
  // });

  res.status(200).json({ sessionId, message: 'Payment session started' });
  return;
};

export const getPaymentStatus = async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const session = await PaymentSession.findOne({ sessionId });
  if (!session) {
    res.status(404).json({ success: false, message: 'Session not found' });
    return;
  }
  res.status(200).json({ success: true, session });
  return;
};

export const updatePaymentSession = async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const { email} = req.body;

  const exist = await PaymentSession.findOne({ customerEmail: email });
  if (exist) {
    res.status(400).json({ success: false, message: 'You already have a pending payment session', session: exist });
    return;
  }

  const session = await PaymentSession.findOneAndUpdate(
    { sessionId },
    { customerEmail: email },
    { new: true }
  );

  if (!session) { res.status(404).json({ success: false, message: 'Session not found' }); return; }

  res.status(200).json({ success: true, session });
  return;
}

// 

export const completePaymentSession = async (req: Request, res: Response) => {
  const { sessionId,transactionHash } = req.body;
  const session = await PaymentSession.findOneAndUpdate(
    { sessionId },
    { status: 'completed', txHash: transactionHash },
    { new: true }
  );

  if (!session) {
    res.status(404).json({ success: false, message: 'Session not found' });
    return;
  }
  const vendor = await Vendor.findById(session.vendorId);
  if (vendor) {
  await paymentSuccessEmail(
              session.customerEmail || '',
              session.expectedAmount || '',
              session.txHash || '',
              sessionId
            );
          }
          
  // sessionId:{ type: string; unique: true };
  //   vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true };
  //   productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }; // Product ID
  //   address: string;
  //   customerEmail?: string;
  //   expectedAmount: string;
  //   status: "pending" | "completed" | "failed"| "expired";
  //   txHash?: string;
  //   createdAt: Date;
  //   expiresAt: Date;
  // }


   await paymentSuccessEmail(
              session.customerEmail || '',
              session.expectedAmount || '',
              session.txHash || '',
              sessionId
            );
  res.status(200).json({ success: true, session });
  return;
};

export const getActivePaymentSessions = async (req: Request, res: Response) => {
  const vendorId = req.user?._id; // Assuming req.user is set by isAuthenticated middleware
  const sessions = await PaymentSession.find({ vendorId, status: 'pending' });
  if (!sessions || sessions.length === 0) {
    res.status(404).json({ success: false, message: 'No active payment sessions found' });
    return;
  }
  // Populate productId with name and price
  const populatedSessions = await PaymentSession.populate(sessions, { path: 'productId', select: 'name price' });
  res.status(200).json({ success: true, sessions: populatedSessions });
  return;
};
//Payment Session within 24 hours
export const getAllPaymentSessions = async (req: Request, res: Response) => {
  const vendorId = req.user?._id; // Assuming req.user is set by isAuthenticated middleware
  const sessions = await PaymentSession.find({ vendorId }).populate('productId', 'name price');
  res.status(200).json({ success: true, sessions });
  return;
};