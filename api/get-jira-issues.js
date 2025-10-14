// api/get-jira-issues.js

export default async function handler(req, res) {
  const { filterId } = req.query;

  if (!filterId) {
    return res.status(400).json({ error: 'Filter ID is required' });
  }

  const JIRA_DOMAIN = process.env.JIRA_DOMAIN;
  const JIRA_USER_EMAIL = process.env.JIRA_USER_EMAIL;
  const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

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
        jql: `filter=${filterId}`,
        fields: ["summary", "status", "assignee", "priority", "issuetype"],
        maxResults: 50
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).send(errorText);
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
