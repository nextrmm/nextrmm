import * as React from "react";

interface EmailTemplateProps {
  host: string;
  url: string;
  d: {
    "welcome-back": string;
    "sign-in": string;
  };
}

export const SignInTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  host,
  url,
  d,
}) => {
  return `
    <div>
      <h1>${d["welcome-back"]}</h1>
      <p>
        ${d["sign-in"]}${" "}
        <span>
          <a href=${url}>${host}</a>
        </span>
        </p>
    </div>
  `;
};
