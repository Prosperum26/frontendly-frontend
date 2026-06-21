import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Code2, Trophy, Users } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ROUTES, workspacePath } from '../constants/routes';

const standings = [
  { name: 'You', score: 80, status: 'Ready' },
  { name: 'Demo Rival', score: 65, status: 'Coding' },
];

export const ChallengeBattlePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-950">Challenge Battle</h1>
            <p className="mt-1 text-slate-600">
              Practice in a timed head-to-head workspace. Live sync can plug into this screen when
              rooms are enabled.
            </p>
          </div>
          <div className="flex gap-3">
            <Link to={ROUTES.CHALLENGE_LOBBY}>
              <Button variant="secondary">Lobby</Button>
            </Link>
            <Link to={workspacePath('exercise_s7')}>
              <Button>Open Workspace</Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <Card className="p-6">
            <div className="mb-5 flex items-center gap-3">
              <Code2 className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-slate-900">Current Challenge</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <Clock className="mb-3 h-5 w-5 text-slate-500" />
                <div className="text-sm text-slate-500">Time limit</div>
                <div className="mt-1 text-lg font-semibold text-slate-900">20 min</div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <Trophy className="mb-3 h-5 w-5 text-amber-500" />
                <div className="text-sm text-slate-500">Reward</div>
                <div className="mt-1 text-lg font-semibold text-slate-900">150 XP</div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <Users className="mb-3 h-5 w-5 text-emerald-600" />
                <div className="text-sm text-slate-500">Players</div>
                <div className="mt-1 text-lg font-semibold text-slate-900">2/2</div>
              </div>
            </div>
            <div className="mt-6 rounded-lg bg-slate-100 p-5">
              <h3 className="font-semibold text-slate-900">Task</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Build an interactive React component that uses props and state cleanly, then submit
                it through the workspace evaluator.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">Live Standings</h2>
            <div className="space-y-3">
              {standings.map((player, index) => (
                <div
                  key={player.name}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4"
                >
                  <div>
                    <div className="font-semibold text-slate-900">
                      #{index + 1} {player.name}
                    </div>
                    <div className="text-sm text-slate-500">{player.status}</div>
                  </div>
                  <div className="text-lg font-bold text-blue-600">{player.score}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChallengeBattlePage;
