
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { APPLICATION_OPTIONS, LEAD_STATUSES, Lead, SparePart } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface LeadFormProps {
  lead?: Lead | null;
  onSave: (leadData: Partial<Lead>) => void;
  onCancel: () => void;
}

const LeadForm: React.FC<LeadFormProps> = ({ lead, onSave, onCancel }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    application: '',
    status: 'new' as Lead['status'],
    source: 'website' as Lead['source'],
    assignedTo: '',
    spareParts: [] as string[],
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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
      updatedAt: '' 
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
      updatedAt: '' 
    },
    { 
      id: '3', 
      name: 'Servo Motor', 
      partNumber: 'SM-003', 
      description: 'Precision servo motor', 
      brand: 'Mitsubishi', 
      category: 'Motor', 
      price: 18000, 
      inStock: true, 
      createdAt: '', 
      updatedAt: '' 
    },
  ]);

  // Mock users for assignment (engineers and managers)
  const [users] = useState([
    { id: '2', name: 'Sales Engineer 1', role: 'sales_engineer' },
    { id: '3', name: 'Sales Engineer 2', role: 'sales_engineer' },
    { id: '4', name: 'Manager 1', role: 'manager' },
  ]);

  useEffect(() => {
    if (lead) {
      setFormData({
        companyName: lead.companyName,
        contactPerson: lead.contactPerson,
        email: lead.email,
        phone: lead.phone,
        application: lead.application,
        status: lead.status,
        source: lead.source,
        assignedTo: lead.assignedTo || '',
        spareParts: lead.spareParts || [],
      });
    }
  }, [lead]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.companyName.trim() || !formData.contactPerson.trim() || 
        !formData.email.trim() || !formData.phone.trim() || !formData.application) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    // Convert File objects to FileAttachment objects
    const attachments = selectedFiles.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      name: file.name,
      url: URL.createObjectURL(file), // In a real app, this would be uploaded to a server
      type: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      uploadedBy: user?.id || '',
    }));

    const leadData = {
      ...formData,
      attachments,
    };

    onSave(leadData);
  };

  const handleSparePartToggle = (partId: string) => {
    const updatedSpareParts = formData.spareParts.includes(partId)
      ? formData.spareParts.filter(id => id !== partId)
      : [...formData.spareParts, partId];
    
    setFormData({ ...formData, spareParts: updatedSpareParts });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">
          {lead ? 'Edit Lead' : 'Add New Lead'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                required
                placeholder="Enter company name"
              />
            </div>
            <div>
              <Label htmlFor="contactPerson">Contact Person *</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                required
                placeholder="Enter contact person name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="Enter email address"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="application">Application *</Label>
            <Select 
              value={formData.application} 
              onValueChange={(value) => setFormData({ ...formData, application: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select application" />
              </SelectTrigger>
              <SelectContent>
                {APPLICATION_OPTIONS.map((app) => (
                  <SelectItem key={app} value={app}>
                    {app}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({ ...formData, status: value as Lead['status'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="source">Source</Label>
              <Select 
                value={formData.source} 
                onValueChange={(value) => setFormData({ ...formData, source: value as Lead['source'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="assignedTo">Assign To</Label>
              <Select 
                value={formData.assignedTo} 
                onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}
                disabled={user?.role !== 'admin'} // Only admin can assign
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Unassigned</SelectItem>
                  {users.map((assignee) => (
                    <SelectItem key={assignee.id} value={assignee.id}>
                      {assignee.name} ({assignee.role.replace('_', ' ')})
                    </SelectItem>
                  ))}
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
                  <span className="text-sm">
                    {part.name} ({part.partNumber}) - ₹{part.price.toLocaleString()}
                    {!part.inStock && <span className="text-red-500 ml-1">(Out of Stock)</span>}
                  </span>
                </label>
              ))}
            </div>
            {formData.spareParts.length > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                Selected: {formData.spareParts.length} spare part(s)
              </p>
            )}
          </div>

          {/* File Attachments */}
          <div>
            <Label htmlFor="attachments">File Attachments</Label>
            <Input
              id="attachments"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              className="mt-1"
            />
            {selectedFiles.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">Selected files:</p>
                <div className="space-y-1">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm truncate">{file.name}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
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
              {lead ? 'Update' : 'Create'} Lead
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;
