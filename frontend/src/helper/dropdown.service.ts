
import { getAll } from "./apiHelper";

 interface DropdownOption {
  value: string;
  label: string;
  
 }

export interface DropdownData {
  categories: DropdownOption[];
//   brands: DropdownOption[];
  taxes: DropdownOption[];
  currencies: DropdownOption[];
  vendors: DropdownOption[];
  channels: DropdownOption[];
}

export class DropdownService {
  private static baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  static async fetchAll(): Promise<DropdownData> {
    try {
      const [
        categories,
        // brands,
        taxes,
        currencies,
        vendors,
        channels
      ] = await Promise.all([
        this.fetchCategories(),
        // this.fetchBrands(),
        this.fetchTaxes(),
        this.fetchCurrencies(),
        this.fetchVendors(),
        this.fetchChannels(),
      ]);

      return {
        categories,
        // brands,
        taxes,
        currencies,
        vendors,
        channels,
      };
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
      throw error;
    }
  }

//   private static async fetchCategories(): Promise<DropdownOption[]> {
//     try {
//       const response = await getAll<{ _id: string; categoryName: string }>(
//         "/categories",
//         { limit: 100 }
//       );
//       console.log("categories", response);
//       return response.data.map(item => ({
//         value:  "695cd3474336b9778eaf4951",
//         label:  "dell",
        
//       }));
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//       return [];
//     }
//   }

//   private static async fetchBrands(): Promise<DropdownOption[]> {
//     try {
//       const response = await getAll<{ _id: string; brandName: string }>(
//         "/brands", // Adjust endpoint as needed
//         { limit: 100 }
//       );
//       return response.data.map(item => ({
//         value: item._id,
//         label: item.brandName,
//       }));
//     } catch (error) {
//       console.error("Error fetching brands:", error);
//       return [];
//     }
//   }

private static async fetchCategories(): Promise<DropdownOption[]> {
  try {
    // For now, return static data
    const staticCategories = [
      { value: "695cd3474336b9778eaf4951", label: "Dell", code: "DEL" },
      { value: "695cd3474336b9778eaf4952", label: "HP", code: "HP" },
      { value: "695cd3474336b9778eaf4953", label: "Lenovo", code: "LEN" },
      { value: "695cd3474336b9778eaf4954", label: "Apple", code: "APL" },
      { value: "695cd3474336b9778eaf4955", label: "Acer", code: "ACE" },
      { value: "695cd3474336b9778eaf4956", label: "Asus", code: "ASU" },
      { value: "695cd3474336b9778eaf4957", label: "Microsoft", code: "MS" },
      { value: "695cd3474336b9778eaf4958", label: "Samsung", code: "SAM" },
    ];
    
    console.log("Using static categories:", staticCategories);
    return staticCategories;
    
  } catch (error) {
    console.error("Error in fetchCategories:", error);
    return [];
  }
}
  private static async fetchTaxes(): Promise<DropdownOption[]> {
    try {
      const response = await getAll<{ _id: string; taxName: string; percentage: number }>(
        "/tax",
        { limit: 100 }
      );
      return response.data.map(item => ({
        value: item._id,
        label: `${item.taxName} (${(item.percentage * 100)}%)`,
        rate: item.percentage,
      }));
    } catch (error) {
      console.error("Error fetching taxes:", error);
      return [];
    }
  }

  private static async fetchCurrencies(): Promise<DropdownOption[]> {
    try {
      const response = await getAll<{ _id: string; currencyName: string; currencySymbol: string }>(
        "/currencies",
        { limit: 100 }
      );

      
      return response.data.map(item => ({
        value: item._id,
        label: `${item.currencyName} - ${item.currencySymbol}`,
        // code: item.code,
      }));
    } catch (error) {
      console.error("Error fetching currencies:", error);
      return [];
    }
  }

  private static async fetchVendors(): Promise<DropdownOption[]> {
    try {
      const response = await getAll<{ _id: string; lastName: string; personId: { lastName: string} }>(
        "/venders",
        { limit: 100 }
      );

     
      return response.data.map(item => ({
        value: item._id,
        label: item?.personId?.lastName,
       
      }));
    } catch (error) {
      console.error("Error fetching vendors:", error);
      return [];
    }
  }

  private static async fetchChannels(): Promise<DropdownOption[]> {
    try {
      const response = await getAll<{ _id: string; channelName: string }>(
        "/product-channels",
        { limit: 100 }
      );
       console.log("channels", response);
      return response.data.map(item => ({
        value: item._id,
        label: item.channelName,
      }));
    } catch (error) {
      console.error("Error fetching channels:", error);
      return [];
    }
  }
}