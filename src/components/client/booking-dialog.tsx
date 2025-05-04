"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { createBooking } from "@/actions/bookings";

type Step = "details" | "payment" | "success";

export default function BookingDialog({
  email,
  venueName,
  serviceName,
  serviceId,
  serviceType,
  serviceIndoor,
  date,
  startDatetime,
  endDatetime,
  paymentImage,
  price,
  currency,
  status,
}: {
  email: string;
  venueName: string;
  serviceName: string;
  serviceId: string;
  serviceType: string;
  serviceIndoor: boolean;
  date: string;
  startDatetime: number;
  endDatetime: number;
  paymentImage?: string;
  price?: string | null;
  currency?: string | null;
  status: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>("details");
  const [notes, setNotes] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep === "details") {
      setCurrentStep("payment");
      return;
    }

    if (currentStep === "payment") {
      if (!price || !currency) return;
      setIsLoading(true);
      try {
        await createBooking(email, serviceId, serviceName, serviceType, serviceIndoor, price, currency, startDatetime, endDatetime, notes);
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
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "details":
        return `Book ${serviceName}`;
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
          className={`${status === "pending" ? "bg-orange-300" : status === "confirmed" ? "bg-red-300" : "bg-green-300 hover:bg-green-500"}`}
          onClick={() => setIsOpen(true)}
          disabled={status === "confirmed" || status === "pending"}
        >
          {serviceName}
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="bg-black/50" />
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{getStepTitle()}</DialogTitle>
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
                  <Input value={`${date} ${format(startDatetime, "HH:mm")} - ${format(endDatetime, "HH:mm")}`} disabled />
                </div>
                {price && currency && (
                  <div className="space-y-2">
                    <Label>Price</Label>
                    <Input value={`${price} ${currency}`} disabled />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="note">Note</Label>
                  <Textarea id="note" placeholder="Add name, Line Id to help with booking confirmation." value={notes} onChange={(e) => setNotes(e.target.value)} className="min-h-[100px]" />
                </div>
              </>
            )}

            {currentStep === "payment" && paymentImage && (
              <div className="space-y-2">
                <Label>QR Code</Label>
                <div className="rounded-lg border p-4">
                  <img src={paymentImage} alt="Payment QR Code" className="mx-auto max-w-[200px]" />
                </div>
                <p className="mt-2 text-sm text-gray-500 text-center">Scan the QR code to complete your payment</p>
              </div>
            )}

            {currentStep === "success" && (
              <div className="rounded-lg bg-orange-50 p-4 text-orange-800">
                <p className="font-medium">Please complete payment within 1 hour.</p>
                <p className="mt-2 text-sm">Booking is on hold until payment is confirmed.</p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/LINE_logo.svg/320px-LINE_logo.svg.png" alt="Line" className="mx-auto h-16 w-16" />
                  <img
                    src={
                      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6AQAAAACgl2eQAAACQ0lEQVR4Xu2YMY6EMAxFjSgoOUJuMnMxpIzExeAmHIEyBcL7v6PdhRlpW75WuEBDeAXxfH87mP8dk72vvMUN1LiBGjdQ4z8Bhkj2sOzluebFmnXgUpYCOvctlYe1bs8VTwAk91UMmGxIoHzp5tWIDgmUIFAit1P/StiKKoAUI8Ez9FAaZF4PCD0AsGLcRaCfgrkWwIolSGH4vXBJC4iwhtep96U8+p9VKeCVqFem2henPLCVLAWY9WOIwoyVH6kmKgWUBiqg0Ts9AKmmPCYxwJjgePfOqdenjwsuWkA3+8u6HXrAQl663d77pgAA5xyd787mPhjcFKLYxQC4PSYQ6zerEwj1UN1ACIgNUA/R4T08AOnXAuozDh9QQbugvDAwnQVzPYCRo2UpIdXs61hF0A2UAHoUpQpnYksPDwjLUgLijZFgo5ti+KCHlrNorwfg7BvtfTPf8cs4xMsBSHUUfct6oqXi12ngVACcG4jAmBkeiuY0HWc5DWDkcMSTWtwS3Q/NXQFg0bNlDsyycYg3nimzFBA3tHf29Za+GmdKLYCmlEK5PKmhw2NIPpeeAhDTxryy6Fd2oz4GEjEA54sQwOJMNSg7V5YCEBGNCFOn13yf+qYCwEJKsKeWorXwqHRKtQLAQxpaErLsLC9nls+znALAQy5UwHeHaHFrPFhmPSAsv9YYO1Q5Dpw6QJzUal/nEb05iFYC+P6ixQkJs+aDn7XqxxgdgH8/dzHyaJHZoTgwfZT/tcAfcQM1bqDGDdS4gRrTF5xgu06lOVW2AAAAAElFTkSuQmCC"
                    }
                    alt="Line Connect QR Code"
                    className="mx-auto max-w-[200px]"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 text-center">Contact booking center with payment confirmation.</p>
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
                  <Button type="submit">Request Booking</Button>
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
