document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const hamburgerButton = document.getElementById('hamburger-button');
    const overlay = document.getElementById('overlay');

    // Função para abrir a sidebar
    const openSidebar = () => {
        if (sidebar && overlay) {
            sidebar.classList.add('open');
            overlay.classList.add('show');
        }
    };

    // Função para fechar a sidebar
    const closeSidebar = () => {
        if (sidebar && overlay) {
            sidebar.classList.remove('open');
            overlay.classList.remove('show');
        }
    };

    // Abre a sidebar ao clicar no botão hambúrguer
    if (hamburgerButton) {
        hamburgerButton.addEventListener('click', openSidebar);
    }

    // Fecha a sidebar ao clicar no overlay
    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }

    // Mapeia as páginas filhas para suas páginas "mãe" na sidebar
    const pageHierarchy = {
        'detalhes.html': 'jira-boards.html' // Se a página for 'detalhes.html', o link a ser ativado é o de 'jira-boards.html'
    };

    // Pega o nome do arquivo da URL atual
    const currentPage = window.location.pathname.split('/').pop();

    // Determina qual link DEVE estar ativo
    // Por padrão, é a própria página. Mas se estiver na hierarquia, usa o "pai".
    let activeTargetPage = pageHierarchy[currentPage] || currentPage;

    // Encontra todos os links e aplica a classe 'active' apenas no correto
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');

    sidebarLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();

        // Limpa a classe de todos os links para evitar duplicidade
        link.classList.remove('active');

        // Adiciona a classe APENAS se o link corresponder ao alvo
        if (linkPage === activeTargetPage) {
            link.classList.add('active');
        }
    });
});