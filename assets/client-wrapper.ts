import defaultHandler from '../src/index';

function Consumer<T>(service): T {
  return new Proxy(
    {},
    {
      get(_, endpoint) {
        return async function (...params) {
          const response = await service.fetch(
            new Request(`https://localhost/${endpoint}`, {
              method: 'POST',
              body: JSON.stringify(params)
            })
          );
          return (await response.json()).data;
        };
      }
    }
  ) as T;
}

export default {
  ...defaultHandler,
  async fetch(...params): Promise<Response> {
    const bindings = BINDING_LIST;
    bindings.forEach((name) => {
      params[1][name] = Consumer(params[1][name]);
    });
    return defaultHandler.fetch(...params);
  }
};
