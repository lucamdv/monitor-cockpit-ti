document.addEventListener('DOMContentLoaded', () => {
    const employeeNameTitle = document.getElementById('employeeNameTitle');
    const linkOptionsContainer = document.getElementById('linkOptionsContainer');

    const params = new URLSearchParams(window.location.search);
    const employeeId = params.get('id');

    if (!employeeId) {
        employeeNameTitle.textContent = 'Funcionário não encontrado!';
        return;
    }

    fetch('funcionarios.json')
        .then(response => response.json())
        .then(employees => {
            const employee = employees.find(emp => emp.id === employeeId);

            if (employee) {
                employeeNameTitle.textContent = `Opções para ${employee.nome}`;

                const options = [
                    { name: 'Ativos', link: employee.links.ativos, description: 'Acessar atividades ativas' },
                    { name: 'Impedidos', link: employee.links.impedidos, description: 'Ver os impedimentos' },
                    { name: 'Para Iniciar', link: employee.links.para_iniciar, description: 'Consultar o que pode ser iniciado' },
                    { name: 'Concluídos', link: employee.links.concluidos, description: 'Atividades concluídas nos últimos 7 dias' }
                ];

                options.forEach(option => {
                    const card = document.createElement('a');
                    card.className = 'option-card';
                    card.href = option.link;
                    card.target = '_blank';
                    card.rel = 'noopener noreferrer';

                    card.innerHTML = `
                        <i data-lucide="link" class="option-icon"></i>
                        <h2>${option.name}</h2>
                        <p>${option.description}</p>
                    `;
                    linkOptionsContainer.appendChild(card);
                });

                // Ativa os ícones do Lucide após serem adicionados ao DOM
                lucide.createIcons();

            } else {
                employeeNameTitle.textContent = 'Funcionário não encontrado!';
            }
        })
        .catch(error => {
            console.error('Erro ao carregar dados:', error);
            employeeNameTitle.textContent = 'Erro ao carregar informações.';
        });
});