"use server";

import { db } from "@/lib/db";

// Fungsi untuk mengubah isPremium menjadi true berdasarkan userId
export async function upgradeUserToPremium(userId: string) {
	try {
		const updatedUser = await db.user.update({
			where: { id: userId },
			data: { isPremium: true },
		});
		return updatedUser;
	} catch (error) {
		console.error("Error updating user premium status:", error);
		throw new Error("Failed to update user premium status");
	}
}
