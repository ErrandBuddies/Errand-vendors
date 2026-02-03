*** The Contract ***

Lets implement the service contract for this errandbuddies vendor app
The contract works in the chat section of the app.
The workflow:
1. User initiates a chat with a vendor for any of their service.
2. Conversation starts.
3. The vendor initiate negotiation mode and select the (reference service).
4. The user accepts or rejects the status.
5. Vendor can terminate contract at this stage but not after payment
6. The vendor initiates payment mode, (Enters the amount and duration)
7. User accepts or rejects the payment. (contract move to ongoing if accepted)
8. The vendor updates the status to completed when completed.
9. The end of the contract is when the user rate the contract.

Implementation:
1. Add a select dropdown to initiate the contract modes and shows the current status of the contract at the top right of the chat screen.
2. The select dropdown should have the following options:
   - Negotiation
   - Payment
   - Completed
3. Add a modal that shows the list of the services of the vendor so the vendor can select one of them to initiate the negotiation mode.
4. invoke the start negotiation event when the vendor selects a service.
5. listen for the negotiation confirmation event and update the contract status.
6. listen for the termination contract event and update the contract status.
7. invoke the payment initiation event when the vendor selects payment mode.
8. listen for the payment completion event and update the contract status.
9. Invoke the contract completion event when the vendor updates the status to completed.
10. listen for the contract completion event and update the contract status.


Events:
1. Start negotiation: {
    event name: "service-negotiation-start"
    payload: {
        serviceId: string, // the _id of the selected service
        recipientID: string, the _id of the user
        name: string, // an optional title just for the vendor to identify
    }

    response:
        success response: {
            success: true,
            message: "Negotiation started",
            contract: "contract": {
                "ratings": {
                    "rate": 0,
                    "number": 0
                },
                "_id": "6941e44dadee3c921be63b1b",
                "vendorDetails": "691e1ed7cbf5112a1210b168",
                "userDetails": "6920d8e7330034a72ad45be7",
                "serviceDetails": "693401fcef611dd703eca518",
                "name": "Olamilekan",
                "currency": "NGN",
                "price": 0,
                "paymentStatus": "pending",
                "stage": "initiated",
                "duration": 0,
                "clientStatus": "negotiation_prompt",
                "reviews": [],
                "createdAt": "2025-12-16T22:59:25.287Z",
                "updatedAt": "2025-12-16T22:59:25.287Z",
                "__v": 0
            },
        }
        failure response: {
            success: false,
            message: "Negotiation failed"
        }
}

2. Negotiation confirmation: {
    event name: "service-confirm-negotiation"
    success response: {
        success: true,
        message: "Negotiation confirmed",
        contract: {
            "ratings": {
                "rate": 0,
                "number": 0
            },
            "_id": "6941e44dadee3c921be63b1b",
            "vendorDetails": "691e1ed7cbf5112a1210b168",
            "userDetails": "6920d8e7330034a72ad45be7",
            "serviceDetails": "693401fcef611dd703eca518",
            "name": "Olamilekan",
            "currency": "NGN",
            "price": 0,
            "paymentStatus": "pending",
            "stage": "negotiation",
            "duration": 0,
            "clientStatus": "negotiation",
            "reviews": [],
            "createdAt": "2025-12-16T22:59:25.287Z",
            "updatedAt": "2025-12-16T23:04:02.718Z",
            "__v": 0
        }, // the contract object
    }
    failure response: {
        success: true,
        message: "Negotiation declined"
        contract: null
    }
}

3. Terminate contract: {
    event name: "service-terminate-contract"
    payload: {
        contractId: string, // the _id of the contract
        recipientID: string, // the _id of the user
    }
    response:
        success response: {
            success: true,
            message: "Contract id terminated",
            contract: {
                "ratings": {
                    "rate": 0,
                    "number": 0
                },
                "_id": "6941e44dadee3c921be63b1b",
                "vendorDetails": "691e1ed7cbf5112a1210b168",
                "userDetails": "6920d8e7330034a72ad45be7",
                "serviceDetails": "693401fcef611dd703eca518",
                "name": "Olamilekan",
                "currency": "NGN",
                "price": 0,
                "paymentStatus": "pending",
                "stage": "cancelled",
                "duration": 0,
                "clientStatus": "completed",
                "reviews": [],
                "createdAt": "2025-12-16T22:59:25.287Z",
                "updatedAt": "2025-12-16T23:06:10.611Z",
                "__v": 0,
                "cancelledBy": "customer"
            }, // the contract object
        }
        failure response: {
            success: false,
            message: "Contract termination failed"
        }
}

4. Start payment: {
    event name: "service-initiate-payment"
    payload: {
        contractId: string, // the _id of the contract
        amount: number, // the amount of the payment
        duration: number, // the duration of the contract in hours
    }

    response:
        success response: {
            success: true,
            message: "Payment initiated",
            contract: {
                "ratings": {
                    "rate": 0,
                    "number": 0
                },
                "_id": "6941e979adee3c921be63dc6",
                "vendorDetails": "691e1ed7cbf5112a1210b168",
                "userDetails": "6920d8e7330034a72ad45be7",
                "serviceDetails": "693401fcef611dd703eca518",
                "name": "Olamilekan",
                "currency": "NGN",
                "price": 30000,
                "paymentStatus": "pending",
                "stage": "payment",
                "duration": 50.5,
                "clientStatus": "payment_prompt",
                "reviews": [],
                "createdAt": "2025-12-16T23:21:29.394Z",
                "updatedAt": "2025-12-16T23:22:57.734Z",
                "__v": 0
            }, 
        }
        failure response: {
            success: false,
            message: "Payment initiation failed"
        }
}

5. Payment completion: {
    event name: "service-complete-payment"
    success response: {
        success: true,
        message: "Payment completed successfully",
        payment: true,
        contract: {
            "ratings": {
                "rate": 0,
                "number": 0
            },
            "_id": "6941e979adee3c921be63dc6",
            "vendorDetails": "691e1ed7cbf5112a1210b168",
            "userDetails": "6920d8e7330034a72ad45be7",
            "serviceDetails": "693401fcef611dd703eca518",
            "name": "Olamilekan",
            "currency": "NGN",
            "price": 30000,
            "paymentStatus": "paid",
            "stage": "payment",
            "duration": 50.5,
            "clientStatus": "confirmed",
            "reviews": [],
            "createdAt": "2025-12-16T23:21:29.394Z",
            "updatedAt": "2025-12-16T23:22:57.734Z",
            "__v": 0
        }, // the contract object
    }
    failure response: {
        success: true,
        message: "Payment declined",
        payment: false
        contract: {
            "ratings": {
                "rate": 0,
                "number": 0
            },
            "_id": "6941e979adee3c921be63dc6",
            "vendorDetails": "691e1ed7cbf5112a1210b168",
            "userDetails": "6920d8e7330034a72ad45be7",
            "serviceDetails": "693401fcef611dd703eca518",
            "name": "Olamilekan",
            "currency": "NGN",
            "price": 30000,
            "paymentStatus": "pending",
            "stage": "payment",
            "duration": 50.5,
            "clientStatus": "negotiation",
            "reviews": [],
            "createdAt": "2025-12-16T23:21:29.394Z",
            "updatedAt": "2025-12-16T23:22:57.734Z",
            "__v": 0
        }, // the contract object
    }
}

6. complete contract: {
    event name: "service-complete-contract"
    payload: {
        contractId: string, // the _id of the contract
    }
    response:
        success response: {
            success: true,
            message: "Contract completed successfully",
            contract: {
                "ratings": {
                    "rate": 0,
                    "number": 0
                },
                "_id": "6941e979adee3c921be63dc6",
                "vendorDetails": "691e1ed7cbf5112a1210b168",
                "userDetails": "6920d8e7330034a72ad45be7",
                "serviceDetails": "693401fcef611dd703eca518",
                "name": "Olamilekan",
                "currency": "NGN",
                "price": 30000,
                "paymentStatus": "paid",
                "stage": "completed",
                "duration": 50.5,
                "clientStatus": "vendor_completed",
                "reviews": [],
                "createdAt": "2025-12-16T23:21:29.394Z",
                "updatedAt": "2025-12-16T23:22:57.734Z",
                "__v": 0
            }, // the contract object
        }
        failure response: {
            success: false,
            message: "Contract completion failed"
        }
}
    
Note: 
All events emitted have a response emit in the same name to get the response from the server, the response is an object with a success and message property.
The contract.stage is the determinant of the contract stage at the vendor side. The clientStatus is determinant on the customer side. Only focus on the vendor side as this is a vendor app.
  