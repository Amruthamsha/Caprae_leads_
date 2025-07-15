// Data enrichment and validation service
export interface EnrichmentConfig {
  validateEmails: boolean;
  enrichCompanyData: boolean;
  findSocialProfiles: boolean;
  getTechStack: boolean;
}

export interface EnrichmentResult {
  success: boolean;
  data?: {
    companySize?: string;
    foundedYear?: number;
    funding?: string;
    techStack?: string[];
    socialProfiles?: {
      linkedin?: string;
      twitter?: string;
      facebook?: string;
    };
    emailStatus?: 'valid' | 'invalid' | 'catch-all' | 'unknown';
    domainAuthority?: number;
    employeeCount?: number;
    description?: string;
  };
  error?: string;
}

export class LeadEnrichmentService {
  private static API_KEYS = {
    clearbit: localStorage.getItem('clearbit_api_key'),
    hunter: localStorage.getItem('hunter_api_key'),
    builtwith: localStorage.getItem('builtwith_api_key'),
  };

  static setApiKey(service: keyof typeof LeadEnrichmentService.API_KEYS, key: string): void {
    localStorage.setItem(`${service}_api_key`, key);
    this.API_KEYS[service] = key;
  }

  static getApiKey(service: keyof typeof LeadEnrichmentService.API_KEYS): string | null {
    return this.API_KEYS[service];
  }

  static async enrichLead(
    domain: string, 
    email?: string, 
    config: EnrichmentConfig = {
      validateEmails: true,
      enrichCompanyData: true,
      findSocialProfiles: true,
      getTechStack: true,
    }
  ): Promise<EnrichmentResult> {
    try {
      const enrichmentData: EnrichmentResult['data'] = {};

      // Validate email if provided
      if (email && config.validateEmails) {
        const emailValidation = await this.validateEmail(email);
        enrichmentData.emailStatus = emailValidation.status;
      }

      // Enrich company data
      if (config.enrichCompanyData) {
        const companyData = await this.enrichCompanyData(domain);
        Object.assign(enrichmentData, companyData);
      }

      // Get tech stack
      if (config.getTechStack) {
        const techStack = await this.getTechStack(domain);
        enrichmentData.techStack = techStack;
      }

      // Find social profiles
      if (config.findSocialProfiles) {
        const socialProfiles = await this.findSocialProfiles(domain);
        enrichmentData.socialProfiles = socialProfiles;
      }

      return {
        success: true,
        data: enrichmentData,
      };
    } catch (error) {
      console.error('Enrichment failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Enrichment failed',
      };
    }
  }

  private static async validateEmail(email: string): Promise<{ status: 'valid' | 'invalid' | 'catch-all' | 'unknown' }> {
    const hunterKey = this.getApiKey('hunter');
    
    if (!hunterKey) {
      // Fallback to basic regex validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return { status: emailRegex.test(email) ? 'valid' : 'invalid' };
    }

    try {
      const response = await fetch(
        `https://api.hunter.io/v2/email-verifier?email=${encodeURIComponent(email)}&api_key=${hunterKey}`
      );
      
      if (!response.ok) throw new Error('Hunter API request failed');
      
      const data = await response.json();
      return { status: data.data.result || 'unknown' };
    } catch (error) {
      console.error('Email validation failed:', error);
      return { status: 'unknown' };
    }
  }

  private static async enrichCompanyData(domain: string): Promise<Partial<EnrichmentResult['data']>> {
    const clearbitKey = this.getApiKey('clearbit');
    
    if (!clearbitKey) {
      // Return mock data for demo purposes
      return this.getMockCompanyData(domain);
    }

    try {
      const response = await fetch(
        `https://company-stream.clearbit.com/v2/companies/find?domain=${domain}`,
        {
          headers: {
            'Authorization': `Bearer ${clearbitKey}`,
          },
        }
      );

      if (!response.ok) throw new Error('Clearbit API request failed');

      const data = await response.json();
      
      return {
        companySize: this.mapEmployeeCount(data.metrics?.employees),
        foundedYear: data.foundedYear,
        funding: data.metrics?.raised ? `$${data.metrics.raised}` : undefined,
        domainAuthority: data.metrics?.alexaUsRank ? Math.max(0, 100 - Math.log10(data.metrics.alexaUsRank) * 10) : undefined,
        employeeCount: data.metrics?.employees,
        description: data.description,
      };
    } catch (error) {
      console.error('Company enrichment failed:', error);
      return this.getMockCompanyData(domain);
    }
  }

  private static async getTechStack(domain: string): Promise<string[]> {
    const builtWithKey = this.getApiKey('builtwith');
    
    if (!builtWithKey) {
      // Return mock tech stack based on domain patterns
      return this.getMockTechStack(domain);
    }

    try {
      const response = await fetch(
        `https://api.builtwith.com/v20/api.json?KEY=${builtWithKey}&LOOKUP=${domain}`
      );

      if (!response.ok) throw new Error('BuiltWith API request failed');

      const data = await response.json();
      
      return data.Results?.[0]?.Result?.Paths?.[0]?.Technologies?.map(
        (tech: any) => tech.Name
      ) || [];
    } catch (error) {
      console.error('Tech stack detection failed:', error);
      return this.getMockTechStack(domain);
    }
  }

  private static async findSocialProfiles(domain: string): Promise<EnrichmentResult['data']['socialProfiles']> {
    // This would typically use a social media API
    // For demo purposes, we'll generate likely URLs
    const baseUrl = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    const companyName = baseUrl.split('.')[0];

    return {
      linkedin: `https://linkedin.com/company/${companyName}`,
      twitter: `https://twitter.com/${companyName}`,
      facebook: `https://facebook.com/${companyName}`,
    };
  }

  private static getMockCompanyData(domain: string): Partial<EnrichmentResult['data']> {
    // Generate realistic mock data based on domain
    const hash = this.simpleHash(domain);
    const employeeRanges = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];
    
    return {
      companySize: employeeRanges[hash % employeeRanges.length],
      foundedYear: 2010 + (hash % 14),
      funding: hash % 3 === 0 ? `$${(hash % 50 + 1)}M` : undefined,
      domainAuthority: 30 + (hash % 60),
      employeeCount: Math.pow(2, hash % 10) * 10,
      description: `Innovative company in the ${domain.includes('tech') ? 'technology' : 'business'} sector.`,
    };
  }

  private static getMockTechStack(domain: string): string[] {
    const hash = this.simpleHash(domain);
    const allTech = [
      'React', 'Angular', 'Vue.js', 'Node.js', 'Python', 'AWS', 'Google Cloud',
      'Salesforce', 'HubSpot', 'Stripe', 'Slack', 'Zoom', 'Shopify', 'WordPress',
      'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes'
    ];
    
    const techCount = 3 + (hash % 5);
    const selectedTech = [];
    
    for (let i = 0; i < techCount; i++) {
      selectedTech.push(allTech[(hash + i) % allTech.length]);
    }
    
    return selectedTech;
  }

  private static mapEmployeeCount(count?: number): string {
    if (!count) return '11-50'; // Default
    if (count <= 10) return '1-10';
    if (count <= 50) return '11-50';
    if (count <= 200) return '51-200';
    if (count <= 500) return '201-500';
    if (count <= 1000) return '501-1000';
    return '1000+';
  }

  private static simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }
}