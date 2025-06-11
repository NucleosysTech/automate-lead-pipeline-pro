
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { APPLICATION_OPTIONS, LEAD_STATUSES, Lead } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import LeadForm from '@/components/LeadForm';
import LeadList from '@/components/LeadList';

const LeadManagement: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    application: '',
    assignedTo: '',
    search: ''
  });
  const { user } = useAuth();
  const { toast } = useToast();

  // Mock data - replace with actual API calls
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: '1',
      companyName: 'ABC Manufacturing',
      contactPerson: 'John Doe',
      email: 'john@abc.com',
      phone: '+91 9876543210',
      application: 'Material & Warehouse Material Handling',
      status: 'new',
      source: 'website',
      assignedTo: user?.id,
      spareParts: [],
      memos: [],
      attachments: [],
      followUps: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user?.id || '',
    }
  ]);

  const handleCreateLead = (leadData: Partial<Lead>) => {
    const newLead: Lead = {
      id: Date.now().toString(),
      ...leadData,
      spareParts: leadData.spareParts || [],
      memos: [],
      attachments: [],
      followUps: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user?.id || '',
    } as Lead;

    setLeads([...leads, newLead]);
    setShowForm(false);
    toast({
      title: "Lead created",
      description: "New lead has been successfully created.",
    });
  };

  const handleUpdateLead = (leadData: Partial<Lead>) => {
    setLeads(leads.map(lead => 
      lead.id === editingLead?.id 
        ? { ...lead, ...leadData, updatedAt: new Date().toISOString() }
        : lead
    ));
    setEditingLead(null);
    setShowForm(false);
    toast({
      title: "Lead updated",
      description: "Lead has been successfully updated.",
    });
  };

  const filteredLeads = leads.filter(lead => {
    return (
      (!filters.status || lead.status === filters.status) &&
      (!filters.application || lead.application === filters.application) &&
      (!filters.assignedTo || lead.assignedTo === filters.assignedTo) &&
      (!filters.search || 
        lead.companyName.toLowerCase().includes(filters.search.toLowerCase()) ||
        lead.contactPerson.toLowerCase().includes(filters.search.toLowerCase()) ||
        lead.email.toLowerCase().includes(filters.search.toLowerCase())
      )
    );
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-[#fd8320] hover:bg-[#e6751d] text-white"
          >
            Add New Lead
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search leads..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  {LEAD_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="application">Application</Label>
              <Select value={filters.application} onValueChange={(value) => setFilters({ ...filters, application: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All applications" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All applications</SelectItem>
                  {APPLICATION_OPTIONS.map((app) => (
                    <SelectItem key={app} value={app}>
                      {app}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => setFilters({ status: '', application: '', assignedTo: '', search: '' })}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Lead List */}
        <LeadList 
          leads={filteredLeads}
          onEdit={(lead) => {
            setEditingLead(lead);
            setShowForm(true);
          }}
          onDelete={(id) => {
            setLeads(leads.filter(lead => lead.id !== id));
            toast({
              title: "Lead deleted",
              description: "Lead has been successfully deleted.",
            });
          }}
        />

        {/* Lead Form Modal */}
        {showForm && (
          <LeadForm
            lead={editingLead}
            onSave={editingLead ? handleUpdateLead : handleCreateLead}
            onCancel={() => {
              setShowForm(false);
              setEditingLead(null);
            }}
          />
        )}
      </div>
    </Layout>
  );
};

export default LeadManagement;
