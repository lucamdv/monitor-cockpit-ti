export default async function handler(req, res) {
  const { filterId } = req.query;

  if (!filterId) {
    return res.status(400).json({ error: 'Filter ID is required' });
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
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Erro ao buscar issues:', error);
    return res.status(500).json({ error: 'Erro interno ao buscar issues do Jira' });
  }
}
