
export interface Lead {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  application: string;
  status: 'new' | 'contacted' | 'proposal_sent' | 'won' | 'cancelled' | 'hold' | 'negotiation';
  source: 'website' | 'email' | 'phone' | 'referral' | 'other';
  assignedTo?: string;
  spareParts: string[];
  memos: Memo[];
  attachments: FileAttachment[];
  followUps: FollowUp[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Memo {
  id: string;
  content: string;
  category: 'spare' | 'project' | 'service_provided' | 'key_account';
  createdAt: string;
  createdBy: string;
}

export interface FollowUp {
  id: string;
  content: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  scheduledAt?: string;
  completedAt?: string;
  createdAt: string;
  createdBy: string;
}

export interface FileAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
}

export interface Proposal {
  id: string;
  leadId: string;
  templateId: string;
  title: string;
  robot: string;
  controller: string;
  reach: string;
  payload: string;
  brand: string;
  cost: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'negotiating';
  attachments: FileAttachment[];
  history: ProposalHistory[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface ProposalHistory {
  id: string;
  version: number;
  changes: string;
  createdAt: string;
  createdBy: string;
}

export interface ProposalTemplate {
  id: string;
  name: string;
  headerContent: string;
  footerContent: string;
  logoUrl: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SparePart {
  id: string;
  name: string;
  partNumber: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export const APPLICATION_OPTIONS = [
  'Material & Warehouse Material Handling',
  'Fluid Dispensing System',
  'Foundry Automation System',
  'Vision System',
  'Robotic AGV / AMR',
  'Robotic 3D Manufacturing',
  'Robots In Assembly lines',
  'Welding Automation'
];

export const LEAD_STATUSES = [
  { value: 'new', label: 'New', color: '#3b82f6' },
  { value: 'contacted', label: 'Contacted', color: '#f59e0b' },
  { value: 'proposal_sent', label: 'Proposal Sent', color: '#8b5cf6' },
  { value: 'negotiation', label: 'Negotiation', color: '#fd8320' },
  { value: 'won', label: 'Won', color: '#10b981' },
  { value: 'cancelled', label: 'Cancelled', color: '#ef4444' },
  { value: 'hold', label: 'Hold', color: '#6b7280' },
];
