import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Loader2, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useBanksQuery,
  useInitiateWithdrawalMutation,
  useCompleteWithdrawalMutation,
} from "@/hooks/queries/useWallet";

export default function WithdrawalModal({ isOpen, onClose, balance }) {
  const [step, setStep] = useState(1);
  const [resolvedAccount, setResolvedAccount] = useState(null);
  const [openBankSelect, setOpenBankSelect] = useState(false);

  const { data: banksData, isLoading: isLoadingBanks } = useBanksQuery();
  const banks = banksData || [];
  console.log("bank result: ", banks)

  const initiateWithdrawalMutation = useInitiateWithdrawalMutation();
  const completeWithdrawalMutation = useCompleteWithdrawalMutation();

  const {
    register: registerInitiate,
    handleSubmit: handleSubmitInitiate,
    control: controlInitiate,
    formState: { errors: errorsInitiate },
    watch: watchInitiate,
  } = useForm();

  const {
    register: registerComplete,
    handleSubmit: handleSubmitComplete,
    formState: { errors: errorsComplete },
  } = useForm();

  const selectedBank = watchInitiate("bank_code");

  const onInitiate = async (data) => {
    try {
      const response = await initiateWithdrawalMutation.mutateAsync({
        bank_code: data.bank_code,
        account_number: data.account_number,
      });

      if (response && response.success) {
        setResolvedAccount(response.data);
        setStep(2);
      }
    } catch (error) {
       // handled by mutation onError
    }
  };

  const onComplete = async (data) => {
    if (!resolvedAccount) return;

    try {
      await completeWithdrawalMutation.mutateAsync({
        recipient_code: resolvedAccount.recipient_code,
        amount: data.amount,
      });
      onClose();
      // Reset state for next time
      setStep(1);
      setResolvedAccount(null);
    } catch (error) {
      // handled by mutation onError
    }
  };

  const handleClose = () => {
    setStep(1);
    setResolvedAccount(null);
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Select your bank and enter account number."
              : "Confirm details and enter amount."}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <form onSubmit={handleSubmitInitiate(onInitiate)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bank_code">Bank</Label>
              <Controller
                name="bank_code"
                control={controlInitiate}
                rules={{ required: "Please select a bank" }}
                render={({ field }) => (
                  <Popover open={openBankSelect} onOpenChange={setOpenBankSelect} modal={true}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openBankSelect}
                        className="w-full justify-between"
                      >
                        {field.value
                          ? banks.find((bank) => bank.code === field.value)?.name
                          : "Select bank..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                      <Command>
                        <CommandInput placeholder="Search bank..." />
                          <CommandList> 
                              <CommandEmpty>No bank found.</CommandEmpty>
                              {/* <CommandGroup> */}
                                {banks.map((bank, index) => (
                                  <CommandItem
                                    key={index}
                                    value={bank.name}
                                    onSelect={() => {
                                      field.onChange(bank.code);
                                      setOpenBankSelect(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === bank.code
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {bank.name}
                                  </CommandItem>
                                ))}
                            {/* </CommandGroup> */}
                          </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errorsInitiate.bank_code && (
                <p className="text-sm text-red-500">{errorsInitiate.bank_code.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="account_number">Account Number</Label>
              <Input
                id="account_number"
                placeholder="0123456789"
                {...registerInitiate("account_number", {
                  required: "Account number is required",
                  minLength: {
                    value: 10,
                    message: "Account number must be 10 digits",
                  },
                  maxLength: {
                    value: 10,
                    message: "Account number must be 10 digits",
                  },
                  pattern: {
                      value: /^[0-9]+$/,
                      message: "Account number must contain only numbers"
                  }
                })}
              />
              {errorsInitiate.account_number && (
                <p className="text-sm text-red-500">
                  {errorsInitiate.account_number.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={initiateWithdrawalMutation.isPending}
            >
              {initiateWithdrawalMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying Account...
                </>
              ) : (
                "Next"
              )}
            </Button>
          </form>
        )}

        {step === 2 && resolvedAccount && (
          <form onSubmit={handleSubmitComplete(onComplete)} className="space-y-6">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Account Name:</span>
                <span className="font-medium text-right">{resolvedAccount.account_name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Account Number:</span>
                <span className="font-medium">{resolvedAccount.account_number}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Bank:</span>
                <span className="font-medium">{resolvedAccount.bank_name}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₦)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                {...registerComplete("amount", {
                  required: "Amount is required",
                  min: {
                    value: 100,
                    message: "Minimum withdrawal is ₦100",
                  },
                  max: {
                      value: balance,
                      message: "Insufficient balance"
                  }
                })}
              />
              {errorsComplete.amount && (
                <p className="text-sm text-red-500">{errorsComplete.amount.message}</p>
              )}
              <p className="text-xs text-muted-foreground text-right">
                Available Balance: ₦{balance?.toLocaleString()}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={completeWithdrawalMutation.isPending}
              >
                {completeWithdrawalMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Withdrawal"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
