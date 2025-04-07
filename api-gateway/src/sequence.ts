import {
    AuthenticateFn,
    AuthenticationBindings,
  } from 'loopback4-authentication';
  import { AuthorizationBindings,AuthorizeFn,AuthorizeErrorKeys} from 'loopback4-authorization';
  import {
    SequenceHandler,
    FindRoute,
    InvokeMethod,
    ParseParams,
    Reject,
    RequestContext,
    Send,
    SequenceActions,
    HttpErrors
  } from '@loopback/rest';
  import { inject} from '@loopback/context';
  import { UserSignUp } from './interfaces/interface';
  export class MySequence implements SequenceHandler {
    constructor(
      @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
      @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
      @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
      @inject(SequenceActions.SEND) public send: Send,
      @inject(SequenceActions.REJECT) public reject: Reject,
      @inject(AuthenticationBindings.USER_AUTH_ACTION)
      protected authenticateRequest: AuthenticateFn<any>,
      @inject(AuthorizationBindings.AUTHORIZE_ACTION)
      protected checkAuthorization: AuthorizeFn,
    ) {}
  
    async handle(context: RequestContext) {
      try {
        const {request, response} = context;
        const route = this.findRoute(request);

        // Perform authentication
        const authUser: any = await this.authenticateRequest(request);
        (request as any).user = authUser;
        if(authUser){
            const isAccessAllowed: boolean = await this.checkAuthorization(
              authUser?.permissions || [],
              request,
            );
            if (!isAccessAllowed) {
              throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
            }
        }
       
        const args = await this.parseParams(request, route);
        const result = await this.invoke(route, args);
        this.send(response, result);
      } catch (err) {
        this.reject(context, err);
      }
    }
  }
  