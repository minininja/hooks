import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { Controller, ControllerType, FastifyInstanceToken, GET, Hook, Inject, POST } from 'fastify-decorators';
import { IncomingMessage, ServerResponse } from 'http';
// import { MessageService } from '../services/message.service';

@Controller({
    route: '/', // base path
    type: ControllerType.SINGLETON
})
class RootController {

    @Inject(FastifyInstanceToken)
    private instance!: FastifyInstance;

    // constructor(private messageService: MessageService) {
    // }

    // Creates controller's GET handler which will return message, actually parameters are not required but kept for simplicity
    @GET({url: '/'})
    public async returnLastInputValue(req: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) {

        return { message: 'test' };
    }


    // Creates controller's hook (Fastify Hooks)
    @Hook('onSend')
    public async changeXPoweredBy(req: FastifyRequest<IncomingMessage>,reply: FastifyReply<ServerResponse>) {

        reply.header('X-Powered-By', 'Apache');
    }
}

export = RootController;