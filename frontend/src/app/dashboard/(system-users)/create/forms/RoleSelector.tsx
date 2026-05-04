// forms/RoleSelector.tsx
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/form/Card';
import { Shield, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion'
import { ROLES } from '../types';
import { CreateUserFormValues } from '../schema/userSchema';
export default function RoleSelector() {
  const { setValue, watch, formState: { errors } } = useFormContext<CreateUserFormValues>();
  const selectedRole = watch('role');

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm sticky top-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-5 w-5 text-indigo-600" />
            Assign Role *
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {ROLES.map((role) => {
            const isSelected = selectedRole === role.id;
            const colorClasses: Record<string, string> = {
              indigo: 'border-indigo-500 bg-indigo-50',
              blue: 'border-blue-500 bg-blue-50',
              green: 'border-green-500 bg-green-50',
              amber: 'border-amber-500 bg-amber-50',
            };
            const selectedBorder = colorClasses[role.color];
            const defaultBorder = `border-gray-200 hover:border-${role.color}-300 hover:bg-${role.color}-50/50`;

            return (
              <div
                key={role.id}
                onClick={() => setValue('role', role.id, { shouldValidate: true })}
                className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  isSelected ? selectedBorder : defaultBorder
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-sm">{role.name}</h4>
                  {isSelected && <CheckCircle className="h-4 w-4 text-indigo-500" />}
                </div>
                <p className="text-xs text-gray-600">{role.description}</p>
              </div>
            );
          })}
          {errors.role && (
            <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>
          )}
        </CardContent>
      </Card>
      <div className="text-xs text-gray-400 text-center p-2 mt-2">
        Roles define system permissions and access levels.
      </div>
    </motion.div>
  );
}