import { Types } from "mongoose";
import { VenderDto } from "../../../../common/DTOs/vender.dto";
import { Person } from "../../models/person.models";
import { Contact } from "../../models/contact.models";
import { Address } from "../../models/addresses.models";
import { Vender } from "../../models/vender.models";
import { Country } from "../../models/country.models";
import { CityModel } from "../../models/city.models";

export class VenderDomainService {

    async createVender(venderData: VenderDto) {


        try {
            // 1️⃣ Resolve country & city
            const { countryId, cityId } =
                await this.resolveCountryAndCity(venderData.address);

            // 2️⃣ Create person
            const [person] = await Person.create(
                [venderData.person],

            );

            // 3️⃣ Create contact
            const [contact] = await Contact.create(
                [venderData.contact],

            );

            // 4️⃣ Create address
            const [address] = await Address.create(
                [{
                    ...venderData.address,
                    countryId,
                    cityId,
                    userId: venderData.userId
                }],

            );

            // 5️⃣ Create vendor
            const [vender] = await Vender.create(
                [{
                    personId: person._id,
                    contactId: contact._id,
                    addressId: address._id,
                    ...this.mapVendorFields(venderData)
                }],

            );


            return vender;

        } catch (err) {

            throw err;
        } finally {
            console.log('Finally.');
        }
    }

    // ---------------------------------------

    private async resolveCountryAndCity(
        address: any,

    ): Promise<{ countryId: Types.ObjectId; cityId: Types.ObjectId }> {

        if (!address?.country || !address?.city) {
            throw new Error("Country and city are required");
        }

        let country = await Country.findOne(
            { countryName: address.country },
            null,

        );

        if (!country) {
            [country] = await Country.create(
                [{ countryName: address.country }],

            );
        }

        let city = await CityModel.findOne(
            { cityName: address.city, countryId: country._id },
            null,

        );

        if (!city) {
            [city] = await CityModel.create(
                [{ cityName: address.city, countryId: country._id }],

            );
        }

        return {
            countryId: country._id,
            cityId: city._id
        };
    }

    // ---------------------------------------

    private mapVendorFields(venderData: VenderDto) {
        return {
            userId: venderData.userId,
            venderType: venderData.venderType,
            business_Name: venderData.business_Name,
            website: venderData.website,
            paymentTermId: venderData.paymentTermId,
            currencyId: venderData.currencyId,
            credit_Limit: venderData.credit_Limit,
            bank_name: venderData.bank_name,
            account_Number: venderData.account_Number,
            lead_Time_Days: venderData.lead_Time_Days,
            isActive: venderData.isActive ?? true,
            isDefault: venderData.isDefault ?? false
        };
    }
}

