#!/bin/bash

echo "🚀 Deploying Razorpay Payment Verification Function to Supabase"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

echo "📝 Please enter your Supabase project details:"
read -p "Project Ref (from your Supabase URL): " PROJECT_REF

echo ""
echo "🔗 Linking to Supabase project..."
supabase link --project-ref $PROJECT_REF

echo ""
echo "🔐 Setting Razorpay secrets..."
supabase secrets set RAZORPAY_KEY_ID=rzp_test_SFO7iX6k8JucVF
supabase secrets set RAZORPAY_KEY_SECRET=Gsuw5b57Xx1onVkDcpBvt4XV

echo ""
echo "📦 Deploying function..."
supabase functions deploy verify-razorpay-payment

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🎉 Your payment verification function is now live!"
echo "Users can now verify payments automatically by entering their Payment ID."
