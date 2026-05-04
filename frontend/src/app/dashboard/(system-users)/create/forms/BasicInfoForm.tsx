// forms/BasicInfoForm.tsx
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/form/Card';
import { Input } from '@/components/form/Input';
import { User, Mail, Phone, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { CreateUserFormValues } from '../types';

export default function BasicInfoForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateUserFormValues>();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-indigo-600" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Full Name *
              </label>
              <Input {...register('fullName')} placeholder="John Doe" />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Username *
              </label>
              <Input {...register('username')} placeholder="johndoe" />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address *
              </label>
              <Input {...register('email')} type="email" placeholder="john.doe@company.com" />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </label>
              <Input {...register('phone')} placeholder="+1 234 567 8900" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Department
            </label>
            <Input {...register('department')} placeholder="e.g., Operations, Technical" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}