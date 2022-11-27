import fetchMock from "fetch-mock";
fetchMock.get(
  "http://localhost:3000/",
  [
    {
      nome: "Alan",
      salario: 1805,
      alimentacao: 240,
      inss: 0.09,
    },
    {
      nome: "Thales",
      salario: 1300,
      alimentacao: 240,
      inss: 0.09,
    },
    // {
    //   nome: "Winer",
    //   salario: 1212,
    //   alimentacao: 200,
    //   inss: 0.09,
    // },
  ],
  {
    delay: 1000, // fake a slow network
    headers: {
      user: "me", // only match requests with certain headers
    },
  }
);
