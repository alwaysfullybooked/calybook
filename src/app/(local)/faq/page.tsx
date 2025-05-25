import FAQTabs from "@/components/client/faq/FAQTabs";
import type { FAQCategory } from "@/components/client/faq/FAQTabs";

export const metadata = {
  title: "FAQ - CalyBook",
  description: "Frequently asked questions about booking venues and services with CalyBook",
};

const faqCategories: FAQCategory[] = [
  {
    id: "booking",
    name: "Booking & Reservations",
    faqs: [
      {
        question: "How do I book a service?",
        answer:
          "To book a service, first select your desired venue from our listings. Then, choose your preferred date and time from the available schedule. Select the service you want to book, and follow the booking process to complete your reservation. You'll need to be logged in to make a booking.",
      },
      {
        question: "Can I cancel my booking?",
        answer:
          "Cancellation policies vary by venue. Some venues may offer full refunds, partial refunds, or credit for future bookings. Please check the specific venue's cancellation policy during the booking process. We recommend reviewing these policies before confirming your booking.",
      },
      {
        question: "How far in advance can I book?",
        answer: "Booking availability varies by venue. Most venues allow bookings up to several weeks in advance. You can check the available dates and times directly on each venue's page.",
      },
      {
        question: "Do I need to create an account to book?",
        answer: "Yes, you need to create an account to make bookings. This helps us manage your reservations and provide better service. You can create an account using your email address.",
      },
    ],
  },
  {
    id: "payment",
    name: "Payment & Pricing",
    faqs: [
      {
        question: "What payment methods do you accept?",
        answer: "We currently accept PromptPay QR code payments. We plan to add support for major credit/debit cards in the future.",
      },
      {
        question: "How much does it cost to book?",
        answer:
          "Prices vary depending on the venue, type of service, and time slot. Each venue sets its own pricing, which is clearly displayed during the booking process. You'll see the exact price before confirming your booking.",
      },
      {
        question: "Are there any discounts available?",
        answer: "We plan to offer various discounts in the future, including member discounts, student rates, and off-peak hour specials. Stay tuned for updates on our promotional offers.",
      },
      {
        question: "What is your refund policy?",
        answer: "Refund policies are determined by each individual venue. Some venues may offer full refunds, partial refunds, or credit for future bookings.",
      },
    ],
  },
  {
    id: "technical",
    name: "Technical Support",
    faqs: [
      {
        question: "How do I update my account information?",
        answer: "You can update your account information by logging into your account and navigating to the profile settings. Here you can update your contact details, and other preferences.",
      },
      {
        question: "What if I encounter an error during booking?",
        answer:
          "If you encounter any technical issues during the booking process, please try refreshing the page or using a different browser. If the problem persists, contact our support team with details of the error.",
      },
      {
        question: "Is my personal information secure?",
        answer:
          "Yes, we take data security seriously. Your personal information is encrypted and stored securely. We only collect information necessary for processing your bookings and providing our services.",
      },
    ],
  },
  {
    id: "venues",
    name: "Venues & Services",
    faqs: [
      {
        question: "How do I find the right venue?",
        answer:
          "You can search for venues by location and service type. Each venue listing includes detailed information about available services, facilities, and pricing. Use our search filters to narrow down your options.",
      },
      {
        question: "What information is provided about each venue?",
        answer:
          "Each venue listing includes the venue's name, address, contact information, available services, pricing, and booking schedule. You can also view photos and read descriptions of the facilities and services offered.",
      },
      {
        question: "Can I see the venue before booking?",
        answer:
          "While we don't offer physical tours through our platform, each venue listing includes photos and detailed information about the facilities. You can also contact the venue directly for more information.",
      },
      {
        question: "How do I know if a venue is available?",
        answer: "Each venue's page shows a real-time schedule of available time slots. You can view the schedule by date and service type to find suitable booking times.",
      },
    ],
  },
  {
    id: "policies",
    name: "Rules & Policies",
    faqs: [
      {
        question: "What are the age requirements?",
        answer: "Users must be at least 18 years old to create an account and make bookings. Some venues may have additional age restrictions for specific services.",
      },
      {
        question: "What is the code of conduct?",
        answer: "We expect all users to treat venues and staff with respect. Please follow the specific rules and guidelines provided by each venue. Violations may result in account suspension.",
      },
      {
        question: "How do you handle privacy?",
        answer:
          "We are committed to protecting your privacy. We only collect and use personal information necessary for providing our services. Please review our Privacy Policy for detailed information.",
      },
      {
        question: "What are the terms of service?",
        answer:
          "Our Terms of Service outline the rules and guidelines for using our platform. This includes booking policies, user responsibilities, and platform usage terms. You can find the complete terms on our website.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center sm:mb-10">
          <h1 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">Frequently Asked Questions</h1>
          <p className="mx-auto text-sm text-gray-500 sm:max-w-2xl sm:text-base">Find answers to common questions about booking venues, services, and more.</p>
        </div>
        <FAQTabs faqCategories={faqCategories} />
        <div className="mt-12 rounded-lg bg-gray-50 p-4 text-center sm:mt-16 sm:p-6">
          <h2 className="mb-2 text-lg font-semibold sm:text-xl">Still have questions?</h2>
          <p className="mb-4 text-sm text-gray-600 sm:mb-6 sm:text-base">We're here to help! Contact our support team and we'll get back to you as soon as possible.</p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            {/* <Button asChild className="bg-green-600 hover:bg-green-700">
              <a href="mailto:support@justbookit.com">Email Support</a>
            </Button> */}
            {/* <Button variant="outline" asChild>
              <a href="/contact">Contact Us</a>
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
