document.addEventListener('DOMContentLoaded', () => {
    const employeeNameTitle = document.getElementById('employeeNameTitle');
    const tabsContainer = document.getElementById('filter-tabs-container');
    const issuesContainer = document.getElementById('issues-container');

    const params = new URLSearchParams(window.location.search);
    const employeeId = params.get('id');
    let JIRA_DOMAIN = ''; // Será preenchido depois

    if (!employeeId) {
        employeeNameTitle.textContent = 'Funcionário não encontrado!';
        return;
    }

    // Função para renderizar o spinner de carregamento
    const showLoading = () => {
        issuesContainer.innerHTML = '<div class="loading-spinner"></div>';
    };
    
    // Função para mostrar mensagens de erro
    const showError = (message) => {
        issuesContainer.innerHTML = `<div class="error-message">${message}</div>`;
    };

    // Função para buscar e renderizar as issues de um filtro
    const fetchAndRenderIssues = async (filterId) => {
        showLoading();
        try {
            // 🔁 Alteração principal: endpoint da Vercel
            const response = await fetch(`/api/get-jira-issues?filterId=${filterId}`);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro na API do Jira: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            JIRA_DOMAIN = data.issues[0]?.self.split('/rest/')[0].replace('https://', '') || JIRA_DOMAIN;

            renderIssues(data.issues);
        } catch (error) {
            console.error('Erro ao buscar issues:', error);
            showError('Não foi possível carregar os chamados. Verifique o console para mais detalhes.');
        }
    };
    
    // Função para renderizar a lista de issues no container
    const renderIssues = (issues) => {
        issuesContainer.innerHTML = ''; // Limpa o container
        if (!issues || issues.length === 0) {
            issuesContainer.innerHTML = '<p>Nenhum chamado encontrado para este filtro.</p>';
            return;
        }

        issues.forEach(issue => {
            const card = document.createElement('a');
            card.className = 'issue-card';
            card.href = `https://${JIRA_DOMAIN}/browse/${issue.key}`;
            card.target = '_blank';
            card.rel = 'noopener noreferrer';

            const status = issue.fields.status;
            const statusCategoryClass = `status-${status.statusCategory.key}`;

            card.innerHTML = `
                <div class="issue-icon">
                    <img src="${issue.fields.issuetype.iconUrl}" alt="${issue.fields.issuetype.name}" title="${issue.fields.issuetype.name}">
                </div>
                <div class="issue-details">
                    <div class="summary">${issue.fields.summary}</div>
                    <div class="key">${issue.key}</div>
                </div>
                <div class="issue-status ${statusCategoryClass}">
                    ${status.name}
                </div>
            `;
            issuesContainer.appendChild(card);
        });
    };

    // Função principal que inicia o processo
    const initializePage = async () => {
        try {
            const response = await fetch('funcionarios.json');
            const employees = await response.json();
            const employee = employees.find(emp => emp.id === employeeId);

            if (employee) {
                employeeNameTitle.textContent = `Chamados de ${employee.nome}`;
                
                // Cria as abas (tabs) para cada filtro
                tabsContainer.innerHTML = '';
                const filterTypes = Object.keys(employee.filters);

                filterTypes.forEach((type, index) => {
                    const button = document.createElement('button');
                    button.className = 'tab-button';
                    button.textContent = type.replace('_', ' ').replace(/^\w/, c => c.toUpperCase());
                    button.dataset.filterId = employee.filters[type];

                    button.addEventListener('click', (e) => {
                        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
                        e.currentTarget.classList.add('active');
                        fetchAndRenderIssues(e.currentTarget.dataset.filterId);
                    });
                    
                    if (index === 0) {
                        button.classList.add('active');
                        fetchAndRenderIssues(employee.filters[type]);
                    }

                    tabsContainer.appendChild(button);
                });

            } else {
                employeeNameTitle.textContent = 'Funcionário não encontrado!';
            }
        } catch (error) {
            console.error('Erro ao carregar dados do funcionário:', error);
            showError('Não foi possível carregar os dados do funcionário.');
        }
    };

    initializePage();
});
