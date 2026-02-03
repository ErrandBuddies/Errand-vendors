import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useSocket } from "@/hooks/useSocket";
import ServiceSelectionModal from "./ServiceSelectionModal";
import PaymentModal from "./PaymentModal";
import { useServicesQuery } from "@/hooks/queries/useServices";

const ContractService = ({ conversation, contract }) => {
  const { socket } = useSocket();
  const { toast } = useToast();
  const { data: services = [] } = useServicesQuery();

  const [currentContract, setCurrentContract] = useState(contract || null);
  const [selectedStage, setSelectedStage] = useState("");
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const recipientId = conversation?.counterpartDetails?._id;

  // Update contract when prop changes
  useEffect(() => {
    if (contract) {
      setCurrentContract(contract);
      setSelectedStage(contract.stage || "");
    }
  }, [contract]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Listen for negotiation confirmation
    const handleNegotiationConfirm = (response) => {
      if (response.success) {
        setCurrentContract(response.contract);
        setSelectedStage(response.contract.stage);
        toast({
          title: "Success",
          description: response.message,
        });
      } else {
        toast({
          title: "Negotiation Declined",
          description: response.message,
          variant: "destructive",
        });
      }
    };

    // Listen for payment completion
    const handlePaymentComplete = (response) => {
      if (response.success) {
        setCurrentContract(response.contract);
        setSelectedStage(response.contract.stage);
        toast({
          title: "Success",
          description: response.message,
        });
      } else {
        toast({
          title: "Payment Declined",
          description: response.message,
          variant: "destructive",
        });
      }
    };

    // Listen for contract completion
    const handleContractComplete = (response) => {
      if (response.success) {
        setCurrentContract(response.contract);
        setSelectedStage(response.contract.stage);
        toast({
          title: "Success",
          description: response.message,
        });
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
      }
    };

    // Listen for contract termination
    const handleContractTerminate = (response) => {
      if (response.success) {
        setCurrentContract(response.contract);
        setSelectedStage(response.contract.stage);
        toast({
          title: "Success",
          description: response.message,
        });
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
      }
    };

    const handleEventResponse = ({ success, message }) => {
      if (!success) {
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      }
    };

    // Register socket listeners
    socket.on("service-confirm-negotiation", handleNegotiationConfirm);
    socket.on("service-complete-payment", handlePaymentComplete);
    socket.on("service-complete-contract", handleContractComplete);
    socket.on("service-terminate-contract", handleContractTerminate);
    socket.on("service-initiate-payment", handleEventResponse);

    // Cleanup
    return () => {
      socket.off("service-confirm-negotiation", handleNegotiationConfirm);
      socket.off("service-complete-payment", handlePaymentComplete);
      socket.off("service-complete-contract", handleContractComplete);
      socket.off("service-terminate-contract", handleContractTerminate);
    };
  }, [socket, toast]);

  const handleStageChange = async (newStage) => {
    if (!currentContract) {
      // Start negotiation flow
      if (newStage === "negotiation") {
        setShowServiceModal(true);
        setSelectedStage(newStage);
        return;
      }
      return;
    }

    switch (newStage) {
      case "payment":
        if (currentContract.stage === "negotiation") {
          setShowPaymentModal(true);
        }
        break;
      case "completed":
        if (
          currentContract.stage === "in_progress" &&
          currentContract.paymentStatus === "paid"
        ) {
          await completeContract();
          setSelectedStage(newStage);
        }
        break;
      case "cancelled":
        if (currentContract.paymentStatus !== "paid") {
          await terminateContract();
          setSelectedStage(newStage);
        }
        break;
      default:
        break;
    }
  };

  const startNegotiation = async (serviceId, serviceName) => {
    if (!socket || !recipientId) return;

    setIsLoading(true);
    try {
      socket.emit("service-negotiation-start", {
        serviceId,
        recipientID: recipientId,
        name: serviceName,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to start negotiation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setShowServiceModal(false);
    }
  };

  const initiatePayment = async (amount, duration) => {
    if (!socket || !currentContract) return;

    setIsLoading(true);
    try {
      socket.emit("service-initiate-payment", {
        contractId: currentContract._id,
        price: amount,
        duration,
      });
    } catch {
      setSelectedStage("negotiation");
      toast({
        title: "Error",
        description: "Failed to initiate payment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setShowPaymentModal(false);
    }
  };

  const completeContract = async () => {
    if (!socket || !currentContract) return;

    setIsLoading(true);
    try {
      socket.emit("service-complete-contract", {
        contractId: currentContract._id,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to complete contract",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const terminateContract = async () => {
    if (!socket || !currentContract || !recipientId) return;

    setIsLoading(true);
    try {
      socket.emit("service-terminate-contract", {
        contractId: currentContract._id,
        recipientID: recipientId,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to terminate contract",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStageOptions = () => {
    const baseOptions = [
      { value: "negotiation", label: "Negotiation", disabled: false },
      { value: "payment", label: "Payment", disabled: false },
      {
        value: "in_progress",
        label: "In Progress",
        disabled: false,
        hidden: true,
      },
      { value: "completed", label: "Completed", disabled: false },
      {
        value: "cancelled",
        label: "Terminate",
        disabled: currentContract?.paymentStatus === "paid",
      },
    ];

    if (!currentContract) {
      return [baseOptions[0]];
    }
    const currentStageIndex = baseOptions.findIndex(
      ({ value }) => value === currentContract?.stage
    );
    return baseOptions.map((option, index) => {
      console.log("the current Stage: ", currentStageIndex);
      if (index > currentStageIndex) {
        return option;
      }
      return { ...option, disabled: true };
    });
  };

  const getStageBadge = (stage) => {
    const variants = {
      initiated: "secondary",
      negotiation: "default",
      payment: "secondary",
      completed: "success",
      cancelled: "destructive",
    };

    const labels = {
      initiated: "Initiated",
      negotiation: "Negotiation",
      payment: "Payment",
      completed: "Completed",
      cancelled: "Cancelled",
    };

    return (
      <Badge variant={variants[stage] || "secondary"}>
        {labels[stage] || stage}
      </Badge>
    );
  };

  return (
    <>
      <Card className="">
        <div className="flex items-center justify-end">
          {/* <div className="flex items-center gap-3">
            <h3 className="font-medium text-sm">Contract Status</h3>
            {currentContract && getStageBadge(currentContract.stage)}
            {currentContract?.paymentStatus === "paid" && (
              <Badge variant="default">Paid</Badge>
            )}
            {currentContract?.paymentStatus === "pending" && (
              <Badge variant="outline">Pending Payment</Badge>
            )}
          </div> */}

          <div className="flex items-center justify-end gap-2">
            <Select value={selectedStage} onValueChange={handleStageChange}>
              <SelectTrigger className="w-40">
                <SelectValue
                  defaultValue={`${
                    currentContract && getStageBadge(currentContract.stage)
                  }
                  `}
                  placeholder="Initiate Contract"
                />
              </SelectTrigger>
              <SelectContent>
                {getStageOptions().map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <ServiceSelectionModal
        isOpen={showServiceModal}
        onClose={() => setShowServiceModal(false)}
        services={services}
        onSelectService={startNegotiation}
        isLoading={isLoading}
      />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSubmit={initiatePayment}
        isLoading={isLoading}
        defaultCurrency={currentContract?.currency || "NGN"}
      />
    </>
  );
};

export default ContractService;
