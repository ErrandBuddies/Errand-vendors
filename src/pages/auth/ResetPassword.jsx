import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Check, ArrowLeft } from 'lucide-react';
import AuthLayout from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordStrengthIndicator } from '@/components/ui/PasswordStrengthIndicator';
import { authService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { STORAGE_KEYS, ROUTES } from '@/constants';

const ResetPassword = () => {
  const [step, setStep] = useState(1); // 1: OTP, 2: New Password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [otpToken, setOtpToken] = useState(null);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password', '');
  const confirmPassword = watch('confirm_password', '');
  const passwordsMatch = password === confirmPassword && confirmPassword !== '';

  useEffect(() => {
    const storedEmail = localStorage.getItem(STORAGE_KEYS.EMAIL);
    if (!storedEmail) {
      navigate(ROUTES.FORGOT_PASSWORD);
      return;
    }
    setEmail(storedEmail);
  }, [navigate]);

  const onVerifyOTP = async (data) => {
    setLoading(true);
    try {
      const otpResponse = await authService.verifyOTP({
        type: 'email',
        email,
        otp: data.otp,
      });
      setOtpToken(otpResponse.data);
      toast({
        variant: 'success',
        title: 'Success',
        description: 'OTP verified successfully',
      });
      
      setStep(2);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Invalid OTP',
      });
    } finally {
      setLoading(false);
    }
  };

  const onResetPassword = async (data) => {
    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Passwords do not match',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await authService.completeResetPassword({
        type: 'email',
        // email,
        token: otpToken,
        // otp: data.otp,
        password: data.password,
        confirm_password: data.confirm_password,
      });
      
      localStorage.removeItem(STORAGE_KEYS.EMAIL);
      
      toast({
        variant: 'success',
        title: 'Success',
        description: response.message || 'Password reset successfully',
      });
      
      navigate(ROUTES.LOGIN);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to reset password',
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = step === 1 ? onVerifyOTP : onResetPassword;

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-primary">Reset Password</h1>
          {step === 1 ? (
            <p className="text-sm text-muted-foreground">
              Enter the verification code sent to your email <b>{email}</b>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Create your new password
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {step === 1 ? (
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                {...register('otp', {
                  required: 'OTP is required',
                  pattern: {
                    value: /^[0-9]{6}$/,
                    message: 'OTP must be 6 digits',
                  },
                })}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="text-center text-2xl tracking-widest"
              />
              {errors.otp && (
                <p className="text-xs text-red-500">{errors.otp.message}</p>
              )}
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', { required: 'Password is required' })}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {password && <PasswordStrengthIndicator password={password} />}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirm_password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirm_password', { required: 'Please confirm password' })}
                    placeholder="Confirm new password"
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
            </>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? step === 1
                ? 'Verifying...'
                : 'Resetting...'
              : step === 1
              ? 'Verify Code'
              : 'Reset Password'}
          </Button>
        </form>
        {/* back to login */}
        <Link to={ROUTES.LOGIN} className="flex items-center text-sm text-primary hover:underline">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Signin
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
