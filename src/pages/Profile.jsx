import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  User as UserIcon,
  MapPin,
  Shield,
  LogOut,
  Edit,
  Save,
  Wallet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";
import { verificationCountryCodes } from "../constants/countryCode";
import { supportedAddresses } from '../constants/addresses';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useVendorProfileQuery,
  useUpdateProfileMutation,
  useUpdateAddressMutation,
  useVerifyProfileMutation,
  useWalletBalanceQuery,
} from "@/hooks/queries";
import WithdrawalModal from "@/components/Wallet/WithdrawalModal";

const Profile = () => {
  // React Query hooks
  const {
    data: profileData,
    isLoading: isProfileLoading,
    refetch: refetchProfile,
  } = useVendorProfileQuery();
  
  const { data: walletData } = useWalletBalanceQuery();
  const walletBalance = walletData?.balance || 0;
  const withdrawableAmount = walletData?.withdrawable || 0;

  const navigate = useNavigate();
  const location = useLocation();
  const initialTab = location.state?.tab || "personal";
  const formData = location.state?.formData || {};
  const updateProfileMutation = useUpdateProfileMutation();
  const updateAddressMutation = useUpdateAddressMutation();
  const verifyProfileMutation = useVerifyProfileMutation();

  // Local state
  const [activeTab, setActiveTab] = useState(initialTab);
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [verificationImage, setVerificationImage] = useState(null);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);

  const { user, logout, updateUser } = useAuth();
  const { toast } = useToast();

  const {
    register: registerPersonal,
    handleSubmit: handleSubmitPersonal,
    reset: resetPersonal,
    formState: { errors: errorsPersonal },
  } = useForm();

  const {
    register: registerAddress,
    handleSubmit: handleSubmitAddress,
    reset: resetAddress,
    formState: { errors: errorsAddress },
    control: controlAddress,
    watch: watchAddress,
  } = useForm();

  const {
    register: registerVerification,
    handleSubmit: handleSubmitVerification,
    control: controlVerification,
    formState: { errors: errorsVerification },
  } = useForm();

  // Update auth context when profile data changes
  useEffect(() => {
    if (profileData && !isProfileLoading) {
      updateUser(profileData);

      // Prefill forms with profile data
      resetPersonal({
        firstname: profileData.firstname || "",
        lastname: profileData.lastname || "",
        occupation: profileData.occupation || "",
        business_name: profileData.business_name || "",
        business_location: profileData.business_location || "",
        business_description: profileData.business_description || "",
      });

      resetAddress({
        address: profileData.address || "",
        city: profileData.city || "",
        state: profileData.state || "",
        country: profileData.country || "Nigeria",
      });
    }
  }, [profileData, isProfileLoading]);

  const profileState = watchAddress('state');  
  const availableCitiesForProfile = profileState ? supportedAddresses[profileState] || [] : [];

  const onUpdatePersonal = async (data) => {
    let restData = data;
    if (user?.accredited) {
      delete restData.firstname;
      delete restData.lastname;
    }

    const response = await updateProfileMutation.mutateAsync(restData);
    if (response?.data) {
      updateUser(response.data);
    }
    setEditingPersonal(false);
    refetchProfile();
  };

  const onUpdateAddress = async (data) => {
    const response = await updateAddressMutation.mutateAsync(data);
    if (response?.data) {
      updateUser(response.data);
    }
    setEditingAddress(false);
    refetchProfile();
  };

  const onVerifyProfile = async (data) => {
    if (!verificationImage) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload a verification image",
      });
      return;
    }

    const payload = {
      ...data,
      image: verificationImage,
    };

    const response = await verifyProfileMutation.mutateAsync(payload);
    if (response?.data) {
      updateUser(response.data);
    }
    if (formData) {
      navigate(ROUTES.PRODUCTS, {state: {productFormData: formData}});
    }
    refetchProfile();
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate(ROUTES.LOGIN);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to logout",
      });
    }
  };

  if (isProfileLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
                {user?.firstname?.charAt(0)}
                {user?.lastname?.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {user?.firstname} {user?.lastname}
                </h2>
                <p className="text-muted-foreground">{user?.email}</p>
                <div className="flex gap-2 mt-2">
                  {user?.accredited ? (
                    <Badge variant="default" className="bg-green-600">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline">Not Verified</Badge>
                  )}
                </div>
              </div>
            </div>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "personal"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("personal")}
        >
          <UserIcon className="w-4 h-4 inline-block mr-2" />
          Personal Info
        </button>
        <button
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "address"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("address")}
        >
          <MapPin className="w-4 h-4 inline-block mr-2" />
          Address
        </button>
        <button
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "verification"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("verification")}
        >
          <Shield className="w-4 h-4 inline-block mr-2" />
          Verification
        </button>
        <button
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "wallet"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("wallet")}
        >
          <Wallet className="w-4 h-4 inline-block mr-2" />
          Wallet
        </button>
      </div>

      {/* Personal Info Tab */}
      {activeTab === "personal" && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Personal Information</CardTitle>
              {/* {!user?.accredited && ( */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditingPersonal(!editingPersonal)}
              >
                {editingPersonal ? (
                  "Cancel"
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </>
                )}
              </Button>
              {/* )} */}
            </div>
            {user?.accredited && (
              <p className="text-sm text-muted-foreground">
                Name fields cannot be edited after verification
              </p>
            )}
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmitPersonal(onUpdatePersonal)}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstname">First Name</Label>
                  <Input
                    id="firstname"
                    {...registerPersonal("firstname")}
                    disabled={!editingPersonal || user?.accredited}
                  />
                </div>

                <div>
                  <Label htmlFor="lastname">Last Name</Label>
                  <Input
                    id="lastname"
                    {...registerPersonal("lastname")}
                    disabled={!editingPersonal || user?.accredited}
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    {...registerPersonal("occupation")}
                    disabled={!editingPersonal}
                    placeholder="e.g., Software Developer"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="business_name">Business Name</Label>
                  <Input
                    id="business_name"
                    {...registerPersonal("business_name")}
                    disabled={!editingPersonal}
                    placeholder="Your business name"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="business_location">Business Location</Label>
                  <Input
                    id="business_location"
                    {...registerPersonal("business_location")}
                    disabled={!editingPersonal}
                    placeholder="e.g., Lagos"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="business_description">
                    Business Description
                  </Label>
                  <Textarea
                    id="business_description"
                    {...registerPersonal("business_description")}
                    disabled={!editingPersonal}
                    placeholder="Describe your business"
                    rows={3}
                  />
                </div>
              </div>

              {editingPersonal && (
                <Button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updateProfileMutation.isPending
                    ? "Saving..."
                    : "Save Changes"}
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      )}

      {/* Address Tab */}
      {activeTab === "address" && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Address Information</CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditingAddress(!editingAddress)}
              >
                {editingAddress ? (
                  "Cancel"
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmitAddress(onUpdateAddress)}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    {...registerAddress("address")}
                    disabled={!editingAddress}
                    placeholder="Enter street address"
                  />
                </div>

                <div>
                  <Label htmlFor="state">State</Label>
                  <Controller
                    name="state"
                    control={controlAddress}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!editingAddress}
                      >
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
                  <Label htmlFor="city">City</Label>
                  <Controller
                    name="city"
                    control={controlAddress}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!editingAddress || !profileState}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableCitiesForProfile.map((city) => (
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
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    {...registerAddress('country', { value: "Nigeria" })}
                    // disabled
                    value="Nigeria"
                    readOnly
                    placeholder="Nigeria"
                  />
                </div>
              </div>

              {editingAddress && (
                <Button
                  type="submit"
                  disabled={updateAddressMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updateAddressMutation.isPending
                    ? "Saving..."
                    : "Save Address"}
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      )}

      {/* Verification Tab */}
      {activeTab === "verification" && (
        <Card>
          <CardHeader>
            <CardTitle>Profile Verification</CardTitle>
            <p className="text-sm text-muted-foreground">
              {user?.accredited
                ? "Your profile is verified"
                : "Verify your profile to start adding products"}
            </p>
          </CardHeader>
          <CardContent>
            {user?.accredited ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Profile Verified</h3>
                <p className="text-muted-foreground">
                  Your profile has been successfully verified
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmitVerification(onVerifyProfile)}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="id_num">ID Number *</Label>
                    <Input
                      id="id_num"
                      {...registerVerification("id_num", {
                        required: "ID number is required",
                      })}
                      placeholder="Enter your ID number"
                    />
                    {errorsVerification.id_num && (
                      <p className="text-xs text-red-500 mt-1">
                        {errorsVerification.id_num.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="country_code">Country Code *</Label>
                    <Controller
                      name="country_code"
                      control={controlVerification}
                      rules={{ required: "Country code is required" }}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger id="country_code">
                            <SelectValue placeholder="Select your country code" />
                          </SelectTrigger>
                          <SelectContent>
                            {verificationCountryCodes.map((code) => (
                              <SelectItem key={code} value={code}>
                                {code}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errorsVerification.country_code && (
                      <p className="text-xs text-red-500 mt-1">
                        {errorsVerification.country_code.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="dob">Date of Birth *</Label>
                    <Input
                      id="dob"
                      type="date"
                      {...registerVerification("dob", {
                        required: "Date of birth is required",
                      })}
                    />
                    {errorsVerification.dob && (
                      <p className="text-xs text-red-500 mt-1">
                        {errorsVerification.dob.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="image">Verification Image *</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setVerificationImage(e.target.files[0])}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Upload a clear image of yourself
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={verifyProfileMutation.isPending}
                >
                  {verifyProfileMutation.isPending
                    ? "Submitting..."
                    : "Submit Verification"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      )}

      {/* Wallet Tab */}
      {activeTab === "wallet" && (
        <Card>
          <CardHeader>
            <CardTitle>Wallet</CardTitle>
            <CardDescription>Manage your funds and withdrawals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₦{walletBalance.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card className="bg-green-500/5 border-green-500/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Withdrawable Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">₦{withdrawableAmount.toLocaleString()}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end">
                <Button 
                    onClick={() => setIsWithdrawalModalOpen(true)} 
                    disabled={withdrawableAmount < 100}
                >
                    Withdraw Funds
                </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <WithdrawalModal 
        isOpen={isWithdrawalModalOpen} 
        onClose={() => setIsWithdrawalModalOpen(false)} 
        balance={withdrawableAmount}
      />

      {/* Quick Info */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Phone</p>
              <p className="font-medium">
                {user?.country_code} {user?.phone_num}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Wallet Balance</p>
              <p className="font-medium text-green-600">
                ₦{user?.wallet?.toLocaleString() || "0.00"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Account Status</p>
              <p className="font-medium">
                {user?.accredited ? (
                  <span className="text-green-600">Verified</span>
                ) : (
                  <span className="text-orange-600">Pending Verification</span>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
