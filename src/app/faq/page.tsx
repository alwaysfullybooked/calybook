"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// export const metadata: Metadata = {
//   title: "FAQ - Tennis Court Booking",
//   description: "Frequently asked questions about booking tennis courts",
// };

export default function FAQPage() {
  const faqCategories = [
    {
      id: "booking",
      name: "Booking & Reservations",
      faqs: [
        {
          question: "How far in advance can I book a court?",
          answer: "You can book courts up to 7 days in advance. Premium members can book up to 14 days in advance.",
        },
        {
          question: "Can I cancel my booking?",
          answer: "Yes, you can cancel your booking up to 24 hours before your scheduled time for a full refund. Cancellations made less than 24 hours in advance are non-refundable.",
        },
        {
          question: "How long can I book a court for?",
          answer: "Court bookings are available in 1-hour increments, with a minimum booking of 1 hour and a maximum of 2 hours per day per member.",
        },
        {
          question: "Can I book recurring timeslots?",
          answer: "Yes, premium members can set up recurring bookings for the same time slot each week. This feature is available for up to 8 weeks in advance.",
        },
        {
          question: "What happens if it rains?",
          answer:
            "For outdoor courts, if weather conditions make play impossible, you will receive a full refund or the option to reschedule. Indoor courts are available regardless of weather conditions.",
        },
      ],
    },
    {
      id: "payment",
      name: "Payment & Pricing",
      faqs: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit/debit cards, PayPal, and Apple Pay. Some locations also offer the option to pay via bank transfer for membership fees.",
        },
        {
          question: "How much does it cost to book a court?",
          answer: "Court prices vary depending on the time of day, type of court, and location. Standard rates range from $15-30 per hour. Premium and indoor courts may have higher rates.",
        },
        {
          question: "Are there any discounts available?",
          answer: "Yes, we offer discounted rates for members, seniors, students, and during off-peak hours. Check the pricing section for your selected court for current discounts.",
        },
        {
          question: "Do you offer membership options?",
          answer: "Yes, we offer monthly and annual memberships that provide discounted court rates, priority booking, and additional benefits. Visit our membership page for more details.",
        },
        {
          question: "What is your refund policy?",
          answer:
            "Cancellations made at least 24 hours before your booking time receive a full refund. Late cancellations and no-shows are non-refundable. Exceptional circumstances may be considered on a case-by-case basis.",
        },
      ],
    },
    {
      id: "facilities",
      name: "Facilities & Equipment",
      faqs: [
        {
          question: "Do you provide tennis rackets and balls?",
          answer: "Yes, most locations offer racket rentals for a small fee. Tennis balls are available for purchase at the pro shop. Some premium memberships include free equipment rental.",
        },
        {
          question: "Are there shower facilities available?",
          answer: "Yes, most of our locations have shower and changing facilities. Check the specific club details for amenities available at each location.",
        },
        {
          question: "Is there parking available?",
          answer: "Yes, all our locations have parking available. Some urban locations may have limited parking or paid parking options nearby.",
        },
        {
          question: "Do you have floodlights for evening play?",
          answer: "Yes, our outdoor courts have floodlights available for evening play. Floodlight availability may vary by season and location.",
        },
        {
          question: "Are there food and drink options on site?",
          answer: "Most locations have at least a vending machine and water fountains. Larger clubs feature cafes or restaurants. Outside food and drinks are generally permitted in designated areas.",
        },
      ],
    },
    {
      id: "account",
      name: "Account & Membership",
      faqs: [
        {
          question: "How do I create an account?",
          answer:
            "You can create an account by clicking the 'Sign In' button at the top of the page, then selecting 'Create Account'. Fill in your details and follow the prompts to complete registration.",
        },
        {
          question: "What are the benefits of becoming a member?",
          answer:
            "Members enjoy benefits including discounted court rates, priority booking (up to 14 days in advance), ability to set up recurring bookings, and access to member-only events and tournaments.",
        },
        {
          question: "How do I upgrade to a premium membership?",
          answer: "You can upgrade your account to premium from your account dashboard. Simply log in, navigate to 'Membership' and select the premium option that suits you best.",
        },
        {
          question: "Can I share my membership with family members?",
          answer:
            "Yes, we offer family membership options that allow multiple family members to benefit from membership perks. Each family member will have their own account linked to the family membership.",
        },
        {
          question: "How do I update my personal information?",
          answer: "You can update your personal information by logging into your account, navigating to 'Account Settings', and editing your profile details.",
        },
      ],
    },
    {
      id: "policies",
      name: "Rules & Policies",
      faqs: [
        {
          question: "What should I wear on court?",
          answer: "Proper tennis attire is required on all courts. This includes tennis shoes with non-marking soles and appropriate sportswear. Some clubs may have specific dress code requirements.",
        },
        {
          question: "Can I bring guests to play?",
          answer: "Yes, members can bring guests to play. Guest fees may apply, and some peak times may have restrictions on guest play. Check with your specific club for guest policies.",
        },
        {
          question: "Is there an age restriction for booking courts?",
          answer: "Users must be at least 16 years old to book courts. Players under 16 must be accompanied by an adult. Junior programs are available for younger players.",
        },
        {
          question: "What is the court etiquette I should follow?",
          answer:
            "Please maintain a reasonable noise level, avoid disrupting players on adjacent courts, and leave the court in good condition. Full etiquette guidelines are available at each club and on our website.",
        },
        {
          question: "Do you have a code of conduct?",
          answer:
            "Yes, we maintain a code of conduct that promotes respectful behavior, fair play, and sportsmanship. Violations may result in suspension of booking privileges. The full code is available on our website and at all club locations.",
        },
      ],
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="mb-2 text-3xl font-bold tracking-tight">Frequently Asked Questions</h1>
          <p className="mx-auto max-w-2xl text-gray-500">Find answers to common questions about booking courts, memberships, facilities, and more.</p>
        </div>

        {/* Category Tabs */}
        <div className="w-full">
          <div className="mb-8 border-b">
            <div className="-mb-px flex flex-wrap">
              {faqCategories.map((category, index) => (
                <button
                  key={category.id}
                  className={`inline-block p-4 text-sm font-medium ${
                    index === 0 ? "border-b-2 border-green-600 text-green-600" : "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Display first category by default */}
          <Card>
            <CardHeader>
              <CardTitle>{faqCategories[0]?.name ?? "Booking & Reservations"}</CardTitle>
              <CardDescription>Common questions about {faqCategories[0]?.name?.toLowerCase() ?? "booking & reservations"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faqCategories[0]?.faqs?.map((faq, index) => (
                  <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <div
                      className="flex cursor-pointer items-center justify-between py-2"
                      onClick={() => {
                        /* Toggle accordion logic would go here */
                      }}
                    >
                      <h3 className="font-medium">{faq.question}</h3>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 text-gray-500"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                    <div className="pt-2 text-gray-600">{faq.answer}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 rounded-lg bg-gray-50 p-6 text-center">
          <h2 className="mb-2 text-xl font-semibold">Still have questions?</h2>
          <p className="mb-6 text-gray-600">We&apos;re here to help! Contact our support team and we&apos;ll get back to you as soon as possible.</p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <a href="mailto:support@tennisbooker.com">Email Support</a>
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
