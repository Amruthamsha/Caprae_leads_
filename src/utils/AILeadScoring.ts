// Advanced AI-powered lead scoring system
export interface LeadData {
  id: string;
  companyName: string;
  website: string;
  industry: string;
  companySize: string;
  country: string;
  techStack?: string[];
  linkedinUrl?: string;
  email?: string;
  domainAuthority?: number;
  linkedinFollowers?: number;
  fundingStage?: string;
  recentNews?: boolean;
  growthRate?: number;
}

export interface LeadScore {
  overall: number; // 0-100
  category: 'High Potential' | 'Warm' | 'Cold' | 'Early-Stage';
  factors: {
    companySize: number;
    techStackMatch: number;
    domainAuthority: number;
    socialPresence: number;
    marketTiming: number;
  };
  reasoning: string[];
}

export class AILeadScoring {
  // Define ideal customer profile weights
  private static ICP_WEIGHTS = {
    companySize: 0.25,
    techStackMatch: 0.20,
    domainAuthority: 0.20,
    socialPresence: 0.15,
    marketTiming: 0.20,
  };

  // Target tech stack for scoring
  private static TARGET_TECH_STACK = [
    'Salesforce', 'HubSpot', 'React', 'AWS', 'Stripe', 
    'Slack', 'Zoom', 'Shopify', 'WordPress'
  ];

  static calculateLeadScore(lead: LeadData): LeadScore {
    const factors = this.calculateFactors(lead);
    const overall = this.calculateOverallScore(factors);
    const category = this.determineCategory(overall, factors);
    const reasoning = this.generateReasoning(lead, factors);

    return {
      overall: Math.round(overall),
      category,
      factors,
      reasoning,
    };
  }

  private static calculateFactors(lead: LeadData) {
    return {
      companySize: this.scoreCompanySize(lead.companySize),
      techStackMatch: this.scoreTechStack(lead.techStack || []),
      domainAuthority: this.scoreDomainAuthority(lead.domainAuthority || 0),
      socialPresence: this.scoreSocialPresence(lead.linkedinFollowers || 0),
      marketTiming: this.scoreMarketTiming(lead),
    };
  }

  private static scoreCompanySize(size: string): number {
    const sizeMap: Record<string, number> = {
      '1-10': 20,
      '11-50': 60,
      '51-200': 85,
      '201-500': 95,
      '501-1000': 90,
      '1000+': 75,
    };
    return sizeMap[size] || 50;
  }

  private static scoreTechStack(techStack: string[]): number {
    if (techStack.length === 0) return 30;
    
    const matches = techStack.filter(tech => 
      this.TARGET_TECH_STACK.includes(tech)
    ).length;
    
    const matchPercentage = matches / this.TARGET_TECH_STACK.length;
    return Math.min(100, 40 + (matchPercentage * 60));
  }

  private static scoreDomainAuthority(da: number): number {
    if (da === 0) return 40; // Unknown
    if (da < 20) return 20;
    if (da < 40) return 50;
    if (da < 60) return 70;
    if (da < 80) return 85;
    return 95;
  }

  private static scoreSocialPresence(followers: number): number {
    if (followers === 0) return 30;
    if (followers < 1000) return 40;
    if (followers < 5000) return 60;
    if (followers < 25000) return 80;
    return 95;
  }

  private static scoreMarketTiming(lead: LeadData): number {
    let score = 50; // Base score
    
    if (lead.recentNews) score += 20;
    if (lead.fundingStage === 'Series A' || lead.fundingStage === 'Series B') score += 25;
    if (lead.growthRate && lead.growthRate > 50) score += 20;
    
    return Math.min(100, score);
  }

  private static calculateOverallScore(factors: LeadScore['factors']): number {
    return Object.entries(this.ICP_WEIGHTS).reduce((total, [key, weight]) => {
      return total + (factors[key as keyof typeof factors] * weight);
    }, 0);
  }

  private static determineCategory(score: number, factors: LeadScore['factors']): LeadScore['category'] {
    if (score >= 80) return 'High Potential';
    if (score >= 60) return 'Warm';
    if (score >= 40) return 'Cold';
    return 'Early-Stage';
  }

  private static generateReasoning(lead: LeadData, factors: LeadScore['factors']): string[] {
    const reasoning: string[] = [];

    if (factors.companySize >= 80) {
      reasoning.push('Optimal company size for our solution');
    }
    if (factors.techStackMatch >= 70) {
      reasoning.push('Strong technology stack alignment');
    }
    if (factors.domainAuthority >= 70) {
      reasoning.push('High domain authority indicates established presence');
    }
    if (factors.socialPresence >= 70) {
      reasoning.push('Strong social media presence');
    }
    if (factors.marketTiming >= 70) {
      reasoning.push('Excellent market timing indicators');
    }

    if (reasoning.length === 0) {
      reasoning.push('Standard lead profile, requires nurturing');
    }

    return reasoning;
  }
}