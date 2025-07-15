import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Globe, Linkedin, Mail, Star, Users, MapPin } from "lucide-react";

interface Lead {
  id: string;
  companyName: string;
  website: string;
  linkedinUrl: string;
  industry: string;
  companySize: string;
  country: string;
  keyPerson: string;
  email: string;
  enrichmentScore: string;
  logo?: string;
  techStack?: string[];
  description?: string;
}

interface LeadCardProps {
  lead: Lead;
  onAddToCRM: (leadId: string) => void;
  onVerify: (leadId: string) => void;
}

const LeadCard = ({ lead, onAddToCRM, onVerify }: LeadCardProps) => {
  const getScoreColor = (score: string) => {
    switch (score) {
      case "A+":
      case "A":
        return "bg-success text-success-foreground";
      case "B+":
      case "B":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getScoreIcon = (score: string) => {
    const starCount = score.includes("A") ? 5 : score.includes("B") ? 4 : 3;
    return Array.from({ length: starCount }, (_, i) => (
      <Star key={i} className="h-3 w-3 fill-current" />
    ));
  };

  return (
    <Card className="card-elevated hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              {lead.logo ? (
                <img src={lead.logo} alt={`${lead.companyName} logo`} className="h-8 w-8 rounded" />
              ) : (
                <Building2 className="h-6 w-6 text-primary" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">{lead.companyName}</h3>
              <p className="text-muted-foreground text-sm">{lead.industry}</p>
            </div>
          </div>
          
          {/* Lead Quality Score */}
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getScoreColor(lead.enrichmentScore)}`}>
            <div className="flex items-center space-x-1">
              <span>{lead.enrichmentScore}</span>
              <div className="flex space-x-0.5">
                {getScoreIcon(lead.enrichmentScore)}
              </div>
            </div>
          </div>
        </div>

        {/* Company Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-2" />
            <span>{lead.companySize} employees</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{lead.country}</span>
          </div>
        </div>

        {/* Key Person */}
        <div className="mb-4 p-3 bg-muted/50 rounded-lg">
          <h4 className="font-medium text-foreground mb-1">Key Contact</h4>
          <p className="text-sm text-muted-foreground">{lead.keyPerson}</p>
          {lead.email && (
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <Mail className="h-3 w-3 mr-1" />
              <span>{lead.email}</span>
            </div>
          )}
        </div>

        {/* Tech Stack */}
        {lead.techStack && lead.techStack.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">Tech Stack</p>
            <div className="flex flex-wrap gap-1">
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

        {/* Action Links */}
        <div className="flex items-center space-x-4 mb-4 text-sm">
          <a
            href={lead.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-primary hover:text-primary-glow transition-colors"
          >
            <Globe className="h-4 w-4 mr-1" />
            Website
          </a>
          <a
            href={lead.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-primary hover:text-primary-glow transition-colors"
          >
            <Linkedin className="h-4 w-4 mr-1" />
            LinkedIn
          </a>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            size="sm"
            className="flex-1 btn-primary"
            onClick={() => onAddToCRM(lead.id)}
          >
            Add to CRM
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onVerify(lead.id)}
          >
            Verify Lead
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadCard;