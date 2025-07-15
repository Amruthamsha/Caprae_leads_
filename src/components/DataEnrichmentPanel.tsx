import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { LeadEnrichmentService, EnrichmentConfig } from "@/utils/LeadEnrichmentService";
import { EnhancedLead } from "@/utils/LeadExportService";
import { 
  Database, 
  Key, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  Settings,
  Globe,
  Mail,
  Users,
  Code
} from "lucide-react";

interface DataEnrichmentPanelProps {
  leads: EnhancedLead[];
  onLeadsEnriched: (enrichedLeads: EnhancedLead[]) => void;
}

const DataEnrichmentPanel = ({ leads, onLeadsEnriched }: DataEnrichmentPanelProps) => {
  const { toast } = useToast();
  const [isEnriching, setIsEnriching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [apiKeys, setApiKeys] = useState({
    clearbit: LeadEnrichmentService.getApiKey('clearbit') || '',
    hunter: LeadEnrichmentService.getApiKey('hunter') || '',
    builtwith: LeadEnrichmentService.getApiKey('builtwith') || '',
  });

  const [enrichmentConfig, setEnrichmentConfig] = useState<EnrichmentConfig>({
    validateEmails: true,
    enrichCompanyData: true,
    findSocialProfiles: true,
    getTechStack: true,
  });

  const [enrichmentResults, setEnrichmentResults] = useState<{
    processed: number;
    enriched: number;
    failed: number;
  }>({
    processed: 0,
    enriched: 0,
    failed: 0,
  });

  const handleApiKeyChange = (service: keyof typeof apiKeys, value: string) => {
    setApiKeys(prev => ({ ...prev, [service]: value }));
    if (value) {
      LeadEnrichmentService.setApiKey(service, value);
    }
  };

  const handleEnrichLeads = async () => {
    setIsEnriching(true);
    setProgress(0);
    setEnrichmentResults({ processed: 0, enriched: 0, failed: 0 });

    const enrichedLeads: EnhancedLead[] = [];
    let processed = 0;
    let enriched = 0;
    let failed = 0;

    for (const lead of leads) {
      try {
        const result = await LeadEnrichmentService.enrichLead(
          lead.website,
          lead.email,
          enrichmentConfig
        );

        const enhancedLead: EnhancedLead = { ...lead };

        if (result.success && result.data) {
          // Update lead with enriched data
          if (result.data.companySize) enhancedLead.companySize = result.data.companySize;
          if (result.data.techStack) enhancedLead.techStack = result.data.techStack;
          if (result.data.domainAuthority) enhancedLead.domainAuthority = result.data.domainAuthority;
          if (result.data.employeeCount) enhancedLead.linkedinFollowers = result.data.employeeCount;
          if (result.data.socialProfiles?.linkedin) {
            enhancedLead.linkedinUrl = result.data.socialProfiles.linkedin;
          }

          enriched++;
        } else {
          failed++;
        }

        enrichedLeads.push(enhancedLead);
        processed++;

        // Update progress
        const progressPercent = (processed / leads.length) * 100;
        setProgress(progressPercent);
        setEnrichmentResults({ processed, enriched, failed });

        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 300));

      } catch (error) {
        console.error('Enrichment error:', error);
        enrichedLeads.push(lead);
        processed++;
        failed++;
      }
    }

    setIsEnriching(false);
    onLeadsEnriched(enrichedLeads);

    toast({
      title: "Enrichment Complete",
      description: `Processed ${processed} leads. ${enriched} enriched successfully.`,
    });
  };

  const hasAnyApiKey = Object.values(apiKeys).some(key => key.length > 0);

  return (
    <Card className="card-elevated">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Database className="mr-2 h-5 w-5 text-primary" />
          Data Enrichment & Validation
        </CardTitle>
        <p className="text-muted-foreground">
          Enhance your leads with additional company data, contact validation, and tech stack information
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* API Keys Configuration */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Key className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">API Keys Configuration</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clearbit">Clearbit API Key</Label>
              <Input
                id="clearbit"
                type="password"
                value={apiKeys.clearbit}
                onChange={(e) => handleApiKeyChange('clearbit', e.target.value)}
                placeholder="sk_..."
              />
              <p className="text-xs text-muted-foreground">For company data enrichment</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hunter">Hunter.io API Key</Label>
              <Input
                id="hunter"
                type="password"
                value={apiKeys.hunter}
                onChange={(e) => handleApiKeyChange('hunter', e.target.value)}
                placeholder="..."
              />
              <p className="text-xs text-muted-foreground">For email validation</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="builtwith">BuiltWith API Key</Label>
              <Input
                id="builtwith"
                type="password"
                value={apiKeys.builtwith}
                onChange={(e) => handleApiKeyChange('builtwith', e.target.value)}
                placeholder="..."
              />
              <p className="text-xs text-muted-foreground">For tech stack detection</p>
            </div>
          </div>

          {!hasAnyApiKey && (
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <p className="text-sm font-medium">Demo Mode</p>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                No API keys configured. Enrichment will use mock data for demonstration.
                Add real API keys above for live data enrichment.
              </p>
            </div>
          )}
        </div>

        {/* Enrichment Configuration */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Settings className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Enrichment Options</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="validateEmails">Validate Email Addresses</Label>
              </div>
              <Switch
                id="validateEmails"
                checked={enrichmentConfig.validateEmails}
                onCheckedChange={(checked) => 
                  setEnrichmentConfig(prev => ({ ...prev, validateEmails: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="enrichCompanyData">Enrich Company Data</Label>
              </div>
              <Switch
                id="enrichCompanyData"
                checked={enrichmentConfig.enrichCompanyData}
                onCheckedChange={(checked) => 
                  setEnrichmentConfig(prev => ({ ...prev, enrichCompanyData: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="findSocialProfiles">Find Social Profiles</Label>
              </div>
              <Switch
                id="findSocialProfiles"
                checked={enrichmentConfig.findSocialProfiles}
                onCheckedChange={(checked) => 
                  setEnrichmentConfig(prev => ({ ...prev, findSocialProfiles: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Code className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="getTechStack">Detect Tech Stack</Label>
              </div>
              <Switch
                id="getTechStack"
                checked={enrichmentConfig.getTechStack}
                onCheckedChange={(checked) => 
                  setEnrichmentConfig(prev => ({ ...prev, getTechStack: checked }))
                }
              />
            </div>
          </div>
        </div>

        {/* Progress & Results */}
        {isEnriching && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Enriching leads...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-foreground">{enrichmentResults.processed}</p>
                <p className="text-xs text-muted-foreground">Processed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-success">{enrichmentResults.enriched}</p>
                <p className="text-xs text-muted-foreground">Enriched</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-destructive">{enrichmentResults.failed}</p>
                <p className="text-xs text-muted-foreground">Failed</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={handleEnrichLeads}
          disabled={isEnriching || leads.length === 0}
          className="w-full btn-primary"
          size="lg"
        >
          {isEnriching ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Enriching {leads.length} Leads...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Enrich {leads.length} Leads
            </>
          )}
        </Button>

        {/* Info Panel */}
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
          <h4 className="font-semibold text-foreground mb-2">What You'll Get:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 text-success" />
              <span>Email validation status</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 text-success" />
              <span>Company size & employee count</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 text-success" />
              <span>Technology stack detection</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 text-success" />
              <span>Social media profiles</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 text-success" />
              <span>Domain authority scores</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 text-success" />
              <span>Company descriptions</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataEnrichmentPanel;