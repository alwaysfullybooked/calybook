import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, CreditCard, User } from "lucide-react";

export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Placeholder data
  const booking = {
    venueId: id,
    venueName: "Chiang Mai Tennis Club",
    facilityName: "Court 1",
    date: "May 1, 2024",
    time: "10:00 AM - 12:00 PM",
    duration: "2 hours",
    price: "1,200 THB",
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold">Complete Your Booking</h1>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
              <CardDescription>Review your booking information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">{booking.venueName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <span>{booking.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <span>{booking.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-gray-500" />
                  <span>{booking.price}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>Enter your payment details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Card Number</label>
                    <input type="text" placeholder="1234 5678 9012 3456" className="mt-1 w-full rounded-md border px-3 py-2" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Expiry Date</label>
                    <input type="text" placeholder="MM/YY" className="mt-1 w-full rounded-md border px-3 py-2" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Cardholder Name</label>
                  <input type="text" placeholder="John Doe" className="mt-1 w-full rounded-md border px-3 py-2" />
                </div>
                <div>
                  <label className="text-sm font-medium">CVV</label>
                  <input type="text" placeholder="123" className="mt-1 w-full rounded-md border px-3 py-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button className="w-full md:w-auto">Confirm Booking</Button>
          </div>
        </div>
      </div>
    </main>
  );
}
