import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { Controller, ControllerType, FastifyInstanceToken, GET, Hook, Inject, POST } from 'fastify-decorators';
import { IncomingMessage, ServerResponse } from 'http';
import { PodService } from '../services/pod.service';

@Controller({
    route: '/pods', // base path
    type: ControllerType.SINGLETON
})
class PodsController {

    @Inject(FastifyInstanceToken)
    private instance!: FastifyInstance;

    constructor(private podService: PodService) {
    }

    // Creates controller's GET handler which will return message, actually parameters are not required but kept for simplicity
    @GET({url: '/:namespace'})
    public async returnLastInputValue(req: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) {

        return await this.podService.list(req.params.namespace);
    }


    // Creates controller's hook (Fastify Hooks)
    @Hook('onSend')
    public async changeXPoweredBy(req: FastifyRequest<IncomingMessage>,reply: FastifyReply<ServerResponse>) {

        reply.header('X-Powered-By', 'Apache');
    }
}

export = PodsController;