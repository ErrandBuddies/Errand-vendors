import { Logo } from '@/components/ui/Logo';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="p-6">
        <Logo />
      </div>
      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
