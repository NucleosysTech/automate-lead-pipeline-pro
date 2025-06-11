
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Proposal, ProposalTemplate, Lead, SparePart } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ProposalFormProps {
  proposal?: Proposal | null;
  onSave: (proposalData: Partial<Proposal>) => void;
  onCancel: () => void;
}

const ProposalForm: React.FC<ProposalFormProps> = ({ proposal, onSave, onCancel }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    leadId: '',
    templateId: '',
    title: '',
    robot: '',
    controller: '',
    reach: '',
    payload: '',
    brand: '',
    cost: 0,
    status: 'draft' as Proposal['status'],
    spareParts: [] as string[],
    imageUpload: null as File | null,
  });

  // Mock template data with proper structure
  const [templates] = useState<ProposalTemplate[]>([
    {
      id: '1',
      name: 'Standard Robotic System Template',
      headerContent: `Mahajan Automation (Pune)
Address: Gate No. 441, S.No. 474/1 Lawasa road, Near primary school, Mukaiwadi, Tal.Mulshi Poud Rd, Pirangut, Maharashtra 412115
📧 info@mahajanautomation.com
📞 +91 84848 79901 (India)`,
      footerContent: `Mahajan Automation (Pune)
Address: Gate No. 441, S.No. 474/1 Lawasa road, Near primary school, Mukaiwadi, Tal.Mulshi Poud Rd, Pirangut, Maharashtra 412115
📧 info@mahajanautomation.com
📞 +91 84848 79901 (India)`,
      logoUrl: 'https://mahajanautomation.com/wp-content/uploads/2023/03/logo-1-284x18.png',
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ]);

  // Mock leads data
  const [leads] = useState<Lead[]>([
    { 
      id: '1', 
      companyName: 'ABC Manufacturing', 
      contactPerson: 'John Doe',
      email: 'john@abc.com',
      phone: '+91 9876543210',
      application: 'Material & Warehouse Material Handling',
      status: 'new',
      source: 'website',
      spareParts: [],
      memos: [],
      attachments: [],
      followUps: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user?.id || '',
    },
    { 
      id: '2', 
      companyName: 'XYZ Industries', 
      contactPerson: 'Jane Smith',
      email: 'jane@xyz.com',
      phone: '+91 9876543211',
      application: 'Robotic AGV / AMR',
      status: 'contacted',
      source: 'phone',
      spareParts: [],
      memos: [],
      attachments: [],
      followUps: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user?.id || '',
    },
  ]);

  // Mock spare parts data
  const [spareParts] = useState<SparePart[]>([
    {
      id: '1',
      name: 'Motor Drive Unit',
      partNumber: 'MDU-001',
      description: 'High performance motor drive',
      brand: 'Fanuc',
      category: 'Motor',
      price: 25000,
      inStock: true,
      createdAt: '',
      updatedAt: '',
    },
    {
      id: '2',
      name: 'Control Panel',
      partNumber: 'CP-002',
      description: 'Industrial control panel',
      brand: 'Siemens',
      category: 'Control',
      price: 15000,
      inStock: true,
      createdAt: '',
      updatedAt: '',
    },
  ]);

  useEffect(() => {
    if (proposal) {
      setFormData({
        leadId: proposal.leadId,
        templateId: proposal.templateId,
        title: proposal.title,
        robot: proposal.robot,
        controller: proposal.controller,
        reach: proposal.reach,
        payload: proposal.payload,
        brand: proposal.brand,
        cost: proposal.cost,
        status: proposal.status,
        spareParts: [],
        imageUpload: null,
      });
    }
  }, [proposal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.leadId || !formData.templateId || !formData.title || !formData.robot) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Convert spareParts array to proposal format
    const proposalData = {
      ...formData,
      spareParts: formData.spareParts,
    };

    onSave(proposalData);
    
    toast({
      title: "Success",
      description: `Proposal ${proposal ? 'updated' : 'created'} successfully.`,
    });
  };

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setFormData({ 
        ...formData, 
        templateId,
        // Pre-populate with default values from template
        robot: formData.robot || 'R-2000iA/100P',
        controller: formData.controller || 'RJ3iB',
        reach: formData.reach || '3500',
        payload: formData.payload || '100',
        brand: formData.brand || 'Fanuc',
        cost: formData.cost || 251000,
      });
    }
  };

  const handleSparePartToggle = (partId: string) => {
    const updatedSpareParts = formData.spareParts.includes(partId)
      ? formData.spareParts.filter(id => id !== partId)
      : [...formData.spareParts, partId];
    
    setFormData({ ...formData, spareParts: updatedSpareParts });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, imageUpload: file });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">
          {proposal ? 'Edit Proposal' : 'Create New Proposal'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="leadId">Lead *</Label>
              <Select 
                value={formData.leadId} 
                onValueChange={(value) => setFormData({ ...formData, leadId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select lead" />
                </SelectTrigger>
                <SelectContent>
                  {leads.map((lead) => (
                    <SelectItem key={lead.id} value={lead.id}>
                      {lead.companyName} - {lead.contactPerson}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="templateId">Template *</Label>
              <Select 
                value={formData.templateId} 
                onValueChange={handleTemplateChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="title">Proposal Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Enter proposal title"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="robot">Robot *</Label>
              <Input
                id="robot"
                value={formData.robot}
                onChange={(e) => setFormData({ ...formData, robot: e.target.value })}
                required
                placeholder="e.g., R-2000iA/100P"
              />
            </div>
            <div>
              <Label htmlFor="controller">Controller *</Label>
              <Input
                id="controller"
                value={formData.controller}
                onChange={(e) => setFormData({ ...formData, controller: e.target.value })}
                required
                placeholder="e.g., RJ3iB"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="reach">Reach *</Label>
              <Input
                id="reach"
                value={formData.reach}
                onChange={(e) => setFormData({ ...formData, reach: e.target.value })}
                required
                placeholder="e.g., 3500"
              />
            </div>
            <div>
              <Label htmlFor="payload">Payload *</Label>
              <Input
                id="payload"
                value={formData.payload}
                onChange={(e) => setFormData({ ...formData, payload: e.target.value })}
                required
                placeholder="e.g., 100"
              />
            </div>
            <div>
              <Label htmlFor="brand">Brand *</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                required
                placeholder="e.g., Fanuc"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cost">Cost (₹) *</Label>
              <Input
                id="cost"
                type="number"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
                required
                placeholder="Enter cost in rupees"
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({ ...formData, status: value as Proposal['status'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="negotiating">Negotiating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Spare Parts Selection */}
          <div>
            <Label>Spare Parts (Multiple Selection)</Label>
            <div className="mt-2 space-y-2 max-h-32 overflow-y-auto border rounded p-2">
              {spareParts.map((part) => (
                <label key={part.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.spareParts.includes(part.id)}
                    onChange={() => handleSparePartToggle(part.id)}
                    className="rounded"
                  />
                  <span className="text-sm">{part.name} ({part.partNumber}) - ₹{part.price.toLocaleString()}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <Label htmlFor="imageUpload">Upload Image</Label>
            <Input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-1"
            />
            {formData.imageUpload && (
              <p className="text-sm text-gray-600 mt-1">
                Selected: {formData.imageUpload.name}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-[#fd8320] hover:bg-[#e6751d] text-white"
            >
              {proposal ? 'Update' : 'Create'} Proposal
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProposalForm;
