import FAQTabs from "@/components/client/faq/FAQTabs";
import type { FAQCategory } from "@/components/client/faq/FAQTabs";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "FAQ - Booking Service",
  description: "Frequently asked questions about booking with our service",
};

const faqCategories: FAQCategory[] = [
  {
    id: "booking",
    name: "Booking & Reservations",
    faqs: [
      {
        question: "How do I book a service?",
        answer:
          "If there is available inventory for your desired time slot, you can book it instantly through our online system. Select your preferred date, time, and service, then follow the booking process to secure your reservation.",
      },
      {
        question: "Can I cancel my booking?",
        answer:
          "Cancellation policies are set by each individual venue. Some venues may offer full refunds, partial refunds, or credit for future bookings. Please check the specific venue's cancellation policy during the booking process.",
      },
      // {
      //   question: "How long can I book for?",
      //   answer: "Bookings are available in 1-hour increments, with a minimum booking of 1 hour and a maximum of 2 hours per day per user.",
      // },
      // {
      //   question: "Can I book recurring timeslots?",
      //   answer: "Yes, premium users can set up recurring bookings for the same time slot each week, up to 8 weeks in advance.",
      // },
      {
        question: "What happens if the service is unavailable?",
        answer: "If your booking cannot be fulfilled due to unforeseen circumstances, you will receive a full refund or the option to reschedule.",
      },
    ],
  },
  {
    id: "payment",
    name: "Payment & Pricing",
    faqs: [
      {
        question: "What payment methods do you accept?",
        answer: "PromptPay QR code for now, in the future we will accept major credit/debit cards.",
      },
      {
        question: "How much does it cost to book?",
        answer: "Prices vary depending on the time, type of service, and location. Standard rates are displayed during the booking process.",
      },
      {
        question: "Are there any discounts available?",
        answer: "Not yet, we will offer discounts for members, students, and during off-peak hours in the future.",
      },
      {
        question: "Do you offer membership options?",
        answer: "Not yet, we will offer membership options in the future.",
      },
      {
        question: "What is your refund policy?",
        answer:
          "Cancellation policies are set by each individual venue. Some venues may offer full refunds, partial refunds, or credit for future bookings. Please check the specific venue's cancellation policy during the booking process.",
      },
    ],
  },
  {
    id: "facilities",
    name: "Facilities & Equipment",
    faqs: [
      {
        question: "Do you provide equipment?",
        answer: "Most locations offer equipment rentals for a small fee. Some memberships include free equipment rental.",
      },
      {
        question: "Are there shower facilities available?",
        answer: "Many locations have shower and changing facilities. Check the specific location details for available amenities.",
      },
      {
        question: "Is there parking available?",
        answer: "Most locations have parking available. Some urban locations may have limited or paid parking options nearby.",
      },
      {
        question: "Are there food and drink options on site?",
        answer: "Many locations offer food and drink options. Outside food and drinks are generally permitted in designated areas.",
      },
    ],
  },
  {
    id: "account",
    name: "Account & Membership",
    faqs: [
      {
        question: "How do I create an account?",
        answer: "You can create an account by clicking the 'Sign In' button at the top of the page, then selecting 'Create Account'. Fill in your details and follow the prompts.",
      },
      {
        question: "What are the benefits of becoming a member?",
        answer: "Members enjoy benefits including discounted rates, priority booking, ability to set up recurring bookings, and access to member-only events.",
      },
      {
        question: "How do I upgrade to a premium membership?",
        answer: "You can upgrade your account to premium from your account dashboard. Log in, navigate to 'Membership', and select the premium option.",
      },
      {
        question: "Can I share my membership with family members?",
        answer: "We offer family membership options that allow multiple family members to benefit from membership perks.",
      },
      {
        question: "How do I update my personal information?",
        answer: "You can update your personal information by logging into your account and editing your profile details.",
      },
    ],
  },
  {
    id: "policies",
    name: "Rules & Policies",
    faqs: [
      {
        question: "What should I wear?",
        answer: "Appropriate attire is required for all services. Some locations may have specific dress code requirements.",
      },
      {
        question: "Can I bring guests?",
        answer: "Yes, members can bring guests. Guest fees may apply, and some peak times may have restrictions.",
      },
      {
        question: "Is there an age restriction for booking?",
        answer: "Users must be at least 16 years old to book. Younger users may participate with adult supervision.",
      },
      {
        question: "What is the etiquette I should follow?",
        answer: "Please be respectful of others and follow the guidelines provided at each location.",
      },
      {
        question: "Do you have a code of conduct?",
        answer: "Yes, we maintain a code of conduct that promotes respectful behavior and fair use. Violations may result in suspension of privileges.",
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
          <p className="mx-auto text-sm text-gray-500 sm:max-w-2xl sm:text-base">Find answers to common questions about booking, memberships, facilities, and more.</p>
        </div>
        <FAQTabs faqCategories={faqCategories} />
        <div className="mt-12 rounded-lg bg-gray-50 p-4 text-center sm:mt-16 sm:p-6">
          <h2 className="mb-2 text-lg font-semibold sm:text-xl">Still have questions?</h2>
          <p className="mb-4 text-sm text-gray-600 sm:mb-6 sm:text-base">We&apos;re here to help! Contact our support team and we&apos;ll get back to you as soon as possible.</p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <a href="mailto:support@bookingservice.com">Email Support</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/contact">Contact Us</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
