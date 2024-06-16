"use client";

import { ImagesUploader } from "@/components/images-uploader";
import { LogoUploader } from "@/components/logo-uploader";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
	PiCalendar,
	PiDiscordLogoFill,
	PiPlanet,
	PiTwitterLogoFill,
	PiXCircleFill,
} from "react-icons/pi";
import { Separator } from "@/components/ui/separator";
import { createProduct } from "@/lib/server-actions";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Spinner from "@/components/spinner";

const categories = [
	"Media",
	"Blockchain",
	"Cloud",
	"Commerce",
	"Cybersecurity",
	"Data",
	"Design",
	"Photography",
	"E-commerce",
	"Education",
	"Entertainment",
	"Video",
	"Finance",
	"Social",
	"Health",
	"Fitness",
	"Marketing",
	"Music",
	"Productivity",
	"Engineering",
	"Sales",
	"Sports",
	"Travel",
	"Bootstrapped",
	"Art",
	"Analytics",
];

const NewProduct = () => {
	const [loading, setLoading] = useState(false);
	const [step, setStep] = useState(1);
	const [name, setName] = useState("");
	const [slug, setSlug] = useState("");
	const [headline, setHeadline] = useState("");
	const [shortDescription, setShortDescription] = useState("");
	const [website, setWebsite] = useState("");
	const [loadinghalaman, setLoadingHalaman] = useState(false);

	const [twitter, setTwitter] = useState("");
	const [discord, setDiscord] = useState("");

	const [date, setDate] = React.useState<Date | undefined>(new Date());

	const [uploadedLogoUrl, setUploadedLogoUrl] = useState<string>("");

	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [uploadedProductImages, setUploadedProductImages] = useState<string[]>(
		[]
	);

	const handleHeadlineChange = (e: any) => {
		const headlineText = e.target.value.slice(0, 70);
		setHeadline(headlineText);
	};

	const handleWebsiteChange = (e: any) => {
		setWebsite(e.target.value);
	};

	const handleTwitterChange = (e: any) => {
		setTwitter(e.target.value);
	};

	const handleDiscordChange = (e: any) => {
		setDiscord(e.target.value);
	};

	const handleShortDescriptionChange = (e: any) => {
		setShortDescription(e.target.value.slice(0, 300));
	};

	const handleNameChange = (e: any) => {
		const productName = e.target.value;
		const truncatedName = productName.slice(0, 30);
		setName(truncatedName);

		//create slug from product name

		const slugValue = truncatedName
			.toLowerCase()
			.replace(/\s+/g, "-") // Replace spaces with hyphens
			.replace(/\./g, "-"); // Replace periods with hyphens in the slug
		setSlug(slugValue);
	};

	const handleCategoryToggle = (category: string) => {
		if (selectedCategories.includes(category)) {
			setSelectedCategories((prevCategories) =>
				prevCategories.filter((prevCategory) => prevCategory !== category)
			);
		} else if (selectedCategories.length < 3) {
			setSelectedCategories((prevCategories) => [...prevCategories, category]);
		}
	};

	const handleLogoUpload = useCallback((url: any) => {
		setUploadedLogoUrl(url);
	}, []);

	const handleProductImagesUpload = useCallback((urls: string[]) => {
		setUploadedProductImages(urls);
	}, []);

	useEffect(() => {
		setLoadingHalaman(false);
	}, []); // Atau tambahkan dependencies sesuai kebutuhan

	const nextStep = useCallback(() => {
		if (step === 1 && name.length < 4) {
			toast(
				<>
					<div className='flex items-center gap-4  mx-auto'>
						<PiXCircleFill className='text-red-500 text-3xl' />
						<div className='text-md font-semibold'>
							Please enter at least 4 characters for the product name.
						</div>
					</div>
				</>,
				{
					position: "top-center",
				}
			);

			return;
		}

		if (step === 2 && selectedCategories.length < 3) {
			toast(
				<>
					<div className='flex items-center gap-4  mx-auto'>
						<PiXCircleFill className='text-red-500 text-3xl' />
						<div className='text-md font-semibold'>
							Please select at least 3 categories for the product.
						</div>
					</div>
				</>,
				{
					position: "top-center",
				}
			);
			return;
		}

		if (step === 3 && headline.length < 10) {
			toast(
				<>
					<div className='flex items-center gap-4  mx-auto'>
						<PiXCircleFill className='text-red-500 text-3xl' />
						<div className='text-md font-semibold'>
							Please enter at least 10 characters for the headline.
						</div>
					</div>
				</>,
				{
					position: "top-center",
				}
			);
			return;
		}
		if (step === 3 && shortDescription.length < 20) {
			toast(
				<>
					<div className='flex items-center gap-4  mx-auto'>
						<PiXCircleFill className='text-red-500 text-3xl' />
						<div className='text-md font-semibold'>
							Please enter at least 20 characters for the short description.
						</div>
					</div>
				</>,
				{
					position: "top-center",
				}
			);
			return;
		}

		if (step === 4 && !uploadedLogoUrl) {
			toast(
				<>
					<div className='flex items-center gap-4  mx-auto'>
						<PiXCircleFill className='text-red-500 text-3xl' />
						<div className='text-md font-semibold'>
							Please upload a logo for the product.
						</div>
					</div>
				</>,
				{
					position: "top-center",
				}
			);
			return;
		}

		if (step === 4 && uploadedProductImages.length < 1) {
			toast(
				<>
					<div className='flex items-center gap-4  mx-auto'>
						<PiXCircleFill className='text-red-500 text-3xl' />
						<div className='text-md font-semibold'>
							Upload at least 3 images for the product.
						</div>
					</div>
				</>,
				{
					position: "top-center",
				}
			);
			return;
		}

		if (step === 5 && !date) {
			toast(
				<>
					<div className='flex items-center gap-4  mx-auto'>
						<PiXCircleFill className='text-red-500 text-3xl' />
						<div className='text-md font-semibold'>
							Please select a release date or choose the Coming soon option.
						</div>
					</div>
				</>,
				{
					position: "top-center",
				}
			);
			return;
		}

		if (step == 6 && !website && !twitter && !discord) {
			toast(
				<>
					<div className='flex items-center gap-4  mx-auto'>
						<PiXCircleFill className='text-red-500 text-3xl' />
						<div className='text-md font-semibold'>
							Please enter at least one link for the product.
						</div>
					</div>
				</>,
				{
					position: "top-center",
				}
			);
			return;
		}

		setStep(step + 1);
	}, [
		step,
		name,
		selectedCategories,
		headline,
		shortDescription,
		uploadedLogoUrl,
		uploadedProductImages,
		date,
		website,
		twitter,
		discord,
	]);

	const prevStep = useCallback(() => {
		setStep(step - 1);
	}, [step]);

	const handleGoToProducts = () => {
		window.location.href = "/my-products";
	};

	const submitAnotherProduct = () => {
		setStep(1);
		setName("");
		setSlug("");
		setHeadline("");
		setShortDescription("");
		setDate(new Date());
		setWebsite("");
		setTwitter("");
		setDiscord("");
		setSelectedCategories([]);
		setUploadedProductImages([]);
		setUploadedLogoUrl("");
	};

	const submitProduct = async () => {
		setLoading(true);
		const formattedDate = date ? format(date, "MM/dd/yyyy") : "";

		try {
			await createProduct({
				name,
				slug,
				headline,
				website,
				twitter,
				discord,
				description: shortDescription,
				logo: uploadedLogoUrl,
				releaseDate: formattedDate,
				images: uploadedProductImages,
				category: selectedCategories,
			});
			setStep(8);
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};

	return (
		<>
			{loadinghalaman ? (
				<Spinner />
			) : (
				<div className='flex items-center justify-center py-8 md:py-20'>
					<div className='px-8 md:w-3/5 md:mx-auto'>
						{step === 1 && (
							<motion.div
								initial={{ opacity: 0, x: "100%" }} // Slide in from the right
								animate={{ opacity: 1, x: 0 }} // Slide to the center
								exit={{ opacity: 0, x: "-100%" }} // Slide out to the left
								transition={{ duration: 0.3 }}
								className='space-y-10'
							>
								<h1 className='text-4xl font-semibold'> 📦 Produk Baru</h1>
								<p className='text-xl font-light mt-4 leading-8'>
									Siap untuk memamerkan produk Anda ke dunia? Anda datang ke
									tempat yang tepat. Ikuti langkah-langkah di bawah ini untuk
									memulai.
								</p>

								<div className='mt-10'>
									<h2 className='font-medium'>Nama Produk</h2>
									<input
										type='text'
										value={name}
										maxLength={30}
										className='border rounded-md p-2 w-full mt-2 focus:outline-none'
										onChange={handleNameChange}
									/>
									<div className='text-sm text-gray-500 mt-1'>
										{name.length} / 30
									</div>
								</div>

								<div className='mt-10'>
									<h2 className='font-medium'>Slug (URL)</h2>

									<input
										type='text'
										value={slug}
										className='border rounded-md p-2 w-full mt-2 focus:outline-none'
										readOnly
									/>
								</div>
							</motion.div>
						)}

						{step === 2 && (
							<motion.div
								initial={{ opacity: 0, x: "100%" }} // Slide in from the right
								animate={{ opacity: 1, x: 0 }} // Slide to the center
								exit={{ opacity: 0, x: "-100%" }} // Slide out to the left
								transition={{ duration: 0.3 }}
								className='space-y-10'
							>
								<h1 className='text-4xl font-semibold'>
									{" "}
									📊Ke kategori mana produk Anda termasuk?
								</h1>
								<p className='text-xl font-light mt-4 leading-8'>
									Pilih setidaknya 3 kategori yang paling cocok untuk produk
									Anda. Ini akan membantu orang menemukan produk Anda.
								</p>

								<div className='mt-10'>
									<h2 className='font-medium'>Pilih Kategori</h2>
									<div className='grid grid-cols-4 gap-2 pt-4 items-center justify-center'>
										{categories.map((category, index) => (
											<motion.div
												key={index}
												className='flex border rounded-full'
												onClick={() => handleCategoryToggle(category)}
												whileTap={{ scale: 0.9 }}
											>
												<div
													className={`text-xs md:text-sm p-2 cursor-pointer w-full text-center
                       ${
													selectedCategories.includes(category)
														? "bg-purple-500 text-white rounded-full"
														: "text-black"
												}`}
												>
													{category}
												</div>
											</motion.div>
										))}
									</div>
								</div>
							</motion.div>
						)}

						{step === 3 && (
							<motion.div
								initial={{ opacity: 0, x: "100%" }} // Slide in from the right
								animate={{ opacity: 1, x: 0 }} // Slide to the center
								exit={{ opacity: 0, x: "-100%" }} // Slide out to the left
								transition={{ duration: 0.3 }}
								className='space-y-10'
							>
								<div className='text-4xl font-semibold'>📝 Detail Produk</div>
								<p className='text-xl font-light mt-4 leading-8'>
									Buatlah deskripsi produk Anda dengan sederhana dan jelas
									sehingga mudah dipahami oleh orang lain tentang apa yang
									dilakukannya.
								</p>

								<div className='mt-10'>
									<h2 className='font-medium'>Judul Utama</h2>
									<input
										type='text'
										value={headline}
										className='border rounded-md p-2 w-full mt-2 focus:outline-none'
										onChange={handleHeadlineChange}
									/>

									<div className='text-sm text-gray-500 mt-1'>
										{headline.length} / 70
									</div>
								</div>

								<div className='mt-10'>
									<h2 className='font-medium'>Deskripsi</h2>
									<textarea
										className='border rounded-md p-2 w-full mt-2 focus:outline-none'
										rows={8}
										maxLength={300}
										value={shortDescription}
										onChange={handleShortDescriptionChange}
									/>

									<div className='text-sm text-gray-500 mt-1'>
										{shortDescription.length} / 300
									</div>
								</div>
							</motion.div>
						)}

						{step === 4 && (
							<motion.div
								initial={{ opacity: 0, x: "100%" }} // Slide in from the right
								animate={{ opacity: 1, x: 0 }} // Slide to the center
								exit={{ opacity: 0, x: "-100%" }} // Slide out to the left
								transition={{ duration: 0.3 }}
								className='space-y-10'
							>
								<h1 className='text-4xl font-semibold'>
									🖼️ Tambahkan gambar untuk memamerkan produk Anda
								</h1>
								<p className='text-xl font-light mt-4 leading-8'>
									Sertakan gambar-gambar yang paling mewakili produk Anda. Hal
									ini akan membantu orang memahami bagaimana tampilan produk
									Anda.
								</p>

								<div className='mt-10'>
									<h2 className='font-medium'>Logo</h2>
									{uploadedLogoUrl ? (
										<div className='mt-2'>
											<Image
												src={uploadedLogoUrl}
												alt='logo'
												width={1000}
												height={1000}
												className='rounded-md h-40 w-40 object-cover'
											/>
										</div>
									) : (
										<LogoUploader
											endpoint='productLogo'
											onChange={handleLogoUpload}
										/>
									)}
								</div>
								<div className='mt-4'>
									<div className='font-medium'>
										Gambar Produk( upload minimal 3 )
									</div>
									{uploadedProductImages.length > 0 ? (
										<div className='mt-2 md:flex gap-2 space-y-4 md:space-y-0'>
											{uploadedProductImages.map((url, index) => (
												<div key={index} className='relative  md:w-40 h-40 '>
													<Image
														priority
														src={url}
														alt='Uploaded Product Image'
														layout='fill'
														objectFit='cover'
														className='rounded-md'
													/>
												</div>
											))}
										</div>
									) : (
										<ImagesUploader
											endpoint='productImages'
											onChange={handleProductImagesUpload}
										/>
									)}
								</div>
							</motion.div>
						)}

						{step === 5 && (
							<motion.div
								initial={{ opacity: 0, x: "100%" }} // Slide in from the right
								animate={{ opacity: 1, x: 0 }} // Slide to the center
								exit={{ opacity: 0, x: "-100%" }} // Slide out to the left
								transition={{ duration: 0.3 }}
								className='space-y-10'
							>
								<h1 className='text-4xl font-semibold'> 🗓️ Tanggal Rilis</h1>
								<p className='text-xl font-light mt-4 leading-8'>
									Kapan produk Anda akan tersedia untuk publik? Pilih tanggal
									untuk melanjutkan.
								</p>

								<div className='mt-10'>
									<div className='font-medium pb-3'>Tanggal Rilis</div>
									<>
										<Popover>
											<PopoverTrigger asChild>
												<Button
													variant={"outline"}
													className={cn(
														"w-[300px] pl-3 text-left font-normal",
														!date && "text-muted-foreground"
													)}
												>
													{date ? (
														format(date, "PPP")
													) : (
														<span>Pilih Tanggal</span>
													)}

													<PiCalendar className='ml-auto h-4 w-4 opacity-50' />
												</Button>
											</PopoverTrigger>
											<PopoverContent className='w-auto p-0' align='start'>
												<Calendar
													mode='single'
													selected={date}
													onSelect={(date) => setDate(date)}
													initialFocus
													disabled={(date) => date < new Date()}
												/>
											</PopoverContent>
										</Popover>
									</>
								</div>
							</motion.div>
						)}

						{step === 6 && (
							<motion.div
								initial={{ opacity: 0, x: "100%" }} // Slide in from the right
								animate={{ opacity: 1, x: 0 }} // Slide to the center
								exit={{ opacity: 0, x: "-100%" }} // Slide out to the left
								transition={{ duration: 0.3 }}
								className='space-y-10'
							>
								<h1 className='text-4xl font-semibold'>Tautan Tambahan </h1>
								<p className='text-xl font-light mt-4 leading-8'>
									Tambahkan tautan ke situs web produk Anda, media sosial, dan
									platform lainnya
								</p>

								<div className='mt-10'>
									<div className='font-medium flex items-center gap-x-2'>
										<PiPlanet className='text-2xl text-gray-600' />
										<span>Website</span>
									</div>

									<input
										type='text'
										value={website}
										className='border rounded-md p-2 w-full mt-2 focus:outline-none'
										placeholder='https://www.yourdomain.com'
										onChange={handleWebsiteChange}
									/>
								</div>

								<div className='mt-10'>
									<div className='font-medium flex items-center gap-x-2'>
										<PiTwitterLogoFill className='text-2xl text-sky-400' />
										<div>Twitter</div>
									</div>

									<input
										placeholder='https://www.twitter.com'
										type='text'
										className='border rounded-md p-2 w-full mt-2 focus:outline-none '
										value={twitter}
										onChange={handleTwitterChange}
									/>
								</div>

								<div className='mt-10'>
									<div className='font-medium flex items-center gap-x-2'>
										<PiDiscordLogoFill className='text-2xl text-indigo-500' />
										<div>Discord</div>
									</div>

									<input
										placeholder='https://www.discord.com'
										type='text'
										className='border rounded-md p-2 w-full mt-2 focus:outline-none '
										value={discord}
										onChange={handleDiscordChange}
									/>
								</div>
							</motion.div>
						)}

						{step === 7 && (
							<motion.div
								initial={{ opacity: 0, x: "100%" }} // Slide in from the right
								animate={{ opacity: 1, x: 0 }} // Slide to the center
								exit={{ opacity: 0, x: "-100%" }} // Slide out to the left
								transition={{ duration: 0.3 }}
								className='space-y-10'
							>
								<h1 className='text-4xl font-semibold'> 🔍 Ulasan</h1>
								<p className='text-xl font-light mt-4 leading-8'>
									Periksa detail produk Anda dan kirimkan ke dunia. Produk Anda
									akan ditinjau oleh tim kami sebelum dipublikasikan.
								</p>

								<div className='mt-10 grid grid-cols-2 gap-8'>
									<div className=''>
										<div className='font-semibold'>Nama Produk</div>
										<div className=' mt-2 text-gray-600'>{name}</div>
									</div>

									<div className=''>
										<div className='font-semibold'>Slug ( URL ) </div>
										<div className=' mt-2 text-gray-600'>{slug}</div>
									</div>

									<div className=''>
										<div className='font-semibold'>Kategori</div>
										<div className='  mt-2 text-gray-600'>
											{selectedCategories.join(", ")}
										</div>
									</div>

									<div>
										<div className='font-semibold'>Website URL</div>
										<div className=' mt-2 text-gray-600'>{website}</div>
									</div>

									<div className=''>
										<div className='font-semibold'>Judul Utama</div>
										<div className='  mt-2 text-gray-600'>{headline}</div>
									</div>
									<div className=''>
										<div className='font-semibold'>Short description</div>
										<div className=' mt-2 text-gray-600 '>
											{shortDescription}
										</div>
									</div>

									<div>
										<div className='font-semibold'>Twitter</div>
										<div className=' mt-2 text-gray-600'>{twitter}</div>
									</div>

									<div>
										<div className='font-semibold'>Discord</div>
										<div className=' mt-2 text-gray-600'>{discord}</div>
									</div>

									<div className=''>
										<div className='font-semibold'>
											Tanggal Rilis - Pending Approval
										</div>
										<div className=' mt-2 text-gray-600'>
											{date ? date.toDateString() : "Not specified"}
										</div>
									</div>

									<div className='cols-span-2'>
										<div className='font-semibold'>Gambar Produk</div>
										<div className='mt-2 md:flex gap-2 w-full'>
											{uploadedProductImages.map((url, index) => (
												<div key={index} className='relative w-28 h-28'>
													<Image
														priority
														src={url}
														alt='Uploaded Product Image'
														layout='fill'
														objectFit='cover'
														className='rounded-md'
													/>
												</div>
											))}
										</div>
									</div>
								</div>
							</motion.div>
						)}

						{step === 8 && (
							<div className='space-y-10'>
								<div className='text-4xl font-semibold'> Selamat 🎉 </div>
								<div className='text-xl font-light mt-4 leading-8 '>
									Produk Anda telah berhasil dikirim. Tim kami akan meninjau dan
									segera menghubungi Anda.
								</div>

								<div className='flex flex-col  gap-4'>
									<div
										onClick={handleGoToProducts}
										className='bg-purple-500 text-white py-2 px-4
                   rounded mt-4 flex w-60 justify-center items-center cursor-pointer'
									>
										Ke halamaan produk
									</div>

									<Separator />

									<div
										onClick={submitAnotherProduct}
										className='text-purple-500 py-2 px-4 rounded mt-4 
                  flex w-60 justify-center items-center cursor-pointer'
									>
										Tambahkan Produk lagi
									</div>
								</div>
							</div>
						)}

						{step !== 8 && (
							<>
								<div className='flex justify-between items-center mt-10'>
									{step !== 1 && (
										<button onClick={prevStep} className='text-gray-600'>
											Sebelumnya
										</button>
									)}

									<div className='flex items-center'>
										{step === 7 ? (
											<button
												onClick={submitProduct}
												className='bg-[#ff6154] text-white py-2 px-4 rounded-md mt-4 items-end'
											>
												Submit
											</button>
										) : (
											<button
												onClick={nextStep}
												className='bg-purple-500 text-white py-2 px-4 rounded-md mt-4 items-end'
											>
												{step === 7 ? "Submit" : "Selanjutnya"}
											</button>
										)}
									</div>
								</div>
							</>
						)}
					</div>
				</div>
			)}
		</>
	);
};

export default NewProduct;
