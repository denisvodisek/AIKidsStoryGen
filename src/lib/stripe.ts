import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
})

// Stripe client-side
export const getStripe = () => {
  if (typeof window !== 'undefined') {
    return require('@stripe/stripe-js').loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    )
  }
  return null
}

// Subscription plans
export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    stories_per_month: 3,
    features: ['3 stories per month', 'Basic templates', 'Standard quality images']
  },
  PRO: {
    name: 'Pro',
    price: 9.99,
    stories_per_month: 50,
    stripe_price_id: 'price_pro_monthly', // Replace with actual Stripe price ID
    features: ['50 stories per month', 'Premium templates', 'High-quality images', 'Priority support']
  },
  UNLIMITED: {
    name: 'Unlimited',
    price: 19.99,
    stories_per_month: -1, // -1 = unlimited
    stripe_price_id: 'price_unlimited_monthly', // Replace with actual Stripe price ID
    features: ['Unlimited stories', 'All templates', 'Highest quality images', 'Priority support', 'Early access to features']
  }
}

export const createCheckoutSession = async (priceId: string, userId: string) => {
  const session = await stripe.checkout.sessions.create({
    customer_email: undefined, // Will be filled by Supabase user data
    billing_address_collection: 'required',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    allow_promotion_codes: true,
    success_url: `${process.env.NEXTAUTH_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
    metadata: {
      userId,
    },
  })

  return session
} 