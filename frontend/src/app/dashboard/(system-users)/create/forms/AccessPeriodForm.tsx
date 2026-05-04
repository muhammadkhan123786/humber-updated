// forms/AccessPeriodForm.tsx
import { useFormContext, useWatch } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/form/Card';
import { Input } from '@/components/form/Input';
import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { CreateUserFormValues } from '../schema/userSchema';

export default function AccessPeriodForm() {
  const { register, control, formState: { errors } } = useFormContext<CreateUserFormValues>();
  const hasAccessPeriod = useWatch({ control, name: 'hasAccessPeriod' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-amber-600" />
            Access Period (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="hasAccessPeriod"
              {...register('hasAccessPeriod')}
              className="rounded border-gray-300"
            />
            <label htmlFor="hasAccessPeriod" className="text-sm text-gray-700">
              Set time-limited access for this user
            </label>
          </div>

          {hasAccessPeriod && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Start Date *
                </label>
                <Input type="date" {...register('startDate')} />
                {errors.startDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.startDate.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  End Date *
                </label>
                <Input type="date" {...register('endDate')} />
                {errors.endDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.endDate.message}</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}