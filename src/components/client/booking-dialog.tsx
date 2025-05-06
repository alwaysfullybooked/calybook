"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose, DialogPortal, DialogOverlay, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { createBooking } from "@/actions/bookings";
import { format, toZonedTime } from "date-fns-tz";

type Step = "details" | "notes" | "payment" | "success";

export default function BookingDialog({
  customerId,
  email,
  contactMethod,
  contactWhatsAppId,
  contactLineId,
  venueName,
  serviceName,
  serviceId,
  serviceType,
  serviceIndoor,
  date,
  startDatetime,
  endDatetime,
  timezone,
  durationMinutes,
  paymentImage,
  price,
  currency,
}: {
  customerId: string;
  email: string;
  contactMethod: string;
  contactWhatsAppId: string;
  contactLineId: string;
  venueName: string;
  serviceName: string;
  serviceId: string;
  serviceType: string;
  serviceIndoor: boolean;
  date: string;
  startDatetime: number;
  endDatetime: number;
  timezone: string;
  durationMinutes: number;
  paymentImage?: string;
  price?: string | null;
  currency?: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>("details");
  const [notes, setNotes] = useState("");
  const [customerContactMethod, setCustomerContactMethod] = useState(contactMethod);
  const formRef = useRef<HTMLFormElement>(null);

  const customerContactId = customerContactMethod === "email" ? email : customerContactMethod === "line" ? contactLineId : contactWhatsAppId;

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
      if (!price || !currency) return;
      setIsLoading(true);
      try {
        await createBooking(
          customerId,
          customerContactMethod,
          customerContactId,
          serviceId,
          serviceName,
          serviceType,
          serviceIndoor,
          price,
          currency,
          new Date(startDatetime),
          new Date(endDatetime),
          timezone,
          notes,
        );
        setCurrentStep("success");
      } finally {
        setIsLoading(false);
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
        return "Booking Requested";
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
        <Button
          variant="ghost"
          className={"bg-green-500 hover:bg-green-600 text-white"}
          onClick={() => setIsOpen(true)}
          // disabled={status === "confirmed" || status === "pending"}
        >
          BOOK
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
                  <Input value={`${date} ${format(toZonedTime(new Date(startDatetime), timezone), "HH:mm")} - ${durationMinutes} minutes`} disabled />
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
                  <Select value={customerContactMethod} onValueChange={setCustomerContactMethod} disabled={!contactLineId || !contactWhatsAppId}>
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
                <Label>Scan the QR code to complete your payment</Label>
                <div className="rounded-lg border">
                  <img src={paymentImage} alt="Payment QR Code" className="mx-auto" />
                </div>
              </div>
            )}

            {currentStep === "success" && (
              <div className="rounded-lg bg-orange-50 p-4 text-orange-800">
                <p className="font-medium">Please complete payment within 1 hour.</p>
                <p className="mt-2 text-sm">Booking is on hold until payment is confirmed.</p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <p className="text-sm text-gray-500">👉</p>
                  <Link href="https://line.me/R/ti/p/hottoshotto" target="_blank">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/LINE_logo.svg/320px-LINE_logo.svg.png" alt="Line" className="mx-auto h-16 w-16" />
                  </Link>
                  <img
                    src={
                      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6AQAAAACgl2eQAAACQ0lEQVR4Xu2YMY6EMAxFjSgoOUJuMnMxpIzExeAmHIEyBcL7v6PdhRlpW75WuEBDeAXxfH87mP8dk72vvMUN1LiBGjdQ4z8Bhkj2sOzluebFmnXgUpYCOvctlYe1bs8VTwAk91UMmGxIoHzp5tWIDgmUIFAit1P/StiKKoAUI8Ez9FAaZF4PCD0AsGLcRaCfgrkWwIolSGH4vXBJC4iwhtep96U8+p9VKeCVqFem2henPLCVLAWY9WOIwoyVH6kmKgWUBiqg0Ts9AKmmPCYxwJjgePfOqdenjwsuWkA3+8u6HXrAQl663d77pgAA5xyd787mPhjcFKLYxQC4PSYQ6zerEwj1UN1ACIgNUA/R4T08AOnXAuozDh9QQbugvDAwnQVzPYCRo2UpIdXs61hF0A2UAHoUpQpnYksPDwjLUgLijZFgo5ti+KCHlrNorwfg7BvtfTPf8cs4xMsBSHUUfct6oqXi12ngVACcG4jAmBkeiuY0HWc5DWDkcMSTWtwS3Q/NXQFg0bNlDsyycYg3nimzFBA3tHf29Za+GmdKLYCmlEK5PKmhw2NIPpeeAhDTxryy6Fd2oz4GEjEA54sQwOJMNSg7V5YCEBGNCFOn13yf+qYCwEJKsKeWorXwqHRKtQLAQxpaErLsLC9nls+znALAQy5UwHeHaHFrPFhmPSAsv9YYO1Q5Dpw6QJzUal/nEb05iFYC+P6ixQkJs+aDn7XqxxgdgH8/dzHyaJHZoTgwfZT/tcAfcQM1bqDGDdS4gRrTF5xgu06lOVW2AAAAAElFTkSuQmCC"
                    }
                    alt="Line Connect QR Code"
                    className="mx-auto max-w-[200px]"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 text-center">Click here to open Line App or scan QR code to contact booking center with payment confirmation.</p>
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
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Confirm Booking"
                    )}
                  </Button>
                </>
              )}
              {currentStep === "success" && (
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Ok
                  </Button>
                </DialogClose>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
