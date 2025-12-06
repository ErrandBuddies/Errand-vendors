import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const PasswordStrengthIndicator = ({ password }) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const strength = Object.values(checks).filter(Boolean).length;

  const getStrengthText = () => {
    if (strength === 0) return { text: 'Very Weak', color: 'text-gray-400' };
    if (strength <= 2) return { text: 'Weak', color: 'text-red-500' };
    if (strength === 3) return { text: 'Fair', color: 'text-yellow-500' };
    if (strength === 4) return { text: 'Good', color: 'text-blue-500' };
    return { text: 'Strong', color: 'text-green-500' };
  };

  const { text, color } = getStrengthText();

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-gray-200">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-300",
              strength === 0 && "w-0",
              strength === 1 && "w-1/5 bg-red-500",
              strength === 2 && "w-2/5 bg-red-500",
              strength === 3 && "w-3/5 bg-yellow-500",
              strength === 4 && "w-4/5 bg-blue-500",
              strength === 5 && "w-full bg-green-500"
            )}
          />
        </div>
        <span className={cn("text-xs font-medium", color)}>{text}</span>
      </div>

      <div className="grid grid-cols-2 gap-1.5 text-xs">
        <div className="flex items-center gap-1">
          {checks.length ? (
            <Check className="w-3 h-3 text-green-500" />
          ) : (
            <X className="w-3 h-3 text-gray-300" />
          )}
          <span className={checks.length ? 'text-green-600' : 'text-gray-400'}>
            At least 8 characters
          </span>
        </div>
        <div className="flex items-center gap-1">
          {checks.uppercase ? (
            <Check className="w-3 h-3 text-green-500" />
          ) : (
            <X className="w-3 h-3 text-gray-300" />
          )}
          <span className={checks.uppercase ? 'text-green-600' : 'text-gray-400'}>
            Uppercase letter
          </span>
        </div>
        <div className="flex items-center gap-1">
          {checks.lowercase ? (
            <Check className="w-3 h-3 text-green-500" />
          ) : (
            <X className="w-3 h-3 text-gray-300" />
          )}
          <span className={checks.lowercase ? 'text-green-600' : 'text-gray-400'}>
            Lowercase letter
          </span>
        </div>
        <div className="flex items-center gap-1">
          {checks.number ? (
            <Check className="w-3 h-3 text-green-500" />
          ) : (
            <X className="w-3 h-3 text-gray-300" />
          )}
          <span className={checks.number ? 'text-green-600' : 'text-gray-400'}>
            Number
          </span>
        </div>
        <div className="flex items-center gap-1">
          {checks.special ? (
            <Check className="w-3 h-3 text-green-500" />
          ) : (
            <X className="w-3 h-3 text-gray-300" />
          )}
          <span className={checks.special ? 'text-green-600' : 'text-gray-400'}>
            Special character
          </span>
        </div>
      </div>
    </div>
  );
};

export { PasswordStrengthIndicator };
