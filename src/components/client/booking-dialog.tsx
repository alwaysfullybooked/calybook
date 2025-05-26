"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
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
  venueId,
  email,
  contactMethod,
  contactWhatsAppId,
  contactLineId,
  venueName,

  serviceId,
  serviceName,
  serviceDescription,
  startDate,
  endDate,
  startTime,
  endTime,
  durationMinutes,
  paymentImage,
  price,
  currency,
}: {
  venueId: string;
  email: string;
  contactMethod: string;
  contactWhatsAppId: string;
  contactLineId: string;
  venueName: string;

  serviceId: string;
  serviceName: string;
  serviceDescription: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  paymentImage?: string;
  price: string;
  currency: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>("details");
  const [notes, setNotes] = useState("");
  const [customerContactMethod, setCustomerContactMethod] = useState(contactMethod);
  const [timeLeft, setTimeLeft] = useState(60);
  const formRef = useRef<HTMLFormElement>(null);

  const customerContactId = customerContactMethod === "email" ? email : customerContactMethod === "line" ? contactLineId : contactWhatsAppId;

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (currentStep === "payment") {
      setTimeLeft(60); // Reset timer when entering payment step
      timerId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerId);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [currentStep]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep === "details") {
      setCurrentStep("notes");
      return;
    }

    if (currentStep === "notes") {
      setCurrentStep("payment");
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
          venueId,
          serviceId,
          serviceName,
          serviceDescription,
          startDate,
          endDate,
          startTime,
          endTime,
          price,
          currency,
          customerContactMethod,
          customerContactId,
          notes,
        });
        toast.success("Booking submitted successfully");
      } catch (error) {
        console.error(error);
        toast.error("Failed to submit booking");
      } finally {
        setIsLoading(false);
        setIsOpen(false);
      }
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setCurrentStep("details");
    setNotes("");
    setCustomerContactMethod(contactMethod);
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
        <Button variant="link" onClick={() => setIsOpen(true)} size="sm">
          BOOK - {durationMinutes} minutes
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="bg-black/50" />
        <DialogContent className="max-w-[95vw] sm:max-w-md">
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
                {price && currency && (
                  <div className="space-y-2">
                    <Label>Price</Label>
                    <Input value={`${price} ${currency}`} disabled />
                  </div>
                )}
              </>
            )}

            {currentStep === "notes" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-method">Contact Method</Label>
                  <Select value={customerContactMethod} onValueChange={setCustomerContactMethod} disabled={true}>
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
                  <Label htmlFor="contact-value">{customerContactMethod === "email" ? "Email" : customerContactMethod === "line" ? "Line ID" : "WhatsApp Number"}</Label>
                  <Input
                    id="contact-value"
                    placeholder={`Enter your ${customerContactMethod}`}
                    value={customerContactMethod === "email" ? email : customerContactMethod === "line" ? contactLineId : contactWhatsAppId}
                    autoFocus={false}
                    disabled
                  />
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
                <div className="rounded-lg">{timeLeft > 0 && <img src={paymentImage} alt="Payment QR Code" className="mx-auto" />}</div>

                {timeLeft > 0 ? (
                  <div className="text-center text-sm font-bold text-orange-600">
                    <p>Time remaining: {timeLeft} seconds.</p>
                  </div>
                ) : (
                  <div className="text-center text-sm font-bold text-orange-600">Timeout. Go back and try again.</div>
                )}
                <Label className="text-center text-sm font-bold text-orange-600">In the next step, you will be asked to submit proof of payment. Only press 'Next' when you have paid.</Label>
              </div>
            )}

            {currentStep === "success" && (
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
                  <Button type="button" variant="outline" onClick={() => setCurrentStep("success")} disabled={timeLeft > 0}>
                    {timeLeft > 0 ? "Waiting for payment" : "Next"}
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
