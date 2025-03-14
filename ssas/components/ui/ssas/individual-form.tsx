"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { countries, titles, genderOptions, employmentTypes, marketingPreferences, nationalities } from "@/utils/reference-data";

// Define form schema with Zod
const individualFormSchema = z.object({
  // Individual Contact Details
  pstrId: z.string().min(1, { message: "PSTR ID is required" }),
  employeeId: z.number().min(1, { message: "Employee ID is required" }),
  title: z.string().min(1, { message: "Title is required" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  middleName: z.string().optional(),
  surname: z.string().min(1, { message: "Surname is required" }),
  isSigner: z.boolean(),
  isTrusteeOfScheme: z.boolean(),
  dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
  gender: z.string().min(1, { message: "Gender is required" }),
  primaryNationality: z.string().min(1, { message: "Primary nationality is required" }),
  countryOfBirth: z.string().min(1, { message: "Country of birth is required" }),
  hasDualNationality: z.boolean(),
  secondNationality: z.string().optional(),
  telephone: z.string().regex(/^\d{14}$/, { message: "Phone number must be 14 digits including country code" }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Mobile number must be 10 digits" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  typeOfEmployment: z.string().min(1, { message: "Type of employment is required" }),
  occupation: z.string().min(1, { message: "Occupation is required" }),
  marketingPreferences: z.array(z.string()),
  
  // Individual Address Details
  address1: z.string().min(1, { message: "Address line 1 is required" }),
  address2: z.string().min(1, { message: "Address line 2 is required" }),
  address3: z.string().optional(),
  address4: z.string().optional(),
  postcode: z.string().min(1, { message: "Postcode is required" }).max(8, { message: "Postcode must be 8 characters or less" }),
  country: z.string().min(1, { message: "Country is required" }),
  isCurrentAddress: z.boolean(),
  isPermanentAddress: z.boolean(),
  isCommunicationAddress: z.boolean(),
  yearsAtAddress: z.number().min(0),
  monthsAtAddress: z.number().min(0).max(11),
  
  // Previous addresses (conditional based on time at current address)
  previousAddresses: z.array(z.object({
    address1: z.string().min(1, { message: "Address line 1 is required" }),
    address2: z.string().min(1, { message: "Address line 2 is required" }),
    address3: z.string().optional(),
    address4: z.string().optional(),
    postcode: z.string().min(1, { message: "Postcode is required" }),
    country: z.string().min(1, { message: "Country is required" }),
    yearsAtAddress: z.number().min(0),
    monthsAtAddress: z.number().min(0).max(11),
  })),
  
  // Communication address (if different from main address)
  communicationAddress: z.object({
    address1: z.string().min(1, { message: "Address line 1 is required" }),
    address2: z.string().min(1, { message: "Address line 2 is required" }),
    address3: z.string().optional(),
    address4: z.string().optional(),
    postcode: z.string().min(1, { message: "Postcode is required" }),
    country: z.string().min(1, { message: "Country is required" }),
  }).optional(),
  
  // Tax details
  taxContributingCountry: z.array(z.string()).min(1, { message: "At least one tax contributing country is required" }),
  foreignTinId: z.string().optional(),
});

export default function IndividualForm() {
  const [showPreviousAddresses, setShowPreviousAddresses] = useState(false);
  const [showCommunicationAddress, setShowCommunicationAddress] = useState(false);
  const [showSecondNationality, setShowSecondNationality] = useState(false);

  const form = useForm<z.infer<typeof individualFormSchema>>({
    resolver: zodResolver(individualFormSchema),
    defaultValues: {
      pstrId: "",
      employeeId: 0,
      title: "",
      firstName: "",
      middleName: "",
      surname: "",
      isSigner: false,
      isTrusteeOfScheme: false,
      dateOfBirth: "",
      gender: "",
      primaryNationality: "",
      countryOfBirth: "",
      hasDualNationality: false,
      secondNationality: "",
      telephone: "",
      mobile: "",
      email: "",
      typeOfEmployment: "",
      occupation: "",
      marketingPreferences: [],
      address1: "",
      address2: "",
      address3: "",
      address4: "",
      postcode: "",
      country: "",
      isCurrentAddress: true,
      isPermanentAddress: true,
      isCommunicationAddress: true,
      yearsAtAddress: 0,
      monthsAtAddress: 0,
      previousAddresses: [],
      taxContributingCountry: [],
      foreignTinId: "",
    },
  });

  // Check if we need to show previous addresses
  const handleAddressTimeChange = () => {
    const years = form.getValues("yearsAtAddress");
    const months = form.getValues("monthsAtAddress");
    const totalMonths = (years * 12) + months;
    
    // If less than 3 years (36 months), show previous addresses
    if (totalMonths < 36 && !showPreviousAddresses) {
      setShowPreviousAddresses(true);
      // Initialize at least one previous address
      form.setValue("previousAddresses", [
        {
          address1: "",
          address2: "",
          address3: "",
          address4: "",
          postcode: "",
          country: "",
          yearsAtAddress: 0,
          monthsAtAddress: 0
        }
      ]);
    } else if (totalMonths >= 36 && showPreviousAddresses) {
      setShowPreviousAddresses(false);
      form.setValue("previousAddresses", []);
    }
  };

  // Handle communication address toggle
  const handleCommunicationAddressChange = (checked: boolean) => {
    setShowCommunicationAddress(!checked);
    if (checked) {
      form.setValue("communicationAddress", undefined);
    } else {
      form.setValue("communicationAddress", {
        address1: "",
        address2: "",
        address3: "",
        address4: "",
        postcode: "",
        country: ""
      });
    }
  };

  // Handle dual nationality toggle
  const handleDualNationalityChange = (checked: boolean) => {
    setShowSecondNationality(checked);
    if (!checked) {
      form.setValue("secondNationality", "");
    }
  };

  function onSubmit(values: z.infer<typeof individualFormSchema>) {
    console.log(values);
    // Handle form submission (API call, etc.)
  }

  // Helper to add another previous address
  const addPreviousAddress = () => {
    const currentAddresses = form.getValues().previousAddresses || [];
    if (currentAddresses.length < 3) {
      form.setValue("previousAddresses", [
        ...currentAddresses,
        {
          address1: "",
          address2: "",
          address3: "",
          address4: "",
          postcode: "",
          country: "",
          yearsAtAddress: 0,
          monthsAtAddress: 0
        }
      ]);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Individual Contact Details Section */}
        <div className="border p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-4">Individual Contact Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="pstrId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-500">PSTR ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Pension Scheme Tax Reference ID" {...field} />
                  </FormControl>
                  <FormDescription>Pension Scheme Tax Reference ID of the employee's company</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-500">Employee ID</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Sequential number" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))} 
                    />
                  </FormControl>
                  <FormDescription>Sequential number</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-500">Title</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select title" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {titles.map((title) => (
                        <SelectItem key={title.value} value={title.value}>
                          {title.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-500">First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="middleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Middle Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter middle name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="surname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-500">Surname</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter surname" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isSigner"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Signer</FormLabel>
                  <FormDescription>Is individual a signer?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isTrusteeOfScheme"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Trustee of Scheme</FormLabel>
                  <FormDescription>Is the individual Trustee of the Scheme?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-500">Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-500">Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {genderOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="primaryNationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-500">Primary Nationality</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select nationality" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {nationalities.map((nationality) => (
                        <SelectItem key={nationality.value} value={nationality.value}>
                          {nationality.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="countryOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-500">Country of Birth</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country of birth" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="hasDualNationality"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        handleDualNationalityChange(checked === true);
                      }}
                    />
                  </FormControl>
                  <FormLabel>Dual Nationality</FormLabel>
                  <FormDescription>Does the individual have dual citizenship?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {showSecondNationality && (
              <FormField
                control={form.control}
                name="secondNationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-red-500">Second Nationality</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select second nationality" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {nationalities.map((nationality) => (
                          <SelectItem key={nationality.value} value={nationality.value}>
                            {nationality.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="telephone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-500">Telephone</FormLabel>
                  <FormControl>
                    <Input placeholder="14 digits including country code" {...field} />
                  </FormControl>
                  <FormDescription>Must be 14 digits including country code</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-500">Mobile</FormLabel>
                  <FormControl>
                    <Input placeholder="10 digits" {...field} />
                  </FormControl>
                  <FormDescription>Must be 10 digits</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-500">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email address" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="typeOfEmployment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-500">Type of Employment</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employment type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employmentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-500">Occupation</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter occupation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="marketingPreferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marketing Preferences</FormLabel>
                  <div className="flex flex-col space-y-2">
                    {marketingPreferences.map((pref) => (
                      <FormItem key={pref.value} className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(pref.value)}
                            onCheckedChange={(checked) => {
                              const currentValue = field.value || [];
                              if (checked) {
                                field.onChange([...currentValue, pref.value]);
                              } else {
                                field.onChange(currentValue.filter((value) => value !== pref.value));
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{pref.label}</FormLabel>
                      </FormItem>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Individual Address Details Section */}
        <div className="border p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-4">Individual Address Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="address1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-500">Address Line 1</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter address line 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-500">Address Line 2</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter address line 2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address3"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 3</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter address line 3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address4"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 4</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter address line 4" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="postcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-500">Postcode</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter postcode" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-500">Country</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="col-span-2 flex space-x-4">
              <FormField
                control={form.control}
                name="isCurrentAddress"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Current Address</FormLabel>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isPermanentAddress"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Permanent Address</FormLabel>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isCommunicationAddress"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          handleCommunicationAddressChange(Boolean(checked));
                        }}
                      />
                    </FormControl>
                    <FormLabel>Communication Address</FormLabel>
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="yearsAtAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years at Address</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0"
                      {...field}
                      onChange={(e) => {
                        field.onChange(parseInt(e.target.value));
                        handleAddressTimeChange();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="monthsAtAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Months at Address</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      max="11"
                      {...field}
                      onChange={(e) => {
                        field.onChange(parseInt(e.target.value));
                        handleAddressTimeChange();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {showPreviousAddresses && (
          <div className="border p-4 rounded-md">
            <h2 className="text-xl font-semibold mb-4">Previous Addresses</h2>
            {form.watch("previousAddresses")?.map((_, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <h3 className="col-span-2 text-lg font-medium">Previous Address {index + 1}</h3>
                <FormField
                  control={form.control}
                  name={`previousAddresses.${index}.address1`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-red-500">Address Line 1</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter address line 1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`previousAddresses.${index}.address2`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-red-500">Address Line 2</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter address line 2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`previousAddresses.${index}.address3`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 3</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter address line 3" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`previousAddresses.${index}.address4`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 4</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter address line 4" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`previousAddresses.${index}.postcode`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-red-500">Postcode</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter postcode" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`previousAddresses.${index}.country`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-red-500">Country</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.value} value={country.value}>
                              {country.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`previousAddresses.${index}.yearsAtAddress`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years at Address</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`previousAddresses.${index}.monthsAtAddress`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Months at Address</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          max="11"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            {form.watch("previousAddresses")?.length < 3 && (
              <Button type="button" onClick={addPreviousAddress}>
                Add Previous Address
              </Button>
            )}
          </div>
        )}

        {showCommunicationAddress && (
          <div className="border p-4 rounded-md">
            <h2 className="text-xl font-semibold mb-4">Communication Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="communicationAddress.address1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-red-500">Address Line 1</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter address line 1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="communicationAddress.address2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-red-500">Address Line 2</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter address line 2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="communicationAddress.address3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 3</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter address line 3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="communicationAddress.address4"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 4</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter address line 4" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="communicationAddress.postcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-red-500">Postcode</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter postcode" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="communicationAddress.country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-red-500">Country</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.value} value={country.value}>
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        {/* Tax Details Section */}
        <div className="border p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-4">Tax Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="taxContributingCountry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-500">Tax Contributing Country</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const currentValue = field.value || [];
                      if (!currentValue.includes(value)) {
                        field.onChange([...currentValue, value]);
                      }
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="mt-2">
                    {field.value?.map((country) => (
                      <div key={country} className="flex items-center space-x-2">
                        <span>{countries.find(c => c.value === country)?.label}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            field.onChange(field.value?.filter((c) => c !== country));
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="foreignTinId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Foreign TIN ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter foreign TIN ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
