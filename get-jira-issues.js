exports.handler = async function (event, context) {
  const { filterId } = event.queryStringParameters;

  if (!filterId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Filter ID is required' }),
    };
  }

  const JIRA_DOMAIN = process.env.JIRA_DOMAIN;
  const JIRA_USER_EMAIL = process.env.JIRA_USER_EMAIL;
  const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

  const apiUrl = `https://${JIRA_DOMAIN}/rest/api/3/search/jql`;
  const encodedCredentials = Buffer.from(`${JIRA_USER_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${encodedCredentials}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jql: `filter=${filterId}`,
        fields: ['summary', 'status', 'assignee'],
        maxResults: 50,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Erro ao buscar issues:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro interno ao buscar issues do Jira' }),
    };
  }
};
