"use server";

import midtransClient from "midtrans-client";

const serverKey = process.env.MIDTRANS_SERVER_KEY;

if (!serverKey) {
	throw new Error("Server key is not defined");
}

const snap = new midtransClient.Snap({
	isProduction: true,
	serverKey: serverKey,
});

interface CustomerDetails {
	first_name: string;
	last_name: string;
	email: string;
	phone: string;
}

interface ItemDetail {
	id: string;
	price: number;
	quantity: number;
	name: string;
}

interface TransactionParams {
	orderId: string;
	grossAmount: number;
	customerDetails: CustomerDetails;
	item_details: ItemDetail[];
}

export const createTransaction = async (params: TransactionParams) => {
	const transactionData = {
		transaction_details: {
			order_id: params.orderId,
			gross_amount: params.grossAmount,
		},
		custom_expiry: {
			order_time: new Date().toISOString(),
			expiry_duration: 1,
			unit: "minute",
		},
		enabled_payments: [
			"gopay",
			"other_va",
			"bri_va",
			"echannel",
			"bca_va",
			"credit_card",
		],
		item_details: params.item_details,
		customer_details: params.customerDetails,
		credit_card: {
			secure: true,
		},
		finish_redirect_url: "/thanks",
	};

	const endpoint = "https://app.midtrans.com/snap/v1/transactions";

	try {
		const response = await fetch(endpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Basic ${Buffer.from(serverKey + ":").toString(
					"base64"
				)}`,
			},
			body: JSON.stringify(transactionData),
		});

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		return await response.json();
	} catch (error) {
		throw new Error((error as Error).message);
	}
};
