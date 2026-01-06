"use client";
import {
  Truck,
  MapPin,
  Phone,
  Globe,
  CreditCard,
  CheckCircle,
  XCircle,
  Star,
} from "lucide-react";
import { TableActionButton } from "../../../../common-form/TableActionButtons";
import { VenderDto } from "../../../../../../../common/DTOs/vender.dto";

interface PopulatedPerson {
  _id: string;
  firstName: string;
  lastName?: string;
}

interface PopulatedContact {
  _id: string;
  mobileNumber: string;
  emailId: string;
}

interface PopulatedAddress {
  _id: string;
  address: string;
  zipCode?: string;
}

type PopulatedVenderDto = VenderDto & {
  personId?: string | PopulatedPerson;
  addressId?: string | PopulatedAddress;
  contactId?: string | PopulatedContact;
  business_name?: string;
};

interface Props {
  data: (PopulatedVenderDto & { _id: string })[];
  onEdit: (item: PopulatedVenderDto & { _id: string }) => void;
  onDelete: (id: string) => void;
  themeColor: string;
}

const VenderTable = ({ data, onEdit, onDelete, themeColor }: Props) => {
  const getFirstName = (item: PopulatedVenderDto): string => {
    if (item.person?.firstName) return item.person.firstName;
    if (item.personId && typeof item.personId === "object") {
      return item.personId.firstName;
    }
    return "";
  };

  const getLastName = (item: PopulatedVenderDto): string => {
    if (item.person?.lastName) return item.person.lastName;
    if (item.personId && typeof item.personId === "object") {
      return item.personId.lastName || "";
    }
    return "";
  };

  const getMobileNumber = (item: PopulatedVenderDto): string => {
    if (item.contact?.mobileNumber) return item.contact.mobileNumber;
    if (item.contactId && typeof item.contactId === "object") {
      return item.contactId.mobileNumber;
    }
    return "";
  };

  const getEmailId = (item: PopulatedVenderDto): string => {
    if (item.contact?.emailId) return item.contact.emailId;
    if (item.contactId && typeof item.contactId === "object") {
      return item.contactId.emailId;
    }
    return "";
  };

  const getAddress = (item: PopulatedVenderDto): string => {
    if (item.address?.address) return item.address.address;
    if (item.addressId && typeof item.addressId === "object") {
      return item.addressId.address;
    }
    return "";
  };

  const getZipCode = (item: PopulatedVenderDto): string => {
    if (item.address?.zipCode) return item.address.zipCode;
    if (item.addressId && typeof item.addressId === "object") {
      return item.addressId.zipCode || "";
    }
    return "";
  };

  const getBusinessName = (item: PopulatedVenderDto): string => {
    if (item.business_name) return item.business_name;
    if (item.business_Name) return item.business_Name;
    return "No Business Name";
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-white" style={{ backgroundColor: themeColor }}>
            <tr>
              <th className="px-6 py-4">Business & Person</th>
              <th className="px-6 py-4">Contact Info</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4 text-center">Type & Limit</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length > 0 ? (
              data.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-orange-50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                        <Truck size={18} />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-800">
                            {getBusinessName(item)}
                          </span>
                          {item.isDefault && (
                            <Star size={14} className="text-yellow-500" />
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {getFirstName(item)} {getLastName(item)}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col text-sm text-gray-600 gap-1">
                      <span className="flex items-center gap-1">
                        <Phone size={12} /> {getMobileNumber(item)}
                      </span>
                      <span className="flex items-center gap-1 text-xs">
                        <Globe size={12} /> {getEmailId(item)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-1 text-sm text-gray-600 max-w-[200px]">
                      <MapPin size={14} className="mt-1 text-gray-400" />
                      <span>
                        {getAddress(item)}, {getZipCode(item)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold uppercase">
                        {item.venderType}
                      </span>
                      <span className="text-xs font-mono text-green-600 flex items-center gap-1">
                        <CreditCard size={10} /> {item.credit_Limit || 0}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1">
                        {item.isActive ? (
                          <span className="flex items-center gap-1 text-green-600 text-xs">
                            <CheckCircle size={10} /> Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-600 text-xs">
                            <XCircle size={10} /> Inactive
                          </span>
                        )}
                      </div>
                      {item.isDefault && (
                        <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <TableActionButton
                      onEdit={() => onEdit(item)}
                      onDelete={() => onDelete(item._id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-gray-400 italic"
                >
                  No venders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VenderTable;
