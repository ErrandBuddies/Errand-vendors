import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Check } from "lucide-react";
import AuthLayout from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PasswordStrengthIndicator } from "@/components/ui/PasswordStrengthIndicator";
import { authService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { STORAGE_KEYS, ROUTES } from "@/constants";
import { phoneCountryCodes } from "@/constants/countryCode";
// Function to sort country phone codes by their phone code value
function sortCountryPhoneCodesByCode(codes) {
  // Convert the object to an array of [key, value] pairs
  const entries = Object.entries(codes);

  // Sort the array based on the 'secondary' value (phone code)
  const sortedEntries = entries.sort((a, b) => {
    const codeA = a[1].secondary;
    const codeB = b[1].secondary;
    return codeA.localeCompare(codeB, undefined, { numeric: true });
  });

  // Convert the sorted array back to an object
  return Object.fromEntries(sortedEntries);
}

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      country_code: "+234",
    },
  });

  const password = watch("password", "");
  const confirmPassword = watch("confirm_password", "");
  const passwordsMatch = password === confirmPassword && confirmPassword !== "";

  const onSubmit = async (data) => {
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match",
      });
      return;
    }

    setLoading(true);
    try {
      let { agreement, ...restData } = data;
      const response = await authService.signup(restData);

      // Store email for OTP verification
      localStorage.setItem(STORAGE_KEYS.EMAIL, data.email);

      toast({
        variant: "success",
        title: "Success",
        description: response.message || "Account created successfully",
      });

      navigate(ROUTES.OTP);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create account",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-primary">Create Account</h1>
          <p className="text-sm text-muted-foreground">
            Join ErrandBuddies as a vendor
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="firstname">First Name</Label>
              <Input
                id="firstname"
                {...register("firstname", {
                  required: "First name is required",
                })}
                placeholder="John"
              />
              {errors.firstname && (
                <p className="text-xs text-red-500">
                  {errors.firstname.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastname">Last Name</Label>
              <Input
                id="lastname"
                {...register("lastname", { required: "Last name is required" })}
                placeholder="Doe"
              />
              {errors.lastname && (
                <p className="text-xs text-red-500">
                  {errors.lastname.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="country_code">Code</Label>
              <Controller
                name="country_code"
                control={control}
                rules={{ required: "Required" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="country_code">
                      <SelectValue placeholder="+234" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...new Set(Object.keys(phoneCountryCodes))].map(
                        (code, i) => (
                          <SelectItem
                            key={i + "code"}
                            value={phoneCountryCodes[code].secondary}
                          >
                            {phoneCountryCodes[code].secondary}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.country_code && (
                <p className="text-xs text-red-500">
                  {errors.country_code.message}
                </p>
              )}
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="phone_num">Phone Number</Label>
              <Input
                id="phone_num"
                {...register("phone_num", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Invalid phone number",
                  },
                })}
                placeholder="8081602424"
              />
              {errors.phone_num && (
                <p className="text-xs text-red-500">
                  {errors.phone_num.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password", { required: "Password is required" })}
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {password && <PasswordStrengthIndicator password={password} />}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm_password">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirm_password"
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirm_password", {
                  required: "Please confirm password",
                })}
                placeholder="Confirm password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {confirmPassword && (
              <div className="flex items-center gap-1 text-xs">
                {passwordsMatch ? (
                  <>
                    <Check className="w-3 h-3 text-green-500" />
                    <span className="text-green-600">Passwords match</span>
                  </>
                ) : (
                  <span className="text-red-500">Passwords do not match</span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="agreement"
              {...register("agreement", { required: true })}
              className="w-4 h-4"
            />
            <label
              htmlFor="agreement"
              className="text-xs text-muted-foreground"
            >
              I agree to the{" "}
              <Link
                className="text-primary font-medium hover:underline"
                to={ROUTES.TERMS_OF_SERVICE}
              >
                Terms and Conditions
              </Link>{" "}
              and{" "}
              <Link
                className="text-primary font-medium hover:underline"
                to={ROUTES.PRIVACY_POLICY}
              >
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.agreement && (
            <p className="text-xs text-red-500">You must agree to continue</p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">
            Already have an account?{" "}
          </span>
          <Link
            to={ROUTES.LOGIN}
            className="text-primary font-medium hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Signup;
