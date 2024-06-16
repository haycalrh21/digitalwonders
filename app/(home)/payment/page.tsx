"use client";

import { useEffect, useState } from "react";
import { createTransaction } from "@/lib/server-pembayaran"; // Sesuaikan path dengan lokasi Anda

interface Customer {
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

declare global {
	interface Window {
		snap: any;
	}
}

const PaymentPage = () => {
	const [orderId, setOrderId] = useState<string>("");
	const [grossAmount, setGrossAmount] = useState<number>(0);
	const [customer, setCustomer] = useState<Customer>({
		first_name: "",
		last_name: "",
		email: "",
		phone: "",
	});
	const [items, setItems] = useState<ItemDetail[]>([]);

	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://app.midtrans.com/snap/snap.js";
		script.setAttribute(
			"data-client-key",
			process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ""
		);
		document.body.appendChild(script);
	}, []);

	const handlePayment = async () => {
		try {
			const transaction = await createTransaction({
				orderId,
				grossAmount,
				customerDetails: customer,
				item_details: items,
			});

			const token = transaction.token;

			if (window.snap) {
				window.snap.pay(token);
			} else {
				console.error("Snap.js is not loaded yet.");
			}
		} catch (error) {
			console.error("Payment Error:", error);
		}
	};

	return (
		<div>
			<h1>Payment Page</h1>
			<input
				type='text'
				placeholder='Order ID'
				value={orderId}
				onChange={(e) => setOrderId(e.target.value)}
			/>
			<input
				type='number'
				placeholder='Gross Amount'
				value={grossAmount}
				onChange={(e) => setGrossAmount(parseFloat(e.target.value))}
			/>
			<input
				type='text'
				placeholder='First Name'
				value={customer.first_name}
				onChange={(e) =>
					setCustomer({ ...customer, first_name: e.target.value })
				}
			/>
			<input
				type='text'
				placeholder='Last Name'
				value={customer.last_name}
				onChange={(e) =>
					setCustomer({ ...customer, last_name: e.target.value })
				}
			/>
			<input
				type='email'
				placeholder='Email'
				value={customer.email}
				onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
			/>
			<input
				type='tel'
				placeholder='Phone'
				value={customer.phone}
				onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
			/>
			<button onClick={handlePayment}>Pay Now</button>
		</div>
	);
};

export default PaymentPage;
