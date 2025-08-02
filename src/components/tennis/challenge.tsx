import { Trophy, Users, TrendingUp, Calendar, AlertTriangle, Target, Award, Clock } from "lucide-react";

export default function TennisChallenge() {
	return (
		<div className="min-h-screen">
			{/* Header */}
			<header className="text-green-600">
				<div className="max-w-4xl mx-auto px-6 py-8">
					<div className="flex items-center space-x-3">
						<div>
							<Trophy className="h-10 w-10" />
							<h1 className="text-3xl  font-bold">Challenge Points System</h1>
							<p className="text-green-600 mt-1">Club Tennis Ladder Competition Rules</p>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-4xl mx-auto px-6 py-8">
				{/* Starting Points */}
				<section className="bg-white rounded-lg shadow-md p-6 mb-8">
					<div className="flex items-center space-x-3 mb-4">
						<Target className="h-6 w-6 text-blue-600" />
						<h2 className="text-2xl font-semibold text-gray-900">Starting Your Journey</h2>
					</div>

					<div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
						<div className="flex items-start">
							<div className="flex-shrink-0">
								<Users className="h-5 w-5 text-blue-400 mt-0.5" />
							</div>
							<div className="ml-3">
								<h3 className="text-lg font-medium text-blue-900">New Player Starting Points</h3>
								<p className="text-blue-700 mt-1">
									All new players begin with <span className="font-bold">1,000 Challenge Points</span>
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Points for Wins and Losses */}
				<section className="bg-white rounded-lg shadow-md p-6 mb-8">
					<div className="flex items-center space-x-3 mb-6">
						<Award className="h-6 w-6 text-green-600" />
						<h2 className="text-2xl font-semibold text-gray-900">Points System</h2>
					</div>

					<div className="grid md:grid-cols-2 gap-6">
						{/* Wins */}
						<div className="bg-green-50 border border-green-200 rounded-lg p-5">
							<h3 className="text-xl font-semibold text-green-800 mb-3 flex items-center">
								<TrendingUp className="h-5 w-5 mr-2" />
								Match Victories
							</h3>

							<div className="space-y-3 p-3">
								<div className="flex justify-between items-center">
									<span className="text-green-700">Base points for any win:</span>
									<span className="font-bold text-green-800 text-lg">+100 CP</span>
								</div>

								<div className="border-t border-green-200 pt-3">
									<h4 className="font-medium text-green-800 mb-2">Ranking Bonus (per position above opponent):</h4>
									<div className="space-y-1 text-sm">
										<div className="flex justify-between">
											<span className="text-green-600">Beat player 1 rank above:</span>
											<span className="font-semibold">+20 CP (120 total)</span>
										</div>
										<div className="flex justify-between">
											<span className="text-green-600">Beat player 3 ranks above:</span>
											<span className="font-semibold">+60 CP (160 total)</span>
										</div>
										<div className="flex justify-between">
											<span className="text-green-600">Beat player 5 ranks above:</span>
											<span className="font-semibold">+100 CP (200 total)</span>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Losses */}
						<div className="bg-orange-50 border border-orange-200 rounded-lg p-5">
							<h3 className="text-xl font-semibold text-orange-800 mb-3 flex items-center">
								<Target className="h-5 w-5 mr-2" />
								Match Defeats
							</h3>

							<div className="space-y-3 p-3">
								<div className="flex justify-between items-center">
									<span className="text-orange-700">Regular loss:</span>
									<span className="font-bold text-orange-800 text-lg">0 CP</span>
								</div>

								<div className="border-t border-orange-200 pt-3">
									<h4 className="font-medium text-orange-800 mb-2">"Close Match" Bonus:</h4>
									<div className="bg-orange-100 p-3 rounded">
										<p className="text-orange-700 text-sm mb-2">
											You earn <span className="font-bold">+15 CP</span> even in defeat if you lose:
										</p>
										<ul className="text-orange-600 text-sm space-y-1">
											<li>• 7-5 in any set</li>
											<li>• 7-6 (tiebreak) in any set</li>
											<li>• Any 3-set match</li>
										</ul>
										<p className="text-orange-700 text-xs mt-2 italic">Rewards competitive effort and close battles!</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Challenge Rules */}
				<section className="bg-white rounded-lg shadow-md p-6 mb-8">
					<div className="flex items-center space-x-3 mb-6">
						<Users className="h-6 w-6 text-purple-600" />
						<h2 className="text-2xl font-semibold text-gray-900">Challenge Rules</h2>
					</div>

					<div className="grid md:grid-cols-2 gap-6">
						<div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
							<h3 className="font-semibold text-purple-800 mb-2">Who Can You Challenge?</h3>
							<p className="text-purple-700 text-sm">
								Players ranked up to <span className="font-bold">5 positions above</span> your current club ranking
							</p>
						</div>

						<div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
							<h3 className="font-semibold text-purple-800 mb-2">Response Time</h3>
							<p className="text-purple-700 text-sm">
								Challenged players must schedule match within <span className="font-bold">2 weeks</span>
							</p>
						</div>
					</div>
				</section>

				{/* Activity Requirements */}
				<section className="bg-white rounded-lg shadow-md p-6 mb-8">
					<div className="flex items-center space-x-3 mb-6">
						<Calendar className="h-6 w-6 text-indigo-600" />
						<h2 className="text-2xl font-semibold text-gray-900">Activity Requirements</h2>
					</div>

					<div className="bg-indigo-50 border-l-4 border-indigo-400 p-6 rounded-r-lg">
						<div className="grid md:grid-cols-2 gap-6">
							<div>
								<h3 className="text-lg font-semibold text-indigo-900 mb-3 flex items-center">
									<Clock className="h-5 w-5 mr-2" />
									Minimum Activity
								</h3>
								<p className="text-indigo-800 mb-2">To maintain your Challenge Points:</p>
								<div className="bg-white rounded p-3 border border-indigo-200">
									<p className="font-bold text-indigo-900">Play at least 1 match per month</p>
									<p className="text-indigo-700 text-sm mt-1">Matches can be challenges you issue or accept</p>
								</div>
							</div>

							<div>
								<h3 className="text-lg font-semibold text-red-900 mb-3 flex items-center">
									<AlertTriangle className="h-5 w-5 mr-2" />
									Inactivity Penalty
								</h3>
								<p className="text-red-800 mb-2">After 30 days without a match:</p>
								<div className="bg-red-100 rounded p-3 border border-red-200">
									<p className="font-bold text-red-900">Lose 50 CP per month</p>
									<p className="text-red-700 text-sm mt-1">Until you play again or reach minimum 500 CP</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Examples */}
				<section className="bg-white rounded-lg shadow-md p-6 mb-8">
					<h2 className="text-2xl font-semibold text-gray-900 mb-6">Real Examples</h2>

					<div className="grid md:grid-cols-2 gap-6">
						<div className="bg-gray-50 rounded-lg p-5">
							<h3 className="font-semibold text-gray-900 mb-3">Example 1: Climbing Up</h3>
							<div className="text-sm space-y-2">
								<p>
									<span className="font-medium">You:</span> Rank #10 (1,200 CP)
								</p>
								<p>
									<span className="font-medium">Challenge:</span> Rank #7 (1,450 CP)
								</p>
								<p>
									<span className="font-medium">Result:</span> You win 6-4, 7-5
								</p>
								<div className="bg-green-100 p-3 rounded mt-3">
									<p className="font-bold text-green-800">You earn: 100 + 60 = 160 CP</p>
									<p className="text-green-700">New total: 1,360 CP</p>
									<p className="text-green-600 text-xs">Likely moves you up several rankings!</p>
								</div>
							</div>
						</div>

						<div className="bg-gray-50 rounded-lg p-5">
							<h3 className="font-semibold text-gray-900 mb-3">Example 2: Close Loss</h3>
							<div className="text-sm space-y-2">
								<p>
									<span className="font-medium">You:</span> Rank #8 (1,300 CP)
								</p>
								<p>
									<span className="font-medium">Challenge:</span> Rank #5 (1,520 CP)
								</p>
								<p>
									<span className="font-medium">Result:</span> You lose 6-7, 4-6
								</p>
								<div className="bg-orange-100 p-3 rounded mt-3">
									<p className="font-bold text-orange-800">You earn: 15 CP (close match bonus)</p>
									<p className="text-orange-700">New total: 1,315 CP</p>
									<p className="text-orange-600 text-xs">Great effort in a tough match!</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Game Format */}
				<section className="bg-white rounded-lg shadow-md p-6 mb-8">
					<div className="flex items-center space-x-3 mb-6">
						<Target className="h-6 w-6 text-blue-600" />
						<h2 className="text-2xl font-semibold text-gray-900">Recommended Game Format</h2>
					</div>

					<div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
						<div className="space-y-4">
							<div>
								<h3 className="text-lg font-semibold text-blue-900 mb-2">Sets 1 & 2</h3>
								<p className="text-blue-800">Regular 6-game sets with tiebreaks at 6-6</p>
							</div>

							<div>
								<h3 className="text-lg font-semibold text-blue-900 mb-2">No-Ad Scoring</h3>
								<p className="text-blue-800">Deuce point is sudden death (receiver chooses side)</p>
							</div>

							<div>
								<h3 className="text-lg font-semibold text-blue-900 mb-2">Set 3</h3>
								<p className="text-blue-800">10-point match tiebreaker instead of a full third set</p>
							</div>
						</div>
					</div>
				</section>

				{/* Quick Reference */}
				<section className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg shadow-md p-6">
					<h2 className="text-2xl font-semibold mb-6 text-center">Quick Reference</h2>

					<div className="grid md:grid-cols-4 gap-4 text-center">
						<div className="bg-white bg-opacity-20 rounded-lg p-4">
							<div className="text-2xl font-bold">1,000</div>
							<div className="text-sm">Starting CP</div>
						</div>

						<div className="bg-white bg-opacity-20 rounded-lg p-4">
							<div className="text-2xl font-bold">100+</div>
							<div className="text-sm">CP per Win</div>
						</div>

						<div className="bg-white bg-opacity-20 rounded-lg p-4">
							<div className="text-2xl font-bold">1</div>
							<div className="text-sm">Match/Month</div>
						</div>

						<div className="bg-white bg-opacity-20 rounded-lg p-4">
							<div className="text-2xl font-bold">5</div>
							<div className="text-sm">Max Challenge Range</div>
						</div>
					</div>
				</section>
			</main>

			{/* Footer */}
			<footer className="py-8 mt-12">
				<div className="max-w-4xl mx-auto px-6 text-center">
					<p className="text-sm">Challenge Points System - Making club tennis competitive, fair, and fun for everyone</p>
				</div>
			</footer>
		</div>
	);
}
