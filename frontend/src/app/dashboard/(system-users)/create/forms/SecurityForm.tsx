// forms/SecurityForm.tsx
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/form/Card'
import { Input } from '@/components/form/Input';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { CreateUserFormValues } from '../schema/userSchema';

export default function SecurityForm() {
  const { register, formState: { errors } } = useFormContext<CreateUserFormValues>();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-purple-600" />
            Security & Authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Password *
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Confirm Password *
              </label>
              <Input type={showPassword ? 'text' : 'password'} {...register('confirmPassword')} placeholder="Re-enter password" />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>
          <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
            Password must be at least 6 characters.
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}