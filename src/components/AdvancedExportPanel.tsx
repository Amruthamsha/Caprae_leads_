import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { LeadExportService } from "@/utils/LeadExportService";
import { EnhancedLead } from "@/utils/LeadExportService";
import { 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Database, 
  Zap,
  ExternalLink,
  CheckCircle
} from "lucide-react";

interface AdvancedExportPanelProps {
  leads: EnhancedLead[];
  selectedLeads?: EnhancedLead[];
}

const AdvancedExportPanel = ({ leads, selectedLeads }: AdvancedExportPanelProps) => {
  const { toast } = useToast();
  const [zapierWebhook, setZapierWebhook] = useState('');
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel' | 'hubspot' | 'salesforce'>('csv');
  const [isExporting, setIsExporting] = useState(false);
  const [isSyncingZapier, setIsSyncingZapier] = useState(false);

  const leadsToExport = selectedLeads && selectedLeads.length > 0 ? selectedLeads : leads;

  const handleExport = async () => {
    if (leadsToExport.length === 0) {
      toast({
        title: "No Leads to Export",
        description: "Please ensure you have leads to export.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);

    try {
      switch (exportFormat) {
        case 'csv':
          await LeadExportService.exportToCSV(leadsToExport);
          break;
        case 'excel':
          await LeadExportService.exportToExcel(leadsToExport);
          break;
        case 'hubspot':
          await LeadExportService.exportToHubSpot(leadsToExport);
          break;
        case 'salesforce':
          await LeadExportService.exportToSalesforce(leadsToExport);
          break;
      }

      toast({
        title: "Export Successful",
        description: `${leadsToExport.length} leads exported in ${exportFormat.toUpperCase()} format.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting your leads.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleZapierSync = async () => {
    if (!zapierWebhook) {
      toast({
        title: "Webhook URL Required",
        description: "Please enter your Zapier webhook URL.",
        variant: "destructive",
      });
      return;
    }

    if (leadsToExport.length === 0) {
      toast({
        title: "No Leads to Sync",
        description: "Please ensure you have leads to sync.",
        variant: "destructive",
      });
      return;
    }

    setIsSyncingZapier(true);

    try {
      const success = await LeadExportService.syncWithZapier(leadsToExport, zapierWebhook);
      
      if (success) {
        toast({
          title: "Zapier Sync Initiated",
          description: `${leadsToExport.length} leads sent to Zapier. Check your Zap history to confirm processing.`,
        });
      } else {
        throw new Error('Sync failed');
      }
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Failed to sync with Zapier. Please check your webhook URL.",
        variant: "destructive",
      });
    } finally {
      setIsSyncingZapier(false);
    }
  };

  const exportOptions = [
    {
      value: 'csv',
      label: 'CSV',
      description: 'Standard comma-separated values',
      icon: FileText,
      recommended: false,
    },
    {
      value: 'excel',
      label: 'Excel',
      description: 'Microsoft Excel format',
      icon: FileSpreadsheet,
      recommended: false,
    },
    {
      value: 'hubspot',
      label: 'HubSpot Ready',
      description: 'Pre-formatted for HubSpot import',
      icon: Database,
      recommended: true,
    },
    {
      value: 'salesforce',
      label: 'Salesforce Ready',
      description: 'Pre-formatted for Salesforce import',
      icon: Database,
      recommended: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Export Formats */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Download className="mr-2 h-5 w-5 text-primary" />
            Advanced Export Options
          </CardTitle>
          <p className="text-muted-foreground">
            Export {leadsToExport.length} leads in various formats optimized for different CRM systems
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label>Export Format</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {exportOptions.map((option) => (
                <div
                  key={option.value}
                  className={`relative border rounded-lg p-4 cursor-pointer transition-all hover:border-primary/50 ${
                    exportFormat === option.value 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border'
                  }`}
                  onClick={() => setExportFormat(option.value as any)}
                >
                  {option.recommended && (
                    <div className="absolute -top-2 right-2">
                      <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                        Recommended
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-start space-x-3">
                    <option.icon className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-foreground">{option.label}</h3>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  </div>
                  
                  {exportFormat === option.value && (
                    <CheckCircle className="absolute top-2 right-2 h-4 w-4 text-primary" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full btn-primary"
            size="lg"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Exporting {leadsToExport.length} Leads...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export {leadsToExport.length} Leads as {exportFormat.toUpperCase()}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Zapier Integration */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Zap className="mr-2 h-5 w-5 text-primary" />
            Real-time CRM Sync
          </CardTitle>
          <p className="text-muted-foreground">
            Connect with 5000+ apps through Zapier for instant lead synchronization
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="bg-muted/50 border rounded-lg p-4">
              <h4 className="font-semibold text-foreground mb-2">How to Set Up Zapier Integration:</h4>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Create a new Zap in your Zapier account</li>
                <li>Choose "Webhooks by Zapier" as the trigger</li>
                <li>Select "Catch Hook" trigger type</li>
                <li>Copy the webhook URL provided by Zapier</li>
                <li>Paste the URL below and click "Sync to Zapier"</li>
              </ol>
            </div>

            <div className="space-y-2">
              <Label htmlFor="zapierWebhook">Zapier Webhook URL</Label>
              <Input
                id="zapierWebhook"
                value={zapierWebhook}
                onChange={(e) => setZapierWebhook(e.target.value)}
                placeholder="https://hooks.zapier.com/hooks/catch/..."
              />
              <p className="text-xs text-muted-foreground">
                Get this URL from your Zapier webhook trigger configuration
              </p>
            </div>

            <Button
              onClick={handleZapierSync}
              disabled={isSyncingZapier || !zapierWebhook}
              variant="outline"
              className="w-full"
              size="lg"
            >
              {isSyncingZapier ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                  Syncing to Zapier...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Sync {leadsToExport.length} Leads to Zapier
                </>
              )}
            </Button>
          </div>

          {/* Popular CRM Integrations */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Popular CRM Integrations:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                'HubSpot', 'Salesforce', 'Pipedrive', 'Monday.com',
                'Airtable', 'Google Sheets', 'Notion', 'Slack'
              ].map((crm) => (
                <div
                  key={crm}
                  className="text-center p-3 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <p className="text-sm font-medium text-foreground">{crm}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Preview */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Export Preview</CardTitle>
          <p className="text-muted-foreground">
            Sample of data that will be included in your export
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Fields Included:</span>
                <ul className="text-foreground mt-1 space-y-1">
                  <li>• Company Name</li>
                  <li>• Website & LinkedIn</li>
                  <li>• Industry & Size</li>
                  <li>• Contact Information</li>
                </ul>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">AI Data:</span>
                <ul className="text-foreground mt-1 space-y-1">
                  <li>• Lead Quality Score</li>
                  <li>• Score Reasoning</li>
                  <li>• Tech Stack</li>
                  <li>• Market Category</li>
                </ul>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Enriched Data:</span>
                <ul className="text-foreground mt-1 space-y-1">
                  <li>• Email Validation</li>
                  <li>• Domain Authority</li>
                  <li>• Employee Count</li>
                  <li>• Social Profiles</li>
                </ul>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">CRM Fields:</span>
                <ul className="text-foreground mt-1 space-y-1">
                  <li>• Lead Status</li>
                  <li>• Tags & Notes</li>
                  <li>• Last Contacted</li>
                  <li>• Assigned User</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedExportPanel;