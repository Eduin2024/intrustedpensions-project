"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { formatCurrency, formatPhoneNumber } from "@/utils/form-helpers";
import { countries, addressTypes, ReferenceItem } from "@/utils/reference-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@radix-ui/react-checkbox";

// Define form schema with Zod
const corporateFormSchema = z.object({
  // Contact Details
  pstrId: z.string().min(1, { message: "PSTR ID is required" }),
  pensionSchemeName: z.string().min(1, { message: "Pension scheme name is required" }),
  contactName: z.string().min(1, { message: "Contact name is required" }),
  positionInOrganization: z.string().min(1, { message: "Position is required" }),
  pensionProvider: z.string().min(1, { message: "Pension provider is required" }),
  telephone: z.string().regex(/^\d{14}$/, { message: "Phone number must be 14 digits including country code" }),
  mobile: z.string().regex(/^\d{14}$/, { message: "Mobile number must be 14 digits" }),
  email: z.string().email().max(65, { message: "Email must be less than 65 characters" }),
  
  // Address Details
  addressType: z.string().min(1, { message: "Address type is required" }),
  address1: z.string().min(1, { message: "Building number is required" }),
  address2: z.string().min(1, { message: "Street name is required" }),
  address3: z.string().optional(),
  address4: z.string().optional(),
  postcode: z.string().min(1, { message: "Postcode is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  isCurrentAddress: z.boolean().default(false),
  isPermanentAddress: z.boolean().default(false),
  isCommunicationAddress: z.boolean().default(false),
  
  // Pension Scheme Details
  howManyToSign: z.number().min(1, { message: "Number of signatories is required" }),
  howManyFromCorporateTrustee: z.number().min(0),
  howManyMembers: z.number().min(1, { message: "Number of members is required" }),
  isOccupationalScheme: z.boolean().default(false),
  permitAssignmentOfInterest: z.boolean().default(false),
  hasDeductionFromEmployeeWages: z.boolean().default(false),
  dateOfRegistration: z.string().min(1, { message: "Date of registration is required" }),
  hasCorporateTrustee: z.boolean().default(false),
  depositPerAnnum: z.number().min(0, { message: "Deposit per annum is required" }),
  annualOutgoings: z.number().min(0, { message: "Annual outgoings is required" }),
  anticipatedActivity: z.number().min(0, { message: "Anticipated activity is required" }),
  anticipatedTransactions: z.number().min(0, { message: "Anticipated transactions is required" }),
  countryOfPayments: z.array(z.string()).min(1, { message: "At least one country is required" }),
  schemeRegistrationCountry: z.literal("United Kingdom"),
  
  // Principal Employer Details
  contributorLegalName: z.string().min(1, { message: "Legal name is required" }),
  contributorTradingName: z.string().optional(),
  contributorAddress1: z.string().min(1, { message: "Address line 1 is required" }),
  contributorAddress2: z.string().optional(),
  contributorAddress3: z.string().optional(),
  contributorAddress4: z.string().optional(),
  contributorPostcode: z.string().max(8, { message: "Postcode must be 8 characters or less" }),
  contributorCountry: z.string().min(1, { message: "Country is required" }),
  contributorDateOfIncorporation: z.string().min(1, { message: "Date of incorporation is required" }),
  contributorDateOfRegistration: z.string().min(1, { message: "Date of registration is required" }),
  contributorDateStartedTrading: z.string().min(1, { message: "Date started trading is required" }),
  contributorNatureOfBusiness: z.string().min(1, { message: "Nature of business is required" }),
  contributorCountriesOperatesIn: z.array(z.string()).min(1, { message: "At least one country is required" }),
  contributorManagement: z.array(z.object({
    firstName: z.string().min(1, { message: "First name is required" }),
    middleName: z.string().optional(),
    surname: z.string().min(1, { message: "Surname is required" }),
    position: z.string().min(1, { message: "Position is required" }),
  })).min(1, { message: "At least one management person is required" }),
  
  // Co-sign Details
  professionalCoSignatory: z.string().min(1, { message: "Professional co-signatory is required" }),
  coSignCompanyName: z.string().min(1, { message: "Company name is required" }),
  coSignAddress: z.string().min(1, { message: "Address is required" }),
  coSignTelephone: z.string().min(1, { message: "Telephone is required" }),
  coSignEmail: z.string().email({ message: "Valid email is required" }),
  regulatorReferenceNumber: z.string().min(1, { message: "Regulator reference number is required" }),
  
  // Account Details
  tcAcknowledgement: z.boolean().refine(val => val === true, { message: "You must acknowledge the terms and conditions" }),
  accountType: z.array(z.string()).min(1, { message: "At least one account type is required" }),
  openingBalance: z.string().min(1, { message: "Opening balance is required" }),
  sourceOfInitialFunds: z.string().min(1, { message: "Source of initial funds is required" }),
  sourceOfFunds: z.array(z.string()).min(1, { message: "At least one source of funds is required" }),
  otherSourceOfFunds: z.string().optional(),
  valueOfFunds: z.string().min(1, { message: "Value of funds is required" }),
  countryOfFunds: z.array(z.string()).min(1, { message: "At least one country is required" }),
});

export default function CorporateForm() {
  const form = useForm<z.infer<typeof corporateFormSchema>>({
    resolver: zodResolver(corporateFormSchema),
    defaultValues: {
      pstrId: "",
      pensionSchemeName: "",
      contactName: "",
      positionInOrganization: "",
      pensionProvider: "",
      telephone: "",
      mobile: "",
      email: "",
      addressType: "",
      address1: "",
      address2: "",
      address3: "",
      address4: "",
      postcode: "",
      country: "",
      isCurrentAddress: false,
      isPermanentAddress: false,
      isCommunicationAddress: false,
      howManyToSign: 0,
      howManyFromCorporateTrustee: 0,
      howManyMembers: 0,
      isOccupationalScheme: false,
      permitAssignmentOfInterest: false,
      hasDeductionFromEmployeeWages: false,
      dateOfRegistration: "",
      hasCorporateTrustee: false,
      depositPerAnnum: 0,
      annualOutgoings: 0,
      anticipatedActivity: 0,
      anticipatedTransactions: 0,
      countryOfPayments: [],
      schemeRegistrationCountry: "United Kingdom",
      contributorLegalName: "",
      contributorTradingName: "",
      contributorAddress1: "",
      contributorAddress2: "",
      contributorAddress3: "",
      contributorAddress4: "",
      contributorPostcode: "",
      contributorCountry: "",
      contributorDateOfIncorporation: "",
      contributorDateOfRegistration: "",
      contributorDateStartedTrading: "",
      contributorNatureOfBusiness: "",
      contributorCountriesOperatesIn: [],
      contributorManagement: [{ firstName: "", middleName: "", surname: "", position: "" }],
      professionalCoSignatory: "",
      coSignCompanyName: "",
      coSignAddress: "",
      coSignTelephone: "",
      coSignEmail: "",
      regulatorReferenceNumber: "",
      tcAcknowledgement: false,
      accountType: [],
      openingBalance: "",
      sourceOfInitialFunds: "",
      sourceOfFunds: [],
      otherSourceOfFunds: "",
      valueOfFunds: "",
      countryOfFunds: [],
    },
  });

  function onSubmit(values: z.infer<typeof corporateFormSchema>) {
    console.log(values);
    // Handle form submission (API call, etc.)
  }

  const FieldWithTooltip = ({ 
    name, 
    label, 
    description, 
    tooltip, 
    children 
  }: { 
    name: string; 
    label: string; 
    description?: string; 
    tooltip?: string;
    children: React.ReactNode;
  }) => (
    <FormField
      control={form.control}
      name={name as any}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            {label}
            {tooltip && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-gray-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </FormLabel>
          <FormControl>{children}</FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Contact Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldWithTooltip
              name="pstrId"
              label="PSTR ID"
              tooltip="Pension Scheme Tax Reference ID"
            >
              <Input placeholder="Enter PSTR ID" {...form.register("pstrId")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="pensionSchemeName"
              label="Pension Scheme Name"
              tooltip="Name of the pension scheme"
            >
              <Input placeholder="Enter scheme name" {...form.register("pensionSchemeName")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="contactName"
              label="Contact Name"
              tooltip="Full name of the primary contact"
            >
              <Input placeholder="Enter contact name" {...form.register("contactName")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="positionInOrganization"
              label="Position in Organization"
              tooltip="Position held within the organization"
            >
              <Input placeholder="Enter position" {...form.register("positionInOrganization")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="pensionProvider"
              label="Pension Provider"
              tooltip="Name of the pension provider"
            >
              <Input placeholder="Enter pension provider name" {...form.register("pensionProvider")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="telephone"
              label="Telephone"
              tooltip="Primary contact phone number"
            >
              <Input 
                placeholder="14 digits including country code" 
                {...form.register("telephone")}
                onChange={(e) => {
                  const formatted = formatPhoneNumber(e.target.value);
                  form.setValue("telephone", formatted);
                }}
              />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="mobile"
              label="Mobile"
              tooltip="Secondary contact phone number"
            >
              <Input 
                placeholder="14 digits" 
                {...form.register("mobile")}
                onChange={(e) => {
                  const formatted = formatPhoneNumber(e.target.value);
                  form.setValue("mobile", formatted);
                }}
              />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="email"
              label="Email"
              tooltip="Primary contact email address"
            >
              <Input type="email" placeholder="Enter email" {...form.register("email")} />
            </FieldWithTooltip>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Address Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldWithTooltip
              name="addressType"
              label="Address Type"
              tooltip="Type of address"
            >
              <Select onValueChange={(value) => form.setValue("addressType", value)}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select address type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {addressTypes.map((type: ReferenceItem) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldWithTooltip>

            <FieldWithTooltip
              name="address1"
              label="Address 1"
              tooltip="Building number or house name"
            >
              <Input placeholder="Enter address line 1" {...form.register("address1")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="address2"
              label="Address 2"
              tooltip="Street name or first line of address"
            >
              <Input placeholder="Enter address line 2" {...form.register("address2")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="address3"
              label="Address 3"
              tooltip="Second line of address"
            >
              <Input placeholder="Enter address line 3" {...form.register("address3")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="address4"
              label="Address 4"
              tooltip="Third line of address"
            >
              <Input placeholder="Enter address line 4" {...form.register("address4")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="postcode"
              label="Postcode"
              tooltip="Postal code for the address"
            >
              <Input placeholder="Enter postcode" {...form.register("postcode")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="country"
              label="Country"
              tooltip="Country of the address"
            >
              <Select onValueChange={(value) => form.setValue("country", value)}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {countries.map((country: ReferenceItem) => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldWithTooltip>

            <FieldWithTooltip
              name="isCurrentAddress"
              label="Current Address"
              tooltip="Is this the primary address?"
            >
              <Checkbox {...form.register("isCurrentAddress")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="isPermanentAddress"
              label="Permanent Address"
              tooltip="Is this the permanent address?"
            >
              <Checkbox {...form.register("isPermanentAddress")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="isCommunicationAddress"
              label="Communication Address"
              tooltip="Is this the communication address?"
            >
              <Checkbox {...form.register("isCommunicationAddress")} />
            </FieldWithTooltip>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pension Scheme Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldWithTooltip
              name="howManyToSign"
              label="Number of Signatories"
              tooltip="Total number of signatories"
            >
              <Input placeholder="Enter number of signatories" {...form.register("howManyToSign")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="howManyFromCorporateTrustee"
              label="Number of Signatories from Corporate Trustee"
              tooltip="Number of signatories from the corporate trustee"
            >
              <Input placeholder="Enter number of signatories from corporate trustee" {...form.register("howManyFromCorporateTrustee")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="howManyMembers"
              label="Number of Members"
              tooltip="Total number of members"
            >
              <Input placeholder="Enter number of members" {...form.register("howManyMembers")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="isOccupationalScheme"
              label="Occupational Scheme"
              tooltip="Is this an occupational scheme?"
            >
              <Checkbox {...form.register("isOccupationalScheme")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="permitAssignmentOfInterest"
              label="Permit Assignment of Interest"
              tooltip="Is permission granted for assignment of interest?"
            >
              <Checkbox {...form.register("permitAssignmentOfInterest")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="hasDeductionFromEmployeeWages"
              label="Has Deduction from Employee Wages"
              tooltip="Is there a deduction from employee wages?"
            >
              <Checkbox {...form.register("hasDeductionFromEmployeeWages")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="dateOfRegistration"
              label="Date of Registration"
              tooltip="Date when the scheme was registered"
            >
              <Input placeholder="Enter date of registration" {...form.register("dateOfRegistration")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="hasCorporateTrustee"
              label="Has Corporate Trustee"
              tooltip="Is there a corporate trustee?"
            >
              <Checkbox {...form.register("hasCorporateTrustee")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="depositPerAnnum"
              label="Deposit per Annum"
              tooltip="Annual deposit amount"
            >
              <Input placeholder="Enter deposit per annum" {...form.register("depositPerAnnum")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="annualOutgoings"
              label="Annual Outgoings"
              tooltip="Total annual expenses"
            >
              <Input placeholder="Enter annual outgoings" {...form.register("annualOutgoings")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="anticipatedActivity"
              label="Anticipated Activity"
              tooltip="Anticipated activity level"
            >
              <Input placeholder="Enter anticipated activity" {...form.register("anticipatedActivity")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="anticipatedTransactions"
              label="Anticipated Transactions"
              tooltip="Anticipated transaction volume"
            >
              <Input placeholder="Enter anticipated transactions" {...form.register("anticipatedTransactions")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="countryOfPayments"
              label="Country of Payments"
              tooltip="Countries where payments are made"
            >
              <Select
                onValueChange={(value) => {
                  const currentValue = form.getValues("countryOfPayments") || [];
                  form.setValue("countryOfPayments", [...currentValue, value]);
                }}
                value={form.watch("countryOfPayments")[0]}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select countries" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {countries.map((country: ReferenceItem) => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldWithTooltip>

            <FieldWithTooltip
              name="schemeRegistrationCountry"
              label="Scheme Registration Country"
              tooltip="Country where the scheme is registered"
            >
              <Input placeholder="Enter scheme registration country" {...form.register("schemeRegistrationCountry")} />
            </FieldWithTooltip>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Principal Employer Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldWithTooltip
              name="contributorLegalName"
              label="Legal Name"
              tooltip="Registered company name"
            >
              <Input placeholder="Enter legal name" {...form.register("contributorLegalName")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="contributorTradingName"
              label="Trading Name"
              tooltip="Trading name of the company"
            >
              <Input placeholder="Enter trading name" {...form.register("contributorTradingName")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="contributorAddress1"
              label="Address 1"
              tooltip="Registered company address line 1"
            >
              <Input placeholder="Enter address line 1" {...form.register("contributorAddress1")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="contributorAddress2"
              label="Address 2"
              tooltip="Registered company address line 2"
            >
              <Input placeholder="Enter address line 2" {...form.register("contributorAddress2")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="contributorAddress3"
              label="Address 3"
              tooltip="Registered company address line 3"
            >
              <Input placeholder="Enter address line 3" {...form.register("contributorAddress3")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="contributorAddress4"
              label="Address 4"
              tooltip="Registered company address line 4"
            >
              <Input placeholder="Enter address line 4" {...form.register("contributorAddress4")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="contributorPostcode"
              label="Postcode"
              tooltip="Registered company postcode"
            >
              <Input placeholder="Enter postcode" {...form.register("contributorPostcode")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="contributorCountry"
              label="Country"
              tooltip="Country of the registered company"
            >
              <Input placeholder="Enter country" {...form.register("contributorCountry")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="contributorDateOfIncorporation"
              label="Date of Incorporation"
              tooltip="Date when the company was incorporated"
            >
              <Input placeholder="Enter date of incorporation" {...form.register("contributorDateOfIncorporation")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="contributorDateOfRegistration"
              label="Date of Registration"
              tooltip="Date when the company was registered"
            >
              <Input placeholder="Enter date of registration" {...form.register("contributorDateOfRegistration")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="contributorDateStartedTrading"
              label="Date Started Trading"
              tooltip="Date when the company started trading"
            >
              <Input placeholder="Enter date started trading" {...form.register("contributorDateStartedTrading")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="contributorNatureOfBusiness"
              label="Nature of Business"
              tooltip="Nature of the business conducted by the company"
            >
              <Input placeholder="Enter nature of business" {...form.register("contributorNatureOfBusiness")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="contributorCountriesOperatesIn"
              label="Countries Operates In"
              tooltip="Countries where the company operates"
            >
              <Select
                onValueChange={(value) => {
                  const currentValue = form.getValues("contributorCountriesOperatesIn") || [];
                  form.setValue("contributorCountriesOperatesIn", [...currentValue, value]);
                }}
                value={form.watch("contributorCountriesOperatesIn")[0]}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select countries" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {countries.map((country: ReferenceItem) => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldWithTooltip>

            <FieldWithTooltip
              name="contributorManagement"
              label="Management"
              tooltip="Management team of the company"
            >
              <div className="flex flex-col space-y-2">
                {form.watch("contributorManagement").map((person, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <FieldWithTooltip
                      name={`contributorManagement.${index}.firstName`}
                      label="First Name"
                    >
                      <Input placeholder="Enter first name" {...form.register(`contributorManagement.${index}.firstName`)} />
                    </FieldWithTooltip>
                    <FieldWithTooltip
                      name={`contributorManagement.${index}.middleName`}
                      label="Middle Name"
                    >
                      <Input placeholder="Enter middle name" {...form.register(`contributorManagement.${index}.middleName`)} />
                    </FieldWithTooltip>
                    <FieldWithTooltip
                      name={`contributorManagement.${index}.surname`}
                      label="Surname"
                    >
                      <Input placeholder="Enter surname" {...form.register(`contributorManagement.${index}.surname`)} />
                    </FieldWithTooltip>
                    <FieldWithTooltip
                      name={`contributorManagement.${index}.position`}
                      label="Position"
                    >
                      <Input placeholder="Enter position" {...form.register(`contributorManagement.${index}.position`)} />
                    </FieldWithTooltip>
                  </div>
                ))}
              </div>
            </FieldWithTooltip>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Co-sign Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldWithTooltip
              name="professionalCoSignatory"
              label="Professional Co-signatory"
              tooltip="Name of the professional co-signatory"
            >
              <Input placeholder="Enter professional co-signatory" {...form.register("professionalCoSignatory")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="coSignCompanyName"
              label="Company Name"
              tooltip="Name of the co-signatory's company"
            >
              <Input placeholder="Enter company name" {...form.register("coSignCompanyName")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="coSignAddress"
              label="Address"
              tooltip="Registered address of the co-signatory"
            >
              <Input placeholder="Enter address" {...form.register("coSignAddress")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="coSignTelephone"
              label="Telephone"
              tooltip="Phone number for the co-signatory"
            >
              <Input 
                placeholder="Enter telephone" 
                {...form.register("coSignTelephone")}
                onChange={(e) => {
                  const formatted = formatPhoneNumber(e.target.value);
                  form.setValue("coSignTelephone", formatted);
                }}
              />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="coSignEmail"
              label="Email"
              tooltip="Email address for the co-signatory"
            >
              <Input type="email" placeholder="Enter email" {...form.register("coSignEmail")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="regulatorReferenceNumber"
              label="Regulator Reference Number"
              tooltip="Reference number provided by the regulator"
            >
              <Input placeholder="Enter regulator reference number" {...form.register("regulatorReferenceNumber")} />
            </FieldWithTooltip>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldWithTooltip
              name="tcAcknowledgement"
              label="You must acknowledge the terms and conditions"
              tooltip="You must acknowledge the terms and conditions"
            >
              <Checkbox {...form.register("tcAcknowledgement")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="accountType"
              label="Account Type"
              tooltip="Type of bank account"
            >
              <Select
                onValueChange={(value) => {
                  const currentValue = form.getValues("accountType") || [];
                  form.setValue("accountType", [...currentValue, value]);
                }}
                value={form.watch("accountType")[0]}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account types" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="savings">Savings</SelectItem>
                  <SelectItem value="checking">Checking</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
            </FieldWithTooltip>

            <FieldWithTooltip
              name="openingBalance"
              label="Opening Balance"
              tooltip="Initial balance of the account"
            >
              <Input placeholder="Enter opening balance" {...form.register("openingBalance")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="sourceOfInitialFunds"
              label="Source of Initial Funds"
              tooltip="Source of the initial funds for the account"
            >
              <Input placeholder="Enter source of initial funds" {...form.register("sourceOfInitialFunds")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="sourceOfFunds"
              label="Source of Funds"
              tooltip="Source of the funds for the account"
            >
              <Select
                onValueChange={(value) => {
                  const currentValue = form.getValues("sourceOfFunds") || [];
                  form.setValue("sourceOfFunds", [...currentValue, value]);
                }}
                value={form.watch("sourceOfFunds")[0]}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sources of funds" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="salary">Salary</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                  <SelectItem value="inheritance">Inheritance</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </FieldWithTooltip>

            <FieldWithTooltip
              name="otherSourceOfFunds"
              label="Other Source of Funds"
              tooltip="Other source of funds for the account"
            >
              <Input placeholder="Enter other source of funds" {...form.register("otherSourceOfFunds")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="valueOfFunds"
              label="Value of Funds"
              tooltip="Value of the funds in the account"
            >
              <Input placeholder="Enter value of funds" {...form.register("valueOfFunds")} />
            </FieldWithTooltip>

            <FieldWithTooltip
              name="countryOfFunds"
              label="Country of Funds"
              tooltip="Country of the funds in the account"
            >
              <Select
                onValueChange={(value) => {
                  const currentValue = form.getValues("countryOfFunds") || [];
                  form.setValue("countryOfFunds", [...currentValue, value]);
                }}
                value={form.watch("countryOfFunds")[0]}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select countries" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {countries.map((country: ReferenceItem) => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldWithTooltip>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full">Submit</Button>
      </form>
    </Form>
  );
}
