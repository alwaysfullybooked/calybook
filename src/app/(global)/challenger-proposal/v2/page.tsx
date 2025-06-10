import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tennis Connect Unified Rating (TCUR) - Proposal",
  description: "A revolutionary unified rating system for tennis players worldwide",
};

export default function ProposalPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">The Future of Tennis Ranking</h1>
          <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 dark:text-blue-400 mb-8">Introducing the Tennis Connect Unified Rating (TCUR)</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">One Player, One Rating, A Global Community</p>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Our Vision</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Imagine a world where every tennis match you play—from a friendly challenge at your local club to a competitive league final—contributes to a single, accurate, and meaningful rating. A
            rating that shows you where you stand not just on your club's ladder, but in your city, your region, and even the world.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            This is the vision of Tennis Connect. We are building a truly unified global ranking system from the ground up, starting with the heart of tennis: the local club.
          </p>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">The Problem: A Fragmented and Inaccurate Landscape</h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 text-blue-600 dark:text-blue-400">•</div>
              <p className="ml-3 text-lg text-gray-600 dark:text-gray-300">
                <strong>Isolated Club Ladders:</strong> Most club ladders are simple win/loss systems. They are easily gamed, often inaccurate, and only reflect who you've played within a small
                circle.
              </p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 text-blue-600 dark:text-blue-400">•</div>
              <p className="ml-3 text-lg text-gray-600 dark:text-gray-300">
                <strong>Low Player Engagement:</strong> Without a true sense of progress or a clear "what's next," player motivation can fade.
              </p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 text-blue-600 dark:text-blue-400">•</div>
              <p className="ml-3 text-lg text-gray-600 dark:text-gray-300">
                <strong>Barriers to Competition:</strong> Tournaments are expensive, time-consuming, and can be intimidating for many players.
              </p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 text-blue-600 dark:text-blue-400">•</div>
              <p className="ml-3 text-lg text-gray-600 dark:text-gray-300">
                <strong>Multiple, Confusing Ratings:</strong> Players often juggle different ratings that don't communicate with each other.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">The Solution: The Tennis Connect Unified Rating (TCUR)</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">What is the TCUR?</h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              The TCUR is a universal rating on a simple <strong>1 to 100 scale</strong>. It represents every player's current skill level with decimal precision (e.g., 54.75).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-24">1-20:</span>
                  <span className="text-gray-600 dark:text-gray-300">Beginner / Just starting</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-24">21-40:</span>
                  <span className="text-gray-600 dark:text-gray-300">Recreational Player</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-24">41-60:</span>
                  <span className="text-gray-600 dark:text-gray-300">Solid Intermediate Club Player</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-24">61-80:</span>
                  <span className="text-gray-600 dark:text-gray-300">Advanced / Local Tournament Player</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-24">81-95:</span>
                  <span className="text-gray-600 dark:text-gray-300">Elite Amateur / College Player</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-24">96-100:</span>
                  <span className="text-gray-600 dark:text-gray-300">Professional Level</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rating Calculation Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">The Science Behind TCUR: Advanced Rating Mathematics</h2>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">The TCUR Formula</h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              The TCUR algorithm uses a sophisticated mathematical model that considers both the expected outcome and the actual performance. Here's how it works:
            </p>
            <div className="space-y-4 mb-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">1. Expected Performance Calculation</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4">For any match, we calculate the expected percentage of games each player should win based on their rating difference:</p>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg font-mono text-sm">Expected Win % = 1 / (1 + 10^((Opponent Rating - Player Rating) / 25))</div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">2. Rating Change Formula</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4">After the match, we calculate the rating change using this formula:</p>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg font-mono text-sm">Rating Change = K * (Actual Win % - Expected Win %)</div>
                <p className="text-gray-600 dark:text-gray-300 mt-4">Where K is a dynamic factor that adjusts based on:</p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mt-2">
                  <li>Number of matches played (higher for new players)</li>
                  <li>Rating difference between players</li>
                  <li>Match importance (tournament vs. friendly)</li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Real-World Examples</h3>

            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Example 1: The Upset Win</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Player A (Underdog)</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">Rating: 55.20</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Player B (Favorite)</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">Rating: 62.50</p>
                    </div>
                  </div>

                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-gray-600 dark:text-gray-300 mb-2">Match Result: 6-4, 7-6 (Player A wins)</p>
                    <p className="text-gray-600 dark:text-gray-300">Games Won: 13/23 (56.5%)</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>Expected Win % for Player A:</strong> 1 / (1 + 10^((62.50 - 55.20) / 25)) = 30.2%
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>Actual Win %:</strong> 56.5%
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>Rating Change:</strong> K * (56.5% - 30.2%) = +2.63
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>New Rating:</strong> 57.83
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Example 2: The "Good Loss"</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Player A</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">Rating: 55.20</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Player C</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">Rating: 70.00</p>
                    </div>
                  </div>

                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-gray-600 dark:text-gray-300 mb-2">Match Result: 4-6, 4-6 (Player A loses)</p>
                    <p className="text-gray-600 dark:text-gray-300">Games Won: 8/20 (40.0%)</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>Expected Win % for Player A:</strong> 1 / (1 + 10^((70.00 - 55.20) / 25)) = 15.8%
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>Actual Win %:</strong> 40.0%
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>Rating Change:</strong> K * (40.0% - 15.8%) = +1.21
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>New Rating:</strong> 56.41
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <p className="text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> The K-factor in these examples is simplified for demonstration. In practice, it's dynamically calculated based on player history and match context to ensure
                accurate rating adjustments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Differentiators Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Why TCUR is Different</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">TCUR's Unique Approach</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 text-blue-600 dark:text-blue-400">•</div>
                  <div className="ml-3">
                    <p className="text-gray-900 dark:text-white font-medium">Game-Based Analysis</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Unlike systems that only consider match outcomes, TCUR analyzes every game played, providing more granular and accurate ratings.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 text-blue-600 dark:text-blue-400">•</div>
                  <div className="ml-3">
                    <p className="text-gray-900 dark:text-white font-medium">Local-First Philosophy</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Built from the ground up for club players, with a focus on regular local play rather than tournament-centric ratings.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 text-blue-600 dark:text-blue-400">•</div>
                  <div className="ml-3">
                    <p className="text-gray-900 dark:text-white font-medium">Dynamic K-Factor</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Our adaptive rating adjustment system considers player history, match context, and rating differences for more accurate updates.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 text-blue-600 dark:text-blue-400">•</div>
                  <div className="ml-3">
                    <p className="text-gray-900 dark:text-white font-medium">Club Integration</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Seamless integration with club management systems, making it easy for clubs to adopt and maintain.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Key Differentiators</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Focus on Regular Play</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    While other systems prioritize tournament results, TCUR is designed to work with regular club play, making it more accessible and relevant for the majority of tennis players.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Transparent Algorithm</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Our rating calculation is open and understandable, with clear explanations of how ratings are adjusted after each match.</p>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Community Features</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Built-in social features like rivalry tracking, achievement badges, and local leaderboards to increase engagement and motivation.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Club-Centric Design</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Unlike systems designed primarily for tournament play, TCUR is built around the club experience, with features specifically for club management and member engagement.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-4">Our Commitment to Innovation</h3>
            <p className="text-blue-800 dark:text-blue-200">
              TCUR represents a new approach to tennis ratings, built specifically for the modern club player. While we respect and acknowledge the contributions of existing rating systems to the
              tennis community, we believe there's room for innovation in how we measure and track player development. Our system is designed to complement existing systems while offering unique
              features and benefits for club players and tennis facilities.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Benefits of the Tennis Connect Unified Rating</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">For Players</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                  <span className="text-gray-600 dark:text-gray-300">A Single, Meaningful Rating</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                  <span className="text-gray-600 dark:text-gray-300">Motivation to Play More</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                  <span className="text-gray-600 dark:text-gray-300">Discover New Opponents</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                  <span className="text-gray-600 dark:text-gray-300">No Extra Cost or Travel</span>
                </li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">For Clubs</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                  <span className="text-gray-600 dark:text-gray-300">Increased Member Engagement</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                  <span className="text-gray-600 dark:text-gray-300">A Powerful Recruitment Tool</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                  <span className="text-gray-600 dark:text-gray-300">Club Strength Rating (CSR)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                  <span className="text-gray-600 dark:text-gray-300">Simple Administration</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Join the Movement</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Tennis Connect is more than a ranking system; it's a mission to connect the global tennis community. We believe that by empowering players and clubs with a simple, accurate, and accessible
            platform, we can unleash the full potential of the sport we all love.
          </p>
          <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">Ready to see where you truly stand? Ask your club about joining the Tennis Connect network today.</p>
        </div>
      </section>
    </div>
  );
}
