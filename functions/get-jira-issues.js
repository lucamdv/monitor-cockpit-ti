// get-jira-issues.js
exports.handler = async function(event, context) {
  const { filterId } = event.queryStringParameters;

  if (!filterId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Filter ID is required' }),
    };
  }

  const JIRA_DOMAIN = process.env.VITE_JIRA_DOMAIN;
  const JIRA_USER_EMAIL = process.env.VITE_JIRA_USER_EMAIL;
  const JIRA_API_TOKEN = process.env.VITE_JIRA_API_TOKEN;

  // Novo endpoint correto
  const apiUrl = `https://${JIRA_DOMAIN}/rest/api/3/search/jql`;

  const encodedCredentials = Buffer.from(
    `${JIRA_USER_EMAIL}:${JIRA_API_TOKEN}`
  ).toString('base64');

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${encodedCredentials}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jql: `filter=${filterId}`,  // <-- Campo correto
        fields: [
          "summary",
          "status",
          "assignee",
          "priority",
          "issuetype"
        ],
        maxResults: 50
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return { statusCode: response.status, body: errorData };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
