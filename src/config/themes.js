// Configuração de temas disponíveis
// Adicione novos temas aqui com nome e path do JSON
export const themes = [
  {
    id: 'numbers',
    name: 'Números',
    path: '/numbers-words.json',
  },
  {
    id: 'christmas',
    name: 'Natal',
    path: '/christmas-words.json',
  },
  {
    id: 'easter',
    name: 'Páscoa',
    path: '/easter-words.json',
  },
  {
    id: 'birthday',
    name: 'Aniversário',
    path: '/birthday-words.json',
  },
];

// Função auxiliar para buscar tema por ID
export function getThemeById(themeId) {
  return themes.find(t => t.id === themeId) || themes[0]; // Retorna o primeiro tema como padrão
}

// Função auxiliar para buscar path do tema
export function getThemePath(themeId) {
  const theme = getThemeById(themeId);
  return theme ? theme.path : themes[0].path;
}

