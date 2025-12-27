import { useState, useEffect } from 'react';
import { Copy, Check, AlertCircle, Loader } from 'lucide-react';
import { teamAPI } from '../../services/api';
import './ReferralCode.css';

export const ReferralCode = ({ isActive }) => {
  const [referralData, setReferralData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Trigger API call when tab becomes active
  useEffect(() => {
    if (isActive) {
      console.log('ReferralCode tab is active - triggering API calls');
      initializeAndFetch();
    }
  }, [isActive]);

  const initializeAndFetch = async () => {
    try {
      setLoading(true);
      setError('');

      // First, initialize team membership if needed
      await teamAPI.initializeMembership();

      // Then fetch referral code
      await fetchReferralCode();
    } catch (err) {
      console.error('Initialization error:', err);
      setError('Failed to load referral code');
      setLoading(false);
    }
  };

  const fetchReferralCode = async () => {
    try {
      const response = await teamAPI.getMyReferralCode();

      if (response.success) {
        setReferralData(response.data);
        setError('');
      } else {
        setError(response.message || 'Could not load referral code');
      }
    } catch (err) {
      setError('Failed to load referral code');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) {
    return (
      <div className="referral-code-container">
        <div className="loading">
          <Loader className="spinner" />
          <p>Loading your referral code...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="referral-code-container">
        <div className="error-box">
          <AlertCircle className="error-icon" />
          <p className="error-message">{error}</p>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
            💡 Tip: You need to join a team first to get your referral code. Ask your team sponsor or administrator.
          </p>
        </div>
      </div>
    );
  }

  if (!referralData) {
    return null;
  }

  return (
    <div className="referral-code-container">
      {/* Code Display Card */}
      <div className="code-card">
        <h3>Your Referral Code</h3>
        <div className="code-display">
          <div className="code-box">
            <code className="code-text">{referralData.referralCode}</code>
          </div>
          <button
            className="copy-btn"
            onClick={() => handleCopyCode(referralData.referralCode)}
          >
            {copied ? (
              <>
                <Check size={16} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={16} />
                Copy Code
              </>
            )}
          </button>
        </div>
      </div>

      {/* Referral Link Card */}
      <div className="link-card">
        <h3>Referral Link</h3>
        <div className="link-display">
          <input
            type="text"
            readOnly
            value={referralData.referralLink}
            className="link-input"
          />
          <button
            className="copy-btn"
            onClick={() => handleCopyCode(referralData.referralLink)}
          >
            {copied ? (
              <>
                <Check size={16} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={16} />
                Copy Link
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Direct Referrals</div>
          <div className="stat-value">{referralData.stats.directCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Downline</div>
          <div className="stat-value">{referralData.stats.totalDownline}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Your Level</div>
          <div className="stat-value">Level {referralData.stats.level}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Earnings</div>
          <div className="stat-value">
            ${(referralData.stats.totalEarnings || 0).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Sponsor Info */}
      {referralData.sponsor && (
        <div className="sponsor-info">
          <p className="sponsor-label">Your Sponsor</p>
          <p className="sponsor-name">{referralData.sponsor.name}</p>
        </div>
      )}

      {/* Share Instructions */}
      <div className="instructions">
        <h4>How to Share:</h4>
        <ul>
          <li>Share your code or link with others</li>
          <li>They'll join your team using this code</li>
          <li>You earn bonuses from their activity</li>
          <li>Your team grows with every referral!</li>
        </ul>
      </div>
    </div>
  );
};

export default ReferralCode;
