import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { Controller, ControllerType, FastifyInstanceToken, GET, Hook, Inject, POST } from 'fastify-decorators';
import { IncomingMessage, ServerResponse } from 'http';
import {PiService} from "../services/pi.service";

@Controller({
    route: '/pi', // base path
    type: ControllerType.SINGLETON
})
class PiController {

    @Inject(FastifyInstanceToken)
    private instance!: FastifyInstance;

    constructor(private piService: PiService) {
    }

    // Creates controller's GET handler which will return message, actually parameters are not required but kept for simplicity
    @GET({url: '/:digits'})
    public async returnLastInputValue(req: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) {

        return this.piService.getPiValue('default', req.params.digits);
    }

    // Creates controller's hook (Fastify Hooks)
    @Hook('onSend')
    public async changeXPoweredBy(req: FastifyRequest<IncomingMessage>,reply: FastifyReply<ServerResponse>) {

        reply.header('X-Powered-By', 'Apache');
    }
}

export = PiController;