"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose, DialogPortal, DialogOverlay, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { createBooking } from "@/actions/bookings";
import { toast } from "sonner";

type Step = "details" | "notes" | "payment" | "success";

export default function BookingDialog({
  country,
  lang,
  city,

  bookingType,
  venueId,
  customerName,
  customerEmailId,
  venueName,
  serviceId,
  serviceName,
  startDate,
  endDate,
  startTime,
  endTime,
  durationMinutes,
  price,
  currency,
  paymentType,
  paymentImage,
  capacityLeft,
}: {
  country: string;
  lang: string;
  city: string;

  bookingType: "single" | "group";
  venueId: string;
  customerName: string;
  customerEmailId: string;
  venueName: string;
  serviceId: string;
  serviceName: string;
  serviceDescription: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  price: string;
  currency: string;
  paymentType: "manual_prepaid" | "reservation_only" | "stripe_prepaid";
  paymentImage: string | null;
  capacityLeft: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>("details");
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep === "details") {
      setCurrentStep("notes");
      return;
    }

    if (currentStep === "notes") {
      switch (paymentType) {
        case "manual_prepaid":
          setCurrentStep("payment");
          break;
        case "reservation_only":
          setCurrentStep("success");
          break;
        case "stripe_prepaid":
          alert("Stripe prepaid");
          // setCurrentStep("success");
          break;
      }
      return;
    }

    if (currentStep === "payment") {
      setCurrentStep("success");
      return;
    }

    if (currentStep === "success") {
      if (!price || !currency) return;
      setIsLoading(true);
      try {
        await createBooking({
          country,
          lang,
          city,

          bookingType,
          venueId,
          serviceId,
          startDate,
          endDate,
          startTime,
          endTime,
          quantity,
          price,
          currency,
          paymentType,
          paymentImage,
          customerName,
          customerContactMethod: "email",
          customerContactId: customerEmailId,
          customerEmailId,
          notes,
        });
        toast.success("Booking submitted successfully");
      } catch (error) {
        console.error(error);
        toast.error("Failed to submit booking");
      } finally {
        setIsLoading(false);
        handleClose();
      }
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setCurrentStep("details");
    setNotes("");
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "details":
        return `Book ${serviceName}`;
      case "notes":
        return "Add Notes";
      case "payment":
        return "Make Payment";
      case "success":
        return "Submit Booking";
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="link">
          <div className="flex flex-col items-center justify-center">
            <div className="text-xs">BOOK</div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="bg-black" />
        <DialogContent
          className="max-w-[95vw] sm:max-w-md"
          onPointerDownOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>{getStepTitle()}</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 py-2">
            {currentStep === "details" && (
              <>
                <div className="space-y-2">
                  <Label>Venue</Label>
                  <Input value={venueName} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Service</Label>
                  <Input value={serviceName} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Date & Time</Label>
                  <Input value={`${startDate} ${startTime} - ${durationMinutes} minutes`} disabled />
                </div>
                {bookingType === "group" && (
                  <div className="space-y-2">
                    <Label>Quantity ({capacityLeft} available)</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          if (quantity > 1) {
                            setQuantity(quantity - 1);
                          }
                        }}
                        disabled={quantity <= 1}
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        min={1}
                        // max={capacityLeft}
                        max={2}
                        value={quantity}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (val > capacityLeft) {
                            setQuantity(capacityLeft);
                          } else if (val < 1) {
                            setQuantity(1);
                          } else {
                            setQuantity(val);
                          }
                        }}
                        className="w-20 text-center"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          if (quantity < 2) {
                            setQuantity(quantity + 1);
                          }
                        }}
                        disabled={quantity >= capacityLeft}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                )}
                {price && currency && (
                  <div className="space-y-2">
                    <Label>Price</Label>
                    <Input value={`${quantity * Number(price)} ${currency}`} disabled />
                  </div>
                )}
              </>
            )}

            {currentStep === "notes" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-method">Contact Method</Label>
                  <Select defaultValue="email" disabled={true}>
                    <SelectTrigger id="contact-method">
                      <SelectValue placeholder="Select contact method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="line">Line</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmailId">Email</Label>
                  <Input id="contactEmailId" placeholder="Enter your email" defaultValue={customerEmailId} autoFocus={false} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="note">Note</Label>
                  <Textarea id="note" placeholder="Additional info (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} className="min-h-[100px]" autoFocus={false} />
                </div>
                <p className="text-sm text-muted-foreground">This information will help confirm your booking.</p>
              </div>
            )}

            {currentStep === "payment" && paymentImage && (
              <div className="space-y-2">
                <div className="rounded-lg">
                  <img src={paymentImage} alt="Payment QR Code" className="mx-auto" />
                </div>

                <Label className="text-center text-sm font-bold text-orange-600">If you paid, press 'Next' to go to final step to submit proof of payment. Only press 'Next' when you have paid.</Label>
              </div>
            )}

            {currentStep === "success" && paymentType === "manual_prepaid" && (
              <div className="rounded-lg bg-orange-50 p-4 text-orange-800 text-center">
                <p className="font-medium">Sent proof of payment to booking center.</p>
                <p className="font-medium">Bookings without payment will be cancelled.</p>
                <div className="mt-4 flex flex-col items-center justify-center gap-2">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/LINE_logo.svg/320px-LINE_logo.svg.png" alt="Line" className="mx-auto h-16 w-16" />
                  <Image src={`/images/line-id/${venueId}.jpg`} alt="Line Connect QR Code" width={200} height={200} className="mx-auto max-w-[200px]" />
                </div>
                <p className="mt-2 text-sm text-gray-500 text-center">Open Line App or scan QR code to contact booking center with payment confirmation.</p>
              </div>
            )}

            {currentStep === "success" && paymentType === "reservation_only" && (
              <div className="rounded-lg bg-orange-50 p-4 text-orange-800 text-center">
                <p className="font-medium">We&apos;ll contact you to confirm the booking by email at {customerEmailId}.</p>
              </div>
            )}

            <DialogFooter className="mt-6 flex justify-between p-0 sm:justify-between">
              {currentStep === "details" && (
                <>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit">Next</Button>
                </>
              )}
              {currentStep === "notes" && (
                <>
                  <Button type="button" variant="outline" onClick={() => setCurrentStep("details")}>
                    Back
                  </Button>
                  <Button type="submit">Next</Button>
                </>
              )}
              {currentStep === "payment" && (
                <>
                  <Button type="button" variant="outline" onClick={() => setCurrentStep("details")}>
                    Back
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setCurrentStep("success")}>
                    Next
                  </Button>
                </>
              )}
              {currentStep === "success" && (
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Submit Booking"
                  )}
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
