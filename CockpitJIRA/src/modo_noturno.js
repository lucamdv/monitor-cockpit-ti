function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    // Garante que os ícones (sol/lua) sejam atualizados corretamente
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Aplica o tema salvo assim que o script é carregado
const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);


// --- Parte 2: Lógica que só roda se o BOTÃO existir (o antigo theme-toggle.js) ---

const themeToggle = document.getElementById('theme-toggle');

// Uma verificação de segurança: só adiciona o listener se o botão for encontrado na página
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isDarkMode = document.body.classList.contains('dark-mode');
        const newTheme = isDarkMode ? 'light' : 'dark';
        
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });
}