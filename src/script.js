document.addEventListener('DOMContentLoaded', () => {
    const employeeListContainer = document.getElementById('employeeList');
    const searchInput = document.getElementById('searchInput');
    const sortButton = document.getElementById('sortButton');

    let employees = [];
    let isAscending = true;

    // Função para mostrar os skeletons de carregamento
    const showSkeletons = () => {
        employeeListContainer.innerHTML = ''; // Limpa a área
        for (let i = 0; i < 9; i++) { // Cria 9 cards de skeleton
            const skeleton = document.createElement('div');
            skeleton.className = 'skeleton-card';
            skeleton.innerHTML = `
                <div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-subtext"></div>
                </div>
                <div class="skeleton skeleton-icon"></div>
            `;
            employeeListContainer.appendChild(skeleton);
        }
    };

    // Mostra os skeletons imediatamente ao carregar a página
    showSkeletons();

    // Buscar os dados dos funcionários do arquivo JSON
    fetch('funcionarios.json')
        .then(response => response.json())
        .then(data => {
            employees = data;
            // Um pequeno delay para o usuário perceber a animação de carregamento
            setTimeout(() => {
                renderEmployees(employees);
            }, 500);
        })
        .catch(error => {
            console.error('Erro ao carregar os dados dos funcionários:', error);
            employeeListContainer.innerHTML = '<p>Não foi possível carregar a lista de funcionários.</p>';
        });

    // Renderizar a lista de funcionários na tela
    const renderEmployees = (employeeArray) => {
        employeeListContainer.innerHTML = '';

        if (employeeArray.length === 0) {
            employeeListContainer.innerHTML = '<p>Nenhum funcionário encontrado.</p>';
            return;
        }

        employeeArray.forEach(employee => {
            const card = document.createElement('a');
            card.className = 'employee-card';
            card.href = `detalhes.html?id=${employee.id}`;

            card.innerHTML = `
                <div class="employee-info">
                    <h3>${employee.nome}</h3>
                    <p>Ver opções</p>
                </div>
                <div class="link-icon">
                    <i data-lucide="arrow-right-circle"></i>
                </div>
            `;
            employeeListContainer.appendChild(card);
        });
        
        // Ativa os ícones do Lucide após serem adicionados ao DOM
        lucide.createIcons();
    };

    // Adicionar funcionalidade à barra de pesquisa
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredEmployees = employees.filter(employee =>
            employee.nome.toLowerCase().includes(searchTerm)
        );
        renderEmployees(filteredEmployees);
    });

    // Adicionar funcionalidade ao botão de ordenar
    sortButton.addEventListener('click', () => {
        isAscending = !isAscending;
        
        employees.sort((a, b) => {
            if (isAscending) {
                return a.nome.localeCompare(b.nome);
            } else {
                return b.nome.localeCompare(a.nome);
            }
        });

        sortButton.textContent = isAscending ? 'Ordenar Z-A' : 'Ordenar A-Z';
        
        const currentSearchTerm = searchInput.value.toLowerCase();
        const currentlyFilteredEmployees = employees.filter(employee =>
            employee.nome.toLowerCase().includes(currentSearchTerm)
        );

        renderEmployees(currentlyFilteredEmployees);
    });
});