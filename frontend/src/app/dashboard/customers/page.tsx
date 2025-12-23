// app/dashboard/customers/page.tsx
import CustomersContent from './CustomersContent';

export default function CustomersPage() {
  return <div className='h-screen'><CustomersContent /></div>;
}

export const metadata = {
  title: 'Customers | Dashboard',
  description: 'Manage your customer database',
};