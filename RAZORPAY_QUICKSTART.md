# Razorpay Integration - Quick Start Guide

## ✅ What's Been Set Up

1. **Environment Variables** - `.env.local` created with your Razorpay test keys
2. **Comprehensive Spec** - Complete requirements, design, and tasks in `.kiro/specs/razorpay-payment-integration/`
3. **Integration Guide** - Step-by-step implementation guide in `RAZORPAY_INTEGRATION_GUIDE.md`

## 🚀 Your Razorpay Credentials

```
Publisher Key (Key ID): rzp_test_SFO7iX6k8JucVF
Secret Key: Gsuw5b57Xx1onVkDcpBvt4XV
```

**Note**: These are TEST keys. Switch to live keys before production.

## 📋 Implementation Options

### Option 1: Follow the Spec (Recommended)

The spec provides a structured, test-driven approach:

1. Open `.kiro/specs/razorpay-payment-integration/tasks.md`
2. Execute tasks one by one, starting with task 1
3. Each task includes requirements, testing, and checkpoints

**To start**: Ask me to "execute task 1 from razorpay-payment-integration spec"

### Option 2: Manual Implementation

Follow the complete guide in `RAZORPAY_INTEGRATION_GUIDE.md`:

1. Install dependencies
2. Create payment service
3. Create Supabase Edge Functions
4. Create database table
5. Create UI components
6. Deploy and test

## 🎯 What You're Building

**Feature**: One-time "Lifetime Pro" upgrade for ₹99

**User Flow**:
1. Non-pro user clicks "Upgrade to Pro for ₹99" button
2. Razorpay checkout modal opens
3. User completes payment
4. Server verifies payment signature
5. Database updates: `is_pro = true`, `credits = 1000`
6. UI shows Pro badge, unlimited searches enabled

## 🔑 Key Components

### Frontend
- `services/paymentService.ts` - Handles Razorpay integration
- `components/UpgradeButton.tsx` - Upgrade button UI
- `components/Layout.tsx` - Shows Pro badge and upgrade button
- `App.tsx` - Pro user credit bypass logic

### Backend (Supabase Edge Functions)
- `create-razorpay-order` - Creates order server-side
- `verify-razorpay-payment` - Verifies payment signature with HMAC SHA256

### Database
- `payments` table - Logs all transactions for auditing

## 🧪 Testing

Use Razorpay test card:
- Card: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

## 📚 Documentation

- **Requirements**: `.kiro/specs/razorpay-payment-integration/requirements.md`
- **Design**: `.kiro/specs/razorpay-payment-integration/design.md`
- **Tasks**: `.kiro/specs/razorpay-payment-integration/tasks.md`
- **Full Guide**: `RAZORPAY_INTEGRATION_GUIDE.md`
- **Project Context**: `CLAUDE.md`

## 🎬 Next Steps

Choose your path:

**Path A - Structured (Recommended)**:
```
"Execute task 1 from razorpay-payment-integration spec"
```

**Path B - Quick Implementation**:
```
"Implement the Razorpay integration following the guide"
```

**Path C - Review First**:
```
"Show me the requirements and design for Razorpay integration"
```

## 💡 Pro Tips

1. Start with database setup (task 1)
2. Deploy Edge Functions early to test them
3. Use test keys until everything works
4. Test the full flow before going live
5. Keep the secret key server-side only

## 🆘 Need Help?

- Review the spec: `.kiro/specs/razorpay-payment-integration/`
- Check the guide: `RAZORPAY_INTEGRATION_GUIDE.md`
- Ask me: "Help me with [specific issue]"

---

**Ready to start?** Just tell me which path you want to take!
