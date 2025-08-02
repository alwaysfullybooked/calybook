import Header from "@/components/header";
import Footer from "@/components/footer";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<div className="max-w-5xl container mx-auto px-3 sm:px-4">
			<Header country="" link="/" />
			<main>{children}</main>
			<Footer country={"Asia"} />
		</div>
	);
}
