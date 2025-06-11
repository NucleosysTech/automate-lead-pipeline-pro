import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Lead, Proposal, LEAD_STATUSES } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Reports: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reportType, setReportType] = useState<'leads' | 'proposals'>('leads');
  const [userFilter, setUserFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Mock data
  const [users] = useState([
    { id: '1', name: 'Admin User' },
    { id: '2', name: 'Sales Engineer 1' },
    { id: '3', name: 'Sales Engineer 2' },
    { id: '4', name: 'Manager 1' },
  ]);

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
      assignedTo: '2',
      spareParts: [],
      memos: [],
      attachments: [],
      followUps: [],
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      createdBy: '2',
    },
    {
      id: '2',
      companyName: 'XYZ Industries',
      contactPerson: 'Jane Smith',
      email: 'jane@xyz.com',
      phone: '+91 9876543211',
      application: 'Robotic AGV / AMR',
      status: 'proposal_sent',
      source: 'phone',
      assignedTo: '2',
      spareParts: [],
      memos: [],
      attachments: [],
      followUps: [],
      createdAt: '2024-01-10T14:20:00Z',
      updatedAt: '2024-01-12T16:45:00Z',
      createdBy: '2',
    },
    {
      id: '3',
      companyName: 'Tech Solutions',
      contactPerson: 'Mike Johnson',
      email: 'mike@techsol.com',
      phone: '+91 9876543212',
      application: 'Vision System',
      status: 'won',
      source: 'referral',
      assignedTo: '3',
      spareParts: [],
      memos: [],
      attachments: [],
      followUps: [],
      createdAt: '2024-01-08T11:15:00Z',
      updatedAt: '2024-01-20T09:30:00Z',
      createdBy: '3',
    },
  ]);

  const [proposals] = useState<Proposal[]>([
    {
      id: '1',
      leadId: '1',
      templateId: '1',
      title: 'Material Handling System Proposal',
      robot: 'R-2000iA/100P',
      controller: 'RJ3iB',
      reach: '3500',
      payload: '100',
      brand: 'Fanuc',
      cost: 251000,
      status: 'sent',
      attachments: [],
      history: [],
      createdAt: '2024-01-16T09:15:00Z',
      updatedAt: '2024-01-16T09:15:00Z',
      createdBy: '2',
    },
    {
      id: '2',
      leadId: '2',
      templateId: '1',
      title: 'AGV System Proposal',
      robot: 'AGV-200X',
      controller: 'AGV-Control',
      reach: '5000',
      payload: '500',
      brand: 'KUKA',
      cost: 450000,
      status: 'negotiating',
      attachments: [],
      history: [],
      createdAt: '2024-01-18T14:30:00Z',
      updatedAt: '2024-01-18T14:30:00Z',
      createdBy: '2',
    },
  ]);

  const filterData = () => {
    const data = reportType === 'leads' ? leads : proposals;
    
    return data.filter(item => {
      const itemDate = new Date(item.createdAt);
      const fromDate = dateFrom ? new Date(dateFrom) : null;
      const toDate = dateTo ? new Date(dateTo) : null;
      
      const matchesUser = !userFilter || item.createdBy === userFilter;
      const matchesStatus = !statusFilter || 
        (reportType === 'leads' ? (item as Lead).status === statusFilter : (item as Proposal).status === statusFilter);
      const matchesDateFrom = !fromDate || itemDate >= fromDate;
      const matchesDateTo = !toDate || itemDate <= toDate;
      
      return matchesUser && matchesStatus && matchesDateFrom && matchesDateTo;
    });
  };

  const exportToExcel = () => {
    const data = filterData();
    if (data.length === 0) {
      toast({
        title: "No Data",
        description: "No data available to export with current filters.",
        variant: "destructive",
      });
      return;
    }

    const headers = reportType === 'leads' 
      ? ['Company', 'Contact Person', 'Email', 'Phone', 'Application', 'Status', 'Source', 'Assigned To', 'Created Date']
      : ['Title', 'Robot', 'Brand', 'Cost', 'Status', 'Created Date', 'Created By'];
    
    const csvContent = [
      headers.join(','),
      ...data.map(item => {
        if (reportType === 'leads') {
          const lead = item as Lead;
          const assignedUser = users.find(u => u.id === lead.assignedTo);
          return [
            `"${lead.companyName}"`,
            `"${lead.contactPerson}"`,
            lead.email,
            lead.phone,
            `"${lead.application}"`,
            lead.status,
            lead.source,
            assignedUser?.name || 'Unassigned',
            new Date(lead.createdAt).toLocaleDateString('en-IN')
          ].join(',');
        } else {
          const proposal = item as Proposal;
          const createdUser = users.find(u => u.id === proposal.createdBy);
          return [
            `"${proposal.title}"`,
            proposal.robot,
            proposal.brand,
            proposal.cost,
            proposal.status,
            new Date(proposal.createdAt).toLocaleDateString('en-IN'),
            createdUser?.name || 'Unknown'
          ].join(',');
        }
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Export Successful",
      description: `${reportType} report exported successfully.`,
    });
  };

  const exportToPDF = () => {
    // Mock PDF export - in real implementation, use libraries like jsPDF
    toast({
      title: "PDF Export",
      description: "PDF export functionality would be implemented with jsPDF library.",
    });
  };

  const filteredData = filterData();

  // Only admins can access this page
  if (user?.role !== 'admin') {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <div className="flex space-x-2">
            <Button 
              onClick={exportToPDF}
              variant="outline"
              className="text-[#fd8320] border-[#fd8320] hover:bg-[#fd8320] hover:text-white"
            >
              Export PDF
            </Button>
            <Button 
              onClick={exportToExcel}
              className="bg-[#fd8320] hover:bg-[#e6751d] text-white"
            >
              Export Excel
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Total Leads</h3>
            <p className="text-3xl font-bold text-[#fd8320]">{leads.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Total Proposals</h3>
            <p className="text-3xl font-bold text-[#000000]">{proposals.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Won Deals</h3>
            <p className="text-3xl font-bold text-green-600">
              {leads.filter(l => l.status === 'won').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
            <p className="text-3xl font-bold text-blue-600">
              {leads.length > 0 ? Math.round((leads.filter(l => l.status === 'won').length / leads.length) * 100) : 0}%
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Report Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="reportType">Report Type</Label>
              <Select value={reportType} onValueChange={(value) => setReportType(value as 'leads' | 'proposals')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="leads">Leads Report</SelectItem>
                  <SelectItem value="proposals">Proposals Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="userFilter">Created By User</Label>
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All users</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="statusFilter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  {reportType === 'leads' ? 
                    LEAD_STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    )) :
                    ['draft', 'sent', 'accepted', 'rejected', 'negotiating'].map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dateFrom">From Date</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dateTo">To Date</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setUserFilter('');
                setStatusFilter('');
                setDateFrom('');
                setDateTo('');
              }}
            >
              Clear All Filters
            </Button>
          </div>
        </div>

        {/* Report Data */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold">
              {reportType === 'leads' ? 'Leads' : 'Proposals'} Report 
              <span className="text-gray-500 font-normal">({filteredData.length} records)</span>
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {reportType === 'leads' ? (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Robot Details</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    {reportType === 'leads' ? (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {(item as Lead).companyName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>{(item as Lead).contactPerson}</div>
                          <div className="text-gray-500">{(item as Lead).email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {(item as Lead).application}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                            {(item as Lead).status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {(item as Lead).source}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {users.find(u => u.id === (item as Lead).assignedTo)?.name || 'Unassigned'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString('en-IN')}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {(item as Proposal).title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>{(item as Proposal).brand} {(item as Proposal).robot}</div>
                          <div className="text-gray-500">{(item as Proposal).controller}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{(item as Proposal).cost.toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                            {(item as Proposal).status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {users.find(u => u.id === (item as Proposal).createdBy)?.name || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString('en-IN')}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No records found for the selected filters.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
