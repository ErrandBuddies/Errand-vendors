import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { STORAGE_KEYS, ROUTES } from '@/constants';

const OTP = () => {
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const storedEmail = localStorage.getItem(STORAGE_KEYS.EMAIL);
    if (!storedEmail) {
      navigate(ROUTES.SIGNUP);
      return;
    }
    setEmail(storedEmail);
  }, [navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await authService.verifyEmail({
        email,
        otp: data.otp,
      });
      
      const token = response.headers?.token || localStorage.getItem('vendor_token');
      
      login(response.data, token);
      
      localStorage.removeItem(STORAGE_KEYS.EMAIL);
      
      toast({
        variant: 'success',
        title: 'Success',
        description: response.message || 'Email verified successfully',
      });
      
      navigate(ROUTES.DASHBOARD);
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

  const handleResendOTP = async () => {
    setResendLoading(true);
    try {
      await authService.resendOTP({
        type: 'email',
        email,
      });
      
      setCountdown(60);
      
      toast({
        variant: 'success',
        title: 'Success',
        description: 'OTP sent successfully',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to resend OTP',
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-primary">Verify Your Email</h1>
          <p className="text-sm text-muted-foreground">
            A verification code has been sent to{' '}
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Email'}
          </Button>
        </form>

        <div className="text-center space-y-3">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleResendOTP}
            disabled={countdown > 0 || resendLoading}
          >
            {countdown > 0
              ? `Resend code in ${countdown}s`
              : resendLoading
              ? 'Sending...'
              : 'Resend Code'}
          </Button>

          <Link
            to={ROUTES.SIGNUP}
            className="block text-sm text-primary hover:underline"
          >
            Back to Sign Up
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default OTP;
