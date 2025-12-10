import { pe } from '@shared/utils';
import concurrently from 'concurrently';
const { result } = concurrently([
    // {
    //   command:
    //     'docker stop $(docker ps -a -q) || true && docker rm $(docker ps -a -q) || true && docker compose -f ./dev/docker-compose.yml up -d',
    //   name: 'dev:docker',
    // },
    {
        command: 'docker compose -f ./dev/docker-compose.yml up -d',
        name: 'dev:docker:up',
    },
    {
        command: 'bun run --hot ./src/index.ts',
        name: 'backend:api',
    },
], {
    hide: ['dev:docker:up'],
});
result.catch((error) => {
    console.error(pe.render(error));
});
