*** ORDERS ***

{
    get orders: {
        endpoint: orders/vendor,
        method: get,
        success_response: {
            body: {
                "success": true,
                "message": "Orders retrieved successfully",
                "data": [
                    {
                        "shippingAddress": {
                            "address": "kings street",
                            "city": "Agege, Dopemu",
                            "state": "Lagos",
                            "country": "Nigeria",
                            "phone1": "+2348081602424",
                            "latitude": 6.6194448,
                            "longitude": 3.3179295000000004
                        },
                        "_id": "693346f1f85a5abdbd232995",
                        "userID": "6931f363db849908ac2c1a08",
                        "products": [
                            {
                                "variant": {
                                    "color": "black",
                                    "size": "Rom: 128gb - Ram: 4gb"
                                },
                                "productID": "6933460f5f24d9a07cc1e166",
                                "vendorID": "6931bdfe322dd837303ecf33",
                                "name": "Latitude 5400",
                                "price": 54000,
                                "image": "https://res.cloudinary.com/dlxu4ej5u/image/upload/v1764874391/product-images/evjfsa1uh1yxrhmpy2ku.jpg",
                                "quantity": 1,
                                "total": 54000,
                                "confirmationStatus": "Pending",
                                "_id": "693346f1f85a5abdbd232996"
                            }
                        ],
                        "deliveryServiceType": "standard",
                        "preferredDeliveryProvider": "kwik",
                        "isPaid": true,
                        "status": "Pending, awaiting vendor confirmation",
                        "trackingInfos": {
                            "vendorId": "6931bdfe322dd837303ecf33",
                            "trackingNumber": "5KW6CMND6XOKRW9G",
                            "carrier": "kwik",
                            "deliveryRequestId": "693346f3f85a5abdbd2329a1",
                            "providerName": "kwik",
                            "_id": "693346f3f85a5abdbd2329a5"
                        },
                        "vendorNotes": "",
                        "timeline": [],
                        "createdAt": "2025-12-05T20:56:17.978Z",
                        "orderNumber": "DE05-25A-0002",
                        "paidAt": "2025-12-05T20:56:32.990Z",
                    },
                    {
                        "shippingAddress": {
                            "address": "10, orelope strreet, Ilaje",
                            "city": "Mowe ibafo",
                            "state": "Ogun",
                            "country": "nigeria",
                            "phone1": "+2347066146577",
                            "latitude": 6.7713565,
                            "longitude": 3.4285586500000003
                        },
                        "_id": "693346a50fe13bf35097e4ed",
                        "userID": "6931f547db849908ac2c1aa4",
                        "products": [
                            {
                                "variant": {
                                    "color": "black",
                                    "size": "Rom: 128gb - Ram: 4gb"
                                },
                                "productID": "6933460f5f24d9a07cc1e166",
                                "vendorID": "6931bdfe322dd837303ecf33",
                                "name": "Latitude 5400",
                                "price": 54000,
                                "image": "https://res.cloudinary.com/dlxu4ej5u/image/upload/v1764874391/product-images/evjfsa1uh1yxrhmpy2ku.jpg",
                                "quantity": 1,
                                "total": 54000,
                                "confirmationStatus": "Confirmed",
                                "_id": "693346a50fe13bf35097e4ef"
                            }
                        ],
                        "deliveryServiceType": "standard",
                        "preferredDeliveryProvider": "kwik",
                        "isPaid": true,
                        "status": "Dispatched, your order is handed over to courier",
                        "trackingInfos": {
                            "vendorId": "6931bdfe322dd837303ecf33",
                            "trackingNumber": "6QV3W78ZJUKUALTP",
                            "carrier": "kwik",
                            "deliveryRequestId": "693346a60fe13bf35097e4ff",
                            "providerName": "kwik",
                            "_id": "693346a60fe13bf35097e503"
                        },
                        "vendorNotes": "Ensure to be handled in the upright position",
                        "timeline": [
                            {
                                "status": "delivered",
                                "message": "Delivered successfully, awaiting customer confirmation",
                                "timestamp": "2025-12-05T21:19:32.266Z",
                                "_id": "69334c64998ff7b3ee2ccdc8"
                            },
                            {
                                "status": "Dispatched, your order is handed over to courier",
                                "message": "Vendor Alpha Inc has handed the package to a courier",
                                "timestamp": "2025-12-05T21:06:02.170Z",
                                "_id": "6933493a0fe13bf35097e5cc"
                            }
                        ],
                        "createdAt": "2025-12-05T20:55:01.831Z",
                        "orderNumber": "DE05-25A-0001",
                        "paidAt": "2025-12-05T20:55:16.471Z"
                    }
                ]
            }
        }
    },

    flow: [
        1. vendor can accept or decline each product in an order, which the status is determined by the order.products[].confirmationStatus.
        2. The order status is the overall status of the order,
        3. the confirmationStatus can be pending (means vendor needs to either accept or decline the product), confirmed (means ongoing) or completed (means the order is completed)
    ]
    layout: {
        the order page will have tabs at the top of the page which will categorize orders into (all, pending, ongoing and completed)
    }

    accept order: {
        endpoint: /orders/vendor/confirm,
        method: post,
        payload: {
            "orderId": "69276794a7549170cdd23b2b",
            "productId": "69276794a7549170cdd23b2b",
            "confirmation": "accept" // or reject,
            "note": "Ensure to be handled in the upright position", // optional
        },
        on error: show error message,
        success_response: {
            "success": true,
            "message": "The package has been assigned to a courier",
            "data": {
                "shippingAddress": {
                    "address": "ojo market",
                    "city": "Iyana Iba, Iyana Iba",
                    "state": "Lagos",
                    "country": "Nigeria",
                    "phone1": "+2348081602424",
                    "latitude": 6.4608915,
                    "longitude": 3.2053111999999997
                },
                "_id": "69276794a7549170cdd23b2b",
                "userID": "6922201e79ff779764720714",
                "products": [
                    {
                        "variant": {
                            "color": "red",
                            "size": "XL"
                        },
                        "productID": "692765ffa7549170cdd23ab4",
                        "vendorID": "69273c32a7549170cdd23a7c",
                        "name": "fresh pepper",
                        "price": 2000,
                        "image": "https://res.cloudinary.com/dlxu4ej5u/image/upload/v1764189694/product-images/jbfgrhng9hh9hkup1cwl.jpg",
                        "quantity": 1,
                        "total": 2000,
                        "confirmationStatus": "Confirmed",
                        "_id": "69276794a7549170cdd23b2c"
                    }
                ],
                "productAmount": 2000,
                "deliveryPrice": 2136.12,
                "totalOrderPrice": 4136.12,
                "deliveryMethod": "express_delivery",
                "deliveryServiceType": "standard",
                "preferredDeliveryProvider": "kwik",
                "isPaid": true,
                "status": "Confirmed, vendor is processing your order",
                "trackingInfos": [
                    {
                        "vendorId": "69273c32a7549170cdd23a7c",
                        "trackingNumber": "1I9C7UBW8TXK9EYG",
                        "carrier": "kwik",
                        "deliveryRequestId": "69276795a7549170cdd23b33",
                        "deliveryPrice": 2136.12,
                        "providerName": "kwik",
                        "_id": "69276795a7549170cdd23b37"
                    }
                ],
                "vendorNotes": "Ensure to be handled in the upright position",
                "timeline": [],
                "createdAt": "2025-11-26T20:48:20.444Z",
                "paidAt": "2025-11-26T20:48:38.323Z",
                "paymentMethod": "online"
            }
        }
    },
    get accredited: {
        endpoint: /vendor/verify-profile,
        method: post,
        payload: {
            "id_num": "123456789",
            "country_code": "NG",
            "dob": "2000-01-01",
            "image": "image.jpg",
        },
        on error: show error message,
        success_response: {
            body: {
                success: true,
                message: "Verified",
                data: {
                    _id: "692e19844f8fc6dc2a7028b9",
                    firstname: "Adebayo",
                    lastname: "Azeez",
                    email: "adebayoazeez37@yahoo.com",
                    phone_num: "08081602424",
                    phone_verified: false,
                    role: "vendor",
                    accredited: true,
                    country_code: "+234",
                    followers: [],
                    followings: [],
                    address: "8, opebi",
                    business_description:
                    "A wholesale seller of all electronic gadget and devices",
                    business_location: "Lagos",
                    business_name: "Hay_zedd",
                    city: "Lagos",
                    country: "Nigeria",
                    occupation: "Software developer",
                    state: "Lagos",
                },
            }
        }
    },
    forms: [
        1. vendor can update their profile name and business information
        2. vendor can update their profile address
        3. vendor can verify their profile using an id number, country code, date of birth and their image.
    ]
    flow: [
        1. vendor cannot update their names after verified and accredited
        2. vendor can use the address information to prefill product address when creating a product
    ]
}  

*** GET VENDOR PROFILE ***
for getting details of the logged in vendor
endpoint: /vendor/
method: get
success_response: {
  success: true,
  message: "User details",
  data: {
    _id: "692e19844f8fc6dc2a7028b9",
    firstname: "Adebayo",
    lastname: "Azeez",
    email: "adebayoazeez37@yahoo.com",
    phone_num: "08081602424",
    phone_verified: false,
    role: "vendor",
    accredited: true,
    country_code: "+234",
    followers: [],
    followings: [],
    address: "8, opebi",
    business_description:
      "A wholesale seller of all electronic gadget and devices",
    business_location: "Lagos",
    business_name: "Hay_zedd",
    city: "Lagos",
    country: "Nigeria",
    occupation: "Software developer",
    state: "Lagos",
  },
};

*** SERVICES ***
    endpoint: /vendor/services
    method: get
    success_response: {
    "success": true,
    "message": "Services fetched successfully",
    "data": [
        {
            "location": {
                "state": "Lagos",
                "city": "Ikotun",
                "country": "Nigeria"
            },
            "ratings": {
                "rate": 0,
                "number": 0
            },
            "_id": "6933fe5c4d9b8a9267ce2323",
            "vendorDetails": "6931bdfe322dd837303ecf33",
            "name": "Battery Recharger",
            "description": "We recharge all type of car battery and restore their health",
            "category": "Automotive Services",
            "sub_category": "Battery Replacement",
            "currency": "NGN",
            "price": 8000,
            "availability": true,
            "contracts": 0,
            "images": [
                "https://res.cloudinary.com/dlxu4ej5u/image/upload/v1765015129/service-images/qdqa02hbh0ejfxoulz5h.jpg",
                "https://res.cloudinary.com/dlxu4ej5u/image/upload/v1765015131/service-images/nywrsf3qq3xrtz2agpcw.jpg"
            ],
            "reviews": [],
            "tags": [],
            "createdAt": "2025-12-06T09:58:52.268Z"
        }
    ]
}
layout: {
    a grid of the list of the vendor services:
    each grid has the service image, name, price, the rating, button to view the service and edit button
    a add service button to add a new service at the top right of the grid
    a search bar to search for services
}
forms: [
    1. add service form
    2. update service form
]

*** ADD SERVICE ***
endpoint: /vendor/services
method: post
form-data
payload: {
        name: Battery charger

        description: Battery charger for your phone

        category: Electronics

        sub_category: Chargers

        price: 2000

        currency: NGN

        images: pepper1.jpeg

        images: pepper2.jpeg

        state: Lagos

        city: Iyana-iba

        country: Nigeria
    }
success_response: {
    success: true,
    message: "Product added successfully",
    data: {
        success: true,
        message: "Service created successfully",
        data: {
            vendorDetails: "6931bdfe322dd837303ecf33",
            name: "Battery charger",
            description: "We recharge all type of car battery and restore their health",
            category: "Automotive Services",
            sub_category: "Battery Replacement",
            currency: "NGN",
            price: 8000,
            availability: true,
            contracts: 0,
            images: [
            "https://res.cloudinary.com/dlxu4ej5u/image/upload/v1765015129/service-images/qdqa02hbh0ejfxoulz5h.jpg",
            "https://res.cloudinary.com/dlxu4ej5u/image/upload/v1765015131/service-images/nywrsf3qq3xrtz2agpcw.jpg",
            ],
            location: { state: "Lagos", city: "Ikotun", country: "Nigeria" },
            reviews: [],
            ratings: { rate: 0, number: 0 },
            tags: [],
            _id: "6933fe5c4d9b8a9267ce2323",
            createdAt: "2025-12-06T09:58:52.268Z",
        },
    }
}
    validations: [
        1. vendor must be accredited to add a product
    ]
    flow: [
        1. vendor clicks on add service
        2. vendor fills in the form
        3. add service form should have a checkbox to prefill the location by the vendor's location
        4. max 5 images can be uploaded
    ]


*** UPDATE SERVICE ***
endpoint: /services/:id
method: patch
payload: {
            vendorDetails: "6931bdfe322dd837303ecf33",
            name: "Battery charger",
            description: "We recharge all type of car battery and restore their health",
            category: "Automotive Services",
            sub_category: "Battery Replacement",
            currency: "NGN",
            price: 8000,
            state: "Lagos", 
            city: "Ikotun", 
            country: "Nigeria", 
            tags: [battery, replacement],
        },

success_response: {
    "success": true,
    "message": "Service updated successfully",
    "data": {
        "location": {
            "state": "Lagos",
            "city": "Ikotun",
            "country": "Nigeria"
        },
        "ratings": {
            "rate": 0,
            "number": 0
        },
        "_id": "6933fe5c4d9b8a9267ce2323",
        "vendorDetails": "6931bdfe322dd837303ecf33",
        "name": "Battery Recharger",
        "description": "We recharge all type of car battery and restore their health",
        "category": "Automotive Services",
        "sub_category": "Battery Replacement",
        "currency": "NGN",
        "price": 8000,
        "availability": true,
        "contracts": 0,
        "images": [
            "https://res.cloudinary.com/dlxu4ej5u/image/upload/v1765015129/service-images/qdqa02hbh0ejfxoulz5h.jpg",
            "https://res.cloudinary.com/dlxu4ej5u/image/upload/v1765015131/service-images/nywrsf3qq3xrtz2agpcw.jpg"
        ],
        "reviews": [],
        "tags": [],
        "createdAt": "2025-12-06T09:58:52.268Z"
    }
}

*** UPLOAD SERVICE IMAGE ***
endpoint: /services/image/:id
method: post
form-data
payload: {
    "images": "image.jpg",
    "images": "image2.jpg",
    "images": "image3.jpg",
}

success_response: {
    "success": true,
    "message": "Service updated successfully",
    "data": {
        "location": {
            "state": "Lagos",
            "city": "Ikotun",
            "country": "Nigeria"
        },
        "ratings": {
            "rate": 0,
            "number": 0
        },
        "_id": "6933fe5c4d9b8a9267ce2323",
        "vendorDetails": "6931bdfe322dd837303ecf33",
        "name": "Battery Recharger",
        "description": "We recharge all type of car battery and restore their health",
        "category": "Automotive Services",
        "sub_category": "Battery Replacement",
        "currency": "NGN",
        "price": 8000,
        "availability": true,
        "contracts": 0,
        "images": [
            "https://res.cloudinary.com/dlxu4ej5u/image/upload/v1765015129/service-images/qdqa02hbh0ejfxoulz5h.jpg",
            "https://res.cloudinary.com/dlxu4ej5u/image/upload/v1765015131/service-images/nywrsf3qq3xrtz2agpcw.jpg",
            "https://res.cloudinary.com/dlxu4ej5u/image/upload/v1765015129/service-images/qdqa02hbh0ejfxoulz5h.jpg",
            "https://res.cloudinary.com/dlxu4ej5u/image/upload/v1765015131/service-images/nywrsf3qq3xrtz2agpcw.jpg"
        ],
        "reviews": [],
        "tags": [],
        "createdAt": "2025-12-06T09:58:52.268Z"
    }
}

*** DELETE SERVICE ***
endpoint: /services/:id
method: delete
query: {reason: "reason"}

success_response: {
    "success": true,
    "message": "Service deleted successfully"
}

success_response: {
    "success": true,
    "message": "Service suspended, will be deleted when active contract is completed"
}

error_response: {
    "success": false,
    "message": "Service not found"
}
validation: [
    1. reason is optional
]

*** DELETE SERVICE IMAGE ***
endpoint: /services/image/:service_id/:image_id
method: delete
example: image_url = https://res.cloudinary.com/dlxu4ej5u/image/upload/v1764631996/product-images/uikbmxqbn7bj7s9no7xy.jpg
image_id = uikbmxqbn7bj7s9no7xy.jpg

success_response: {
    "success": true,
    "message": "Image deleted successfully"
}
    