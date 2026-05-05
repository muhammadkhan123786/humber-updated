import { Request, Response } from "express";
import { buildQueryOptions } from "../../utils/queryHelper";

// ---------- Mock data (static) ----------
const deliveryData = [
  { id: 'DEL-001', date: '2024-01-15', customer: 'TechCorp', status: 'Delivered', amount: 1250, driver: 'John Doe', region: 'North' },
  { id: 'DEL-002', date: '2024-01-16', customer: 'MediGroup', status: 'In Transit', amount: 850, driver: 'Jane Smith', region: 'South' },
  { id: 'DEL-003', date: '2024-01-17', customer: 'RetailHub', status: 'Pending', amount: 2100, driver: 'Mike Johnson', region: 'East' },
  { id: 'DEL-004', date: '2024-01-18', customer: 'LogiStar', status: 'Delivered', amount: 3200, driver: 'Sarah Wilson', region: 'West' },
  { id: 'DEL-005', date: '2024-01-19', customer: 'FoodChain', status: 'Delivered', amount: 980, driver: 'John Doe', region: 'North' },
];

const callLogData = [
  { id: 'CALL-001', date: '2024-01-15', agent: 'Alice Brown', duration: 12.5, customer: 'TechCorp', issue: 'Technical', satisfaction: 4.5 },
  { id: 'CALL-002', date: '2024-01-16', agent: 'Bob White', duration: 8.2, customer: 'MediGroup', issue: 'Billing', satisfaction: 3.8 },
  { id: 'CALL-003', date: '2024-01-17', agent: 'Carol Black', duration: 15.3, customer: 'RetailHub', issue: 'Support', satisfaction: 4.9 },
  { id: 'CALL-004', date: '2024-01-18', agent: 'Alice Brown', duration: 5.7, customer: 'LogiStar', issue: 'General', satisfaction: 4.2 },
  { id: 'CALL-005', date: '2024-01-19', agent: 'Bob White', duration: 22.1, customer: 'FoodChain', issue: 'Technical', satisfaction: 3.5 },
];

const customerData = [
  { id: 'CUST-001', name: 'TechCorp', email: 'contact@techcorp.com', totalOrders: 45, lifetimeValue: 125000, lastOrder: '2024-01-15', segment: 'Enterprise' },
  { id: 'CUST-002', name: 'MediGroup', email: 'info@medigroup.com', totalOrders: 28, lifetimeValue: 78000, lastOrder: '2024-01-14', segment: 'Business' },
  { id: 'CUST-003', name: 'RetailHub', email: 'support@retailhub.com', totalOrders: 92, lifetimeValue: 234000, lastOrder: '2024-01-16', segment: 'Enterprise' },
  { id: 'CUST-004', name: 'LogiStar', email: 'sales@logistar.com', totalOrders: 15, lifetimeValue: 42000, lastOrder: '2024-01-12', segment: 'SMB' },
  { id: 'CUST-005', name: 'FoodChain', email: 'orders@foodchain.com', totalOrders: 63, lifetimeValue: 187000, lastOrder: '2024-01-17', segment: 'Enterprise' },
];

const technicianData = [
  { id: 'TECH-001', name: 'John Tech', completedJobs: 145, rating: 4.8, responseTime: 2.5, satisfaction: 98, region: 'North' },
  { id: 'TECH-002', name: 'Maria Garcia', completedJobs: 128, rating: 4.9, responseTime: 1.8, satisfaction: 99, region: 'South' },
  { id: 'TECH-003', name: 'David Kim', completedJobs: 97, rating: 4.6, responseTime: 3.2, satisfaction: 94, region: 'East' },
  { id: 'TECH-004', name: 'Sarah Lee', completedJobs: 156, rating: 4.9, responseTime: 1.9, satisfaction: 97, region: 'West' },
  { id: 'TECH-005', name: 'Mike Ross', completedJobs: 112, rating: 4.7, responseTime: 2.8, satisfaction: 96, region: 'North' },
];

const serviceData = [
  { id: 'SRV-001', date: '2024-01-15', type: 'Maintenance', cost: 450, customer: 'TechCorp', satisfaction: 4.8, technician: 'John Tech' },
  { id: 'SRV-002', date: '2024-01-16', type: 'Repair', cost: 890, customer: 'MediGroup', satisfaction: 4.5, technician: 'Maria Garcia' },
  { id: 'SRV-003', date: '2024-01-17', type: 'Installation', cost: 1250, customer: 'RetailHub', satisfaction: 4.9, technician: 'David Kim' },
  { id: 'SRV-004', date: '2024-01-18', type: 'Maintenance', cost: 380, customer: 'LogiStar', satisfaction: 4.7, technician: 'Sarah Lee' },
  { id: 'SRV-005', date: '2024-01-19', type: 'Repair', cost: 670, customer: 'FoodChain', satisfaction: 4.6, technician: 'Mike Ross' },
];

const salesData = [
  { id: 'SALE-001', date: '2024-01-15', product: 'Laptop Pro', quantity: 25, revenue: 37500, region: 'North', salesperson: 'Emma' },
  { id: 'SALE-002', date: '2024-01-16', product: 'Mouse Wireless', quantity: 150, revenue: 4500, region: 'South', salesperson: 'Liam' },
  { id: 'SALE-003', date: '2024-01-17', product: 'Monitor 27"', quantity: 45, revenue: 18000, region: 'East', salesperson: 'Olivia' },
  { id: 'SALE-004', date: '2024-01-18', product: 'Keyboard Mech', quantity: 80, revenue: 6400, region: 'West', salesperson: 'Noah' },
  { id: 'SALE-005', date: '2024-01-19', product: 'Laptop Pro', quantity: 30, revenue: 45000, region: 'North', salesperson: 'Emma' },
];

// ---------- Helper to apply search and filter ----------
const applyFiltersToArray = <T extends Record<string, any>>(
  data: T[],
  search: string,
  columnFilters: Record<string, string>,
  searchableFields: string[]
): T[] => {
  let filtered = [...data];
  if (search) {
    const lowerSearch = search.toLowerCase();
    filtered = filtered.filter(row =>
      searchableFields.some(field =>
        String(row[field]).toLowerCase().includes(lowerSearch)
      )
    );
  }
  Object.entries(columnFilters).forEach(([field, value]) => {
    if (value) {
      const lowerValue = value.toLowerCase();
      filtered = filtered.filter(row =>
        String(row[field]).toLowerCase().includes(lowerValue)
      );
    }
  });
  return filtered;
};

// ---------- Delivery Summary ----------
export const getDeliverySummaryReport = async (req: Request, res: Response) => {
  try {
    const options = buildQueryOptions(req);
    const searchableFields = ['id', 'customer', 'driver', 'status', 'region'];
    const filtered = applyFiltersToArray(deliveryData, options.search, options.columnFilters, searchableFields);
    const total = filtered.length;
    const paginated = filtered.slice(options.skip, options.skip + options.limit);
    // KPIs
    const totalAmount = filtered.reduce((sum, d) => sum + d.amount, 0);
    const deliveredCount = filtered.filter(d => d.status === 'Delivered').length;
    const pendingCount = filtered.filter(d => d.status === 'Pending').length;
    // Chart: amount by region
    const regionMap = new Map();
    filtered.forEach(d => {
      regionMap.set(d.region, (regionMap.get(d.region) || 0) + d.amount);
    });
    const chart = Array.from(regionMap.entries()).map(([region, amount]) => ({ name: region, Amount: amount }));

    res.json({
      rows: paginated,
      total,
      page: options.page,
      totalPages: Math.ceil(total / options.limit),
      kpis: {
        totalDeliveries: total,
        totalAmount,
        delivered: deliveredCount,
        pending: pendingCount,
      },
      chart,
    });
  } catch (error) {
    res.status(500).json({ message: "Delivery report error", error });
  }
};

// ---------- Call Log Summary ----------
export const getCallLogSummaryReport = async (req: Request, res: Response) => {
  try {
    const options = buildQueryOptions(req);
    const searchableFields = ['id', 'agent', 'customer', 'issue'];
    const filtered = applyFiltersToArray(callLogData, options.search, options.columnFilters, searchableFields);
    const total = filtered.length;
    const paginated = filtered.slice(options.skip, options.skip + options.limit);
    const avgSatisfaction = filtered.reduce((sum, c) => sum + c.satisfaction, 0) / (total || 1);
    const avgDuration = filtered.reduce((sum, c) => sum + c.duration, 0) / (total || 1);
    // Chart: calls by agent
    const agentMap = new Map();
    filtered.forEach(c => {
      agentMap.set(c.agent, (agentMap.get(c.agent) || 0) + 1);
    });
    const chart = Array.from(agentMap.entries()).map(([agent, count]) => ({ name: agent, Calls: count }));

    res.json({
      rows: paginated,
      total,
      page: options.page,
      totalPages: Math.ceil(total / options.limit),
      kpis: {
        totalCalls: total,
        avgSatisfaction: parseFloat(avgSatisfaction.toFixed(1)),
        avgDuration: parseFloat(avgDuration.toFixed(1)),
      },
      chart,
    });
  } catch (error) {
    res.status(500).json({ message: "Call log report error", error });
  }
};

// ---------- Customer Overview ----------
export const getCustomerOverviewReport = async (req: Request, res: Response) => {
  try {
    const options = buildQueryOptions(req);
    const searchableFields = ['name', 'segment', 'email'];
    const filtered = applyFiltersToArray(customerData, options.search, options.columnFilters, searchableFields);
    const total = filtered.length;
    const paginated = filtered.slice(options.skip, options.skip + options.limit);
    const totalLTV = filtered.reduce((sum, c) => sum + c.lifetimeValue, 0);
    const totalOrders = filtered.reduce((sum, c) => sum + c.totalOrders, 0);
    // Chart: customers by segment
    const segmentMap = new Map();
    filtered.forEach(c => {
      segmentMap.set(c.segment, (segmentMap.get(c.segment) || 0) + 1);
    });
    const chart = Array.from(segmentMap.entries()).map(([segment, count]) => ({ name: segment, Customers: count }));

    res.json({
      rows: paginated,
      total,
      page: options.page,
      totalPages: Math.ceil(total / options.limit),
      kpis: {
        totalCustomers: total,
        totalLifetimeValue: totalLTV,
        avgOrdersPerCustomer: totalOrders / (total || 1),
      },
      chart,
    });
  } catch (error) {
    res.status(500).json({ message: "Customer report error", error });
  }
};

// ---------- Technician Performance Summary ----------
export const getTechnicianSummaryReport = async (req: Request, res: Response) => {
  try {
    const options = buildQueryOptions(req);
    const searchableFields = ['name', 'region'];
    const filtered = applyFiltersToArray(technicianData, options.search, options.columnFilters, searchableFields);
    const total = filtered.length;
    const paginated = filtered.slice(options.skip, options.skip + options.limit);
    const avgRating = filtered.reduce((sum, t) => sum + t.rating, 0) / (total || 1);
    const totalJobs = filtered.reduce((sum, t) => sum + t.completedJobs, 0);
    // Chart: jobs by region
    const regionMap = new Map();
    filtered.forEach(t => {
      regionMap.set(t.region, (regionMap.get(t.region) || 0) + t.completedJobs);
    });
    const chart = Array.from(regionMap.entries()).map(([region, jobs]) => ({ name: region, CompletedJobs: jobs }));

    res.json({
      rows: paginated,
      total,
      page: options.page,
      totalPages: Math.ceil(total / options.limit),
      kpis: {
        totalTechnicians: total,
        totalCompletedJobs: totalJobs,
        avgRating: parseFloat(avgRating.toFixed(1)),
      },
      chart,
    });
  } catch (error) {
    res.status(500).json({ message: "Technician report error", error });
  }
};

// ---------- Service Requests Summary ----------
export const getServiceRequestsSummaryReport = async (req: Request, res: Response) => {
  try {
    const options = buildQueryOptions(req);
    const searchableFields = ['id', 'customer', 'type', 'technician'];
    const filtered = applyFiltersToArray(serviceData, options.search, options.columnFilters, searchableFields);
    const total = filtered.length;
    const paginated = filtered.slice(options.skip, options.skip + options.limit);
    const totalCost = filtered.reduce((sum, s) => sum + s.cost, 0);
    const avgSatisfaction = filtered.reduce((sum, s) => sum + s.satisfaction, 0) / (total || 1);
    // Chart: cost by service type
    const typeMap = new Map();
    filtered.forEach(s => {
      typeMap.set(s.type, (typeMap.get(s.type) || 0) + s.cost);
    });
    const chart = Array.from(typeMap.entries()).map(([type, cost]) => ({ name: type, Cost: cost }));

    res.json({
      rows: paginated,
      total,
      page: options.page,
      totalPages: Math.ceil(total / options.limit),
      kpis: {
        totalRequests: total,
        totalCost,
        avgSatisfaction: parseFloat(avgSatisfaction.toFixed(1)),
      },
      chart,
    });
  } catch (error) {
    res.status(500).json({ message: "Service report error", error });
  }
};

// ---------- Sales Summary ----------
export const getSalesSummaryReport = async (req: Request, res: Response) => {
  try {
    const options = buildQueryOptions(req);
    const searchableFields = ['id', 'product', 'region', 'salesperson'];
    const filtered = applyFiltersToArray(salesData, options.search, options.columnFilters, searchableFields);
    const total = filtered.length;
    const paginated = filtered.slice(options.skip, options.skip + options.limit);
    const totalRevenue = filtered.reduce((sum, s) => sum + s.revenue, 0);
    const totalQuantity = filtered.reduce((sum, s) => sum + s.quantity, 0);
    // Chart: revenue by product
    const productMap = new Map();
    filtered.forEach(s => {
      productMap.set(s.product, (productMap.get(s.product) || 0) + s.revenue);
    });
    const chart = Array.from(productMap.entries()).map(([product, revenue]) => ({ name: product, Revenue: revenue }));

    res.json({
      rows: paginated,
      total,
      page: options.page,
      totalPages: Math.ceil(total / options.limit),
      kpis: {
        totalSales: total,
        totalRevenue,
        totalQuantity,
        avgOrderValue: totalRevenue / total,
      },
      chart,
    });
  } catch (error) {
    res.status(500).json({ message: "Sales report error", error });
  }
};