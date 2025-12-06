import { useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import ServiceCard from "@/components/ServiceCard";
import ImageUpload from "@/components/ImageUpload";
import { EditServiceDialog } from "@/components/EditServiceDialog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { serviceCategories } from '@/constants/categories';
import { supportedAddresses } from '@/constants/addresses';
import {
  useServicesQuery,
  useCreateServiceMutation,
  useDeleteServiceMutation,
} from "@/hooks/queries";
import Loader from "../components/ui/Loader";

const Services = () => {
  // React Query hooks
  const { data: services = [], isLoading, isError, error } = useServicesQuery();
  const createServiceMutation = useCreateServiceMutation();
  const deleteServiceMutation = useDeleteServiceMutation();

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [useVendorAddress, setUseVendorAddress] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const category = watch("category");
  const images = watch("images") || [];
  const addState = watch('state');

  const availableCitiesForAdd = addState ? supportedAddresses[addState] || [] : [];

  // Filter services based on search query
  const filteredServices = useMemo(() => {
    if (searchQuery.trim() === "") {
      return services;
    }
    return services.filter(
      (service) =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, services]);

  useEffect(() => {
    // Update subcategories when category changes
    if (category) {
      const cat = serviceCategories.find((c) => c.name === category);
      setSubcategories(cat?.subcategories || []);
    } else {
      setSubcategories([]);
    }
  }, [category]);

  useEffect(() => {
    // Prefill location from vendor address
    if (useVendorAddress && user) {
      setValue("state", user.state || "");
      setValue("city", user.city || "");
      setValue("country", user.country || "Nigeria");
    } else if (!useVendorAddress) {
      setValue("state", "");
      setValue("city", "");
      setValue("country", "Nigeria");
    }
  }, [useVendorAddress, user, setValue]);

  const onAddService = async (data) => {
    // Check if vendor is accredited
    if (!user?.accredited) {
      toast({
        variant: "destructive",
        title: "Verification Required",
        description:
          "You must verify your profile before adding services. Please go to your profile page.",
        action: (
          <Button
            variant="outline"
            onClick={() => navigate("/profile", {state: {tab: "verification", formData: getValues()}})}
          >
            Verify Now
          </Button>
        ),
      });
      return;
    }

    // Parse array fields from comma-separated strings
    const payload = {
      ...data,
      tags: data.tags
        ? data.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      images: images,
    };

    await createServiceMutation.mutateAsync(payload);
    setShowAddDialog(false);
    reset();
    setValue("images", []);
  };

  const onDeleteService = async () => {
    if (!selectedService) return;

    await deleteServiceMutation.mutateAsync({ id: selectedService._id });
    setShowDeleteDialog(false);
    setSelectedService(null);
  };

  const handleView = (service) => {
    navigate(`/services/${service._id}`);
  };

  const handleEdit = (service) => {
    setSelectedService(service);
    setShowEditDialog(true);
  };

  const handleDelete = (service) => {
    setSelectedService(service);
    setShowDeleteDialog(true);
  };

  // Show error state
  if (isError) {
    toast({
      variant: "destructive",
      title: "Error",
      description: error?.message || "Failed to fetch services",
    });
  }

  if (isLoading) {
    return <Loader text="Loading services..." />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with Search and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <Briefcase className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? "No services found" : "No services yet"}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery
                  ? "Try adjusting your search query"
                  : "Start by adding your first service"}
              </p>
              {!searchQuery && (
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Service
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service._id}
              service={service}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Add Service Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new service to your offerings
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onAddService)} className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Service Name *</Label>
                <Input
                  id="name"
                  {...register("name", {
                    required: "Service name is required",
                  })}
                  placeholder="Enter service name"
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  {...register("description", { required: "Description is required" })}
                  placeholder="Describe your service"
                  rows={3}
                />
                {errors.description && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: "Category is required" }}
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
                {errors.category && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="sub_category">Subcategory *</Label>
                <Controller
                  name="sub_category"
                  control={control}
                  rules={{ required: "Subcategory is required" }}
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
                {errors.sub_category && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.sub_category.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  {...register("price", {
                    required: "Price is required",
                    min: 1,
                  })}
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="currency">Currency *</Label>
                <Controller
                  name="currency"
                  control={control}
                  defaultValue="NGN"
                  rules={{ required: "Currency is required" }}
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
                {errors.currency && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.currency.message}
                  </p>
                )}
              </div>

              <div className="col-span-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  {...register("tags")}
                  placeholder="battery, replacement, automotive"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="useVendorAddress"
                  checked={useVendorAddress}
                  onChange={(e) => setUseVendorAddress(e.target.checked)}
                />
                <Label htmlFor="useVendorAddress" className="cursor-pointer">
                  Use my business address
                </Label>
              </div>
              <h4 className="font-semibold">Location</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Controller
                    name="state"
                    control={control}
                    rules={{ required: 'State is required' }}
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
                  {errors.state && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.state.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="city">City *</Label>
                  <Controller
                    name="city"
                    control={control}
                    rules={{ required: 'City is required' }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!addState}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableCitiesForAdd.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.city && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.city.message}
                    </p>
                  )}
                </div>

                <div className="col-span-2">
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    {...register('country', {
                      required: 'Country is required',
                    })}
                    value="Nigeria"
                    readOnly
                    disabled
                  />
                  {errors.country && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.country.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Images */}
            <div>
              <Label>Service Images * (Max 5)</Label>
              <Controller
                name="images"
                control={control}
                rules={{ required: "At least one image is required" }}
                render={({ field }) => (
                  <ImageUpload
                    images={field.value || []}
                    onChange={field.onChange}
                    max={5}
                  />
                )}
              />
              {errors.images && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.images.message}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddDialog(false);
                  reset();
                  setValue("images", []);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createServiceMutation.isPending}>
                {createServiceMutation.isPending ? "Adding..." : "Add Service"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Service Dialog */}
      <EditServiceDialog
        service={selectedService}
        open={showEditDialog}
        onOpenChange={(open) => {
          setShowEditDialog(open);
          if (!open) setSelectedService(null);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Service</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedService?.name}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setSelectedService(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onDeleteService}
              disabled={deleteServiceMutation.isPending}
            >
              {deleteServiceMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Services;
