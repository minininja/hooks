
import { Service } from 'fastify-decorators';
import {execSync} from "child_process";
import {KubecltService} from "./kubectl.service";

@Service()
export class PodService extends KubecltService {

    public async list(namespace: string) {
        return this.exec('get pods -n ' + namespace);
    }
}