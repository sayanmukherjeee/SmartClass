import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCertificate } from '../../context/CertificateContext';

// Mock certificates data for initial display
const mockCertificates = [
  {
    id: 1,
    certificate_code: 'CERT-2024-001',
    course: {
      id: 101,
      title: 'Advanced React Development',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h-200&fit=crop',
      instructor: {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
      },
      duration_hours: 40,
      level: 'Advanced',
    },
    issued_at: '2024-01-15T10:30:00Z',
    expires_at: '2025-01-15T10:30:00Z',
    download_url: '/api/certificates/1/download/',
    verification_url: '/api/certificates/1/verify/',
  },
  {
    id: 2,
    certificate_code: 'CERT-2024-002',
    course: {
      id: 102,
      title: 'Python Data Science',
      thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop',
      instructor: {
        id: 2,
        first_name: 'Jane',
        last_name: 'Smith',
      },
      duration_hours: 60,
      level: 'Intermediate',
    },
    issued_at: '2024-02-20T14:45:00Z',
    expires_at: '2025-02-20T14:45:00Z',
    download_url: '/api/certificates/2/download/',
    verification_url: '/api/certificates/2/verify/',
  },
  {
    id: 3,
    certificate_code: 'CERT-2024-003',
    course: {
      id: 103,
      title: 'UI/UX Design Fundamentals',
      thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=200&fit=crop',
      instructor: {
        id: 3,
        first_name: 'Mike',
        last_name: 'Johnson',
      },
      duration_hours: 30,
      level: 'Beginner',
    },
    issued_at: '2024-03-10T09:15:00Z',
    download_url: '/api/certificates/3/download/',
    verification_url: '/api/certificates/3/verify/',
  },
];

// Date formatting function
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch (error) {
    return dateString;
  }
};

// Format date with time
const formatDateTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch (error) {
    return dateString;
  }
};

const Certificate: React.FC = () => {
  const { user } = useAuth();
  const {
    certificates,
    loading,
    error,
    stats,
    fetchCertificates,
    downloadCertificate,
    searchCertificates,
    fetchCertificateStats,
  } = useCertificate();

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'recent', 'expiring'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({ show: false, message: '', type: 'success' });

  // Use mock data initially, but will be replaced with real data
  const [displayCertificates, setDisplayCertificates] = useState(mockCertificates);

  useEffect(() => {
    // Fetch certificates from API
    const loadCertificates = async () => {
      try {
        await fetchCertificates();
        await fetchCertificateStats();
      } catch (err) {
        console.error('Error loading certificates:', err);
        // For now, use mock data if API fails
        setDisplayCertificates(mockCertificates);
      }
    };
    
    loadCertificates();
  }, [fetchCertificates, fetchCertificateStats]);

  useEffect(() => {
    // Filter certificates based on selected filter
    let filtered = [...displayCertificates];
    
    if (filter === 'recent') {
      // Last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      filtered = filtered.filter(cert => new Date(cert.issued_at) >= thirtyDaysAgo);
    } else if (filter === 'expiring') {
      // Expiring in next 30 days
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      filtered = filtered.filter(cert => {
        if (!cert.expires_at) return false;
        const expiryDate = new Date(cert.expires_at);
        return expiryDate <= thirtyDaysFromNow && expiryDate >= new Date();
      });
    }
    
    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(cert =>
        cert.course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.certificate_code.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setDisplayCertificates(filtered);
  }, [searchQuery, filter]);

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const handleDownload = async (certificateId: number) => {
    try {
      const downloadUrl = await downloadCertificate(certificateId);
      if (downloadUrl) {
        // In a real app, you would initiate the download
        window.open(downloadUrl, '_blank');
        showNotification('Download initiated successfully!', 'success');
      }
    } catch (err) {
      showNotification('Failed to download certificate', 'error');
    }
  };

  const handleShare = (certificate: any) => {
    setSelectedCertificate(certificate);
    setShowShareModal(true);
  };

  const handleViewCertificate = (certificate: any) => {
    setSelectedCertificate(certificate);
    setShowCertificateModal(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => showNotification('Copied to clipboard!', 'success'))
      .catch(() => showNotification('Failed to copy', 'error'));
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (expiresAt?: string) => {
    if (!expiresAt) return 'bg-blue-100 text-blue-800';
    
    const expiryDate = new Date(expiresAt);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return 'bg-red-100 text-red-800';
    if (daysUntilExpiry <= 30) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (expiresAt?: string) => {
    if (!expiresAt) return 'No Expiry';
    
    const expiryDate = new Date(expiresAt);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return 'Expired';
    if (daysUntilExpiry <= 30) return 'Expiring Soon';
    return 'Active';
  };

  if (loading && displayCertificates.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading certificates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 max-w-sm w-full ${
          notification.type === 'success' ? 'bg-green-50 border-green-200' :
          notification.type === 'error' ? 'bg-red-50 border-red-200' :
          'bg-blue-50 border-blue-200'
        } border rounded-lg shadow-lg p-4 transition-all duration-300`}>
          <div className="flex items-start">
            <div className="ml-3 flex-1">
              <p className={`text-sm font-medium ${
                notification.type === 'success' ? 'text-green-800' :
                notification.type === 'error' ? 'text-red-800' :
                'text-blue-800'
              }`}>
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => setNotification(prev => ({ ...prev, show: false }))}
              className="ml-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
              <p className="text-gray-600 mt-2">
                All your earned certificates and achievements in one place
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg">
                <span className="text-xl mr-2">🏆</span>
                {stats.total_certificates || displayCertificates.length} Certificates
              </span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-100">
                  <span className="text-2xl">📜</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Certificates</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.total_certificates || displayCertificates.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-100">
                  <span className="text-2xl">🔄</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Recent (30 days)</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.recent_certificates || 2}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-yellow-100">
                  <span className="text-2xl">⭐</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Most Recent</p>
                  <p className="text-lg font-medium text-gray-900 truncate">
                    {displayCertificates.length > 0 
                      ? displayCertificates[0].course.title 
                      : 'No certificates'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div className="relative flex-1 md:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔍</span>
              </div>
              <input
                type="text"
                placeholder="Search certificates by course name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full rounded-lg border border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex space-x-3">
              <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 rounded-md ${
                    viewMode === 'grid'
                      ? 'bg-white shadow-sm text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-2">◼◼</span> Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 rounded-md ${
                    viewMode === 'list'
                      ? 'bg-white shadow-sm text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-2">☰</span> List
                </button>
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-lg border border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Certificates</option>
                <option value="recent">Recent (30 days)</option>
                <option value="expiring">Expiring Soon</option>
              </select>
            </div>
          </div>
        </div>

        {/* Certificates Grid/List */}
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <span className="text-4xl mb-4 block">⚠️</span>
            <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Certificates</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => fetchCertificates()}
              className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Try Again
            </button>
          </div>
        ) : displayCertificates.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <span className="text-6xl mb-6 block">📜</span>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Certificates Found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchQuery
                ? 'No certificates match your search. Try different keywords.'
                : 'You haven’t earned any certificates yet. Complete courses to earn certificates!'}
            </p>
            <div className="space-x-4">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilter('all');
                }}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                View All Certificates
              </button>
              <a
                href="/courses"
                className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Browse Courses
              </a>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCertificates.map((certificate) => (
              <div
                key={certificate.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  {/* Certificate Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">
                        {certificate.certificate_code}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                        {certificate.course.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => handleViewCertificate(certificate)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="View Certificate"
                    >
                      👁️
                    </button>
                  </div>

                  {/* Course Info */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">👨‍🏫</span>
                      <span>
                        {certificate.course.instructor.first_name} {certificate.course.instructor.last_name}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">⏱️</span>
                      <span>{certificate.course.duration_hours} hours</span>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(certificate.course.level)}`}>
                        {certificate.course.level}
                      </span>
                      <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(certificate.expires_at)}`}>
                        {getStatusText(certificate.expires_at)}
                      </span>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="border-t border-gray-100 pt-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Issued</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(certificate.issued_at)}
                        </p>
                      </div>
                      {certificate.expires_at && (
                        <div>
                          <p className="text-xs text-gray-500">Expires</p>
                          <p className="text-sm font-medium text-gray-900">
                            {formatDate(certificate.expires_at)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDownload(certificate.id)}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <span className="mr-2">⬇️</span> Download
                    </button>
                    <button
                      onClick={() => handleShare(certificate)}
                      className="inline-flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      title="Share"
                    >
                      🔗
                    </button>
                    <button
                      onClick={() => copyToClipboard(certificate.verification_url)}
                      className="inline-flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      title="Copy Verification Link"
                    >
                      🔗
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Certificate
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Issued Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayCertificates.map((certificate) => (
                    <tr key={certificate.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                            <span className="text-white font-bold">C</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {certificate.certificate_code}
                            </div>
                            <div className="text-xs text-gray-500">
                              {certificate.course.level}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {certificate.course.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {certificate.course.instructor.first_name} {certificate.course.instructor.last_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(certificate.issued_at)}
                        </div>
                        {certificate.expires_at && (
                          <div className="text-xs text-gray-500">
                            Expires: {formatDate(certificate.expires_at)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(certificate.expires_at)}`}>
                          {getStatusText(certificate.expires_at)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDownload(certificate.id)}
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            title="Download"
                          >
                            ⬇️
                          </button>
                          <button
                            onClick={() => handleViewCertificate(certificate)}
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                            title="View"
                          >
                            👁️
                          </button>
                          <button
                            onClick={() => handleShare(certificate)}
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                            title="Share"
                          >
                            🔗
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-2/3">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Need Help With Certificates?</h3>
              <p className="text-gray-700 mb-6">
                Having trouble downloading or verifying your certificates? Our support team is here to help you.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="/help/certificates"
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  View Help Center
                </a>
                <a
                  href="/contact"
                  className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border border-blue-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Contact Support
                </a>
              </div>
            </div>
            <div className="mt-8 md:mt-0">
              <span className="text-6xl">❓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Preview Modal */}
      {showCertificateModal && selectedCertificate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Certificate Preview</h3>
                <button
                  onClick={() => setShowCertificateModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Certificate Design */}
              <div className="bg-gradient-to-br from-blue-50 to-white border-4 border-blue-200 rounded-2xl p-8 mb-6">
                <div className="text-center mb-8">
                  <div className="inline-block p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6">
                    <span className="text-4xl text-white">🏆</span>
                  </div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">Certificate of Completion</h1>
                  <p className="text-gray-600">This certifies that</p>
                </div>

                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-blue-600 mb-4">{user?.first_name} {user?.last_name}</h2>
                  <p className="text-gray-700 text-lg mb-2">
                    has successfully completed the course
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    {selectedCertificate.course.title}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Issued On</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatDate(selectedCertificate.issued_at)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Certificate Code</p>
                    <p className="text-lg font-semibold text-gray-900 font-mono">
                      {selectedCertificate.certificate_code}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Instructor</p>
                      <p className="font-semibold text-gray-900">
                        {selectedCertificate.course.instructor.first_name} {selectedCertificate.course.instructor.last_name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-semibold text-gray-900">{selectedCertificate.course.duration_hours} hours</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCertificateModal(false)}
                  className="px-6 py-3 text-gray-700 bg-gray-200 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleDownload(selectedCertificate.id);
                    setShowCertificateModal(false);
                  }}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Download Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && selectedCertificate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Share Certificate</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Link
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      readOnly
                      value={selectedCertificate.verification_url}
                      className="flex-1 rounded-l-lg border border-gray-300 py-2 px-3 focus:outline-none bg-gray-50"
                    />
                    <button
                      onClick={() => copyToClipboard(selectedCertificate.verification_url)}
                      className="px-4 py-2 bg-blue-600 text-white font-medium rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certificate Code
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      readOnly
                      value={selectedCertificate.certificate_code}
                      className="flex-1 rounded-l-lg border border-gray-300 py-2 px-3 focus:outline-none bg-gray-50"
                    />
                    <button
                      onClick={() => copyToClipboard(selectedCertificate.certificate_code)}
                      className="px-4 py-2 bg-blue-600 text-white font-medium rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-4">Share via:</p>
                  <div className="flex space-x-3">
                    <button className="flex-1 px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600">
                      Facebook
                    </button>
                    <button className="flex-1 px-4 py-2 bg-blue-400 text-white font-medium rounded-lg hover:bg-blue-500">
                      Twitter
                    </button>
                    <button className="flex-1 px-4 py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-900">
                      LinkedIn
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificate;