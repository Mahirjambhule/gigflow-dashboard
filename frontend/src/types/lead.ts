export interface Lead {
    _id: string;
    name: string;
    email: string;
    status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
    source: 'Website' | 'Instagram' | 'Referral';
    createdAt: string;
  }
  
  export interface PaginationData {
    total: number;
    page: number;
    pages: number;
    limit: number;
  }
  
  export interface LeadsResponse {
    leads: Lead[];
    pagination: PaginationData;
  }
