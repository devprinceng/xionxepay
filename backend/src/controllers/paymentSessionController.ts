import { Request, Response } from 'express';
import { PaymentSession } from '../models/paymentSessionModel';
import { paymentSuccessEmail, paymentSuccessEmailVendor } from '../utils/mailer'; 
import { Vendor } from '../models/vendorModel';
import { Product } from '../models/productModel';
// import { tryCatch } from 'bullmq';
// import { paymentQueue } from '../queues/paymentQueue';

export const startPaymentSession = async (req: Request, res: Response) => {
  const {transactionId, productId, expectedAmount, sessionId, memo, vendorWallet} = req.body;
  const vendorId = req.user?._id;

  if (!transactionId || !productId || !expectedAmount || !sessionId || !memo || !vendorWallet) {
    res.status(400).json({ success: false, message: 'Missing required fields' });
    return;
  }
 try {
  await PaymentSession.create({ sessionId, vendorId, productId, expectedAmount, memo, transactionId, vendorWallet });
  // await paymentQueue.add('poll-xion', { sessionId, address, expectedAmount, expiresAt,memo }, {
  //   attempts: 3,
  //   backoff: { type: 'exponential', delay: 10000 }
  // });

  res.status(200).json({ sessionId, message: 'Payment session started' });
  return;
 } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ success: false, message: "Unable to create session", error: errorMessage });
    }
};

export const getPaymentStatus = async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  try{
    const session = await PaymentSession.findOne({ sessionId });
    if (!session) {
      res.status(404).json({ success: false, message: 'Session not found' });
      return;
    }
    if(!session.expiresAt) {
      res.status(400).json({ success: false, message: 'Session has no expiration date' });
      return;
    } 
    if (session.status === "pending" && session.expiresAt < new Date()) {
    session.status = "expired";
    await session.save();
    res.status(200).json({ success: false, message: 'Session has expired' });
    return;
  }
    res.status(200).json({ success: true, session });
    return;
  }catch(error){
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ success: false, message: 'Unable to fetch session', error: errorMessage });
    return;
  }
}

export const updatePaymentSession = async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const { email} = req.body;

  if (!email) {
    res.status(400).json({ success: false, message: 'Email is required' });
    return;
  }
  try {
    const session = await PaymentSession.findOneAndUpdate({ sessionId }, { customerEmail: email }, { new: true });
    if (!session) {
      res.status(404).json({ success: false, message: 'Session not found' });
      return;
    }
    res.status(200).json({ success: true, session });
    return;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ success: false, message: 'Unable to update session', error: errorMessage });
    return;
  }
}

// 

export const completePaymentSession = async (req: Request, res: Response) => {
  const { sessionId,transactionHash, status } = req.body;
  if (!sessionId || !transactionHash || !status) {
    res.status(400).json({ success: false, message: 'Session ID, transaction hash, and status are required' });
    return;
  }
  try {
     const newSession = await PaymentSession.findOneAndUpdate(
    { sessionId },
    { status: status, txHash: transactionHash },
    { new: true }
  );

  if (!newSession) {
    res.status(404).json({ success: false, message: 'Session not found' });
    return;
  }
  const session = await PaymentSession.findOne({ sessionId });
  if (!session) {
    res.status(404).json({ success: false, message: 'Session not found' });
    return;
  }
  const vendor = await Vendor.findById(session.vendorId);
  if (!vendor) {
    res.status(404).json({ success: false, message: 'Vendor not found' });
    return;
  }
  const product = await Product.findById(session.productId);
  if (!product) {
    res.status(404).json({ success: false, message: 'Product not found' });
    return;
  }
  const productName = product.name;

  const vendorEmail = vendor.email;
  if (!vendorEmail) {
    res.status(404).json({ success: false, message: 'Vendor not found' });
    return;
  }
  const vendorBusinessName = vendor.businessName;
  if (!vendorBusinessName) {
    res.status(404).json({ success: false, message: 'Vendor business name not found' });
    return;
  }
   const vendorBusinessLogo = vendor.logo;
  if (!vendorBusinessLogo) {
    res.status(404).json({ success: false, message: 'Vendor business logo not found' });
    return;
  }
  await paymentSuccessEmailVendor(
              vendorEmail,
              session.expectedAmount || '',
              session.txHash || '',
              productName,
              vendorBusinessName || 'XionxePay',
              vendorBusinessLogo || 'https://xionxepay.com/logo.png' // Default logo if not provided
            );
          
          
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
              session.customerEmail || `${process.env.EMAIL_FROM}`,
              session.expectedAmount || '',
              session.txHash || '',
              productName
            );
  res.status(200).json({ success: true, session });
  return;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ success: false, message: 'Unable to complete session', error: errorMessage });
    return;
  }
};

export const getActivePaymentSessions = async (req: Request, res: Response) => {
  const vendorId = req.user?._id; // Assuming req.user is set by isAuthenticated middleware
  try {
    const sessions = await PaymentSession.find({ vendorId, status: 'pending' }).populate('productId', 'name price');
  if (!sessions || sessions.length === 0) {
    res.status(404).json({ success: false, message: 'No active payment sessions found' });
    return;
  }

  res.status(200).json({ success: true, sessions: sessions });
  return;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ success: false, message: 'Unable to fetch active sessions', error: errorMessage });
    return;
    
  }
};
//Payment Session within 24 hours
export const getAllPaymentSessions = async (req: Request, res: Response) => {
  const vendorId = req.user?._id; // Assuming req.user is set by isAuthenticated middleware
  try {
    const sessions = await PaymentSession.find({ vendorId }).populate('productId', 'name price');
    if (!sessions || sessions.length === 0) {
      res.status(404).json({ success: false, message: 'No payment sessions found' });
      return;
    }

    res.status(200).json({ success: true, sessions });
    return;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ success: false, message: 'Unable to fetch payment sessions', error: errorMessage });
    return;
  }
};