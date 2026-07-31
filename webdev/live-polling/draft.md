```
const ApiResponse = {
  ok: (statusCode, msg) => ({
    success: true,
    statusCode: 200,
    msg: "DATA FETCH SUCCESS!",
    data,
  }),

  created: (statusCode, msg) => ({
    success: true,
    statusCode: 201,
    msg: "USER CREATED",
    data,
  }),
  Acccepted: (statusCode, msg) => ({
    success: true,
    statusCode: 202,
    msg: "REQUEST ACCEPTED",
    data,
  }),
```
