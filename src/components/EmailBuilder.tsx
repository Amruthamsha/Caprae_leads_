import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmailPersonaBuilder, PersonaContext, EmailTemplate } from "@/utils/EmailPersonaBuilder";
import { EnhancedLead } from "@/utils/LeadExportService";
import { Copy, Send, RefreshCw, Wand2, Users, Target, MessageSquare } from "lucide-react";

interface EmailBuilderProps {
  lead: EnhancedLead;
  onClose: () => void;
}

const EmailBuilder = ({ lead, onClose }: EmailBuilderProps) => {
  const { toast } = useToast();
  const [persona, setPersona] = useState<PersonaContext>({
    senderName: "",
    senderCompany: "",
    senderRole: "",
    valueProposition: "",
    industry: "",
  });
  
  const [generatedTemplates, setGeneratedTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateTemplates = async () => {
    if (!persona.senderName || !persona.senderCompany || !persona.valueProposition) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required persona fields.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      const templates = EmailPersonaBuilder.generateMultipleTones(lead, persona);
      setGeneratedTemplates(templates);
      setSelectedTemplate(templates[0]);
      setIsGenerating(false);
      
      toast({
        title: "Templates Generated",
        description: `Created ${templates.length} personalized email templates.`,
      });
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "Email template copied successfully.",
    });
  };

  const exportTemplate = (template: EmailTemplate) => {
    const content = `Subject: ${template.subject}\n\n${template.body}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email-template-${lead.companyName.toLowerCase().replace(/\s+/g, '-')}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Template Exported",
      description: "Email template saved as text file.",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center text-xl">
                <Wand2 className="mr-2 h-5 w-5 text-primary" />
                Email Persona Builder
              </CardTitle>
              <p className="text-muted-foreground">
                Generate personalized outreach emails for {lead.companyName}
              </p>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Persona Configuration */}
            <div className="space-y-6">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Users className="mr-2 h-4 w-4 text-primary" />
                    Your Persona
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="senderName">Your Name *</Label>
                      <Input
                        id="senderName"
                        value={persona.senderName}
                        onChange={(e) => setPersona(prev => ({ ...prev, senderName: e.target.value }))}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="senderRole">Your Role *</Label>
                      <Input
                        id="senderRole"
                        value={persona.senderRole}
                        onChange={(e) => setPersona(prev => ({ ...prev, senderRole: e.target.value }))}
                        placeholder="VP of Sales"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="senderCompany">Your Company *</Label>
                    <Input
                      id="senderCompany"
                      value={persona.senderCompany}
                      onChange={(e) => setPersona(prev => ({ ...prev, senderCompany: e.target.value }))}
                      placeholder="Caprae Solutions"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="industry">Your Industry</Label>
                    <Select
                      value={persona.industry}
                      onValueChange={(value) => setPersona(prev => ({ ...prev, industry: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SaaS">SaaS</SelectItem>
                        <SelectItem value="FinTech">FinTech</SelectItem>
                        <SelectItem value="MarTech">MarTech</SelectItem>
                        <SelectItem value="Consulting">Consulting</SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="valueProposition">Value Proposition *</Label>
                    <Textarea
                      id="valueProposition"
                      value={persona.valueProposition}
                      onChange={(e) => setPersona(prev => ({ ...prev, valueProposition: e.target.value }))}
                      placeholder="We help companies like yours reduce operational costs by 30% while improving efficiency through AI-powered automation..."
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Lead Context */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Target className="mr-2 h-4 w-4 text-primary" />
                    Target Lead Context
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">Company:</span>
                      <p className="font-semibold">{lead.companyName}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Industry:</span>
                      <p className="font-semibold">{lead.industry}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Size:</span>
                      <p className="font-semibold">{lead.companySize} employees</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Score:</span>
                      <Badge variant={lead.score?.category === 'High Potential' ? 'default' : 'secondary'}>
                        {lead.score?.category || 'Unscored'}
                      </Badge>
                    </div>
                  </div>
                  
                  {lead.techStack && lead.techStack.length > 0 && (
                    <div>
                      <span className="font-medium text-muted-foreground text-sm">Tech Stack:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {lead.techStack.slice(0, 4).map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {lead.techStack.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{lead.techStack.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Button 
                onClick={handleGenerateTemplates}
                disabled={isGenerating}
                className="w-full btn-primary"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating AI Templates...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Email Templates
                  </>
                )}
              </Button>
            </div>

            {/* Generated Templates */}
            <div className="space-y-6">
              {generatedTemplates.length > 0 && (
                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <MessageSquare className="mr-2 h-4 w-4 text-primary" />
                      Generated Templates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={selectedTemplate?.tone} onValueChange={(tone) => {
                      const template = generatedTemplates.find(t => t.tone === tone);
                      if (template) setSelectedTemplate(template);
                    }}>
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="professional">Professional</TabsTrigger>
                        <TabsTrigger value="friendly">Friendly</TabsTrigger>
                        <TabsTrigger value="corporate">Corporate</TabsTrigger>
                      </TabsList>
                      
                      {generatedTemplates.map((template) => (
                        <TabsContent key={template.tone} value={template.tone} className="space-y-4 mt-4">
                          <div className="space-y-3">
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Subject Line</Label>
                              <div className="relative">
                                <Input
                                  value={template.subject}
                                  readOnly
                                  className="pr-10"
                                />
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="absolute right-1 top-1 h-8 w-8 p-0"
                                  onClick={() => copyToClipboard(template.subject)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Email Body</Label>
                              <div className="relative">
                                <Textarea
                                  value={template.body}
                                  readOnly
                                  className="min-h-[300px] pr-10"
                                />
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="absolute right-1 top-1 h-8 w-8 p-0"
                                  onClick={() => copyToClipboard(template.body)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button
                                onClick={() => copyToClipboard(`Subject: ${template.subject}\n\n${template.body}`)}
                                variant="outline"
                                className="flex-1"
                              >
                                <Copy className="mr-2 h-4 w-4" />
                                Copy Full Email
                              </Button>
                              <Button
                                onClick={() => exportTemplate(template)}
                                variant="outline"
                              >
                                <Send className="mr-2 h-4 w-4" />
                                Export
                              </Button>
                            </div>
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </CardContent>
                </Card>
              )}

              {generatedTemplates.length === 0 && (
                <Card className="card-elevated">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Ready to Generate Templates
                    </h3>
                    <p className="text-muted-foreground mb-4 max-w-sm">
                      Fill in your persona details and click "Generate Email Templates" to create 
                      personalized outreach emails for {lead.companyName}.
                    </p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>✓ AI-powered personalization</p>
                      <p>✓ Multiple tone variations</p>
                      <p>✓ Industry-specific messaging</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailBuilder;