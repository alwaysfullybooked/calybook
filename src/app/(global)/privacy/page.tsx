import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Privacy Policy - CalyBook",
	description: "Privacy policy for CalyBook",
};

export default function PrivacyPage() {
	return (
		<div className="container mx-auto px-4 py-12 max-w-4xl">
			<h1 className="text-4xl font-bold mb-8">Privacy Policy - CalyBook</h1>

			<div className="space-y-8">
				<p className="mb-8">
					Your privacy is important to us. It is CalyBook's policy to respect your privacy regarding any information we may collect from you across our website, https://www.calybook.com, and other
					sites we own and operate.
				</p>

				<section>
					<h2 className="text-2xl font-semibold mb-4">GDPR Compliance</h2>
					<p>
						CalyBook strictly implements the GDPR regulation, which aims at protecting user data and providing a right to modify and delete such data, as well as to consent to data collection. This
						policy applies to all our users, regardless of their location worldwide.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">Authentication and User Data</h2>
					<p>
						We use Google Authentication to provide a secure and convenient login experience. When you sign in with Google, we collect your name, email address, and profile picture. This information
						is used to:
					</p>
					<ul className="list-disc pl-6 space-y-2 mt-4">
						<li>Create and manage your account</li>
						<li>Process your bookings and reservations</li>
						<li>Communicate with you about your bookings</li>
						<li>Provide customer support</li>
						<li>Send you important updates about our service</li>
					</ul>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">Booking Information</h2>
					<p>When you make a booking through CalyBook, we collect and process the following information:</p>
					<ul className="list-disc pl-6 space-y-2 mt-4">
						<li>Your booking details (date, time, venue, service)</li>
						<li>Contact information for communication about your booking</li>
						<li>Payment information (processed securely through our payment providers)</li>
						<li>Any special requests or requirements for your booking</li>
					</ul>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">Information Collection</h2>
					<p>
						We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why
						we're collecting it and how it will be used.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">Data Retention and Protection</h2>
					<p>
						We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we'll protect within commercially acceptable means to prevent
						loss and theft, as well as unauthorized access, disclosure, copying, use or modification.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
					<p>
						We share your booking information with the venues you book through our platform to facilitate your reservations. We don't share any personally identifying information publicly or with
						third-parties, except when required to by law or to provide our services.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">External Links</h2>
					<p>
						Our website may link to external sites that are not operated by us, including venue websites and third-party services. Please be aware that we have no control over the content and
						practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
					<p>You have the right to:</p>
					<ul className="list-disc pl-6 space-y-2 mt-4">
						<li>Access your personal data</li>
						<li>Correct inaccurate data</li>
						<li>Request deletion of your data</li>
						<li>Object to data processing</li>
						<li>Request data portability</li>
						<li>Withdraw consent at any time</li>
					</ul>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
					<p>
						Your continued use of our website will be regarded as acceptance of our practices around privacy and personal information. If you have any questions about how we handle user data and
						personal information, feel free to contact us.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
					<div className="mt-4">
						<p>Fanscope Limited</p>
						<p>Unit 2A, 17/F, Glenealy Tower</p>
						<p>No.1 Glenealy, Central</p>
						<p>Hong Kong S.A.R</p>
					</div>
				</section>
			</div>
		</div>
	);
}
