async function main() {
  const response = await fetch("http://localhost:3004/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "SMTP Test",
      email: "saathvikk202@gmail.com",
      message: "This is a local SMTP verification from the Saathvik Visuals portfolio contact form."
    })
  });

  const body = await response.text();
  console.log(response.status);
  console.log(body);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
