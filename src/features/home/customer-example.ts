/** Fictional, source-consistent customer used throughout the marketing examples. */
export const customerExample = {
  name: 'Alex Morgan',
  initials: 'AM',
  email: 'alex@example.com',
  product: 'Espresso machine',
  voice:
    'My espresso machine still leaks. I reseated the tank and restarted it. Please email me after 3pm.',
  chat: 'Any update on the leak? I called about this yesterday.',
  emailMessage:
    'Please keep the updates in this email thread. After 3pm is best for me.',
  brief:
    'Alex reports that the espresso machine still leaks after they reseated the tank and restarted it. They followed up about the same issue in chat and prefer email updates after 3pm.',
  memories: [
    {
      label: 'Already tried',
      value: 'Tank reseated; machine restarted',
      source: 'Earlier call',
    },
    {
      label: 'Open issue',
      value: 'Water leak still reported',
      source: 'Earlier call',
    },
    {
      label: 'Preference',
      value: 'Email updates after 3pm',
      source: 'Earlier call',
    },
  ],
} as const
