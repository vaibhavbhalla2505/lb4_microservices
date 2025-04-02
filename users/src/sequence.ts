import {
    AuthenticateFn,
    AuthenticationBindings,
  } from 'loopback4-authentication';
  import {
    SequenceHandler,
    FindRoute,
    InvokeMethod,
    ParseParams,
    Reject,
    RequestContext,
    Send,
    SequenceActions,
  } from '@loopback/rest';
  import { inject } from '@loopback/context';
  import { User } from './models';
  export class MySequence implements SequenceHandler {
    constructor(
      @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
      @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
      @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
      @inject(SequenceActions.SEND) public send: Send,
      @inject(SequenceActions.REJECT) public reject: Reject,
      @inject(AuthenticationBindings.USER_AUTH_ACTION)
      protected authenticateRequest: AuthenticateFn<User>,
    ) {}
  
    async handle(context: RequestContext) {
      try {
        const {request, response} = context;
        const route = this.findRoute(request);
        const args = await this.parseParams(request, route);
  
        // Perform authentication
        const authUser: User = await this.authenticateRequest(request);
        request.body = {...request.body, authUser};
  
        const result = await this.invoke(route, args);
        this.send(response, result);
      } catch (err) {
        this.reject(context, err);
      }
    }
  }
  