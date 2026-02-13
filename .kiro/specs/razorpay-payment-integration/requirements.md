# Requirements Document: Razorpay Payment Integration

## Introduction

This document specifies the requirements for integrating Razorpay payment gateway into the Problem Signal Finder application. The integration enables users to purchase a one-time "Lifetime Pro" upgrade for ₹99, which grants them Pro status and 1000 credits. The system must securely handle payment processing, verify transactions server-side, and update user profiles upon successful payment.

## Glossary

- **Payment_Gateway**: Razorpay's payment processing service that handles transaction processing
- **Edge_Function**: Supabase serverless function that executes server-side logic
- **Order**: A Razorpay order entity created before initiating checkout
- **Payment_Signature**: HMAC SHA256 hash used to verify payment authenticity
- **Pro_User**: A user with is_pro field set to true in the profiles table
- **Checkout_Modal**: Razorpay's hosted payment interface displayed to users
- **Profile_Table**: Supabase database table storing user data (id, credits, is_pro fields)
- **Frontend**: React TypeScript application running in the browser
- **Backend**: Supabase Edge Functions executing server-side operations

## Requirements

### Requirement 1: Payment Order Creation

**User Story:** As a non-pro user, I want to initiate a payment for the Lifetime Pro upgrade, so that I can access Pro features and receive credits.

#### Acceptance Criteria

1. WHEN a non-pro user clicks the "Upgrade to Pro" button, THE Frontend SHALL call the order creation Edge_Function
2. WHEN the order creation Edge_Function receives a request, THE Backend SHALL create a Razorpay Order with amount ₹99 (9900 paise)
3. WHEN creating the order, THE Backend SHALL include user_id and upgrade_type metadata in the order
4. WHEN the order is successfully created, THE Backend SHALL return the order_id, amount, and currency to the Frontend
5. IF order creation fails, THEN THE Backend SHALL return a descriptive error message

### Requirement 2: Razorpay Checkout Integration

**User Story:** As a user initiating payment, I want to see a secure payment interface, so that I can complete my purchase safely.

#### Acceptance Criteria

1. WHEN the Frontend receives a valid order_id, THE Frontend SHALL load the Razorpay checkout script
2. WHEN the checkout script is loaded, THE Frontend SHALL open the Checkout_Modal with order details
3. WHEN displaying the modal, THE Frontend SHALL show the amount (₹99), description ("Lifetime Pro Upgrade"), and merchant details
4. WHEN the user completes payment, THE Checkout_Modal SHALL return payment_id, order_id, and signature to the Frontend
5. IF the user cancels payment, THEN THE Frontend SHALL close the modal and display a cancellation message

### Requirement 3: Payment Verification

**User Story:** As the system, I want to verify payment authenticity server-side, so that only legitimate payments update user accounts.

#### Acceptance Criteria

1. WHEN the Frontend receives payment success data, THE Frontend SHALL send payment_id, order_id, and signature to the verification Edge_Function
2. WHEN the verification Edge_Function receives payment data, THE Backend SHALL compute HMAC SHA256 hash using order_id, payment_id, and Razorpay secret key
3. WHEN computing the signature, THE Backend SHALL compare the computed hash with the received signature
4. IF signatures match, THEN THE Backend SHALL mark the payment as verified
5. IF signatures do not match, THEN THE Backend SHALL reject the payment and return an error

### Requirement 4: User Profile Update

**User Story:** As a user who completed payment, I want my account upgraded immediately, so that I can start using Pro features.

#### Acceptance Criteria

1. WHEN payment verification succeeds, THE Backend SHALL update the Profile_Table setting is_pro to true
2. WHEN updating the profile, THE Backend SHALL set credits to 1000
3. WHEN the database update completes, THE Backend SHALL return success status to the Frontend
4. IF the database update fails, THEN THE Backend SHALL log the error and return failure status
5. WHEN the Frontend receives success status, THE Frontend SHALL refresh the user profile data

### Requirement 5: UI State Management

**User Story:** As a Pro user, I want to see my Pro status reflected in the UI, so that I know my upgrade was successful.

#### Acceptance Criteria

1. WHEN a user has is_pro set to true, THE Frontend SHALL display a "PRO" badge next to their name in the sidebar
2. WHEN a non-pro user views the sidebar, THE Frontend SHALL display an "Upgrade to Pro for ₹99" button
3. WHEN a Pro_User views the sidebar, THE Frontend SHALL NOT display the upgrade button
4. WHEN the user profile updates after payment, THE Frontend SHALL immediately reflect the new credits count
5. WHEN the user profile updates after payment, THE Frontend SHALL immediately display the PRO badge

### Requirement 6: Credit Validation for Pro Users

**User Story:** As a Pro user, I want to bypass credit checks for research, so that I can perform unlimited searches.

#### Acceptance Criteria

1. WHEN a Pro_User initiates a search, THE Frontend SHALL check the is_pro field before validating credits
2. IF is_pro is true, THEN THE Frontend SHALL allow the search regardless of credit count
3. IF is_pro is false AND credits are zero, THEN THE Frontend SHALL prevent the search and display an upgrade prompt
4. WHEN a Pro_User completes a search, THE Frontend SHALL NOT deduct credits from their account
5. WHEN a non-pro user completes a search, THE Frontend SHALL deduct 1 credit as currently implemented

### Requirement 7: Secure API Key Management

**User Story:** As a system administrator, I want API keys stored securely, so that payment credentials are not exposed.

#### Acceptance Criteria

1. THE Backend SHALL store Razorpay API key and secret in Supabase Edge Function secrets
2. THE Frontend SHALL only access the Razorpay key_id (public key) via environment variables
3. THE Backend SHALL NEVER expose the Razorpay secret key to the Frontend
4. WHEN Edge_Functions execute, THE Backend SHALL retrieve secrets from Supabase vault
5. THE Frontend SHALL use VITE_ prefixed environment variables for all client-side configuration

### Requirement 8: Error Handling and User Feedback

**User Story:** As a user experiencing payment issues, I want clear error messages, so that I understand what went wrong.

#### Acceptance Criteria

1. WHEN order creation fails, THE Frontend SHALL display "Unable to initiate payment. Please try again."
2. WHEN payment verification fails, THE Frontend SHALL display "Payment verification failed. Please contact support."
3. WHEN database update fails after successful payment, THE Backend SHALL log the transaction details for manual reconciliation
4. WHEN network errors occur, THE Frontend SHALL display "Connection error. Please check your internet and retry."
5. WHEN any error occurs, THE Frontend SHALL log error details to the console for debugging

### Requirement 9: Payment Transaction Logging

**User Story:** As a system administrator, I want payment transactions logged, so that I can track revenue and troubleshoot issues.

#### Acceptance Criteria

1. WHEN payment verification succeeds, THE Backend SHALL insert a record into a payments table
2. WHEN logging a payment, THE Backend SHALL store user_id, order_id, payment_id, amount, and timestamp
3. WHEN logging a payment, THE Backend SHALL store the payment status (success, failed, pending)
4. WHEN a payment fails verification, THE Backend SHALL log the failure reason
5. THE Backend SHALL ensure payment logs are immutable after creation

### Requirement 10: Idempotent Payment Processing

**User Story:** As the system, I want to handle duplicate payment notifications safely, so that users are not charged multiple times or receive duplicate credits.

#### Acceptance Criteria

1. WHEN the verification Edge_Function receives a payment_id, THE Backend SHALL check if it has already been processed
2. IF the payment_id exists in the payments table, THEN THE Backend SHALL return the existing result without reprocessing
3. IF the payment_id is new, THEN THE Backend SHALL process the payment and update the database
4. WHEN processing a payment, THE Backend SHALL use database transactions to ensure atomicity
5. IF a database transaction fails, THEN THE Backend SHALL rollback all changes and return an error
