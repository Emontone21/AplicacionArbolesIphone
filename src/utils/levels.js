export const LEVELS = [
  {
    id: 0,
    key: 'semilla',
    label: 'semilla',
    treesRequired: 0,
    description: 'El punto de partida. Tu árbol aún no tiene historia.',
    unlockedFeature: 'árbol principal',
  },
  {
    id: 1,
    key: 'brote',
    label: 'brote',
    treesRequired: 1,
    description: 'Tu primera racha. El árbol empieza a cobrar vida.',
    unlockedFeature: 'estadísticas semanales',
  },
  {
    id: 2,
    key: 'arbolito',
    label: 'arbolito',
    treesRequired: 4,
    description: 'Constancia que se nota. Tronco firme, follaje real.',
    unlockedFeature: 'vista de bosque semanal + visitantes',
  },
  {
    id: 3,
    key: 'roble',
    label: 'roble joven',
    treesRequired: 10,
    description: 'Un árbol imponente. Tu productividad es constante y visible.',
    unlockedFeature: 'modo clima + historial de logros',
  },
  {
    id: 4,
    key: 'centenario',
    label: 'árbol centenario',
    treesRequired: 20,
    description: 'Tu árbol tiene historia. Las raíces asoman del suelo.',
    unlockedFeature: 'bosque personal + racha mensual',
  },
  {
    id: 5,
    key: 'bonsai',
    label: 'bonsái',
    treesRequired: 35,
    description: 'El nivel máximo. No el más grande — el más cuidado.',
    unlockedFeature: 'perfil maestro + árbol dorado',
  },
];

export function getCurrentLevel(treesCompleted) {
  return (
    [...LEVELS].reverse().find((l) => treesCompleted >= l.treesRequired) ?? LEVELS[0]
  );
}

export function getNextLevel(treesCompleted) {
  const current = getCurrentLevel(treesCompleted);
  return LEVELS.find((l) => l.treesRequired > current.treesRequired) ?? null;
}

/** Returns the new level if a level-up occurred, otherwise null. */
export function checkLevelUp(prevCompleted, newCompleted) {
  const prev = getCurrentLevel(prevCompleted);
  const next = getCurrentLevel(newCompleted);
  return next.id > prev.id ? next : null;
}
