import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Package,
  TrendingUp,
  Upload,
  Trash2,
  Edit,
  Star,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { productService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { EditProductDialog } from "@/components/EditProductDialog";
import { SponsorProductDialog } from "@/components/SponsorProductDialog";
import { imagePlaceholder } from "../constants";
import { toKg } from "../lib/utils";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deletingImage, setDeletingImage] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showSponsorDialog, setShowSponsorDialog] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    fetchProductDetails();
    fetchProductReviews();
  }, [id]);

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
              }`}
          />
        ))}
      </div>
    );
  };

  const fetchProductReviews = async () => {
    setLoadingReviews(true);
    try {
      const response = await productService.getProductReviews(id);
      setReviews(response.data || []);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      // Don't show error toast for reviews as it's not critical
    } finally {
      setLoadingReviews(false);
    }
  };

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const response = await productService.getProducts();
      const foundProduct = response.data?.find((p) => p._id === id);

      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Product not found",
        });
        navigate("/products");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch product details",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    const currentImageCount = product.images?.length || 0;
    if (currentImageCount + files.length > 5) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Maximum 5 images allowed. You can add ${5 - currentImageCount
          } more.`,
      });
      return;
    }

    setUploadingImage(true);
    try {
      await productService.uploadImages(product._id, files);
      toast({
        variant: "success",
        title: "Success",
        description: "Images uploaded successfully",
      });
      fetchProductDetails();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to upload images",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageDelete = async (imageUrl) => {
    // Extract image ID from Cloudinary URL
    const urlParts = imageUrl.split("/");
    const imageId = urlParts[urlParts.length - 1];

    setDeletingImage(imageUrl);
    try {
      await productService.deleteImage(product._id, imageId);
      toast({
        variant: "success",
        title: "Success",
        description: "Image deleted successfully",
      });

      // If deleted image was selected, reset to first image
      if (selectedImage >= product.images.length - 1) {
        setSelectedImage(0);
      }

      fetchProductDetails();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete image",
      });
    } finally {
      setDeletingImage(null);
    }
  };

  const getSponsorshipStatus = () => {
    if (!product?.sponsored || !product?.sponsorship) return "none";

    const now = new Date();
    const startDate = new Date(product.sponsorship.startDate);
    const endDate = product.sponsorship.endDate
      ? new Date(product.sponsorship.endDate)
      : null;

    if (now < startDate) return "scheduled";
    if (endDate && now > endDate) return "expired";
    if (product.sponsorship.status === "active") return "active";

    return "none";
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const sponsorshipStatus = getSponsorshipStatus();
  const isSponsored = sponsorshipStatus !== "none";

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/products")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>
        <span>
          <Button variant="outline" onClick={() => setShowEditDialog(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Product
          </Button>

          <Button variant="outline" onClick={() => setShowSponsorDialog(true)}>
            <TrendingUp className="w-4 h-4 mr-2" />
            Sponsor Product
          </Button>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Images Section */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src={product.images?.[selectedImage] || imagePlaceholder}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = imagePlaceholder;
                  }}
                />
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-5 gap-2">
                {product.images?.map((image, index) => (
                  <div key={index} className="relative group">
                    <div
                      className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${selectedImage === index
                        ? "border-primary"
                        : "border-transparent"
                        }`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => handleImageDelete(image)}
                      disabled={deletingImage === image}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {/* Upload Button */}
                {(product.images?.length || 0) < 5 && (
                  <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                    />
                    {uploadingImage ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    ) : (
                      <Upload className="w-6 h-6 text-gray-400" />
                    )}
                  </label>
                )}
              </div>

              <p className="text-xs text-muted-foreground mt-2 text-center">
                {product.images?.length || 0}/5 images
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">
                    {product.name}
                  </CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline">{product.category}</Badge>
                    <Badge variant="outline">{product.sub_category}</Badge>
                    {product.condition && (
                      <Badge variant="secondary">{product.condition}</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-3xl font-bold text-primary">
                  {product.currency} {product.price?.toLocaleString()}
                </p>
                {product.slashed_price &&
                  product.slashed_price !== product.price && (
                    <p className="text-lg text-muted-foreground line-through">
                      {product.currency}{" "}
                      {product.slashed_price?.toLocaleString()}
                    </p>
                  )}
              </div>

              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">{product.desc}</p>
              </div>

              {product.brand && (
                <div>
                  <h4 className="font-semibold mb-1">Brand</h4>
                  <p className="text-muted-foreground">{product.brand}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-1">Stock</h4>
                  <p
                    className={`text-lg ${product.amount_in_stock < 10
                      ? "text-red-600"
                      : "text-green-600"
                      }`}
                  >
                    {product.amount_in_stock}{" "}
                    {product.stock_type?.[0] || "units"}
                  </p>
                </div>

                {product.weight && (
                  <div>
                    <h4 className="font-semibold mb-1">Weight</h4>
                    <p className="text-muted-foreground">{toKg(product.weight)}kg</p>
                  </div>
                )}
              </div>

              {product.colors && product.colors.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Colors</h4>
                  <div className="flex gap-2 flex-wrap">
                    {product.colors.map((color, index) => (
                      <Badge key={index} variant="outline">
                        {color}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Sizes</h4>
                  <div className="flex gap-2 flex-wrap">
                    {product.sizes.map((size, index) => (
                      <Badge key={index} variant="outline">
                        {size}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {product.tags && product.tags.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Tags</h4>
                  <div className="flex gap-2 flex-wrap">
                    {product.tags.map((tag, index) => (
                      <Badge key={index}>{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {product.location?.address && `${product.location.address}, `}
                {product.location?.city}, {product.location?.state},{" "}
                {product.location?.country}
              </p>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {product.sales || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Sales</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {product.carts || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">In Carts</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {product.favourites || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Favourites</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sponsorship Details */}
      {isSponsored && product.sponsorship && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Sponsorship Details
              <Badge
                variant={
                  sponsorshipStatus === "active"
                    ? "default"
                    : sponsorshipStatus === "scheduled"
                      ? "secondary"
                      : "outline"
                }
              >
                {sponsorshipStatus}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <h4 className="font-semibold mb-1">Type</h4>
                <Badge variant="outline" className="capitalize">
                  {product.sponsorship.type}
                </Badge>
              </div>

              {product.sponsorship.type === "pay-per-click" && (
                <>
                  <div>
                    <h4 className="font-semibold mb-1">Clicks</h4>
                    <p className="text-lg font-bold">{product.clicks || 0}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Budget</h4>
                    <p className="text-muted-foreground">
                      {product.sponsorship.amount}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Remaining</h4>
                    <p className="text-green-600 font-semibold">
                      {product.sponsorship.available}
                    </p>
                  </div>
                </>
              )}

              {product.sponsorship.type === "featured" &&
                product.sponsorship.featuredPrice > 0 && (
                  <div>
                    <h4 className="font-semibold mb-1">Featured Price</h4>
                    <p className="text-lg font-bold">
                      {product.sponsorship.featuredPrice}
                    </p>
                  </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Start Date
                </h4>
                <p className="text-muted-foreground">
                  {format(new Date(product.sponsorship.startDate), "PPP p")}
                </p>
              </div>

              {product.sponsorship.endDate && (
                <div>
                  <h4 className="font-semibold mb-1 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    End Date
                  </h4>
                  <p className="text-muted-foreground">
                    {format(new Date(product.sponsorship.endDate), "PPP p")}
                  </p>
                </div>
              )}
            </div>

            {product.sponsorship.caption && (
              <div>
                <h4 className="font-semibold mb-1">Caption</h4>
                <p className="text-muted-foreground">
                  {product.sponsorship.caption}
                </p>
              </div>
            )}

            {product.sponsorship.banner && (
              <div>
                <h4 className="font-semibold mb-2">Sponsorship Banner</h4>
                <img
                  src={product.sponsorship.banner}
                  alt="Sponsorship banner"
                  className="w-full max-w-md rounded-lg border"
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Reviews Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Customer Reviews{" "}
            {product.ratings?.rate && product.ratings?.number ? (
              <span className="text-base font-normal">
                ({product.ratings.rate} / 5 from {product.ratings.number}{" "}
                ratings)
              </span>
            ) : (
              `(${reviews.length})`
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingReviews ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">
                Loading reviews...
              </p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8">
              <Star className="w-12 h-12 mx-auto text-gray-300 mb-2" />
              <p className="text-muted-foreground">No reviews yet</p>
              <p className="text-sm text-muted-foreground">
                Reviews will appear here once customers rate your Product
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="border-b last:border-b-0 pb-4 last:pb-0"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <h5 className="font-semibold">
                            {review.userId?.firstname} {review.userId?.lastname}
                          </h5>
                          <p className="text-xs text-muted-foreground">
                            {review.createdAt
                              ? format(new Date(review.createdAt), "PPP")
                              : ""}
                          </p>
                        </div>
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {review.review}
                      </p>
                      {review.images && review.images.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {review.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`Review ${idx + 1}`}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Product Dialog */}
      <EditProductDialog
        product={product}
        open={showEditDialog}
        onOpenChange={(open) => {
          setShowEditDialog(open);
        }}
        onSuccess={fetchProductDetails}
      />

      {/* Sponsor Product Dialog */}
      <SponsorProductDialog
        product={product}
        open={showSponsorDialog}
        onOpenChange={(open) => {
          setShowSponsorDialog(open);
          if (!open) fetchProductDetails(); // Refresh details on close (e.g. after success)
        }}
      />
    </div>
  );
};

export default ProductDetails;
