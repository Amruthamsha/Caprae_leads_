import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Send, CheckCircle } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    industry: "",
    criteria: "",
    fileUpload: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const industries = [
    "SaaS", "FinTech", "E-commerce", "Healthcare", "EdTech", 
    "MarTech", "PropTech", "InsurTech", "HRTech", "LogTech", "Other"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, fileUpload: file }));
      toast({
        title: "File Uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.criteria) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Submission Successful",
        description: "We'll process your criteria and get back to you within 24 hours.",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        company: "",
        industry: "",
        criteria: "",
        fileUpload: null,
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Upload Your Lead Criteria
            </h1>
            <p className="text-xl text-muted-foreground">
              Submit your detailed requirements and let AI-powered enrichment find your perfect prospects
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <FileText className="mr-2 h-5 w-5 text-primary" />
                    Lead Generation Request
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Provide your ideal customer profile and we'll find matching leads
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="john@company.com"
                          required
                        />
                      </div>
                    </div>

                    {/* Company Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company">Company Name</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => handleInputChange("company", e.target.value)}
                          placeholder="Your Company Inc."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="industry">Your Industry</Label>
                        <Select
                          value={formData.industry}
                          onValueChange={(value) => handleInputChange("industry", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your industry" />
                          </SelectTrigger>
                          <SelectContent>
                            {industries.map((industry) => (
                              <SelectItem key={industry} value={industry}>
                                {industry}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Lead Criteria */}
                    <div className="space-y-2">
                      <Label htmlFor="criteria">Lead Criteria *</Label>
                      <Textarea
                        id="criteria"
                        value={formData.criteria}
                        onChange={(e) => handleInputChange("criteria", e.target.value)}
                        placeholder="Describe your ideal customer profile in detail. Include:
• Industry and company size
• Geographic location
• Technology stack they might use
• Job titles of key decision makers
• Any specific keywords or requirements
• Budget range or revenue size

Example: B2B SaaS companies in North America with 50-500 employees, using Salesforce or HubSpot, with annual revenue between $10M-$100M, targeting VP Sales, CRO, or Head of Sales roles..."
                        className="min-h-[200px]"
                        required
                      />
                    </div>

                    {/* File Upload */}
                    <div className="space-y-2">
                      <Label htmlFor="file">Upload CSV or Excel File (Optional)</Label>
                      <div className="flex items-center space-x-4">
                        <input
                          id="file"
                          type="file"
                          accept=".csv,.xlsx,.xls"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('file')?.click()}
                          className="flex items-center"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Choose File
                        </Button>
                        {formData.fileUpload && (
                          <span className="text-sm text-muted-foreground">
                            {formData.fileUpload.name}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Upload a list of companies to enrich with additional data
                      </p>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full btn-primary"
                      disabled={isSubmitting}
                      size="lg"
                    >
                      {isSubmitting ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Send className="mr-2 h-4 w-4" />
                      )}
                      Submit for AI-Powered Enrichment
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Process Steps */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="text-lg">How It Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-semibold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Submit Criteria</h4>
                      <p className="text-sm text-muted-foreground">Describe your ideal customer profile</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-semibold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">AI Processing</h4>
                      <p className="text-sm text-muted-foreground">Our algorithms find matching companies</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-semibold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Data Enrichment</h4>
                      <p className="text-sm text-muted-foreground">We enrich leads with contact info and insights</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-semibold text-sm">4</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Delivery</h4>
                      <p className="text-sm text-muted-foreground">Receive your qualified leads within 24 hours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="text-lg">What You Get</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-success mr-3 flex-shrink-0" />
                    <span>Verified contact information</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-success mr-3 flex-shrink-0" />
                    <span>Company tech stack analysis</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-success mr-3 flex-shrink-0" />
                    <span>AI-generated quality scores</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-success mr-3 flex-shrink-0" />
                    <span>LinkedIn and website URLs</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-success mr-3 flex-shrink-0" />
                    <span>CRM-ready data format</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-success mr-3 flex-shrink-0" />
                    <span>24-hour turnaround time</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;