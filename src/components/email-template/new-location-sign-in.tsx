import * as React from "react";

interface EmailTemplateProps {
  username: string;
  account: string;
  time: string;
  ip: string;
  city: string;
  country: string;
  os: string;
  browser: string;
}
const table_style = {
  display: "flex",
  justifyContent: "center",
  margin: "100px 0 50px 0",
};

const bold_style = {
  fontWeight: "bold",
  padding: "10px",
};
const td_style = {
  padding: "10px",
};

export const NewLocationTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  username,
  account,
  time,
  ip,
  city,
  country,
  os,
  browser,
}) => {
  /**
   * Template:
   * Dear RustDesk Info,
   *
   * Your account info@rustdesk.com was recently accessed from a new location. The Time, IP and location details of the activity are available below:
   *
   * TIME         Wed Nov 22 10:35:19 CET 2023
   * IP           10.48
   * LOCATION     Central, SG
   * DEVICE INFO  Mac, Laptop/PC, Chrome-119.0.0.0
   *
   * In case the above information appears appropriate, you can ignore this email.
   *
   * If you have not used your account or sent any email in the above time, we highly recommend you to change the password and enable TFA for the account to make it more secure in future.
   *
   *
   *
   * Feel free to write to support@zohomail.com, for further clarifications.
   *
   * Thanks!
   * Zoho Mail Admin Team
   */

  return (
    <div>
      <h1>Dear {username},</h1>
      <p>
        Your account <a href={`mailto:${account}`}>{account}</a> was recently
        accessed from a new location. The Time, IP and location details of the
        activity are available below:
      </p>
      <table style={table_style}>
        <tbody>
          <tr>
            <td style={bold_style}>TIME</td>
            <td style={td_style}>{time}</td>
          </tr>

          <tr>
            <td style={bold_style}>IP</td>
            <td style={td_style}>{ip}</td>
          </tr>
          <tr>
            <td style={bold_style}>LOCATION</td>
            <td style={td_style}>
              {city}, {country}
            </td>
          </tr>
          <tr>
            <td style={bold_style}>DEVICE INFO</td>
            <td style={td_style}>
              {os}, {browser}
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        In case the above information appears appropriate, you can ignore this
        email.
      </p>
      <p>
        If you have not used your account or sent any email in the above time,
        we highly recommend you to change the password and enable TFA for the
        account to make it more secure in future.
      </p>
      <p>
        Feel free to write to{" "}
        <a href="mailto:support@zohomail.com">support@zohomail.com</a>, for
        further clarifications.
      </p>
      <p>Thanks! Zoho Mail Admin Team</p>
    </div>
  );
};
