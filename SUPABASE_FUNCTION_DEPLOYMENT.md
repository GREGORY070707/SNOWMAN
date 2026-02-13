# Supabase Edge Function Deployment Guide

## Payment Verification Function

This guide will help you deploy the `verify-razorpay-payment` Edge Function to Supabase.

## Prerequisites

1. Supabase CLI installed
2. Supabase project created
3. Razorpay API credentials

## Step 1: Install Supabase CLI

```bash
npm install -g supabase
```

## Step 2: Login to Supabase

```bash
supabase login
```

## Step 3: Link Your Project

```bash
supabase link --project-ref your-project-ref
```

Your project ref can be found in your Supabase project URL:
`https://supabase.com/dashboard/project/YOUR-PROJECT-REF`

## Step 4: Set Environment Secrets

Set your Razorpay credentials as secrets:

```bash
supabase secrets set RAZORPAY_KEY_ID=rzp_test_SFO7iX6k8JucVF
supabase secrets set RAZORPAY_KEY_SECRET=Gsuw5b57Xx1onVkDcpBvt4XV
```

## Step 5: Deploy the Function

```bash
supabase functions deploy verify-razorpay-payment
```

## Step 6: Test the Function

After deployment, test it with:

```bash
curl -i --location --request POST 'https://YOUR-PROJECT-REF.supabase.co/functions/v1/verify-razorpay-payment' \
  --header 'Authorization: Bearer YOUR-ANON-KEY' \
  --header 'Content-Type: application/json' \
  --data '{"paymentId":"pay_test_xxxxx"}'
```

## Alternative: Deploy via Supabase Dashboard

If you prefer using the dashboard:

1. Go to your Supabase Dashboard
2. Navigate to **Edge Functions** in the left sidebar
3. Click **"New Function"**
4. Name it: `verify-razorpay-payment`
5. Copy the code from `supabase/functions/verify-razorpay-payment/index.ts`
6. Paste it into the editor
7. Click **"Deploy"**
8. Go to **Settings** → **Edge Functions** → **Secrets**
9. Add the secrets:
   - `RAZORPAY_KEY_ID`: `rzp_test_SFO7iX6k8JucVF`
   - `RAZORPAY_KEY_SECRET`: `Gsuw5b57Xx1onVkDcpBvt4XV`

## How It Works

1. User completes payment on Razorpay
2. User copies the Payment ID from the success page
3. User enters Payment ID in the "Verify Payment" section
4. Function calls Razorpay API to verify the payment
5. If valid, updates user's `is_pro` status to `true` and credits to `1000`
6. User gets Pro access immediately

## Payment ID Format

Payment IDs from Razorpay look like: `pay_xxxxxxxxxxxxx`

Users can find this on the payment success page or in their Razorpay payment confirmation email.

## Troubleshooting

### Function not found
- Make sure the function is deployed: `supabase functions list`
- Check the function name matches exactly: `verify-razorpay-payment`

### Authentication errors
- Ensure user is logged in before calling the function
- Check that the Authorization header is being passed correctly

### Payment verification fails
- Verify Razorpay credentials are correct
- Check that the payment ID is valid and from your Razorpay account
- Ensure payment status is "captured" (completed)

### Database update fails
- Check RLS policies on the `profiles` table
- Ensure the function has permission to update user profiles

## Security Notes

- The function verifies payment amount (₹99 = 9900 paise)
- Only captured/completed payments are accepted
- Users can only update their own profile (authenticated via JWT)
- Razorpay credentials are stored as secrets, not in code
