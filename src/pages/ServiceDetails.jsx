import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Briefcase,
  Upload,
  Trash2,
  Edit,
  Star,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { serviceService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { EditServiceDialog } from "@/components/EditServiceDialog";
import { imagePlaceholder } from "../constants";

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deletingImage, setDeletingImage] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  useEffect(() => {
    fetchServiceDetails();
    fetchServiceReviews();
  }, [id]);

  const fetchServiceDetails = async () => {
    setLoading(true);
    try {
      const response = await serviceService.getServices();
      const foundService = response.data?.find((s) => s._id === id);

      if (foundService) {
        setService(foundService);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Service not found",
        });
        navigate("/services");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch service details",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceReviews = async () => {
    setLoadingReviews(true);
    try {
      const response = await serviceService.getServiceReviews(id);
      setReviews(response.data || []);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      // Don't show error toast for reviews as it's not critical
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    const currentImageCount = service.images?.length || 0;
    if (currentImageCount + files.length > 5) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Maximum 5 images allowed. You can add ${
          5 - currentImageCount
        } more.`,
      });
      return;
    }

    setUploadingImage(true);
    try {
      await serviceService.uploadImages(service._id, files);
      toast({
        variant: "success",
        title: "Success",
        description: "Images uploaded successfully",
      });
      fetchServiceDetails();
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
      await serviceService.deleteImage(service._id, imageId);
      toast({
        variant: "success",
        title: "Success",
        description: "Image deleted successfully",
      });

      // If deleted image was selected, reset to first image
      if (selectedImage >= service.images.length - 1) {
        setSelectedImage(0);
      }

      fetchServiceDetails();
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

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading service...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return null;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/services")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Services
        </Button>
        <Button variant="outline" onClick={() => setShowEditDialog(true)}>
          <Edit className="w-4 h-4 mr-2" />
          Edit Service
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Images Section */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src={
                    service.images?.[selectedImage] ||
                    imagePlaceholder
                  }
                  alt={service.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = imagePlaceholder;
                  }}
                />
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-5 gap-2">
                {service.images?.map((image, index) => (
                  <div key={index} className="relative group">
                    <div
                      className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                        selectedImage === index
                          ? "border-primary"
                          : "border-transparent"
                      }`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img
                        src={image}
                        alt={`${service.name} ${index + 1}`}
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
                {(service.images?.length || 0) < 5 && (
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
                {service.images?.length || 0}/5 images
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Service Info */}
        <div className="space-y-4">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">
                    {service.name}
                  </CardTitle>
                  <div className="flex gap-2 flex-wrap mb-2">
                    <Badge variant="outline">{service.category}</Badge>
                    <Badge variant="outline">{service.sub_category}</Badge>
                    {service.availability !== false ? (
                      <Badge variant="default">Available</Badge>
                    ) : (
                      <Badge variant="destructive">Unavailable</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {renderStars(service.ratings?.rate || 0)}
                    <span className="text-sm text-muted-foreground">
                      ({service.ratings?.number || 0} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-3xl font-bold text-primary">
                  {service.currency} {service.price?.toLocaleString()}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-muted-foreground">{service.description}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-1">Contracts Completed</h4>
                <p className="text-lg text-green-600 font-semibold">
                  {service.contracts || 0}
                </p>
              </div>

              {service.tags && service.tags.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Tags</h4>
                  <div className="flex gap-2 flex-wrap">
                    {service.tags.map((tag, index) => (
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
                {service.location?.city}, {service.location?.state},{" "}
                {service.location?.country}
              </p>
            </CardContent>
          </Card>

          {/* Service Date */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Service Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <h4 className="font-semibold mb-1">Listed Since</h4>
                <p className="text-muted-foreground">
                  {service.createdAt
                    ? format(new Date(service.createdAt), "PPP")
                    : "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reviews Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Customer Reviews ({reviews.length})
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
                Reviews will appear here once customers rate your service
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

      {/* Edit Service Dialog */}
      <EditServiceDialog
        service={service}
        open={showEditDialog}
        onOpenChange={(open) => {
          setShowEditDialog(open);
        }}
        onSuccess={fetchServiceDetails}
      />
    </div>
  );
};

export default ServiceDetails;
