import { Types } from "mongoose";
import { VenderDto } from "../../../../common/DTOs/vender.dto";
import { Person } from "../../models/person.models";
import { Contact } from "../../models/contact.models";
import { Address } from "../../models/addresses.models";
import { Vender } from "../../models/vender.models";
import { Country } from "../../models/country.models";
import { CityModel } from "../../models/city.models";

export class VenderDomainService {
  // ================= CREATE =================
  async createVender(venderData: VenderDto) {
    try {
      const { countryId, cityId } = await this.resolveCountryAndCity(
        venderData.address
      );

      const [person] = await Person.create([venderData.person]);
      const [contact] = await Contact.create([venderData.contact]);

      const [address] = await Address.create([
        {
          ...venderData.address,
          countryId,
          cityId,
          userId: venderData.userId,
        },
      ]);

      const [vender] = await Vender.create([
        {
          personId: person._id,
          contactId: contact._id,
          addressId: address._id,
          ...this.mapVendorFields(venderData),
        },
      ]);

      return vender;
    } catch (err) {
      throw err;
    }
  }

  // ================= UPDATE =================
  async updateVender(venderId: string, venderData: VenderDto) {
    try {
      const vender = await Vender.findById(venderId);
      if (!vender) {
        throw new Error("Vendor not found");
      }

      // 1️⃣ Resolve country & city again
      const { countryId, cityId } = await this.resolveCountryAndCity(
        venderData.address
      );

      // 2️⃣ Update person
      await Person.findByIdAndUpdate(vender.personId, venderData.person, {
        new: true,
        runValidators: true,
      });

      // 3️⃣ Update contact
      await Contact.findByIdAndUpdate(vender.contactId, venderData.contact, {
        new: true,
        runValidators: true,
      });

      // 4️⃣ Update address
      await Address.findByIdAndUpdate(
        vender.addressId,
        {
          ...venderData.address,
          countryId,
          cityId,
          userId: venderData.userId,
        },
        { new: true, runValidators: true }
      );

      // 5️⃣ Update vendor main record
      const updatedVender = await Vender.findByIdAndUpdate(
        venderId,
        this.mapVendorFields(venderData),
        { new: true, runValidators: true }
      );

      return updatedVender;
    } catch (err) {
      throw err;
    }
  }

  // ---------------------------------------
  private async resolveCountryAndCity(
    address: any
  ): Promise<{ countryId: Types.ObjectId; cityId: Types.ObjectId }> {
    if (!address?.country || !address?.city) {
      throw new Error("Country and city are required");
    }

    let country = await Country.findOne({ countryName: address.country });
    if (!country) {
      [country] = await Country.create([
        { countryName: address.country, userId: address.userId },
      ]);
    }

    let city = await CityModel.findOne({
      cityName: address.city,
      countryId: country._id,
    });

    if (!city) {
      [city] = await CityModel.create([
        {
          cityName: address.city,
          countryId: country._id,
          userId: address.userId,
        },
      ]);
    }

    return {
      countryId: country._id,
      cityId: city._id,
    };
  }

  // ---------------------------------------
  private mapVendorFields(venderData: VenderDto) {
    return {
      userId: venderData.userId,
      venderType: venderData.venderType,
      business_name: venderData.business_name,
      website: venderData.website,
      paymentTermId: venderData.paymentTermId,
      currencyId: venderData.currencyId,
      credit_Limit: venderData.credit_Limit,
      bank_name: venderData.bank_name,
      account_Number: venderData.account_Number,
      lead_Time_Days: venderData.lead_Time_Days,
      isActive: venderData.isActive ?? true,
      isDefault: venderData.isDefault ?? false,
    };
  }
}
