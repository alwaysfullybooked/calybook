"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export type FAQCategory = {
  id: string;
  name: string;
  faqs: { question: string; answer: string }[];
};

export default function FAQTabs({ faqCategories }: { faqCategories: FAQCategory[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [openIndexes, setOpenIndexes] = useState<{ [key: number]: boolean }>({});

  const toggleAccordion = (index: number) => {
    setOpenIndexes((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="w-full">
      <div className="mb-6 border-b sm:mb-8">
        <div className="-mb-px flex flex-nowrap overflow-x-auto pb-2 sm:flex-wrap sm:pb-0">
          {faqCategories.map((category, index) => (
            <button
              key={category.id}
              className={`whitespace-nowrap px-3 py-2 text-sm font-medium sm:px-4 sm:py-4 ${
                index === activeIndex ? "border-b-2 border-green-600 text-green-600" : "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
              onClick={() => setActiveIndex(index)}
              type="button"
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-xl sm:text-2xl">{faqCategories[activeIndex]?.name}</CardTitle>
          <CardDescription className="text-sm sm:text-base">Common questions about {faqCategories[activeIndex]?.name?.toLowerCase()}</CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="space-y-4">
            {faqCategories[activeIndex]?.faqs?.map((faq, index) => (
              <div key={faq.question} className="border-b pb-4 last:border-b-0 last:pb-0">
                <button
                  className="flex cursor-pointer items-center justify-between py-2"
                  onClick={() => toggleAccordion(index)}
                  onKeyDown={(e) => e.key === "Enter" && toggleAccordion(index)}
                  type="button"
                >
                  <h3 className="pr-4 text-sm font-medium sm:text-base">{faq.question}</h3>
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
                    className={`h-5 w-5 flex-shrink-0 text-gray-500 transition-transform ${openIndexes[index] ? "rotate-180" : ""}`}
                  >
                    <title>Expand</title>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {openIndexes[index] && <div className="pt-2 text-sm text-gray-600 sm:text-base">{faq.answer}</div>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
