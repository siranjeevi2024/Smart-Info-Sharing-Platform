import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';

const TABS = ['live', 'upcoming', 'recent', 'players', 'series'];

const statusColor = (s = '') => {
  if (/live/i.test(s)) return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
  if (/upcoming/i.test(s)) return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
  return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400';
};

function Skeleton({ rows = 4 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="rounded-2xl bg-white dark:bg-slate-800 p-5 shadow animate-pulse">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-2" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
        </div>
      ))}
    </div>
  );
}

function MatchCard({ match, onClick }) {
  const t1 = match.teams?.[0] || 'TBA';
  const t2 = match.teams?.[1] || 'TBA';
  const score = match.score || [];

  return (
    <div
      onClick={() => onClick(match)}
      className="cursor-pointer rounded-2xl bg-white dark:bg-slate-800 p-5 shadow hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 border border-slate-100 dark:border-slate-700"
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColor(match.status)}`}>
          {match.status || 'N/A'}
        </span>
        <span className="text-xs text-slate-400">{match.matchType?.toUpperCase()}</span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{t1}</span>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            {score.find(s => s.inning?.includes(t1))?.r ?? '-'}/{score.find(s => s.inning?.includes(t1))?.w ?? '-'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{t2}</span>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            {score.find(s => s.inning?.includes(t2))?.r ?? '-'}/{score.find(s => s.inning?.includes(t2))?.w ?? '-'}
          </span>
        </div>
      </div>
      {match.venue && (
        <p className="mt-3 text-xs text-slate-400 truncate">📍 {match.venue}</p>
      )}
      {match.dateTimeGMT && (
        <p className="text-xs text-slate-400 mt-1">🕐 {new Date(match.dateTimeGMT).toLocaleString()}</p>
      )}
    </div>
  );
}

function MatchModal({ matchId, onClose }) {
  const [data, setData] = useState(null);
  const [scorecard, setScorecard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!matchId) return;
    setLoading(true);
    Promise.all([
      axios.get(`${API}/cricket/match/${matchId}`),
      axios.get(`${API}/cricket/scorecard/${matchId}`),
    ]).then(([m, s]) => {
      setData(m.data?.data);
      setScorecard(s.data?.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [matchId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
          <h2 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Match Details</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-2xl leading-none">&times;</button>
        </div>

        <div className="p-5">
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />)}
            </div>
          ) : data ? (
            <>
              <div className="text-center mb-4">
                <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  {data.teams?.[0]} <span className="text-slate-400">vs</span> {data.teams?.[1]}
                </p>
                <span className={`inline-block mt-1 text-xs font-bold px-3 py-1 rounded-full ${statusColor(data.status)}`}>
                  {data.status}
                </span>
                {data.venue && <p className="text-sm text-slate-400 mt-1">📍 {data.venue}</p>}
              </div>

              {/* Score summary */}
              {data.score?.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {data.score.map((s, i) => (
                    <div key={i} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-center">
                      <p className="text-xs text-slate-400 mb-1 truncate">{s.inning}</p>
                      <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{s.r}/{s.w}</p>
                      <p className="text-xs text-slate-400">{s.o} overs</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Scorecard innings */}
              {scorecard?.scorecard?.map((inn, i) => (
                <div key={i} className="mb-5">
                  <h3 className="font-bold text-emerald-600 dark:text-emerald-400 mb-2 text-sm">{inn.inning}</h3>
                  {/* Batting */}
                  <div className="overflow-x-auto mb-2">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-700">
                          <th className="text-left py-1 pr-2">Batter</th>
                          <th className="text-right py-1 px-1">R</th>
                          <th className="text-right py-1 px-1">B</th>
                          <th className="text-right py-1 px-1">4s</th>
                          <th className="text-right py-1 px-1">6s</th>
                          <th className="text-right py-1 pl-1">SR</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inn.batting?.map((b, j) => (
                          <tr key={j} className="border-b border-slate-50 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                            <td className="py-1 pr-2 font-medium">{b.batsman?.name || b.batsman}</td>
                            <td className="text-right py-1 px-1 font-bold">{b.r}</td>
                            <td className="text-right py-1 px-1">{b.b}</td>
                            <td className="text-right py-1 px-1">{b['4s']}</td>
                            <td className="text-right py-1 px-1">{b['6s']}</td>
                            <td className="text-right py-1 pl-1">{b.sr}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Bowling */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-700">
                          <th className="text-left py-1 pr-2">Bowler</th>
                          <th className="text-right py-1 px-1">O</th>
                          <th className="text-right py-1 px-1">M</th>
                          <th className="text-right py-1 px-1">R</th>
                          <th className="text-right py-1 pl-1">W</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inn.bowling?.map((b, j) => (
                          <tr key={j} className="border-b border-slate-50 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                            <td className="py-1 pr-2 font-medium">{b.bowler?.name || b.bowler}</td>
                            <td className="text-right py-1 px-1">{b.o}</td>
                            <td className="text-right py-1 px-1">{b.m}</td>
                            <td className="text-right py-1 px-1">{b.r}</td>
                            <td className="text-right py-1 pl-1 font-bold text-emerald-600">{b.w}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <p className="text-center text-slate-400 py-8">No data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function PlayerCard({ player, onClick }) {
  return (
    <div
      onClick={() => onClick(player)}
      className="cursor-pointer rounded-2xl bg-white dark:bg-slate-800 p-5 shadow hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 border border-slate-100 dark:border-slate-700 flex items-center gap-4"
    >
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
        {player.name?.[0] || '?'}
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{player.name}</p>
        <p className="text-xs text-slate-400">{player.country || 'Unknown'}</p>
      </div>
    </div>
  );
}

function PlayerModal({ playerId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!playerId) return;
    setLoading(true);
    axios.get(`${API}/cricket/player/${playerId}`)
      .then(r => setData(r.data?.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [playerId]);

  const stats = data?.stats || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
          <h2 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Player Info</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-2xl leading-none">&times;</button>
        </div>
        <div className="p-5">
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />)}
            </div>
          ) : data ? (
            <>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-2xl">
                  {data.name?.[0]}
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{data.name}</p>
                  <p className="text-sm text-slate-400">{data.country} · {data.role}</p>
                  {data.bat && <p className="text-xs text-slate-400">Bat: {data.bat} | Bowl: {data.bowl}</p>}
                </div>
              </div>
              {stats.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-700">
                        <th className="text-left py-1 pr-2">Format</th>
                        <th className="text-right py-1 px-1">M</th>
                        <th className="text-right py-1 px-1">Runs</th>
                        <th className="text-right py-1 px-1">Avg</th>
                        <th className="text-right py-1 pl-1">Wkts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.map((s, i) => (
                        <tr key={i} className="border-b border-slate-50 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                          <td className="py-1 pr-2 font-medium">{s.fn}</td>
                          <td className="text-right py-1 px-1">{s.m}</td>
                          <td className="text-right py-1 px-1">{s.r}</td>
                          <td className="text-right py-1 px-1">{s.avg}</td>
                          <td className="text-right py-1 pl-1">{s.wkts}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-slate-400 py-8">No data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Cricket() {
  const [tab, setTab] = useState('live');
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const fetchMatches = useCallback(async (status) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/cricket/matches?status=${status}`);
      setMatches(data?.data || []);
    } catch {
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSeries = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/cricket/series`);
      setSeries(data?.data || []);
    } catch {
      setSeries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchPlayers = useCallback(async (q) => {
    if (!q.trim()) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/cricket/players?search=${encodeURIComponent(q)}`);
      setPlayers(data?.data || []);
    } catch {
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === 'live' || tab === 'upcoming' || tab === 'recent') fetchMatches(tab);
    if (tab === 'series') fetchSeries();
    if (tab === 'players') setPlayers([]);
  }, [tab, fetchMatches, fetchSeries]);

  const tabLabel = (t) => ({ live: '🔴 Live', upcoming: '📅 Upcoming', recent: '✅ Recent', players: '👤 Players', series: '🏆 Series' }[t]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white py-10 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold mb-1">🏏 Cricket</h1>
          <p className="text-emerald-100 text-sm">Live scores, match details, player stats & series</p>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                tab === t
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {tabLabel(t)}
            </button>
          ))}
        </div>

        {/* Players search bar */}
        {tab === 'players' && (
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && searchPlayers(search)}
              placeholder="Search player name..."
              className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <button
              onClick={() => searchPlayers(search)}
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition"
            >
              Search
            </button>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <Skeleton rows={6} />
        ) : tab === 'players' ? (
          players.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <p className="text-4xl mb-3">👤</p>
              <p>Search for a player above</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {players.map(p => (
                <PlayerCard key={p.id} player={p} onClick={pl => setSelectedPlayer(pl.id)} />
              ))}
            </div>
          )
        ) : tab === 'series' ? (
          series.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <p className="text-4xl mb-3">🏆</p>
              <p>No series found</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {series.map(s => (
                <div key={s.id} className="rounded-2xl bg-white dark:bg-slate-800 p-5 shadow border border-slate-100 dark:border-slate-700">
                  <p className="font-semibold text-slate-800 dark:text-slate-100 mb-1">🏆 {s.name}</p>
                  <p className="text-xs text-slate-400">{s.startDate} – {s.endDate}</p>
                  <p className="text-xs text-slate-400 mt-1">{s.odi} ODIs · {s.t20} T20s · {s.test} Tests</p>
                </div>
              ))}
            </div>
          )
        ) : matches.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="text-4xl mb-3">🏏</p>
            <p>No {tab} matches found</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {matches.map(m => (
              <MatchCard key={m.id} match={m} onClick={match => setSelectedMatch(match.id)} />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedMatch && <MatchModal matchId={selectedMatch} onClose={() => setSelectedMatch(null)} />}
      {selectedPlayer && <PlayerModal playerId={selectedPlayer} onClose={() => setSelectedPlayer(null)} />}
    </div>
  );
}
