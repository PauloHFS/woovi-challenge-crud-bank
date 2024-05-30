import {
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  sendResult,
  shouldRenderGraphiQL,
} from 'graphql-helix';
import koa from 'koa';
import bodyparser from 'koa-bodyparser';
import mongoose from 'mongoose';
import { application } from './graphql';

let mongoClient: typeof mongoose;

mongoose
  .connect(`${process.env.MONGODB_URI}`)
  .then(conn => {
    console.log('MongoDB - Connected');
    mongoClient = conn;
  })
  .catch(reason => console.log("MongoDB - Can't connect\n" + reason));

const app = new koa();

app.use(bodyparser());

app.use(async ctx => {
  const request = {
    body: ctx.request.body,
    headers: ctx.req.headers,
    method: ctx.request.method,
    query: ctx.request.query,
  };

  if (shouldRenderGraphiQL(request)) {
    ctx.body = renderGraphiQL({});
  } else {
    const { operationName, query, variables } = getGraphQLParameters(request);

    const result = await processRequest({
      operationName,
      query,
      variables,
      request,
      schema: application.schema,
      execute: application.createExecution(),
      subscribe: application.createSubscription(),
    });

    ctx.respond = false;
    sendResult(result, ctx.res);
  }
});

const server = app.listen(process.env.PORT, () => {
  console.log('Server is running at http://localhost:' + process.env.PORT);
});

process.on('SIGTERM', () => {
  console.log('Turning server down...');
  mongoClient?.connection
    .close()
    .then(() => console.log('MongoDB - Connection Closed'))
    .catch(reason =>
      console.log('MongoDB - Connection Closed with error\n' + reason)
    );
  server.close(err => {
    if (err) {
      console.log('server close with error!\n' + err);
    }
    console.log('server down!');
  });
});

// run().catch(err => console.log(err));

// async function run() {
//   // 4. Connect to MongoDB
//   await connect('mongodb://127.0.0.1:27017/test');

//   const user = new User({
//     name: 'Bill',
//     email: 'bill@initech.com',
//     avatar: 'https://i.imgur.com/dM7Thhn.png',
//   });
//   await user.save();

//   console.log(user.email); // 'bill@initech.com'
// }
