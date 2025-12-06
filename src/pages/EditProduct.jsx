import { useState } from "react";

const EditProduct = ({
  showEditDialog,
  setShowEditDialog,
  selectedProduct,
  setSelectedProduct,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const onUpdateProduct = async (data) => {
    if (!selectedProduct) return;

    // Parse array fields
    const payload = {
      ...data,
      colors: data.colors
        ? typeof data.colors === "string"
          ? data.colors.split(",").map((c) => c.trim())
          : data.colors
        : [],
      sizes: data.sizes
        ? typeof data.sizes === "string"
          ? data.sizes.split(",").map((s) => s.trim())
          : data.sizes
        : [],
      tags: data.tags
        ? typeof data.tags === "string"
          ? data.tags.split(",").map((t) => t.trim())
          : data.tags
        : [],
    };

    setSubmitting(true);
    try {
      await productService.updateProduct(selectedProduct._id, payload);
      toast({
        variant: "success",
        title: "Success",
        description: "Product updated successfully",
      });
      setShowEditDialog(false);
      setSelectedProduct(null);
      reset();
      fetchProducts();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update product",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>Update product details</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onUpdateProduct)} className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="edit-name">Product Name</Label>
              <Input
                id="edit-name"
                {...register("name")}
                placeholder="Enter product name"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="edit-desc">Description</Label>
              <Textarea
                id="edit-desc"
                {...register("desc")}
                rows={3}
                placeholder="Describe your product"
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
                      {categories.map((cat) => (
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

            <div>
              <Label htmlFor="edit-stock_type">Stock Type</Label>
              <Controller
                name="stock_type"
                control={control}
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
              <Label htmlFor="edit-stock">Stock Amount</Label>
              <Input
                id="edit-stock"
                type="number"
                {...register("amount_in_stock")}
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="edit-condition">Condition</Label>
              <Input
                id="edit-condition"
                {...register("condition")}
                placeholder="e.g., New, Used"
              />
            </div>

            <div>
              <Label htmlFor="edit-brand">Brand</Label>
              <Input
                id="edit-brand"
                {...register("brand")}
                placeholder="Enter brand name"
              />
            </div>

            <div>
              <Label htmlFor="edit-weight">Weight</Label>
              <Input
                id="edit-weight"
                type="number"
                {...register("weight")}
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="edit-discount_price">Discount Price</Label>
              <Input
                id="edit-discount_price"
                type="number"
                {...register("discount_price")}
                placeholder="0.00"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="edit-colors">Colors (comma-separated)</Label>
              <Input
                id="edit-colors"
                {...register("colors")}
                placeholder="red, blue, green"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="edit-sizes">Sizes (comma-separated)</Label>
              <Input
                id="edit-sizes"
                {...register("sizes")}
                placeholder="S, M, L, XL"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
              <Input
                id="edit-tags"
                {...register("tags")}
                placeholder="organic, fresh, local"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h4 className="font-semibold">Location</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-state">State</Label>
                <Input id="edit-state" {...register("state")} />
              </div>

              <div>
                <Label htmlFor="edit-city">City</Label>
                <Input id="edit-city" {...register("city")} />
              </div>

              <div>
                <Label htmlFor="edit-country">Country</Label>
                <Input id="edit-country" {...register("country")} />
              </div>

              <div>
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  {...register("address")}
                  placeholder="Street address"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowEditDialog(false);
                setSelectedProduct(null);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Updating..." : "Update Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default EditProduct;