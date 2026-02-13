# Implementation Plan: Razorpay Payment Integration

## Overview

This implementation plan breaks down the Razorpay payment integration into discrete, incremental steps. Each task builds on previous work, starting with database setup, then backend Edge Functions, frontend components, and finally integration and testing. The approach ensures that core functionality is validated early through code and tests.

## Tasks

- [ ] 1. Set up database schema and environment configuration
  - Create payments table in Supabase with proper constraints
  - Add Razorpay environment variables to .env.local
  - Configure Supabase Edge Function secrets for Razorpay keys
  - Update types.ts with new payment-related interfaces
  - _Requirements: 7.1, 7.2, 7.5, 9.1_

- [ ] 2. Implement Create Order Edge Function
  - [ ] 2.1 Create supabase/functions/create-razorpay-order/index.ts
    - Set up Deno function with Razorpay SDK
    - Extract user_id from JWT token
    - Verify user is not already Pro (check profiles table)
    - Create Razorpay order with amount 9900 paise
    - Include metadata: user_id and upgrade_type
    - Return order_id, amount, currency
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  
  - [ ] 2.2 Write property test for order creation
    - **Property 1: Order creation completeness**
    - **Validates: Requirements 1.2, 1.3, 1.4**
    - Test that all orders contain required fields with correct values
  
  - [ ] 2.3 Write unit tests for order creation error cases
    - Test 401 error for unauthenticated requests
    - Test 400 error for already-pro users
    - Test 500 error for Razorpay API failures
    - _Requirements: 1.5_

- [ ] 3. Implement Verify Payment Edge Function
  - [ ] 3.1 Create supabase/functions/verify-razorpay-payment/index.ts
    - Extract user_id from JWT token
    - Check if payment_id already exists in payments table (idempotency)
    - Compute HMAC SHA256 signature: hash(order_id + "|" + payment_id, secret)
    - Compare computed signature with received signature
    - _Requirements: 3.1, 3.2, 3.3, 10.1, 10.2_
  
  - [ ] 3.2 Implement database transaction for payment processing
    - BEGIN transaction
    - INSERT payment record with all required fields
    - UPDATE profiles SET is_pro = true, credits = 1000
    - COMMIT transaction on success, ROLLBACK on failure
    - Return updated user profile
    - _Requirements: 4.1, 4.2, 4.3, 9.1, 10.4, 10.5_
  
  - [ ] 3.3 Write property test for signature verification
    - **Property 3: Signature verification correctness**
    - **Validates: Requirements 3.2, 3.4, 3.5**
    - Generate random order/payment IDs and verify signature logic
  
  - [ ] 3.4 Write property test for idempotent payment processing
    - **Property 14: Idempotent payment processing**
    - **Validates: Requirements 10.1, 10.2, 10.3**
    - Test that duplicate payment_id returns same result without side effects
  
  - [ ] 3.5 Write property test for database transaction atomicity
    - **Property 5: Database transaction atomicity**
    - **Validates: Requirements 10.4, 10.5**
    - Test that failures rollback all changes
  
  - [ ] 3.6 Write unit tests for verification error cases
    - Test invalid signature rejection
    - Test database error handling
    - Test error logging for failed payments
    - _Requirements: 3.5, 4.4, 8.3, 9.4_

- [ ] 4. Checkpoint - Test Edge Functions
  - Deploy Edge Functions to Supabase
  - Test order creation with curl/Postman
  - Test payment verification with valid/invalid signatures
  - Verify database records are created correctly
  - Ensure all tests pass, ask the user if questions arise

- [ ] 5. Implement frontend payment service
  - [ ] 5.1 Create services/paymentService.ts
    - Implement createOrder() method calling Edge Function
    - Implement verifyPayment() method calling Edge Function
    - Implement openRazorpayCheckout() with Razorpay SDK
    - Configure Razorpay checkout options (amount, description, callbacks)
    - Handle success/failure callbacks
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1_
  
  - [ ] 5.2 Write unit tests for payment service
    - Test createOrder API call
    - Test verifyPayment API call
    - Test Razorpay checkout configuration
    - Test success/failure callback handling
    - _Requirements: 2.3, 2.4, 2.5_

- [ ] 6. Implement UpgradeButton component
  - [ ] 6.1 Create components/UpgradeButton.tsx
    - Render button only for non-pro users (is_pro === false)
    - Handle button click to initiate payment flow
    - Show loading state during payment processing
    - Display success message and refresh profile on success
    - Display error messages for different failure scenarios
    - _Requirements: 1.1, 5.2, 8.1, 8.2, 8.4_
  
  - [ ] 6.2 Write property test for UI state consistency
    - **Property 6: UI state consistency with Pro status**
    - **Validates: Requirements 5.1, 5.2, 5.3**
    - Test that PRO badge and upgrade button display correctly based on is_pro
  
  - [ ] 6.3 Write unit tests for UpgradeButton
    - Test button renders for non-pro users
    - Test button hidden for pro users
    - Test loading state during payment
    - Test error message display
    - _Requirements: 5.2, 8.1, 8.2, 8.4_

- [ ] 7. Update Layout component for Pro status display
  - [ ] 7.1 Modify components/Layout.tsx
    - Add UpgradeButton component to sidebar for non-pro users
    - Ensure PRO badge displays for pro users (already implemented)
    - Position upgrade button prominently in sidebar
    - _Requirements: 5.1, 5.2, 5.3_
  
  - [ ] 7.2 Write unit tests for Layout Pro status display
    - Test PRO badge appears for is_pro = true
    - Test upgrade button appears for is_pro = false
    - Test both elements don't appear simultaneously
    - _Requirements: 5.1, 5.2, 5.3_

- [ ] 8. Update App.tsx for Pro user credit bypass
  - [ ] 8.1 Modify handleSearch function in App.tsx
    - Check is_pro field before credit validation
    - Allow search for pro users regardless of credits
    - Skip credit deduction for pro users after search
    - Maintain existing credit validation for non-pro users
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [ ] 8.2 Write property test for Pro user credit bypass
    - **Property 7: Pro user credit bypass**
    - **Validates: Requirements 6.2, 6.4**
    - Test pro users can search with any credit count and credits don't change
  
  - [ ] 8.3 Write property test for non-pro credit validation
    - **Property 8: Non-pro user credit validation**
    - **Validates: Requirements 6.3**
    - Test non-pro users with 0 credits are blocked
  
  - [ ] 8.4 Write property test for non-pro credit deduction
    - **Property 9: Non-pro user credit deduction**
    - **Validates: Requirements 6.5**
    - Test non-pro users lose exactly 1 credit per search

- [ ] 9. Checkpoint - Test frontend integration
  - Test upgrade button appears for non-pro users
  - Test payment flow end-to-end in development
  - Test Pro badge appears after successful payment
  - Test pro users can search with 0 credits
  - Ensure all tests pass, ask the user if questions arise

- [ ] 10. Implement error handling and logging
  - [ ] 10.1 Add error handling to payment service
    - Catch and log all errors to console
    - Map error types to user-friendly messages
    - Implement retry logic for network errors
    - _Requirements: 8.1, 8.2, 8.4, 8.5_
  
  - [ ] 10.2 Add error handling to Edge Functions
    - Return appropriate HTTP status codes
    - Log errors for debugging and reconciliation
    - Include descriptive error messages in responses
    - _Requirements: 1.5, 3.5, 4.4, 8.3_
  
  - [ ] 10.3 Write property test for error logging
    - **Property 15: Error logging consistency**
    - **Validates: Requirements 8.5**
    - Test that all errors are logged to console
  
  - [ ] 10.4 Write unit tests for error messages
    - Test specific error messages for each failure type
    - Test error logging includes necessary details
    - _Requirements: 8.1, 8.2, 8.4_

- [ ] 11. Implement payment logging and security
  - [ ] 11.1 Add payment logging to verify-payment function
    - Insert payment record for all verification attempts
    - Include failure_reason for failed payments
    - Ensure payment_id uniqueness constraint
    - _Requirements: 9.1, 9.2, 9.3, 9.4_
  
  - [ ] 11.2 Verify secret key isolation
    - Audit all API responses to ensure no secrets exposed
    - Verify frontend only uses public key_id
    - Test that secret key is never sent to frontend
    - _Requirements: 7.2, 7.3_
  
  - [ ] 11.3 Write property test for payment logging completeness
    - **Property 11: Payment logging completeness**
    - **Validates: Requirements 9.1, 9.2, 9.3**
    - Test all payments create records with required fields
  
  - [ ] 11.4 Write property test for failed payment logging
    - **Property 12: Failed payment logging**
    - **Validates: Requirements 9.4**
    - Test failed payments include failure_reason
  
  - [ ] 11.5 Write property test for secret key isolation
    - **Property 10: Secret key isolation**
    - **Validates: Requirements 7.3**
    - Test API responses never contain secret keys

- [ ] 12. Integration testing and final wiring
  - [ ] 12.1 Test complete payment flow end-to-end
    - Non-pro user clicks upgrade button
    - Order created successfully
    - Razorpay checkout opens
    - Payment completed (test mode)
    - Verification succeeds
    - Profile updated (is_pro = true, credits = 1000)
    - UI updates (PRO badge, no upgrade button)
    - _Requirements: All_
  
  - [ ] 12.2 Test edge cases and error scenarios
    - Test payment cancellation
    - Test network failures
    - Test duplicate payment_id
    - Test already-pro user attempting upgrade
    - Test invalid signature rejection
    - _Requirements: 2.5, 3.5, 8.1, 8.2, 10.2_
  
  - [ ] 12.3 Write integration tests
    - Test full payment flow with mocked Razorpay
    - Test UI updates after successful payment
    - Test error handling across components
    - _Requirements: All_

- [ ] 13. Final checkpoint and deployment preparation
  - Run all unit tests and property tests
  - Verify test coverage meets requirements
  - Test with Razorpay test keys in development
  - Document deployment steps for production
  - Ensure all tests pass, ask the user if questions arise

## Notes

- All tasks including tests are required for comprehensive implementation
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties (minimum 100 iterations each)
- Unit tests validate specific examples and edge cases
- Edge Functions must be deployed to Supabase before frontend integration testing
- Use Razorpay test keys during development, switch to live keys only for production
- Payment logging is critical for reconciliation and debugging
