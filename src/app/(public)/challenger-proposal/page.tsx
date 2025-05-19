"use client";

import { useState } from "react";
import { Trophy, Users, Calendar, Award, ArrowUp, ArrowDown, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";

export default function TennisRankingSystem() {
  const [activeTab, setActiveTab] = useState("rankings");

  const samplePlayers = [
    { id: 1, name: "Michael Scott", rank: 1, points: 1580, trend: "stable", lastMatch: "2 days ago" },
    { id: 2, name: "Jim Halpert", rank: 2, points: 1520, trend: "up", lastMatch: "5 days ago" },
    { id: 3, name: "Dwight Schrute", rank: 3, points: 1490, trend: "down", lastMatch: "1 day ago" },
    { id: 4, name: "Pam Beesly", rank: 4, points: 1430, trend: "up", lastMatch: "3 days ago" },
    { id: 5, name: "Andy Bernard", rank: 5, points: 1380, trend: "down", lastMatch: "1 week ago" },
    { id: 6, name: "Stanley Hudson", rank: 6, points: 1290, trend: "stable", lastMatch: "2 weeks ago" },
    { id: 7, name: "Kelly Kapoor", rank: 7, points: 1250, trend: "up", lastMatch: "4 days ago" },
    { id: 8, name: "Oscar Martinez", rank: 8, points: 1180, trend: "stable", lastMatch: "1 week ago" },
    { id: 9, name: "Angela Martin", rank: 9, points: 1120, trend: "down", lastMatch: "3 weeks ago" },
    { id: 10, name: "Kevin Malone", rank: 10, points: 1050, trend: "up", lastMatch: "2 days ago" },
  ];

  const upcomingMatches = [
    { id: 1, challenger: "Jim Halpert", challenged: "Michael Scott", date: "May 21, 2025", time: "18:30" },
    { id: 2, challenger: "Kevin Malone", challenged: "Angela Martin", date: "May 22, 2025", time: "19:00" },
    { id: 3, challenger: "Pam Beesly", challenged: "Dwight Schrute", date: "May 24, 2025", time: "10:00" },
    { id: 4, challenger: "Kelly Kapoor", challenged: "Stanley Hudson", date: "May 25, 2025", time: "16:30" },
  ];

  const recentResults = [
    { id: 1, winner: "Dwight Schrute", loser: "Andy Bernard", score: "6-4, 7-5", points: "+25" },
    { id: 2, winner: "Jim Halpert", loser: "Oscar Martinez", score: "6-2, 6-3", points: "+20" },
    { id: 3, winner: "Kevin Malone", loser: "Angela Martin", score: "7-6, 4-6, 7-6", points: "+20" },
    { id: 4, winner: "Michael Scott", loser: "Stanley Hudson", score: "6-1, 6-0", points: "+20" },
  ];

  return (
    <div className="flex flex-col bg-gray-100 ">
      {/* Challenger Series Proposal */}
      <Card className="max-w-3xl mx-auto mt-6 mb-4 p-6">
        <h2 className="text-2xl font-bold mb-2 text-primary">The "Challenger Series" Ranking System - Proposal</h2>
        <p className="mb-4 text-base text-foreground">
          This challenger series ranking system creates excitement through challenges, while ensuring fair play across skill levels and opportunities to play and get a ranking in different clubs.
        </p>
        <h3 className="text-lg font-semibold mt-4 mb-1 text-accent">Core Mechanics</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <span className="font-semibold">Initial Rankings</span>
            <ul className="list-disc pl-6 mt-1 text-sm space-y-1">
              <li>
                All players start with a base rating of <span className="font-semibold">1000 points</span>
              </li>
              <li>Players are initially ranked based on a brief assessment match or self-declaration of skill level</li>
            </ul>
          </li>
          <li>
            <span className="font-semibold">Challenge Rules</span>
            <ul className="list-disc pl-6 mt-1 text-sm space-y-1">
              <li>
                Players can challenge others within <span className="font-semibold">5 ranking positions above</span> them
              </li>
              <li>
                Matches are scheduled within <span className="font-semibold">2 weeks</span> of challenge
              </li>
              <li>
                If the higher-ranked player declines without valid reason, they forfeit <span className="font-semibold">20 points</span>
              </li>
            </ul>
          </li>
          <li>
            <span className="font-semibold">Points System</span>
            <ul className="list-disc pl-6 mt-1 text-sm space-y-1">
              <li>
                Base points for wins: <span className="font-semibold">20 points</span>
              </li>
              <li>
                Scaling based on ranking gap:
                <ul className="list-disc pl-6 mt-1">
                  <li>
                    Beating someone ranked higher: <span className="font-semibold">+10 additional points per rank difference</span>
                  </li>
                  <li>Beating someone ranked lower: only base points</li>
                </ul>
              </li>
              <li>
                Close matches (e.g., 7-5, 7-6) earn the loser <span className="font-semibold">5 "effort points"</span>
              </li>
            </ul>
          </li>
          <li>
            <span className="font-semibold">Ranking Protection</span>
            <ul className="list-disc pl-6 mt-1 text-sm space-y-1">
              <li>
                Players must defend their position by playing at least <span className="font-semibold">2 matches per month</span>
              </li>
              <li>
                Inactive players (no matches for 30 days) lose <span className="font-semibold">10 points per week of inactivity</span>
              </li>
            </ul>
          </li>
        </ul>
      </Card>

      <Card className="max-w-3xl mx-auto mt-6 mb-4 p-6 w-full">
        {/* Header */}
        {/* <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <h1 className="text-2xl font-bold flex items-center">
          <Trophy className="mr-2" /> Tennis Club Rankings
        </h1>
      </header> */}

        {/* Navigation */}
        <nav className="bg-card p-2 shadow-sm">
          <div className="flex justify-around gap-2 sm:gap-4">
            <Button
              variant={activeTab === "rankings" ? "default" : "secondary"}
              className="flex items-center px-2 sm:px-4 py-2 rounded-lg text-sm sm:text-base"
              onClick={() => setActiveTab("rankings")}
            >
              <Award className="mr-1" size={18} /> <span className="hidden sm:inline">Rankings</span>
            </Button>
            <Button
              variant={activeTab === "challenges" ? "default" : "secondary"}
              className="flex items-center px-2 sm:px-4 py-2 rounded-lg text-sm sm:text-base"
              onClick={() => setActiveTab("challenges")}
            >
              <Users className="mr-1" size={18} /> <span className="hidden sm:inline">Challenges</span>
            </Button>
            <Button variant={activeTab === "results" ? "default" : "secondary"} className="flex items-center px-2 sm:px-4 py-2 rounded-lg text-sm sm:text-base" onClick={() => setActiveTab("results")}>
              <Calendar className="mr-1" size={18} /> <span className="hidden sm:inline">Results</span>
            </Button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-grow p-4 h-full">
          {activeTab === "rankings" && (
            <Card>
              <h2 className="text-xl font-semibold mb-4">Current Rankings</h2>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted">
                      <TableHead className="w-16">Rank</TableHead>
                      <TableHead>Player</TableHead>
                      <TableHead className="text-right w-20">Points</TableHead>
                      <TableHead className="text-center w-16">Trend</TableHead>
                      <TableHead className="text-right hidden sm:table-cell">Last Match</TableHead>
                      <TableHead className="text-center w-24">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {samplePlayers.map((player) => (
                      <TableRow key={player.id}>
                        <TableCell className="w-16">{player.rank}</TableCell>
                        <TableCell className="font-medium">{player.name}</TableCell>
                        <TableCell className="text-right w-20">{player.points}</TableCell>
                        <TableCell className="text-center w-16">
                          {player.trend === "up" && <ArrowUp className="inline text-primary" size={18} />}
                          {player.trend === "down" && <ArrowDown className="inline text-destructive" size={18} />}
                          {player.trend === "stable" && <span className="text-muted-foreground">-</span>}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground hidden sm:table-cell">{player.lastMatch}</TableCell>
                        <TableCell className="text-center w-24">
                          <Button variant="secondary" size="sm">
                            Challenge
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          )}

          {activeTab === "challenges" && (
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-semibold mb-4">Upcoming Challenges</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingMatches.map((match) => (
                  <div key={match.id} className="border rounded-lg p-4 bg-blue-50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-blue-700">Challenge Match</span>
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center">
                        <Clock size={14} className="mr-1" />
                        {match.date} at {match.time}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{match.challenger}</div>
                        <div className="text-sm text-gray-500">Challenger</div>
                      </div>
                      <div className="font-bold text-gray-500">vs</div>
                      <div className="text-right">
                        <div className="font-semibold">{match.challenged}</div>
                        <div className="text-sm text-gray-500">Challenged</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <button type="button" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center mx-auto">
                  <Users className="mr-2" /> Issue New Challenge
                </button>
              </div>
            </div>
          )}

          {activeTab === "results" && (
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-semibold mb-4">Recent Results</h2>
              <div className="space-y-4">
                {recentResults.map((result) => (
                  <div key={result.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-green-700">{result.winner}</div>
                        <div className="text-sm text-gray-500">Winner</div>
                      </div>
                      <div className="text-center">
                        <div className="font-mono bg-gray-100 px-3 py-1 rounded-lg">{result.score}</div>
                        <div className="text-sm text-green-600 font-medium mt-1">{result.points} points</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-700">{result.loser}</div>
                        <div className="text-sm text-gray-500">Loser</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <button type="button" className="text-blue-600 hover:text-blue-800 underline">
                  View All Results
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Footer with quick stats */}
        <footer className="bg-white p-4 border-t">
          <div className="flex justify-around text-sm text-gray-600">
            <div>
              Total Players: <span className="font-semibold">42</span>
            </div>
            <div>
              Matches This Month: <span className="font-semibold">68</span>
            </div>
            <div>
              Next Tournament: <span className="font-semibold">June 15, 2025</span>
            </div>
          </div>
        </footer>
      </Card>
    </div>
  );
}
