"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Phone, Home, Building, Hash, Users, Globe, Share2 } from 'lucide-react';
import CorporateFields from './CorporateFields';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

interface PersonalInfoStepProps {
    formData: {
        customerType?: string;
        sourceId?: string;
        firstName: string;
        lastName: string;
        emailId: string;
        mobileNumber: string;
        address: string;
        city: string;
        country?: string;
        zipCode: string;
        companyName?: string;
        registrationNo?: string;
        vatNo?: string;
        website?: string;
    };
    onInputChange: (field: string, value: string) => void;
}

export default function PersonalInfoStep({ formData, onInputChange }: PersonalInfoStepProps) {
    const [sources, setSources] = useState<any[]>([]);
    const [countries, setCountries] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);

    const [isLoadingSources, setIsLoadingSources] = useState(false);
    const [isLoadingCountries, setIsLoadingCountries] = useState(false);
    const [isLoadingCities, setIsLoadingCities] = useState(false);

    // 1. Initial Fetch: Sources and Countries
    useEffect(() => {
        const fetchInitialData = async () => {
            const token = localStorage.getItem("token");
            const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
            const userId = savedUser.id || savedUser._id;
            const headers = { Authorization: `Bearer ${token}` };

            try {
                setIsLoadingSources(true);
                setIsLoadingCountries(true);

                const [sourceRes, countryRes] = await Promise.all([
                    axios.get(`${BASE_URL}/customer-source`, { headers, params: { userId } }),
                    axios.get(`${BASE_URL}/country`, { headers, params: { userId } })
                ]);

                if (sourceRes.data?.data) {
                    setSources(sourceRes.data.data);
                    if (!formData.sourceId) {
                        const def = sourceRes.data.data.find((s: any) => s.isDefault);
                        if (def) onInputChange('sourceId', def._id);
                    }
                }

                if (countryRes.data?.data) {
                    const activeCountries = countryRes.data.data.filter((c: any) => c.isActive);
                    setCountries(activeCountries);
                    if (!formData.country) {
                        const def = activeCountries.find((c: any) => c.isDefault);
                        if (def) onInputChange('country', def.countryName);
                    }
                }
            } catch (err) {
                console.error("❌ Error fetching initial data:", err);
            } finally {
                setIsLoadingSources(false);
                setIsLoadingCountries(false);
            }
        };
        fetchInitialData();
    }, []);

    // 2. Dynamic City Fetch: Load cities when country changes
    useEffect(() => {
        const fetchCities = async () => {
            if (!formData.country) {
                setCities([]);
                return;
            }

            try {
                setIsLoadingCities(true);
                const token = localStorage.getItem("token");
                const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
                const userId = savedUser.id || savedUser._id;

                // Find country ID from name to filter cities
                const selectedCountryObj = countries.find(c => c.countryName === formData.country);

                const res = await axios.get(`${BASE_URL}/city`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                        userId,
                        // Agar aapka backend country filter support karta hai to:
                        countryId: selectedCountryObj?._id
                    }
                });

                if (res.data?.data) {
                    // Only show active cities
                    const activeCities = res.data.data.filter((city: any) => city.isActive);
                    setCities(activeCities);

                    // Auto-select default city if exists and current city is empty
                    if (!formData.city) {
                        const defCity = activeCities.find((city: any) => city.isDefault);
                        if (defCity) onInputChange('city', defCity.cityName);
                    }
                }
            } catch (err) {
                console.error("❌ Error fetching cities:", err);
            } finally {
                setIsLoadingCities(false);
            }
        };

        fetchCities();
    }, [formData.country, countries]);

    return (
        <div>
            <div className="mb-6">
                <h3 className="text-3xl font-semibold text-gray-900">Personal Information</h3>
                <p className="text-gray-600 mt-1">Tell us about yourself. Fields marked <span className="text-red-500">*</span> are required.</p>
            </div>

            <div className="space-y-6">
                {/* Header Row: Customer Type & Source */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Users className="w-4 h-4 text-[#FE6B1D]" /> Customer Type *
                        </label>
                        <select
                            value={formData.customerType || 'domestic'}
                            onChange={(e) => onInputChange('customerType', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE6B1D] bg-white transition"
                            required
                        >
                            <option value="domestic">Domestic</option>
                            <option value="corporate">Corporate</option>
                        </select>
                    </div>

                    <div>
                        <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Share2 className="w-4 h-4 text-[#FE6B1D]" /> Customer Source *
                        </label>
                        <select
                            value={formData.sourceId || ''}
                            onChange={(e) => onInputChange('sourceId', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE6B1D] bg-white transition"
                            required
                        >
                            <option value="">{isLoadingSources ? "Loading..." : "Select Source"}</option>
                            {sources
                                .filter(s => s.isActive === true)
                                .map(s => (
                                    <option key={s._id} value={s._id}>
                                        {s.customerSource}
                                    </option>
                                ))}

                        </select>
                    </div>
                </div>

                {formData.customerType === 'corporate' && <CorporateFields formData={formData} onInputChange={onInputChange} />}

                {/* Name Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <User className="w-4 h-4 text-[#FE6B1D]" /> First Name *
                        </label>
                        <input type="text" value={formData.firstName} onChange={(e) => onInputChange('firstName', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE6B1D] transition" required placeholder="John" />
                    </div>
                    <div>
                        <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <User className="w-4 h-4 text-[#FE6B1D]" /> Last Name *
                        </label>
                        <input type="text" value={formData.lastName} onChange={(e) => onInputChange('lastName', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE6B1D] transition" required placeholder="Doe" />
                    </div>
                </div>

                {/* Contact Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Mail className="w-4 h-4 text-[#FE6B1D]" /> Email Address *
                        </label>
                        <input type="email" value={formData.emailId} onChange={(e) => onInputChange('emailId', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE6B1D] transition" required placeholder="email@example.com" />
                    </div>
                    <div>
                        <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Phone className="w-4 h-4 text-[#FE6B1D]" /> Mobile Number *
                        </label>
                        <input
                            type="tel"
                            value={formData.mobileNumber}
                            onChange={(e) => {
                                const numericValue = e.target.value.replace(/[^0-9]/g, "");
                                onInputChange("mobileNumber", numericValue);
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE6B1D] transition"
                            required
                            placeholder="1234567890"
                        />
                    </div>
                </div>

                {/* Address */}
                <div>
                    <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Home className="w-4 h-4 text-[#FE6B1D]" /> Address *
                    </label>
                    <input type="text" value={formData.address} onChange={(e) => onInputChange('address', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE6B1D] transition" required placeholder="Street address" />
                </div>

                {/* Location Row: Country & Dynamic City */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Globe className="w-4 h-4 text-[#FE6B1D]" /> Country *
                        </label>
                        <select
                            value={formData.country || ''}
                            onChange={(e) => {
                                onInputChange('country', e.target.value);
                                onInputChange('city', ''); // Reset city when country changes
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE6B1D] bg-white transition"
                            required
                        >
                            <option value="">{isLoadingCountries ? "Loading..." : "Select Country"}</option>
                            {countries.map(c => <option key={c._id} value={c.countryName}>{c.countryName}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Building className="w-4 h-4 text-[#FE6B1D]" /> City *
                        </label>
                        <select
                            value={formData.city}
                            onChange={(e) => onInputChange('city', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE6B1D] bg-white transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                            required
                            disabled={!formData.country || isLoadingCities}
                        >
                            <option value="">
                                {isLoadingCities ? "Loading Cities..." : !formData.country ? "Select Country First" : "Select City"}
                            </option>
                            {cities.map(city => (
                                <option key={city._id} value={city.cityName}>{city.cityName}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Post Code */}
                <div className="w-full md:w-1/2">
                    <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Hash className="w-4 h-4 text-[#FE6B1D]" /> Post Code *
                    </label>
                    <input type="text" value={formData.zipCode} onChange={(e) => onInputChange('zipCode', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE6B1D] transition" required placeholder="00000" />
                </div>
            </div>
        </div>
    );
}