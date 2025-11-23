interface EmailProps {
  subject: string;
  body: string;
  from?: string;
  to?: string;
}

export const sendEmail = async ({ subject, body, from, to }: EmailProps) => {
  console.log({
    subject,
    body,
    from,
    to,
  });
};
