import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Clock, Search, Upload, FileText, Shield, TrendingUp, TrendingDown, Activity, Users, DollarSign, ArrowUpRight, ArrowDownRight, BarChart3, Zap } from 'lucide-react';

const ComplianceOSMVP = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCase, setSelectedCase] = useState(null);
  const [kycForm, setKycForm] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    country: '',
    idNumber: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock data for demonstration
  const [cases, setCases] = useState([
    {
      id: 'KYC-2025-001',
      name: 'Sarah Chen',
      status: 'approved',
      riskLevel: 'low',
      date: '2025-12-27',
      country: 'United States',
      checks: {
        identity: 'passed',
        sanctions: 'passed',
        pep: 'passed',
        adverseMedia: 'passed'
      }
    },
    {
      id: 'KYC-2025-002',
      name: 'Michael Rodriguez',
      status: 'review',
      riskLevel: 'medium',
      date: '2025-12-27',
      country: 'Mexico',
      checks: {
        identity: 'passed',
        sanctions: 'passed',
        pep: 'flagged',
        adverseMedia: 'passed'
      }
    },
    {
      id: 'KYC-2025-003',
      name: 'James Wilson',
      status: 'approved',
      riskLevel: 'low',
      date: '2025-12-26',
      country: 'United Kingdom',
      checks: {
        identity: 'passed',
        sanctions: 'passed',
        pep: 'passed',
        adverseMedia: 'passed'
      }
    }
  ]);

  const stats = {
    totalChecks: 847,
    approved: 782,
    pending: 12,
    rejected: 53,
    approvalRate: 92.3,
    totalChecksChange: 12.5,
    approvalRateChange: 2.1,
    avgProcessingTime: 2.4,
    riskDistribution: {
      low: 782,
      medium: 45,
      high: 20
    }
  };

  // Mock data for charts
  const weeklyData = [65, 72, 68, 75, 82, 78, 85];
  const riskData = [
    { label: 'Low', value: 782, color: 'bg-blue-500', percentage: 92.3 },
    { label: 'Medium', value: 45, color: 'bg-orange-500', percentage: 5.3 },
    { label: 'High', value: 20, color: 'bg-red-500', percentage: 2.4 }
  ];

  const handleKYCSubmit = () => {
    if (!kycForm.firstName || !kycForm.lastName || !kycForm.dateOfBirth || !kycForm.country || !kycForm.idNumber) {
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      const newCase = {
        id: `KYC-2025-${String(cases.length + 1).padStart(3, '0')}`,
        name: `${kycForm.firstName} ${kycForm.lastName}`,
        status: 'approved',
        riskLevel: 'low',
        date: new Date().toISOString().split('T')[0],
        country: kycForm.country,
        checks: {
          identity: 'passed',
          sanctions: 'passed',
          pep: 'passed',
          adverseMedia: 'passed'
        }
      };
      
      setCases([newCase, ...cases]);
      setIsProcessing(false);
      setActiveTab('dashboard');
      setKycForm({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        country: '',
        idNumber: ''
      });
    }, 2500);
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      approved: 'bg-green-100 text-green-800',
      review: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const RiskBadge = ({ level }) => {
    const colors = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-orange-100 text-orange-800',
      high: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[level]}`}>
        {level.charAt(0).toUpperCase() + level.slice(1)} Risk
      </span>
    );
  };

  const CheckStatus = ({ status }) => {
    if (status === 'passed') {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (status === 'flagged') {
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
    return <Clock className="w-5 h-5 text-gray-400" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-indigo-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">VerifyFlow</h1>
                <p className="text-sm text-gray-500">AI-Powered KYC/AML Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
                Documentation
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                API Keys
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <nav className="flex gap-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`pb-2 px-1 font-medium transition-colors ${
              activeTab === 'dashboard'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('new-check')}
            className={`pb-2 px-1 font-medium transition-colors ${
              activeTab === 'new-check'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            New KYC Check
          </button>
          <button
            onClick={() => setActiveTab('cases')}
            className={`pb-2 px-1 font-medium transition-colors ${
              activeTab === 'cases'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            All Cases
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Welcome back!</h2>
                  <p className="text-indigo-100">Here's what's happening with your compliance checks today.</p>
                </div>
                <div className="hidden md:block">
                  <Shield className="w-24 h-24 text-white opacity-20" />
                </div>
              </div>
            </div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Checks Card */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-indigo-100 rounded-lg">
                    <Activity className="w-6 h-6 text-indigo-600" />
                  </div>
                  <span className="flex items-center text-green-600 text-sm font-medium">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    +{stats.totalChecksChange}%
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Checks</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalChecks.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-2">Last 30 days</p>
                </div>
              </div>

              {/* Approved Card */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-xs text-gray-500">{((stats.approved / stats.totalChecks) * 100).toFixed(1)}%</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Approved</p>
                  <p className="text-3xl font-bold text-green-600">{stats.approved.toLocaleString()}</p>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${(stats.approved / stats.totalChecks) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Pending Card */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <span className="text-xs text-gray-500">Requires attention</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending Review</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                  <p className="text-xs text-gray-500 mt-2">Avg: {stats.avgProcessingTime} days</p>
                </div>
              </div>

              {/* Approval Rate Card */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="flex items-center text-green-600 text-sm font-medium">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    +{stats.approvalRateChange}%
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Approval Rate</p>
                  <p className="text-3xl font-bold text-indigo-600">{stats.approvalRate}%</p>
                  <p className="text-xs text-gray-500 mt-2">Above industry avg</p>
                </div>
              </div>
            </div>

            {/* Charts and Analytics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Weekly Activity Chart */}
              <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Weekly Activity</h3>
                    <p className="text-sm text-gray-500">Checks processed this week</p>
                  </div>
                  <BarChart3 className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex items-end justify-between h-48 gap-2">
                  {weeklyData.map((value, index) => {
                    const maxValue = Math.max(...weeklyData);
                    const height = (value / maxValue) * 100;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '100%' }}>
                          <div
                            className="absolute bottom-0 w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all hover:opacity-80"
                            style={{ height: `${height}%` }}
                            title={`${value} checks`}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 mt-2">Day {index + 1}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Risk Distribution */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Risk Distribution</h3>
                    <p className="text-sm text-gray-500">Current risk levels</p>
                  </div>
                  <AlertCircle className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                  {riskData.map((risk, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">{risk.label} Risk</span>
                        <span className="text-sm font-semibold text-gray-900">{risk.value}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`${risk.color} h-2.5 rounded-full transition-all`}
                          style={{ width: `${risk.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 mt-1 block">{risk.percentage}% of total</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab('new-check')}
                    className="w-full flex items-center gap-3 p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors group"
                  >
                    <div className="p-2 bg-indigo-600 rounded-lg group-hover:scale-110 transition-transform">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Run New Check</p>
                      <p className="text-xs text-gray-500">Start a KYC verification</p>
                    </div>
                  </button>
                  <button className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
                    <div className="p-2 bg-gray-600 rounded-lg group-hover:scale-110 transition-transform">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Generate Report</p>
                      <p className="text-xs text-gray-500">Export compliance data</p>
                    </div>
                  </button>
                  <button className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
                    <div className="p-2 bg-gray-600 rounded-lg group-hover:scale-110 transition-transform">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">View All Cases</p>
                      <p className="text-xs text-gray-500">Browse complete history</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Recent Cases - Enhanced */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Recent KYC Checks</h2>
                    <p className="text-sm text-gray-500 mt-1">Latest compliance verifications</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('cases')}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    View all →
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {cases.slice(0, 5).map((c) => (
                        <tr key={c.id} className="hover:bg-indigo-50/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-mono font-medium text-gray-900">{c.id}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-indigo-600">
                                  {c.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <span className="ml-3 text-sm font-medium text-gray-900">{c.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-600">{c.country}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <RiskBadge level={c.riskLevel} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={c.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-600">{c.date}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => {
                                setSelectedCase(c);
                                setActiveTab('cases');
                              }}
                              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1"
                            >
                              View
                              <ArrowUpRight className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* New Check View */}
        {activeTab === 'new-check' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Run New KYC Check</h2>
              
              {isProcessing ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                  <p className="text-gray-600">Running compliance checks...</p>
                  <div className="mt-6 space-y-2 text-left max-w-md mx-auto">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-gray-600">Identity verification complete</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-gray-600">Sanctions screening complete</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gray-400 animate-pulse" />
                      <span className="text-sm text-gray-600">Checking adverse media...</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        value={kycForm.firstName}
                        onChange={(e) => setKycForm({...kycForm, firstName: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        required
                        value={kycForm.lastName}
                        onChange={(e) => setKycForm({...kycForm, lastName: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      required
                      value={kycForm.dateOfBirth}
                      onChange={(e) => setKycForm({...kycForm, dateOfBirth: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <select
                      required
                      value={kycForm.country}
                      onChange={(e) => setKycForm({...kycForm, country: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select country</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Mexico">Mexico</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ID Number (SSN, Passport, etc.)
                    </label>
                    <input
                      type="text"
                      required
                      value={kycForm.idNumber}
                      onChange={(e) => setKycForm({...kycForm, idNumber: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="123-45-6789"
                    />
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-1">Upload ID Document</p>
                    <p className="text-xs text-gray-500">PNG, JPG or PDF up to 10MB</p>
                  </div>

                  <button
                    onClick={handleKYCSubmit}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Run KYC Check
                  </button>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Checks include:</strong> Identity verification, OFAC sanctions screening, PEP database check, adverse media monitoring
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* All Cases View */}
        {activeTab === 'cases' && (
          <div>
            {selectedCase ? (
              <div className="max-w-4xl mx-auto">
                <button
                  onClick={() => setSelectedCase(null)}
                  className="mb-4 text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  ← Back to all cases
                </button>
                
                <div className="bg-white rounded-lg border border-gray-200 p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedCase.name}</h2>
                      <p className="text-gray-500">{selectedCase.id}</p>
                    </div>
                    <div className="flex gap-2">
                      <StatusBadge status={selectedCase.status} />
                      <RiskBadge level={selectedCase.riskLevel} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Country</p>
                      <p className="text-lg font-medium text-gray-900">{selectedCase.country}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Check Date</p>
                      <p className="text-lg font-medium text-gray-900">{selectedCase.date}</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Checks</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckStatus status={selectedCase.checks.identity} />
                          <div>
                            <p className="font-medium text-gray-900">Identity Verification</p>
                            <p className="text-sm text-gray-600">Document authenticity confirmed</p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">2 min ago</span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckStatus status={selectedCase.checks.sanctions} />
                          <div>
                            <p className="font-medium text-gray-900">Sanctions Screening</p>
                            <p className="text-sm text-gray-600">No matches found in OFAC, UN, EU lists</p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">2 min ago</span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckStatus status={selectedCase.checks.pep} />
                          <div>
                            <p className="font-medium text-gray-900">PEP Database Check</p>
                            <p className="text-sm text-gray-600">
                              {selectedCase.checks.pep === 'flagged' 
                                ? 'Potential match found - requires manual review'
                                : 'No politically exposed person matches'}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">2 min ago</span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckStatus status={selectedCase.checks.adverseMedia} />
                          <div>
                            <p className="font-medium text-gray-900">Adverse Media Monitoring</p>
                            <p className="text-sm text-gray-600">No negative news articles found</p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">1 min ago</span>
                      </div>
                    </div>
                  </div>

                  {selectedCase.status === 'review' && (
                    <div className="mt-6 flex gap-3">
                      <button className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700">
                        Approve Case
                      </button>
                      <button className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700">
                        Reject Case
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">All KYC Cases</h2>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search cases..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Case ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk Level</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {cases.map((c) => (
                        <tr key={c.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{c.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{c.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{c.country}</td>
                          <td className="px-6 py-4"><RiskBadge level={c.riskLevel} /></td>
                          <td className="px-6 py-4"><StatusBadge status={c.status} /></td>
                          <td className="px-6 py-4 text-sm text-gray-600">{c.date}</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => setSelectedCase(c)}
                              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ComplianceOSMVP;

