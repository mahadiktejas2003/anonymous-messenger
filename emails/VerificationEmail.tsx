import { Text, Button, Heading } from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <table
      align="center"
      border={0}
      cellPadding="0"
      cellSpacing="0"
      style={{
        width: "100%",
        backgroundColor: "#f4f4f4",
        padding: "40px 0",
        margin: "0",
      }}
    >
      <tbody>
        <tr>
          <td>
            <table
              align="center"
              border={0}
              cellPadding="0"
              cellSpacing="0"
              style={{
                backgroundColor: "#0070f3",
                borderRadius: "12px",
                textAlign: "center",
                maxWidth: "600px",
                margin: "0 auto",
                padding: "24px", 
                tableLayout: "fixed", // Ensures no collapsible sections
              }}
            >
              <tbody>
                <tr>
                  <td>
                    <Text
                      style={{
                        color: "#d1e3fc",
                        fontSize: "16px",
                        fontWeight: 600,
                        margin: "0 0 12px 0", 
                        whiteSpace: "nowrap", 
                      }}
                    >
                      Hello {username},
                    </Text>
                    <Heading
                      as="h1"
                      style={{
                        fontSize: "28px",
                        fontWeight: "bold",
                        color: "#fff",
                        margin: "0",
                      }}
                    >
                      {otp}
                    </Heading>
                    <Text
                      style={{
                        color: "#d1e3fc",
                        fontSize: "16px",
                        lineHeight: "1.5",
                        margin: "12px 0",
                      }}
                    >
                      Thank you for registering. Please use the code above to complete
                      your registration process.
                    </Text>
                    <Button
                      style={{
                        display: "inline-block",
                        backgroundColor: "#fff",
                        color: "#0070f3",
                        fontWeight: 600,
                        textDecoration: "none",
                        padding: "12px 32px",
                        borderRadius: "8px",
                        border: "1px solid #fff",
                        marginTop: "16px",
                      }}
                      href={`http://localhost:3000/verify/${username}`}
                    >
                      Verify Now
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
