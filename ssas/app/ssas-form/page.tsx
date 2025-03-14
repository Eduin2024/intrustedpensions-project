"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CorporateForm from "@/components/ui/ssas/corporate-form";
import IndividualForm from "@/components/ui/ssas/individual-form";

export default function SSASFormPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">SSAS Accounts Creation Request</h1>
      <p className="text-red-500 mb-4">All fields in red are mandatory</p>
      
      <Tabs defaultValue="corporate" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="corporate">Corporate Information</TabsTrigger>
          <TabsTrigger value="individual">Individual Information</TabsTrigger>
        </TabsList>
        <TabsContent value="corporate">
          <Card>
            <CardHeader>
              <CardTitle>Corporate Information</CardTitle>
              <CardDescription>
                Enter all required company information - one line per company
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CorporateForm />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="individual">
          <Card>
            <CardHeader>
              <CardTitle>Individual Information</CardTitle>
              <CardDescription>
                Enter all required Employees. One line per employee. Link to company by PTSR ID
              </CardDescription>
            </CardHeader>
            <CardContent>
              <IndividualForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
