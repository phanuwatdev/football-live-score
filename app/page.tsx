'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [matches, setMatches] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const LEAGUE_ORDER = ['Premier League', 'La Liga', 'Bundesliga', 'Serie A'];

  useEffect(() => {
    fetch('http://localhost:8080/v1/matches')
      .then(res => {
        if (!res.ok) throw new Error('Server disconnected');
        return res.json();
      })
      .then(data => setMatches(data.matches || []))
      .catch(err => {
        console.error(err);
        setError('ERROR: 500 Internal Server Error');
      });
  }, []);

  if (error) {
    return (
      <main className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-white font-sans p-6">
        <div className="text-center p-8 border border-[#1f1f1f] rounded-lg bg-[#141414]">
          <p className="text-sm text-zinc-400">{error}</p>
        </div>
      </main>
    );
  }

  const groupedMatches = matches.reduce((acc, match) => {
    (acc[match.league] = acc[match.league] || []).push(match);
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        {LEAGUE_ORDER.map((leagueName) => {
          const leagueMatches = groupedMatches[leagueName] || [];
          // Sequence by match id
          const sortedMatches = [...leagueMatches].sort((a, b) => a.matchId.localeCompare(b.matchId));

          if (sortedMatches.length === 0) return null;

          return (
            <div key={leagueName} className="mb-10">
              <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">{leagueName}</h2>
              <div className="space-y-1">
                {sortedMatches.map((match: any, i: number) => (
                  <div key={match.matchId || i} className="grid grid-cols-[80px_1fr_60px_1fr_80px] items-center py-3 border-b border-[#1f1f1f]">

                    <span className={`text-[10px] font-medium ${match.status === 'LIVE' ? 'text-red-500 font-bold' : 'text-zinc-600'}`}>
                      {match.status === 'LIVE' ? 'LIVE'
                      : match.status === 'FT' ? 'FT'
                      : match.matchTime}
                    </span>

                    <span className="text-right text-sm font-normal truncate px-2">{match.homeTeam}</span>
                    <span className="text-center text-sm font-bold">{match.homeScore} : {match.awayScore}</span>
                    <span className="text-left text-sm font-normal truncate px-2">{match.awayTeam}</span>

                    <span className="text-[11px] text-right font-bold uppercase text-zinc-600">
                      {match.status === 'LIVE' ? (
                          <span className="text-white">{match.minute}'</span>
                      ) : match.status === 'FT' ? (
                          <span className="text-zinc-600">{match.minute}'</span>
                      ) : (
                          '' // If NS
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}