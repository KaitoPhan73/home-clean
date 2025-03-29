export async function POST(request: Request) {
  const body = await request.json();
  const accessToken = body.accessToken as string;
  const user = JSON.stringify(body) as string;
 console.log(body);
  if (!accessToken) {
    return new Response(
      JSON.stringify({ message: "Không nhận được session token" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
  const threeMonthsInMs = 3 * 30 * 24 * 60 * 60 * 1000; 
  const expiresDate = new Date(Date.now() + threeMonthsInMs).toUTCString(); 
  const setCookieHeader = [
    `accessToken=${accessToken}; Path=/; HttpOnly; SameSite=Lax; Secure; Expires=${expiresDate}`,
    `user=${user}; Path=/; SameSite=Lax; Secure; Expires=${expiresDate}`,
  ].join(", ");

  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "Set-Cookie": setCookieHeader,
      "Content-Type": "application/json",
    },
  });
}