// In-memory "dummy database" used when DEMO_MODE is enabled (see demoMode.ts).
// Mirrors the shape of the Supabase `teams` and `game_state` tables so the
// pages/api routes can swap data sources without changing their response shape.
// State lives only in this module's memory and resets on server restart.

interface DemoTeamRow {
  id: number;
  teamname: string;
  password: string;
  position: number;
  streak: number;
}

interface DemoGameState {
  id: number;
  timer: number;
  game_active: boolean;
  game_ended: boolean;
}

// Nicknames/references for Premier League clubs and World Cup nations,
// not the literal club/country names, kept under the app's 12-character limit.
const DEMO_TEAM_NAMES = [
  "Gunners", // Arsenal
  "Red Devils", // Manchester United
  "Citizens", // Manchester City
  "The Reds", // Liverpool
  "Blues", // Chelsea
  "Spurs", // Tottenham Hotspur
  "3 Lions", // England
  "Selecao", // Brazil
  "Albiceleste", // Argentina
  "Azzurri", // Italy
];

let nextId = 1;

function buildInitialTeams(): DemoTeamRow[] {
  nextId = 1;
  return DEMO_TEAM_NAMES.map((teamname, index) => ({
    id: nextId++,
    teamname,
    password: "0000",
    position: index + 1,
    streak: index === 0 ? 3 : 0,
  }));
}

function buildInitialGameState(): DemoGameState {
  return { id: 1, timer: 420, game_active: false, game_ended: false };
}

let teams: DemoTeamRow[] = buildInitialTeams();
let gameState: DemoGameState = buildInitialGameState();

export function demoResetToDefaults() {
  teams = buildInitialTeams();
  gameState = buildInitialGameState();
}

// --- Teams ---

export function demoGetTeams(): DemoTeamRow[] {
  return [...teams].sort((a, b) => a.position - b.position);
}

export function demoAddTeam(teamname: string, password: string) {
  const position = teams.length + 1;
  teams.push({ id: nextId++, teamname, password, position, streak: 0 });
}

export function demoFindTeamByName(teamname: string): DemoTeamRow | undefined {
  const target = teamname.toLowerCase();
  return teams.find((t) => t.teamname.toLowerCase() === target);
}

export function demoDeleteTeamById(id: number) {
  teams = teams.filter((t) => t.id !== id);
}

export function demoClearAllTeams() {
  teams = [];
}

export function demoUpdatePositions(
  orderedTeams: { id: number; position: number }[],
) {
  for (const { id, position } of orderedTeams) {
    const team = teams.find((t) => t.id === id);
    if (team) team.position = position;
  }
}

export function demoUpdateStreakByName(teamname: string, streak: number) {
  const target = teamname.toLowerCase();
  const team = teams.find((t) => t.teamname.toLowerCase() === target);
  if (team) team.streak = streak;
}

export function demoResetAllStreaks() {
  teams.forEach((t) => (t.streak = 0));
}

// --- Game state ---

export function demoGetGameState(): DemoGameState {
  return gameState;
}

export function demoUpdateGameState(partial: Partial<DemoGameState>) {
  gameState = { ...gameState, ...partial };
}
