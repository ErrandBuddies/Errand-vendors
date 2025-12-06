import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateServiceMutation } from "@/hooks/queries";
import { serviceCategories } from "@/constants/categories";
import { supportedAddresses } from '@/constants/addresses';

export function EditServiceDialog({ service, open, onOpenChange, onSuccess }) {
  const updateServiceMutation = useUpdateServiceMutation();

  const { register, handleSubmit, control, reset, watch } = useForm();

  const category = watch("category");
  const state = watch('state');
  
  const subcategories = category
    ? serviceCategories.find((c) => c.name === category)?.subcategories || []
    : [];

  const availableCities = state ? supportedAddresses[state] || [] : [];

  // Prefill form when service changes
  useEffect(() => {
    if (service) {
      reset({
        name: service.name,
        description: service.description,
        category: service.category,
        sub_category: service.sub_category,
        price: service.price,
        currency: service.currency,
        state: service.location?.state || "",
        city: service.location?.city || "",
        country: service.location?.country || "Nigeria",
        tags: service.tags?.join(", ") || "",
      });
    }
  }, [service, reset]);

  const onUpdateService = async (data) => {
    if (!service) return;

    // Parse array fields
    const payload = {
      ...data,
      tags: data.tags
        ? typeof data.tags === "string"
          ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : data.tags
        : [],
    };

    await updateServiceMutation.mutateAsync({ id: service._id, payload });
    onOpenChange(false);
    reset();
    onSuccess?.();
  };

  const handleCancel = () => {
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
          <DialogDescription>Update service details</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onUpdateService)} className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="edit-name">Service Name</Label>
              <Input
                id="edit-name"
                {...register("name")}
                placeholder="Enter service name"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                {...register("description")}
                rows={3}
                placeholder="Describe your service"
              />
            </div>

            <div>
              <Label htmlFor="edit-category">Category</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceCategories.map((cat) => (
                        <SelectItem key={cat.name} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <Label htmlFor="edit-sub_category">Subcategory</Label>
              <Controller
                name="sub_category"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!category}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {subcategories.map((sub) => (
                        <SelectItem key={sub} value={sub}>
                          {sub}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <Label htmlFor="edit-price">Price</Label>
              <Input
                id="edit-price"
                type="number"
                {...register("price")}
                placeholder="0.00"
              />
            </div>

            <div>
              <Label htmlFor="edit-currency">Currency</Label>
              <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NGN">NGN</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
              <Input
                id="edit-tags"
                {...register("tags")}
                placeholder="battery, replacement, automotive"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h4 className="font-semibold">Location</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-state">State</Label>
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(supportedAddresses).map((stateName) => (
                          <SelectItem key={stateName} value={stateName}>
                            {stateName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div>
                <Label htmlFor="edit-city">City</Label>
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!state}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="edit-country">Country</Label>
                <Input
                  id="edit-country"
                  {...register('country')}
                  value="Nigeria"
                  readOnly
                  disabled
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateServiceMutation.isPending}>
              {updateServiceMutation.isPending
                ? "Updating..."
                : "Update Service"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
