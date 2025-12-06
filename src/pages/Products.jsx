import { useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, Plus, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import ProductCard from "@/components/ProductCard";
import ImageUpload from "@/components/ImageUpload";
import { EditProductDialog } from "@/components/EditProductDialog";
import { SponsorProductDialog } from "@/components/SponsorProductDialog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { productCategories } from '@/constants/categories';
import { supportedAddresses } from '@/constants/addresses';
import {
  useProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from "@/hooks/queries";
import Loader from "../components/ui/Loader";

const Products = () => {
  // React Query hooks
  const { data: products = [], isLoading, isError, error } = useProductsQuery();
  const createProductMutation = useCreateProductMutation();
  const deleteProductMutation = useDeleteProductMutation();
  

  // Local state
  const location = useLocation();
  const productFormData = location.state?.productFormData || {};
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showSponsorDialog, setShowSponsorDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
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

  useEffect(() => {
    console.log(productFormData);
    if (Object.keys(productFormData).length > 0) {
      setShowAddDialog(true);
      reset(productFormData);
    }
  }, []);

  const category = watch("category");
  const images = watch("images") || [];
  const addState = watch('state');

  const availableCitiesForAdd = addState ? supportedAddresses[addState] || [] : [];

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (searchQuery.trim() === "") {
      return products;
    }
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, products]);

  useEffect(() => {
    // Update subcategories when category changes
    if (category) {
      const cat = productCategories.find((c) => c.name === category);
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
      setValue("country", user.country || "");
      setValue("address", user.address || "");
    } else if (!useVendorAddress) {
      setValue("state", "");
      setValue("city", "");
      setValue("country", "Nigeria");
      setValue("address", "");
    }
  }, [useVendorAddress, user, setValue]);

  const onAddProduct = async (data) => {
    // Check if vendor is accredited
    if (!user?.accredited) {
      toast({
        variant: "destructive",
        title: "Verification Required",
        description:
          "You must verify your profile before adding products. Please go to your profile page.",
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
      colors: data.colors
        ? data.colors
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean)
        : [],
      sizes: data.sizes
        ? data.sizes
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      tags: data.tags
        ? data.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      images: images,
    };

    await createProductMutation.mutateAsync(payload);
    setShowAddDialog(false);
    reset();
    setValue("images", []);
  };

  const onDeleteProduct = async () => {
    if (!selectedProduct) return;

    await deleteProductMutation.mutateAsync({ id: selectedProduct._id });
    setShowDeleteDialog(false);
    setSelectedProduct(null);
  };

  const handleView = (product) => {
    navigate(`/products/${product._id}`);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowEditDialog(true);
  };

  const handleSponsor = (product) => {
    setSelectedProduct(product);
    setShowSponsorDialog(true);
  };

  const handleDelete = (product) => {
    if (product.sponsored) {
      toast({
        title: "Warning",
        description:
          "This product has active sponsorship. Are you sure you want to delete it?",
      });
    }
    setSelectedProduct(product);
    setShowDeleteDialog(true);
  };

  // Show error state
  if (isError) {
    toast({
      variant: "destructive",
      title: "Error",
      description: error?.message || "Failed to fetch products",
    });
  }

  if (isLoading) {
    return <Loader text="Loading products..." />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with Search and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? "No products found" : "No products yet"}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery
                  ? "Try adjusting your search query"
                  : "Start by adding your first product"}
              </p>
              {!searchQuery && (
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onView={(p) => navigate(`/products/${p._id}`)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSponsor={handleSponsor}
            />
          ))}
        </div>
      )}

      {/* Add Product Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new product to your inventory
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onAddProduct)} className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  {...register("name", {
                    required: "Product name is required",
                  })}
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="col-span-2">
                <Label htmlFor="desc">Description *</Label>
                <Textarea
                  id="desc"
                  {...register("desc", { required: "Description is required" })}
                  placeholder="Describe your product"
                  rows={3}
                />
                {errors.desc && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.desc.message}
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
                        {productCategories.map((cat) => (
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

              <div>
                <Label htmlFor="stock_type">Stock Type *</Label>
                <Controller
                  name="stock_type"
                  control={control}
                  defaultValue="unit"
                  rules={{ required: "Stock type is required" }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select stock type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unit">Unit</SelectItem>
                        <SelectItem value="bulk">Bulk</SelectItem>
                        <SelectItem value="kg">Kilogram (kg)</SelectItem>
                        <SelectItem value="g">Gram (g)</SelectItem>
                        <SelectItem value="l">Liter (l)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div>
                <Label htmlFor="amount_in_stock">Stock Amount *</Label>
                <Input
                  id="amount_in_stock"
                  type="number"
                  {...register("amount_in_stock", {
                    required: "Stock amount is required",
                    min: 0,
                  })}
                  placeholder="0"
                />
                {errors.amount_in_stock && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.amount_in_stock.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="condition">Condition *</Label>
                <Input
                  id="condition"
                  {...register("condition", {
                    required: "Condition is required",
                  })}
                  placeholder="e.g., New, Used, Refurbished"
                />
                {errors.condition && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.condition.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  {...register("brand")}
                  placeholder="Enter brand name"
                />
              </div>

              <div>
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  type="number"
                  {...register("weight")}
                  placeholder="0"
                />
              </div>

              {/* <div>
                <Label htmlFor="discount_price">Discount Price</Label>
                <Input id="discount_price" type="number" {...register('discount_price')} placeholder="0.00" />
              </div> */}

              <div className="col-span-2">
                <Label htmlFor="colors">Colors (comma-separated)</Label>
                <Input
                  id="colors"
                  {...register("colors")}
                  placeholder="red, blue, green"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="sizes">Sizes (comma-separated)</Label>
                <Input
                  id="sizes"
                  {...register("sizes")}
                  placeholder="S, M, L, XL"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  {...register("tags")}
                  placeholder="organic, fresh, local"
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

                <div>
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

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    {...register('address')}
                    placeholder="Street address"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div>
              <Label>Product Images * (Max 5)</Label>
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
              <Button type="submit" disabled={createProductMutation.isPending}>
                {createProductMutation.isPending ? "Adding..." : "Add Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <EditProductDialog
        product={selectedProduct}
        open={showEditDialog}
        onOpenChange={(open) => {
          setShowEditDialog(open);
          if (!open) setSelectedProduct(null);
        }}
      />

      {/* Sponsor Product Dialog */}
      <SponsorProductDialog
        product={selectedProduct}
        open={showSponsorDialog}
        onOpenChange={(open) => {
          setShowSponsorDialog(open);
          if (!open) setSelectedProduct(null);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedProduct?.name}"? This
              action cannot be undone.
              {selectedProduct?.sponsored && (
                <p className="mt-2 font-semibold text-orange-600">
                  Warning: This product has active sponsorship!
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setSelectedProduct(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onDeleteProduct}
              disabled={deleteProductMutation.isPending}
            >
              {deleteProductMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
