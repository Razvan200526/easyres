export const SignupEmailCheckTemplate = ({ otp }: { otp: string }) => {
  return (
    <html
      lang="en"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
      </head>
      <body
        style={{
          backgroundColor: '#fafafa',
          margin: 0,
          padding: '60px 20px',
          lineHeight: '1.6',
        }}
      >
        <table
          width="100%"
          role="presentation"
          cellPadding={0}
          cellSpacing={0}
          style={{
            maxWidth: '480px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          }}
        >
          <tbody>
            {/* Clean header */}
            <tr>
              <td
                style={{
                  padding: '48px 40px 32px 40px',
                  textAlign: 'center',
                  borderBottom: '1px solid #f0f0f0',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#6366f1',
                    borderRadius: '50%',
                    margin: '0 auto 24px auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <polyline
                      points="22,6 12,13 2,6"
                      stroke="white"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <h1
                  style={{
                    color: '#1f2937',
                    margin: 0,
                    fontSize: '24px',
                    fontWeight: '600',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Verify your email
                </h1>
              </td>
            </tr>

            {/* Main content */}
            <tr>
              <td style={{ padding: '40px' }}>
                <p
                  style={{
                    margin: '0 0 32px 0',
                    fontSize: '16px',
                    color: '#6b7280',
                    textAlign: 'center',
                  }}
                >
                  Enter this code to complete your signup
                </p>

                {/* OTP Code - clean and minimal */}
                <div
                  style={{
                    textAlign: 'center',
                    margin: '32px 0',
                  }}
                >
                  <div
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#f8fafc',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '24px 32px',
                    }}
                  >
                    <div
                      style={{
                        color: '#1f2937',
                        fontSize: '36px',
                        fontWeight: '700',
                        letterSpacing: '8px',
                        fontFamily: 'Monaco, "Courier New", monospace',
                      }}
                    >
                      {otp}
                    </div>
                  </div>
                </div>

                {/* Simple info text */}
                <p
                  style={{
                    margin: '32px 0 0 0',
                    fontSize: '14px',
                    color: '#9ca3af',
                    textAlign: 'center',
                  }}
                >
                  Code expires in 60 minutes
                </p>
              </td>
            </tr>

            {/* Minimal footer */}
            <tr>
              <td
                style={{
                  padding: '32px 40px',
                  textAlign: 'center',
                  borderTop: '1px solid #f0f0f0',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: '14px',
                    color: '#6b7280',
                  }}
                >
                  Resume Tracker
                </p>
                <p
                  style={{
                    margin: '4px 0 0 0',
                    fontSize: '12px',
                    color: '#9ca3af',
                  }}
                >
                  &copy; {new Date().getFullYear()} All rights reserved
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
};
