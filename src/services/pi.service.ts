import { Service } from 'fastify-decorators';
import {KubecltService} from "./kubectl.service";
import {execSync} from "child_process";
const tmp = require('tmp');
const fs = require('fs');
const JSONbig = require('json-bigint');

@Service()
export class PiService extends KubecltService {

    public createPiJob(namespace: string, digits: bigint) {

        const tmpFile = tmp.fileSync({ prefix: 'pi-', postfix: '.yaml'});
        fs.writeFileSync(tmpFile.name,
            `apiVersion: batch/v1\n` +
            `kind: Job\n` +
            `metadata:\n` +
            `  name: pi-${digits}\n` +
            `spec:\n` +
            `#  parallelism: 1\n` +
            `  completions: 1\n` +
            `  activeDeadlineSeconds: 1800\n` +
            `  backoffLimit: 6\n` +
            `  template:\n` +
            `    metadata:\n` +
            `      name: pi\n` +
            `    spec:\n` +
            `      containers:\n` +
            `        - name: pi\n` +
            `          image: perl\n` +
            `          command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(${digits})"]\n` +
            `      restartPolicy: OnFailure`
        );

        return this.exec(`apply -f ${tmpFile.name} -n ${namespace}`);
    }

    public findPiJob(namespace: string, digits: bigint) {

        return this.exec(`get job pi-${digits} -n ${namespace}`);
    }

    public piOutput(namespace: string, digits: bigint) {
        const buffer = execSync(
            `kubectl logs \`kubectl get pods --selector=job-name=pi-${digits} -n ${namespace} --output=jsonpath='{.items[0].metadata.name}'\``
        );
        const str = buffer.toString();
        return JSONbig.parse(str);
    }

    public getPiValue(namespace: string, digits: bigint) {
        // find the existing job
        let exists;
        try {
            exists = this.findPiJob(namespace, digits);
        }
        catch(err) {
            exists = null;
        }

        // if there isn't one then start one
        if (!exists) {
            this.createPiJob(namespace, digits);
            return {
                job: {
                    status: 'starting'
                }
            };
        }
        else {
            // if it's there but not done
            if (exists.status.active > 0) {
                return {
                    job: {
                        status: 'running'
                    }
                };
            } else {
                // it's done, grab the results
                return {
                    job: {
                        status: 'completed',
                        result: this.piOutput(namespace, digits)
                    }
                }
            }
        }
        return exists;
    }


}
