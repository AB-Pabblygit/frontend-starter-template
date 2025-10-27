export const listItems = {
  style: {
    listStyleType: 'disc',
    paddingLeft: '20px',
    color: '#637381',
    lineHeight: '2',
  },
  items: [
    {description:'No matter how skilled you might be, sometimes we all need a little support.'},
    {description:'We are here to help you succeed with building your Connection.'},
    // {description:'Get assistance on troubleshooting errors, and can even get to know about building new automation as well.'},
    {description:'We will try our best to help you out for every issues.'},
    {
      description: 'In case you wish to manage or cancel the subscription, you can do that from the "',
      link: {
        text: 'My Subscriptions',
        url: 'https://payments.pabbly.com/portal/signin/affiliateportal', // My subscription page URL
      },
      suffix: '" section.'
    },

  ],
};