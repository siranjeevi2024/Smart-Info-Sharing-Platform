const tempEmailDomains = [
  'tempmail.com', '10minutemail.com', 'guerrillamail.com', 'mailinator.com',
  'throwaway.email', 'temp-mail.org', 'getnada.com', 'maildrop.cc',
  'trashmail.com', 'yopmail.com', 'fakeinbox.com', 'sharklasers.com',
  'guerrillamail.info', 'grr.la', 'guerrillamail.biz', 'guerrillamail.de',
  'spam4.me', 'tempmail.net', 'dispostable.com', 'throwawaymail.com',
  'mohmal.com', 'emailondeck.com', 'mintemail.com', 'mytemp.email'
];

const isTemporaryEmail = (email) => {
  const domain = email.split('@')[1]?.toLowerCase();
  return tempEmailDomains.includes(domain);
};

module.exports = { isTemporaryEmail };
