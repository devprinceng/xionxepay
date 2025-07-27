import { Request, Response } from 'express';
import { PaymentSession } from '../models/paymentSessionModel';
import { paymentSuccessEmailVendor } from '../utils/mailer'; 
import { Vendor } from '../models/vendorModel';
import { Product } from '../models/productModel';
import { Transaction } from '../models/transactionModel';
import { v4 } from 'uuid';

export const startPaymentSession = async (req: Request, res: Response): Promise<void> => {
  const { productId, expectedAmount, sessionId, memo, vendorWallet } = req.body;
  const vendorId = req.user?._id;

  if (!expectedAmount || !sessionId || !memo || !vendorWallet) {
    res.status(400).json({ success: false, message: 'Missing required fields' });
    return;
  }

  try {
    const transactionId = v4();

    if (productId) {
      const product = await Product.findById(productId);
      if (!product) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
      }

      await Transaction.create({
        transactionId,
        vendorId,
        productId,
        amount:expectedAmount,
        description:memo,
        vendorWallet,
      });

      await PaymentSession.create({
        sessionId,
        vendorId,
        productId,
        expectedAmount,
        memo,
        transactionId,
        vendorWallet,
        
      });
    } else {
      await PaymentSession.create({
        sessionId,
        vendorId,
        isCustom: true,
        expectedAmount,
        memo,
        transactionId,
        vendorWallet,
        
      });
      await Transaction.create({
        transactionId,
        vendorId,
        isCustom: true,
        amount:expectedAmount,
        description:memo,
        vendorWallet,
        
      });
    }


    res.status(200).json({ success: true, sessionId, message: 'Payment session started successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to create session', error: String(error) });
  }
};


export const getPaymentStatus = async (req: Request, res: Response): Promise<void> => {
  const { sessionId } = req.params;

  try {
    const session = await PaymentSession.findOne({ sessionId });

    if (!session) {
      res.status(404).json({ success: false, message: 'Payment session not found' });
      return;
    }

    if (!session.expiresAt) {
      res.status(400).json({ success: false, message: 'Session has no expiration' });
      return;
    }

    if (session.status === 'pending' && session.expiresAt < new Date()) {
      session.status = 'expired';
      await Transaction.findByIdAndUpdate(session.transactionId, { status: 'expired' });
      await session.save();
      res.status(200).json({ success: false, message: 'Payment session has expired' });
      return;
    }

    res.status(200).json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to fetch payment session', error: String(error) });
  }
};

// export const updatePaymentSession = async (req: Request, res: Response): Promise<void> => {
//   const { sessionId } = req.params;
//   const { email } = req.body;

//   if (!email) {
//     res.status(400).json({ success: false, message: 'Email is required' });
//     return;
//   }

//   try {
//     const updated = await PaymentSession.findOneAndUpdate(
//       { sessionId },
//       { customerEmail: email },
//       { new: true }
//     );

//     if (!updated) {
//       res.status(404).json({ success: false, message: 'Session not found' });
//       return;
//     }

//     res.status(200).json({ success: true, session: updated });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Unable to update session', error: String(error) });
//   }
// };

export const completePaymentSession = async (req: Request, res: Response): Promise<void> => {
  const { sessionId, transactionHash, status: newStatus } = req.body;

  if (!sessionId || !transactionHash || !newStatus) {
    res.status(400).json({ success: false, message: 'Missing required fields' });
    return;
  }

  try {
    const paymentSession = await PaymentSession.findOneAndUpdate(
      { sessionId },
      { status: newStatus, txHash: transactionHash },
      { new: true }
    );
    const transaction = await Transaction.findOneAndUpdate(
      { transactionId: paymentSession?.transactionId },
      { status: newStatus, transactionHash },
      { new: true }
    );

    if(!transaction) {
      res.status(404).json({ success: false, message: 'Transaction not found' });
      return;
    }

    if (!paymentSession) {
      res.status(404).json({ success: false, message: 'Payment session not found' });
      return;
    }

    const vendor = await Vendor.findById(paymentSession.vendorId);
    if (!vendor) {
      res.status(404).json({ success: false, message: 'Vendor not found' });
      return;
    }

    const product = paymentSession.productId
      ? await Product.findById(paymentSession.productId)
      : undefined;

    if (product) {
      await paymentSuccessEmailVendor(
        vendor.email,
        paymentSession.expectedAmount || '',
        paymentSession.txHash || '',
        product.name,
        vendor.businessName || 'XionxePay',
        vendor.logo || 'https://xionxepay.com/logo.png'
      );
    } else {
      await paymentSuccessEmailVendor(
        vendor.email,
        paymentSession.expectedAmount || '',
        paymentSession.txHash || '',
        'Custom Payment',
        vendor.businessName || 'XionxePay',
        vendor.logo || 'https://xionxepay.com/logo.png'
      );
    }

    res.status(200).json({ success: true, paymentSession });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to complete session', error: String(error) });
  }
};

export const getActivePaymentSessions = async (req: Request, res: Response): Promise<void> => {
  const vendorId = req.user?._id;

  try {
    const active = await PaymentSession.find({ vendorId, status: 'pending' })
      .populate('productId', 'name price')
      .lean();

    if (!active.length) {
      res.status(404).json({ success: false, message: 'No active sessions' });
      return;
    }

    res.status(200).json({ success: true, activeSessions: active });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to fetch active sessions', error: String(error) });
  }
};

export const getAllPaymentSessions = async (req: Request, res: Response): Promise<void> => {
  const vendorId = req.user?._id;

  try {
    const sessions = await PaymentSession.find({ vendorId }).populate('productId', 'name price');

    if (!sessions.length) {
      res.status(404).json({ success: false, message: 'No payment sessions found' });
      return;
    }

    res.status(200).json({ success: true, sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to fetch sessions', error: String(error) });
  }
};



