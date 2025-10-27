export const listItems = {
  style: {
    listStyleType: 'disc',
    paddingLeft: '20px',
    color: '#637381',
  },
  items: [
    {
      description:
        'The Request page allows users to track and manage incoming webhook events in real-time for efficient processing and troubleshooting.',
    },
    {
      description:
        'Each webhook request includes details like headers, payload, request method, query parameters, and response status, making debugging easier.',
    },
    {
      description:
        'Requests are categorized based on their status: Accepted (successful webhook calls) and Blocked (failed or filtered requests).',
    },
    {
      description:
        'View the HTTP method (GET, POST, PUT, etc.) used for each received webhook request. Indicates how data was sent to your webhook, helping track and troubleshoot incoming webhook requests.',
    },
    {
      description:
        'You can filter webhook requests based on date, folder, and request ID, enabling faster access to relevant logs.',
    },
    {
      description:
        'Each incoming webhook is assigned a unique Webhook Request ID to help track and reference specific events for troubleshooting.',
    },
    {
      description:
        'Webhooks can be used to integrate different services and automate workflows by forwarding requests to destination URLs.',
    },
    {
      description:
        'Ensures data integrity by maintaining structured JSON payloads, and offers debugging tools to validate webhook content effectively.',
    },
    {
      description:
        'Access all recorded webhook requests for up to the last 30 days.',
    },
  ],
};
