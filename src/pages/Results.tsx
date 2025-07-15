import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import LeadCard from "@/components/LeadCard";
import EmailBuilder from "@/components/EmailBuilder";
import DataEnrichmentPanel from "@/components/DataEnrichmentPanel";
import AdvancedExportPanel from "@/components/AdvancedExportPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { AILeadScoring } from "@/utils/AILeadScoring";
import { EnhancedLead } from "@/utils/LeadExportService";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Download, 
  Grid, 
  List, 
  Filter, 
  RefreshCw, 
  CheckCircle,
  Clock,
  Target,
  Wand2,
  Database,
  Brain,
  Mail
} from "lucide-react";

const Results = () => {
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  // Dummy data for leads
  const dummyLeads = [
    {
      id: "1",
      companyName: "TechFlow Solutions",
      website: "https://techflow.com",
      linkedinUrl: "https://linkedin.com/company/techflow",
      industry: "SaaS",
      companySize: "51-200",
      country: "United States",
      keyPerson: "Sarah Johnson, VP Sales",
      email: "sarah.johnson@techflow.com",
      enrichmentScore: "A+",
      techStack: ["React", "AWS", "Salesforce", "HubSpot"],
      description: "B2B productivity software for remote teams"
    },
    {
      id: "2",
      companyName: "DataVault Inc",
      website: "https://datavault.com",
      linkedinUrl: "https://linkedin.com/company/datavault",
      industry: "FinTech",
      companySize: "101-500",
      country: "Canada",
      keyPerson: "Michael Chen, CEO",
      email: "m.chen@datavault.com",
      enrichmentScore: "A",
      techStack: ["Python", "AWS", "Stripe", "Slack"],
      description: "Enterprise data analytics platform"
    },
    {
      id: "3",
      companyName: "GrowthTech",
      website: "https://growthtech.io",
      linkedinUrl: "https://linkedin.com/company/growthtech",
      industry: "MarTech",
      companySize: "11-50",
      country: "United Kingdom",
      keyPerson: "Emma Wilson, Head of Growth",
      email: "emma@growthtech.io",
      enrichmentScore: "B+",
      techStack: ["Node.js", "MongoDB", "HubSpot"],
      description: "Marketing automation for e-commerce"
    },
    {
      id: "4",
      companyName: "CloudSecure",
      website: "https://cloudsecure.com",
      linkedinUrl: "https://linkedin.com/company/cloudsecure",
      industry: "Cybersecurity",
      companySize: "201-500",
      country: "Germany",
      keyPerson: "Hans Mueller, CTO",
      email: "h.mueller@cloudsecure.com",
      enrichmentScore: "A",
      techStack: ["Java", "AWS", "Kubernetes"],
      description: "Cloud security solutions for enterprises"
    }
  ];

  const [leads] = useState(dummyLeads);

  useEffect(() => {
    // Simulate loading with progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const handleAddToCRM = (leadId: string) => {
    toast({
      title: "Lead Added to CRM",
      description: "Lead has been successfully added to your CRM system.",
    });
  };

  const handleVerifyLead = (leadId: string) => {
    toast({
      title: "Lead Verification Started",
      description: "We're verifying the contact information for this lead.",
    });
  };

  const handleExportCSV = () => {
    const csvContent = [
      "Company Name,Website,Industry,Company Size,Country,Key Person,Email,Score",
      ...leads.map(lead => 
        `${lead.companyName},${lead.website},${lead.industry},${lead.companySize},${lead.country},${lead.keyPerson},${lead.email},${lead.enrichmentScore}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'caprae-leads.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Your leads have been exported to CSV format.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="card-elevated max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
              <CardTitle className="text-2xl">Discovering Leads...</CardTitle>
              <p className="text-muted-foreground">
                AI is analyzing thousands of companies to find your perfect prospects
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <Progress value={progress} className="w-full" />
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-success" />
                  Scanning company databases
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-success" />
                  Applying your filters
                </div>
                <div className="flex items-center">
                  {progress >= 70 ? (
                    <CheckCircle className="h-4 w-4 mr-2 text-success" />
                  ) : (
                    <Clock className="h-4 w-4 mr-2 text-primary animate-pulse" />
                  )}
                  Enriching lead data
                </div>
                <div className="flex items-center">
                  {progress >= 100 ? (
                    <CheckCircle className="h-4 w-4 mr-2 text-success" />
                  ) : (
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  )}
                  Generating quality scores
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Search Results
            </h1>
            <p className="text-muted-foreground">
              Found {leads.length} high-quality leads matching your criteria
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Refine
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              New Search
            </Button>
            <Button onClick={handleExportCSV} size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-primary mr-3" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{leads.length}</p>
                  <p className="text-xs text-muted-foreground">Total Leads</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center mr-3">
                  <span className="text-success font-bold text-sm">A+</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {leads.filter(l => l.enrichmentScore.includes('A')).length}
                  </p>
                  <p className="text-xs text-muted-foreground">High Quality</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-success mr-3" />
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {leads.filter(l => l.email).length}
                  </p>
                  <p className="text-xs text-muted-foreground">With Emails</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <span className="text-primary font-bold text-xs">$</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">94%</p>
                  <p className="text-xs text-muted-foreground">Match Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "cards" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("cards")}
            >
              <Grid className="h-4 w-4 mr-2" />
              Cards
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("table")}
            >
              <List className="h-4 w-4 mr-2" />
              Table
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Badge variant="outline">Quality Score</Badge>
          </div>
        </div>

        {/* Results Display */}
        {viewMode === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onAddToCRM={handleAddToCRM}
                onVerify={handleVerifyLead}
              />
            ))}
          </div>
        ) : (
          <Card className="card-elevated">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Key Person</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.companyName}</TableCell>
                    <TableCell>{lead.industry}</TableCell>
                    <TableCell>{lead.companySize}</TableCell>
                    <TableCell>{lead.country}</TableCell>
                    <TableCell>{lead.keyPerson}</TableCell>
                    <TableCell>
                      <Badge variant={lead.enrichmentScore.includes('A') ? 'default' : 'secondary'}>
                        {lead.enrichmentScore}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleVerifyLead(lead.id)}>
                          Verify
                        </Button>
                        <Button size="sm" onClick={() => handleAddToCRM(lead.id)}>
                          Add
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Results;