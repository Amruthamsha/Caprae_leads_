// Email persona and template generation service
import type { EnhancedLead } from './LeadExportService';

export interface EmailTemplate {
  subject: string;
  body: string;
  tone: 'professional' | 'friendly' | 'casual' | 'corporate';
  templateType: 'cold_outreach' | 'follow_up' | 'demo_request' | 'introduction';
}

export interface PersonaContext {
  senderName: string;
  senderCompany: string;
  senderRole: string;
  valueProposition: string;
  industry: string;
}

export class EmailPersonaBuilder {
  private static templates = {
    cold_outreach: {
      professional: {
        subject: "Quick question about {{company}}'s {{pain_point}}",
        body: `Hi {{contact_name}},

I noticed {{company}} is {{company_context}}. Many {{industry}} companies like yours are looking to {{value_prop_context}}.

We've helped similar companies {{specific_benefit}}. For example, {{example_result}}.

Would you be open to a 15-minute conversation to explore how this could apply to {{company}}?

Best regards,
{{sender_name}}
{{sender_role}} at {{sender_company}}`
      },
      friendly: {
        subject: "Love what {{company}} is doing in {{industry}}!",
        body: `Hi {{contact_name}},

Hope you're having a great week! I came across {{company}} and was really impressed by {{company_context}}.

I work with {{industry}} companies to {{value_proposition}}, and I think there might be a great fit here. We've helped companies like {{example_company}} achieve {{specific_benefit}}.

Would love to chat for 10 minutes about how we could help {{company}} {{main_benefit}}. 

When works best for you?

Cheers,
{{sender_name}}`
      },
      corporate: {
        subject: "Partnership opportunity for {{company}}",
        body: `Dear {{contact_name}},

I am reaching out regarding a potential partnership opportunity that could benefit {{company}}.

Our platform has demonstrated significant value for {{industry}} organizations, delivering {{key_metrics}}. Given {{company}}'s position in the market and {{company_context}}, I believe there is strong alignment.

I would welcome the opportunity to discuss how our solution could support {{company}}'s {{business_objective}}.

Would you be available for a brief call next week?

Sincerely,
{{sender_name}}
{{sender_title}}
{{sender_company}}`
      }
    },
    follow_up: {
      professional: {
        subject: "Following up on our {{company}} conversation",
        body: `Hi {{contact_name}},

I wanted to follow up on my previous email about {{value_proposition}} for {{company}}.

I understand you're likely busy, but I thought you might be interested in this quick case study: {{case_study_headline}}.

{{specific_result_detail}}

Happy to share more details if this resonates. Would a brief 10-minute call work for you this week?

Best,
{{sender_name}}`
      }
    },
    demo_request: {
      professional: {
        subject: "{{company}} + {{sender_company}}: 15-minute demo",
        body: `Hi {{contact_name}},

Based on our previous conversation and {{company}}'s focus on {{business_focus}}, I'd love to show you exactly how {{sender_company}} could help {{main_benefit}}.

The demo takes just 15 minutes and covers:
• {{benefit_1}}
• {{benefit_2}}  
• {{benefit_3}}

I have availability {{availability}}. What works best for you?

Looking forward to connecting,
{{sender_name}}`
      }
    }
  };

  static generateEmailTemplate(
    lead: EnhancedLead, 
    persona: PersonaContext, 
    templateType: EmailTemplate['templateType'] = 'cold_outreach',
    tone: EmailTemplate['tone'] = 'professional'
  ): EmailTemplate {
    const template = this.templates[templateType]?.[tone] || this.templates.cold_outreach.professional;
    
    const context = this.buildTemplateContext(lead, persona);
    
    return {
      subject: this.fillTemplate(template.subject, context),
      body: this.fillTemplate(template.body, context),
      tone,
      templateType,
    };
  }

  static generateMultipleTones(lead: EnhancedLead, persona: PersonaContext): EmailTemplate[] {
    const tones: EmailTemplate['tone'][] = ['professional', 'friendly', 'corporate'];
    return tones.map(tone => this.generateEmailTemplate(lead, persona, 'cold_outreach', tone));
  }

  private static buildTemplateContext(lead: EnhancedLead, persona: PersonaContext) {
    const contactName = this.extractContactName(lead.email);
    const companyContext = this.generateCompanyContext(lead);
    const valuePropContext = this.generateValuePropContext(lead, persona);
    
    return {
      company: lead.companyName,
      contact_name: contactName,
      industry: lead.industry,
      company_context: companyContext,
      value_prop_context: valuePropContext,
      value_proposition: persona.valueProposition,
      sender_name: persona.senderName,
      sender_company: persona.senderCompany,
      sender_role: persona.senderRole,
      sender_title: persona.senderRole,
      pain_point: this.getPainPoint(lead.industry),
      specific_benefit: this.getSpecificBenefit(lead.industry, persona.industry),
      example_result: this.getExampleResult(lead.industry),
      example_company: this.getExampleCompany(lead.industry),
      main_benefit: this.getMainBenefit(lead, persona),
      key_metrics: this.getKeyMetrics(persona.industry),
      business_objective: this.getBusinessObjective(lead.industry),
      case_study_headline: this.getCaseStudyHeadline(lead.industry),
      specific_result_detail: this.getSpecificResultDetail(lead.industry),
      business_focus: this.getBusinessFocus(lead),
      benefit_1: this.getBenefit(1, lead.industry),
      benefit_2: this.getBenefit(2, lead.industry),
      benefit_3: this.getBenefit(3, lead.industry),
      availability: this.getAvailability(),
    };
  }

  private static fillTemplate(template: string, context: Record<string, string>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return context[key] || match;
    });
  }

  private static extractContactName(email?: string): string {
    if (!email) return 'there';
    
    const localPart = email.split('@')[0];
    const nameParts = localPart.split(/[._-]/);
    
    if (nameParts.length >= 2) {
      return nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1);
    }
    
    return 'there';
  }

  private static generateCompanyContext(lead: EnhancedLead): string {
    const contexts = [
      `growing rapidly in the ${lead.industry} space`,
      `leading innovation in ${lead.industry}`,
      `scaling operations in ${lead.country}`,
      `expanding their ${lead.industry} solutions`,
      `building impressive ${lead.industry} capabilities`
    ];
    
    const hash = this.simpleHash(lead.companyName);
    return contexts[hash % contexts.length];
  }

  private static generateValuePropContext(lead: EnhancedLead, persona: PersonaContext): string {
    const props = [
      `streamline their ${lead.industry} operations`,
      `accelerate growth in ${lead.industry}`,
      `optimize their technology stack`,
      `improve operational efficiency`,
      `scale their business more effectively`
    ];
    
    const hash = this.simpleHash(lead.companyName + persona.industry);
    return props[hash % props.length];
  }

  private static getPainPoint(industry: string): string {
    const painPoints: Record<string, string> = {
      'SaaS': 'customer acquisition costs',
      'FinTech': 'regulatory compliance',
      'E-commerce': 'conversion optimization',
      'Healthcare': 'patient data management',
      'EdTech': 'student engagement',
      'MarTech': 'lead attribution',
      'default': 'operational efficiency'
    };
    
    return painPoints[industry] || painPoints.default;
  }

  private static getSpecificBenefit(leadIndustry: string, senderIndustry: string): string {
    return `reduce operational costs by 30% while improving ${leadIndustry} performance`;
  }

  private static getExampleResult(industry: string): string {
    const results: Record<string, string> = {
      'SaaS': 'one client reduced churn by 40% in 6 months',
      'FinTech': 'a fintech startup improved compliance efficiency by 60%',
      'E-commerce': 'an e-commerce company increased conversions by 25%',
      'default': 'clients typically see 30% efficiency improvements'
    };
    
    return results[industry] || results.default;
  }

  private static getExampleCompany(industry: string): string {
    const companies: Record<string, string> = {
      'SaaS': 'TechFlow Solutions',
      'FinTech': 'PaymentCorp',
      'E-commerce': 'ShopFast',
      'default': 'InnovateCorp'
    };
    
    return companies[industry] || companies.default;
  }

  private static getMainBenefit(lead: EnhancedLead, persona: PersonaContext): string {
    return `scale their ${lead.industry} operations more efficiently`;
  }

  private static getKeyMetrics(industry: string): string {
    return 'up to 40% cost reduction and 60% faster implementation';
  }

  private static getBusinessObjective(industry: string): string {
    const objectives: Record<string, string> = {
      'SaaS': 'growth and customer retention goals',
      'FinTech': 'compliance and risk management objectives',
      'E-commerce': 'conversion and revenue targets',
      'default': 'strategic business objectives'
    };
    
    return objectives[industry] || objectives.default;
  }

  private static getCaseStudyHeadline(industry: string): string {
    return `How a ${industry} company improved efficiency by 45% in 3 months`;
  }

  private static getSpecificResultDetail(industry: string): string {
    return `They were able to streamline their ${industry} processes and achieve significant cost savings while improving team productivity.`;
  }

  private static getBusinessFocus(lead: EnhancedLead): string {
    return `${lead.industry} innovation and growth`;
  }

  private static getBenefit(index: number, industry: string): string {
    const benefits = [
      `${industry}-specific optimization strategies`,
      'Real-time performance analytics',
      'Seamless integration with existing tools'
    ];
    
    return benefits[index - 1] || benefits[0];
  }

  private static getAvailability(): string {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return `${nextWeek.toLocaleDateString('en-US', { weekday: 'long' })} or ${new Date(nextWeek.getTime() + 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'long' })}`;
  }

  private static simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
}