// Deno imports for HTTP server
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    // Accept filterId from either query params or body
    const url = new URL(req.url);
    let filterId = url.searchParams.get("filterId");

    if (!filterId && req.method === "POST") {
      const body = await req.json();
      filterId = body.filterId;
    }

    if (!filterId) {
      return new Response(JSON.stringify({ error: "Filter ID is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const JIRA_DOMAIN = Deno.env.get("JIRA_DOMAIN");
    const JIRA_USER_EMAIL = Deno.env.get("JIRA_USER_EMAIL");
    const JIRA_API_TOKEN = Deno.env.get("JIRA_API_TOKEN");

    if (!JIRA_DOMAIN || !JIRA_USER_EMAIL || !JIRA_API_TOKEN) {
      console.error("Missing JIRA credentials");
      return new Response(
        JSON.stringify({ error: "JIRA credentials not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const apiUrl = `https://${JIRA_DOMAIN}/rest/api/3/search/jql`;

    const credentials = btoa(`${JIRA_USER_EMAIL}:${JIRA_API_TOKEN}`);

    console.log(`Fetching issues for filter: ${filterId}`);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jql: `filter=${filterId}`,
        fields: ["summary", "status", "assignee", "priority", "issuetype"],
        maxResults: 50,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("JIRA API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: `JIRA API error: ${response.status}` }),
        {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    console.log(`Successfully fetched ${data.issues?.length || 0} issues`);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in get-jira-issues function:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
