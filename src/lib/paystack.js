/**
 * Paystack Payment Integration
 * 
 * Since react-paystack has React18 requirement and we're on React19,
 * we'll use Paystack Inline JS directly
 */

/**
 * Load Paystack Inline script
 * @returns {Promise} Resolves when script is loaded
 */
export function loadPaystackScript() {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) {
      resolve(window.PaystackPop);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.onload = () => resolve(window.PaystackPop);
    script.onerror = () => reject(new Error('Failed to load Paystack script'));
    document.body.appendChild(script);
  });
}

/**
 * Initialize Paystack payment
 * @param {Object} config - Payment configuration
 * @param {string} config.email - Customer email
 * @param {number} config.amount - Amount in kobo (smallest currency unit)
 * @param {string} config.reference - Unique transaction reference
 * @param {string} config.accessCode - Paystack access code
 * @param {Function} config.onSuccess - Success callback
 * @param {Function} config.onClose - Close callback
 */
export async function initializePaystackPayment(config) {
  try {
    const PaystackPop = await loadPaystackScript();
    
    const handler = PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email: config.email,
      amount: config.amount, // Amount in kobo
      ref: config.reference,
      access_code: config.accessCode,
      onClose: function() {
        if (config.onClose) {
          config.onClose();
        }
      },
      callback: function(response) {
        if (config.onSuccess) {
          config.onSuccess(response);
        }
      },
    });

    handler.openIframe();
  } catch (error) {
    console.error('Paystack initialization error:', error);
    throw error;
  }
}
