import * as React from "react";

interface EmailTemplateProps {
  host: string;
  url: string;
  d: {
    "get-started": string;
    "sign-up": string;
  };
}

export const SignUpTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  host,
  url,
  d,
}) => {
  return `
    <div>
      <h1>${d["get-started"]}</h1>
      <p>
        ${d["sign-up"]}${" "}
        <span>
          <a href=${url}>${host}</a>
        </span>
        </p>
    </div>
  `;
};
