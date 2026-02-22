**_ WALLET WITHDRAWAL _**

flow: [
1. open section to get wallet balance
2. if withdrawable is greater than 100, withdrawal button is possible
3. withdrawal button opens a form to choose bank, account number, and amount
4. when user enters account number and bank is selected, the form should validate if the account number is valid
5. if valid, the form should show the amount to be withdrawn
6. if invalid, the form should show an error message
7. if successful, show a success message and redirect to wallet balance section
]

GET WALLET BALANCE

GET -> /api/payment/wallet
sample response:
{
"success": true,
"message": "Wallet balance retrieved successfully",
"data": {
"\_id": "6934a8fabb031829f281a27b",
"userId": "6931bdfe322dd837303ecf33",
"balance": 50000,
"withdrawable": 499950,
"currency": "NGN",
"createdAt": "2025-12-06T22:06:50.576Z",
"updatedAt": "2026-02-09T20:51:23.919Z",
"\_\_v": 0
}
}

GET LIST OF BANKS

GET -> /api/payment/banks
sample response:
{
"success": true,
"message": "Banks retrieved successfully",
"data": [
{
"name": "78 Finance Company Ltd",
"slug": "78-finance-company-ltd-ng",
"code": "40195",
"country": "Nigeria",
"currency": "NGN"
},
{
"name": "9jaPay Microfinance Bank",
"slug": "9japay-microfinance-bank-ng",
"code": "090629",
"country": "Nigeria",
"currency": "NGN"
},
{
"name": "9mobile 9Payment Service Bank",
"slug": "9mobile-9payment-service-bank-ng",
"code": "120001",
"country": "Nigeria",
"currency": "NGN"
},
]
}

INITIATE WITHDRAWAL

POST -> /api/payment/initiate-withdraw
sample request body:
{
"bank_code": "40195",
"account_number": "1234567890",
}
sample response:

{
"success": true,
"message": "Payment initiated successfully",
"data": {
"currency": "NGN",
"name": "Customer",
"recipient_code": "RCP_dj1imuy3ii0wp29",
"account_number": "2208972385",
"account_name": "ABDULAZEEZ OLAMILEKAN ADEBAYO",
"bank_name": "Zenith Bank"
}
}

COMPLETED WITHDRAWAL

POST -> /api/payment/complete-withdraw
sample request body:
{
"recipient_code": "RCP_dj1imuy3ii0wp29",
"amount": "4000"
}
sample response:

{
"success": true,
"message": "Fund withdrawal completed successfully"
}
