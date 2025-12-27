import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, AlertCircle, Loader } from 'lucide-react';
import { teamAPI } from '../../services/api';
import './TeamHierarchy.css';

const HierarchyNode = ({ member, depth = 0, maxDepth = 5 }) => {
  const [isExpanded, setIsExpanded] = useState(depth < 2);
  const hasChildren = member.teamMembers && member.teamMembers.length > 0;

  if (depth > maxDepth) {
    return null;
  }

  const getLevelColor = (level) => {
    const colors = {
      0: '#11E44F',
      1: '#121212',
      2: '#8AFFAC',
      3: '#11E44F',
      4: '#121212',
      5: '#8AFFAC',
    };
    return colors[level] || '#11E44F';
  };

  return (
    <div className="hierarchy-node" style={{ marginLeft: `${depth * 24}px` }}>
      <div className="node-header">
        {hasChildren && (
          <button
            className="expand-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>
        )}
        {!hasChildren && <div className="expand-placeholder" />}

        <div
          className="member-info"
          style={{ borderLeftColor: getLevelColor(member.level) }}
        >
          <div className="member-header">
            <div className="member-name">{member.userId?.name || 'Unknown'}</div>
            <span className="level-badge" style={{ backgroundColor: getLevelColor(member.level) }}>
              L{member.level}
            </span>
          </div>
          <div className="member-details">
            <span className="detail-item">
              📧 {member.userId?.email || 'N/A'}
            </span>
            <span className="detail-item">
              👥 {member.directCount || 0} Direct
            </span>
            <span className="detail-item">
              🌳 {member.totalDownline || 0} Total
            </span>
            {member.totalEarnings > 0 && (
              <span className="detail-item earnings">
                💰 ${member.totalEarnings.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="children-list">
          {member.teamMembers.map((child) => (
            <HierarchyNode
              key={child._id}
              member={child}
              depth={depth + 1}
              maxDepth={maxDepth}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const TeamHierarchy = ({ isActive }) => {
  const [hierarchyData, setHierarchyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Trigger API call when tab becomes active
  useEffect(() => {
    if (isActive) {
      console.log('TeamHierarchy tab is active - triggering API calls');
      initializeAndFetch();
    }
  }, [isActive]);

  const initializeAndFetch = async () => {
    try {
      setLoading(true);
      setError('');

      // Initialize team membership if needed
      await teamAPI.initializeMembership();

      // Then fetch hierarchy
      await fetchHierarchy();
    } catch (err) {
      console.error('Initialization error:', err);
      setError('Failed to load team hierarchy');
      setLoading(false);
    }
  };

  const fetchHierarchy = async () => {
    try {
      const response = await teamAPI.getDownlineStructure();

      if (response.success) {
        setHierarchyData(response.data);
        setError('');
      } else {
        setError(response.message || 'Could not load team hierarchy');
      }
    } catch (err) {
      setError('Failed to load team hierarchy');
      console.error('Hierarchy fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="hierarchy-container">
        <div className="loading">
          <Loader className="spinner" />
          <p>Loading your team hierarchy...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hierarchy-container">
        <div className="error-box">
          <AlertCircle className="error-icon" />
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  if (!hierarchyData) {
    return null;
  }

  return (
    <div className="hierarchy-container">
      {/* Stats Cards */}
      <div className="hierarchy-stats">
        <div className="stat-card">
          <div className="stat-label">Total Team Members</div>
          <div className="stat-value">{hierarchyData.totalMembers || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Direct Referrals</div>
          <div className="stat-value">{hierarchyData.member?.directCount || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Your Level</div>
          <div className="stat-value">L{hierarchyData.member?.level || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Earnings</div>
          <div className="stat-value">
            ${(hierarchyData.member?.totalEarnings || 0).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="legend">
        <h4>Level Legend</h4>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#11E44F' }}></span>
            <span>Level 0 - Starter</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#121212' }}></span>
            <span>Level 1 - 10+ Direct (Unlock L2 income)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#8AFFAC' }}></span>
            <span>Level 2 - 10+ L1 members</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#11E44F' }}></span>
            <span>Level 3 - 10+ L2 members</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#121212' }}></span>
            <span>Level 4+ - Elite Status</span>
          </div>
        </div>
      </div>

      {/* Hierarchy Tree */}
      <div className="hierarchy-tree">
        <h3>Your Team Network</h3>
        <div className="tree-content">
          {hierarchyData.member ? (
            <HierarchyNode member={hierarchyData.member} depth={0} />
          ) : (
            <p className="no-data">No team members yet. Share your referral code to build your network!</p>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="info-box">
        <h4>📊 Understanding Your Hierarchy</h4>
        <ul>
          <li><strong>Levels</strong> - Your position based on direct referrals and team structure</li>
          <li><strong>Direct Count</strong> - People you directly referred</li>
          <li><strong>Total Downline</strong> - Everyone below you in the network</li>
          <li><strong>Earnings</strong> - Total commissions from your network</li>
          <li><strong>Level Qualification</strong> - Reach 10 direct referrals to unlock Level 1 benefits</li>
        </ul>
      </div>
    </div>
  );
};

export default TeamHierarchy;
