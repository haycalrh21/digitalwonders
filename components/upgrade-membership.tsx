import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { createTransaction } from "@/lib/server-pembayaran";
import { upgradeUserToPremium } from "@/lib/server-update-pembayaran";

interface UpgradeMembershipProps {
	authenticatedUser: any;
}

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

const UpgradeMembership: React.FC<UpgradeMembershipProps> = ({
	authenticatedUser,
}) => {
	const [orderId, setOrderId] = useState<string>("");
	const [processingPayment, setProcessingPayment] = useState<boolean>(false);
	const [buttonText, setButtonText] = useState<string>("Upgrade Membership");

	useEffect(() => {
		setOrderId(generateRandomOrderId());
	}, []);

	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://app.midtrans.com/snap/snap.js";
		script.setAttribute(
			"data-client-key",
			process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ""
		);
		document.body.appendChild(script);

		return () => {
			document.body.removeChild(script); // Membersihkan script saat komponen unmount
		};
	}, []);

	const customer: Customer = {
		first_name: authenticatedUser?.user.firstName || "",
		last_name: authenticatedUser?.user.lastName || "",
		email: authenticatedUser?.user.email || "",
		phone: authenticatedUser?.phone || "",
	};

	const items: ItemDetail[] = [
		{
			id: "membership_upgrade",
			name: "Upgrade Membership",
			quantity: 1,
			price: 1,
		},
	];

	const handlePayment = async () => {
		try {
			const transaction = await createTransaction({
				orderId,
				grossAmount: 1,
				customerDetails: {
					first_name: customer.first_name,
					last_name: customer.last_name,
					email: customer.email,
					phone: customer.phone,
				},
				item_details: items,
			});

			const token = transaction.token;

			if (window.snap) {
				setProcessingPayment(true);
				window.snap.pay(token, {
					onSuccess: () => handleUpgradeSuccess(),
					onPending: () => handleUpgradePending(),
					onClose: () => handleUpgradeClosed(),
				});
			} else {
				console.error("Snap.js is not loaded yet.");
				toast.error("Failed to load payment gateway. Please try again later.");
			}
		} catch (error) {
			console.error("Payment Error:", error);
			toast.error("Failed to upgrade membership. Please try again later.");
		}
	};

	const handleUpgradeSuccess = async () => {
		setProcessingPayment(false);
		toast.success("Upgrade successful! You can now enjoy premium features.");

		try {
			await upgradeUserToPremium(authenticatedUser?.user.id);
			console.log("User upgraded successfully.");
		} catch (error) {
			console.error("Error upgrading user:", error);
			toast.error("Failed to upgrade membership. Please contact support.");
		}
	};

	const handleUpgradePending = () => {
		setProcessingPayment(false);
		toast.info("Payment is pending. Please wait for verification.");
	};

	const handleUpgradeClosed = () => {
		setProcessingPayment(false);
		setButtonText("Upgrade Membership");
		toast.warning("Payment process canceled or closed.");
	};

	const generateRandomOrderId = (): string => {
		const randomNumber = Math.floor(Math.random() * 1000000);
		return `ORDER-${randomNumber}`;
	};

	const handleClick = () => {
		setButtonText("Processing Payment...");
		handlePayment();
	};

	return (
		<div className='space-y-6'>
			<Image
				src={"/images/start-up-14.png"}
				width={150}
				height={150}
				alt='Upgrade Membership'
				className='mx-auto'
			/>
			<h1 className='text-2xl font-semibold text-center'>
				Go Pro and unlock more features
			</h1>
			<p className='text-gray-600 text-center'>
				Looking to create more projects? Upgrade your membership to unlock
				unlimited projects.
			</p>

			<div className='pt-4'>
				<button
					onClick={handleClick}
					className='bg-indigo-500 text-white p-2 rounded-md w-full'
					disabled={processingPayment}
				>
					{buttonText}
				</button>
			</div>
		</div>
	);
};

export default UpgradeMembership;
