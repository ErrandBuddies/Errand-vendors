This is the vendor frontend app of the errandbuddies application
API base endpoint: https://errandbuddies.net/api
vendor url: https://vendor.errandbuddies.net

app theme: primary color = rgb(13,48,72)
accent color = rgb(230,114,42)
background color = rgb(243,244,246)

**_ AUTHENTICATION _**

**_ SIGNUP _**:
layout: {
app_logo: top right,
title: center,
form: center,
checkbox: center (policy and privacy agreement)
signup_button: center,
login_button: center (Already have an account? sign_in),
}
features: {
form: {
endpoint: localhost:/vendor/signup,
method: post,
payload: {
"firstname": "Abdulazeez",
"lastname": "Olamilekan",
"email": " AdebayoaZeeZ37@gmail.com ",
"phone_num": "08081602424",
"country_code": "+234",
"password": "Password.123",
"confirm_password": "Password.123"
},
on success: redirect to OTP page,
on error: show error message,
success_response: {
"success": true,
"message": "Account created successfully, verify your email"
}
}
extras: [
password visibility toggle,
password strength indicator with checkmarks,
password match indicator with checkmarks,
]
}

**_ OTP _**:
layout: {
app_logo: top right,
title: center (A verification code has been sent to *adebayoazeez37@gmail.com*),
form: center,
otp_button: center,
resendcode_button: center,
back_to_signup: center,
}
features: {
form: {
endpoint: vendor/verify-email,
method: post,
payload: {
"email": "adebayoazeez37@gmail.com",
"otp": "123456"
},
on success: redirect to dashboard,
on error: show error message,
success_response: {
body: {
"success": true,
"message": "logged in successfully",
"data": {
"firstname": "Adebayo",
"lastname": "Olamilekan",
"email": "adebayoazeez37@gmail.com",
"phone_num": "08081384232",
"phone_verified": false,
"wallet": 0,
"address": "8, victory road, lekki, lagos",
"accredited": false,
"is_user": false,
"temp_wallet": 0,
"country_code": "+234",
"followers": [],
"followings": []
}
}
header: {token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkZWJheW9h.....}
}
}
resend_otp: {
endpoint: /vendor/resend-otp
method: post,
payload: {
"type": "email",
"email": "adebayoazeez37+1@gmail.com"
}
on success: stay on OTP page,
on error: show error message,
success_response: {
body: {
"success": true,
"message": "OTP sent successfully"
}
}
},
extra: [1 min OTP count down on resend otp button]
}

**_ LOGIN _**:
layout:{
app_logo: top right,
title: center,
form: center,
login_button: center,
register_button: center,
forget_password_button: center,
}
features: {
form: {
endpoint: vendor/login,
method: post,
payload: {
"email": "adebayoazeez37@gmail.com",
"password": "Password.123"
},
on success: redirect to dashboard,
on error: show error message,
success_response: {
body: {
"success": true,
"message": "logged in successfully",
"data": {
"firstname": "Adebayo",
"lastname": "Olamilekan",
"email": "adebayoazeez37@gmail.com",
"phone_num": "08081384232",
"phone_verified": false,
"wallet": 0,
"address": "8, victory road, lekki, lagos",
"accredited": false,
"is_user": false,
"temp_wallet": 0,
"country_code": "+234",
"followers": [],
"followings": []
}
}
header: {token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkZWJheW9h.....}
}
},
}

**_ FORGET PASSWORD _**:
layout: {
app_logo: top right,
title: center,
form: center,
login_button: center,
register_button: center,
forget_password_button: center,
}
features: {
forget_password: {
form: {
endpoint: /initiate-reset-password,
method: post,
payload: {
"type": "email"
"email": "adebayoazeez37+1@gmail.com"
},
on success: redirect to reset password,
on error: show error message,
success_response: {
body: {
"success": true,
"message": "Reset password OTP sent to registered email"
}
}
}
},
},

**_ RESET PASSWORD _**:
layout: {
app_logo: top right,
title: center,
form: center,
login_button: center,
register_button: center,
forget_password_button: center,
}
features: {
reset_password: {
form: {
endpoint: /complete-reset-password,
method: post,
payload: {
"type": "email"
"email": "adebayoazeez37+1@gmail.com"
"otp": "123456"
"password": "Password.123"
"confirm_password": "Password.123"
},
on success: redirect to login,
on error: show error message,
success_response: {
body: {
"success": true,
"message": "Password reset successfully"
}
}
endpoint: /vendor/verify-otp,
method: post,
payload: {
"type": "email"
"email": "adebayoazeez37+1@gmail.com"
"otp": "123456"
},
on success: show password and confirm password,
on error: show error message,
success_response: {
body: {
"success": true,
"message": "OTP verified successfully"
}
},
flow: [
1. user clicks on forget password button
2. user is redirected to forget password page
3. user enters email and clicks on forget password button
4. user is redirected to reset password page
5. user enters otp
6. otp is submitted to the verify otp endpoint
7. if otp is valid, password and confirm password becomes visible to reset password
8. user enters new password and confirm password and clicks on reset password button
9. user is redirected to login page
]
}
}
}

**_ LOGOUT _**:
features: {
logout: {
endpoint: /vendor/logout,
method: post,
payload: {},
on success: remove user token and details from localStorage, redirect to login,
on error: show error message,
success_response: {
body: {
"success": true,
"message": "Logged out successfully"
}
}
}
}

**_ MAIN APP _**:
pages: { 1. Dashboard 2. Products 3. Orders 4. Services 5. Profile 6. Messages 7. Settings 8. Transactions
}

layout: {
header: { 1. the title of the current page 2. the user profile picture || initials 3. new order notification bell icon
}
main: {
the main content of the page  
 }
footer: {
a nav containing icons and text [Dashboard, Products, Orders, Services, Messages]
}
}

**_ DASHBOARD _**:
layout: {
no strict layout, just do something to visualize this data
endpoint: /transactions/vendor-products?productId=&startDate=&endDate=&seriviceId=
method: get,
query: {
productId: "692c8c2f4d613469f53adcf8",
startDate: "2025-12-01",
endDate: "2025-12-01",
seriviceId: "692c8c2f4d613469f53adcf8"
},
success_response: {
body: {
{
success: true,
message: "Sales data retrieved successfully",
data: {
sales: {
data: [
{
\_id: "692d8d9e0dcb24db990a6032",
productName: "fresh onions",
quantity: 1,
price: 3000,
amount: 3000,
status: "pending",
createdAt: "2025-12-01T12:44:14.843Z",
updatedAt: "2025-12-01T12:44:14.843Z",
product: {
\_id: "692c8c2f4d613469f53adcf8",
name: "fresh onions",
category: "Fruits & Vegetables",
images: [
"https://res.cloudinary.com/dlxu4ej5u/image/upload/v1764527148/product-images/rmqq6nr9germ0zocsnai.jpg",
"https://res.cloudinary.com/dlxu4ej5u/image/upload/v1764527150/product-images/gxf4e30bifzfin4iwuzy.jpg",
"https://res.cloudinary.com/dlxu4ej5u/image/upload/v1764527149/product-images/wazqwwnwna0ag0c2ngmg.jpg",
],
},
order: {
\_id: "692d8d920dcb24db990a5ff7",
shippingAddress: {
address: "ojo market",
city: "Iyana Iba, Iyana Iba",
state: "Lagos",
country: "Nigeria",
phone1: "+2348081602424",
latitude: 6.4608915,
longitude: 3.2053111999999997,
},
orderDate: "2025-12-01T12:44:02.814Z",
},
customer: {
\_id: "6922201e79ff779764720714",
firstname: "Adebayo",
lastname: "Azeez",
},
},
{
\_id: "692d8d9e0dcb24db990a6033",
productName: "fresh pepper",
quantity: 1,
price: 2000,
amount: 2000,
status: "confirmed",
createdAt: "2025-12-01T12:44:14.843Z",
updatedAt: "2025-12-01T12:44:14.843Z",
product: {
\_id: "692765ffa7549170cdd23ab4",
name: "fresh pepper",
category: "Fruits & Vegetables",
images: [
"https://res.cloudinary.com/dlxu4ej5u/image/upload/v1764189694/product-images/jbfgrhng9hh9hkup1cwl.jpg",
"https://res.cloudinary.com/dlxu4ej5u/image/upload/v1764189693/product-images/pkohxw7yeqxvy7dvhhcv.jpg",
"https://res.cloudinary.com/dlxu4ej5u/image/upload/v1764189694/product-images/dwik1gkunoecworootc2.jpg",
],
},
order: {
\_id: "692d8d920dcb24db990a5ff7",
shippingAddress: {
address: "ojo market",
city: "Iyana Iba, Iyana Iba",
state: "Lagos",
country: "Nigeria",
phone1: "+2348081602424",
latitude: 6.4608915,
longitude: 3.2053111999999997,
},
orderDate: "2025-12-01T12:44:02.814Z",
},
customer: {
\_id: "6922201e79ff779764720714",
firstname: "Adebayo",
lastname: "Azeez",
},
},
],
totalSales: 2,
salesRevenue: 5000,
},
transactions: {
data: [
{
_id: "692ca596c04339bb8306f1af",
serviceId: "692c8eecd080aecdf618ef54",
serviceType: "Order",
currency: "NGN",
amount: 3000,
status: "completed",
transactionType: "payment",
paymentMethod: "wallet",
walletDetails: {
reference: "142wmim5s1qb",
amountUsed: 3000,
previousBalance: 10000,
newBalance: 13000,
},
description: "Payment remitted for order 692c8eecd080aecdf618ef54",
createdAt: "2025-11-30T20:14:14.737Z",
updatedAt: "2025-11-30T20:14:14.737Z",
type: "Credit",
},
{
_id: "692b3e4cc11ce9b141eb14cd",
serviceId: "692b00c647410a78b165858d",
serviceType: "Order",
currency: "NGN",
amount: 10000,
status: "completed",
transactionType: "payment",
paymentMethod: "wallet",
walletDetails: {
reference: "1imbmikn0moe",
amountUsed: 10000,
previousBalance: 0,
newBalance: 10000,
},
description: "Payment remitted for order 692b00c647410a78b165858d",
createdAt: "2025-11-29T18:41:16.271Z",
updatedAt: "2025-11-29T18:41:16.271Z",
type: "Credit",
},
{
_id: "69276992a7549170cdd23b63",
serviceId: "69276992a7549170cdd23b62",
serviceType: "Sponsor",
currency: "NGN",
amount: 16000,
status: "completed",
transactionType: "purchase",
paymentMethod: "online",
onlineDetails: {
amountPaid: 16000,
reference: "b8v60s4zwg",
accessCode: "w9vupl17kf3h9bh",
},
description: "Sponsorship purchased on product fresh pepper",
createdAt: "2025-11-26T20:56:50.025Z",
updatedAt: "2025-11-26T20:59:54.444Z",
type: "Debit",
},
],
totalPayments: 3,
transactionRevenue: -3000,
},
},
};
