import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Terms of Service - CalyBook",
	description: "Terms of service for CalyBook",
};

export default function TermsPage() {
	return (
		<div className="container mx-auto px-4 py-12 max-w-4xl">
			<h1 className="text-4xl font-bold mb-8">Terms of Service - CalyBook</h1>

			<div className="space-y-8">
				<p className="mb-8">
					Welcome to CalyBook! These Terms of Service ("Terms") govern your access to and use of the CalyBook website (the "Website"), applications, and services (collectively, the "Service") provided
					by Fanscope Limited ("Fanscope," "we," "us," or "our"), a company incorporated in Hong Kong.
				</p>

				<section>
					<h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
					<p>
						By accessing or using our Service, you are agreeing to be bound by these Terms, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable
						local laws. If you do not agree with any of these Terms, you are prohibited from using or accessing the Service. The materials contained in this Service are protected by applicable
						copyright and trademark law.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">2. Account Registration and Authentication</h2>
					<p className="mb-4">
						To access certain features of the Service, you may be required to register for an account. We offer authentication through Google ("Third-Party Authentication Provider").
					</p>
					<ul className="list-disc pl-6 space-y-2">
						<li>
							By using Google Authentication to sign up or log in to our Service, you authorize us to access and use certain account information from Google, including your name, email address, and
							profile picture, as permitted by Google and your privacy settings with them.
						</li>
						<li>You are responsible for maintaining the confidentiality of your account credentials, whether they are directly with CalyBook or through Google Authentication.</li>
						<li>
							You agree to notify us immediately of any unauthorized use of your account or any other breach of security. Fanscope Limited will not be liable for any loss or damage arising from your
							failure to comply with this section.
						</li>
						<li>You represent and warrant that all information you provide during the registration process is accurate, current, and complete.</li>
					</ul>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">3. Use License</h2>
					<p className="mb-4">
						Subject to your compliance with these Terms, Fanscope Limited grants you a limited, non-exclusive, non-transferable, non-sublicensable license to access and use the Service for booking
						venues and events through our platform. This is the grant of a license, not a transfer of title, and under this license you may not:
					</p>
					<ul className="list-disc pl-6 space-y-2">
						<li>modify, copy, or create derivative works based on the Service or any part thereof;</li>
						<li>
							use the Service for any commercial purpose beyond its intended use as a booking platform for venues and events, or for any public display (commercial or non-commercial) not directly
							related to your use of the Service;
						</li>
						<li>attempt to decompile, reverse engineer, disassemble, or otherwise derive the source code of any software or proprietary technology comprising or making up the Service;</li>
						<li>remove any copyright, trademark, or other proprietary notices from the Service or materials originating from the Service;</li>
						<li>transfer, "frame," "mirror," or otherwise incorporate any part of the Service into any other website, application, or service;</li>
						<li>use the Service in any manner that could damage, disable, overburden, or impair the Service or interfere with any other party's use and enjoyment of the Service;</li>
						<li>attempt to gain unauthorized access to the Service, other accounts, computer systems, or networks connected to the Service, through hacking, password mining, or any other means.</li>
					</ul>
					<p className="mt-4">
						This license shall automatically terminate if you violate any of these restrictions and may be terminated by Fanscope Limited at any time, with or without notice, for any reason. Upon
						termination of this license or your access to the Service, you must cease all use of the Service and destroy any downloaded materials in your possession whether in electronic or printed
						format.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">4. Booking and Reservations</h2>
					<p className="mb-4">When using CalyBook to make bookings and reservations:</p>
					<ul className="list-disc pl-6 space-y-2">
						<li>You must provide accurate and complete information for all bookings</li>
						<li>You are responsible for reviewing and complying with each venue's specific terms and conditions</li>
						<li>You must pay all applicable fees and charges at the time of booking</li>
						<li>You must comply with any venue-specific rules or requirements</li>
						<li>You are responsible for any damages or losses caused by your failure to comply with venue rules</li>
					</ul>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">5. Disclaimer of Warranties</h2>
					<p className="font-semibold mb-4">
						THE SERVICE AND ALL MATERIALS, INFORMATION, SOFTWARE, AND CONTENT AVAILABLE THROUGH IT ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. FANSCOPE LIMITED MAKES NO WARRANTIES, EXPRESSED
						OR IMPLIED, AND HEREBY DISCLAIMS AND NEGATES ALL OTHER WARRANTIES INCLUDING, WITHOUT LIMITATION, IMPLIED WARRANTIES OR CONDITIONS OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
						NON-INFRINGEMENT OF INTELLECTUAL PROPERTY OR OTHER VIOLATION OF RIGHTS, TITLE, CUSTOM, TRADE, QUIET ENJOYMENT, SYSTEM INTEGRATION, AND FREEDOM FROM COMPUTER VIRUS.
					</p>
					<p className="font-semibold">
						FURTHER, FANSCOPE LIMITED DOES NOT WARRANT OR MAKE ANY REPRESENTATIONS CONCERNING THE ACCURACY, LIKELY RESULTS, COMPLETENESS, RELIABILITY, OR SECURITY OF THE USE OF THE SERVICE OR
						MATERIALS ON ITS WEBSITE, OR OTHERWISE RELATING TO SUCH MATERIALS OR ON ANY SITES LINKED TO THE SERVICE. WE DO NOT WARRANT THAT YOUR USE OF THE SERVICE WILL BE UNINTERRUPTED, TIMELY,
						SECURE, OR ERROR-FREE. YOU ACKNOWLEDGE THAT YOUR USE OF THE SERVICE IS AT YOUR SOLE RISK.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
					<p className="font-semibold mb-4">
						TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL FANSCOPE LIMITED, ITS AFFILIATES, DIRECTORS, EMPLOYEES, AGENTS, OR SUPPLIERS BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
						SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES (INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF DATA, PROFIT, REVENUE, GOODWILL, OR DUE TO BUSINESS INTERRUPTION, OR OTHER
						INTANGIBLE LOSSES) ARISING OUT OF THE USE OR INABILITY TO USE THE SERVICE OR ANY MATERIALS ON IT, EVEN IF FANSCOPE LIMITED OR AN AUTHORIZED REPRESENTATIVE HAS BEEN NOTIFIED ORALLY OR IN
						WRITING OF THE POSSIBILITY OF SUCH DAMAGE.
					</p>
					<p className="font-semibold mb-4">
						FANSCOPE LIMITED'S TOTAL CUMULATIVE LIABILITY TO YOU OR ANY THIRD PARTY ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICE, FROM ALL CAUSES OF ACTION AND ALL THEORIES OF LIABILITY,
						WILL BE LIMITED TO AND WILL NOT EXCEED THE FEES PAID BY YOU TO FANSCOPE LIMITED FOR THE USE OF THE SERVICE DURING THE TWELVE (12) MONTHS IMMEDIATELY PRECEDING THE CLAIM GIVING RISE TO SUCH
						LIABILITY, OR ONE HUNDRED HONG KONG DOLLARS (HKD 100.00), WHICHEVER IS GREATER.
					</p>
					<p className="font-semibold">
						BECAUSE SOME JURISDICTIONS DO NOT ALLOW LIMITATIONS ON IMPLIED WARRANTIES, OR LIMITATIONS OF LIABILITY FOR CONSEQUENTIAL OR INCIDENTAL DAMAGES, THESE LIMITATIONS MAY NOT FULLY APPLY TO
						YOU.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">7. Accuracy of Materials and User-Generated Content</h2>
					<p className="mb-4">
						The materials appearing on the Service could include technical, typographical, or photographic errors. Fanscope Limited does not warrant that any of the materials on the Service are
						accurate, complete, or current. Fanscope Limited may make changes to the materials contained on the Service at any time without notice. However, Fanscope Limited does not make any
						commitment to update the materials.
					</p>
					<p>
						You are solely responsible for any data, information, text, graphics, photos, or other materials ("User Content") that you create, upload, post, transmit, or store using the Service.
						Fanscope Limited does not claim ownership of your User Content. However, by providing User Content to the Service, you grant Fanscope Limited a worldwide, non-exclusive, royalty-free,
						sublicensable, and transferable license to use, reproduce, distribute, prepare derivative works of, display, and perform the User Content in connection with the Service and Fanscope
						Limited's (and its successors' and affiliates') business, including without limitation for promoting and redistributing part or all of the Service.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">8. Links to Third-Party Sites and Services</h2>
					<p>
						The Service may contain links to third-party websites or services (including those of our Third-Party Authentication Provider Google, venue websites, and payment processors) that are not
						owned or controlled by Fanscope Limited. Fanscope Limited has not reviewed all of these third-party sites and services and is not responsible for their content, privacy policies, or
						practices. The inclusion of any link does not imply endorsement by Fanscope Limited. Use of any such linked website or service is at your own risk. We encourage you to be aware when you
						leave our Service and to read the terms and conditions and privacy policy of any third-party website or service that you visit.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">9. Modifications to Terms or Service</h2>
					<p className="mb-4">
						Fanscope Limited reserves the right, at its sole discretion, to modify or replace these Terms at any time. If a revision is material, we will make reasonable efforts to provide at least 30
						days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those
						revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, in whole or in part, please stop using the Website and the Service.
					</p>
					<p>
						Fanscope Limited also reserves the right to modify, suspend, or discontinue the Service (or any part or content thereof) at any time with or without notice to you, for any reason. We will
						not be liable to you or to any third party for any modification, price change, suspension, or discontinuance of the Service.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
					<p className="mb-4">
						We may terminate or suspend your access to all or part of the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach
						these Terms. Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service.
					</p>
					<p>
						All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers,
						indemnity, and limitations of liability.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">11. Indemnification</h2>
					<p>
						You agree to defend, indemnify, and hold harmless Fanscope Limited, its affiliates, and their respective officers, directors, employees, and agents, from and against any and all claims,
						damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees), resulting from or arising out of a) your use and access of the
						Service, by you or any person using your account and password; b) a breach of these Terms, or c) User Content posted on the Service.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">12. Governing Law and Jurisdiction</h2>
					<p className="mb-4">
						These Terms and Conditions shall be governed by and construed in accordance with the laws of the Hong Kong Special Administrative Region ("Hong Kong"), without regard to its conflict of
						law provisions.
					</p>
					<p>
						You irrevocably agree that the courts of Hong Kong shall have exclusive jurisdiction to settle any dispute or claim (including non-contractual disputes or claims) arising out of or in
						connection with these Terms or their subject matter or formation.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">13. Severability</h2>
					<p>If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">14. Entire Agreement</h2>
					<p>
						These Terms constitute the entire agreement between you and Fanscope Limited regarding our Service and supersede and replace any prior agreements, oral or written, we might have between us
						regarding the Service.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">15. Waiver</h2>
					<p>
						No waiver of any term of these Terms shall be deemed a further or continuing waiver of such term or any other term, and Fanscope Limited's failure to assert any right or provision under
						these Terms shall not constitute a waiver of such right or provision.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">16. Contact Information</h2>
					<p>If you have any questions about these Terms, please contact us at:</p>
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
