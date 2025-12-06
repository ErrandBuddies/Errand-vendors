import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { STORAGE_KEYS, ROUTES } from '@/constants';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await authService.initiateResetPassword({
        type: 'email',
        email: data.email,
      });
      
      // Store email for reset password page
      localStorage.setItem(STORAGE_KEYS.EMAIL, data.email);
      
      toast({
        variant: 'success',
        title: 'Success',
        description: response.message || 'Reset password OTP sent to your email',
      });
      
      navigate(ROUTES.RESET_PASSWORD);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to send reset code',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-primary">Forgot Password?</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to receive a reset code
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Code'}
          </Button>
        </form>

        <div className="text-center space-y-2 text-sm">
          <Link to={ROUTES.LOGIN} className="block text-primary hover:underline">
            Back to Sign In
          </Link>
          <div>
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link to={ROUTES.SIGNUP} className="text-primary font-medium hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
