import * as endpoints from '../src/service';

function Service(fns) {
  return {
    async fetch(
      request: Request,
      env,
      ctx: ExecutionContext
    ): Promise<Response> {
      const url = new URL(request.url);
      const endpoint = url.pathname.split('/')[1];

      return new Response(
        JSON.stringify({
          data: await fns[endpoint](...(await request.json()))
        })
      );
    },
    ...fns
  };
}
export default Service({
  ...endpoints
});
