import { Service } from 'fastify-decorators';
import {execSync} from "child_process";

@Service()
export class KubecltService {

    public exec(cmd: string) {
        return JSON.parse(execSync('kubectl -o json ' + cmd).toString());
    }

}