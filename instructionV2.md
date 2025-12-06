*** PROFILE ***

features: {
    update_profile: {
        endpoint: /vendor/update-profile,
        method: post,
        payload: {
            "firstname": "Adebayo",
            "lastname": "Azeez",
            "occupation": "Software developer",
            "business_name": "Hay_zedd",
            "business_location": "Lagos",
            "business_description": "A wholesale seller of all electronic gadget and devices"
        },
        on error: show error message,
        success_response: {
            body: {
                "success": true,
                "message": "User updated successfully",
                "data": {
                    "_id": "692e19844f8fc6dc2a7028b9",
                    "firstname": "Adebayo",
                    "lastname": "Azeez",
                    "email": "adebayoazeez37@yahoo.com",
                    "phone_num": "08081602424",
                    "phone_verified": false,
                    "role": "vendor",
                    "accredited": false,
                    "country_code": "+234",
                    "followers": [],
                    "followings": [],
                    "address": "8, opebi",
                    "business_description": "A wholesale seller of all electronic gadget and devices",
                    "business_location": "Lagos",
                    "business_name": "Hay_zedd",
                    "city": "Lagos",
                    "country": "Nigeria",
                    "occupation": "Software developer",
                    "state": "Lagos"
                }
            }
            header: {token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkZWJheW9h.....}
        }
    },
    update_Address: {
        endpoint: /vendor/update-profile,
        method: post,
        payload: {
            "address": "8, opebi",
            "city": "Lagos",
            "state": "Lagos",
            "country": "Nigeria",
        },
        on error: show error message,
        success_response: {
            body: {
                "success": true,
                "message": "User updated successfully",
                "data": {
                    "_id": "692e19844f8fc6dc2a7028b9",
                    "firstname": "Adebayo",
                    "lastname": "Azeez",
                    "email": "adebayoazeez37@yahoo.com",
                    "phone_num": "08081602424",
                    "phone_verified": false,
                    "role": "vendor",
                    "accredited": false,
                    "country_code": "+234",
                    "followers": [],
                    "followings": [],
                    "address": "8, opebi",
                    "business_description": "A wholesale seller of all electronic gadget and devices",
                    "business_location": "Lagos",
                    "business_name": "Hay_zedd",
                    "city": "Lagos",
                    "country": "Nigeria",
                    "occupation": "Software developer",
                    "state": "Lagos"
                }
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

*** PRODUCT ***
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
    