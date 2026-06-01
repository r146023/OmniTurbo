import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';

// import {cryptadia} from '@utils/CryptadiaCore';
import {useOmniState} from "../hooks/useOmni";
// const omni = cryptadia.omni;
import { omni } from '../omni/OmniTurbo';


/**
 * Live OmniTurbo Data Viewer Component with Dark Theme
 * Now includes Timeline view for tracking all changes chronologically
 */
interface TreeNode {
  key: string;
  fullPath: string;
  value: any;
  type: string;
  hasSubscriptions: boolean;
  subscriptionCount: number;
  hasHistory: boolean;
  historyCount: number;
  redoCount: number;
  alertCount: number;
  children: TreeNode[];
  isExpanded: boolean;
  level: number;
}

interface TimelineEntry {
  timestamp: number;
  path: string;
  oldValue: any;
  newValue: any;
  action: 'created' | 'updated' | 'deleted' | 'undo' | 'redo';
  index: number;
}

interface OmniTurboViewerProps {
  refreshInterval?: number;
  showTypes?: boolean;
  showMetadata?: boolean;
  maxDepth?: number;
}

// ✨ NEW: Tab system styled components
const TabContainer = styled.div`
  display: flex;
  background: #2d2d2d;
  border-bottom: 1px solid #3c3c3c;
`;

const TabButton = styled.button<{ $active: boolean }>`
  background: ${props => props.$active ? '#1e1e1e' : '#2d2d2d'};
  border: none;
  border-bottom: ${props => props.$active ? '2px solid #79b8ff' : '2px solid transparent'};
  color: ${props => props.$active ? '#e1e4e8' : '#959da5'};
  padding: 12px 24px;
  cursor: pointer;
  font-size: 14px;
  font-weight: ${props => props.$active ? '600' : 'normal'};
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background: ${props => props.$active ? '#1e1e1e' : '#3c3c3c'};
    color: #e1e4e8;
  }

  &:focus {
    outline: none;
    box-shadow: inset 0 0 0 1px #79b8ff;
  }
`;

const TabContent = styled.div<{ $active: boolean }>`
  display: ${props => props.$active ? 'flex' : 'none'};
  flex-direction: column;
  flex: 1;
  height: 100%;
`;

// ✨ NEW: Timeline specific styled components
const TimelineContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #1e1e1e;
`;

const TimelineControls = styled.div`
  background: #2d2d2d;
  padding: 12px 16px;
  border-bottom: 1px solid #3c3c3c;
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
`;

const TimelineEntry = styled.div<{ actionType: string }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  margin-bottom: 4px;
  border-radius: 6px;
  border-left: 4px solid ${props => {
    switch (props.actionType) {
      case 'created': return '#2ed573';
      case 'updated': return '#ffa502';
      case 'deleted': return '#ff4757';
      case 'undo': return '#ff6b6b';
      case 'redo': return '#4ecdc4';
      default: return '#6c5ce7';
    }
  }};
  background: rgba(${props => {
    switch (props.actionType) {
      case 'created': return '46, 213, 115';
      case 'updated': return '255, 165, 2';
      case 'deleted': return '255, 71, 87';
      case 'undo': return '255, 107, 107';
      case 'redo': return '78, 205, 196';
      default: return '108, 92, 231';
    }
  }}, 0.1);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(${props => {
      switch (props.actionType) {
        case 'created': return '46, 213, 115';
        case 'updated': return '255, 165, 2';
        case 'deleted': return '255, 71, 87';
        case 'undo': return '255, 107, 107';
        case 'redo': return '78, 205, 196';
        default: return '108, 92, 231';
      }
    }}, 0.2);
    transform: translateX(4px);
  }
`;

const TimelineTime = styled.span`
  color: #959da5;
  font-size: 11px;
  min-width: 80px;
  font-weight: 500;
`;

const TimelineAction = styled.span<{ actionType: string }>`
  background: ${props => {
    switch (props.actionType) {
      case 'created': return '#2ed573';
      case 'updated': return '#ffa502';
      case 'deleted': return '#ff4757';
      case 'undo': return '#ff6b6b';
      case 'redo': return '#4ecdc4';
      default: return '#6c5ce7';
    }
  }};
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  min-width: 50px;
  text-align: center;
`;

const TimelinePath = styled.span`
  color: #79b8ff;
  font-weight: 500;
  min-width: 120px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TimelineValueChange = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`;

const TimelineValue = styled.span<{ type: 'old' | 'new' | 'arrow' }>`
  ${props => {
    if (props.type === 'old') {
      return `
        color: #f85149;
        text-decoration: line-through;
        opacity: 0.8;
      `;
    }
    if (props.type === 'new') {
      return `
        color: #40d65c;
        font-weight: 500;
      `;
    }
    if (props.type === 'arrow') {
      return `
        color: #959da5;
        font-size: 12px;
      `;
    }
  }}
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
`;

const TimelineStats = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const TimelineStatBadge = styled.div<{ color: string }>`
  background: ${props => props.color};
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const FilterSelect = styled.select`
  background: #1e1e1e;
  border: 1px solid #3c3c3c;
  border-radius: 4px;
  color: #e1e4e8;
  padding: 6px 12px;
  font-size: 13px;

  &:focus {
    outline: none;
    border-color: #79b8ff;
    box-shadow: 0 0 0 2px rgba(121, 184, 255, 0.2);
  }
`;

const LimitInput = styled.input`
  background: #1e1e1e;
  border: 1px solid #3c3c3c;
  border-radius: 4px;
  color: #e1e4e8;
  padding: 6px 12px;
  font-size: 13px;
  width: 80px;

  &:focus {
    outline: none;
    border-color: #79b8ff;
    box-shadow: 0 0 0 2px rgba(121, 184, 255, 0.2);
  }
`;


// ✨ ADD THESE MISSING STYLED COMPONENTS

const ViewerHeader = styled.div`
  background: #2d2d2d;
  padding: 12px 16px;
  border-bottom: 1px solid #3c3c3c;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
`;

const HeaderTitle = styled.h3`
  margin: 0;
  color: #e1e4e8;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ViewerStats = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const StatBadge = styled.span`
  background: #404040;
  color: #e1e4e8;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
`;

const ViewerControls = styled.div`
  background: #2d2d2d;
  padding: 12px 16px;
  border-bottom: 1px solid #3c3c3c;
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
`;

const SearchControls = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const SearchInput = styled.input`
  background: #1e1e1e;
  border: 1px solid #3c3c3c;
  border-radius: 4px;
  color: #e1e4e8;
  padding: 6px 12px;
  font-size: 13px;
  width: 200px;

  &:focus {
    outline: none;
    border-color: #79b8ff;
    box-shadow: 0 0 0 2px rgba(121, 184, 255, 0.2);
  }

  &::placeholder {
    color: #6a737d;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #d1d5da;
  font-size: 13px;
  cursor: pointer;

  input[type="checkbox"] {
    accent-color: #79b8ff;
  }
`;

const ExpansionControls = styled.div`
  display: flex;
  gap: 8px;
`;

const ControlButton = styled.button`
  background: #404040;
  border: 1px solid #525252;
  border-radius: 4px;
  color: #e1e4e8;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #525252;
    border-color: #6a737d;
  }

  &:active {
    background: #373737;
  }
`;

const DisplayOptions = styled.div`
  display: flex;
  gap: 16px;
  margin-left: auto;
`;

const TreeContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  background: #1e1e1e;
  max-height: 34rem;
`;

const TreeContent = styled.div`
  /* Content wrapper */
`;

const EmptyState = styled.div`
  text-align: center;
  color: #6a737d;
  font-style: italic;
  padding: 40px;
`;

const ViewerFooter = styled.div`
  background: #2d2d2d;
  padding: 8px 16px;
  border-top: 1px solid #3c3c3c;
  font-size: 12px;
  color: #6a737d;
  text-align: center;
`;

// ✨ ALSO ADD THESE NODE RENDERING COMPONENTS

const TreeNode = styled.div`
  /* Container for each tree node */
`;

const NodeContent = styled.div<{ level: number }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 16px;
  min-height: 28px;
  border-left: 1px solid ${props => 
    props.level === 0 ? 'transparent' :
    props.level === 1 ? '#3c3c3c' :
    props.level === 2 ? '#525252' :
    '#6b6b6b'
  };
  transition: background-color 0.15s ease;
  padding-left: ${props => props.level *.5}rem;
  font-weight: ${props => props.level === 0 ? '600' : 'normal'};

  &:hover {
    background: #2d2d2d;
  }

  @media (max-width: 768px) {
    padding-left: ${props => props.level * 12 + 8}px;
    padding-right: 8px;
  }
`;

const ExpandButton = styled.button<{ isExpanded: boolean }>`
  background: none;
  border: none;
  color: #6a737d;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
  border-radius: 2px;
  transition: all 0.2s ease;

  &:hover {
    background: #404040;
    color: #e1e4e8;
  }

  &::before {
    content: '${props => props.isExpanded ? '▼' : '▶'}';
  }
`;

const NodeKey = styled.span`
  color: #79b8ff;
  font-weight: 500;
  min-width: 120px;
`;

const NodeValue = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`;

const ValueDisplay = styled.span<{ valueType: string }>`
  color: ${props => {
    switch (props.valueType) {
      case 'string': return '#9ecbff';
      case 'number': return '#79c0ff';
      case 'boolean': return '#56d364';
      case 'null': return '#8b949e';
      case 'undefined': return '#8b949e';
      case 'array': return '#ffa657';
      case 'object': return '#ffa657';
      case 'function': return '#d2a8ff';
      default: return '#e1e4e8';
    }
  }};
  font-weight: 500;
  cursor: pointer;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
  }
`;

const TypeBadge = styled.span<{ type: string }>`
  background: ${props => {
    switch (props.type) {
      case 'string': return 'rgba(158, 203, 255, 0.15)';
      case 'number': return 'rgba(121, 192, 255, 0.15)';
      case 'boolean': return 'rgba(86, 211, 100, 0.15)';
      case 'null': return 'rgba(139, 148, 158, 0.15)';
      case 'undefined': return 'rgba(139, 148, 158, 0.15)';
      case 'array': return 'rgba(255, 166, 87, 0.15)';
      case 'object': return 'rgba(255, 166, 87, 0.15)';
      case 'function': return 'rgba(210, 168, 255, 0.15)';
      default: return 'rgba(225, 228, 232, 0.15)';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'string': return '#9ecbff';
      case 'number': return '#79c0ff';
      case 'boolean': return '#56d364';
      case 'null': return '#8b949e';
      case 'undefined': return '#8b949e';
      case 'array': return '#ffa657';
      case 'object': return '#ffa657';
      case 'function': return '#d2a8ff';
      default: return '#e1e4e8';
    }
  }};
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
`;

const MetadataBadges = styled.div`
  display: flex;
  gap: 4px;
  margin-left: auto;
`;

const MetadataBadge = styled.span<{ type: 'subscription' | 'alert' | 'history' | 'redo' }>`
  background: ${props => {
    switch (props.type) {
      case 'subscription': return 'rgba(121, 184, 255, 0.15)';
      case 'alert': return 'rgba(255, 107, 107, 0.15)';
      case 'history': return 'rgba(255, 165, 2, 0.15)';
      case 'redo': return 'rgba(78, 205, 196, 0.15)';
      default: return 'rgba(139, 148, 158, 0.15)';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'subscription': return '#79b8ff';
      case 'alert': return '#ff6b6b';
      case 'history': return '#ffa502';
      case 'redo': return '#4ecdc4';
      default: return '#8b949e';
    }
  }};
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 2px;
`;

const EditInput = styled.input`
  background: #1e1e1e;
  border: 1px solid #79b8ff;
  border-radius: 4px;
  color: #e1e4e8;
  padding: 4px 8px;
  font-size: 13px;
  font-family: inherit;
  width: 200px;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(121, 184, 255, 0.2);
  }
`;

const EditControls = styled.div`
  display: flex;
  gap: 4px;
`;

const EditButton = styled.button<{ variant: 'save' | 'cancel' }>`
  background: ${props => props.variant === 'save' ? '#2ea043' : '#da3633'};
  border: none;
  border-radius: 4px;
  color: white;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;




const NodePath = styled.span`
  color: #959da5;
  font-size: 11px;
  font-style: italic;
  margin-left: auto;
  padding-left: 12px;

  @media (max-width: 768px) {
    display: none;
  }
`;









const ClearButton = styled.button`
  background: #ff4757;
  border: none;
  border-radius: 4px;
  color: white;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  font-weight: 600;
  &:hover {
    background: #ff3838;
  }
`;

const EmptyTimeline = styled.div`
  text-align: center;
  color: #959da5;
  font-style: italic;
  padding: 40px;
`;


const ViewerContainer = styled.div`
  background: #1e1e1e;
  border: 1px solid #3c3c3c;
  border-radius: 8px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  color: #e1e4e8;
`;

const JsonContainer = styled.pre`
  background: #181818;
  color: #e1e4e8;
  padding: 24px;
  border-radius: 8px;
  font-size: 13px;
  font-family: 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace;
  overflow-x: auto;
  margin: 0;
  flex: 1;
  min-height: 200px;
  max-height: 60vh;
`;

// ✨ NEW: Timeline Tab Component
const TimelineView: React.FC<{
  timelineEntries: TimelineEntry[];
  onClearTimeline: () => void;
}> = ({ timelineEntries, onClearTimeline }) => {
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [pathFilter, setPathFilter] = useState<string>('');
  const [limit, setLimit] = useState<number>(50);

  // Filter and limit timeline entries
  const filteredEntries = useMemo(() => {
    let filtered = [...timelineEntries];

    // Filter by action type
    if (actionFilter !== 'all') {
      filtered = filtered.filter(entry => entry.action === actionFilter);
    }

    // Filter by path
    if (pathFilter) {
      filtered = filtered.filter(entry => 
        entry.path.toLowerCase().includes(pathFilter.toLowerCase())
      );
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => b.timestamp - a.timestamp);

    // Apply limit
    return filtered.slice(0, limit);
  }, [timelineEntries, actionFilter, pathFilter, limit]);

  // Calculate stats
  const stats = useMemo(() => {
    const actionCounts = timelineEntries.reduce((acc, entry) => {
      acc[entry.action] = (acc[entry.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: timelineEntries.length,
      created: actionCounts.created || 0,
      updated: actionCounts.updated || 0,
      deleted: actionCounts.deleted || 0,
      undo: actionCounts.undo || 0,
      redo: actionCounts.redo || 0,
    };
  }, [timelineEntries]);

  const formatValue = (value: any): string => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') return `"${value}"`;
    if (Array.isArray(value)) return `[Array ${value.length}]`;
    if (typeof value === 'object') return `{Object}`;
    return String(value);
  };

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      // fractionalSecondDigits: 3
    });
  };

  return (
    <>
      <TimelineControls>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <label style={{ color: '#d1d5da', fontSize: '13px' }}>Filter:</label>
          <FilterSelect 
            value={actionFilter} 
            onChange={(e) => setActionFilter(e.target.value)}
          >
            <option value="all">All Actions</option>
            <option value="created">Created</option>
            <option value="updated">Updated</option>
            <option value="deleted">Deleted</option>
            <option value="undo">Undo</option>
            <option value="redo">Redo</option>
          </FilterSelect>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <label style={{ color: '#d1d5da', fontSize: '13px' }}>Path:</label>
          <SearchInput
            type="text"
            placeholder="Filter by path..."
            value={pathFilter}
            onChange={(e) => setPathFilter(e.target.value)}
            style={{ width: '200px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <label style={{ color: '#d1d5da', fontSize: '13px' }}>Limit:</label>
          <LimitInput
            type="number"
            min="1"
            max="1000"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          />
        </div>

        <ClearButton onClick={onClearTimeline}>
          🗑️ Clear Timeline
        </ClearButton>
      </TimelineControls>

      <TimelineContainer>
        {/* Stats */}
        <TimelineStats>
          <TimelineStatBadge color="#6c5ce7">
            📊 Total: {stats.total}
          </TimelineStatBadge>
          {stats.created > 0 && (
            <TimelineStatBadge color="#2ed573">
              ➕ Created: {stats.created}
            </TimelineStatBadge>
          )}
          {stats.updated > 0 && (
            <TimelineStatBadge color="#ffa502">
              ✏️ Updated: {stats.updated}
            </TimelineStatBadge>
          )}
          {stats.deleted > 0 && (
            <TimelineStatBadge color="#ff4757">
              🗑️ Deleted: {stats.deleted}
            </TimelineStatBadge>
          )}
          {stats.undo > 0 && (
            <TimelineStatBadge color="#ff6b6b">
              ↩️ Undo: {stats.undo}
            </TimelineStatBadge>
          )}
          {stats.redo > 0 && (
            <TimelineStatBadge color="#4ecdc4">
              ↪️ Redo: {stats.redo}
            </TimelineStatBadge>
          )}
        </TimelineStats>

        {/* Timeline Entries */}
        {filteredEntries.length === 0 ? (
          <EmptyTimeline>
            {timelineEntries.length === 0 
              ? "No timeline data available. Make some changes to see them here!" 
              : "No entries match your filters."
            }
          </EmptyTimeline>
        ) : (
          filteredEntries.map((entry, index) => (
            <TimelineEntry key={`${entry.timestamp}-${entry.index}`} actionType={entry.action}>
              <TimelineTime>{formatTime(entry.timestamp)}</TimelineTime>
              
              <TimelineAction actionType={entry.action}>
                {entry.action}
              </TimelineAction>

              <TimelinePath title={entry.path}>
                {entry.path}
              </TimelinePath>

              <TimelineValueChange>
                {entry.action === 'created' ? (
                  <>
                    <TimelineValue type="arrow">→</TimelineValue>
                    <TimelineValue type="new">
                      {formatValue(entry.newValue)}
                    </TimelineValue>
                  </>
                ) : entry.action === 'deleted' ? (
                  <>
                    <TimelineValue type="old">
                      {formatValue(entry.oldValue)}
                    </TimelineValue>
                    <TimelineValue type="arrow">→ ∅</TimelineValue>
                  </>
                ) : (
                  <>
                    <TimelineValue type="old">
                      {formatValue(entry.oldValue)}
                    </TimelineValue>
                    <TimelineValue type="arrow">→</TimelineValue>
                    <TimelineValue type="new">
                      {formatValue(entry.newValue)}
                    </TimelineValue>
                  </>
                )}
              </TimelineValueChange>
            </TimelineEntry>
          ))
        )}
      </TimelineContainer>
    </>
  );
};

// ✨ MAIN COMPONENT WITH TABS
export function OmniTurboViewer({ 
  refreshInterval = 100,
  showTypes = true,
  showMetadata = true,
  maxDepth = 100
}: OmniTurboViewerProps) {
  // ✨ NEW: Tab state
  const [activeTab, setActiveTab] = useState<'live' | 'timeline' | 'json'>('live');
  
  // ✨ NEW: Timeline state
  const [timelineEntries, setTimelineEntries] = useState<TimelineEntry[]>([]);


  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlySubscribed, setShowOnlySubscribed] = useState(false);
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showTypesState, setShowTypesState] = useState(showTypes);
  const [showMetadataState, setShowMetadataState] = useState(showMetadata);
  const [lastUpdate, setLastUpdate] = useState(Date.now());


  // ✨ NEW: JSON state
  const [jsonString, setJsonString] = useState<string>("");

  // ✨ NEW: Update JSON string when omni changes
  useEffect(() => {
    try {
      // You may want to customize which part of omni you want to show.
      // Here, we show the entire store as a plain object.
      // let raw: any = {};
      // if (typeof (omni as any).toJS === "function") {
      //   raw = (omni as any).toJS();
      // } else if ((omni as any).store && typeof (omni as any).store.entries === "function") {
      //   // Fallback: reconstruct from Map
      //   for (const [key, value] of (omni as any).store.entries()) {
      //     raw[key] = value && value.value !== undefined ? value.value : value;
      //   }
      // } else {
      //   raw = omni;
      // }
      let raw:any = omni.toObject();
      console.log("raw", raw);
      setJsonString(JSON.stringify(raw, null, 2));
    } catch (e) {
      setJsonString("// Error serializing omni data");
    }
  }, [lastUpdate]);


  // ✨ NEW: Timeline data fetching
  useEffect(() => {
    const fetchTimeline = () => {
      try {
        // Get timeline from OmniTurbo (assuming the timeline methods we discussed are implemented)
        const timeline = (omni as any).getTimeline?.({ limit: 1000 }) || [];
        setTimelineEntries(timeline);
      } catch (error) {
        console.warn('Timeline not available:', error);
        setTimelineEntries([]);
      }
    };

    fetchTimeline();
    const interval = setInterval(fetchTimeline, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  // ✨ NEW: Clear timeline handler
  const handleClearTimeline = () => {
    try {
      (omni as any).clearTimeline?.();
      setTimelineEntries([]);
    } catch (error) {
      console.warn('Clear timeline not available:', error);
    }
  };


  const hasSubscriptions = (path: string): boolean => {
    try {
      const valueObj = (omni as any).store?.get(path);
      return valueObj?.subs && valueObj.subs.size > 0;
    } catch {
      return false;
    }
  };

  const getSubscriptionCount = (path: string): number => {
    try {
      const valueObj = (omni as any).store?.get(path);
      return valueObj?.subs?.size || 0;
    } catch {
      return 0;
    }
  };

  const getHistoryCount = (path: string): number => {
    try {
      const valueObj = (omni as any).store?.get(path);
      return valueObj?.history?.length || 0;
    } catch {
      return 0;
    }
  };

  const getRedoCount = (path: string): number => {
    try {
      const valueObj = (omni as any).store?.get(path);
      if (!valueObj?.history) return 0;
      const historyIndex = valueObj.historyIndex ?? -1;
      return historyIndex > 0 ? historyIndex : 0;
    } catch {
      return 0;
    }
  };

  const getAlertCount = (path: string): number => {
    try {
      const alerts = (omni as any).alerts?.get(path);
      return alerts?.length || 0;
    } catch {
      return 0;
    }
  };

  const getValueType = (value: any): string => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'function') return 'function';
    return typeof value;
  };

  const formatValue = (value: any, type: string): string => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (type === 'string') return `"${value}"`;
    if (type === 'array') return `[${value.length} items]`;
    if (type === 'object') return `{${Object.keys(value).length} keys}`;
    if (type === 'function') return `ƒ ${value.name || 'anonymous'}`;
    return String(value);
  };

  // ✨ ADD THESE MISSING EVENT HANDLERS


  const toggleExpansion = (path: string) => {
    setExpandedPaths(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    const allPaths = new Set<string>();
    const addPaths = (nodes: TreeNode[]) => {
      nodes.forEach(node => {
        if (node.children.length > 0) {
          allPaths.add(node.fullPath);
          addPaths(node.children);
        }
      });
    };
    addPaths(treeData);
    setExpandedPaths(allPaths);
  };

  const collapseAll = () => {
    setExpandedPaths(new Set());
  };

  const startEditing = (path: string, currentValue: any) => {
    setEditingPath(path);
    setEditValue(String(currentValue));
  };

  const saveEdit = () => {
    if (!editingPath) return;
    
    try {
      let parsedValue: any;
      const trimmed = editValue.trim();
      
      if (trimmed === 'null') {
        parsedValue = null;
      } else if (trimmed === 'undefined') {
        parsedValue = undefined;
      } else if (trimmed === 'true') {
        parsedValue = true;
      } else if (trimmed === 'false') {
        parsedValue = false;
      } else if (!isNaN(Number(trimmed)) && trimmed !== '') {
        parsedValue = Number(trimmed);
      } else {
        parsedValue = smartQuote(trimmed);
      }
      
      omni.set(editingPath, parsedValue);
      setEditingPath(null);
      setEditValue('');
    } catch (error) {
      console.error('Failed to save edit:', error);
    }
  };

  const cancelEdit = () => {
    setEditingPath(null);
    setEditValue('');
  };




  // ✨ ADD THE MISSING buildTree FUNCTION
  const buildTree = useMemo(() => {
    // console.log('🔥 Building tree, lastUpdate:', lastUpdate);
    
    // Check if omni has getAllPaths method
    if (!omni.getAllPaths || typeof omni.getAllPaths !== 'function') {
      console.warn('omni.getAllPaths is not available');
      return [];
    }

    const allPaths = omni.getAllPaths();
    // console.log('🔥 All paths:', allPaths);
    
    if (!allPaths || allPaths.length === 0) {
      // console.log('🔥 No paths found in store');
      return [];
    }

    const pathData = allPaths.map(path => ({
      path,
      value: omni.get(path),
      hasSubscriptions: hasSubscriptions(path),
      alertCount: getAlertCount(path),
      subscriptionCount: getSubscriptionCount(path),
      hasHistory: getHistoryCount(path) > 0,
      redoCount: getRedoCount(path),
      historyCount: getHistoryCount(path)
    }));

    // console.log('🔥 Path data:', pathData);

    // Filter paths based on search and subscription filter
    const filteredPaths = pathData.filter(({ path, hasSubscriptions: hasSubs }) => {
      if (showOnlySubscribed && !hasSubs) return false;
      if (searchTerm) {
        return path.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return true;
    });

    // console.log('🔥 Filtered paths:', filteredPaths);

    // Build tree structure
    const nodeMap = new Map<string, TreeNode>();
    
    filteredPaths.forEach(({ path, value, hasSubscriptions, alertCount, subscriptionCount, hasHistory, historyCount, redoCount }) => {
      const parts = path.split('.');
      
      for (let i = 0; i < parts.length; i++) {
        const currentPath = parts.slice(0, i + 1).join('.');
        const isLeaf = i === parts.length - 1;
        
        if (!nodeMap.has(currentPath)) {
          nodeMap.set(currentPath, {
            key: parts[i],
            fullPath: currentPath,
            value: isLeaf ? value : {},
            type: isLeaf ? getValueType(value) : 'object',
            hasSubscriptions: isLeaf ? hasSubscriptions : false,
            subscriptionCount: subscriptionCount,
            alertCount: isLeaf ? alertCount : 0,
            hasHistory: hasHistory,
            historyCount: historyCount,
            redoCount: redoCount,
            children: [],
            isExpanded: expandedPaths.has(currentPath),
            level: i
          });
        } else if (isLeaf) {
          const node = nodeMap.get(currentPath)!;
          node.value = value;
          node.type = getValueType(value);
          node.hasSubscriptions = hasSubscriptions;
          node.hasHistory = historyCount > 0;
          node.historyCount = historyCount;
          node.redoCount = redoCount;
          node.subscriptionCount = subscriptionCount;
          node.alertCount = alertCount;
        }
      }
    });

    // --- PATCH: Add array and object children as expandable nodes ---
    for (const [path, node] of nodeMap.entries()) {
      // Expand arrays
      if (Array.isArray(node.value)) {
        node.type = 'array';
        node.children = node.value.map((item, idx) => {
          const childPath = `${path}[${idx}]`;
          return {
            key: String(idx),
            fullPath: childPath,
            value: item,
            type: getValueType(item),
            hasSubscriptions: false,
            subscriptionCount: 0,
            alertCount: 0,
            hasHistory: false,
            historyCount: 0,
            redoCount: 0,
            children: [],
            isExpanded: expandedPaths.has(childPath),
            level: node.level + 1
          } as TreeNode;
        });
      }
      // Expand objects that are not already split by dot notation
      else if (
        node.value &&
        typeof node.value === 'object' &&
        !Array.isArray(node.value)
      ) {
        // Check if this object is "atomic" (not split by dot notation in the store)
        const hasDotChildren = Array.from(nodeMap.keys()).some(
          k => k.startsWith(path + '.') && k !== path
        );
        if (!hasDotChildren) {
          node.type = 'object';
          node.children = Object.entries(node.value).map(([k, v]) => {
            // If key is not a valid JS identifier, use bracket notation for path
            const isValidKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k);
            const childPath = isValidKey ? `${path}.${k}` : `${path}["${k}"]`;
            return {
              key: k,
              fullPath: childPath,
              value: v,
              type: getValueType(v),
              hasSubscriptions: false,
              subscriptionCount: 0,
              alertCount: 0,
              hasHistory: false,
              historyCount: 0,
              redoCount: 0,
              children: [],
              isExpanded: expandedPaths.has(childPath),
              level: node.level + 1
            } as TreeNode;
          });
        }
      }
    }

    // Build parent-child relationships for non-array objects (dot notation)
    for (const [path, node] of nodeMap.entries()) {
      const parts = path.split('.');
      if (parts.length > 1) {
        const parentPath = parts.slice(0, -1).join('.');
        const parent = nodeMap.get(parentPath);
        if (parent && !Array.isArray(parent.value)) {
          parent.children.push(node);
        }
      }
    }

    // Return root nodes
    const result = Array.from(nodeMap.values())
      .filter(node => node.level === 0)
      .sort((a, b) => a.key.localeCompare(b.key));

    // console.log('🔥 Final tree result:', result);
    return result;
  }, [expandedPaths, searchTerm, showOnlySubscribed, lastUpdate]);



  useEffect(() => {
    const unsubscribe = omni.subscribeGlobal((path: string, value: any, oldValue?: any) => {
      // console.log('🔥 OmniTurbo change detected:', { path, value, oldValue });
      setLastUpdate(Date.now());
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const debugTimer = setInterval(() => {
      // console.log('🔥 Debug - Store stats:', omni.getStats());
      // console.log('🔥 Debug - Tree data length:', treeData.length);
    }, 5000);

    return () => clearInterval(debugTimer);
  }, [treeData]);


  // ✨ FIX: Update treeData when buildTree changes
  useEffect(() => {
    setTreeData(buildTree);
  }, [buildTree]);

  // ✨ FIX: Initial data load
  useEffect(() => {
    // console.log('🔥 Initial load');
    setLastUpdate(Date.now());
    
    // Force a rebuild after a short delay to ensure omni is ready
    const timer = setTimeout(() => {
      // console.log('🔥 Delayed reload');
      setLastUpdate(Date.now());
    }, 100);

    return () => clearTimeout(timer);
  }, []);
  // ✨ ADD THE MISSING renderNode FUNCTION

  const renderNode = (node: TreeNode): React.ReactNode => {
    const hasChildren = node.children.length > 0;
    const isExpanded = expandedPaths.has(node.fullPath);
    const isEditing = editingPath === node.fullPath;
  
    // If this is an atomic object with no children, show as pretty JSON
    const isAtomicObject =
      node.type === 'object' &&
      !hasChildren &&
      node.value &&
      typeof node.value === 'object' &&
      Object.keys(node.value).length > 0;
  
    return (
      <TreeNode key={node.fullPath}>
        <NodeContent level={node.level}>
          {/* Expand/collapse button for parent nodes */}
          {hasChildren && (
            <ExpandButton
              isExpanded={isExpanded}
              onClick={() => toggleExpansion(node.fullPath)}
            />
          )}
          {!hasChildren && <div style={{ width: '16px' }} />}
  
          {/* Node key */}
          <NodeKey onClick={() => toggleExpansion(node.fullPath)}>
            {node.key}
          </NodeKey>
  
          {/* Node value */}
          <NodeValue>
            {isEditing ? (
              <>
                <EditInput
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit();
                    if (e.key === 'Escape') cancelEdit();
                  }}
                  autoFocus
                />
                <EditControls>
                  <EditButton variant="save" onClick={saveEdit}>
                    ✓
                  </EditButton>
                  <EditButton variant="cancel" onClick={cancelEdit}>
                    ✕
                  </EditButton>
                </EditControls>
              </>
            ) : isAtomicObject ? (
              <ValueDisplay
                valueType={node.type}
                title="Atomic object (not navigable by dot notation)"
                style={{
                  whiteSpace: 'pre',
                  fontFamily: 'Fira Mono, Menlo, Monaco, Consolas, monospace',
                  background: '#232323',
                  borderRadius: 4,
                  padding: '4px 8px',
                  maxWidth: 400,
                  overflowX: 'auto'
                }}
              >
                {JSON.stringify(node.value, null, 2)}
              </ValueDisplay>
            ) : (
              <>
                <ValueDisplay
                  valueType={node.type}
                  onClick={() => !hasChildren && startEditing(node.fullPath, node.value)}
                  title="Click to edit"
                >
                  {formatValue(node.value, node.type)}
                </ValueDisplay>
  
                {/* Type badge */}
                {showTypesState && (
                  <TypeBadge type={node.type}>
                    {node.type}
                  </TypeBadge>
                )}
  
                {/* Metadata badges */}
                {showMetadataState && (
                  <MetadataBadges>
                    {node.hasSubscriptions && (
                      <MetadataBadge type="subscription" title={`${node.subscriptionCount} subscriptions`}>
                        👁️ {node.subscriptionCount}
                      </MetadataBadge>
                    )}
                    {node.alertCount > 0 && (
                      <MetadataBadge type="alert" title={`${node.alertCount} alerts`}>
                        🚨 {node.alertCount}
                      </MetadataBadge>
                    )}
                    {node.hasHistory && (
                      <MetadataBadge type="history" title={`${node.historyCount} history entries`}>
                        📜 {node.historyCount}
                      </MetadataBadge>
                    )}
                    {node.redoCount > 0 && (
                      <MetadataBadge type="redo" title={`${node.redoCount} redo available`}>
                        ↪️ {node.redoCount}
                      </MetadataBadge>
                    )}
                    <NodePath title="Full path">
                      {node.fullPath}
                    </NodePath>
                  </MetadataBadges>
                )}
              </>
            )}
          </NodeValue>
        </NodeContent>
  
        {/* Render children if expanded */}
        {hasChildren && isExpanded && (
          <div>
            {node.children
              .sort((a, b) => a.key.localeCompare(b.key))
              .map(renderNode)}
          </div>
        )}
      </TreeNode>
    );
  };






  /**
   * 🔥 REAL-TIME UPDATES via Global Subscription
   */
  useEffect(() => {
    const unsubscribe = omni.subscribeGlobal((path: string, value: any, oldValue?: any) => {
      // console.log('🔥 OmniTurbo change detected:', { path, value, oldValue });
      setTreeData(buildTree);
      setLastUpdate(Date.now());
    });

    setLastUpdate(Date.now());
    return unsubscribe;
  }, []);

  // ... keep all your existing helper functions and buildTree logic ...
  // (hasSubscriptions, getSubscriptionCount, getHistoryCount, etc.)

  // ... keep all your existing event handlers ...
  // (toggleExpansion, startEditing, saveEdit, etc.)

  const stats = omni.getStats();

  return (
    <ViewerContainer>
      <ViewerHeader>
        <HeaderTitle>🔍 OmniTurbo Live Viewer</HeaderTitle>
        
        <ViewerStats>
          <StatBadge>Store: {stats.storeSize} items</StatBadge>
          <StatBadge>Quick Mode: {stats.quickMode ? 'ON' : 'OFF'}</StatBadge>
          <StatBadge>Batch Mode: {stats.batchMode ? 'ON' : 'OFF'}</StatBadge>
          <StatBadge>Waiters: {stats.activeWaiters}</StatBadge>
          <StatBadge>Alerts: {stats.activeAlerts}</StatBadge>
        </ViewerStats>
      </ViewerHeader>

      {/* ✨ NEW: Tab Navigation */}
      <TabContainer>
        <TabButton 
          $active={activeTab === 'live'} 
          onClick={() => setActiveTab('live')}
        >
          📊 Live Data
        </TabButton>
        <TabButton 
          $active={activeTab === 'timeline'} 
          onClick={() => setActiveTab('timeline')}
        >
          📅 Timeline ({timelineEntries.length})
        </TabButton>
        <TabButton
          $active={activeTab === 'json'}
          onClick={() => setActiveTab('json')}
        >
          📝 JSON
        </TabButton>
      </TabContainer>

      {/* ✨ LIVE DATA TAB */}
      <TabContent $active={activeTab === 'live'}>
        <ViewerControls>
          <SearchControls>
            <SearchInput
              type="text"
              placeholder="Search paths..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <CheckboxLabel>
              <input
                type="checkbox"
                checked={showOnlySubscribed}
                onChange={(e) => setShowOnlySubscribed(e.target.checked)}
              />
              Only subbed
            </CheckboxLabel>
          </SearchControls>

          <ExpansionControls>
            <ControlButton onClick={expandAll}>
              Expand All
            </ControlButton>
            <ControlButton onClick={collapseAll}>
              Collapse All
            </ControlButton>
          </ExpansionControls>

          <DisplayOptions>
            <CheckboxLabel>
              <input
                type="checkbox"
                checked={showTypesState}
                onChange={(e) => setShowTypesState(e.target.checked)}
              />
              Show types
            </CheckboxLabel>
            
            <CheckboxLabel>
              <input
                type="checkbox"
                checked={showMetadataState}
                onChange={(e) => setShowMetadataState(e.target.checked)}
              />
              Show metadata
            </CheckboxLabel>
          </DisplayOptions>

          <button onClick={() => omni.undoAll()}>↩</button>
          <button onClick={() => omni.redoAll()}>↪</button>
        </ViewerControls>

        <TreeContainer>
          {treeData.length === 0 ? (
            <EmptyState>
              {searchTerm || showOnlySubscribed ? 'No matching items found' : 'OmniTurbo store is empty'}
            </EmptyState>
          ) : (
            <TreeContent>
              {treeData.map(renderNode)}
            </TreeContent>
          )}
        </TreeContainer>

        <ViewerFooter>
          Click values to edit • 
          👁️ = subscriptions • 
          🚨 = alerts
        </ViewerFooter>
      </TabContent>

      {/* ✨ TIMELINE TAB */}
      <TabContent $active={activeTab === 'timeline'}>
        <TimelineView 
          timelineEntries={timelineEntries}
          onClearTimeline={handleClearTimeline}
        />
      </TabContent>

      {/* ✨ JSON TAB */}
      <TabContent $active={activeTab === 'json'}>
        <JsonContainer>
          {jsonString}
        </JsonContainer>
      </TabContent>
    </ViewerContainer>
  );
}

// ... include all your existing helper functions and utilities here ...
// (smartQuote, isStringNumber, etc.)




























/**
 * Wraps a value in quotes if it contains alphabetic or symbol characters,
 * after removing any existing quotes
 * 
 * @param value - The value to process
 * @returns Quoted string if needed, or original value
 * 
 * @example
 * ```typescript
 * smartQuote('hello');        // '"hello"'
 * smartQuote('"hello"');      // '"hello"' (removes existing quotes first)
 * smartQuote("'hello'");      // '"hello"' (removes existing quotes first)
 * smartQuote('123');          // '123' (no quotes needed)
 * smartQuote('123abc');       // '"123abc"' (has letters)
 * smartQuote('hello-world');  // '"hello-world"' (has symbols)
 * smartQuote('42.5');         // '42.5' (pure number)
 * smartQuote('true');         // '"true"' (word, not boolean)
 * smartQuote(42);             // 42 (number stays number)
 * ```
 */
export function smartQuote(value: any): any {
  // Don't process non-string values
  if (typeof value !== 'string') {
    return value;
  }

  // Remove existing quotes (both single and double)
  var cleaned = value.replace(/^["']/g, '');
  cleaned = cleaned.replace(/["']$/g, '');
  // console.log("cleaned : ",cleaned);


  // return cleaned
  
  // Check if it needs quotes (has alphabetic characters or symbols)
  const needsQuotes = /[a-zA-Z]/.test(cleaned);
  // console.log("needsQuotes : ",needsQuotes);
  if(isStringNumber(cleaned))return Number(cleaned);
  if(typeof cleaned === "string") return cleaned;
  return cleaned;
  // const needsQuotes = /[a-zA-Z]|[^\d\s\.]/.test(cleaned);
  
  return needsQuotes ? `"${cleaned}"` : cleaned;
}



/**
 * Determines if the value provided is a string that contains a valid number.
 *
 * This function checks if a string can be converted to a valid number,
 * including integers, floats, scientific notation, and various number formats.
 *
 * Arguments
 * ---------------
 * @param {any} val - The value to be tested.
 * @param {boolean} [strict=false] - If true, applies stricter validation (no leading/trailing whitespace, no mixed content).
 * @param {boolean} [allowScientific=true] - If true, allows scientific notation (e.g., "1e5", "2.5e-3").
 * @param {boolean} [allowInfinity=false] - If true, allows "Infinity" and "-Infinity" strings.
 *
 * Return
 * ---------------
 * @return {boolean} True if the value is a string containing a valid number, false otherwise.
 *
 * Meta
 * ---------------
 * @author Colemen Atwood
 * @since 06\09\2025 14:30:00
 * @category Type Utilities
 * @version 1.0
 *
 * @example
 * ```typescript
 * isStringNumber("123");           // true
 * isStringNumber("123.45");        // true
 * isStringNumber("-456.78");       // true
 * isStringNumber("1e5");           // true
 * isStringNumber("  123  ");       // true (false if strict=true)
 * isStringNumber("123abc");        // false
 * isStringNumber("abc123");        // false
 * isStringNumber("Infinity");      // false (true if allowInfinity=true)
 * isStringNumber(123);             // false (not a string)
 * isStringNumber("");              // false
 * isStringNumber("NaN");           // false
 *
 * // Strict mode examples
 * isStringNumber("  123  ", true);     // false (whitespace not allowed)
 * isStringNumber("123.0", true);       // true
 * isStringNumber("1e5", true, false);  // false (scientific notation disabled)
 * ```
 */
export function isStringNumber(
    val: any,
    strict: boolean = false,
    allowScientific: boolean = true,
    allowInfinity: boolean = false
): boolean {
    // First check if it's actually a string
    if (typeof val !== 'string') {
        return false;
    }

    // Handle empty strings
    if (val === "" || val.trim() === "") {
        return false;
    }

    // Store original for strict mode checking
    const original = val;

    // Trim whitespace for processing (but check strict mode later)
    val = val.trim();

    // In strict mode, reject if original had leading/trailing whitespace
    if (strict && original !== val) {
        return false;
    }

    // Handle infinity cases
    if (val.toLowerCase() === "infinity" || val.toLowerCase() === "-infinity") {
        return allowInfinity;
    }

    // Reject obvious non-numbers
    if (val.toLowerCase() === "nan") {
        return false;
    }

    // Scientific notation pattern (only if allowed)
    if (!allowScientific && /[eE]/.test(val)) {
        return false;
    }

    // Build regex pattern based on options
    let pattern = "^";

    // Optional negative sign
    pattern += "[+-]?";

    // Number patterns - either:
    // 1. Integer: digits only
    // 2. Decimal: digits.digits or .digits or digits.
    pattern += "(?:";
    pattern += "\\d+(?:\\.\\d*)?|";  // digits with optional decimal part
    pattern += "\\.\\d+";            // decimal starting with dot
    pattern += ")";

    // Scientific notation (if allowed)
    if (allowScientific) {
        pattern += "(?:[eE][+-]?\\d+)?";
    }

    pattern += "$";

    const regex = new RegExp(pattern);

    // Test against regex
    if (!regex.test(val)) {
        return false;
    }

    // Final validation: ensure Number() conversion works and produces finite result
    const converted = Number(val);

    // Check if conversion was successful and result is finite (unless infinity is allowed)
    if (allowInfinity) {
        return !isNaN(converted); // Allow Infinity/-Infinity but not NaN
    } else {
        return isFinite(converted); // Only finite numbers
    }
}

