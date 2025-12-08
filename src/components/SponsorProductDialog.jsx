import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Check,
  CreditCard,
  Wallet,
  Loader2,
  Calendar as CalendarIcon,
} from "lucide-react";
import { format } from "date-fns";
import {
  useSponsorshipPlansQuery,
  useInitiateSponsorshipMutation,
  useCompleteSponsorshipMutation,
} from "@/hooks/queries";
import { paystackPayment } from "@/lib/paystack";
import { useAuth } from "@/hooks/useAuth";
import ImageUpload from "@/components/ImageUpload";

const STEPS = {
  PLAN_SELECTION: 0,
  DETAILS_FORM: 1,
  CONFIRMATION: 2,
};

export function SponsorProductDialog({ product, open, onOpenChange }) {
  const { user } = useAuth();
  const [step, setStep] = useState(STEPS.PLAN_SELECTION);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [initiationData, setInitiationData] = useState(null);

  // Queries & Mutations
  const { data: plans = [], isLoading: isLoadingPlans } =
    useSponsorshipPlansQuery();
  const initiateMutation = useInitiateSponsorshipMutation();
  const completeMutation = useCompleteSponsorshipMutation();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: "",
      featuredPrice: "",
      startDate: "",
      caption: "",
      images: [],
    },
  });

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setStep(STEPS.PLAN_SELECTION);
      setSelectedPlan(null);
      setInitiationData(null);
      reset();
    }
  }, [open, reset]);

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setStep(STEPS.DETAILS_FORM);
    // Set default featured price if applicable
    if (plan.name === "featured") {
      setValue("featuredPrice", plan.price);
    }
  };

  const onInitiateSponsorship = async (data) => {
    if (!product || !selectedPlan) return;

    try {
      console.log(data, data.images[0]);
      const payload = {
        productId: product._id,
        sponsorType: selectedPlan.name,
        amount: Number(data.amount),
      };
      if (data.images.length) payload.images = data.images?.[0];
      if (data.caption) payload.caption = data.caption;

      if (selectedPlan.name === "featured") {
        payload.featuredPrice = Number(data.featuredPrice);
        payload.startDate = data.startDate;
      }

      const response = await initiateMutation.mutateAsync(payload);
      setInitiationData(response.data);
      setStep(STEPS.CONFIRMATION);
    } catch (error) {
      console.error("Initiation failed:", error);
    }
  };

  const handlePayment = async () => {
    if (!initiationData) return;

    const { payment, _id: sponsorId } = initiationData;

    // Helper to complete transaction
    const completeTransaction = async (reference) => {
      try {
        await completeMutation.mutateAsync({
          sponsorId,
          reference,
        });
        onOpenChange(false);
      } catch (error) {
        console.error("Completion failed:", error);
      }
    };

    // Wallet Payment
    if (payment.means === "wallet" ) {
      await completeTransaction(payment.reference);
    }
    // Online Payment (Paystack)
    else if (payment.means === "online" || payment.means === "hybrid") {
      try {
        await paystackPayment({
          accessCode: payment.online.accessCode,
          onSuccess: () => {
            completeTransaction(payment.reference);
          },
          onClose: () => {
            // Handle modal close if needed
          },
        });
      } catch (error) {
        console.error("Paystack error:", error);
      }
    }
  };

  const renderPlanSelection = () => (
    <div className="space-y-4">
      {isLoadingPlans ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => handlePlanSelect(plan)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-bold capitalize">
                  {plan.name.replace(/-/g, " ")}
                </CardTitle>
                <div className="font-bold text-primary">
                  {product?.currency} {plan.price} / {plan.cost}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{plan.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderDetailsForm = () => (
    <form onSubmit={handleSubmit(onInitiateSponsorship)} className="space-y-4">
      <div className="bg-muted p-4 rounded-lg mb-4">
        <h4 className="font-semibold capitalize mb-1">
          {selectedPlan?.name.replace(/-/g, " ")} Plan
        </h4>
        <p className="text-sm text-muted-foreground">
          {selectedPlan?.description}
        </p>
      </div>

      <div className="grid gap-4">
        {selectedPlan?.name === "featured" ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Duration (Days)</Label>
                <Input
                  type="number"
                  {...register("amount", {
                    required: "Duration is required",
                    min: 1,
                  })}
                  placeholder="e.g. 7"
                />
                {errors.amount && (
                  <span className="text-xs text-red-500">
                    {errors.amount.message}
                  </span>
                )}
              </div>
              <div>
                <Label>Featured Price</Label>
                <Input
                  type="number"
                  {...register("featuredPrice", {
                    required: "Price is required",
                  })}
                  readOnly
                />
              </div>
            </div>

            <div>
              <Label>Start Date</Label>
              <Input
                type="datetime-local"
                {...register("startDate", {
                  required: "Start date is required",
                })}
                min={new Date().toISOString().slice(0, 16)}
              />
              {errors.startDate && (
                <span className="text-xs text-red-500">
                  {errors.startDate.message}
                </span>
              )}
            </div>
          </>
        ) : (
          <div>
            <Label>Number of Clicks</Label>
            <Input
              type="number"
              {...register("amount", {
                required: "Number of clicks is required",
                min: 10,
              })}
              placeholder="e.g. 100"
            />
            {errors.amount && (
              <span className="text-xs text-red-500">
                {errors.amount.message}
              </span>
            )}
          </div>
        )}

        <div>
          <Label>Caption (Optional)</Label>
          <Textarea
            {...register("caption")}
            placeholder="Promotional text for your sponsorship..."
          />
        </div>

        <div>
          <Label>Banner Image (Optional)</Label>
          <Controller
            name="images"
            control={control}
            render={({ field }) => (
              <ImageUpload
                images={field.value || []}
                onChange={field.onChange}
                max={1}
              />
            )}
          />
        </div>
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep(STEPS.PLAN_SELECTION)}
        >
          Back
        </Button>
        <Button type="submit" disabled={initiateMutation.isPending}>
          {initiateMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Continue to Payment"
          )}
        </Button>
      </DialogFooter>
    </form>
  );

  const renderConfirmation = () => {
    if (!initiationData) return null;
    const { sponsorshipDetails, payment } = initiationData;

    return (
      <div className="space-y-6">
        <div className="bg-primary/5 p-6 rounded-lg text-center">
          <h3 className="text-lg font-semibold mb-2">Total Amount</h3>
          <div className="text-3xl font-bold text-primary">
            {product?.currency} {sponsorshipDetails.amount?.toLocaleString()}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Plan Type</span>
            <span className="font-medium capitalize">
              {sponsorshipDetails.type}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {sponsorshipDetails.type === "per click"
                ? "Total Clicks"
                : "Duration"}
            </span>
            <span className="font-medium">
              {sponsorshipDetails.total}{" "}
              {sponsorshipDetails.type === "per click" ? "clicks" : "days"}
            </span>
          </div>
          {sponsorshipDetails.startDate && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Start Date</span>
              <span className="font-medium">
                {format(new Date(sponsorshipDetails.startDate), "PPP p")}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-start gap-2 p-4 border rounded-lg">
          {payment.means === "wallet" ? (
            <Wallet className="h-5 w-5 text-primary mt-1" />
          ) : (
            <CreditCard className="h-5 w-5 text-primary mt-1" />
          )}
          <div className="flex-1">
            <div className="font-medium">
              Pay via{" "}
              {payment.means === "wallet"
                ? "Wallet"
                : payment.means === "hybrid"
                ? "Wallet + Paystack"
                : "Paystack"}
            </div>
            
            {payment.means === "wallet" && (
              <div className="space-y-1 mt-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Current Balance
                  </span>
                  <span className="font-semibold text-primary">
                    {product?.currency}{" "}
                    {payment.wallet.previousBalance?.toLocaleString()}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Balance will be deducted automatically.
                </div>
              </div>
            )}

            {payment.means === "hybrid" && (
              <div className="space-y-2 mt-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Wallet Balance</span>
                  <span className="font-medium">
                    - {product?.currency}{" "}
                    {payment.wallet.previousBalance?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm border-t pt-2">
                  <span className="text-muted-foreground">Remaining to Pay</span>
                  <span className="font-bold text-primary">
                    {product?.currency}{" "}
                    {payment.online.amountPaid?.toLocaleString()}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Your wallet balance will be exhausted, and the remaining amount will be paid via Paystack.
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep(STEPS.DETAILS_FORM)}
          >
            Back
          </Button>
          <Button onClick={handlePayment} disabled={completeMutation.isPending}>
            {completeMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay ${
                product?.currency
              } ${(payment.means === "hybrid" 
                ? payment.online.amountPaid 
                : sponsorshipDetails.amount
              )?.toLocaleString()}`
            )}
          </Button>
        </DialogFooter>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === STEPS.PLAN_SELECTION && "Select Sponsorship Plan"}
            {step === STEPS.DETAILS_FORM && "Sponsorship Details"}
            {step === STEPS.CONFIRMATION && "Confirm Sponsorship"}
          </DialogTitle>
          <DialogDescription>
            {step === STEPS.PLAN_SELECTION &&
              "Choose a plan to boost your product visibility"}
            {step === STEPS.DETAILS_FORM &&
              "Customize your sponsorship campaign"}
            {step === STEPS.CONFIRMATION &&
              "Review details and complete payment"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {step === STEPS.PLAN_SELECTION && renderPlanSelection()}
          {step === STEPS.DETAILS_FORM && renderDetailsForm()}
          {step === STEPS.CONFIRMATION && renderConfirmation()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
