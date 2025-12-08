/**
 * Paystack Payment Integration
 * 
 * Since react-paystack has React18 requirement and we're on React19,
 * we'll use Paystack Inline JS directly
 */
import PaystackInline from "@paystack/inline-js";



export async function paystackPayment(config) {
  try {
    const popup = new PaystackInline();
    
    popup.resumeTransaction(config.accessCode, {
      onSuccess: async (res) => {
        try {
          console.log("paystack success: ", res);
          if (config.onSuccess) {
            config.onSuccess(res);
          }
        } catch (error) {
          console.error('Resume Paystack payment error:', error);
          if (config.onError) {
            config.onError(error);
          }
        }
      },
      onCancel: async (res) => {
        console.log("paystack cancel: ", res);
        if (config.onClose) {
          config.onClose();
        }
      },
      onError: async (error) => {
        console.error('Resume Paystack payment error:', error);
        if (config.onError) {
          config.onError(error);
        }
      },
    });
  } catch (error) {
    console.error('Resume Paystack payment error:', error);
    throw error;
  }
}