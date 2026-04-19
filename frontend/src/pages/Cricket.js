import React, { useEffect, useState, useCallback } from 'react';
import API from '../utils/api';

const tabs = [
  { key: 'live', label: 'Live & Recent', icon: '🔴' },
  { key: 'upcoming', label: 'Upcoming', icon: '📅' },
  { key: 'players', label: 'Players', icon: '👤' },
];

const matchTypeColors = {
  t20:  { bg: 'bg-violet-100 text-violet-700', border: 'border-violet-200' },
  odi:  { bg: 'bg-blue-100 text-blue-700', border: 'border-blue-200' },
  test: { bg: 'bg-amber-100 text-amber-700', border: 'border-amber-200' },
};

const formatLabels = { test: 'TEST', odi: 'ODI', t20: 'T20', t20i: 'T20I', ipl: 'IPL' };

const SkeletonCard = () => (
  <div className="card p-4 space-y-3 animate-pulse">
    <div className="flex gap-3 items-center">
      <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700" />
      <div className="flex-1 h-3 bg-slate-200 dark:bg-slate-700 rounded" />
    </div>
    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
  </div>
);

const MatchCard = ({ match }) => {
  const isLive = match.matchStarted && !match.matchEnded;
  const typeStyle = matchTypeColors[match.matchType] || { bg: 'bg-slate-100 text-slate-600', border: '' };

  return (
    <div className={`card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isLive ? 'ring-2 ring-red-400' : ''}`}>
      {/* Top bar */}
      <div className={`h-1 w-full ${isLive ? 'bg-red-500' : 'bg-slate-200'}`} />

      <div className="p-4">
        {/* Badges + date */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            {isLive && (
              <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" /> LIVE
              </span>
            )}
            {match.matchType && (
              <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${typeStyle.bg}`}>
                {match.matchType.toUpperCase()}
              </span>
            )}
          </div>
          <span className="text-xs text-slate-400">{match.date}</span>
        </div>

        {/* Series name */}
        <p className="text-xs text-slate-400 line-clamp-1 mb-3">{match.name}</p>

        {/* Teams row */}
        <div className="space-y-2 mb-3">
          {match.teamInfo?.slice(0, 2).map((team, i) => {
            const score = match.score?.find(s => s.inning?.toLowerCase().includes(team.name?.toLowerCase().split(' ')[0]));
            return (
              <div key={i} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <img
                    src={team.img}
                    alt={team.shortname}
                    className="h-8 w-8 rounded-full object-cover bg-slate-100 flex-shrink-0 border border-slate-200"
                    onError={(e) => { e.target.src = 'https://h.cricapi.com/img/icon512.png'; }}
                  />
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{team.name}</span>
                </div>
                {score && (
                  <span className="text-sm font-black text-slate-800 dark:text-slate-100 flex-shrink-0">
                    {score.r}/{score.w} <span className="text-xs font-normal text-slate-400">({score.o})</span>
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Status */}
        <div className={`rounded-xl px-3 py-2 text-xs font-semibold text-center ${
          isLive ? 'bg-red-50 text-red-600 dark:bg-red-900/20' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20'
        }`}>
          {match.status}
        </div>

        {/* Venue */}
        {match.venue && (
          <p className="mt-2 text-xs text-slate-400 flex items-center gap-1 truncate">
            <svg className="h-3 w-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {match.venue}
          </p>
        )}
      </div>
    </div>
  );
};

const StatTable = ({ stats, fn, matchtype }) => {
  const rows = stats?.filter(s => s.fn === fn && s.matchtype?.trim() === matchtype && s.value?.trim() !== '0');
  if (!rows?.length) return null;

  const statMap = {};
  rows.forEach(r => { statMap[r.stat?.trim()] = r.value?.trim(); });

  const battingCols = ['m', 'inn', 'runs', 'hs', 'avg', 'sr', '100s', '50s', '4s', '6s'];
  const bowlingCols = ['m', 'inn', 'wkts', 'avg', 'econ', 'sr', 'bbi'];

  const cols = fn === 'batting' ? battingCols : bowlingCols;
  const labels = {
    m: 'M', inn: 'Inn', runs: 'Runs', hs: 'HS', avg: 'Avg', sr: 'SR',
    '100s': '100s', '50s': '50s', '4s': '4s', '6s': '6s',
    wkts: 'Wkts', econ: 'Econ', bbi: 'BBI', b: 'Balls', no: 'NO'
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-700/50">
            {cols.map(c => statMap[c] !== undefined && (
              <th key={c} className="px-2 py-1.5 text-center font-bold text-slate-500 dark:text-slate-400">{labels[c] || c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {cols.map(c => statMap[c] !== undefined && (
              <td key={c} className="px-2 py-1.5 text-center font-semibold text-slate-800 dark:text-slate-100">{statMap[c]}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const PlayerModal = ({ player, onClose }) => {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFormat, setActiveFormat] = useState('ipl');

  useEffect(() => {
    API.get(`/cricket/player/${player.id}`)
      .then(({ data }) => {
        setInfo(data.data);
        // set default tab to first available format
        const formats = ['ipl', 't20i', 'odi', 'test'];
        const available = formats.find(f =>
          data.data?.stats?.some(s => s.fn === 'batting' && s.matchtype?.trim() === f && parseInt(s.value) > 0)
        );
        if (available) setActiveFormat(available);
      })
      .catch(() => setInfo(null))
      .finally(() => setLoading(false));
  }, [player.id]);

  const availableFormats = info?.stats
    ? [...new Set(info.stats.map(s => s.matchtype?.trim()).filter(Boolean))]
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {info?.playerImg ? (
                <img src={info.playerImg} alt={info.name} className="h-16 w-16 rounded-2xl object-cover bg-white/20 border-2 border-white/30" />
              ) : (
                <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center text-white font-black text-2xl">
                  {player.name?.[0]?.toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="font-extrabold text-white text-xl">{info?.name || player.name}</h3>
                <p className="text-white/70 text-sm">{info?.country} · {info?.role}</p>
                <div className="flex gap-2 mt-1">
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs text-white">{info?.battingStyle}</span>
                  {info?.bowlingStyle && <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs text-white">{info?.bowlingStyle}</span>}
                </div>
              </div>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white text-2xl leading-none">✕</button>
          </div>
        </div>

        <div className="p-5">
          {loading ? (
            <div className="space-y-3 animate-pulse">
              {[...Array(5)].map((_, i) => <div key={i} className="h-4 bg-slate-200 rounded" />)}
            </div>
          ) : info ? (
            <>
              {/* Basic info */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { label: 'Date of Birth', value: info.dateOfBirth?.split('T')[0] },
                  { label: 'Birth Place', value: info.placeOfBirth },
                  { label: 'Role', value: info.role },
                  { label: 'Playing Role', value: info.playingRole },
                ].filter(r => r.value).map((row, i) => (
                  <div key={i} className="rounded-xl bg-slate-50 dark:bg-slate-700/50 p-3">
                    <p className="text-xs text-slate-400 mb-0.5">{row.label}</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{row.value}</p>
                  </div>
                ))}
              </div>

              {/* Format tabs */}
              {availableFormats.length > 0 && (
                <>
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide mb-4">
                    {availableFormats.map(f => (
                      <button
                        key={f}
                        onClick={() => setActiveFormat(f)}
                        className={`whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                          activeFormat === f
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {formatLabels[f] || f.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  {/* Batting stats */}
                  <div className="mb-4">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">🏏 Batting</p>
                    <div className="card overflow-hidden">
                      <StatTable stats={info.stats} fn="batting" matchtype={activeFormat} />
                    </div>
                  </div>

                  {/* Bowling stats */}
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">🎳 Bowling</p>
                    <div className="card overflow-hidden">
                      <StatTable stats={info.stats} fn="bowling" matchtype={activeFormat} />
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <p className="text-center text-slate-400 py-8">No detailed info available</p>
          )}
        </div>
      </div>
    </div>
  );
};

const PlayerCard = ({ player, onClick }) => (
  <div
    onClick={() => onClick(player)}
    className="card p-4 flex items-center gap-3 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-700"
  >
    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-black text-lg flex-shrink-0">
      {player.name?.[0]?.toUpperCase()}
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-bold text-slate-800 dark:text-slate-100 truncate">{player.name}</p>
      <p className="text-xs text-slate-400">{player.country || 'International'}</p>
    </div>
    <svg className="h-4 w-4 text-slate-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  </div>
);

const Cricket = () => {
  const [activeTab, setActiveTab] = useState('live');
  const [matches, setMatches] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playerSearch, setPlayerSearch] = useState('india');
  const [searchInput, setSearchInput] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/cricket/matches');
      setMatches(data.data || []);
    } catch { setMatches([]); }
    finally { setLoading(false); }
  }, []);

  const fetchUpcoming = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/cricket/upcoming');
      setUpcoming(data.data || []);
    } catch { setUpcoming([]); }
    finally { setLoading(false); }
  }, []);

  const fetchPlayers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/cricket/players', { params: { name: playerSearch } });
      setPlayers(data.data || []);
    } catch { setPlayers([]); }
    finally { setLoading(false); }
  }, [playerSearch]);

  useEffect(() => {
    if (activeTab === 'live') fetchMatches();
    else if (activeTab === 'upcoming') fetchUpcoming();
    else if (activeTab === 'players') fetchPlayers();
  }, [activeTab, fetchMatches, fetchUpcoming, fetchPlayers]);

  const handlePlayerSearch = (e) => {
    e.preventDefault();
    setPlayerSearch(searchInput || 'india');
  };

  const liveMatches = matches.filter(m => m.matchStarted && !m.matchEnded);
  const recentMatches = matches.filter(m => m.matchEnded);
  const filteredUpcoming = filter === 'all' ? upcoming : upcoming.filter(m => m.matchType === filter);

  return (
    <div className="page-container">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Header */}
        <div className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/70">Worldwide Cricket</p>
              <h1 className="text-2xl font-extrabold text-white sm:text-3xl">🏏 Cricket Center</h1>
              <p className="mt-1 text-sm text-white/60">Live scores · IPL · ODI · Test · Player Stats</p>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <div className="rounded-2xl bg-white/10 px-4 py-3 text-center backdrop-blur-sm">
                <p className="text-lg font-black text-white">{liveMatches.length}</p>
                <p className="text-[11px] font-medium text-white/60">Live Now</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-4 py-3 text-center backdrop-blur-sm">
                <p className="text-lg font-black text-white">{matches.length}</p>
                <p className="text-[11px] font-medium text-white/60">Matches</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all active:scale-95 ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-green-300 hover:text-green-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Live & Recent */}
        {activeTab === 'live' && (
          loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <>
              {liveMatches.length > 0 && (
                <div className="mb-6">
                  <h2 className="mb-3 flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100">
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    Live Matches ({liveMatches.length})
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {liveMatches.map(m => <MatchCard key={m.id} match={m} />)}
                  </div>
                </div>
              )}
              {recentMatches.length > 0 && (
                <div>
                  <h2 className="mb-3 font-bold text-slate-800 dark:text-slate-100">Recent Results ({recentMatches.length})</h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {recentMatches.map(m => <MatchCard key={m.id} match={m} />)}
                  </div>
                </div>
              )}
              {matches.length === 0 && (
                <div className="card p-14 text-center">
                  <div className="text-5xl mb-4">🏏</div>
                  <p className="text-slate-400">No matches found</p>
                </div>
              )}
            </>
          )
        )}

        {/* Upcoming */}
        {activeTab === 'upcoming' && (
          <>
            <div className="mb-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {['all', 't20', 'odi', 'test'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                    filter === f ? 'bg-emerald-600 text-white' : 'border border-slate-200 bg-white text-slate-600 hover:border-emerald-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                  }`}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
            {loading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filteredUpcoming.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredUpcoming.map(m => <MatchCard key={m.id} match={m} />)}
              </div>
            ) : (
              <div className="card p-14 text-center">
                <div className="text-5xl mb-4">📅</div>
                <p className="text-slate-400">No upcoming matches</p>
              </div>
            )}
          </>
        )}

        {/* Players */}
        {activeTab === 'players' && (
          <>
            <form onSubmit={handlePlayerSearch} className="mb-5 flex gap-2">
              <div className="relative flex-1">
                <svg className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search player (e.g. Virat, Rohit, Babar, Root...)"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              <button type="submit" className="btn-primary px-6">Search</button>
            </form>
            {loading ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : players.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {players.map(p => <PlayerCard key={p.id} player={p} onClick={setSelectedPlayer} />)}
              </div>
            ) : (
              <div className="card p-14 text-center">
                <div className="text-5xl mb-4">👤</div>
                <p className="text-slate-400">No players found. Try a different name.</p>
              </div>
            )}
          </>
        )}
      </div>

      {selectedPlayer && <PlayerModal player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />}
    </div>
  );
};

export default Cricket;
