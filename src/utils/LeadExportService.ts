// Enhanced lead export system with multiple formats and CRM integration
import { AILeadScoring, LeadData } from './AILeadScoring';

export interface EnhancedLead extends LeadData {
  score?: ReturnType<typeof AILeadScoring.calculateLeadScore>;
  tags?: string[];
  status?: 'New' | 'Contacted' | 'Qualified' | 'Demo Scheduled' | 'Closed Won' | 'Closed Lost';
  notes?: string;
  lastContacted?: Date;
  assignedTo?: string;
}

export class LeadExportService {
  static async exportToCSV(leads: EnhancedLead[]): Promise<void> {
    const headers = [
      'Company Name',
      'Website', 
      'Industry',
      'Company Size',
      'Country',
      'Key Contact',
      'Email',
      'LinkedIn',
      'Lead Score',
      'Score Category',
      'Tech Stack',
      'Tags',
      'Status',
      'Notes',
      'Domain Authority',
      'Social Followers',
      'Last Contacted'
    ];

    const csvContent = [
      headers.join(','),
      ...leads.map(lead => [
        this.escapeCSV(lead.companyName),
        this.escapeCSV(lead.website),
        this.escapeCSV(lead.industry),
        this.escapeCSV(lead.companySize),
        this.escapeCSV(lead.country),
        this.escapeCSV(lead.email || ''),
        this.escapeCSV(lead.email || ''),
        this.escapeCSV(lead.linkedinUrl || ''),
        lead.score?.overall || 0,
        this.escapeCSV(lead.score?.category || ''),
        this.escapeCSV((lead.techStack || []).join('; ')),
        this.escapeCSV((lead.tags || []).join('; ')),
        this.escapeCSV(lead.status || 'New'),
        this.escapeCSV(lead.notes || ''),
        lead.domainAuthority || 0,
        lead.linkedinFollowers || 0,
        lead.lastContacted ? lead.lastContacted.toISOString().split('T')[0] : ''
      ].join(','))
    ].join('\n');

    this.downloadFile(csvContent, 'caprae-leads-export.csv', 'text/csv');
  }

  static async exportToExcel(leads: EnhancedLead[]): Promise<void> {
    // For a complete Excel export, you'd use a library like xlsx
    // For now, we'll create a tab-separated file that Excel can open
    const headers = [
      'Company Name', 'Website', 'Industry', 'Company Size', 'Country',
      'Key Contact', 'Email', 'LinkedIn', 'Lead Score', 'Score Category',
      'Tech Stack', 'Tags', 'Status', 'Notes'
    ];

    const tsvContent = [
      headers.join('\t'),
      ...leads.map(lead => [
        lead.companyName,
        lead.website,
        lead.industry,
        lead.companySize,
        lead.country,
        lead.email || '',
        lead.email || '',
        lead.linkedinUrl || '',
        lead.score?.overall || 0,
        lead.score?.category || '',
        (lead.techStack || []).join('; '),
        (lead.tags || []).join('; '),
        lead.status || 'New',
        lead.notes || ''
      ].join('\t'))
    ].join('\n');

    this.downloadFile(tsvContent, 'caprae-leads-export.xlsx', 'application/vnd.ms-excel');
  }

  static async exportToHubSpot(leads: EnhancedLead[]): Promise<void> {
    // HubSpot-compatible CSV format
    const hubspotHeaders = [
      'Company name',
      'Company domain name',
      'Industry',
      'Number of employees',
      'Country/Region',
      'First name',
      'Last name', 
      'Email',
      'LinkedIn URL',
      'Lead score',
      'Lead status',
      'Technology',
      'Notes'
    ];

    const hubspotContent = [
      hubspotHeaders.join(','),
      ...leads.map(lead => {
        const [firstName, ...lastNameParts] = (lead.email?.split('@')[0] || '').split('.');
        const lastName = lastNameParts.join(' ');
        
        return [
          this.escapeCSV(lead.companyName),
          this.escapeCSV(lead.website.replace(/https?:\/\//, '')),
          this.escapeCSV(lead.industry),
          this.escapeCSV(lead.companySize),
          this.escapeCSV(lead.country),
          this.escapeCSV(firstName || ''),
          this.escapeCSV(lastName || ''),
          this.escapeCSV(lead.email || ''),
          this.escapeCSV(lead.linkedinUrl || ''),
          lead.score?.overall || 0,
          this.escapeCSV(lead.status || 'New'),
          this.escapeCSV((lead.techStack || []).join('; ')),
          this.escapeCSV(lead.notes || '')
        ].join(',');
      })
    ].join('\n');

    this.downloadFile(hubspotContent, 'hubspot-import-ready.csv', 'text/csv');
  }

  static async exportToSalesforce(leads: EnhancedLead[]): Promise<void> {
    // Salesforce-compatible CSV format
    const salesforceHeaders = [
      'Account Name',
      'Website',
      'Industry',
      'NumberOfEmployees',
      'BillingCountry',
      'FirstName',
      'LastName',
      'Email',
      'LeadSource',
      'Lead_Score__c',
      'Status',
      'Description'
    ];

    const salesforceContent = [
      salesforceHeaders.join(','),
      ...leads.map(lead => {
        const [firstName, ...lastNameParts] = (lead.email?.split('@')[0] || '').split('.');
        const lastName = lastNameParts.join(' ');
        
        return [
          this.escapeCSV(lead.companyName),
          this.escapeCSV(lead.website),
          this.escapeCSV(lead.industry),
          this.escapeCSV(lead.companySize.split('-')[0] || ''),
          this.escapeCSV(lead.country),
          this.escapeCSV(firstName || ''),
          this.escapeCSV(lastName || ''),
          this.escapeCSV(lead.email || ''),
          'Caprae Leads',
          lead.score?.overall || 0,
          this.escapeCSV(lead.status || 'New'),
          this.escapeCSV(`${lead.score?.reasoning.join('. ') || ''} Tech: ${(lead.techStack || []).join(', ')}`)
        ].join(',');
      })
    ].join('\n');

    this.downloadFile(salesforceContent, 'salesforce-import-ready.csv', 'text/csv');
  }

  static async syncWithZapier(leads: EnhancedLead[], webhookUrl: string): Promise<boolean> {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          leads: leads.map(lead => ({
            companyName: lead.companyName,
            website: lead.website,
            industry: lead.industry,
            companySize: lead.companySize,
            country: lead.country,
            email: lead.email,
            linkedinUrl: lead.linkedinUrl,
            leadScore: lead.score?.overall,
            scoreCategory: lead.score?.category,
            techStack: lead.techStack,
            tags: lead.tags,
            status: lead.status,
            timestamp: new Date().toISOString()
          }))
        }),
      });

      return true;
    } catch (error) {
      console.error('Zapier sync failed:', error);
      return false;
    }
  }

  private static escapeCSV(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  private static downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}