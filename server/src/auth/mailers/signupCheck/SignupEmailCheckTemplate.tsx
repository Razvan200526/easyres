import { Logo } from './Logo';

export const SignupEmailCheckTemplate = ({ otp }: { otp: string }) => {
  return (
    <html
      lang="en"
      style={{
        fontFamily:
          'Montserrat, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Verify your email</title>
      </head>
      <body
        style={{
          backgroundColor: '#f3f4f6', 
          margin: 0,
          padding: '40px 20px',
          lineHeight: '1.6',
          color: '#374151', 
        }}
      >
        <table
          width="100%"
          role="presentation"
          cellPadding={0}
          cellSpacing={0}
          style={{
            maxWidth: '560px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb',
          }}
        >
          <tbody>
            {/* Header with Logo */}
            <tr>
              <td
                style={{
                  padding: '40px 40px 32px 40px',
                  textAlign: 'center',
                  background: 'linear-gradient(to bottom, #ffffff, #fafafa)',
                }}
              >
                <div style={{ marginBottom: '24px' }}>
                  <Logo width={80} height={80} style={{ margin: '0 auto' }} />
                </div>
                <h1
                  style={{
                    color: '#3E1E60', // Primary Brand Color
                    margin: 0,
                    fontSize: '28px',
                    fontWeight: '700',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Verify Your Identity
                </h1>
                <p
                  style={{
                    margin: '12px 0 0 0',
                    fontSize: '16px',
                    color: '#6b7280', // gray-500
                  }}
                >
                  Thank you for signing up with Resume Tracker.
                </p>
              </td>
            </tr>

            {/* Main Content */}
            <tr>
              <td style={{ padding: '0 40px 40px 40px' }}>
                <p
                  style={{
                    margin: '0 0 24px 0',
                    fontSize: '16px',
                    color: '#374151',
                    textAlign: 'center',
                    lineHeight: '24px',
                  }}
                >
                  Please use the following One-Time Password (OTP) to complete your
                  registration. This code is valid for 60 minutes.
                </p>

                {/* OTP Box */}
                <div
                  style={{
                    margin: '32px 0',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      display: 'inline-block',
                      background: 'rgba(62, 30, 96, 0.05)', 
                      border: '2px dashed #3E1E60', 
                      borderRadius: '12px',
                      padding: '20px 40px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'Monaco, "Courier New", monospace',
                        fontSize: '32px',
                        fontWeight: '700',
                        letterSpacing: '8px',
                        color: '#E97950', 
                      }}
                    >
                      {otp}
                    </span>
                  </div>
                </div>

                <p
                  style={{
                    fontSize: '14px',
                    color: '#9ca3af',
                    textAlign: 'center',
                    margin: '0',
                  }}
                >
                  If you didn't request this email, you can safely ignore it.
                </p>
              </td>
            </tr>

            {/* Footer */}
            <tr>
              <td
                style={{
                  backgroundColor: '#f9fafb',
                  padding: '24px 40px',
                  textAlign: 'center',
                  borderTop: '1px solid #f3f4f6',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: '12px',
                    color: '#9ca3af',
                    fontWeight: '500',
                    marginBottom: '8px',
                  }}
                >
                  SECURE &middot; PRIVATE &middot; RELIABLE
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: '12px',
                    color: '#d1d5db',
                  }}
                >
                  &copy; {new Date().getFullYear()} Resume Tracker. All rights reserved.
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
};
