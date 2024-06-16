// types/midtrans-client.d.ts

declare module "midtrans-client" {
	interface TransactionDetails {
		order_id: string;
		gross_amount: number;
	}

	interface CreditCard {
		secure: boolean;
	}

	interface CustomerDetails {
		first_name: string;
		last_name: string;
		email: string;
		phone: string;
	}

	interface TransactionParams {
		transaction_details: TransactionDetails;
		credit_card: CreditCard;
		customer_details: CustomerDetails;
	}

	interface TransactionResponse {
		token: string;
		redirect_url: string;
	}

	class Snap {
		constructor(config: { isProduction: boolean; serverKey: string });
		createTransaction(
			parameters: TransactionParams
		): Promise<TransactionResponse>;
	}
}
